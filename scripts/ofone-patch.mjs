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

console.log(JSON.stringify({
  input: file,
  changed_objects: changedIds,
  affected_closure: closure,
  suggested_transition: transition,
  rendering_affected: data.decision_rendering?.rendering_id ? closure.includes(data.decision_rendering.rendering_id) : false
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
