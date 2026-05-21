#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const protocolPath = "research/frontier-full-ofone-repair-protocol.md";
const matrixPath = "benchmarks/runs/2026-05-17-batch-01/execution-matrix.json";
const readmePath = "README.md";
const indexPath = "index.html";
const loopPath = "research/recursive-improvement-loop.md";
const statusPath = "research/status/2026-05-17-07-ofone-post-run06-hardening-review.md";

const frontierRunId = "2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1";
const expectedReruns = [1, 2, 3, 4];

const failures = [];
const passes = [];

check();

if (failures.length > 0) {
  console.error("FAIL frontier full-OfOne repair protocol");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PASS frontier full-OfOne repair protocol");
for (const pass of passes) console.log(`- OK ${pass}`);

function check() {
  const protocol = readText(protocolPath);
  const readme = readText(readmePath);
  const index = readText(indexPath);
  const loop = readText(loopPath);
  const status = readText(statusPath);
  const matrix = readJson(matrixPath);

  ok(protocol.includes("Status: `active_after_rerun4`"), "protocol state records post-rerun4 escalation");
  ok(protocol.includes("Same-shape Deep Research remedial reruns are barred"), "protocol bars same-shape Deep Research reruns");
  ok(protocol.includes("attachment-only"), "protocol blocks attachment-only rerun launches");
  ok(protocol.includes("Mode A: Controlled Non-Deep-Research Execution"), "protocol defines controlled non-Deep-Research execution");
  ok(protocol.includes("Mode B: Inline Deep Research Launch Contract"), "protocol defines inline Deep Research launch contract");
  ok(protocol.includes("launch proof that the inline contract"), "protocol requires inline-contract launch proof");
  ok(protocol.includes("Superiority claims remain blocked"), "protocol keeps superiority claims blocked");
  ok(protocol.includes("npm run frontier:protocol:check"), "protocol documents its checker command");

  for (const runNumber of expectedReruns) {
    const rerunId = `${frontierRunId}__rerun${runNumber}`;
    ok(protocol.includes(rerunId), `protocol cites failed rerun ${runNumber}`);
  }

  const attempts = Array.isArray(matrix.remedial_attempts) ? matrix.remedial_attempts : [];
  const frontierAttempts = attempts.filter((attempt) => attempt.rerun_of === frontierRunId);
  ok(frontierAttempts.length >= expectedReruns.length, "matrix preserves at least four failed frontier remedial attempts");

  for (const runNumber of expectedReruns) {
    const attempt = frontierAttempts.find((entry) => entry.rerun_number === runNumber);
    ok(Boolean(attempt), `matrix records frontier remedial rerun ${runNumber}`);
    if (!attempt) continue;
    ok(attempt.status === "failed", `rerun ${runNumber} remains failed`);
    ok(attempt.aggregate_policy === "not_aggregate_eligible", `rerun ${runNumber} remains outside aggregate eligibility`);
    ok(!attempt.replacement_for, `rerun ${runNumber} is not represented as a replacement`);
  }

  const rerun4 = frontierAttempts.find((entry) => entry.rerun_number === 4);
  ok(Boolean(rerun4?.raw_output), "rerun4 raw output is referenced");
  ok(Boolean(rerun4?.review_file), "rerun4 local review is referenced");
  if (rerun4?.raw_output) ok(fs.existsSync(path.join(repoRoot, rerun4.raw_output)), "rerun4 raw output file exists");
  if (rerun4?.review_file) ok(fs.existsSync(path.join(repoRoot, rerun4.review_file)), "rerun4 review file exists");
  ok(String(rerun4?.failure_reason || "").includes("meta/advisory"), "rerun4 failure reason records meta/advisory output");

  const replacementRuns = Array.isArray(matrix.remedial_runs) ? matrix.remedial_runs : [];
  const frontierReplacement = replacementRuns.find((run) => run.rerun_of === frontierRunId || run.run_id === `${frontierRunId}__rerun4`);
  ok(!frontierReplacement, "frontier full-OfOne failed attempts are not inserted into remedial_runs");

  ok(readme.includes(protocolPath), "README links the repair protocol");
  ok(index.includes(`./${protocolPath}`), "index links the repair protocol");
  ok(loop.includes(protocolPath), "recursive loop points to the repair protocol");
  ok(status.includes(protocolPath), "Run 07 status ledger points to the repair protocol");
  ok(loop.includes("do not launch another same-shape Deep Research remedial rerun"), "recursive loop preserves no-same-shape-rerun guard");
  ok(status.includes("controlled non-Deep-Research execution"), "status ledger preserves controlled execution handoff");
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
  if (condition) {
    passes.push(message);
  } else {
    failures.push(message);
  }
}
