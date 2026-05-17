#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const suitePath = path.join(repoRoot, "benchmarks", "suite.json");
const suite = JSON.parse(fs.readFileSync(suitePath, "utf8"));

const requiredArms = ["direct_answer", "light_structured", "full_ofone"];
const requiredFamilies = ["strategic", "scientific", "formal", "normative", "hybrid", "update_patch"];
const requiredMetrics = [
  "decision_quality",
  "evidence_grounding_precision",
  "uncertainty_calibration",
  "trace_completeness",
  "auditability",
  "update_quality",
  "cost",
  "inter_run_stability"
];

const diagnostics = [];
const fail = (code, message) => diagnostics.push({ severity: "error", code, message });
const pass = (code, message) => diagnostics.push({ severity: "info", code, message });

checkRequiredSet("BENCH_ARM", requiredArms, suite.arms?.map((arm) => arm.arm_id), "benchmark arms");
checkRequiredSet("BENCH_FAMILY", requiredFamilies, suite.task_families, "task families");
checkRequiredSet("BENCH_METRIC", requiredMetrics, suite.metrics?.map((metric) => metric.metric_id), "metrics");

const caseFamilies = new Set();
for (const item of suite.cases || []) {
  validateCase(item, caseFamilies);
}
checkRequiredSet("BENCH_CASE_FAMILY_COVERAGE", requiredFamilies, [...caseFamilies], "case family coverage");

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");

if (jsonOutput) {
  console.log(JSON.stringify({ passed, suite_id: suite.suite_id, diagnostics }, null, 2));
} else {
  console.log(`${passed ? "PASS" : "FAIL"} ${suite.suite_id}`);
  for (const diagnostic of diagnostics) {
    const prefix = diagnostic.severity === "error" ? "ERROR" : "OK";
    console.log(`- ${prefix} ${diagnostic.code}: ${diagnostic.message}`);
  }
}

process.exit(passed ? 0 : 1);

function validateCase(item, caseFamilies) {
  if (!item.case_id) fail("BENCH_CASE_ID", "case missing case_id");
  if (!item.title) fail("BENCH_CASE_TITLE", `${item.case_id || "(unknown)"} missing title`);
  if (!Array.isArray(item.families) || item.families.length === 0) fail("BENCH_CASE_FAMILIES", `${item.case_id} missing families`);
  for (const family of item.families || []) caseFamilies.add(family);
  checkRequiredSet("BENCH_CASE_ARMS", requiredArms, item.arms, `${item.case_id} arms`);
  checkFile("BENCH_CASE_FILE", item.case_file, `${item.case_id} case_file`);
  checkFile("BENCH_CASE_RUBRIC", item.rubric, `${item.case_id} rubric`);
  if (item.ofone_artifact) checkFile("BENCH_CASE_ARTIFACT", item.ofone_artifact, `${item.case_id} OfOne artifact`);
}

function checkRequiredSet(code, required, actual, label) {
  const actualSet = new Set(actual || []);
  const missing = required.filter((item) => !actualSet.has(item));
  if (missing.length > 0) {
    fail(code, `${label} missing ${missing.join(", ")}`);
  } else {
    pass(code, `${label} cover ${required.join(", ")}`);
  }
}

function checkFile(code, filePath, label) {
  if (!filePath) {
    fail(code, `${label} missing path`);
    return;
  }
  if (!fs.existsSync(path.join(repoRoot, filePath))) {
    fail(code, `${label} not found at ${filePath}`);
    return;
  }
  pass(code, `${label} exists at ${filePath}`);
}
