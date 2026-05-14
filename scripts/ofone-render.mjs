#!/usr/bin/env node
import fs from "node:fs";
import { array, buildObjectIndex, dependencyClosure } from "../lib/ofone-graph.mjs";

const [file, requestedMode] = process.argv.slice(2);

if (!file) {
  console.error("Usage: node scripts/ofone-render.mjs <ofone-map.json> [Micro|Map|Audit]");
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const mode = requestedMode || data.mode || "Map";
const index = buildObjectIndex(data);

if (mode === "Micro") renderMicro(data);
else if (mode === "Audit") renderAudit(data, index);
else renderMap(data, index);

function renderMicro(data) {
  line(`# OfOne Micro Rendering`);
  line();
  line(`**Objective:** ${data.charter?.objective || "(missing objective)"}`);
  line(`**Adapter:** ${data.adapter_projection?.primary || "(missing adapter)"}`);
  line(`**Decision:** ${data.decision_rendering?.recommendation || "(missing recommendation)"}`);
  line(`**Confidence:** ${data.decision_rendering?.confidence || "(missing confidence)"}`);
  line(`**Why:** ${data.decision_rendering?.summary || "(missing summary)"}`);
  line(`**Update Trigger:** ${array(data.triggers)[0]?.condition || "(none recorded)"}`);
  line(`**Gate:** ${gateSummary(data)}`);
}

function renderMap(data, index) {
  line(`# OfOne Map Rendering`);
  line();
  section("Mode And Charter", [
    `Mode: ${data.mode}`,
    `Objective: ${data.charter?.objective}`,
    `Scope: ${array(data.charter?.scope).join("; ")}`,
    `Risk: ${data.charter?.risk_tier}`
  ]);
  section("Geometry And Adapter", [
    `Adapter: ${data.adapter_projection?.primary}`,
    `Frames: ${array(data.scene?.frames).map((frame) => `${frame.frame_id}:${frame.type}`).join(", ")}`,
    `Tokens: ${array(data.scene?.tokens).map((token) => `${token.token_id}:${token.label}`).join(", ")}`
  ]);
  section("Evidence And Claims", [
    `Evidence: ${array(data.evidence).map((evidence) => `${evidence.evidence_id}:${evidence.reliability}`).join(", ")}`,
    `Claims: ${array(data.claims).map((claim) => `${claim.claim_id}:${claim.status}:${claim.confidence?.level}`).join(", ")}`
  ]);
  section("Graph And Loops", [
    `Edges: ${array(data.edges).map((edge) => `${edge.edge_id}:${edge.from}-${edge.relation}->${edge.to}`).join(", ")}`,
    `Loops: ${array(data.loops).map((loop) => `${loop.loop_id}:${loop.type}:${loop.polarity}`).join(", ")}`
  ]);
  section("Options And Gates", [
    `Options: ${array(data.option_moves).map((option) => `${option.option_id}:${option.move_type}`).join(", ")}`,
    `Gates: ${gateSummary(data)}`
  ]);
  renderDecisionAndTriggers(data, index);
}

function renderAudit(data, index) {
  renderMap(data, index);
  section("Audit Evidence Identity", array(data.evidence).map((evidence) => (
    `${evidence.evidence_id}: ${evidence.content_hash}; retrieved=${evidence.retrieved_at}; owner=${evidence.source_owner}`
  )));
  section("Validator Result", array(data.validator_result?.checks).map((check) => (
    `${check.passed ? "PASS" : "FAIL"} ${check.check}: ${check.notes}`
  )));
}

function renderDecisionAndTriggers(data, index) {
  section("Decision Rendering", [
    `Rendering: ${data.decision_rendering?.rendering_id}`,
    `Recommendation: ${data.decision_rendering?.recommendation}`,
    `Confidence: ${data.decision_rendering?.confidence}`,
    `Depends on: ${array(data.decision_rendering?.depends_on).join(", ")}`
  ]);
  section("Update Logic", array(data.triggers).map((trigger) => {
    const closure = dependencyClosure(array(trigger.affected_objects), index.reverseDeps);
    return `${trigger.trigger_id}: ${trigger.condition} -> ${trigger.transition}; closure=${closure.join(", ") || "(none)"}`;
  }));
}

function gateSummary(data) {
  const gates = array(data.gates);
  if (gates.length === 0) return "none recorded";
  return gates.map((gate) => `${gate.gate_id}:${gate.status}:${gate.condition}`).join("; ");
}

function section(title, items) {
  line(`## ${title}`);
  for (const item of items.filter(Boolean)) line(`- ${item}`);
  line();
}

function line(text = "") {
  console.log(text);
}
