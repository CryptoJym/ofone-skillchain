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
const validBatchStatuses = new Set(["not_started", "in_progress", "completed", "reviewed", "released", "accepted", "superseded"]);

const diagnostics = [];
const fail = (code, message) => diagnostics.push({ severity: "error", code, message });
const warn = (code, message) => diagnostics.push({ severity: "warning", code, message });
const pass = (code, message) => diagnostics.push({ severity: "info", code, message });

checkRequiredSet("BENCH_ARM", requiredArms, suite.arms?.map((arm) => arm.arm_id), "benchmark arms");
checkRequiredSet("BENCH_FAMILY", requiredFamilies, suite.task_families, "task families");
checkRequiredSet("BENCH_METRIC", requiredMetrics, suite.metrics?.map((metric) => metric.metric_id), "metrics");

const caseFamilies = new Set();
for (const item of suite.cases || []) {
  validateCase(item, caseFamilies);
}
checkRequiredSet("BENCH_CASE_FAMILY_COVERAGE", requiredFamilies, [...caseFamilies], "case family coverage");
validateBenchmarkBatches();
checkSuperiorityReadiness();

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");

if (jsonOutput) {
  console.log(JSON.stringify({ passed, suite_id: suite.suite_id, superiority_ready: superiorityReady(), diagnostics }, null, 2));
} else {
  console.log(`${passed ? "PASS" : "FAIL"} ${suite.suite_id}`);
  for (const diagnostic of diagnostics) {
    const prefix = diagnostic.severity === "error" ? "ERROR" : diagnostic.severity === "warning" ? "WARN" : "OK";
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
  if ((item.arms || []).includes("full_ofone")) {
    checkFile("BENCH_CASE_ARTIFACT", item.ofone_artifact, `${item.case_id} OfOne artifact`);
  }
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

function validateBenchmarkBatches() {
  const batches = suite.benchmark_batches || [];
  if (batches.length === 0) {
    fail("BENCH_BATCH_DECLARED", "suite must declare at least one benchmark batch before execution");
    return;
  }

  const caseIds = new Set((suite.cases || []).map((item) => item.case_id));
  const armOutputs = new Map((suite.arms || []).map((arm) => [arm.arm_id, arm.required_outputs || []]));
  pass("BENCH_BATCH_DECLARED", `${batches.length} benchmark batch manifest(s) declared`);

  for (const batch of batches) validateBatchReference(batch, caseIds, armOutputs);
}

function validateBatchReference(batch, caseIds, armOutputs) {
  if (!batch.batch_id) fail("BENCH_BATCH_ID", "benchmark batch reference missing batch_id");
  if (!batch.status) fail("BENCH_BATCH_STATUS", `${batch.batch_id || "(unknown batch)"} missing status`);
  if (batch.status && !validBatchStatuses.has(batch.status)) {
    fail("BENCH_BATCH_STATUS", `${batch.batch_id} has invalid status ${batch.status}`);
  }

  const manifestPath = batch.manifest;
  checkFile("BENCH_BATCH_MANIFEST", manifestPath, `${batch.batch_id || "(unknown batch)"} manifest`);
  if (!manifestPath || !fs.existsSync(path.join(repoRoot, manifestPath))) return;

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, manifestPath), "utf8"));
  } catch (error) {
    fail("BENCH_BATCH_MANIFEST_JSON", `${manifestPath} is not valid JSON: ${error.message}`);
    return;
  }

  if (manifest.batch_id !== batch.batch_id) {
    fail("BENCH_BATCH_ID_MATCH", `${manifestPath} batch_id ${manifest.batch_id || "(missing)"} does not match suite reference ${batch.batch_id}`);
  } else {
    pass("BENCH_BATCH_ID_MATCH", `${batch.batch_id} manifest ID matches suite reference`);
  }

  if (manifest.suite_id !== suite.suite_id) {
    fail("BENCH_BATCH_SUITE_MATCH", `${batch.batch_id} suite_id ${manifest.suite_id || "(missing)"} does not match ${suite.suite_id}`);
  } else {
    pass("BENCH_BATCH_SUITE_MATCH", `${batch.batch_id} targets ${suite.suite_id}`);
  }

  if (manifest.status !== batch.status) {
    fail("BENCH_BATCH_STATUS_MATCH", `${batch.batch_id} manifest status ${manifest.status || "(missing)"} does not match suite reference ${batch.status}`);
  } else {
    pass("BENCH_BATCH_STATUS_MATCH", `${batch.batch_id} status is ${batch.status}`);
  }

  validateBatchCases(manifest, caseIds);
  validateBatchArms(manifest, armOutputs);
  validateBatchModelPlan(manifest);
  validateBatchReviewPlan(manifest);
  validateBatchResultsPlan(manifest);
  validateBatchReleaseGuard(manifest);
}

function validateBatchCases(manifest, caseIds) {
  if (!Array.isArray(manifest.case_ids) || manifest.case_ids.length === 0) {
    fail("BENCH_BATCH_CASES", `${manifest.batch_id} must list case_ids`);
    return;
  }

  for (const caseId of manifest.case_ids) {
    if (!caseIds.has(caseId)) {
      fail("BENCH_BATCH_CASE_REF", `${manifest.batch_id} references unknown case_id ${caseId}`);
    }
  }
  const unknownCount = manifest.case_ids.filter((caseId) => !caseIds.has(caseId)).length;
  if (unknownCount === 0) pass("BENCH_BATCH_CASE_REF", `${manifest.batch_id} references ${manifest.case_ids.length} known case(s)`);
}

function validateBatchArms(manifest, armOutputs) {
  const arms = manifest.arms || [];
  checkRequiredSet("BENCH_BATCH_ARMS", requiredArms, arms.map((arm) => arm.arm_id), `${manifest.batch_id} batch arms`);

  for (const arm of arms) {
    if (!requiredArms.includes(arm.arm_id)) {
      fail("BENCH_BATCH_ARM_ID", `${manifest.batch_id} declares unknown arm ${arm.arm_id || "(missing)"}`);
      continue;
    }
    checkFile("BENCH_BATCH_PROMPT", arm.prompt_file, `${manifest.batch_id} ${arm.arm_id} prompt`);
    checkRequiredSet(
      "BENCH_BATCH_ARM_OUTPUTS",
      armOutputs.get(arm.arm_id) || [],
      arm.required_outputs,
      `${manifest.batch_id} ${arm.arm_id} required outputs`
    );
  }
}

function validateBatchModelPlan(manifest) {
  const modelPlan = manifest.model_plan || {};
  const minimums = suite.minimums_before_superiority_claim || {};

  if (!Number.isInteger(modelPlan.runs_per_case_per_arm) || modelPlan.runs_per_case_per_arm < 1) {
    fail("BENCH_BATCH_RUNS_PER_ARM", `${manifest.batch_id} model_plan.runs_per_case_per_arm must be a positive integer`);
  } else {
    pass("BENCH_BATCH_RUNS_PER_ARM", `${manifest.batch_id} plans ${modelPlan.runs_per_case_per_arm} run(s) per case/arm`);
  }

  if (minimums.runs_per_case_per_arm && modelPlan.runs_per_case_per_arm < minimums.runs_per_case_per_arm) {
    warn("BENCH_BATCH_RUNS_PER_ARM", `${manifest.batch_id} plans fewer repeated runs than the superiority minimum`);
  }

  if (!Array.isArray(modelPlan.model_families) || modelPlan.model_families.length === 0) {
    fail("BENCH_BATCH_MODEL_FAMILIES", `${manifest.batch_id} model_plan.model_families must be non-empty`);
    return;
  }

  if (minimums.model_families && modelPlan.model_families.length < minimums.model_families) {
    warn("BENCH_BATCH_MODEL_FAMILIES", `${manifest.batch_id} has ${modelPlan.model_families.length}/${minimums.model_families} planned model families`);
  } else {
    pass("BENCH_BATCH_MODEL_FAMILIES", `${manifest.batch_id} plans ${modelPlan.model_families.length} model family/families`);
  }

  for (const family of modelPlan.model_families) {
    if (!family.family_id) fail("BENCH_BATCH_MODEL_FAMILY_ID", `${manifest.batch_id} model family missing family_id`);
    if (!family.target) fail("BENCH_BATCH_MODEL_TARGET", `${manifest.batch_id} model family ${family.family_id || "(unknown)"} missing target`);
    if (!family.status || !validBatchStatuses.has(family.status)) {
      fail("BENCH_BATCH_MODEL_STATUS", `${manifest.batch_id} model family ${family.family_id || "(unknown)"} has invalid status ${family.status || "(missing)"}`);
    }
  }
}

function validateBatchReviewPlan(manifest) {
  const reviewPlan = manifest.review_plan || {};
  checkFile("BENCH_BATCH_RUBRIC", reviewPlan.rubric, `${manifest.batch_id} review rubric`);
  checkFile("BENCH_BATCH_REVIEW_TEMPLATE", reviewPlan.review_template, `${manifest.batch_id} review template`);
  if (!reviewPlan.blinding) fail("BENCH_BATCH_BLINDING", `${manifest.batch_id} review_plan.blinding must describe blinding limitations`);
  if (!reviewPlan.adjudication_status || !validBatchStatuses.has(reviewPlan.adjudication_status)) {
    fail("BENCH_BATCH_ADJUDICATION_STATUS", `${manifest.batch_id} review_plan.adjudication_status has invalid status ${reviewPlan.adjudication_status || "(missing)"}`);
  }
}

function validateBatchResultsPlan(manifest) {
  const resultsPlan = manifest.results_plan || {};
  checkFile("BENCH_BATCH_RESULT_SUMMARY", resultsPlan.summary_file, `${manifest.batch_id} result summary placeholder`);
  checkFile("BENCH_BATCH_FAILURE_ANALYSIS", resultsPlan.failure_analysis_file, `${manifest.batch_id} failure-analysis placeholder`);
  if (!resultsPlan.raw_output_dir) {
    fail("BENCH_BATCH_RAW_OUTPUT_DIR", `${manifest.batch_id} results_plan.raw_output_dir missing path`);
  } else if (!fs.existsSync(path.join(repoRoot, resultsPlan.raw_output_dir))) {
    fail("BENCH_BATCH_RAW_OUTPUT_DIR", `${manifest.batch_id} raw output dir not found at ${resultsPlan.raw_output_dir}`);
  } else {
    pass("BENCH_BATCH_RAW_OUTPUT_DIR", `${manifest.batch_id} raw output dir exists at ${resultsPlan.raw_output_dir}`);
  }
  if (!resultsPlan.status || !validBatchStatuses.has(resultsPlan.status)) {
    fail("BENCH_BATCH_RESULTS_STATUS", `${manifest.batch_id} results_plan.status has invalid status ${resultsPlan.status || "(missing)"}`);
  }
}

function validateBatchReleaseGuard(manifest) {
  const releaseGuard = manifest.release_guard || {};
  if (releaseGuard.superiority_claims_allowed === true && !superiorityReady().ready) {
    fail("BENCH_BATCH_RELEASE_GUARD", `${manifest.batch_id} allows superiority claims before the suite is ready`);
    return;
  }
  if (releaseGuard.superiority_claims_allowed !== false && !superiorityReady().ready) {
    fail("BENCH_BATCH_RELEASE_GUARD", `${manifest.batch_id} must explicitly block superiority claims while the suite is not ready`);
    return;
  }
  if (!releaseGuard.reason) fail("BENCH_BATCH_RELEASE_GUARD", `${manifest.batch_id} release_guard.reason missing`);
  if (!releaseGuard.allowed_claim) fail("BENCH_BATCH_RELEASE_GUARD", `${manifest.batch_id} release_guard.allowed_claim missing`);
  pass("BENCH_BATCH_RELEASE_GUARD", `${manifest.batch_id} release guard blocks unsupported superiority claims`);
}

function checkSuperiorityReadiness() {
  const readiness = superiorityReady();
  if (readiness.ready) {
    pass("BENCH_SUPERIORITY_READY", "benchmark suite meets the declared minimums before superiority claims");
    return;
  }
  warn("BENCH_SUPERIORITY_READY", `not ready for superiority claims: ${readiness.reasons.join("; ")}`);
}

function superiorityReady() {
  const minimums = suite.minimums_before_superiority_claim || {};
  const familyCounts = new Map();
  for (const family of requiredFamilies) familyCounts.set(family, 0);
  for (const item of suite.cases || []) {
    for (const family of item.families || []) {
      familyCounts.set(family, (familyCounts.get(family) || 0) + 1);
    }
  }

  const reasons = [];
  const casesPerFamily = minimums.cases_per_family || 0;
  for (const family of requiredFamilies) {
    const count = familyCounts.get(family) || 0;
    if (count < casesPerFamily) reasons.push(`${family} has ${count}/${casesPerFamily} cases`);
  }
  if ((suite.cases || []).length < (minimums.total_cases || 0)) {
    reasons.push(`total cases ${(suite.cases || []).length}/${minimums.total_cases}`);
  }
  if (!suite.results_release || suite.results_release === "not_started") {
    reasons.push("no released benchmark results");
  }
  if (minimums.publish_failure_analysis && !suite.failure_analysis) {
    reasons.push("failure analysis not published");
  }

  return { ready: reasons.length === 0, reasons };
}
