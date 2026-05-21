#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const args = process.argv.slice(2);
const write = args.includes("--write");
const jsonOutput = args.includes("--json");
const sourceArg = valueAfter("--source");
const itemIdArg = valueAfter("--item-id");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const schemaRel = "schemas/ofone.deep-research-manual-recovery.schema.json";
const recoveryRel = "research/deep-research-manual-recovery.json";
const reportRel = "research/deep-research-extension-report.json";
const queueRel = "research/deep-research-launch-queue.json";
const payloadRel = "research/deep-research-extension-payloads.json";

const diagnostics = [];

const schema = readJson(schemaRel, "manual recovery schema");
const recovery = readJson(recoveryRel, "manual recovery plan");
const report = readJson(reportRel, "extension report");
const queue = readJson(queueRel, "launch queue");
const payload = readJson(payloadRel, "extension payloads");

if (schema && recovery) validateSchema(schema, recovery);
if (recovery && report && queue && payload) {
  validateRecoveryBinding(recovery);
  validateRecoveryItems(recovery, report, queue, payload);
  if (sourceArg) validateSourceExport(recovery);
}

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");
if (jsonOutput) {
  console.log(JSON.stringify({ passed, diagnostics }, null, 2));
} else {
  console.log(`${passed ? "PASS" : "FAIL"} OfOne Deep Research manual recovery`);
  for (const diagnostic of diagnostics) {
    const prefix = diagnostic.severity === "error" ? "ERROR" : diagnostic.severity === "warning" ? "WARN" : "OK";
    console.log(`- ${prefix} ${diagnostic.code}: ${diagnostic.message}`);
  }
}
process.exit(passed ? 0 : 1);

function validateSchema(schemaData, recoveryData) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(schemaData);
  const valid = validate(recoveryData);
  check(
    valid,
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_SCHEMA",
    valid ? "manual recovery plan matches schema" : `manual recovery schema errors: ${formatAjvErrors(validate.errors)}`
  );
}

function validateRecoveryBinding(recoveryData) {
  check(
    recoveryData.source_surface === "chrome_extension_plugin" &&
      recoveryData.report_path === reportRel &&
      recoveryData.report_sha256 === `sha256:${sha256(readText(reportRel, "extension report hash source"))}` &&
      recoveryData.queue_path === queueRel &&
      recoveryData.queue_sha256 === `sha256:${sha256(readText(queueRel, "launch queue hash source"))}` &&
      recoveryData.payload_path === payloadRel &&
      recoveryData.payload_sha256 === `sha256:${sha256(readText(payloadRel, "extension payload hash source"))}`,
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_BINDING",
    "manual recovery plan is bound to current queue, payload, and extension report hashes"
  );
}

function validateRecoveryItems(recoveryData, reportData, queueData, payloadData) {
  const reportById = new Map((reportData.items || []).map((item) => [item.item_id, item]));
  const queueById = new Map((queueData.items || []).map((item) => [item.item_id, item]));
  const payloadById = new Map((payloadData.items || []).map((item) => [item.item_id, item]));

  for (const item of recoveryData.items || []) {
    const reportItem = reportById.get(item.item_id);
    const queueItem = queueById.get(item.item_id);
    const payloadItem = payloadById.get(item.item_id);
    const rawOutputExists = fs.existsSync(path.join(repoRoot, item.expected_raw_output_path));
    const reviewExists = fs.existsSync(path.join(repoRoot, item.expected_review_path));
    const forbidden = new Set(item.forbidden_recovery_methods || []);
    const awaiting = item.status === "awaiting_operator_export";

    check(
      Boolean(reportItem) &&
        Boolean(queueItem) &&
        Boolean(payloadItem) &&
        reportItem.status === item.blocked_status &&
        queueItem.status === item.blocked_status &&
        payloadItem.status === item.blocked_status &&
        reportItem.latest_observation?.next_action === "operator_manual_recovery_required" &&
        reportItem.latest_observation?.response_text_available === false &&
        !reportItem.harvest_proof &&
        queueItem.conversation_url === item.conversation_url &&
        reportItem.launch_proof?.conversation_url === item.conversation_url &&
        queueItem.expected_output_path === item.expected_raw_output_path &&
        queueItem.expected_review_path === item.expected_review_path &&
        payloadItem.extension_action === "harvest_completed_report",
      "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_ITEM_BINDING",
      `${item.item_id} manual recovery item maps to the completed-visible, unharvested Chrome-extension state`
    );

    check(
      forbidden.has("Browser plugin") &&
        forbidden.has("Computer Use") &&
        forbidden.has("coordinate clicking") &&
        forbidden.has("AppleScript/JXA") &&
        forbidden.has("generic desktop automation") &&
        forbidden.has("OCR or screenshot reconstruction"),
      "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_FORBIDDEN_SURFACES",
      `${item.item_id} recovery plan preserves the no-fallback policy`
    );

    check(
      item.required_raw_markers.includes(`Run ID: \`${item.item_id}\``) &&
        item.required_raw_markers.includes("Arm: `light_structured`") &&
        item.required_raw_markers.includes("Model family: `frontier_reasoning`") &&
        item.required_raw_markers.includes("Status: `completed`"),
      "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_RAW_MARKERS",
      `${item.item_id} recovery plan requires exact raw-output identity markers`
    );

    check(
      item.promotion_gate?.raw_output_required_before_harvest === true &&
        item.promotion_gate?.local_review_required === true &&
        item.promotion_gate?.queue_payload_report_update_required === true &&
        item.promotion_gate?.commit_push_pages_required === true &&
        item.promotion_gate?.aggregate_eligible_before_review_publication === false,
      "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_PROMOTION_GATE",
      `${item.item_id} cannot become harvested or aggregate-eligible before raw output, review, state update, commit, push, and Pages parity`
    );

    check(
      !awaiting || (!rawOutputExists && !reviewExists),
      "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_AWAITING_STATE",
      awaiting
        ? `${item.item_id} is still awaiting export and has no raw output or review file`
        : `${item.item_id} has left awaiting state`
    );
  }
}

function validateSourceExport(recoveryData) {
  const item = selectRecoveryItem(recoveryData);
  if (!item) return;

  const sourcePath = path.resolve(sourceArg);
  if (!fs.existsSync(sourcePath)) {
    fail("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_SOURCE_MISSING", `source export not found at ${sourcePath}`);
    return;
  }

  const sourceText = fs.readFileSync(sourcePath, "utf8");
  const missingMarkers = item.required_raw_markers.filter((marker) => !sourceText.includes(marker));
  check(
    missingMarkers.length === 0,
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_SOURCE_MARKERS",
    missingMarkers.length === 0
      ? `${path.basename(sourcePath)} contains all required raw-output identity markers`
      : `${path.basename(sourcePath)} missing required marker(s): ${missingMarkers.join("; ")}`
  );
  check(
    !sourceText.includes("__direct_answer__frontier_reasoning__r1"),
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_SOURCE_NOT_DIRECT_ARM",
    `${path.basename(sourcePath)} is not the already-harvested direct-answer export`
  );

  if (!write || missingMarkers.length > 0) return;

  const outputPath = path.join(repoRoot, item.expected_raw_output_path);
  if (fs.existsSync(outputPath)) {
    fail("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_OUTPUT_EXISTS", `${item.expected_raw_output_path} already exists; refusing to overwrite`);
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.copyFileSync(sourcePath, outputPath);
  check(
    fs.existsSync(outputPath),
    "OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_OUTPUT_WRITTEN",
    `wrote raw output to ${item.expected_raw_output_path}; local review and state promotion are still required`
  );
}

function selectRecoveryItem(recoveryData) {
  if (itemIdArg) {
    const item = (recoveryData.items || []).find((candidate) => candidate.item_id === itemIdArg);
    if (!item) fail("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_ITEM_MISSING", `manual recovery item not found: ${itemIdArg}`);
    return item;
  }
  const awaiting = (recoveryData.items || []).filter((item) => item.status === "awaiting_operator_export");
  if (awaiting.length !== 1) {
    fail("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_ITEM_SELECT", `expected exactly one awaiting manual recovery item; found ${awaiting.length}`);
    return null;
  }
  return awaiting[0];
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}

function readJson(relPath, label) {
  const text = readText(relPath, label);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_JSON_INVALID", `${label} is not valid JSON: ${error.message}`);
    return null;
  }
}

function readText(relPath, label) {
  const filePath = path.join(repoRoot, relPath);
  if (!fs.existsSync(filePath)) {
    fail("OFONE_DEEP_RESEARCH_MANUAL_RECOVERY_FILE_MISSING", `${label} missing at ${relPath}`);
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function fail(code, message) {
  diagnostics.push({ severity: "error", code, message });
}

function check(condition, code, message) {
  diagnostics.push({ severity: condition ? "info" : "error", code, message });
}

function sha256(text) {
  return crypto.createHash("sha256").update(text || "").digest("hex");
}

function formatAjvErrors(errors) {
  return (errors || [])
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
}
