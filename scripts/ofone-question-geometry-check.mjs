#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import {
  buildQuestionLandscape,
  evaluateConvergence,
  validateQuestionGeometry
} from "../lib/question-geometry.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const schemaPath = path.join(root, "schemas", "ofone.question-geometry.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
const validateSchema = ajv.compile(schema);

const files = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));
const jsonOutput = process.argv.includes("--json");
if (files.length === 0) {
  console.error("Usage: node scripts/ofone-question-geometry-check.mjs [--json] <state.json> [...]");
  process.exit(64);
}

let failed = false;
const reports = [];
for (const file of files) {
  const absolute = path.resolve(file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(absolute, "utf8"));
  } catch (error) {
    failed = true;
    reports.push({ file, passed: false, parse_error: error.message });
    continue;
  }

  const schemaPassed = validateSchema(data);
  const schemaErrors = (validateSchema.errors || []).map((error) => ({
    instance_path: error.instancePath,
    schema_path: error.schemaPath,
    keyword: error.keyword,
    message: error.message,
    params: error.params
  }));
  const semantic = validateQuestionGeometry(data);
  const report = {
    file,
    passed: Boolean(schemaPassed && semantic.passed),
    schema: { passed: Boolean(schemaPassed), errors: schemaErrors },
    semantic,
    loop_state: {
      status: data.status,
      iteration: data.iteration,
      release_allowed: false,
      blockers: [],
      required_next_question: null,
      maximum_net_question_value: null,
      pareto_frontier: [],
      local_maxima: [],
      local_minima: []
    }
  };

  if (report.passed) {
    try {
      const convergence = evaluateConvergence(data);
      const landscape = buildQuestionLandscape(data);
      report.loop_state = {
        status: data.status,
        iteration: data.iteration,
        release_allowed: convergence.release_allowed,
        blockers: convergence.blockers,
        required_next_question: landscape.selected_question_id,
        maximum_net_question_value: landscape.maximum_net_question_value,
        pareto_frontier: landscape.pareto_frontier,
        local_maxima: landscape.local_maxima,
        local_minima: landscape.local_minima,
        history_head_hash: data.history_integrity?.head_hash || null
      };
    } catch (error) {
      report.passed = false;
      report.runtime_error = error.message;
    }
  } else {
    report.loop_state.blockers = [
      ...schemaErrors.map((error) => ({ code: "QG_JSON_SCHEMA", detail: `${error.instance_path || "/"}: ${error.message}` })),
      ...semantic.findings
        .filter((finding) => finding.severity === "error")
        .map((finding) => ({ code: finding.code, detail: finding.object_id || finding.message }))
    ];
  }

  if (!report.passed) failed = true;
  reports.push(report);
}

if (jsonOutput || reports.length > 1) {
  process.stdout.write(`${JSON.stringify(reports, null, 2)}\n`);
} else {
  process.stdout.write(`${JSON.stringify(reports[0], null, 2)}\n`);
}
process.exit(failed ? 1 : 0);
