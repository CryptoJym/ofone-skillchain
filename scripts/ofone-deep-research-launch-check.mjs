#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const schemaRel = "schemas/ofone.deep-research-launch.schema.json";
const payloadSchemaRel = "schemas/ofone.deep-research-extension-payloads.schema.json";
const queueRel = "research/deep-research-launch-queue.json";
const payloadRel = "research/deep-research-extension-payloads.json";
const payloadScriptRel = "scripts/ofone-deep-research-extension-payloads.mjs";
const contractRel = "research/chrome-extension-deep-research-contract.md";
const trackerRel = "research/TRACKER.md";
const loopRel = "research/recursive-improvement-loop.md";
const statusRel = "research/status/2026-05-17-07-ofone-post-run06-hardening-review.md";
const chromeBlockedStatus = "prepared_blocked_chrome_extension_unavailable";

const diagnostics = [];

const schema = readJson(schemaRel, "launch queue schema");
const payloadSchema = readJson(payloadSchemaRel, "extension payload schema");
const queue = readJson(queueRel, "launch queue");
const payloads = readJson(payloadRel, "extension payloads");
const contract = readText(contractRel, "Chrome extension contract");
const payloadScript = readText(payloadScriptRel, "extension payload generator");
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

if (payloadSchema && payloads) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(payloadSchema);
  const valid = validate(payloads);
  check(
    valid,
    "OFONE_DEEP_RESEARCH_PAYLOAD_SCHEMA",
    valid ? "extension payloads match schema" : `extension payload schema errors: ${formatAjvErrors(validate.errors)}`
  );
}

if (queue && payloads && contract && tracker && loop && statusLedger && payloadScript) {
  validateLaunchSurfacePolicy(queue);
  validateQueueItems(queue);
  validateExtensionPayloads(queue, payloads);
  validatePublishedContract({ queue, contract, tracker, loop, statusLedger, payloadScript });
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

function validateExtensionPayloads(queue, payloads) {
  const queueText = readText(queueRel, "launch queue hash source");
  const byItemId = new Map((payloads.items || []).map((item) => [item.item_id, item]));
  check(
    payloads.generated_from?.queue_path === queueRel &&
      payloads.generated_from?.queue_id === queue.queue_id &&
      payloads.generated_from?.queue_sha256 === `sha256:${sha256(queueText)}` &&
      payloads.concurrency_model?.one_item_per_tab === true &&
      payloads.concurrency_model?.isolated_conversation_per_item === true &&
      payloads.concurrency_model?.parallel_tabs_allowed === true,
    "OFONE_DEEP_RESEARCH_PAYLOAD_BINDING",
    "extension payloads bind to the launch queue and preserve isolated parallel-tab semantics"
  );

  for (const item of queue.items || []) {
    const payload = byItemId.get(item.item_id);
    const packet = readText(item.packet_path, `${item.item_id} packet payload source`);
    const promptText = payload?.prompt_text || "";
    check(
      Boolean(payload) &&
        payload.status === item.status &&
        payload.launch_allowed === false &&
        payload.extension_action === "wait_for_callable_chrome_extension_control" &&
        payload.launch_blocked_reason === item.blocked_reason &&
        payload.packet_sha256 === `sha256:${sha256(packet)}` &&
        payload.prompt_text_sha256 === `sha256:${sha256(promptText)}` &&
        promptText.includes(`Run ID: \`${item.item_id}\``) &&
        promptText.includes("# Benchmark Raw Output") &&
        payload.expected_output_path === item.expected_output_path &&
        payload.expected_review_path === item.expected_review_path &&
        payload.isolation?.no_cross_arm_visibility_until_raw_harvest === true,
      "OFONE_DEEP_RESEARCH_PAYLOAD_ITEM",
      `${item.item_id} has an extension-ready prompt payload while remaining blocked from launch`
    );
  }
}

function validatePublishedContract({ queue, contract, tracker, loop, statusLedger, payloadScript }) {
  check(
    contract.includes(queueRel) &&
      contract.includes(payloadRel) &&
      contract.includes(schemaRel) &&
      contract.includes("npm run deep-research:check") &&
      contract.includes("npm run deep-research:payloads") &&
      contract.includes("multiple tabs concurrently") &&
      contract.includes("Browser, Computer Use, coordinate clicking, AppleScript/JXA, and generic desktop automation are not fallbacks"),
    "OFONE_DEEP_RESEARCH_CONTRACT_DOC",
    "contract documents queue, payloads, schema, checkers, parallel isolated tabs, and blocked fallback surfaces"
  );
  check(
    tracker.includes(queueRel) &&
      tracker.includes(payloadRel) &&
      tracker.includes(contractRel) &&
      tracker.includes("Chrome-extension launch queue"),
    "OFONE_DEEP_RESEARCH_TRACKER_LINK",
    "tracker links the Chrome-extension launch queue, payloads, and contract"
  );
  check(
    loop.includes(queueRel) &&
      loop.includes(payloadRel) &&
      loop.includes(contractRel) &&
      loop.includes("launch queue") &&
      loop.includes("Do not use Browser, Computer Use, coordinate clicking, AppleScript/JXA, or generic desktop automation as fallback"),
    "OFONE_DEEP_RESEARCH_LOOP_LINK",
    "recursive loop points to the extension queue/payloads and preserves fallback ban"
  );
  check(
    statusLedger.includes(queueRel) &&
      statusLedger.includes(payloadRel) &&
      statusLedger.includes(contractRel) &&
      statusLedger.includes("parallel Deep Research packets"),
    "OFONE_DEEP_RESEARCH_STATUS_LEDGER_LINK",
    "Run 07 status ledger records the extension queue and payload hardening"
  );
  check(
    payloadScript.includes("extractPromptBlock") &&
      payloadScript.includes("one_item_per_tab") &&
      payloadScript.includes("wait_for_callable_chrome_extension_control") &&
      payloadScript.includes("no_cross_arm_visibility_until_raw_harvest"),
    "OFONE_DEEP_RESEARCH_PAYLOAD_GENERATOR",
    "payload generator extracts exact prompt blocks and preserves extension isolation semantics"
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

function sha256(text) {
  return crypto.createHash("sha256").update(text || "").digest("hex");
}
