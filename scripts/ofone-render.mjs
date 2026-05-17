#!/usr/bin/env node
import fs from "node:fs";
import { array, buildObjectIndex, dependencyClosure } from "../lib/ofone-graph.mjs";

const [file, requestedMode, ...renderArgs] = process.argv.slice(2);

if (!file) {
  console.error("Usage: node scripts/ofone-render.mjs <ofone-map.json> [Micro|Executive|Map|Analyst|Audit|PatchImpact] [changed-object-id ...]");
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const mode = normalizeMode(requestedMode || data.mode || "Map");
const index = buildObjectIndex(data);

if (mode === "Micro" || mode === "Executive") renderMicro(data, mode);
else if (mode === "Audit") renderAudit(data, index);
else if (mode === "PatchImpact") renderPatchImpact(data, index, renderArgs);
else renderMap(data, index);

function renderMicro(data, mode = "Micro") {
  const index = buildObjectIndex(data);

  line(`# OfOne ${mode === "Executive" ? "Executive Decision Brief" : "Decision Rendering"}`);
  line();
  section("Decision", [
    data.decision_rendering?.recommendation || "(missing recommendation)"
  ]);
  section("Confidence", [
    `${data.decision_rendering?.confidence || "(missing confidence)"}: ${data.decision_rendering?.summary || "(missing summary)"}`
  ]);
  section("Why", claimLines(data).slice(0, 4));
  section("Decision Surface", decisionSurfaceLines(data).slice(0, 5));
  section("Blocking Unknowns", unknownLines(data));
  section("Next Best Evidence", informationValueLines(data).slice(0, 3));
  section("What Would Change This", triggerLines(data, index).slice(0, 3));
  section("Human Gates", gateLines(data));
}

function renderMap(data, index) {
  line(`# OfOne Analyst Map`);
  line();
  section("Lifecycle", lifecycleLines(data));
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
    ...edgeFamilyLines(data),
    `Loops: ${array(data.loops).map((loop) => `${loop.loop_id}:${loop.type}:${loop.polarity}`).join(", ")}`
  ]);
  section("Decision Surface", decisionSurfaceLines(data));
  section("Actors And Time", [
    ...actorLines(data),
    ...temporalLines(data)
  ]);
  section("Options And Gates", [
    `Options: ${array(data.option_moves).map((option) => `${option.option_id}:${option.move_type}`).join(", ")}`,
    `Unknowns: ${unknownSummary(data)}`,
    `Kill tests: ${array(data.kill_tests).map((test) => `${test.test_id}:${test.test_type}->${test.target}`).join(", ")}`,
    `Gates: ${gateSummary(data)}`
  ]);
  section("Information Value", informationValueLines(data));
  section("Lens Council", lensCouncilLines(data));
  renderDecisionAndTriggers(data, index);
}

function renderAudit(data, index) {
  line(`# OfOne Audit Report`);
  line();
  renderMap(data, index);
  section("Audit Evidence Identity", array(data.evidence).map((evidence) => (
    `${evidence.evidence_id}: ${evidence.content_hash}; retrieved=${evidence.retrieved_at}; owner=${evidence.source_owner}`
  )));
  section("Dissent / Contradiction", dissentLines(data));
  section("Review Log", reviewLogLines(data));
  section("Validator Result", array(data.validator_result?.checks).map((check) => (
    `${check.passed ? "PASS" : "FAIL"} ${check.check}: ${check.notes}`
  )));
}

function renderPatchImpact(data, index, changedIds) {
  const startIds = changedIds.length > 0 ? changedIds : array(data.triggers).flatMap((trigger) => array(trigger.affected_objects));
  const knownIds = startIds.filter((id) => index.ids.has(id));
  const missingIds = startIds.filter((id) => !index.ids.has(id));
  const closure = dependencyClosure(knownIds, index.reverseDeps);
  const changedObjects = knownIds.map((id) => describeObject(index, id));
  const affectedObjects = closure.map((id) => describeObject(index, id));
  const renderingAffected = data.decision_rendering?.rendering_id ? closure.includes(data.decision_rendering.rendering_id) : false;
  const semanticLayers = semanticLayersFor(index, [...changedObjects, ...affectedObjects]);

  line(`# OfOne Patch Impact View`);
  line();
  section("Changed Objects", changedObjects.length > 0 ? changedObjects.map(objectLine) : ["none supplied"]);
  if (missingIds.length > 0) section("Missing Objects", missingIds);
  section("Affected Closure", affectedObjects.length > 0 ? affectedObjects.map(objectLine) : ["none"]);
  section("Affected Semantic Layers", semanticLayers.length > 0 ? semanticLayers : ["none"]);
  section("Decision Impact", [
    `Rendering: ${renderingAffected ? "affected" : "unchanged"}`,
    `Invalidated claims: ${affectedObjects.filter((object) => object.type === "claim").map((object) => object.id).join(", ") || "(none)"}`,
    `Required revalidation: ${patchRevalidationLines(affectedObjects, renderingAffected).join(", ")}`
  ]);
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

function normalizeMode(mode) {
  const value = String(mode || "").toLowerCase();
  if (value === "micro") return "Micro";
  if (value === "executive" || value === "executivebrief") return "Executive";
  if (value === "audit" || value === "auditreport") return "Audit";
  if (value === "patch" || value === "patchimpact" || value === "patch-impact") return "PatchImpact";
  return "Map";
}

function claimLines(data) {
  return array(data.claims).map((claim) => (
    `${claim.claim_id}: ${claim.text} (${claim.status}, confidence=${claim.confidence?.level})`
  ));
}

function describeObject(index, id) {
  const entry = index.ids.get(id);
  return {
    id,
    type: entry?.type || "missing",
    label: labelFor(entry)
  };
}

function objectLine(object) {
  return `${object.id}: ${object.type}${object.label ? `; ${object.label}` : ""}`;
}

function labelFor(entry) {
  const object = entry?.object || {};
  return object.text || object.description || object.name || object.label || object.condition || object.decision_effect || object.recommended_next_query || object.recommendation || object.summary || object.source || object.move_type || object.objective_head || object.time_horizon || object.surface_id || "";
}

function semanticLayersFor(index, objects) {
  const layers = new Set();
  for (const object of objects) {
    if (object.type === "evidence") layers.add("evidential");
    if (object.type === "claim") layers.add("argumentative");
    if (object.type === "trigger" || object.type === "gate" || object.type === "review_log") layers.add("workflow_state");
    if (object.type === "edge") {
      const family = index.ids.get(object.id)?.object?.relation_family;
      if (family) layers.add(family);
    }
    if (object.type === "loop") {
      for (const edgeId of index.ids.get(object.id)?.object?.edges || []) {
        const family = index.ids.get(edgeId)?.object?.relation_family;
        if (family) layers.add(family);
      }
    }
  }
  return [...layers].sort();
}

function patchRevalidationLines(affectedObjects, renderingAffected) {
  const types = new Set(affectedObjects.map((object) => object.type));
  return [
    "json_schema",
    "semantic_validation",
    types.has("criterion") || types.has("tradeoff_surface") || types.has("option_move") ? "decision_surface_check" : null,
    types.has("evidence") || types.has("temporal_model") ? "temporal_validity_check" : null,
    types.has("lens") || types.has("council_result") ? "council_review_check" : null,
    types.has("gate") || types.has("review_log") ? "review_log_check" : null,
    renderingAffected ? "rendering_regeneration" : "rendering_check"
  ].filter(Boolean);
}

function edgeFamilyLines(data) {
  const edges = array(data.edges);
  if (edges.length === 0) return ["Edges: none recorded"];

  const families = ["causal", "evidential", "argumentative", "workflow_state"];
  return families.flatMap((family) => {
    const familyEdges = edges.filter((edge) => edge.relation_family === family);
    if (familyEdges.length === 0) return [];
    return [`${labelFamily(family)} edges: ${familyEdges.map((edge) => `${edge.edge_id}:${edge.from}-${edge.relation}->${edge.to}`).join(", ")}`];
  });
}

function labelFamily(family) {
  return String(family || "unclassified").replace("_", " ");
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

function lifecycleLines(data) {
  const identity = data.artifact_identity;
  if (!identity) return ["artifact identity not supplied"];
  return [
    `Artifact: ${identity.artifact_id}; case=${identity.case_id}; version=${data.ofone_version}`,
    `Identity tuple: objective=${identity.objective_head}; scope=${identity.scope_hash}; config=${identity.config_hash}`,
    `Evidence hashes: ${array(identity.active_evidence_hashes).join(", ") || "(none)"}`,
    `Status: ${identity.status}; created=${identity.created_at}`
  ];
}

function decisionSurfaceLines(data) {
  const criteria = array(data.criteria);
  const surface = data.tradeoff_surface;
  const lines = criteria.map((criterion) => (
    `${criterion.criterion_id}: ${criterion.priority} ${criterion.kind}; ${criterion.name}; threshold=${criterion.threshold}`
  ));

  if (surface?.surface_id) {
    lines.push(`${surface.surface_id}: dominant=${surface.dominant_option}; criteria=${array(surface.criteria).join(", ")}; reverses_on=${array(surface.reversal_conditions).join(", ") || "(none)"}`);
  } else {
    lines.push("tradeoff surface not supplied");
  }

  return lines.length > 0 ? lines : ["none recorded"];
}

function actorLines(data) {
  const actors = array(data.actors);
  if (actors.length === 0) return ["Actors: none recorded"];
  return actors.map((actor) => (
    `Actor ${actor.actor_id}: ${actor.label}; role=${actor.role}; authority=${actor.authority}; exposures=${array(actor.exposures).join(", ")}`
  ));
}

function temporalLines(data) {
  const model = data.temporal_model;
  if (!model) return ["Temporal: not supplied"];
  return [
    `Temporal: horizon=${model.time_horizon}; deadline=${model.decision_deadline}; cadence=${model.update_cadence}`,
    `Evidence windows: ${array(model.evidence_validity_windows).map((window) => `${window.evidence_id}:${window.valid_until || window.staleness_trigger}`).join(", ") || "(none)"}`
  ];
}

function informationValueLines(data) {
  const items = array(data.information_value);
  if (items.length === 0) return ["none recorded"];
  return items.map((item) => (
    `${item.unknown_id}: impact=${item.decision_impact}; cost=${item.resolution_cost}; risk_reduction=${item.risk_reduction}; next=${item.recommended_next_query}`
  ));
}

function lensCouncilLines(data) {
  const lensLines = array(data.lenses).map((lens) => (
    `${lens.lens_id}: ${lens.name}; axis=${lens.adapter_axis}; blind_spots=${array(lens.blind_spots).join(", ") || "(none)"}`
  ));
  if (data.council_result) {
    lensLines.push(`Council: coverage=${array(data.council_result.coverage).join(", ") || "(none)"}; dissent=${array(data.council_result.major_dissent).join(", ") || "(none)"}; effect=${data.council_result.decision_effect}`);
  }
  return lensLines.length > 0 ? lensLines : ["none recorded"];
}

function reviewLogLines(data) {
  const reviews = array(data.review_log);
  if (reviews.length === 0) return ["none recorded"];
  return reviews.map((review) => `${review.review_id}: gate=${review.gate_id}; actor=${review.actor_id}; decision=${review.decision}; notes=${review.notes}`);
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
