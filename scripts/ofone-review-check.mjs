#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const files = args.filter((arg) => arg !== "--json");

if (files.length === 0) {
  console.error("Usage: node scripts/ofone-review-check.mjs [--json] <review-sidecar.json> [...]");
  process.exit(2);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const schemaPath = path.join(repoRoot, "schemas", "ofone.review.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

const results = [];
let hasError = false;

for (const file of files) {
  const filePath = path.resolve(repoRoot, file);
  const diagnostics = [];
  let data = null;

  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_PARSE", `could not parse ${file}: ${error.message}`));
  }

  if (data) {
    if (!validate(data)) {
      for (const error of validate.errors || []) {
        diagnostics.push(errorDiagnostic(
          "OFONE_REVIEW_SCHEMA",
          `${error.instancePath || "/"} ${error.message || "failed schema validation"}`
        ));
      }
    } else {
      diagnostics.push(infoDiagnostic("OFONE_REVIEW_SCHEMA", "review sidecar matches schema"));
      runSemanticChecks(data, diagnostics);
    }
  }

  if (diagnostics.some((diagnostic) => diagnostic.severity === "error")) hasError = true;
  results.push({ file, diagnostics });
}

if (jsonOutput) {
  process.stdout.write(`${JSON.stringify({ passed: !hasError, results }, null, 2)}\n`);
} else {
  for (const result of results) {
    console.log(`\n${result.file}`);
    for (const diagnostic of result.diagnostics) {
      console.log(`${diagnostic.severity.toUpperCase()} ${diagnostic.code}: ${diagnostic.message}`);
    }
  }
}

process.exit(hasError ? 1 : 0);

function runSemanticChecks(data, diagnostics) {
  const policy = data.source_policy;
  const execution = data.execution_policy;
  const gate = data.convergence_gate;
  const blockers = data.release_blockers.length;
  const uninspected = Object.entries(data.inspected_surfaces)
    .filter(([, surface]) => !surface.inspected)
    .map(([key]) => key);

  if (!policy.treat_source_as_untrusted) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_SOURCE_BOUNDARY", "source material must be treated as untrusted"));
  }
  if (!policy.no_follow_discovered_links) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_SOURCE_BOUNDARY", "review must not follow links discovered inside source text"));
  }
  if (!policy.sanitize_markup) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_SOURCE_BOUNDARY", "review must sanitize or fence source markup before using it as context"));
  }

  if (execution.execute_repo_code || execution.mutate_files) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_EXECUTION", "external review must not execute repo code or mutate files"));
  }
  if (execution.validator_write_policy === "maintainer_local_only" && data.final_decision !== "implement_protocol_hardening") {
    diagnostics.push(warnDiagnostic("OFONE_REVIEW_EXECUTION", "maintainer-only writes should stay outside external review execution"));
  }

  if (uninspected.length > 0 && data.final_decision === "stop_architecture_iteration") {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_INSPECTION", `cannot stop architecture iteration with uninspected required surfaces: ${uninspected.join(", ")}`));
  }

  if (gate.round > gate.max_rounds && gate.recommended_next_mode === "architecture_iteration") {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_CONVERGENCE", "architecture iteration exceeded max_rounds without switching modes"));
  }
  if (gate.release_blockers !== blockers) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_CONVERGENCE", "convergence_gate.release_blockers must match release_blockers length"));
  }
  if (gate.release_blockers === 0 && gate.benchmark_handoff_ready && gate.recommended_next_mode === "architecture_iteration") {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_CONVERGENCE", "zero blockers plus benchmark handoff readiness must not recommend architecture_iteration"));
  }
  if (gate.recommended_next_mode === "stop" && gate.release_blockers > 0) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_CONVERGENCE", "stop mode cannot carry release blockers"));
  }
  if (data.final_decision === "benchmark" && !data.benchmark_handoff.ready_after_current_batch) {
    diagnostics.push(errorDiagnostic("OFONE_REVIEW_BENCHMARK_HANDOFF", "benchmark final decision requires benchmark_handoff.ready_after_current_batch=true"));
  }

  diagnostics.push(infoDiagnostic("OFONE_REVIEW_SEMANTIC", "review sidecar semantic checks completed"));
}

function infoDiagnostic(code, message) {
  return { severity: "info", code, message };
}

function warnDiagnostic(code, message) {
  return { severity: "warning", code, message };
}

function errorDiagnostic(code, message) {
  return { severity: "error", code, message };
}
