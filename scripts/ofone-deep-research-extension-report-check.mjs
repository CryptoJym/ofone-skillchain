#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const schemaRel = "schemas/ofone.deep-research-extension-report.schema.json";
const reportRel = "research/deep-research-extension-report.json";
const payloadRel = "research/deep-research-extension-payloads.json";
const queueRel = "research/deep-research-launch-queue.json";
const chromeBlockedStatus = "prepared_blocked_chrome_extension_unavailable";

const diagnostics = [];

const schema = readJson(schemaRel, "extension report schema");
const report = readJson(reportRel, "extension report");
const payloads = readJson(payloadRel, "extension payloads");
const queue = readJson(queueRel, "launch queue");

if (schema && report) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(report);
  check(
    valid,
    "OFONE_DEEP_RESEARCH_EXTENSION_REPORT_SCHEMA",
    valid ? "extension report matches schema" : `extension report schema errors: ${formatAjvErrors(validate.errors)}`
  );
}

if (report && payloads && queue) {
  validateReportBinding(report, payloads, queue);
  validateExtensionAvailability(report);
  validateReportItems(report, payloads, queue);
}

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");
console.log(`${passed ? "PASS" : "FAIL"} OfOne Deep Research extension report`);
for (const diagnostic of diagnostics) {
  const prefix = diagnostic.severity === "error" ? "ERROR" : "OK";
  console.log(`- ${prefix} ${diagnostic.code}: ${diagnostic.message}`);
}
process.exit(passed ? 0 : 1);

function validateReportBinding(reportData, payloadData) {
  const payloadText = readText(payloadRel, "payload hash source");
  check(
    reportData.payload_path === payloadRel &&
      reportData.payload_sha256 === `sha256:${sha256(payloadText)}` &&
      reportData.items.length === payloadData.items.length,
    "OFONE_DEEP_RESEARCH_EXTENSION_REPORT_BINDING",
    "extension report binds to the current payload file and item count"
  );
}

function validateExtensionAvailability(reportData) {
  const diagnostic = reportData.extension_availability || {};
  check(
    diagnostic.callable_namespace === "mcp__node_repl__js" &&
      Array.isArray(diagnostic.request_meta_keys) &&
      diagnostic.request_meta_keys.includes("x-codex-browser-use-available-backends") &&
      Array.isArray(diagnostic.available_backends) &&
      diagnostic.available_backends.includes("chrome") &&
      diagnostic.browser_global_present === true &&
      diagnostic.tabs_list_ok === true &&
      Number.isInteger(diagnostic.tabs_observed) &&
      diagnostic.tabs_observed > 0 &&
      diagnostic.blocked_namespace === null &&
      diagnostic.diagnosis === "available",
    "OFONE_DEEP_RESEARCH_EXTENSION_AVAILABILITY_DIAGNOSTIC",
    "extension report records callable Chrome-extension availability before any launch or harvest state advances"
  );
}

function validateReportItems(reportData, payloadData, queueData) {
  const payloadById = new Map(payloadData.items.map((item) => [item.item_id, item]));
  const queueById = new Map(queueData.items.map((item) => [item.item_id, item]));
  for (const item of reportData.items) {
    const payload = payloadById.get(item.item_id);
    const queueItem = queueById.get(item.item_id);
    check(
      Boolean(payload) &&
        Boolean(queueItem) &&
        item.tab_lane === payload.tab_lane,
      "OFONE_DEEP_RESEARCH_EXTENSION_REPORT_ITEM_BINDING",
      `${item.item_id} report item maps to the queued payload lane`
    );

    if (item.status === "observed_blocked") {
      validateBlockedItem(item, payload, queueItem);
      continue;
    }
    validateLaunchItem(item, payload, queueItem);
    if (item.status === "observation_blocked") validateObservationBlockedItem(item);
    if (item.status === "completed_report_visible") validateCompletedReportVisibleItem(item, payload);
    if (item.latest_observation) validateLatestObservation(item);
    if (["harvested", "rejected"].includes(item.status)) validateHarvestItem(item, payload);
  }
}

function validateBlockedItem(item, payload, queueItem) {
  check(
    item.extension_control.surface === "unavailable" &&
      item.extension_control.callable_namespace === null &&
      item.extension_control.isolated_tab_verified === false &&
      item.extension_control.desktop_automation_used === false &&
      !item.launch_proof &&
      !item.harvest_proof &&
      item.blocker.includes("Chrome extension/plugin") &&
      item.aggregate_policy_after_report === "not_eligible_blocked" &&
      payload?.launch_allowed === false &&
      payload?.extension_action === "wait_for_callable_chrome_extension_control" &&
      queueItem?.status === chromeBlockedStatus &&
      queueItem?.aggregate_policy === "not_eligible_until_harvest_review_publication",
    "OFONE_DEEP_RESEARCH_EXTENSION_BLOCKED_ITEM",
    `${item.item_id} remains blocked without launch, harvest, or aggregate eligibility`
  );
}

function validateObservationBlockedItem(item) {
  const observation = item.latest_observation || {};
  check(
    item.launch_proof &&
      observation.browser_surface === "chrome_extension_plugin" &&
      observation.iframe_present === true &&
      observation.completed_report_visible === false &&
      observation.stop_control_visible === false &&
      observation.active_state_visible === false &&
      observation.response_text_available === false &&
      observation.next_action === "observe_again_without_relaunch" &&
      !item.harvest_proof &&
      item.aggregate_policy_after_report === "not_eligible_until_harvest_review_publication",
    "OFONE_DEEP_RESEARCH_EXTENSION_OBSERVATION_BLOCKED_ITEM",
    `${item.item_id} current observation is blocked without harvest or aggregate eligibility`
  );
}

function validateCompletedReportVisibleItem(item, payload) {
  const observation = item.latest_observation || {};
  const probes = item.harvest_probe_attempts || [];
  const probeMethods = new Set(probes.map((probe) => probe.method));
  const probeResults = new Set(probes.map((probe) => probe.result));
  check(
    item.launch_proof &&
      observation.browser_surface === "chrome_extension_plugin" &&
      observation.iframe_present === true &&
      observation.completed_report_visible === true &&
      observation.stop_control_visible === false &&
      observation.active_state_visible === false &&
      observation.response_text_available === false &&
      observation.next_action === "operator_manual_recovery_required" &&
      item.blocker?.includes("completed report is visible") &&
      payload?.extension_action === "harvest_completed_report" &&
      !item.harvest_proof &&
      item.aggregate_policy_after_report === "not_eligible_until_harvest_review_publication",
    "OFONE_DEEP_RESEARCH_EXTENSION_COMPLETED_VISIBLE_ITEM",
    `${item.item_id} completed report is visible but remains unharvested and ineligible until raw Markdown is available`
  );
  check(
    probes.length >= 5 &&
      probes.every((probe) => probe.surface === "chrome_extension_plugin" && probe.allowed_by_contract === true) &&
      probeMethods.has("tab.dom_cua.get_visible_dom on ChatGPT conversation tab") &&
      probeMethods.has("tab.playwright iframe inspection on internal://deep-research") &&
      probeMethods.has("response More actions menu inspection") &&
      probeMethods.has("tab.dev.logs on ChatGPT conversation tab") &&
      probeMethods.has("tab.content.export") &&
      probeMethods.has("tab.content.exportGsuite with markdown/md/text/txt/html/pdf/docx") &&
      probeMethods.has("Copy response button with sentinel clipboard restore") &&
      probeResults.has("report_text_unavailable") &&
      probeResults.has("unsupported_by_backend") &&
      probeResults.has("no_export_control_visible") &&
      item.blocker?.includes("Browser, Computer Use, coordinate clicking, AppleScript/JXA, and generic desktop automation remain disallowed"),
    "OFONE_DEEP_RESEARCH_EXTENSION_HARVEST_PROBE_ATTEMPTS",
    `${item.item_id} completed-visible blocker is backed by allowed Chrome-extension harvest probes instead of desktop fallback`
  );
}

function validateLatestObservation(item) {
  const observation = item.latest_observation || {};
  const proof = item.launch_proof || {};
  const harvested = Boolean(item.harvest_proof);
  const completedVisible = item.status === "completed_report_visible";
  check(
    observation.conversation_url === proof.conversation_url &&
      observation.browser_surface === "chrome_extension_plugin" &&
      typeof observation.visible_state === "string" &&
      observation.visible_state.length > 0 &&
      (harvested
        ? observation.completed_report_visible === true &&
          observation.response_text_available === true &&
          observation.next_action === "review_and_publish_harvested_output"
        : completedVisible
          ? observation.completed_report_visible === true &&
            observation.response_text_available === false &&
            observation.next_action === "operator_manual_recovery_required" &&
            !item.harvest_proof
        : observation.completed_report_visible !== true &&
          !item.harvest_proof),
    "OFONE_DEEP_RESEARCH_EXTENSION_LATEST_OBSERVATION",
    `${item.item_id} latest observation is bound to the launched conversation and matches harvest state`
  );
}

function validateLaunchItem(item, payload, queueItem) {
  const proof = item.launch_proof || {};
  const aggregatePolicyOk = item.status === "harvested"
    ? item.aggregate_policy_after_report === "eligible_only_after_local_review_and_publication"
    : item.aggregate_policy_after_report === "not_eligible_until_harvest_review_publication";
  check(
    item.extension_control.surface === "chrome_extension_plugin" &&
      typeof item.extension_control.callable_namespace === "string" &&
      item.extension_control.callable_namespace.length > 0 &&
      item.extension_control.isolated_tab_verified === true &&
      item.extension_control.desktop_automation_used === false &&
      proof.conversation_url?.startsWith("https://chatgpt.com/c/") &&
      proof.deep_research_enabled === true &&
      proof.stop_control_visible === true &&
      proof.model_label &&
      proof.reasoning_label &&
      proof.plan_title &&
      proof.start_or_countdown_action &&
      proof.active_state &&
      aggregatePolicyOk &&
      payload?.item_id === item.item_id &&
      queueItem?.item_id === item.item_id,
    "OFONE_DEEP_RESEARCH_EXTENSION_LAUNCH_PROOF",
    `${item.item_id} launch status is backed by Chrome-extension launch proof`
  );
}

function validateHarvestItem(item, payload) {
  const harvest = item.harvest_proof || {};
  const rawText = harvest.raw_output_path ? readText(harvest.raw_output_path, `${item.item_id} harvested raw output`) : null;
  check(
    harvest.completed_report_visible === true &&
      harvest.report_title &&
      harvest.raw_output_path === payload?.expected_output_path &&
      rawText &&
      harvest.raw_output_sha256 === `sha256:${sha256(rawText)}`,
    "OFONE_DEEP_RESEARCH_EXTENSION_HARVEST_PROOF",
    `${item.item_id} harvest status is backed by completed-report and raw-output hash proof`
  );
}

function readText(relPath, label) {
  const filePath = path.join(repoRoot, relPath);
  if (!fs.existsSync(filePath)) {
    diagnostics.push({
      severity: "error",
      code: "OFONE_DEEP_RESEARCH_EXTENSION_FILE_MISSING",
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
      code: "OFONE_DEEP_RESEARCH_EXTENSION_JSON_INVALID",
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
