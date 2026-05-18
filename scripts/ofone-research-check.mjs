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

const diagnostics = [];

const tracker = readText(trackerPath, "research tracker");
const manifest = readJson(manifestPath, "batch 01 manifest");
const status = readText(statusPath, "run 06 status ledger");

if (tracker && manifest && status) {
  validateRun06Status({ tracker, manifest, status });
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
  const rowPattern = /\|\s*06\s*\|\s*OfOne Batch 01 Independent Review\s*\|\s*benchmark\s*\|\s*active_researching\s*\|\s*https:\/\/chatgpt\.com\/c\/6a0a5901-a7fc-83e8-895c-300476365f93\s*\|/;

  check(
    rowPattern.test(tracker),
    "OFONE_RESEARCH_TRACKER_ROW",
    "tracker Run 06 row is active_researching with the expected ChatGPT URL"
  );
  check(
    tracker.includes(statusRel),
    "OFONE_RESEARCH_STATUS_LEDGER_LINK",
    "tracker links the run-scoped status ledger"
  );
  check(
    reviewPlan.independent_review_status === "launched",
    "OFONE_RESEARCH_MANIFEST_STATUS",
    "manifest keeps independent_review_status at launched while the external run is active"
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
    status.includes("Run ID: 06") && status.includes("Lifecycle state: active_researching"),
    "OFONE_RESEARCH_STATUS_STATE",
    "run-scoped ledger identifies Run 06 and lifecycle state active_researching"
  );
  check(
    status.includes(`Conversation URL: ${url}`),
    "OFONE_RESEARCH_STATUS_URL",
    "run-scoped ledger records the live conversation URL"
  );
  check(
    status.includes("Pasted text(8).txt") &&
      status.includes("Independent OfOne Batch 01 Review") &&
      status.includes("Researching...") &&
      status.includes("Stop research"),
    "OFONE_RESEARCH_LAUNCH_PROOF",
    "run-scoped ledger preserves launch proof and active research affordances"
  );
  check(
    status.includes("Report is not ready to harvest") &&
      status.includes(resultRel),
    "OFONE_RESEARCH_HARVEST_BOUNDARY",
    "run-scoped ledger keeps the harvest boundary and target result path explicit"
  );

  const latestStatusTimestamp = latestTimestamp(status);
  check(
    latestStatusTimestamp && tracker.includes(latestStatusTimestamp),
    "OFONE_RESEARCH_TRACKER_STATUS_SYNC",
    "tracker records the latest run-scoped status timestamp"
  );

  const resultPath = path.join(repoRoot, resultRel);
  check(
    !fs.existsSync(resultPath),
    "OFONE_RESEARCH_NO_PREMATURE_RESULT",
    "Run 06 has no harvested result file while lifecycle state is active_researching"
  );
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
