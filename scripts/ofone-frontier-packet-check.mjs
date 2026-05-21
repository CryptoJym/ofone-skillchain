#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const requiredTraceFields = [
  "trace_id",
  "suite_id",
  "cases_run",
  "arms_run",
  "model_families",
  "superiority_ready",
  "diagnostics",
  "case_id",
  "run_id",
  "case_file",
  "case_file_sha256",
  "prompt_file",
  "prompt_file_sha256",
  "input_bundle_sha256",
  "movement_jobs"
];

const expected = {
  suite_id: "ofone-v0.5-three-arm-evaluation",
  case_id: "case-strategic-gated-diligence-001",
  case_file: "benchmarks/cases/strategic-gated-diligence.md",
  case_file_sha256: "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
  prompt_file: "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
  prompt_file_sha256: "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
  input_bundle_sha256: "sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44"
};

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/ofone-frontier-packet-check.mjs <packet.md> [...]");
  process.exit(2);
}

let failed = false;

for (const packetPath of args) {
  const text = fs.readFileSync(packetPath, "utf8");
  const diagnostics = [];
  const runId = parseRunId(text);

  if (!runId) diagnostics.push("missing next remedial run id");
  if (!text.includes("# Benchmark Raw Output")) diagnostics.push("missing exact benchmark output header");
  if (!text.includes("Status: `completed`")) diagnostics.push("missing required completed status metadata");
  if (!text.includes("## Artifact JSON")) diagnostics.push("missing Artifact JSON section contract");
  if (!text.includes("## Validator Result")) diagnostics.push("missing Validator Result section contract");
  if (!text.includes("## Rendering")) diagnostics.push("missing Rendering section contract");
  if (!text.includes("## Patch Report")) diagnostics.push("missing Patch Report section contract");
  if (!text.includes("Do not use `token:option`, `token:variable`, or `token:gate`")) {
    diagnostics.push("missing explicit token-endpoint prohibition for prior relation failures");
  }

  const trace = extractJsonBlock(text, "## Canonical Benchmark Trace");
  if (!trace) {
    diagnostics.push("missing parseable Canonical Benchmark Trace json block");
  } else {
    for (const field of requiredTraceFields) {
      if (!(field in trace)) diagnostics.push(`canonical benchmark_trace missing ${field}`);
    }
    for (const [field, value] of Object.entries(expected)) {
      if (trace[field] !== value) diagnostics.push(`canonical benchmark_trace ${field} mismatch`);
    }
    if (runId && trace.run_id !== runId) diagnostics.push("canonical benchmark_trace run_id does not match packet run id");
    if (trace.superiority_ready !== false) diagnostics.push("canonical benchmark_trace must keep superiority_ready false");
    if (!Array.isArray(trace.arms_run) || !trace.arms_run.includes("full_ofone")) {
      diagnostics.push("canonical benchmark_trace arms_run must include full_ofone");
    }
    if (!Array.isArray(trace.diagnostics) || trace.diagnostics.length === 0) {
      diagnostics.push("canonical benchmark_trace diagnostics must be non-empty");
    }
    if (!Array.isArray(trace.movement_jobs) || !trace.movement_jobs.includes("GROUND") || !trace.movement_jobs.includes("WARN")) {
      diagnostics.push("canonical benchmark_trace movement_jobs must include GROUND and WARN");
    }
  }

  const edges = extractJsonBlock(text, "## Relation-Legal Edge Pattern");
  if (!Array.isArray(edges) || edges.length === 0) {
    diagnostics.push("missing parseable Relation-Legal Edge Pattern json array");
  } else {
    for (const edge of edges) {
      if (!isLegalRelation(edge.relation, edge.from_type, edge.to_type)) {
        diagnostics.push(`illegal relation example ${edge.edge_id || "(unknown)"}: ${edge.from_type} ${edge.relation} ${edge.to_type}`);
      }
      if (!isLegalRelationFamily(edge.relation_family, edge.relation, edge.from_type, edge.to_type)) {
        diagnostics.push(`illegal relation-family example ${edge.edge_id || "(unknown)"}`);
      }
    }
  }

  if (diagnostics.length > 0) {
    failed = true;
    console.error(`FAIL ${path.relative(process.cwd(), packetPath)}`);
    for (const diagnostic of diagnostics) console.error(`- ${diagnostic}`);
  } else {
    console.log(`PASS ${path.relative(process.cwd(), packetPath)}`);
  }
}

if (failed) process.exit(1);

function parseRunId(text) {
  const match = text.match(/Next remedial run:\s*\n\s*`([^`]+)`/);
  return match?.[1] || null;
}

function extractJsonBlock(text, heading) {
  const start = text.indexOf(heading);
  if (start === -1) return null;
  const afterHeading = text.slice(start + heading.length);
  const match = afterHeading.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function isLegalRelation(relation, fromType, toType) {
  const from = normalizeType(fromType);
  const to = normalizeType(toType);
  const rules = {
    supports: () => ["evidence", "claim", "edge", "criterion", "tradeoff_surface"].includes(from.base) && ["claim", "edge", "rendering", "tradeoff_surface"].includes(to.base),
    contradicts: () => from.base === "claim" && to.base === "claim",
    causes: () => ["token:entity", "token:variable", "claim"].includes(from.raw) && ["token:variable", "claim"].includes(to.raw),
    constrains: () => (["token:constraint", "claim", "gate"].includes(from.raw) || from.base === "criterion") && ["claim", "option_move", "edge", "loop", "rendering", "tradeoff_surface"].includes(to.base),
    enables: () => ["claim", "token:entity", "token:variable", "option_move", "actor"].includes(from.raw) && ["option_move", "claim"].includes(to.base),
    observes: () => ["evidence", "token:evidence", "token:variable"].includes(from.raw) && ["claim", "token:variable"].includes(to.raw),
    evaluates: () => (["claim", "option_move", "token:entity", "token:variable"].includes(from.raw) || ["criterion", "tradeoff_surface", "lens", "council_result"].includes(from.base)) && ["option_move", "claim", "rendering", "tradeoff_surface"].includes(to.base),
    updates: () => ["trigger", "evidence", "claim", "review_log"].includes(from.base) && ["claim", "edge", "loop", "option_move", "rendering", "tradeoff_surface"].includes(to.base),
    blocks: () => ["gate", "claim", "unknown"].includes(from.base) && ["option_move", "rendering"].includes(to.base),
    depends_on: () => ["option_move", "claim", "rendering", "tradeoff_surface"].includes(from.base) && ["claim", "edge", "evidence", "loop", "gate", "criterion", "unknown"].includes(to.base)
  };
  return rules[relation]?.() ?? false;
}

function isLegalRelationFamily(family, relation, fromType, toType) {
  return relationFamiliesFor(relation, fromType, toType).has(family);
}

function relationFamiliesFor(relation, fromType, toType) {
  const from = normalizeType(fromType);
  const to = normalizeType(toType);
  const families = new Set();

  if (["causes", "constrains", "enables"].includes(relation)) families.add("causal");
  if (relation === "observes") families.add("evidential");
  if (["contradicts", "evaluates"].includes(relation)) families.add("argumentative");
  if (["updates", "blocks", "depends_on"].includes(relation)) families.add("workflow_state");

  if (relation === "supports") {
    if (from.base === "evidence" || from.raw === "token:evidence") families.add("evidential");
    if (["claim", "edge", "criterion", "tradeoff_surface"].includes(from.base)) families.add("argumentative");
    if (to.base === "rendering" || to.base === "tradeoff_surface") families.add("argumentative");
  }

  return families;
}

function normalizeType(type) {
  const raw = type || "missing";
  return { raw, base: raw.split(":")[0] };
}
