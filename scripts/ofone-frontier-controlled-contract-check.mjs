#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const protocolPath = "research/frontier-full-ofone-repair-protocol.md";
const contractPath = "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md";
const regulatedContractPath = "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md";
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

const regulatedOriginalRunId = "2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1";
const regulatedRerun1RunId = `${regulatedOriginalRunId}__rerun1`;
const regulatedExpectedTrace = {
  case_id: "case-regulated-wastewater-market-entry-001",
  run_id: regulatedRerun1RunId,
  case_file: "benchmarks/cases/regulated-wastewater-market-entry.md",
  case_file_sha256: "sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16",
  prompt_file: "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
  prompt_file_sha256: "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
  input_bundle_sha256: "sha256:2849a7b8ab7af3553a448c44916d236e5cdd8dc4c4e37dd9fc5e3a18e4398b0b"
};

const regulatedRerun1Paths = {
  raw_output: `benchmarks/runs/2026-05-17-batch-01/outputs/${regulatedRerun1RunId}.md`,
  artifact_json: `benchmarks/runs/2026-05-17-batch-01/outputs/${regulatedRerun1RunId}.artifact.json`,
  validator_json: `benchmarks/runs/2026-05-17-batch-01/outputs/${regulatedRerun1RunId}.validator.json`,
  rendering_md: `benchmarks/runs/2026-05-17-batch-01/outputs/${regulatedRerun1RunId}.rendering.md`,
  patch_json: `benchmarks/runs/2026-05-17-batch-01/outputs/${regulatedRerun1RunId}.patch.json`,
  review_file: `benchmarks/reviews/2026-05-17-batch-01/${regulatedRerun1RunId}.md`
};

const regulatedExpectedHashes = {
  raw_output_sha256: "sha256:eb8251313f684035e12f5ce9999645c8c1273663549bb2ee0da26021904e7fce",
  artifact_sha256: "sha256:99869ab95cb00d04ae611efbf89fbe65257c00ab845e02ef0581bb625794a4ee",
  validator_sha256: "sha256:9af57bff15e7bafc69ebe718f356b68d8e9a85cef11881ffe025fcb5587de793",
  rendering_sha256: "sha256:6992173710a3394fe784f445e65fb2203dfd8fe6b86d17cf15ad6f95e674f5dd",
  patch_sha256: "sha256:520562c0394148f6fb21be4f4dcec4be93cff9bcfbf31a472f25a199fa1db45f",
  review_sha256: "sha256:929df0ac477a063c2577738673aeb4a606b81c788ccdf3945bcd80b397148c46"
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
  ok(protocol.includes("same-shape attachment-led Deep Research reruns barred"), "repair protocol preserves the rerun bar after Mode A execution");
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

  checkRegulatedControlledRepair({
    protocol,
    matrix,
    excluded,
    readme,
    benchmarkReadme,
    index,
    pagesCheck
  });
}

function checkRegulatedControlledRepair({ protocol, matrix, excluded, readme, benchmarkReadme, index, pagesCheck }) {
  const contract = readText(regulatedContractPath);
  const rawOutput = readText(regulatedRerun1Paths.raw_output);
  const artifact = readJson(regulatedRerun1Paths.artifact_json);
  const validator = readJson(regulatedRerun1Paths.validator_json);
  const rendering = readText(regulatedRerun1Paths.rendering_md);
  const patchReport = readJson(regulatedRerun1Paths.patch_json);
  const review = readText(regulatedRerun1Paths.review_file);

  ok(protocol.includes(regulatedContractPath), "repair protocol links the regulated Mode A contract");
  ok(readme.includes(regulatedContractPath), "README links the regulated controlled contract");
  ok(benchmarkReadme.includes(regulatedContractPath), "benchmark README links the regulated controlled contract");
  ok(index.includes(`./${regulatedContractPath}`), "index links the regulated controlled contract");
  ok(pagesCheck.includes(regulatedContractPath), "Pages checker covers the regulated controlled contract");

  ok(contract.includes("Status: `executed_reviewed`"), "regulated contract records executed/reviewed state");
  ok(contract.includes("Mode: `Mode A: Controlled Non-Deep-Research Execution`"), "regulated contract selects Mode A");
  ok(contract.includes(`Run ID: \`${regulatedRerun1RunId}\``), "regulated contract locks exact rerun1 run id");
  ok(contract.includes(`Rerun of: \`${regulatedOriginalRunId}\``), "regulated contract locks original rerun target");
  ok(contract.includes("Status after execution: `reviewed`"), "regulated contract records post-execution review state");
  ok(contract.includes("Aggregate policy after execution: `replace_for_aggregate_only`"), "regulated contract records replacement policy");
  for (const section of ["## Artifact JSON", "## Validator Result", "## Rendering", "## Patch Report"]) {
    ok(contract.includes(section), `regulated contract requires ${section}`);
    ok(rawOutput.includes(section), `regulated rerun1 raw output includes ${section}`);
  }
  ok(contract.includes("Do not use attachments as the execution contract."), "regulated contract blocks attachment-led execution");
  ok(contract.includes("Superiority claims remain blocked."), "regulated contract blocks superiority claims");

  ok(rawOutput.startsWith("# Benchmark Raw Output\n"), "regulated rerun1 raw output starts with exact benchmark heading");
  ok(rawOutput.includes(`Run ID: \`${regulatedRerun1RunId}\``), "regulated rerun1 raw output has exact run id");
  ok(rawOutput.includes(`Rerun of: \`${regulatedOriginalRunId}\``), "regulated rerun1 raw output has rerun target");
  ok(rawOutput.includes("Status: `completed`"), "regulated rerun1 raw output has completed status");
  ok(rawOutput.includes("Execution mode: `Mode A: Controlled Non-Deep-Research Execution`"), "regulated rerun1 raw output records Mode A execution");
  ok(validator.passed === true, "regulated rerun1 computed validator JSON passed");
  ok(rendering.includes("Recommendation:"), "regulated rerun1 rendering is present");
  ok(patchReport.input === regulatedRerun1Paths.artifact_json, "regulated rerun1 patch report points to the artifact");
  ok(review.includes("Accept run for aggregate scoring: `yes`"), "regulated rerun1 local review accepts aggregate scoring");
  ok(review.includes("No-superiority compliance"), "regulated rerun1 local review checks no-superiority compliance");

  for (const [field, value] of Object.entries(regulatedExpectedTrace)) {
    ok(artifact.benchmark_trace?.[field] === value, `regulated rerun1 artifact benchmark_trace.${field} matches`);
  }

  const original = (matrix.completed_runs || []).find((run) => run.run_id === regulatedOriginalRunId);
  const excludedOriginal = (matrix.excluded_runs || []).find((run) => run.run_id === regulatedOriginalRunId);
  ok(Boolean(original) && Boolean(excludedOriginal), "matrix preserves the excluded regulated frontier full-OfOne run");
  if (original) {
    ok(original.aggregate_eligible === false, "regulated original remains aggregate-ineligible");
    ok(original.pre_score_compliance?.auto_reject === true, "regulated original remains auto-rejected");
  }
  if (excludedOriginal) {
    ok(excludedOriginal.rerun_plan?.status === "reviewed", "regulated original rerun plan records reviewed replacement");
    ok(excludedOriginal.rerun_plan?.latest_successful_rerun === regulatedRerun1RunId, "regulated original rerun plan points to rerun1 as latest successful rerun");
  }

  const rerun1 = (matrix.remedial_runs || []).find((run) => run.run_id === regulatedRerun1RunId && run.rerun_of === regulatedOriginalRunId);
  ok(Boolean(rerun1), "regulated rerun1 is recorded in remedial_runs after evidence exists");
  if (rerun1) {
    ok(rerun1.status === "reviewed", "regulated rerun1 status is reviewed");
    ok(rerun1.aggregate_policy === "replace_for_aggregate_only", "regulated rerun1 aggregate policy is replacement only");
    ok(rerun1.aggregate_eligible === true, "regulated rerun1 is aggregate-eligible as replacement evidence");
    ok(rerun1.execution_mode === "Mode A: Controlled Non-Deep-Research Execution", "regulated rerun1 records controlled Mode A execution");
    ok(rerun1.raw_output === regulatedRerun1Paths.raw_output, "regulated rerun1 matrix raw output path matches");
    ok(rerun1.artifact_json === regulatedRerun1Paths.artifact_json, "regulated rerun1 matrix artifact path matches");
    ok(rerun1.review_file === regulatedRerun1Paths.review_file, "regulated rerun1 matrix review path matches");
    ok(rerun1.machine_artifacts?.validator_json === regulatedRerun1Paths.validator_json, "regulated rerun1 matrix validator path matches");
    ok(rerun1.machine_artifacts?.rendering_md === regulatedRerun1Paths.rendering_md, "regulated rerun1 matrix rendering path matches");
    ok(rerun1.machine_artifacts?.patch_json === regulatedRerun1Paths.patch_json, "regulated rerun1 matrix patch path matches");
    ok(rerun1.raw_output_sha256 === regulatedExpectedHashes.raw_output_sha256, "regulated rerun1 raw output hash is pinned");
    ok(rerun1.artifact_sha256 === regulatedExpectedHashes.artifact_sha256, "regulated rerun1 artifact hash is pinned");
    ok(rerun1.review_sha256 === regulatedExpectedHashes.review_sha256, "regulated rerun1 review hash is pinned");
    ok(rerun1.machine_artifacts?.validator_sha256 === regulatedExpectedHashes.validator_sha256, "regulated rerun1 validator hash is pinned");
    ok(rerun1.machine_artifacts?.rendering_sha256 === regulatedExpectedHashes.rendering_sha256, "regulated rerun1 rendering hash is pinned");
    ok(rerun1.machine_artifacts?.patch_sha256 === regulatedExpectedHashes.patch_sha256, "regulated rerun1 patch hash is pinned");
    for (const [field, value] of Object.entries(regulatedExpectedTrace)) {
      ok(rerun1.benchmark_trace?.[field] === value, `regulated rerun1 matrix benchmark_trace.${field} matches`);
    }
  }

  ok(matrix.completion?.remedial >= 3, "matrix completion counts the third remedial replacement");
  ok(matrix.completion?.aggregate_eligible >= 51, "matrix aggregate eligibility includes regulated rerun1 replacement evidence");
  ok(excluded.includes(regulatedRerun1RunId), "excluded-run log records regulated rerun1 replacement");
  ok(excluded.toLowerCase().includes("regulated wastewater controlled mode a rerun 1"), "excluded-run log records the regulated controlled process gate");

  for (const [field, relativePath] of Object.entries(regulatedRerun1Paths)) {
    ok(fs.existsSync(path.join(repoRoot, relativePath)), `regulated rerun1 ${field} file exists`);
  }
  for (const [field, expectedHash] of Object.entries(regulatedExpectedHashes)) {
    const pathField = {
      raw_output_sha256: "raw_output",
      artifact_sha256: "artifact_json",
      validator_sha256: "validator_json",
      rendering_sha256: "rendering_md",
      patch_sha256: "patch_json",
      review_sha256: "review_file"
    }[field];
    ok(hashFile(regulatedRerun1Paths[pathField]) === expectedHash, `regulated rerun1 ${pathField} hash matches ${field}`);
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
