#!/usr/bin/env node
import fs from "node:fs";
import { buildObjectIndex, dependencyClosure } from "../lib/ofone-graph.mjs";

const [file, ...changedIds] = process.argv.slice(2);

if (!file || changedIds.length === 0) {
  console.error("Usage: node scripts/ofone-patch.mjs <ofone-map.json> <changed-object-id> [...]");
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const index = buildObjectIndex(data);
const missing = changedIds.filter((id) => !index.ids.has(id));

if (missing.length > 0) {
  console.error(`Unknown object id(s): ${missing.join(", ")}`);
  process.exit(1);
}

const closure = dependencyClosure(changedIds, index.reverseDeps);
const transition = classifyTransition(data, changedIds, closure);
const affectedObjects = closure.map((id) => describeObject(id));
const changedObjects = changedIds.map((id) => describeObject(id));
const affectedSemanticLayers = semanticLayersFor([...changedObjects, ...affectedObjects]);
const renderingAffected = data.decision_rendering?.rendering_id ? closure.includes(data.decision_rendering.rendering_id) : false;
const invalidatedClaims = affectedObjects.filter((object) => object.type === "claim").map((object) => object.id);
const validationScope = [...changedObjects, ...affectedObjects];
const requiredRevalidation = [
  "json_schema",
  "semantic_validation",
  requiresTypeCheck(validationScope, ["criterion", "tradeoff_surface", "option_move"]) ? "decision_surface_check" : null,
  requiresTypeCheck(validationScope, ["evidence", "temporal_model"]) ? "temporal_validity_check" : null,
  requiresTypeCheck(validationScope, ["lens", "council_result"]) ? "council_review_check" : null,
  requiresTypeCheck(validationScope, ["gate", "review_log"]) ? "review_log_check" : null,
  renderingAffected ? "rendering_regeneration" : "rendering_check",
  transition === "human_review" ? "human_gate_review" : null
].filter(Boolean);

console.log(JSON.stringify({
  input: file,
  changed_objects: changedObjects,
  affected_closure: affectedObjects,
  affected_by_type: groupByType(affectedObjects),
  affected_semantic_layers: affectedSemanticLayers,
  invalidated_claims: invalidatedClaims,
  suggested_transition: transition,
  rendering_affected: renderingAffected,
  required_revalidation: requiredRevalidation,
  patch_report: {
    summary: summarizePatch(changedObjects, affectedObjects, transition, renderingAffected),
    next_steps: nextSteps(transition, renderingAffected, invalidatedClaims)
  }
}, null, 2));

function classifyTransition(data, changedIds, closure) {
  const changedTypes = changedIds.map((id) => index.ids.get(id)?.type);
  const hasGate = changedTypes.includes("gate") || closure.some((id) => index.ids.get(id)?.type === "gate");
  const hasRendering = data.decision_rendering?.rendering_id && closure.includes(data.decision_rendering.rendering_id);
  const hasAdapter = changedTypes.includes("adapter_projection");
  const highRisk = data.charter?.risk_tier === "high";

  if (hasAdapter) return "trunk_rewrite";
  if (hasGate || highRisk) return "human_review";
  if (hasRendering) return "patch";
  if (closure.length > 0) return "patch";
  return "no_op";
}

function describeObject(id) {
  const entry = index.ids.get(id);
  return {
    id,
    type: entry?.type || "missing",
    label: labelFor(entry)
  };
}

function labelFor(entry) {
  const object = entry?.object || {};
  return object.text || object.description || object.name || object.label || object.condition || object.decision_effect || object.recommended_next_query || object.recommendation || object.summary || object.source || object.move_type || object.objective_head || object.time_horizon || object.surface_id || "";
}

function groupByType(objects) {
  return objects.reduce((groups, object) => {
    groups[object.type] ||= [];
    groups[object.type].push(object.id);
    return groups;
  }, {});
}

function summarizePatch(changedObjects, affectedObjects, transition, renderingAffected) {
  return `${changedObjects.map((object) => object.id).join(", ")} affects ${affectedObjects.length} downstream object(s); transition=${transition}; rendering=${renderingAffected ? "affected" : "not affected"}`;
}

function nextSteps(transition, renderingAffected, invalidatedClaims) {
  const steps = ["rerun validation after applying any object edits"];
  if (invalidatedClaims.length > 0) steps.push(`reassess affected claims: ${invalidatedClaims.join(", ")}`);
  if (renderingAffected) steps.push("regenerate decision rendering");
  if (transition === "human_review") steps.push("route through the required human gate before release");
  if (transition === "trunk_rewrite") steps.push("recompute charter, adapter projection, and dependent graph");
  return steps;
}

function semanticLayersFor(objects) {
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

function requiresTypeCheck(objects, types) {
  return objects.some((object) => types.includes(object.type));
}
