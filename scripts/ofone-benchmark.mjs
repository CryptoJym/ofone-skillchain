#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";
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
const validRunMatrixStatuses = new Set(["queued", "in_progress", "completed", "reviewed", "excluded", "released", "superseded"]);
const validIndependentReviewStatuses = new Set(["not_prepared", "prepared", "launched", "harvested", "accepted", "integrated", "blocked"]);
const validComplianceValues = new Set(["pass", "fail", "not_applicable", "unknown"]);
const requiredPreScoreFields = ["case_fidelity", "required_outputs", "independence", "no_superiority_compliance"];
const requiredSemanticFidelityFields = [
  "case_binding",
  "copied_example_risk",
  "evidence_provenance_adequacy",
  "artifact_source_identity"
];

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
  validateBatchExecutionMatrix(manifest);
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

function validateBatchExecutionMatrix(manifest) {
  checkFile("BENCH_BATCH_MATRIX", manifest.execution_matrix_file, `${manifest.batch_id} execution matrix`);
  if (!manifest.execution_matrix_file || !fs.existsSync(path.join(repoRoot, manifest.execution_matrix_file))) return;

  let matrix;
  try {
    matrix = JSON.parse(fs.readFileSync(path.join(repoRoot, manifest.execution_matrix_file), "utf8"));
  } catch (error) {
    fail("BENCH_BATCH_MATRIX_JSON", `${manifest.execution_matrix_file} is not valid JSON: ${error.message}`);
    return;
  }

  if (matrix.batch_id !== manifest.batch_id) {
    fail("BENCH_BATCH_MATRIX_ID_MATCH", `${manifest.execution_matrix_file} batch_id ${matrix.batch_id || "(missing)"} does not match ${manifest.batch_id}`);
  } else {
    pass("BENCH_BATCH_MATRIX_ID_MATCH", `${manifest.batch_id} execution matrix matches batch ID`);
  }

  if (matrix.suite_id !== suite.suite_id) {
    fail("BENCH_BATCH_MATRIX_SUITE_MATCH", `${manifest.batch_id} execution matrix suite_id ${matrix.suite_id || "(missing)"} does not match ${suite.suite_id}`);
  } else {
    pass("BENCH_BATCH_MATRIX_SUITE_MATCH", `${manifest.batch_id} execution matrix targets ${suite.suite_id}`);
  }

  if (!matrix.status || !validRunMatrixStatuses.has(matrix.status)) {
    fail("BENCH_BATCH_MATRIX_STATUS", `${manifest.batch_id} execution matrix has invalid status ${matrix.status || "(missing)"}`);
  }

  const expectedCases = manifest.case_ids || [];
  const expectedArms = (manifest.arms || []).map((arm) => arm.arm_id);
  const expectedFamilies = (manifest.model_plan?.model_families || []).map((family) => family.family_id);
  const expectedRepeats = Array.from(
    { length: manifest.model_plan?.runs_per_case_per_arm || 0 },
    (_, index) => index + 1
  );
  const expectedRunCount = expectedCases.length * expectedArms.length * expectedFamilies.length * expectedRepeats.length;

  checkArrayExact("BENCH_BATCH_MATRIX_CASES", expectedCases, matrix.case_ids, `${manifest.batch_id} execution matrix cases`);
  checkArrayExact("BENCH_BATCH_MATRIX_ARMS", expectedArms, matrix.arms, `${manifest.batch_id} execution matrix arms`);
  checkArrayExact("BENCH_BATCH_MATRIX_MODEL_FAMILIES", expectedFamilies, matrix.model_families, `${manifest.batch_id} execution matrix model families`);
  checkArrayExact("BENCH_BATCH_MATRIX_REPEATS", expectedRepeats, matrix.repeats, `${manifest.batch_id} execution matrix repeats`);

  if (matrix.expected_run_count !== expectedRunCount) {
    fail("BENCH_BATCH_MATRIX_RUN_COUNT", `${manifest.batch_id} expected_run_count ${matrix.expected_run_count || "(missing)"} should be ${expectedRunCount}`);
  } else {
    pass("BENCH_BATCH_MATRIX_RUN_COUNT", `${manifest.batch_id} predeclares ${expectedRunCount} run slot(s)`);
  }

  const runIdTokens = ["{batch_id}", "{case_id}", "{arm_id}", "{model_family}", "{repeat}"];
  const runIdMissingTokens = runIdTokens.filter((token) => !matrix.run_id_template?.includes(token));
  if (runIdMissingTokens.length > 0) {
    fail("BENCH_BATCH_MATRIX_RUN_ID_TEMPLATE", `${manifest.batch_id} run_id_template missing ${runIdMissingTokens.join(", ")}`);
  } else {
    pass("BENCH_BATCH_MATRIX_RUN_ID_TEMPLATE", `${manifest.batch_id} run_id_template identifies batch, case, arm, model family, and repeat`);
  }

  for (const [code, field] of [
    ["BENCH_BATCH_MATRIX_OUTPUT_TEMPLATE", "raw_output_path_template"],
    ["BENCH_BATCH_MATRIX_REVIEW_TEMPLATE", "review_path_template"]
  ]) {
    if (!matrix[field] || !matrix[field].includes("{run_id}")) {
      fail(code, `${manifest.batch_id} ${field} must include {run_id}`);
    }
  }

  validateMatrixCompletion(manifest, matrix, expectedRunCount);

  validateRunRecords(manifest, matrix);

  if (!matrix.release_guard || matrix.release_guard.superiority_claims_allowed !== false) {
    fail("BENCH_BATCH_MATRIX_RELEASE_GUARD", `${manifest.batch_id} execution matrix must block superiority claims until results are reviewed`);
  } else {
    pass("BENCH_BATCH_MATRIX_RELEASE_GUARD", `${manifest.batch_id} execution matrix release guard blocks unsupported claims`);
  }
}

function validateRunRecords(manifest, matrix) {
  validateRunRecordState(manifest, matrix, "completed");
  validateRunRecordState(manifest, matrix, "reviewed");
  validateRunRecordState(manifest, matrix, "excluded");
}

function validateMatrixCompletion(manifest, matrix, expectedRunCount) {
  const completion = matrix.completion || {};
  const completedRuns = matrix.completed_runs || [];
  const reviewedRuns = matrix.reviewed_runs || [];
  const excludedRuns = matrix.excluded_runs || [];

  for (const [field, runs] of [
    ["completed", completedRuns],
    ["reviewed", reviewedRuns],
    ["excluded", excludedRuns]
  ]) {
    if (!Number.isInteger(completion[field])) {
      fail("BENCH_BATCH_MATRIX_COMPLETION", `${manifest.batch_id} completion.${field} must be an integer`);
    } else if (completion[field] !== runs.length) {
      fail("BENCH_BATCH_MATRIX_COMPLETION", `${manifest.batch_id} completion.${field}=${completion[field]} but ${field}_runs has ${runs.length}`);
    }
  }

  const terminalRunIds = new Set([
    ...completedRuns.map((run) => run.run_id),
    ...reviewedRuns.map((run) => run.run_id),
    ...excludedRuns.map((run) => run.run_id)
  ].filter(Boolean));
  const queued = Number.isInteger(completion.queued) ? completion.queued : 0;
  if (queued + terminalRunIds.size !== expectedRunCount) {
    fail("BENCH_BATCH_MATRIX_COMPLETION", `${manifest.batch_id} queued + unique terminal slots = ${queued + terminalRunIds.size}/${expectedRunCount}`);
  } else {
    pass("BENCH_BATCH_MATRIX_COMPLETION", `${manifest.batch_id} completion covers ${expectedRunCount} predeclared slot(s) without double-counting reviewed/excluded overlaps`);
  }

  const completedIds = new Set(completedRuns.map((run) => run.run_id));
  const reviewedMissingCompleted = reviewedRuns.map((run) => run.run_id).filter((runId) => !completedIds.has(runId));
  if (reviewedMissingCompleted.length > 0) {
    fail("BENCH_BATCH_MATRIX_REVIEW_IMPLIES_COMPLETED", `${manifest.batch_id} reviewed run(s) missing from completed_runs: ${reviewedMissingCompleted.join(", ")}`);
  } else {
    pass("BENCH_BATCH_MATRIX_REVIEW_IMPLIES_COMPLETED", `${manifest.batch_id} reviewed runs are also represented as completed raw outputs`);
  }

  const reviewedIds = new Set(reviewedRuns.map((run) => run.run_id));
  const excludedMissingReviewed = excludedRuns.map((run) => run.run_id).filter((runId) => !reviewedIds.has(runId));
  if (excludedMissingReviewed.length > 0) {
    fail("BENCH_BATCH_MATRIX_EXCLUDED_REVIEWED", `${manifest.batch_id} excluded run(s) missing from reviewed_runs: ${excludedMissingReviewed.join(", ")}`);
  } else if (excludedRuns.length > 0) {
    pass("BENCH_BATCH_MATRIX_EXCLUDED_REVIEWED", `${manifest.batch_id} excluded runs remain visible in reviewed_runs for audit history`);
  }

  if (!matrix.state_semantics || !String(matrix.state_semantics).includes("reviewed")) {
    fail("BENCH_BATCH_MATRIX_STATE_SEMANTICS", `${manifest.batch_id} must document whether reviewed/excluded counters overlap completed outputs`);
  } else {
    pass("BENCH_BATCH_MATRIX_STATE_SEMANTICS", `${manifest.batch_id} documents overlapping completion/review/exclusion semantics`);
  }
}

function validateRunRecordState(manifest, matrix, state) {
  const recordKey = `${state}_runs`;
  const runs = matrix[recordKey] || [];
  const expectedCount = matrix.completion?.[state] || 0;
  const diagnosticCode = `BENCH_BATCH_${state.toUpperCase()}_RUNS`;
  if (runs.length !== expectedCount) {
    fail(diagnosticCode, `${manifest.batch_id} lists ${runs.length}/${expectedCount} ${state} run record(s)`);
    return;
  }
  pass(diagnosticCode, `${manifest.batch_id} lists ${runs.length} ${state} run record(s)`);

  const seen = new Set();
  const validCases = new Set(manifest.case_ids || []);
  const validArms = new Set((manifest.arms || []).map((arm) => arm.arm_id));
  const validModelFamilies = new Set((manifest.model_plan?.model_families || []).map((family) => family.family_id));
  const maxRepeat = manifest.model_plan?.runs_per_case_per_arm || 0;

  for (const run of runs) {
    validateRunRecord(manifest, run, state, seen, validCases, validArms, validModelFamilies, maxRepeat);
  }
}

function validateRunRecord(manifest, run, expectedStatus, seen, validCases, validArms, validModelFamilies, maxRepeat) {
  const label = run.run_id || "(missing run_id)";
  if (!run.run_id) fail("BENCH_BATCH_RUN_ID", `${manifest.batch_id} ${expectedStatus} run missing run_id`);
  if (seen.has(run.run_id)) fail("BENCH_BATCH_RUN_ID_UNIQUE", `${manifest.batch_id} duplicate run_id ${run.run_id}`);
  seen.add(run.run_id);

  if (!validCases.has(run.case_id)) fail("BENCH_BATCH_RUN_CASE", `${label} has unknown case_id ${run.case_id || "(missing)"}`);
  if (!validArms.has(run.arm_id)) fail("BENCH_BATCH_RUN_ARM", `${label} has unknown arm_id ${run.arm_id || "(missing)"}`);
  if (!validModelFamilies.has(run.model_family)) fail("BENCH_BATCH_RUN_MODEL_FAMILY", `${label} has unknown model_family ${run.model_family || "(missing)"}`);
  if (!Number.isInteger(run.repeat) || run.repeat < 1 || run.repeat > maxRepeat) {
    fail("BENCH_BATCH_RUN_REPEAT", `${label} repeat ${run.repeat || "(missing)"} outside 1..${maxRepeat}`);
  }

  const expectedRunId = `${manifest.batch_id}__${run.case_id}__${run.arm_id}__${run.model_family}__r${run.repeat}`;
  if (run.run_id !== expectedRunId) {
    fail("BENCH_BATCH_RUN_ID_FORMAT", `${label} should be ${expectedRunId}`);
  }

  if (run.status !== expectedStatus) fail("BENCH_BATCH_RUN_STATUS", `${label} status must be ${expectedStatus}`);
  checkPreScoreCompliance(run);
  checkSemanticFidelity(run);
  checkRunOutput(run);
  if (run.arm_id === "full_ofone") checkRunArtifact(run);
  if (expectedStatus === "reviewed") checkRunReview(run);
  if (expectedStatus === "excluded") checkExcludedRun(run);
}

function checkRunOutput(run) {
  if (!run.raw_output) {
    fail("BENCH_BATCH_RUN_OUTPUT", `${run.run_id || "(missing run_id)"} missing raw_output`);
    return;
  }
  const outputPath = path.join(repoRoot, run.raw_output);
  if (!fs.existsSync(outputPath)) {
    fail("BENCH_BATCH_RUN_OUTPUT", `${run.run_id} raw output not found at ${run.raw_output}`);
    return;
  }
  const outputText = fs.readFileSync(outputPath, "utf8");
  const missing = [run.run_id, run.case_id, run.arm_id, run.model_family, "Status: `completed`"].filter((needle) => !outputText.includes(needle));
  if (missing.length > 0) {
    fail("BENCH_BATCH_RUN_OUTPUT", `${run.run_id} raw output missing ${missing.join(", ")}`);
    return;
  }
  pass("BENCH_BATCH_RUN_OUTPUT", `${run.run_id} raw output exists and identifies its slot`);
}

function checkRunArtifact(run) {
  if (!run.artifact_json) {
    fail("BENCH_BATCH_RUN_ARTIFACT", `${run.run_id} full_ofone run missing artifact_json`);
    return;
  }
  const artifactPath = path.join(repoRoot, run.artifact_json);
  if (!fs.existsSync(artifactPath)) {
    fail("BENCH_BATCH_RUN_ARTIFACT", `${run.run_id} artifact_json not found at ${run.artifact_json}`);
    return;
  }
  let artifact;
  try {
    artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  } catch (error) {
    fail("BENCH_BATCH_RUN_ARTIFACT", `${run.run_id} artifact_json is not valid JSON: ${error.message}`);
    return;
  }
  pass("BENCH_BATCH_RUN_ARTIFACT", `${run.run_id} full_ofone artifact JSON exists and parses`);
  checkFullOfOneCaseBinding(run, artifact);
  checkMachineArtifacts(run);
}

function checkPreScoreCompliance(run) {
  const gate = run.pre_score_compliance;
  if (!gate || typeof gate !== "object") {
    fail("BENCH_BATCH_RUN_PRE_SCORE", `${run.run_id || "(missing run_id)"} missing pre_score_compliance gate`);
    return;
  }

  const missing = requiredPreScoreFields.filter((field) => !validComplianceValues.has(gate[field]));
  if (missing.length > 0) {
    fail("BENCH_BATCH_RUN_PRE_SCORE", `${run.run_id} pre_score_compliance missing valid ${missing.join(", ")}`);
    return;
  }

  const failedFields = requiredPreScoreFields.filter((field) => gate[field] === "fail");
  if (failedFields.length > 0 && gate.auto_reject !== true) {
    fail("BENCH_BATCH_RUN_PRE_SCORE", `${run.run_id} has failed pre-score field(s) without auto_reject=true: ${failedFields.join(", ")}`);
  }
  if (gate.auto_reject === true && run.aggregate_eligible !== false) {
    fail("BENCH_BATCH_RUN_PRE_SCORE", `${run.run_id} auto-rejected run must set aggregate_eligible=false`);
  }
  if (gate.auto_reject === true && !gate.reject_reason) {
    fail("BENCH_BATCH_RUN_PRE_SCORE", `${run.run_id} auto-rejected run must include reject_reason`);
  }
  pass("BENCH_BATCH_RUN_PRE_SCORE", `${run.run_id} pre-score compliance gate recorded`);
}

function checkSemanticFidelity(run) {
  const fidelity = run.semantic_fidelity;
  if (!fidelity || typeof fidelity !== "object") {
    fail("BENCH_BATCH_RUN_SEMANTIC_FIDELITY", `${run.run_id || "(missing run_id)"} missing semantic_fidelity`);
    return;
  }
  const missing = requiredSemanticFidelityFields.filter((field) => !fidelity[field]);
  if (missing.length > 0) {
    fail("BENCH_BATCH_RUN_SEMANTIC_FIDELITY", `${run.run_id} semantic_fidelity missing ${missing.join(", ")}`);
    return;
  }
  pass("BENCH_BATCH_RUN_SEMANTIC_FIDELITY", `${run.run_id} semantic fidelity adjudication recorded`);
}

function checkFullOfOneCaseBinding(run, artifact) {
  const identity = artifact.artifact_identity || {};
  const trace = artifact.benchmark_trace || {};
  const mismatches = [];
  if (identity.case_id !== run.case_id) mismatches.push(`artifact_identity.case_id=${identity.case_id || "(missing)"} expected ${run.case_id}`);
  if (trace.run_id && trace.run_id !== run.run_id) mismatches.push(`benchmark_trace.run_id=${trace.run_id} expected ${run.run_id}`);

  if (mismatches.length === 0) {
    pass("BENCH_BATCH_RUN_CASE_BINDING", `${run.run_id} full_ofone artifact is bound to the benchmark case/run`);
    return;
  }

  const rejectedForCaseFidelity = run.aggregate_eligible === false &&
    run.pre_score_compliance?.auto_reject === true &&
    run.pre_score_compliance?.case_fidelity === "fail";
  if (rejectedForCaseFidelity) {
    warn("BENCH_BATCH_RUN_CASE_BINDING", `${run.run_id} case-binding mismatch is captured by pre-score auto-reject: ${mismatches.join("; ")}`);
    return;
  }
  fail("BENCH_BATCH_RUN_CASE_BINDING", `${run.run_id} full_ofone artifact not benchmark-bound: ${mismatches.join("; ")}`);
}

function checkMachineArtifacts(run) {
  const artifacts = run.machine_artifacts || {};
  for (const [pathField, hashField] of [
    ["validator_json", "validator_sha256"],
    ["patch_json", "patch_sha256"]
  ]) {
    const rel = artifacts[pathField];
    if (!rel) {
      fail("BENCH_BATCH_RUN_MACHINE_ARTIFACT", `${run.run_id} missing machine_artifacts.${pathField}`);
      continue;
    }
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) {
      fail("BENCH_BATCH_RUN_MACHINE_ARTIFACT", `${run.run_id} ${pathField} not found at ${rel}`);
      continue;
    }
    const actualHash = `sha256:${crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex")}`;
    if (artifacts[hashField] !== actualHash) {
      fail("BENCH_BATCH_RUN_MACHINE_ARTIFACT", `${run.run_id} ${hashField} ${artifacts[hashField] || "(missing)"} does not match ${actualHash}`);
      continue;
    }
    pass("BENCH_BATCH_RUN_MACHINE_ARTIFACT", `${run.run_id} ${pathField} hash matches ${actualHash}`);
  }
}

function checkRunReview(run) {
  if (!run.review_file) {
    fail("BENCH_BATCH_RUN_REVIEW", `${run.run_id} reviewed run missing review_file`);
    return;
  }
  const reviewPath = path.join(repoRoot, run.review_file);
  if (!fs.existsSync(reviewPath)) {
    fail("BENCH_BATCH_RUN_REVIEW", `${run.run_id} review file not found at ${run.review_file}`);
    return;
  }
  const reviewText = fs.readFileSync(reviewPath, "utf8");
  const requiredText = [
    run.run_id,
    `Case ID: \`${run.case_id}\``,
    `Arm ID: \`${run.arm_id}\``,
    `Blinding status:`,
    `Pre-Score Compliance Gate`,
    `Semantic Fidelity`,
    `Accept run for aggregate scoring:`
  ];
  const missingRequired = requiredText.filter((needle) => !reviewText.includes(needle));
  const missingMetrics = requiredMetrics.filter((metric) => !reviewText.includes(metric));
  if (missingRequired.length > 0 || missingMetrics.length > 0) {
    fail("BENCH_BATCH_RUN_REVIEW", `${run.run_id} review missing ${[...missingRequired, ...missingMetrics].join(", ")}`);
    return;
  }
  if (run.aggregate_eligible === false && !reviewText.includes("Accept run for aggregate scoring: `no`")) {
    fail("BENCH_BATCH_RUN_REVIEW", `${run.run_id} aggregate_eligible=false but review does not reject aggregate scoring`);
    return;
  }
  pass("BENCH_BATCH_RUN_REVIEW", `${run.run_id} review file exists and covers required metrics`);
}

function checkExcludedRun(run) {
  if (run.aggregate_eligible !== false) {
    fail("BENCH_BATCH_RUN_EXCLUDED", `${run.run_id} excluded run must set aggregate_eligible=false`);
  }
  if (!run.exclusion_reason) {
    fail("BENCH_BATCH_RUN_EXCLUDED", `${run.run_id} excluded run missing exclusion_reason`);
  }
  if (!run.independent_adjudication || typeof run.independent_adjudication !== "object") {
    fail("BENCH_BATCH_RUN_EXCLUDED", `${run.run_id} excluded run missing independent_adjudication`);
    return;
  }
  if (run.independent_adjudication.decision !== "reject") {
    fail("BENCH_BATCH_RUN_EXCLUDED", `${run.run_id} excluded run independent_adjudication.decision must be reject`);
  }
  checkFile("BENCH_BATCH_RUN_EXCLUDED_REVIEW", run.independent_adjudication.result_file, `${run.run_id} independent adjudication result`);
  pass("BENCH_BATCH_RUN_EXCLUDED", `${run.run_id} excluded from aggregate scoring with independent adjudication`);
}

function checkArrayExact(code, expected, actual, label) {
  if (!Array.isArray(actual)) {
    fail(code, `${label} missing array`);
    return;
  }
  const sameLength = expected.length === actual.length;
  const sameValues = sameLength && expected.every((value, index) => actual[index] === value);
  if (!sameValues) {
    fail(code, `${label} expected [${expected.join(", ")}], got [${actual.join(", ")}]`);
    return;
  }
  pass(code, `${label} match the batch manifest`);
}

function validateBatchReviewPlan(manifest) {
  const reviewPlan = manifest.review_plan || {};
  checkFile("BENCH_BATCH_RUBRIC", reviewPlan.rubric, `${manifest.batch_id} review rubric`);
  checkFile("BENCH_BATCH_REVIEW_TEMPLATE", reviewPlan.review_template, `${manifest.batch_id} review template`);
  checkReviewTemplate(manifest, reviewPlan.review_template);
  if (!reviewPlan.blinding) fail("BENCH_BATCH_BLINDING", `${manifest.batch_id} review_plan.blinding must describe blinding limitations`);
  if (!reviewPlan.adjudication_status || !validBatchStatuses.has(reviewPlan.adjudication_status)) {
    fail("BENCH_BATCH_ADJUDICATION_STATUS", `${manifest.batch_id} review_plan.adjudication_status has invalid status ${reviewPlan.adjudication_status || "(missing)"}`);
  }
  validateIndependentReviewPlan(manifest, reviewPlan);
}

function validateIndependentReviewPlan(manifest, reviewPlan) {
  const status = reviewPlan.independent_review_status || "not_prepared";
  if (!validIndependentReviewStatuses.has(status)) {
    fail("BENCH_BATCH_INDEPENDENT_REVIEW_STATUS", `${manifest.batch_id} independent_review_status has invalid status ${status}`);
    return;
  }

  if (status === "not_prepared") {
    warn("BENCH_BATCH_INDEPENDENT_REVIEW_STATUS", `${manifest.batch_id} has no independent review handoff prepared`);
    return;
  }

  checkFile("BENCH_BATCH_INDEPENDENT_REVIEW_HANDOFF", reviewPlan.independent_review_handoff, `${manifest.batch_id} independent review handoff`);
  checkFile("BENCH_BATCH_INDEPENDENT_REVIEW_PROMPT", reviewPlan.independent_review_prompt, `${manifest.batch_id} independent review prompt`);
  checkFile("BENCH_BATCH_INDEPENDENT_REVIEW_CONTEXT", reviewPlan.independent_review_context, `${manifest.batch_id} independent review context`);
  if (["launched", "harvested", "accepted", "integrated"].includes(status)) {
    checkFile("BENCH_BATCH_INDEPENDENT_REVIEW_STATUS_LEDGER", reviewPlan.independent_review_status_ledger, `${manifest.batch_id} independent review status ledger`);
  }

  if (["launched", "harvested", "accepted", "integrated"].includes(status) && !reviewPlan.independent_review_url) {
    fail("BENCH_BATCH_INDEPENDENT_REVIEW_URL", `${manifest.batch_id} independent_review_url required when status is ${status}`);
    return;
  }

  if (["launched", "harvested", "accepted", "integrated"].includes(status)) {
    validateIndependentReviewLaunch(manifest, reviewPlan, status);
  }

  pass("BENCH_BATCH_INDEPENDENT_REVIEW_STATUS", `${manifest.batch_id} independent review status is ${status}`);
}

function validateIndependentReviewLaunch(manifest, reviewPlan, status) {
  const launch = reviewPlan.independent_review_launch;
  if (!launch || typeof launch !== "object") {
    fail("BENCH_BATCH_INDEPENDENT_REVIEW_LAUNCH", `${manifest.batch_id} independent_review_launch required when status is ${status}`);
    return;
  }

  for (const field of ["launched_at", "model_label", "reasoning_label", "pasted_context_label", "browser_surface"]) {
    if (!launch[field]) fail("BENCH_BATCH_INDEPENDENT_REVIEW_LAUNCH", `${manifest.batch_id} independent_review_launch.${field} missing`);
  }
  if (launch.deep_research_enabled !== true) {
    fail("BENCH_BATCH_INDEPENDENT_REVIEW_LAUNCH", `${manifest.batch_id} independent review must record deep_research_enabled=true`);
  }
  if (!Array.isArray(launch.launch_proof) || launch.launch_proof.length < 3) {
    fail("BENCH_BATCH_INDEPENDENT_REVIEW_LAUNCH", `${manifest.batch_id} independent_review_launch.launch_proof must include plan/start/researching proof`);
    return;
  }

  const proofText = launch.launch_proof.join(" ").toLowerCase();
  for (const requiredProof of ["plan", "start", "researching", "stop research"]) {
    if (!proofText.includes(requiredProof)) {
      fail("BENCH_BATCH_INDEPENDENT_REVIEW_LAUNCH", `${manifest.batch_id} launch proof missing ${requiredProof}`);
    }
  }
  if (reviewPlan.independent_review_url && !reviewPlan.independent_review_url.startsWith("https://chatgpt.com/c/")) {
    warn("BENCH_BATCH_INDEPENDENT_REVIEW_URL", `${manifest.batch_id} independent_review_url is not a ChatGPT conversation URL`);
  }
  pass("BENCH_BATCH_INDEPENDENT_REVIEW_LAUNCH", `${manifest.batch_id} independent review launch proof recorded`);
}

function validateBatchResultsPlan(manifest) {
  const resultsPlan = manifest.results_plan || {};
  checkFile("BENCH_BATCH_RESULT_SUMMARY", resultsPlan.summary_file, `${manifest.batch_id} result summary placeholder`);
  checkFile("BENCH_BATCH_FAILURE_ANALYSIS", resultsPlan.failure_analysis_file, `${manifest.batch_id} failure-analysis placeholder`);
  if (resultsPlan.excluded_run_log) {
    checkFile("BENCH_BATCH_EXCLUDED_RUN_LOG", resultsPlan.excluded_run_log, `${manifest.batch_id} excluded-run log`);
  }
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

function checkReviewTemplate(manifest, reviewTemplatePath) {
  if (!reviewTemplatePath) return;
  const abs = path.join(repoRoot, reviewTemplatePath);
  if (!fs.existsSync(abs)) return;
  const text = fs.readFileSync(abs, "utf8");
  const required = [
    "Pre-Score Compliance Gate",
    "Case fidelity",
    "Required outputs present",
    "Independence from other arms/examples",
    "No-superiority compliance",
    "Auto-reject before aggregate scoring",
    "Semantic Fidelity"
  ];
  const missing = required.filter((needle) => !text.includes(needle));
  if (missing.length > 0) {
    fail("BENCH_BATCH_REVIEW_TEMPLATE_GATE", `${manifest.batch_id} review template missing ${missing.join(", ")}`);
    return;
  }
  pass("BENCH_BATCH_REVIEW_TEMPLATE_GATE", `${manifest.batch_id} review template includes pre-score compliance and semantic fidelity fields`);
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
