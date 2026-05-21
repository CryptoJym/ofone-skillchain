#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const write = args.includes("--write");
const check = args.includes("--check");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const queueRel = "research/deep-research-launch-queue.json";
const payloadRel = "research/deep-research-extension-payloads.json";
const schemaRel = "schemas/ofone.deep-research-extension-payloads.schema.json";

const queueText = readText(queueRel);
const queue = JSON.parse(queueText);
const payload = buildPayload(queue, queueText);
const rendered = `${JSON.stringify(payload, null, 2)}\n`;
const payloadPath = path.join(repoRoot, payloadRel);

if (write) {
  fs.writeFileSync(payloadPath, rendered);
  console.log(`Wrote ${payloadRel}`);
  process.exit(0);
}

if (check) {
  if (!fs.existsSync(payloadPath)) {
    console.error(`FAIL ${payloadRel} is missing; run npm run deep-research:payloads:write`);
    process.exit(1);
  }
  const current = fs.readFileSync(payloadPath, "utf8");
  if (current !== rendered) {
    console.error(`FAIL ${payloadRel} is stale; run npm run deep-research:payloads:write`);
    process.exit(1);
  }
  console.log(`PASS ${payloadRel} matches ${queueRel}`);
  process.exit(0);
}

process.stdout.write(rendered);

function buildPayload(sourceQueue, sourceQueueText) {
  return {
    $schema: `https://cryptojym.github.io/ofone-skillchain/${schemaRel}`,
    protocol_version: "ofone-deep-research-extension-payloads-0.1",
    generated_from: {
      queue_path: queueRel,
      queue_id: sourceQueue.queue_id,
      queue_generated_at: sourceQueue.generated_at,
      queue_sha256: `sha256:${sha256(sourceQueueText)}`
    },
    launch_surface_policy: sourceQueue.launch_surface_policy,
    concurrency_model: {
      one_item_per_tab: true,
      isolated_conversation_per_item: true,
      cross_tab_visibility_before_harvest: false,
      parallel_tabs_allowed: sourceQueue.launch_surface_policy?.supports_parallel_tabs === true
    },
    items: (sourceQueue.items || []).map((item, index) => buildPayloadItem(item, index))
  };
}

function buildPayloadItem(item, index) {
  const packetText = readText(item.packet_path);
  const promptText = extractPromptBlock(packetText, item.prompt_anchor);
  const launchAllowed = item.status === "prepared_not_launched";
  return {
    item_id: item.item_id,
    tab_lane: `ofone-${String(index + 1).padStart(2, "0")}-${slugify(item.item_id)}`,
    extension_action: launchAllowed
      ? "open_isolated_deep_research_tab"
      : "wait_for_callable_chrome_extension_control",
    launch_allowed: launchAllowed,
    launch_blocked_reason: launchAllowed ? null : item.blocked_reason,
    status: item.status,
    batch_id: item.batch_id,
    case_id: item.case_id,
    arm: item.arm,
    model_family: item.model_family,
    repeat: item.repeat,
    packet_path: item.packet_path,
    packet_sha256: `sha256:${sha256(packetText)}`,
    prompt_anchor: item.prompt_anchor,
    prompt_text_sha256: `sha256:${sha256(promptText)}`,
    prompt_text: promptText,
    expected_output_path: item.expected_output_path,
    expected_review_path: item.expected_review_path,
    required_launch_proof: item.required_launch_proof,
    disallowed_surfaces: item.disallowed_surfaces,
    aggregate_policy: item.aggregate_policy,
    isolation: {
      clean_chatgpt_conversation_required: true,
      no_prior_batch_outputs_or_reviews: true,
      no_cross_arm_visibility_until_raw_harvest: true,
      save_raw_report_before_local_review: true
    }
  };
}

function extractPromptBlock(packetText, anchor) {
  const anchorIndex = packetText.indexOf(anchor);
  if (anchorIndex === -1) {
    throw new Error(`Prompt anchor not found: ${anchor}`);
  }
  const fenceStart = packetText.indexOf("```markdown", anchorIndex);
  if (fenceStart === -1) {
    throw new Error(`No markdown prompt fence after anchor: ${anchor}`);
  }
  const contentStart = packetText.indexOf("\n", fenceStart);
  if (contentStart === -1) {
    throw new Error(`Malformed markdown prompt fence after anchor: ${anchor}`);
  }
  const fenceEnd = packetText.indexOf("\n```", contentStart + 1);
  if (fenceEnd === -1) {
    throw new Error(`Markdown prompt fence is not closed after anchor: ${anchor}`);
  }
  return `${packetText.slice(contentStart + 1, fenceEnd).trimEnd()}\n`;
}

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
