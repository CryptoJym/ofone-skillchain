#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const protocolPath = "research/frontier-full-ofone-repair-protocol.md";
const contractPath = "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md";
const matrixPath = "benchmarks/runs/2026-05-17-batch-01/execution-matrix.json";
const excludedPath = "benchmarks/results/2026-05-17-batch-01-excluded-runs.md";
const readmePath = "README.md";
const benchmarkReadmePath = "benchmarks/README.md";
const indexPath = "index.html";
const pagesCheckPath = "scripts/ofone-pages-check.mjs";
const testPath = "scripts/ofone-test.mjs";
const packagePath = "package.json";

const originalRunId = "2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1";
const rerun5RunId = `${originalRunId}__rerun5`;
const expectedTrace = {
  case_id: "case-strategic-gated-diligence-001",
  run_id: rerun5RunId,
  case_file: "benchmarks/cases/strategic-gated-diligence.md",
  case_file_sha256: "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
  prompt_file: "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
  prompt_file_sha256: "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
  input_bundle_sha256: "sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44"
};

const rerun5Paths = {
  raw_output: `benchmarks/runs/2026-05-17-batch-01/outputs/${rerun5RunId}.md`,
  artifact_json: `benchmarks/runs/2026-05-17-batch-01/outputs/${rerun5RunId}.artifact.json`,
  validator_json: `benchmarks/runs/2026-05-17-batch-01/outputs/${rerun5RunId}.validator.json`,
  rendering_md: `benchmarks/runs/2026-05-17-batch-01/outputs/${rerun5RunId}.rendering.md`,
  patch_json: `benchmarks/runs/2026-05-17-batch-01/outputs/${rerun5RunId}.patch.json`,
  review_file: `benchmarks/reviews/2026-05-17-batch-01/${rerun5RunId}.md`
};

const expectedHashes = {
  raw_output_sha256: "sha256:2897a11f82baee33a0161a8d8f64b716017c3fedd9d22a2639c60caa6ad4bf86",
  artifact_sha256: "sha256:6bd70e20ba36bf9e63a8bc4c65127a3f1166d30590d1a63df63b2612261a14f0",
  validator_sha256: "sha256:de1bbeefa04a96f0da9fb2210290c206e8c421139af5abaa43c2aa6b8850093a",
  rendering_sha256: "sha256:116da40a3d99f20b7bce459f9de543e4e4ab0edd87c7ea5c95ee364899d211e5",
  patch_sha256: "sha256:60c289babea552802569575f5a4ff40672835996739841753ff20d3cdcd1ce19",
  review_sha256: "sha256:67c79c6fc30535dcb143ae47620b79444186d6ccc7b44087f4c65fc8789f7382"
};

const failures = [];
const passes = [];

check();

if (failures.length > 0) {
  console.error("FAIL frontier controlled execution contract");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PASS frontier controlled execution contract");
for (const pass of passes) console.log(`- OK ${pass}`);

function check() {
  const protocol = readText(protocolPath);
  const contract = readText(contractPath);
  const matrix = readJson(matrixPath);
  const excluded = readText(excludedPath);
  const readme = readText(readmePath);
  const benchmarkReadme = readText(benchmarkReadmePath);
  const index = readText(indexPath);
  const pagesCheck = readText(pagesCheckPath);
  const test = readText(testPath);
  const packageJson = readJson(packagePath);
  const rawOutput = readText(rerun5Paths.raw_output);
  const artifact = readJson(rerun5Paths.artifact_json);
  const validator = readJson(rerun5Paths.validator_json);
  const rendering = readText(rerun5Paths.rendering_md);
  const patchReport = readJson(rerun5Paths.patch_json);
  const review = readText(rerun5Paths.review_file);

  ok(packageJson.scripts?.["frontier:controlled:check"] === "node scripts/ofone-frontier-controlled-contract-check.mjs", "package exposes controlled contract checker");
  ok(protocol.includes(contractPath), "repair protocol links the active Mode A contract");
  ok(protocol.includes("keeps same-shape attachment-led Deep Research reruns barred"), "repair protocol preserves the rerun bar after Mode A execution");
  ok(readme.includes(contractPath), "README links the controlled contract");
  ok(benchmarkReadme.includes(contractPath), "benchmark README links the controlled contract");
  ok(index.includes(`./${contractPath}`), "index links the controlled contract");
  ok(pagesCheck.includes(contractPath), "Pages checker covers the controlled contract");
  ok(pagesCheck.includes("scripts/ofone-frontier-controlled-contract-check.mjs"), "Pages checker covers the controlled contract checker");
  ok(test.includes("scripts/ofone-frontier-controlled-contract-check.mjs"), "test suite runs the controlled contract checker");

  ok(contract.includes("Status: `executed_reviewed`"), "contract records executed/reviewed state");
  ok(contract.includes("Mode: `Mode A: Controlled Non-Deep-Research Execution`"), "contract selects Mode A");
  ok(contract.includes(`Run ID: \`${rerun5RunId}\``), "contract locks exact rerun5 run id");
  ok(contract.includes(`Rerun of: \`${originalRunId}\``), "contract locks original rerun target");
  ok(contract.includes("Status before execution: `prepared_not_executed`"), "contract preserves pre-execution state");
  ok(contract.includes("Status after execution: `reviewed`"), "contract records post-execution review state");
  ok(contract.includes("Aggregate policy after execution: `replace_for_aggregate_only`"), "contract records replacement policy");
  ok(contract.includes("Status: `completed`"), "contract requires completed output metadata");
  ok(contract.includes("# Benchmark Raw Output"), "contract requires exact raw-output heading");
  for (const section of ["## Artifact JSON", "## Validator Result", "## Rendering", "## Patch Report"]) {
    ok(contract.includes(section), `contract requires ${section}`);
    ok(rawOutput.includes(section), `rerun5 raw output includes ${section}`);
  }
  ok(contract.includes("Do not use attachments as the execution contract."), "contract blocks attachment-led execution");
  ok(contract.includes("Do not insert this run into `remedial_runs` before the required output package exists and passes computed local validation."), "contract preserves the matrix insertion gate");
  ok(contract.includes("Superiority claims remain blocked."), "contract blocks superiority claims");

  for (const [field, value] of Object.entries(expectedTrace)) {
    ok(contract.includes(`"${field}": "${value}"`), `contract embeds canonical benchmark_trace.${field}`);
  }

  ok(rawOutput.startsWith("# Benchmark Raw Output\n"), "rerun5 raw output starts with exact benchmark heading");
  ok(rawOutput.includes(`Run ID: \`${rerun5RunId}\``), "rerun5 raw output has exact run id");
  ok(rawOutput.includes(`Rerun of: \`${originalRunId}\``), "rerun5 raw output has rerun target");
  ok(rawOutput.includes("Status: `completed`"), "rerun5 raw output has completed status");
  ok(rawOutput.includes("Execution mode: `Mode A: Controlled Non-Deep-Research Execution`"), "rerun5 raw output records Mode A execution");
  ok(validator.passed === true, "rerun5 computed validator JSON passed");
  ok(rendering.includes("Recommendation:"), "rerun5 rendering is present");
  ok(patchReport.input === rerun5Paths.artifact_json, "rerun5 patch report points to the artifact");
  ok(review.includes("Accept run for aggregate scoring: `yes`"), "rerun5 local review accepts aggregate scoring");
  ok(review.includes("No-superiority compliance"), "rerun5 local review checks no-superiority compliance");

  for (const [field, value] of Object.entries(expectedTrace)) {
    ok(artifact.benchmark_trace?.[field] === value, `rerun5 artifact benchmark_trace.${field} matches`);
  }

  const original = (matrix.completed_runs || []).find((run) => run.run_id === originalRunId);
  const excludedOriginal = (matrix.excluded_runs || []).find((run) => run.run_id === originalRunId);
  ok(Boolean(original) && Boolean(excludedOriginal), "matrix preserves the excluded original frontier full-OfOne run");
  if (original) {
    ok(original.aggregate_eligible === false, "original frontier full-OfOne remains aggregate-ineligible");
    ok(original.pre_score_compliance?.auto_reject === true, "original frontier full-OfOne remains auto-rejected");
    const trace = original.benchmark_trace || {};
    for (const [field, value] of Object.entries(expectedTrace)) {
      if (field === "run_id") continue;
      ok(trace[field] === value, `original matrix trace supplies ${field}`);
    }
  }
  if (excludedOriginal) {
    ok(excludedOriginal.rerun_plan?.status === "reviewed", "original frontier full-OfOne rerun plan records reviewed replacement");
    ok(excludedOriginal.rerun_plan?.latest_successful_rerun === rerun5RunId, "original rerun plan points to rerun5 as latest successful rerun");
  }

  const attempts = (matrix.remedial_attempts || []).filter((attempt) => attempt.rerun_of === originalRunId);
  for (const runNumber of [1, 2, 3, 4]) {
    const attempt = attempts.find((entry) => entry.rerun_number === runNumber);
    ok(Boolean(attempt), `matrix preserves failed rerun${runNumber}`);
    if (!attempt) continue;
    ok(attempt.status === "failed", `rerun${runNumber} remains failed`);
    ok(attempt.aggregate_policy === "not_aggregate_eligible", `rerun${runNumber} remains not aggregate eligible`);
    ok(attempt.aggregate_eligible !== true, `rerun${runNumber} is not aggregate eligible`);
  }
  ok(!attempts.some((entry) => entry.rerun_number === 5 || entry.run_id === rerun5RunId), "rerun5 is not recorded as a failed attempt");

  const rerun5 = (matrix.remedial_runs || []).find((run) => run.run_id === rerun5RunId && run.rerun_of === originalRunId);
  ok(Boolean(rerun5), "rerun5 is recorded in remedial_runs after evidence exists");
  if (rerun5) {
    ok(rerun5.status === "reviewed", "rerun5 status is reviewed");
    ok(rerun5.aggregate_policy === "replace_for_aggregate_only", "rerun5 aggregate policy is replacement only");
    ok(rerun5.aggregate_eligible === true, "rerun5 is aggregate-eligible as replacement evidence");
    ok(rerun5.execution_mode === "Mode A: Controlled Non-Deep-Research Execution", "rerun5 records controlled Mode A execution");
    ok(rerun5.raw_output === rerun5Paths.raw_output, "rerun5 matrix raw output path matches");
    ok(rerun5.artifact_json === rerun5Paths.artifact_json, "rerun5 matrix artifact path matches");
    ok(rerun5.review_file === rerun5Paths.review_file, "rerun5 matrix review path matches");
    ok(rerun5.machine_artifacts?.validator_json === rerun5Paths.validator_json, "rerun5 matrix validator path matches");
    ok(rerun5.machine_artifacts?.rendering_md === rerun5Paths.rendering_md, "rerun5 matrix rendering path matches");
    ok(rerun5.machine_artifacts?.patch_json === rerun5Paths.patch_json, "rerun5 matrix patch path matches");
    ok(rerun5.raw_output_sha256 === expectedHashes.raw_output_sha256, "rerun5 raw output hash is pinned");
    ok(rerun5.artifact_sha256 === expectedHashes.artifact_sha256, "rerun5 artifact hash is pinned");
    ok(rerun5.review_sha256 === expectedHashes.review_sha256, "rerun5 review hash is pinned");
    ok(rerun5.machine_artifacts?.validator_sha256 === expectedHashes.validator_sha256, "rerun5 validator hash is pinned");
    ok(rerun5.machine_artifacts?.rendering_sha256 === expectedHashes.rendering_sha256, "rerun5 rendering hash is pinned");
    ok(rerun5.machine_artifacts?.patch_sha256 === expectedHashes.patch_sha256, "rerun5 patch hash is pinned");
    for (const [field, value] of Object.entries(expectedTrace)) {
      ok(rerun5.benchmark_trace?.[field] === value, `rerun5 matrix benchmark_trace.${field} matches`);
    }
  }

  ok(matrix.completion?.remedial >= 2, "matrix completion counts the second remedial replacement");
  ok(matrix.completion?.aggregate_eligible >= 48, "matrix aggregate eligibility includes rerun5 replacement evidence");

  ok(excluded.includes(`${originalRunId}__rerun4`), "excluded-run log records rerun4");
  ok(excluded.includes(`${originalRunId}__rerun5`), "excluded-run log records rerun5 replacement");
  ok(excluded.includes("same-shape attachment-led Deep Research remedial rerun is now barred"), "excluded-run log records the process gate");

  for (const [field, relativePath] of Object.entries(rerun5Paths)) {
    ok(fs.existsSync(path.join(repoRoot, relativePath)), `rerun5 ${field} file exists`);
  }
  for (const [field, expectedHash] of Object.entries(expectedHashes)) {
    const pathField = {
      raw_output_sha256: "raw_output",
      artifact_sha256: "artifact_json",
      validator_sha256: "validator_json",
      rendering_sha256: "rendering_md",
      patch_sha256: "patch_json",
      review_sha256: "review_file"
    }[field];
    ok(hashFile(rerun5Paths[pathField]) === expectedHash, `rerun5 ${pathField} hash matches ${field}`);
  }
}

function readText(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing file ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function readJson(relativePath) {
  const text = readText(relativePath);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    failures.push(`invalid JSON ${relativePath}: ${error.message}`);
    return {};
  }
}

function hashFile(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) return "";
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(absolutePath)).digest("hex")}`;
}

function ok(condition, message) {
  if (condition) passes.push(message);
  else failures.push(message);
}
