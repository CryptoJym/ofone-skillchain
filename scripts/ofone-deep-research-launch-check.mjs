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
const reportSchemaRel = "schemas/ofone.deep-research-extension-report.schema.json";
const manualRecoverySchemaRel = "schemas/ofone.deep-research-manual-recovery.schema.json";
const queueRel = "research/deep-research-launch-queue.json";
const payloadRel = "research/deep-research-extension-payloads.json";
const reportRel = "research/deep-research-extension-report.json";
const manualRecoveryRel = "research/deep-research-manual-recovery.json";
const payloadScriptRel = "scripts/ofone-deep-research-extension-payloads.mjs";
const reportScriptRel = "scripts/ofone-deep-research-extension-report-check.mjs";
const manualRecoveryScriptRel = "scripts/ofone-deep-research-manual-recovery.mjs";
const contractRel = "research/chrome-extension-deep-research-contract.md";
const trackerRel = "research/TRACKER.md";
const loopRel = "research/recursive-improvement-loop.md";
const statusRel = "research/status/2026-05-17-07-ofone-post-run06-hardening-review.md";
const chromeBlockedStatus = "prepared_blocked_chrome_extension_unavailable";
const chromeActiveStatus = "active_researching";
const chromeObservationBlockedStatus = "observation_blocked";
const chromeCompletedVisibleStatus = "completed_report_visible";
const chromeReviewedStatus = "reviewed";
const chromeHarvestedStatus = "harvested";

const diagnostics = [];

const schema = readJson(schemaRel, "launch queue schema");
const payloadSchema = readJson(payloadSchemaRel, "extension payload schema");
const reportSchema = readJson(reportSchemaRel, "extension report schema");
const manualRecoverySchema = readJson(manualRecoverySchemaRel, "manual recovery schema");
const queue = readJson(queueRel, "launch queue");
const payloads = readJson(payloadRel, "extension payloads");
const report = readJson(reportRel, "extension report");
const manualRecovery = readJson(manualRecoveryRel, "manual recovery plan");
const contract = readText(contractRel, "Chrome extension contract");
const payloadScript = readText(payloadScriptRel, "extension payload generator");
const reportScript = readText(reportScriptRel, "extension report checker");
const manualRecoveryScript = readText(manualRecoveryScriptRel, "manual recovery checker");
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

if (reportSchema && report) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(reportSchema);
  const valid = validate(report);
  check(
    valid,
    "OFONE_DEEP_RESEARCH_EXTENSION_REPORT_SCHEMA",
    valid ? "extension report matches schema" : `extension report schema errors: ${formatAjvErrors(validate.errors)}`
  );
}

if (manualRecoverySchema && manualRecovery) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(manualRecoverySchema);
  const valid = validate(manualRecovery);
  check(
    valid,
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_SCHEMA",
    valid ? "manual recovery plan matches schema" : `manual recovery schema errors: ${formatAjvErrors(validate.errors)}`
  );
}

if (queue && payloads && report && manualRecovery && contract && tracker && loop && statusLedger && payloadScript && reportScript && manualRecoveryScript) {
  validateLaunchSurfacePolicy(queue);
  validateQueueItems(queue);
  validateExtensionPayloads(queue, payloads);
  validateExtensionReport(queue, payloads, report, reportScript);
  validateManualRecovery(queue, payloads, report, manualRecovery);
  validatePublishedContract({ queue, contract, tracker, loop, statusLedger, payloadScript, reportScript, manualRecoveryScript });
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
      policy.unavailable_diagnostic_required === true &&
      policy.blocked_status === chromeBlockedStatus,
    "OFONE_DEEP_RESEARCH_CHROME_POLICY",
    "launch queue requires Chrome extension isolated tabs, bars desktop automation fallback, and requires diagnostics before blocked state"
  );
}

function validateQueueItems(queue) {
  for (const item of queue.items || []) {
    const packet = readText(item.packet_path, `${item.item_id} packet`);
    const reviewed = item.status === chromeReviewedStatus;
    const completedVisible = item.status === chromeCompletedVisibleStatus;
    check(
      (reviewed || item.status === chromeActiveStatus || completedVisible) &&
        (item.blocked_reason.includes("Resolved: Chrome extension plugin control is available") ||
          item.blocked_reason.includes("Completed report visible through Chrome extension control")) &&
        item.disallowed_surfaces.includes("Computer Use") &&
        item.disallowed_surfaces.includes("generic desktop automation") &&
        item.aggregate_policy === (reviewed ? "aggregate_eligible_after_review" : "not_eligible_until_harvest_review_publication") &&
        item.conversation_url?.startsWith("https://chatgpt.com/c/") &&
        item.launch_proof_path === reportRel,
      "OFONE_DEEP_RESEARCH_ACTIVE_ITEM",
      `${item.item_id} is tracked through Chrome extension launch proof with the expected current eligibility state`
    );
    if (!packet) continue;
    check(
      [chromeActiveStatus, chromeObservationBlockedStatus, chromeCompletedVisibleStatus, chromeHarvestedStatus, chromeReviewedStatus].some((status) =>
        packet.includes(`Status: \`${status}\``)
      ) &&
        packet.includes(item.prompt_anchor) &&
        packet.includes(item.item_id) &&
        packet.includes("generic desktop automation are not fallback launch paths") &&
        packet.includes(item.conversation_url),
      "OFONE_DEEP_RESEARCH_PACKET_BINDING",
      `${item.item_id} queue item binds to the Chrome-extension packet, observation state, and prompt anchor`
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
    const launchable = ["prepared_not_launched", "launched", chromeActiveStatus].includes(item.status);
    const harvestVisible = item.status === chromeCompletedVisibleStatus;
    const completed = ["harvested", chromeReviewedStatus, "rejected"].includes(item.status);
    check(
      Boolean(payload) &&
        payload.status === item.status &&
        payload.launch_allowed === launchable &&
        payload.extension_action === (launchable
          ? "open_isolated_deep_research_tab"
          : harvestVisible
            ? "harvest_completed_report"
            : completed
              ? "no_extension_action_completed"
              : "wait_for_callable_chrome_extension_control") &&
        payload.launch_blocked_reason === (launchable ? null : item.blocked_reason) &&
        payload.packet_sha256 === `sha256:${sha256(packet)}` &&
        payload.prompt_text_sha256 === `sha256:${sha256(promptText)}` &&
        promptText.includes(`Run ID: \`${item.item_id}\``) &&
        promptText.includes("# Benchmark Raw Output") &&
        payload.expected_output_path === item.expected_output_path &&
        payload.expected_review_path === item.expected_review_path &&
        payload.isolation?.no_cross_arm_visibility_until_raw_harvest === true,
      "OFONE_DEEP_RESEARCH_PAYLOAD_ITEM",
      `${item.item_id} has an extension-launched prompt payload bound to the current packet`
    );
  }
}

function validateExtensionReport(queue, payloads, report, reportScript) {
  const payloadText = readText(payloadRel, "extension payload hash source");
  const reportById = new Map((report.items || []).map((item) => [item.item_id, item]));
  check(
    report.payload_path === payloadRel &&
      report.payload_sha256 === `sha256:${sha256(payloadText)}` &&
      report.extension_availability?.callable_namespace === "mcp__node_repl__js" &&
      report.extension_availability?.available_backends?.includes("chrome") &&
      report.extension_availability?.browser_global_present === true &&
      report.extension_availability?.browser_id === "extension" &&
      report.extension_availability?.tab_operations?.includes("list") &&
      report.extension_availability?.tabs_list_ok === true &&
      report.extension_availability?.diagnosis === "available" &&
      report.items?.length === payloads.items?.length,
    "OFONE_DEEP_RESEARCH_EXTENSION_REPORT_BINDING",
    "extension report binds to the current payload file and item count"
  );

  for (const item of queue.items || []) {
    const payload = (payloads.items || []).find((candidate) => candidate.item_id === item.item_id);
    const reportItem = reportById.get(item.item_id);
    const harvested = reportItem?.status === chromeHarvestedStatus;
    const completedVisible = reportItem?.status === chromeCompletedVisibleStatus;
    check(
      Boolean(reportItem) &&
        reportItem.tab_lane === payload?.tab_lane &&
        [chromeActiveStatus, chromeObservationBlockedStatus, chromeCompletedVisibleStatus, chromeHarvestedStatus].includes(reportItem.status) &&
        reportItem.extension_control?.surface === "chrome_extension_plugin" &&
        reportItem.extension_control?.callable_namespace?.includes("mcp__node_repl__js") &&
        reportItem.extension_control?.isolated_tab_verified === true &&
        reportItem.extension_control?.desktop_automation_used === false &&
        reportItem.launch_proof?.conversation_url === item.conversation_url &&
        reportItem.launch_proof?.deep_research_enabled === true &&
        reportItem.launch_proof?.stop_control_visible === true &&
        reportItem.aggregate_policy_after_report === (harvested ? "eligible_only_after_local_review_and_publication" : "not_eligible_until_harvest_review_publication") &&
        (reportItem.status !== chromeObservationBlockedStatus ||
          (reportItem.latest_observation?.iframe_present === true &&
            reportItem.latest_observation?.completed_report_visible === false &&
            reportItem.latest_observation?.next_action === "observe_again_without_relaunch")) &&
        (harvested
          ? reportItem.latest_observation?.completed_report_visible === true &&
            reportItem.harvest_proof?.completed_report_visible === true
          : completedVisible
            ? reportItem.latest_observation?.completed_report_visible === true &&
              reportItem.latest_observation?.response_text_available === false &&
              reportItem.latest_observation?.next_action === "operator_manual_recovery_required" &&
              Array.isArray(reportItem.harvest_probe_attempts) &&
              reportItem.harvest_probe_attempts.length >= 5 &&
              reportItem.harvest_probe_attempts.every((probe) => probe.surface === "chrome_extension_plugin" && probe.allowed_by_contract === true) &&
              !reportItem.harvest_proof
          : !reportItem.harvest_proof),
      "OFONE_DEEP_RESEARCH_EXTENSION_REPORT_ITEM",
      `${item.item_id} extension report preserves Chrome-extension launch proof and the expected harvest boundary`
    );
  }

  check(
      reportScript.includes("OFONE_DEEP_RESEARCH_EXTENSION_REPORT_BINDING") &&
      reportScript.includes("OFONE_DEEP_RESEARCH_EXTENSION_AVAILABILITY_DIAGNOSTIC") &&
      reportScript.includes("OFONE_DEEP_RESEARCH_EXTENSION_LAUNCH_PROOF") &&
      reportScript.includes("OFONE_DEEP_RESEARCH_EXTENSION_COMPLETED_VISIBLE_ITEM") &&
      reportScript.includes("OFONE_DEEP_RESEARCH_EXTENSION_HARVEST_PROBE_ATTEMPTS") &&
      reportScript.includes("OFONE_DEEP_RESEARCH_EXTENSION_HARVEST_PROOF") &&
      reportScript.includes("desktop_automation_used === false"),
    "OFONE_DEEP_RESEARCH_EXTENSION_REPORT_CHECKER",
    "extension report checker gates blocked, launched, and harvested states on machine-checkable proof"
  );
}

function validateManualRecovery(queue, payloads, report, manualRecovery) {
  const reportText = readText(reportRel, "extension report hash source for manual recovery");
  const queueText = readText(queueRel, "launch queue hash source for manual recovery");
  const payloadText = readText(payloadRel, "extension payload hash source for manual recovery");
  const itemId = "2026-05-17-batch-01__case-formal-proof-search-001__light_structured__frontier_reasoning__r1";
  const recoveryItem = (manualRecovery.items || []).find((item) => item.item_id === itemId);
  const reportItem = (report.items || []).find((item) => item.item_id === itemId);
  const queueItem = (queue.items || []).find((item) => item.item_id === itemId);
  const payloadItem = (payloads.items || []).find((item) => item.item_id === itemId);
  const rawExists = recoveryItem ? fs.existsSync(path.join(repoRoot, recoveryItem.expected_raw_output_path)) : false;
  const reviewExists = recoveryItem ? fs.existsSync(path.join(repoRoot, recoveryItem.expected_review_path)) : false;
  check(
    manualRecovery.report_path === reportRel &&
      manualRecovery.report_sha256 === `sha256:${sha256(reportText)}` &&
      manualRecovery.queue_path === queueRel &&
      manualRecovery.queue_sha256 === `sha256:${sha256(queueText)}` &&
      manualRecovery.payload_path === payloadRel &&
      manualRecovery.payload_sha256 === `sha256:${sha256(payloadText)}` &&
      recoveryItem?.status === "awaiting_operator_export" &&
      recoveryItem?.blocked_status === chromeCompletedVisibleStatus &&
      recoveryItem?.conversation_url === queueItem?.conversation_url &&
      reportItem?.status === chromeCompletedVisibleStatus &&
      reportItem?.latest_observation?.next_action === "operator_manual_recovery_required" &&
      payloadItem?.extension_action === "harvest_completed_report" &&
      recoveryItem?.promotion_gate?.aggregate_eligible_before_review_publication === false &&
      recoveryItem?.forbidden_recovery_methods?.includes("OCR or screenshot reconstruction") &&
      !rawExists &&
      !reviewExists,
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_GATE",
    "manual recovery plan preserves the completed-visible blocker without raw output, local review, or aggregate eligibility"
  );
}

function validatePublishedContract({ queue, contract, tracker, loop, statusLedger, payloadScript, reportScript, manualRecoveryScript }) {
  check(
    contract.includes(queueRel) &&
      contract.includes(payloadRel) &&
      contract.includes(reportRel) &&
      contract.includes(manualRecoveryRel) &&
      contract.includes(schemaRel) &&
      contract.includes(reportSchemaRel) &&
      contract.includes(manualRecoverySchemaRel) &&
      contract.includes("npm run deep-research:check") &&
      contract.includes("npm run deep-research:payloads") &&
      contract.includes("npm run deep-research:report") &&
      contract.includes("npm run deep-research:manual-recovery") &&
      contract.includes("multiple tabs concurrently") &&
      contract.includes("troubleshoot extension availability") &&
      contract.includes("Browser, Computer Use, coordinate clicking, AppleScript/JXA, and generic desktop automation are not fallbacks"),
    "OFONE_DEEP_RESEARCH_CONTRACT_DOC",
    "contract documents queue, payloads, report intake, schemas, checkers, parallel isolated tabs, and blocked fallback surfaces"
  );
  check(
    tracker.includes(queueRel) &&
      tracker.includes(payloadRel) &&
      tracker.includes(reportRel) &&
      tracker.includes(manualRecoveryRel) &&
      tracker.includes(contractRel) &&
      tracker.includes("Chrome-extension launch queue"),
    "OFONE_DEEP_RESEARCH_TRACKER_LINK",
    "tracker links the Chrome-extension launch queue, payloads, report, and contract"
  );
  check(
    loop.includes(queueRel) &&
      loop.includes(payloadRel) &&
      loop.includes(reportRel) &&
      loop.includes(manualRecoveryRel) &&
      loop.includes(contractRel) &&
      loop.includes("launch queue") &&
      (loop.includes("Do not use Browser, Computer Use, coordinate clicking, AppleScript/JXA, or generic desktop automation as fallback") ||
        loop.includes("do not use Browser, Computer Use, coordinate clicking, AppleScript/JXA, or generic desktop automation as fallback")),
    "OFONE_DEEP_RESEARCH_LOOP_LINK",
    "recursive loop points to the extension queue/payloads/report and preserves fallback ban"
  );
  check(
    statusLedger.includes(queueRel) &&
      statusLedger.includes(payloadRel) &&
      statusLedger.includes(reportRel) &&
      statusLedger.includes(manualRecoveryRel) &&
      statusLedger.includes(contractRel) &&
      statusLedger.includes("parallel Deep Research packets"),
    "OFONE_DEEP_RESEARCH_STATUS_LEDGER_LINK",
    "Run 07 status ledger records the extension queue, payload, and report hardening"
  );
  check(
    payloadScript.includes("extractPromptBlock") &&
      payloadScript.includes("one_item_per_tab") &&
      payloadScript.includes("harvest_completed_report") &&
      payloadScript.includes("wait_for_callable_chrome_extension_control") &&
      payloadScript.includes("no_cross_arm_visibility_until_raw_harvest"),
    "OFONE_DEEP_RESEARCH_PAYLOAD_GENERATOR",
    "payload generator extracts exact prompt blocks and preserves extension isolation semantics"
  );
  check(
      reportScript.includes("extension report matches schema") &&
      reportScript.includes("raw_output_sha256") &&
      reportScript.includes("completed report is visible but remains unharvested") &&
      reportScript.includes("completed-visible blocker is backed by allowed Chrome-extension harvest probes") &&
      reportScript.includes("OFONE_DEEP_RESEARCH_EXTENSION_LATEST_OBSERVATION") &&
      reportScript.includes("not_eligible_until_harvest_review_publication"),
    "OFONE_DEEP_RESEARCH_REPORT_CHECKER_DOC",
    "report checker verifies active launch state and future harvested raw-output hash proof"
  );
  check(
    manualRecoveryScript.includes("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_BINDING") &&
      manualRecoveryScript.includes("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_SOURCE_MARKERS") &&
      manualRecoveryScript.includes("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_AWAITING_STATE") &&
      manualRecoveryScript.includes("OCR or screenshot reconstruction") &&
      manualRecoveryScript.includes("aggregate-eligible before raw output, review, state update, commit, push, and Pages parity"),
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_CHECKER",
    "manual recovery checker validates source markers and keeps the blocked item out of harvested or aggregate states"
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
