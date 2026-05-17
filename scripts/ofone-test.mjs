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
    const parsed = JSON.parse(stdout);
    return parsed.results?.flatMap((result) => result.diagnostics || []) || [];
  } catch {
    return [];
  }
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
