#!/usr/bin/env node

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
const nextRunId = `${originalRunId}__rerun5`;
const expectedTrace = {
  case_id: "case-strategic-gated-diligence-001",
  run_id: nextRunId,
  case_file: "benchmarks/cases/strategic-gated-diligence.md",
  case_file_sha256: "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
  prompt_file: "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
  prompt_file_sha256: "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
  input_bundle_sha256: "sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44"
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

  ok(packageJson.scripts?.["frontier:controlled:check"] === "node scripts/ofone-frontier-controlled-contract-check.mjs", "package exposes controlled contract checker");
  ok(protocol.includes(contractPath), "repair protocol links the active Mode A contract");
  ok(protocol.includes("keeps same-shape attachment-led Deep Research reruns barred"), "repair protocol preserves the rerun bar after preparing Mode A");
  ok(readme.includes(contractPath), "README links the controlled contract");
  ok(benchmarkReadme.includes(contractPath), "benchmark README links the controlled contract");
  ok(index.includes(`./${contractPath}`), "index links the controlled contract");
  ok(pagesCheck.includes(contractPath), "Pages checker covers the controlled contract");
  ok(pagesCheck.includes("scripts/ofone-frontier-controlled-contract-check.mjs"), "Pages checker covers the controlled contract checker");
  ok(test.includes("scripts/ofone-frontier-controlled-contract-check.mjs"), "test suite runs the controlled contract checker");

  ok(contract.includes("Status: `prepared_not_executed`"), "contract is explicitly prepared, not executed");
  ok(contract.includes("Mode: `Mode A: Controlled Non-Deep-Research Execution`"), "contract selects Mode A");
  ok(contract.includes(`Run ID: \`${nextRunId}\``), "contract locks exact rerun5 run id");
  ok(contract.includes(`Rerun of: \`${originalRunId}\``), "contract locks original rerun target");
  ok(contract.includes("Status: `completed`"), "contract requires completed output metadata in the future raw package");
  ok(contract.includes("# Benchmark Raw Output"), "contract requires exact raw-output heading");
  for (const section of ["## Artifact JSON", "## Validator Result", "## Rendering", "## Patch Report"]) {
    ok(contract.includes(section), `contract requires ${section}`);
  }
  ok(contract.includes("Do not use attachments as the execution contract."), "contract blocks attachment-led execution");
  ok(contract.includes("Do not insert this run into `remedial_runs`"), "contract blocks premature replacement insertion");
  ok(contract.includes("Superiority claims remain blocked."), "contract blocks superiority claims");

  for (const [field, value] of Object.entries(expectedTrace)) {
    ok(contract.includes(`"${field}": "${value}"`), `contract embeds canonical benchmark_trace.${field}`);
  }

  const original = (matrix.completed_runs || []).find((run) => run.run_id === originalRunId);
  ok(Boolean(original), "matrix preserves the excluded original frontier full-OfOne run");
  if (original) {
    ok(original.aggregate_eligible === false, "original frontier full-OfOne remains aggregate-ineligible");
    ok(original.pre_score_compliance?.auto_reject === true, "original frontier full-OfOne remains auto-rejected");
    const trace = original.benchmark_trace || {};
    for (const [field, value] of Object.entries(expectedTrace)) {
      if (field === "run_id") continue;
      ok(trace[field] === value, `original matrix trace supplies ${field}`);
    }
  }

  const attempts = (matrix.remedial_attempts || []).filter((attempt) => attempt.rerun_of === originalRunId);
  for (const runNumber of [1, 2, 3, 4]) {
    const attempt = attempts.find((entry) => entry.rerun_number === runNumber);
    ok(Boolean(attempt), `matrix preserves failed rerun${runNumber}`);
    if (!attempt) continue;
    ok(attempt.status === "failed", `rerun${runNumber} remains failed`);
    ok(attempt.aggregate_policy === "not_aggregate_eligible", `rerun${runNumber} remains not aggregate eligible`);
  }
  ok(!attempts.some((entry) => entry.rerun_number === 5 || entry.run_id === nextRunId), "rerun5 is not already recorded as a failed attempt");
  ok(!(matrix.remedial_runs || []).some((run) => run.run_id === nextRunId || run.rerun_of === originalRunId), "rerun5 is not prematurely inserted into remedial_runs");

  ok(excluded.includes(`${originalRunId}__rerun4`), "excluded-run log records rerun4");
  ok(excluded.includes("same-shape attachment-led Deep Research remedial rerun is now barred"), "excluded-run log records the process gate");
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

function ok(condition, message) {
  if (condition) passes.push(message);
  else failures.push(message);
}
