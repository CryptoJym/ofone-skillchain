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
  const index = buildObjectIndex(data);

  line(`# OfOne Decision Rendering`);
  line();
  section("Decision", [
    data.decision_rendering?.recommendation || "(missing recommendation)"
  ]);
  section("Confidence", [
    `${data.decision_rendering?.confidence || "(missing confidence)"}: ${data.decision_rendering?.summary || "(missing summary)"}`
  ]);
  section("Why", claimLines(data).slice(0, 4));
  section("Blocking Unknowns", unknownLines(data));
  section("What Would Change This", triggerLines(data, index).slice(0, 3));
  section("Human Gates", gateLines(data));
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
    `Tokens: ${array(data.scene?.tokens).map((token) => `${token.token_id}:${token.label}`).join(", ")}`,
    `Subscenes: ${array(data.scene?.subscenes).map((subscene) => `${subscene.subscene_id}:${subscene.purpose}`).join(", ")}`
  ]);
  section("Evidence And Claims", [
    `Evidence: ${array(data.evidence).map((evidence) => `${evidence.evidence_id}:${evidence.reliability}`).join(", ")}`,
    `Claims: ${array(data.claims).map((claim) => `${claim.claim_id}:${claim.status}:${claim.confidence?.level}`).join(", ")}`,
    `Dissent / contradiction: ${dissentSummary(data)}`
  ]);
  section("Graph And Loops", [
    `Edges: ${array(data.edges).map((edge) => `${edge.edge_id}:${edge.from}-${edge.relation}->${edge.to}`).join(", ")}`,
    `Loops: ${array(data.loops).map((loop) => `${loop.loop_id}:${loop.type}:${loop.polarity}`).join(", ")}`
  ]);
  section("Options And Gates", [
    `Options: ${array(data.option_moves).map((option) => `${option.option_id}:${option.move_type}`).join(", ")}`,
    `Unknowns: ${unknownSummary(data)}`,
    `Kill tests: ${array(data.kill_tests).map((test) => `${test.test_id}:${test.test_type}->${test.target}`).join(", ")}`,
    `Gates: ${gateSummary(data)}`
  ]);
  renderDecisionAndTriggers(data, index);
}

function renderAudit(data, index) {
  renderMap(data, index);
  section("Audit Evidence Identity", array(data.evidence).map((evidence) => (
    `${evidence.evidence_id}: ${evidence.content_hash}; retrieved=${evidence.retrieved_at}; owner=${evidence.source_owner}`
  )));
  section("Dissent / Contradiction", dissentLines(data));
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
    const impact = data.decision_rendering?.rendering_id && closure.includes(data.decision_rendering.rendering_id) ? "rendering affected" : "rendering unchanged";
    return `${trigger.trigger_id}: ${trigger.condition} -> ${trigger.transition}; ${impact}; closure=${closure.join(", ") || "(none)"}`;
  }));
}

function claimLines(data) {
  return array(data.claims).map((claim) => (
    `${claim.claim_id}: ${claim.text} (${claim.status}, confidence=${claim.confidence?.level})`
  ));
}

function unknownLines(data) {
  const unknowns = array(data.unknowns);
  if (unknowns.length === 0) return ["none recorded"];
  return unknowns.map((unknown) => (
    `${unknown.unknown_id}: ${unknown.description}; blocks=${array(unknown.blocks).join(", ") || "(none)"}; resolution=${unknown.resolution_move}`
  ));
}

function triggerLines(data, index) {
  const triggers = array(data.triggers);
  if (triggers.length === 0) return ["none recorded"];
  return triggers.map((trigger) => {
    const closure = dependencyClosure(array(trigger.affected_objects), index.reverseDeps);
    const impact = data.decision_rendering?.rendering_id && closure.includes(data.decision_rendering.rendering_id) ? "changes rendering" : "does not change rendering";
    return `${trigger.trigger_id}: ${trigger.condition} -> ${trigger.transition}; ${impact}`;
  });
}

function gateLines(data) {
  const gates = array(data.gates);
  if (gates.length === 0) return ["none recorded"];
  return gates.map((gate) => `${gate.gate_id}: ${gate.status}; ${gate.condition}; reviewer=${gate.reviewer}`);
}

function dissentLines(data) {
  const lines = array(data.claims)
    .filter((claim) => claim.status === "disputed" || array(claim.contradicts).length > 0)
    .map((claim) => `${claim.claim_id}: status=${claim.status}; contradicts=${array(claim.contradicts).join(", ") || "(none)"}`);
  return lines.length > 0 ? lines : ["none recorded"];
}

function dissentSummary(data) {
  return dissentLines(data).join("; ");
}

function gateSummary(data) {
  const gates = array(data.gates);
  if (gates.length === 0) return "none recorded";
  return gates.map((gate) => `${gate.gate_id}:${gate.status}:${gate.condition}`).join("; ");
}

function unknownSummary(data) {
  const unknowns = array(data.unknowns);
  if (unknowns.length === 0) return "none recorded";
  return unknowns.map((unknown) => `${unknown.unknown_id}:${unknown.status}:${unknown.description}`).join("; ");
}

function section(title, items) {
  line(`## ${title}`);
  for (const item of items.filter(Boolean)) line(`- ${item}`);
  line();
}

function line(text = "") {
  console.log(text);
}
