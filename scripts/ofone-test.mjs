#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const fixturesPath = path.join(repoRoot, "tests", "invalid", "fixtures.json");
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"));
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ofone-invalid-"));
let failures = 0;

try {
  runValidExamples();
  runRenderSmokeTests();
  runPatchWorkflowTests();
  runBenchmarkCheck();
  for (const fixture of fixtures) runInvalidFixture(fixture);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n${failures} validator regression test(s) failed`);
  process.exit(1);
}

console.log("\nAll validator regression tests passed");

function runValidExamples() {
  const examples = fs.readdirSync(path.join(repoRoot, "examples"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join("examples", file));
  const result = spawnSync(process.execPath, ["scripts/ofone-validate.mjs", ...examples], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    failures += 1;
    console.error("FAIL valid examples should pass");
    console.error(result.stdout);
    console.error(result.stderr);
    return;
  }
  console.log("PASS valid examples");
}

function runRenderSmokeTests() {
  const checks = [
    {
      name: "executive decision brief",
      args: ["scripts/ofone-render.mjs", "examples/strategy-micro.json", "Executive"],
      includes: ["# OfOne Executive Decision Brief", "## Decision", "## What Would Change This"]
    },
    {
      name: "analyst semantic graph grouping",
      args: ["scripts/ofone-render.mjs", "examples/strategy-micro.json", "Analyst"],
      includes: ["# OfOne Analyst Map", "causal edges", "argumentative edges"]
    },
    {
      name: "audit report",
      args: ["scripts/ofone-render.mjs", "examples/hybrid-policy-audit.json", "Audit"],
      includes: ["# OfOne Audit Report", "## Audit Evidence Identity", "## Review Log"]
    },
    {
      name: "patch impact view",
      args: ["scripts/ofone-render.mjs", "examples/strategy-micro.json", "PatchImpact", "X1"],
      includes: ["# OfOne Patch Impact View", "## Affected Semantic Layers", "argumentative"]
    }
  ];

  for (const check of checks) {
    const result = spawnSync(process.execPath, check.args, {
      cwd: repoRoot,
      encoding: "utf8"
    });
    const output = `${result.stdout}\n${result.stderr}`;
    const passed = result.status === 0 && check.includes.every((needle) => output.includes(needle));
    if (passed) {
      console.log(`PASS render ${check.name}`);
      continue;
    }
    failures += 1;
    console.error(`FAIL render ${check.name}`);
    console.error(`expected output containing: ${check.includes.join(", ")}`);
    console.error(output);
  }
}

function runPatchWorkflowTests() {
  const checks = [
    {
      name: "evidence supersession",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "supersede_evidence", "E1"],
      expect: [
        ["operation.operation_id", "supersede_evidence"],
        ["rendering_regeneration_required", true],
        ["invalidated_claims", "C1"],
        ["affected_semantic_layers", "evidential"]
      ]
    },
    {
      name: "criterion invalidation",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "invalidate_criterion", "CR1"],
      expect: [
        ["operation.operation_id", "invalidate_criterion"],
        ["required_revalidation", "decision_surface_check"],
        ["rendering_regeneration_required", true]
      ]
    },
    {
      name: "actor reassignment",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "actor_reassignment", "A1"],
      expect: [
        ["operation.operation_id", "actor_reassignment"],
        ["suggested_transition", "human_review"],
        ["required_approvals.0.gate_id", "G1"]
      ]
    },
    {
      name: "trigger activation",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "trigger_activation", "T1"],
      expect: [
        ["operation.operation_id", "trigger_activation"],
        ["required_revalidation", "trigger_transition_check"],
        ["rendering_regeneration_required", true]
      ]
    },
    {
      name: "trigger deactivation",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "trigger_deactivation", "T1"],
      expect: [
        ["operation.operation_id", "trigger_deactivation"],
        ["semantic_patch_operations.0.op", "trigger_deactivation"],
        ["rendering_regeneration_required", true]
      ]
    }
  ];

  for (const check of checks) {
    const result = spawnSync(process.execPath, check.args, {
      cwd: repoRoot,
      encoding: "utf8"
    });
    const output = `${result.stdout}\n${result.stderr}`;
    const parsed = parseJson(result.stdout);
    const passed = result.status === 0 && check.expect.every(([path, expected]) => valueMatches(getPath(parsed, path), expected));
    if (passed) {
      console.log(`PASS patch ${check.name}`);
      continue;
    }
    failures += 1;
    console.error(`FAIL patch ${check.name}`);
    console.error(`expected JSON paths: ${check.expect.map(([path, expected]) => `${path}=${expected}`).join(", ")}`);
    console.error(output);
  }
}

function runBenchmarkCheck() {
  const result = spawnSync(process.execPath, ["scripts/ofone-benchmark.mjs"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status === 0) {
    console.log("PASS benchmark suite manifest");
    return;
  }
  failures += 1;
  console.error("FAIL benchmark suite manifest");
  console.error(result.stdout);
  console.error(result.stderr);
}

function runInvalidFixture(fixture) {
  const sourcePath = path.join(repoRoot, fixture.base);
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

  for (const mutation of fixture.mutations) applyMutation(data, mutation);

  const outputPath = path.join(tempDir, `${fixture.name}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);

  const result = spawnSync(process.execPath, ["scripts/ofone-validate.mjs", "--json", outputPath], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const output = `${result.stdout}\n${result.stderr}`;
  const diagnostics = parseDiagnostics(result.stdout);
  const codes = new Set(diagnostics.map((diagnostic) => diagnostic.code));
  const expected = fixture.expect.every((code) => codes.has(code));

  if (result.status !== 0 && expected) {
    console.log(`PASS invalid ${fixture.name}`);
    return;
  }

  failures += 1;
  console.error(`FAIL invalid ${fixture.name}`);
  console.error(`expected non-zero exit and diagnostic codes: ${fixture.expect.join(", ")}`);
  console.error(`actual diagnostic codes: ${[...codes].join(", ") || "(none)"}`);
  console.error(output);
}

function parseDiagnostics(stdout) {
  try {
    const parsed = parseJson(stdout);
    return parsed.results?.flatMap((result) => result.diagnostics || []) || [];
  } catch {
    return [];
  }
}

function parseJson(stdout) {
  return JSON.parse(stdout);
}

function getPath(object, pathExpression) {
  return pathExpression.split(".").reduce((current, key) => {
    if (current === undefined || current === null) return undefined;
    return current[key];
  }, object);
}

function valueMatches(actual, expected) {
  if (Array.isArray(actual)) return actual.includes(expected);
  return actual === expected;
}

function applyMutation(data, mutation) {
  const parent = mutation.path.slice(0, -1).reduce((current, key) => current[key], data);
  const key = mutation.path[mutation.path.length - 1];

  if (mutation.op === "set") {
    parent[key] = mutation.value;
    return;
  }

  if (mutation.op === "delete") {
    delete parent[key];
    return;
  }

  throw new Error(`Unsupported mutation op ${mutation.op}`);
}
