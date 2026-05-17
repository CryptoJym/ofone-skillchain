#!/usr/bin/env node
import fs from "node:fs";
import { buildObjectIndex, dependencyClosure } from "../lib/ofone-graph.mjs";

const [file, ...patchArgs] = process.argv.slice(2);
const { operationId, changedIds } = parsePatchArgs(patchArgs);

if (!file || changedIds.length === 0) {
  console.error("Usage: node scripts/ofone-patch.mjs <ofone-map.json> [--operation <operation>] <changed-object-id> [...]");
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const index = buildObjectIndex(data);
const operation = patchOperation(operationId);
const missing = changedIds.filter((id) => !index.ids.has(id));

if (missing.length > 0) {
  console.error(`Unknown object id(s): ${missing.join(", ")}`);
  process.exit(1);
}

const closure = dependencyClosure(changedIds, index.reverseDeps);
const affectedObjects = closure.map((id) => describeObject(id));
const changedObjects = changedIds.map((id) => describeObject(id));
const affectedSemanticLayers = semanticLayersFor([...changedObjects, ...affectedObjects]);
const renderingAffected = data.decision_rendering?.rendering_id ? closure.includes(data.decision_rendering.rendering_id) : false;
const invalidatedClaims = invalidatedClaimsFor(operation, changedObjects, affectedObjects);
const reopenedGates = reopenedGatesFor(operation, changedObjects, affectedObjects);
const requiredApprovals = requiredApprovalsFor(operation, changedObjects, affectedObjects);
const transition = classifyTransition(data, operation, changedIds, closure, { reopenedGates, requiredApprovals });
const validationScope = [...changedObjects, ...affectedObjects];
const requiredRevalidation = [
  "json_schema",
  "semantic_validation",
  requiresTypeCheck(validationScope, ["criterion", "tradeoff_surface", "option_move"]) ? "decision_surface_check" : null,
  requiresTypeCheck(validationScope, ["evidence", "temporal_model"]) ? "temporal_validity_check" : null,
  requiresTypeCheck(validationScope, ["actor"]) ? "actor_gate_alignment_check" : null,
  requiresTypeCheck(validationScope, ["trigger"]) ? "trigger_transition_check" : null,
  requiresTypeCheck(validationScope, ["lens", "council_result"]) ? "council_review_check" : null,
  requiresTypeCheck(validationScope, ["gate", "review_log"]) ? "review_log_check" : null,
  renderingAffected ? "rendering_regeneration" : "rendering_check",
  transition === "human_review" ? "human_gate_review" : null
].filter(Boolean);
const changedDecisionMeaning = decisionMeaningFor(operation, changedObjects, affectedObjects, renderingAffected, transition);

console.log(JSON.stringify({
  input: file,
  operation: {
    operation_id: operation.id,
    label: operation.label,
    description: operation.description
  },
  changed_objects: changedObjects,
  affected_closure: affectedObjects,
  affected_by_type: groupByType(affectedObjects),
  affected_semantic_layers: affectedSemanticLayers,
  invalidated_claims: invalidatedClaims,
  reopened_gates: reopenedGates,
  required_approvals: requiredApprovals,
  suggested_transition: transition,
  rendering_affected: renderingAffected,
  rendering_regeneration_required: renderingAffected,
  changed_decision_meaning: changedDecisionMeaning,
  required_revalidation: requiredRevalidation,
  semantic_patch_operations: semanticPatchOperations(operation, changedObjects, affectedObjects, {
    invalidatedClaims,
    reopenedGates,
    requiredApprovals,
    renderingAffected
  }),
  patch_report: {
    summary: summarizePatch(operation, changedObjects, affectedObjects, transition, renderingAffected),
    next_steps: nextSteps(operation, transition, renderingAffected, invalidatedClaims, reopenedGates, requiredApprovals)
  }
}, null, 2));

function parsePatchArgs(args) {
  let operationId = "object_change";
  const ids = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--operation" || arg === "-o") {
      operationId = args[i + 1] || operationId;
      i += 1;
      continue;
    }
    if (arg.startsWith("--operation=")) {
      operationId = arg.slice("--operation=".length);
      continue;
    }
    ids.push(arg);
  }

  return { operationId: normalizeOperationId(operationId), changedIds: ids };
}

function normalizeOperationId(value) {
  return String(value || "object_change").toLowerCase().replace(/[-\s]+/g, "_");
}

function patchOperation(operationId) {
  const operations = {
    object_change: {
      id: "object_change",
      label: "Object change",
      description: "Generic object change with dependency-closure impact analysis.",
      review: false
    },
    add_supporting_evidence: {
      id: "add_supporting_evidence",
      label: "Add supporting evidence",
      description: "Attach or modify evidence support and reassess supported claims.",
      review: false
    },
    supersede_evidence: {
      id: "supersede_evidence",
      label: "Supersede evidence",
      description: "Replace or retire evidence, then reassess all supported claims and evidence validity windows.",
      review: false
    },
    downgrade_confidence: {
      id: "downgrade_confidence",
      label: "Downgrade confidence",
      description: "Lower confidence on a claim or model component and reassess dependent options and rendering.",
      review: false
    },
    invalidate_criterion: {
      id: "invalidate_criterion",
      label: "Invalidate criterion",
      description: "Remove or weaken a decision criterion and re-evaluate the tradeoff surface.",
      review: false
    },
    open_gate: {
      id: "open_gate",
      label: "Open gate",
      description: "Open a human-review gate and block release until review is complete.",
      review: true
    },
    reopen_gate: {
      id: "reopen_gate",
      label: "Reopen gate",
      description: "Reopen a previously approved or closed gate and force re-review before release.",
      review: true
    },
    trigger_re_review: {
      id: "trigger_re_review",
      label: "Trigger re-review",
      description: "Require renewed review because a material dependency changed.",
      review: true
    },
    supersede_artifact_identity: {
      id: "supersede_artifact_identity",
      label: "Supersede artifact identity",
      description: "Supersede the artifact identity tuple and recompute objective, scope, config, and evidence hashes.",
      trunk: true
    },
    actor_reassignment: {
      id: "actor_reassignment",
      label: "Actor reassignment",
      description: "Change reviewer, owner, stakeholder, authority, or exposure assignments.",
      review: true
    },
    trigger_activation: {
      id: "trigger_activation",
      label: "Trigger activation",
      description: "Activate a trigger and patch all affected downstream dependencies.",
      review: false
    },
    trigger_deactivation: {
      id: "trigger_deactivation",
      label: "Trigger deactivation",
      description: "Deactivate or neutralize a trigger and verify whether prior patch requirements can be released.",
      review: false
    }
  };

  return operations[operationId] || { ...operations.object_change, id: operationId, label: operationId.replaceAll("_", " ") };
}

function classifyTransition(data, operation, changedIds, closure, { reopenedGates, requiredApprovals }) {
  const changedTypes = changedIds.map((id) => index.ids.get(id)?.type);
  const hasGate = changedTypes.includes("gate") || closure.some((id) => index.ids.get(id)?.type === "gate");
  const hasRendering = data.decision_rendering?.rendering_id && closure.includes(data.decision_rendering.rendering_id);
  const hasAdapter = changedTypes.includes("adapter_projection");
  const highRisk = data.charter?.risk_tier === "high";

  if (operation.trunk || hasAdapter) return "trunk_rewrite";
  if (operation.review || reopenedGates.length > 0 || requiredApprovals.length > 0 || hasGate || highRisk) return "human_review";
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

function summarizePatch(operation, changedObjects, affectedObjects, transition, renderingAffected) {
  return `${operation.id} on ${changedObjects.map((object) => object.id).join(", ")} affects ${affectedObjects.length} downstream object(s); transition=${transition}; rendering=${renderingAffected ? "affected" : "not affected"}`;
}

function nextSteps(operation, transition, renderingAffected, invalidatedClaims, reopenedGates, requiredApprovals) {
  const steps = ["rerun validation after applying any object edits"];
  if (invalidatedClaims.length > 0) steps.push(`reassess affected claims: ${invalidatedClaims.join(", ")}`);
  if (reopenedGates.length > 0) steps.push(`reopen gates: ${reopenedGates.map((gate) => gate.gate_id).join(", ")}`);
  if (requiredApprovals.length > 0) steps.push(`collect required approvals: ${requiredApprovals.map((approval) => `${approval.gate_id}:${approval.reviewer}`).join(", ")}`);
  if (renderingAffected) steps.push("regenerate decision rendering");
  if (operation.id === "supersede_artifact_identity") steps.push("write superseded status and create a new artifact identity tuple");
  if (operation.id === "trigger_activation" || operation.id === "trigger_deactivation") steps.push("record trigger state change in patch history or review log");
  if (transition === "human_review") steps.push("route through the required human gate before release");
  if (transition === "trunk_rewrite") steps.push("recompute charter, adapter projection, and dependent graph");
  return steps;
}

function invalidatedClaimsFor(operation, changedObjects, affectedObjects) {
  const claims = new Set();
  for (const object of affectedObjects) {
    if (object.type === "claim") claims.add(object.id);
  }
  if (operation.id === "downgrade_confidence") {
    for (const object of changedObjects) {
      if (object.type === "claim") claims.add(object.id);
    }
  }
  if (operation.id === "supersede_evidence") {
    for (const object of changedObjects) {
      const entry = index.ids.get(object.id);
      for (const claimId of entry?.object?.supports || []) claims.add(claimId);
    }
  }
  return [...claims].sort();
}

function reopenedGatesFor(operation, changedObjects, affectedObjects) {
  if (!["open_gate", "reopen_gate", "trigger_re_review"].includes(operation.id)) return [];
  return [...changedObjects, ...affectedObjects]
    .filter((object) => object.type === "gate")
    .map((object) => gateSummary(object.id));
}

function requiredApprovalsFor(operation, changedObjects, affectedObjects) {
  const shouldRequire = operation.review || data.charter?.risk_tier === "high";
  if (!shouldRequire) return [];
  const gateIds = new Set();
  for (const object of [...changedObjects, ...affectedObjects]) {
    if (object.type === "gate") gateIds.add(object.id);
  }
  if (data.charter?.risk_tier === "high") {
    for (const gate of data.gates || []) gateIds.add(gate.gate_id);
  }
  if (operation.review && gateIds.size === 0) {
    for (const gate of data.gates || []) gateIds.add(gate.gate_id);
  }
  return [...gateIds].map((gateId) => gateSummary(gateId));
}

function gateSummary(gateId) {
  const gate = index.ids.get(gateId)?.object || {};
  return {
    gate_id: gateId,
    status: gate.status || "unknown",
    reviewer: gate.reviewer || "unknown",
    required_decision: gate.required_decision || gate.condition || "review"
  };
}

function decisionMeaningFor(operation, changedObjects, affectedObjects, renderingAffected, transition) {
  const objectList = changedObjects.map((object) => `${object.id}:${object.type}`).join(", ");
  const affected = affectedObjects.length;
  const rendering = renderingAffected ? "the current decision rendering must be regenerated" : "the current decision rendering can remain if validation still passes";
  const review = transition === "human_review" ? " human review blocks release." : "";
  const trunk = transition === "trunk_rewrite" ? " the artifact trunk must be recomputed." : "";
  return `${operation.label} changes ${objectList}; ${affected} downstream object(s) are in closure, so ${rendering}.${review}${trunk}`;
}

function semanticPatchOperations(operation, changedObjects, affectedObjects, context) {
  const base = [
    {
      op: operation.id,
      targets: changedObjects.map((object) => object.id),
      effect: operation.description
    }
  ];

  if (context.invalidatedClaims.length > 0) {
    base.push({ op: "reassess_claims", targets: context.invalidatedClaims, effect: "Recompute support, contradiction load, confidence, and failure modes." });
  }
  if (context.reopenedGates.length > 0) {
    base.push({ op: "reopen_gates", targets: context.reopenedGates.map((gate) => gate.gate_id), effect: "Block release until gate decisions are updated." });
  }
  if (context.requiredApprovals.length > 0) {
    base.push({ op: "collect_approvals", targets: context.requiredApprovals.map((approval) => approval.gate_id), effect: "Route changed decision state to named reviewers." });
  }
  if (context.renderingAffected) {
    base.push({ op: "regenerate_rendering", targets: [data.decision_rendering?.rendering_id].filter(Boolean), effect: "Render a new decision view after validation passes." });
  }
  if (operation.id === "supersede_artifact_identity") {
    base.push({ op: "create_successor_identity", targets: changedObjects.map((object) => object.id), effect: "Create a successor artifact with recomputed hashes and lifecycle status." });
  }

  return base;
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
