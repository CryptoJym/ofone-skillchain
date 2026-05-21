#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const schemaRel = "schemas/ofone.deep-research-launch.schema.json";
const queueRel = "research/deep-research-launch-queue.json";
const contractRel = "research/chrome-extension-deep-research-contract.md";
const trackerRel = "research/TRACKER.md";
const loopRel = "research/recursive-improvement-loop.md";
const statusRel = "research/status/2026-05-17-07-ofone-post-run06-hardening-review.md";
const chromeBlockedStatus = "prepared_blocked_chrome_extension_unavailable";

const diagnostics = [];

const schema = readJson(schemaRel, "launch queue schema");
const queue = readJson(queueRel, "launch queue");
const contract = readText(contractRel, "Chrome extension contract");
const tracker = readText(trackerRel, "research tracker");
const loop = readText(loopRel, "recursive loop");
const statusLedger = readText(statusRel, "Run 07 status ledger");

if (schema && queue) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(queue);
  check(
    valid,
    "OFONE_DEEP_RESEARCH_QUEUE_SCHEMA",
    valid ? "launch queue matches schema" : `launch queue schema errors: ${formatAjvErrors(validate.errors)}`
  );
}

if (queue && contract && tracker && loop && statusLedger) {
  validateLaunchSurfacePolicy(queue);
  validateQueueItems(queue);
  validatePublishedContract({ queue, contract, tracker, loop, statusLedger });
}

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");
console.log(`${passed ? "PASS" : "FAIL"} OfOne Deep Research launch queue`);
for (const diagnostic of diagnostics) {
  const prefix = diagnostic.severity === "error" ? "ERROR" : "OK";
  console.log(`- ${prefix} ${diagnostic.code}: ${diagnostic.message}`);
}
process.exit(passed ? 0 : 1);

function validateLaunchSurfacePolicy(queue) {
  const policy = queue.launch_surface_policy || {};
  check(
    policy.primary_surface === "chrome_extension_plugin" &&
      policy.requires_isolated_tab === true &&
      policy.supports_parallel_tabs === true &&
      policy.desktop_automation_fallback_allowed === false &&
      policy.blocked_status === chromeBlockedStatus,
    "OFONE_DEEP_RESEARCH_CHROME_POLICY",
    "launch queue requires Chrome extension isolated tabs and bars desktop automation fallback"
  );
}

function validateQueueItems(queue) {
  for (const item of queue.items || []) {
    const packet = readText(item.packet_path, `${item.item_id} packet`);
    check(
      item.status === chromeBlockedStatus &&
        item.blocked_reason.includes("Chrome extension/plugin") &&
        item.disallowed_surfaces.includes("Computer Use") &&
        item.disallowed_surfaces.includes("generic desktop automation") &&
        item.aggregate_policy === "not_eligible_until_harvest_review_publication" &&
        !item.conversation_url,
      "OFONE_DEEP_RESEARCH_BLOCKED_ITEM",
      `${item.item_id} remains blocked, unlaunched, and aggregate-ineligible`
    );
    if (!packet) continue;
    check(
      packet.includes(`Status: \`${chromeBlockedStatus}\``) &&
        packet.includes(item.prompt_anchor) &&
        packet.includes(item.item_id) &&
        packet.includes("generic desktop automation are not fallback launch paths"),
      "OFONE_DEEP_RESEARCH_PACKET_BINDING",
      `${item.item_id} queue item binds to the prepared blocked packet and prompt anchor`
    );
  }
}

function validatePublishedContract({ queue, contract, tracker, loop, statusLedger }) {
  check(
    contract.includes(queueRel) &&
      contract.includes(schemaRel) &&
      contract.includes("npm run deep-research:check") &&
      contract.includes("multiple tabs concurrently") &&
      contract.includes("Browser, Computer Use, coordinate clicking, AppleScript/JXA, and generic desktop automation are not fallbacks"),
    "OFONE_DEEP_RESEARCH_CONTRACT_DOC",
    "contract documents queue, schema, checker, parallel isolated tabs, and blocked fallback surfaces"
  );
  check(
    tracker.includes(queueRel) &&
      tracker.includes(contractRel) &&
      tracker.includes("Chrome-extension launch queue"),
    "OFONE_DEEP_RESEARCH_TRACKER_LINK",
    "tracker links the Chrome-extension launch queue and contract"
  );
  check(
    loop.includes(queueRel) &&
      loop.includes(contractRel) &&
      loop.includes("launch queue") &&
      loop.includes("Do not use Browser, Computer Use, coordinate clicking, AppleScript/JXA, or generic desktop automation as fallback"),
    "OFONE_DEEP_RESEARCH_LOOP_LINK",
    "recursive loop points to the extension queue and preserves fallback ban"
  );
  check(
    statusLedger.includes(queueRel) &&
      statusLedger.includes(contractRel) &&
      statusLedger.includes("parallel Deep Research packets"),
    "OFONE_DEEP_RESEARCH_STATUS_LEDGER_LINK",
    "Run 07 status ledger records the extension queue hardening"
  );
}

function readText(relPath, label) {
  const filePath = path.join(repoRoot, relPath);
  if (!fs.existsSync(filePath)) {
    diagnostics.push({
      severity: "error",
      code: "OFONE_DEEP_RESEARCH_FILE_MISSING",
      message: `${label} missing at ${relPath}`
    });
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(relPath, label) {
  const text = readText(relPath, label);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    diagnostics.push({
      severity: "error",
      code: "OFONE_DEEP_RESEARCH_JSON_INVALID",
      message: `${label} is not valid JSON: ${error.message}`
    });
    return null;
  }
}

function check(condition, code, message) {
  diagnostics.push({
    severity: condition ? "info" : "error",
    code,
    message
  });
}

function formatAjvErrors(errors) {
  return (errors || [])
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
}
