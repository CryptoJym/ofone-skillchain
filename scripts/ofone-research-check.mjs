#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const trackerPath = path.join(repoRoot, "research", "TRACKER.md");
const manifestPath = path.join(repoRoot, "benchmarks", "runs", "2026-05-17-batch-01", "manifest.json");
const statusRel = "research/status/2026-05-17-06-ofone-batch01-independent-review.md";
const statusPath = path.join(repoRoot, statusRel);
const resultRel = "research/results/2026-05-17-06-ofone-batch01-independent-review-result.md";
const run07StatusRel = "research/status/2026-05-17-07-ofone-post-run06-hardening-review.md";
const run07StatusPath = path.join(repoRoot, run07StatusRel);
const run07ResultRel = "research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md";
const loopRel = "research/recursive-improvement-loop.md";
const loopPath = path.join(repoRoot, loopRel);

const diagnostics = [];

const tracker = readText(trackerPath, "research tracker");
const manifest = readJson(manifestPath, "batch 01 manifest");
const status = readText(statusPath, "run 06 status ledger");
const run07Status = readText(run07StatusPath, "run 07 status ledger");
const loopDoc = readText(loopPath, "recursive improvement loop");

if (tracker && manifest && status) {
  validateRun06Status({ tracker, manifest, status });
}
if (tracker && run07Status) {
  validateRun07Status({ tracker, status: run07Status });
}
if (tracker && loopDoc) {
  validateRecursiveLoop({ tracker, loopDoc });
}

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");

if (jsonOutput) {
  console.log(JSON.stringify({ passed, diagnostics }, null, 2));
} else {
  console.log(`${passed ? "PASS" : "FAIL"} OfOne research lifecycle`);
  for (const diagnostic of diagnostics) {
    const prefix = diagnostic.severity === "error" ? "ERROR" : "OK";
    console.log(`- ${prefix} ${diagnostic.code}: ${diagnostic.message}`);
  }
}

process.exit(passed ? 0 : 1);

function validateRun06Status({ tracker, manifest, status }) {
  const reviewPlan = manifest.review_plan || {};
  const url = "https://chatgpt.com/c/6a0a5901-a7fc-83e8-895c-300476365f93";
  const lifecycle = reviewPlan.independent_review_status || "not_prepared";
  const expectedTrackerState = lifecycle === "launched" ? "active_researching" : lifecycle;
  const trackerRow = tracker.split("\n").find((line) => line.startsWith("| 06 |")) || "";

  check(
    trackerRow.includes("| OfOne Batch 01 Independent Review |") &&
      trackerRow.includes(`| ${expectedTrackerState} |`) &&
      trackerRow.includes(`| ${url} |`),
    "OFONE_RESEARCH_TRACKER_ROW",
    `tracker Run 06 row is ${expectedTrackerState} with the expected ChatGPT URL`
  );
  check(
    tracker.includes(statusRel),
    "OFONE_RESEARCH_STATUS_LEDGER_LINK",
    "tracker links the run-scoped status ledger"
  );
  check(
    ["launched", "harvested", "accepted", "integrated"].includes(lifecycle),
    "OFONE_RESEARCH_MANIFEST_STATUS",
    `manifest independent_review_status is a tracked lifecycle state (${lifecycle})`
  );
  check(
    reviewPlan.independent_review_url === url,
    "OFONE_RESEARCH_MANIFEST_URL",
    "manifest independent_review_url matches the live Run 06 conversation"
  );
  check(
    reviewPlan.independent_review_status_ledger === statusRel,
    "OFONE_RESEARCH_MANIFEST_STATUS_LEDGER",
    "manifest points to the run-scoped status ledger"
  );
  check(
    status.includes("Run ID: 06") && status.includes(`Lifecycle state: ${expectedTrackerState}`),
    "OFONE_RESEARCH_STATUS_STATE",
    `run-scoped ledger identifies Run 06 and lifecycle state ${expectedTrackerState}`
  );
  check(
    status.includes(`Conversation URL: ${url}`),
    "OFONE_RESEARCH_STATUS_URL",
    "run-scoped ledger records the live conversation URL"
  );
  validateLifecycleBoundary({ reviewPlan, status, lifecycle, resultRel });

  const latestStatusTimestamp = latestTimestamp(status);
  check(
    latestStatusTimestamp && tracker.includes(latestStatusTimestamp),
    "OFONE_RESEARCH_TRACKER_STATUS_SYNC",
    "tracker records the latest run-scoped status timestamp"
  );

  const resultPath = path.join(repoRoot, resultRel);
  if (lifecycle === "launched") {
    check(
      !fs.existsSync(resultPath),
      "OFONE_RESEARCH_NO_PREMATURE_RESULT",
      "Run 06 has no harvested result file while lifecycle state is active_researching"
    );
  } else {
    check(
      fs.existsSync(resultPath),
      "OFONE_RESEARCH_RESULT_PRESENT",
      `Run 06 harvested result file exists for lifecycle state ${lifecycle}`
    );
    check(
      reviewPlan.independent_review_result === resultRel,
      "OFONE_RESEARCH_MANIFEST_RESULT",
      "manifest points to the harvested Run 06 result"
    );
  }
}

function validateRun07Status({ tracker, status }) {
  const url = "https://chatgpt.com/c/6a0a6259-357c-83e8-b67a-6db72e4af30a";
  const trackerRow = tracker.split("\n").find((line) => line.startsWith("| 07 |")) || "";
  const resultPath = path.join(repoRoot, run07ResultRel);

  check(
    trackerRow.includes("| OfOne Post-Run06 Benchmark Hardening Review |") &&
      trackerRow.includes("| active_researching |") &&
      trackerRow.includes(`| ${url} |`),
    "OFONE_RESEARCH_RUN07_TRACKER_ROW",
    "tracker Run 07 row is active_researching with the expected ChatGPT URL"
  );
  check(
    tracker.includes(run07StatusRel),
    "OFONE_RESEARCH_RUN07_STATUS_LEDGER_LINK",
    "tracker links the Run 07 status ledger"
  );
  check(
    status.includes("Run ID: 07") &&
      status.includes("Lifecycle state: active_researching") &&
      status.includes(`Conversation URL: ${url}`),
    "OFONE_RESEARCH_RUN07_STATUS_STATE",
    "Run 07 ledger identifies the active Deep Research conversation"
  );
  check(
    status.includes("Pasted markdown.md") &&
      status.includes("OfOne Run07 hardening review") &&
      status.includes("Researching...") &&
      status.includes("Stop research"),
    "OFONE_RESEARCH_RUN07_LAUNCH_PROOF",
    "Run 07 ledger preserves launch proof and active research affordances"
  );
  check(
    status.includes("Identifying the rerun gap in current process...") &&
      tracker.includes("Identifying the rerun gap in current process..."),
    "OFONE_RESEARCH_RUN07_MATERIAL_STATUS_SYNC",
    "Run 07 latest material status is recorded in both ledger and tracker"
  );
  check(
    status.includes("Report is not ready to harvest") &&
      status.includes(run07ResultRel) &&
      !fs.existsSync(resultPath),
    "OFONE_RESEARCH_RUN07_HARVEST_BOUNDARY",
    "Run 07 remains unharvested while active research is still visible"
  );
}

function validateRecursiveLoop({ tracker, loopDoc }) {
  check(
    tracker.includes("OfOne Post-Run06 Benchmark Hardening Review") &&
      tracker.includes("active_researching"),
    "OFONE_RESEARCH_LOOP_ACTIVE_RUN",
    "tracker exposes the current active recursive research run"
  );
  check(
    loopDoc.includes("The loop may stay alive under a heartbeat") &&
      loopDoc.includes("observe -> harvest -> adjudicate -> implement -> verify -> publish -> resubmit -> observe"),
    "OFONE_RESEARCH_LOOP_STATE_MACHINE",
    "recursive loop doc distinguishes standing heartbeat from bounded cycle state"
  );
  check(
    loopDoc.includes("A follow-on run is not launched until accepted findings have been implemented") &&
      loopDoc.includes("active external run still researching -> update ledger only on material status change"),
    "OFONE_RESEARCH_LOOP_RESUBMIT_GUARD",
    "recursive loop doc prevents relaunch before implementation/publication or while a run is active"
  );
  check(
    loopDoc.includes("## Active Research Watchdog") &&
      loopDoc.includes("Material progress means at least one visible research-state field changed") &&
      loopDoc.includes("The default stall threshold is 15 minutes") &&
      loopDoc.includes("stop-control still present -> do not stop, relaunch, or open a replacement run"),
    "OFONE_RESEARCH_LOOP_WATCHDOG",
    "recursive loop doc distinguishes active-run observation, material progress, stall notes, and relaunch prevention"
  );
  check(
    loopDoc.includes(run07StatusRel) &&
      loopDoc.includes(run07ResultRel),
    "OFONE_RESEARCH_LOOP_CURRENT_RUN",
    "recursive loop doc points to the active Run 07 ledger and result target"
  );
}

function validateLifecycleBoundary({ reviewPlan, status, lifecycle, resultRel }) {
  check(
    status.includes("Pasted text(8).txt") &&
      status.includes("Independent OfOne Batch 01 Review") &&
      status.includes("Researching...") &&
      status.includes("Stop research"),
    "OFONE_RESEARCH_LAUNCH_PROOF",
    "run-scoped ledger preserves launch proof and active research affordances"
  );

  if (lifecycle === "launched") {
    check(
      status.includes("Report is not ready to harvest") &&
        status.includes(resultRel),
      "OFONE_RESEARCH_HARVEST_BOUNDARY",
      "run-scoped ledger keeps the harvest boundary and target result path explicit"
    );
    return;
  }

  check(
    status.includes("Research completed in 13m") &&
      status.includes(resultRel) &&
      status.includes("full_ofone: reject"),
    "OFONE_RESEARCH_HARVEST_PROOF",
    "run-scoped ledger records harvest proof and independent adjudication"
  );
  if (lifecycle === "integrated") {
    check(
      Boolean(reviewPlan.independent_review_integration) &&
        status.includes("Lifecycle state: integrated"),
      "OFONE_RESEARCH_INTEGRATION_PROOF",
      "Run 06 integration state is recorded in manifest and ledger"
    );
  }
}

function readText(filePath, label) {
  if (!fs.existsSync(filePath)) {
    diagnostics.push({
      severity: "error",
      code: "OFONE_RESEARCH_FILE_MISSING",
      message: `${label} missing at ${path.relative(repoRoot, filePath)}`
    });
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath, label) {
  const text = readText(filePath, label);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    diagnostics.push({
      severity: "error",
      code: "OFONE_RESEARCH_JSON_PARSE",
      message: `${label} is not valid JSON: ${error.message}`
    });
    return null;
  }
}

function latestTimestamp(text) {
  const matches = [...text.matchAll(/\b2026-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}\b/g)].map((match) => match[0]);
  return matches.at(-1);
}

function check(condition, code, message) {
  diagnostics.push({
    severity: condition ? "info" : "error",
    code,
    message
  });
}
