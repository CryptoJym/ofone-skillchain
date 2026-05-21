#!/usr/bin/env node
import crypto from "node:crypto";
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
const run07SynthesisRel = "research/results/2026-05-17-07-ofone-post-run06-hardening-review-synthesis.md";
const loopRel = "research/recursive-improvement-loop.md";
const loopPath = path.join(repoRoot, loopRel);
const formalProofFrontierPacketRel = "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-formal-proof-search-frontier-r1.md";
const formalProofFrontierPacketPath = path.join(repoRoot, formalProofFrontierPacketRel);
const deepResearchQueueRel = "research/deep-research-launch-queue.json";
const deepResearchQueuePath = path.join(repoRoot, deepResearchQueueRel);
const deepResearchPayloadRel = "research/deep-research-extension-payloads.json";
const deepResearchPayloadPath = path.join(repoRoot, deepResearchPayloadRel);
const deepResearchReportRel = "research/deep-research-extension-report.json";
const deepResearchReportPath = path.join(repoRoot, deepResearchReportRel);
const deepResearchManualRecoveryRel = "research/deep-research-manual-recovery.json";
const deepResearchManualRecoveryPath = path.join(repoRoot, deepResearchManualRecoveryRel);
const chromeBlockedStatus = "prepared_blocked_chrome_extension_unavailable";
const chromeActiveStatus = "active_researching";
const chromeObservationBlockedStatus = "observation_blocked";
const chromeCompletedVisibleStatus = "completed_report_visible";
const chromeReviewedStatus = "reviewed";
const chromeHarvestedStatus = "harvested";

const diagnostics = [];

const tracker = readText(trackerPath, "research tracker");
const manifest = readJson(manifestPath, "batch 01 manifest");
const status = readText(statusPath, "run 06 status ledger");
const run07Status = readText(run07StatusPath, "run 07 status ledger");
const loopDoc = readText(loopPath, "recursive improvement loop");
const formalProofFrontierPacket = readText(formalProofFrontierPacketPath, "formal proof-search frontier packet");
const deepResearchQueue = readJson(deepResearchQueuePath, "Deep Research launch queue");
const deepResearchPayload = readJson(deepResearchPayloadPath, "Deep Research extension payloads");
const deepResearchReport = readJson(deepResearchReportPath, "Deep Research extension report");
const deepResearchManualRecovery = readJson(deepResearchManualRecoveryPath, "Deep Research manual recovery");

if (tracker && manifest && status) {
  validateRun06Status({ tracker, manifest, status });
}
if (tracker && run07Status) {
  validateRun07Status({ tracker, status: run07Status });
}
if (tracker && loopDoc) {
  validateRecursiveLoop({ tracker, loopDoc });
}
if (tracker && loopDoc && formalProofFrontierPacket && deepResearchQueue && deepResearchPayload && deepResearchReport && deepResearchManualRecovery) {
  validateChromeExtensionFrontier({
    tracker,
    loopDoc,
    packet: formalProofFrontierPacket,
    queue: deepResearchQueue,
    payload: deepResearchPayload,
    report: deepResearchReport,
    manualRecovery: deepResearchManualRecovery
  });
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
  const synthesisPath = path.join(repoRoot, run07SynthesisRel);

  check(
    trackerRow.includes("| OfOne Post-Run06 Benchmark Hardening Review |") &&
      trackerRow.includes("| integrated |") &&
      trackerRow.includes(`| ${url} |`),
    "OFONE_RESEARCH_RUN07_TRACKER_ROW",
    "tracker Run 07 row is integrated with the expected ChatGPT URL"
  );
  check(
    tracker.includes(run07StatusRel),
    "OFONE_RESEARCH_RUN07_STATUS_LEDGER_LINK",
    "tracker links the Run 07 status ledger"
  );
  check(
    status.includes("Run ID: 07") &&
      status.includes("Lifecycle state: integrated") &&
      status.includes(`Conversation URL: ${url}`),
    "OFONE_RESEARCH_RUN07_STATUS_STATE",
    "Run 07 ledger identifies the integrated Deep Research conversation"
  );
  check(
    status.includes("Pasted markdown.md") &&
      status.includes("OfOne Run07 hardening review") &&
      status.includes("Researching...") &&
      status.includes("Stop research"),
    "OFONE_RESEARCH_RUN07_LAUNCH_PROOF",
    "Run 07 ledger preserves launch proof and original active research affordances"
  );
  check(
    status.includes("Research completed in 1h 12m") &&
      status.includes("14 citations") &&
      status.includes("9 searches") &&
      status.includes(run07ResultRel),
    "OFONE_RESEARCH_RUN07_HARVEST_PROOF",
    "Run 07 ledger records completion metadata and harvested result path"
  );
  check(
    fs.existsSync(resultPath) && fs.existsSync(synthesisPath) &&
      tracker.includes(run07ResultRel) &&
      tracker.includes(run07SynthesisRel),
    "OFONE_RESEARCH_RUN07_RESULT_PRESENT",
    "Run 07 harvested result and local synthesis are present and linked from the tracker"
  );
  check(
    status.includes("benchmark_trace") &&
      status.includes("rerun_policy") &&
      status.includes("checker attestation") &&
      status.includes("benchmark_handoff"),
    "OFONE_RESEARCH_RUN07_INTEGRATION_PROOF",
    "Run 07 accepted hardening items and next benchmark-handoff mode are recorded"
  );
}

function validateRecursiveLoop({ tracker, loopDoc }) {
  check(
    tracker.includes("OfOne Post-Run06 Benchmark Hardening Review") &&
      tracker.includes("integrated"),
    "OFONE_RESEARCH_LOOP_CURRENT_RUN",
    "tracker exposes the latest integrated recursive research run"
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
    loopDoc.includes("Chrome extension/plugin") &&
      loopDoc.includes("Computer Use") &&
      loopDoc.includes("not automatic fallbacks") &&
      loopDoc.includes("prepared`/`blocked"),
    "OFONE_RESEARCH_LOOP_BROWSER_SURFACE",
    "recursive loop doc requires Chrome extension launch control and blocks desktop automation fallback"
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
      loopDoc.includes(run07ResultRel) &&
      loopDoc.includes("Current mode: `benchmark_handoff`"),
    "OFONE_RESEARCH_LOOP_CURRENT_RUN",
    "recursive loop doc points to the Run 07 ledger/result and benchmark-handoff mode"
  );
}

function validateChromeExtensionFrontier({ tracker, loopDoc, packet, queue, payload, report, manualRecovery }) {
  const run07Row = tracker.split("\n").find((line) => line.startsWith("| 07 |")) || "";
  const launchReadyItem = {
    itemId: "2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__frontier_reasoning__r1",
    queueStatus: "prepared_not_launched",
    reportStatus: "launch_ready",
    aggregatePolicy: "not_eligible_until_harvest_review_publication",
    reportAggregatePolicy: "not_eligible_until_harvest_review_publication",
    payloadLaunchAllowed: true,
    payloadAction: "open_isolated_deep_research_tab"
  };
  const expectedItems = [
    {
      itemId: "2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__frontier_reasoning__r1",
      queueStatus: chromeReviewedStatus,
      reportStatus: chromeHarvestedStatus,
      aggregatePolicy: "aggregate_eligible_after_review",
      reportAggregatePolicy: "eligible_only_after_local_review_and_publication",
      payloadLaunchAllowed: false,
      payloadAction: "no_extension_action_completed",
      harvestRequired: true
    },
    {
      itemId: "2026-05-17-batch-01__case-formal-proof-search-001__light_structured__frontier_reasoning__r1",
      queueStatus: chromeCompletedVisibleStatus,
      reportStatus: chromeCompletedVisibleStatus,
      aggregatePolicy: "not_eligible_until_harvest_review_publication",
      reportAggregatePolicy: "not_eligible_until_harvest_review_publication",
      payloadLaunchAllowed: false,
      payloadAction: "harvest_completed_report",
      harvestRequired: false,
      completedVisibleRequired: true
    }
  ];
  const payloadText = readText(deepResearchPayloadPath, "Deep Research extension payload hash source");
  const launchQueueItem = (queue.items || []).find((item) => item.item_id === launchReadyItem.itemId);
  const launchPayloadItem = (payload.items || []).find((item) => item.item_id === launchReadyItem.itemId);
  const launchReportItem = (report.items || []).find((item) => item.item_id === launchReadyItem.itemId);

  check(
    run07Row.includes(formalProofFrontierPacketRel) &&
      run07Row.includes(`status \`${chromeCompletedVisibleStatus}\``) &&
      run07Row.includes("Research completed in 10m") &&
      run07Row.includes("Research completed in 9m") &&
      run07Row.includes("raw Markdown harvest remains blocked"),
    "OFONE_RESEARCH_FRONTIER_ACTIVE_TRACKER_ROW",
    "tracker Run 07 row records the current formal frontier Chrome-extension direct harvest and completed-visible light-structured state"
  );
  check(
    tracker.includes(`Status marker: \`${chromeCompletedVisibleStatus}\``) &&
      expectedItems.every((expected) => {
        const queueItem = (queue.items || []).find((item) => item.item_id === expected.itemId);
        return queueItem?.conversation_url && tracker.includes(queueItem.conversation_url);
      }) &&
      tracker.includes("formal proof-search frontier direct-answer slot is harvested, locally reviewed, and aggregate-eligible") &&
      tracker.includes("formal proof-search frontier light-structured report is completed-visible") &&
      tracker.includes(launchReadyItem.itemId) &&
      tracker.includes(launchReadyItem.queueStatus) &&
      tracker.includes(launchReadyItem.reportStatus) &&
      tracker.includes("https://chatgpt.com/c/6a0f4f44-f800-83e8-851b-a71bbd2596d2") &&
      tracker.includes("no generated plan, Start/countdown action, active research state, or stop-control evidence") &&
      tracker.includes("This is not valid launch proof") &&
      tracker.includes("raw Markdown harvest remains blocked"),
    "OFONE_RESEARCH_FRONTIER_ACTIVE_TRACKER_ADDENDUM",
    "tracker addendum records direct-answer harvest proof, completed-visible light-structured blocker, and launch-ready full-OfOne lane"
  );
  check(
    packet.includes(`Status: \`${chromeCompletedVisibleStatus}\``) &&
      packet.includes("callable Chrome extension/plugin control") &&
      packet.includes("generic desktop automation are not fallback launch paths") &&
      packet.includes("not fallback harvest paths") &&
      expectedItems.every((expected) => {
        const queueItem = (queue.items || []).find((item) => item.item_id === expected.itemId);
        return queueItem?.conversation_url && packet.includes(queueItem.conversation_url);
      }) &&
      packet.includes("Research completed in 10m") &&
      packet.includes("locally reviewed") &&
      packet.includes("Research completed in 9m") &&
      packet.includes("cross-origin Deep Research sandbox iframe") &&
      packet.includes(launchReadyItem.itemId) &&
      packet.includes("## Prompt 3: Full OfOne"),
    "OFONE_RESEARCH_FRONTIER_CHROME_ACTIVE_PACKET",
    "frontier packet records Chrome-extension direct harvest proof, completed-visible light-structured blocker, and full-OfOne prompt identity"
  );
  check(
      loopDoc.includes(formalProofFrontierPacketRel) &&
      loopDoc.includes(deepResearchReportRel) &&
      expectedItems.every((expected) => {
        const queueItem = (queue.items || []).find((item) => item.item_id === expected.itemId);
        return queueItem?.conversation_url && loopDoc.includes(queueItem.conversation_url);
      }) &&
      loopDoc.includes(chromeCompletedVisibleStatus) &&
      loopDoc.includes(launchReadyItem.itemId) &&
      loopDoc.includes(launchReadyItem.reportStatus) &&
      loopDoc.includes("https://chatgpt.com/c/6a0f4f44-f800-83e8-851b-a71bbd2596d2") &&
      loopDoc.includes("no generated plan, Start/countdown action, active research state, or stop-control evidence") &&
      loopDoc.includes("diagnose the Chrome-extension ChatGPT no-start state") &&
      (loopDoc.includes("Do not use Browser, Computer Use, coordinate clicking, AppleScript/JXA, or generic desktop automation as fallback") ||
        loopDoc.includes("do not use Browser, Computer Use, coordinate clicking, AppleScript/JXA, or generic desktop automation as fallback")),
    "OFONE_RESEARCH_FRONTIER_CHROME_ACTIVE_LOOP",
    "recursive loop points to the completed-visible Chrome-extension run, launch-ready full-OfOne lane, and forbids desktop-automation fallback"
  );
  check(
    queue.launch_surface_policy?.primary_surface === "chrome_extension_plugin" &&
      queue.launch_surface_policy?.desktop_automation_fallback_allowed === false &&
      expectedItems.every((expected) => {
        const queueItem = (queue.items || []).find((item) => item.item_id === expected.itemId);
        return queueItem?.status === expected.queueStatus &&
          queueItem?.conversation_url?.startsWith("https://chatgpt.com/c/") &&
          queueItem?.aggregate_policy === expected.aggregatePolicy;
      }) &&
      launchQueueItem?.status === launchReadyItem.queueStatus &&
      launchQueueItem?.prompt_anchor === "## Prompt 3: Full OfOne" &&
      launchQueueItem?.aggregate_policy === launchReadyItem.aggregatePolicy &&
      launchQueueItem?.blocked_reason?.includes("Prepared for the next Chrome-extension-managed isolated Deep Research launch") &&
      !launchQueueItem?.conversation_url &&
      !launchQueueItem?.launch_proof_path,
    "OFONE_RESEARCH_FRONTIER_CHROME_QUEUE_ACTIVE",
    "Deep Research launch queue records direct reviewed state, completed-visible light-structured state, and prepared full-OfOne state"
  );
  check(
    payload.generated_from?.queue_path === deepResearchQueueRel &&
      expectedItems.every((expected) => {
        const payloadItem = (payload.items || []).find((item) => item.item_id === expected.itemId);
        const reportItem = (report.items || []).find((item) => item.item_id === expected.itemId);
        return payloadItem?.status === expected.queueStatus &&
          payloadItem?.launch_allowed === expected.payloadLaunchAllowed &&
          payloadItem?.extension_action === expected.payloadAction &&
          payloadItem?.tab_lane === reportItem?.tab_lane;
      }) &&
      launchPayloadItem?.status === launchReadyItem.queueStatus &&
      launchPayloadItem?.launch_allowed === launchReadyItem.payloadLaunchAllowed &&
      launchPayloadItem?.extension_action === launchReadyItem.payloadAction &&
      launchPayloadItem?.tab_lane === launchReportItem?.tab_lane &&
      launchPayloadItem?.prompt_anchor === "## Prompt 3: Full OfOne" &&
      launchPayloadItem?.prompt_text?.includes(launchReadyItem.itemId),
    "OFONE_RESEARCH_FRONTIER_CHROME_PAYLOAD_ACTIVE",
    "Chrome-extension payload records completed direct lane, harvest-needed light-structured lane, and launch-ready full-OfOne lane"
  );
  check(
    report.payload_path === deepResearchPayloadRel &&
      payloadText &&
      report.payload_sha256 === `sha256:${sha256(payloadText)}` &&
      report.extension_availability?.callable_namespace === "mcp__node_repl__js" &&
      report.extension_availability?.available_backends?.includes("chrome") &&
      report.extension_availability?.browser_global_present === true &&
      report.extension_availability?.browser_id === "extension" &&
      report.extension_availability?.tab_operations?.includes("list") &&
      report.extension_availability?.tabs_list_ok === true &&
      report.extension_availability?.diagnosis === "available" &&
      expectedItems.every((expected) => {
        const queueItem = (queue.items || []).find((item) => item.item_id === expected.itemId);
        const reportItem = (report.items || []).find((item) => item.item_id === expected.itemId);
        const commonProof =
          reportItem?.status === expected.reportStatus &&
          reportItem?.extension_control?.surface === "chrome_extension_plugin" &&
          reportItem?.extension_control?.callable_namespace?.includes("mcp__node_repl__js") &&
          reportItem?.extension_control?.isolated_tab_verified === true &&
          reportItem?.extension_control?.desktop_automation_used === false &&
          reportItem?.launch_proof?.conversation_url === queueItem?.conversation_url &&
          reportItem?.launch_proof?.deep_research_enabled === true &&
          reportItem?.launch_proof?.stop_control_visible === true &&
          reportItem?.latest_observation?.conversation_url === queueItem?.conversation_url &&
          reportItem?.aggregate_policy_after_report === expected.reportAggregatePolicy;
        if (expected.harvestRequired) {
          return commonProof &&
            reportItem?.latest_observation?.completed_report_visible === true &&
            reportItem?.latest_observation?.next_action === "review_and_publish_harvested_output" &&
            reportItem?.harvest_proof?.completed_report_visible === true;
        }
        if (expected.completedVisibleRequired) {
          return commonProof &&
            reportItem?.latest_observation?.completed_report_visible === true &&
            reportItem?.latest_observation?.response_text_available === false &&
            reportItem?.latest_observation?.next_action === "operator_manual_recovery_required" &&
            reportItem?.blocker?.includes("completed report is visible") &&
            Array.isArray(reportItem?.harvest_probe_attempts) &&
            reportItem.harvest_probe_attempts.length >= 5 &&
            reportItem.harvest_probe_attempts.every((probe) => probe.surface === "chrome_extension_plugin" && probe.allowed_by_contract === true) &&
            !reportItem?.harvest_proof;
        }
        return commonProof &&
          reportItem?.latest_observation?.completed_report_visible === false &&
          reportItem?.latest_observation?.active_state_visible === true &&
          reportItem?.latest_observation?.next_action === "harvest_when_completed_report_visible" &&
          !reportItem?.harvest_proof;
      }) &&
      launchReportItem?.status === launchReadyItem.reportStatus &&
      launchReportItem?.extension_control?.surface === "chrome_extension_plugin" &&
      launchReportItem?.extension_control?.callable_namespace?.includes("mcp__node_repl__js") &&
      launchReportItem?.extension_control?.isolated_tab_verified === false &&
      launchReportItem?.extension_control?.desktop_automation_used === false &&
      launchReportItem?.aggregate_policy_after_report === launchReadyItem.reportAggregatePolicy &&
      launchReportItem?.blocker?.includes("https://chatgpt.com/c/6a0f4f44-f800-83e8-851b-a71bbd2596d2") &&
      launchReportItem?.blocker?.includes("not valid launch proof") &&
      !launchReportItem?.launch_proof &&
      !launchReportItem?.latest_observation &&
      !launchReportItem?.harvest_proof,
    "OFONE_RESEARCH_FRONTIER_CHROME_REPORT_ACTIVE",
    "Chrome-extension report intake records direct harvest proof, completed-visible light-structured harvest blocker, and launch-ready full-OfOne lane"
  );

  const manualItem = (manualRecovery.items || []).find((item) =>
    item.item_id === "2026-05-17-batch-01__case-formal-proof-search-001__light_structured__frontier_reasoning__r1"
  );
  const manualReportText = readText(deepResearchReportPath, "Deep Research extension report hash source for manual recovery");
  const manualQueueText = readText(deepResearchQueuePath, "Deep Research queue hash source for manual recovery");
  const manualPayloadText = readText(deepResearchPayloadPath, "Deep Research payload hash source for manual recovery");
  const manualRawExists = manualItem ? fs.existsSync(path.join(repoRoot, manualItem.expected_raw_output_path)) : false;
  const manualReviewExists = manualItem ? fs.existsSync(path.join(repoRoot, manualItem.expected_review_path)) : false;
  check(
    manualRecovery.report_path === deepResearchReportRel &&
      manualRecovery.report_sha256 === `sha256:${sha256(manualReportText)}` &&
      manualRecovery.queue_path === deepResearchQueueRel &&
      manualRecovery.queue_sha256 === `sha256:${sha256(manualQueueText)}` &&
      manualRecovery.payload_path === deepResearchPayloadRel &&
      manualRecovery.payload_sha256 === `sha256:${sha256(manualPayloadText)}` &&
      Boolean(manualItem) &&
      manualItem.status === "awaiting_operator_export" &&
      manualItem.blocked_status === chromeCompletedVisibleStatus &&
      manualItem.conversation_url === "https://chatgpt.com/c/6a0f1fe5-3494-83e8-9f92-1a2b732c4958" &&
      manualItem.required_raw_markers.includes(`Run ID: \`${manualItem.item_id}\``) &&
      manualItem.forbidden_recovery_methods.includes("Computer Use") &&
      manualItem.forbidden_recovery_methods.includes("OCR or screenshot reconstruction") &&
      manualItem.promotion_gate?.aggregate_eligible_before_review_publication === false &&
      !manualRawExists &&
      !manualReviewExists,
    "OFONE_RESEARCH_FRONTIER_MANUAL_RECOVERY_GATE",
    "manual recovery plan is hash-bound to the current completed-visible blocker and cannot promote the slot before raw export plus local review"
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

function sha256(text) {
  return crypto.createHash("sha256").update(text || "").digest("hex");
}

function check(condition, code, message) {
  diagnostics.push({
    severity: condition ? "info" : "error",
    code,
    message
  });
}
