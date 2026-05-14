#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node scripts/ofone-validate.mjs <ofone-map.json> [...]");
  process.exit(2);
}

const enums = {
  modes: new Set(["Micro", "Map", "Audit"]),
  movementJobs: new Set(["BOUND", "GROUND", "CLAIM", "LINK", "TEST", "MOVE", "EVALUATE", "WARN", "TRIGGER", "GATE"]),
  ordinals: new Set(["low", "medium", "high"]),
  adapters: new Set(["strategic-agentic", "scientific-explanatory", "formal", "normative-evaluative", "hybrid", "provisional"]),
  loopTypes: new Set(["reinforcing", "balancing", "measurement", "incentive", "learning", "contradiction", "review", "deception", "regime"]),
  triggerTransitions: new Set(["no_op", "patch", "scoped_rerun", "trunk_rewrite", "human_review"])
};

let hadFailure = false;

for (const file of files) {
  const result = validateFile(file);
  if (!result.ok) hadFailure = true;

  console.log(`\n${result.ok ? "PASS" : "FAIL"} ${file}`);
  for (const message of result.messages) console.log(`- ${message}`);
}

process.exit(hadFailure ? 1 : 0);

function validateFile(file) {
  const messages = [];
  let data;

  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return { ok: false, messages: [`invalid JSON: ${error.message}`] };
  }

  const fail = (message) => messages.push(`ERROR ${message}`);
  const warn = (message) => messages.push(`WARN ${message}`);
  const pass = (message) => messages.push(`OK ${message}`);

  requireObject(data, "root", fail);
  requireFields(data, [
    "ofone_version",
    "mode",
    "charter",
    "adapter_projection",
    "scene",
    "evidence",
    "claims",
    "edges",
    "loops",
    "option_moves",
    "triggers",
    "gates",
    "confidence_model",
    "decision_rendering",
    "validator_result"
  ], "root", fail);

  if (!enums.modes.has(data.mode)) fail(`mode must be one of ${join(enums.modes)}`);

  validateMovementJobs(data.charter, "charter", fail);
  validateMovementJobs(data.adapter_projection, "adapter_projection", fail);
  validateMovementJobs(data.scene, "scene", fail);
  validateMovementJobs(data.confidence_model, "confidence_model", fail);
  validateMovementJobs(data.decision_rendering, "decision_rendering", fail);

  if (!enums.adapters.has(data.adapter_projection?.primary)) {
    fail(`adapter_projection.primary must be one of ${join(enums.adapters)}`);
  }

  if (!enums.ordinals.has(data.charter?.risk_tier)) fail("charter.risk_tier must be low|medium|high");
  if (data.charter?.risk_tier === "high" && (!Array.isArray(data.gates) || data.gates.length === 0)) {
    fail("high-risk charter requires at least one gate");
  }

  const ids = new Set();
  const evidenceIds = new Set();
  const claimIds = new Set();
  const edgeIds = new Set();
  const optionIds = new Set();
  const gateIds = new Set();
  const tokenIds = new Set();
  const reverseDeps = new Map();

  const addId = (id, label) => {
    if (!id) {
      fail(`${label} missing id`);
      return;
    }
    if (ids.has(id)) fail(`duplicate id ${id}`);
    ids.add(id);
  };

  for (const token of array(data.scene?.tokens)) {
    addId(token.token_id, "token");
    tokenIds.add(token.token_id);
  }

  for (const evidence of array(data.evidence)) {
    addId(evidence.evidence_id, "evidence");
    evidenceIds.add(evidence.evidence_id);
    validateMovementJobs(evidence, `evidence ${evidence.evidence_id}`, fail);
    for (const claimId of array(evidence.supports)) addReverse(reverseDeps, evidence.evidence_id, claimId);
  }

  for (const claim of array(data.claims)) {
    addId(claim.claim_id, "claim");
    claimIds.add(claim.claim_id);
    validateMovementJobs(claim, `claim ${claim.claim_id}`, fail);
    requireFields(claim, ["supports", "contradicts", "depends_on", "confidence", "status"], `claim ${claim.claim_id}`, fail);
    if (array(claim.supports).length === 0 && claim.status === "active") {
      fail(`active claim ${claim.claim_id} has no evidence support`);
    }
    for (const evidenceId of array(claim.supports)) {
      if (!evidenceIds.has(evidenceId)) fail(`claim ${claim.claim_id} supports missing evidence ${evidenceId}`);
      addReverse(reverseDeps, evidenceId, claim.claim_id);
    }
    for (const depId of array(claim.depends_on)) {
      addReverse(reverseDeps, depId, claim.claim_id);
    }
    if (!claim.confidence || !enums.ordinals.has(claim.confidence.level)) {
      fail(`claim ${claim.claim_id} confidence.level must be low|medium|high`);
    }
    if (array(claim.confidence?.basis).length === 0) fail(`claim ${claim.claim_id} confidence basis is empty`);
    if (array(claim.confidence?.failure_modes).length === 0) fail(`claim ${claim.claim_id} failure_modes is empty`);
  }

  for (const edge of array(data.edges)) {
    addId(edge.edge_id, "edge");
    edgeIds.add(edge.edge_id);
    validateMovementJobs(edge, `edge ${edge.edge_id}`, fail);
    if (!ids.has(edge.from)) fail(`edge ${edge.edge_id} from missing object ${edge.from}`);
    if (!ids.has(edge.to)) fail(`edge ${edge.edge_id} to missing object ${edge.to}`);
    for (const evidenceId of array(edge.evidence_refs)) {
      if (!evidenceIds.has(evidenceId)) fail(`edge ${edge.edge_id} references missing evidence ${evidenceId}`);
    }
    addReverse(reverseDeps, edge.from, edge.edge_id);
    addReverse(reverseDeps, edge.to, edge.edge_id);
  }

  for (const loop of array(data.loops)) {
    addId(loop.loop_id, "loop");
    validateMovementJobs(loop, `loop ${loop.loop_id}`, fail);
    if (!enums.loopTypes.has(loop.type)) fail(`loop ${loop.loop_id} type must be one of ${join(enums.loopTypes)}`);
    for (const edgeId of array(loop.edges)) {
      if (!edgeIds.has(edgeId)) fail(`loop ${loop.loop_id} references missing edge ${edgeId}`);
      addReverse(reverseDeps, edgeId, loop.loop_id);
    }
  }

  for (const option of array(data.option_moves)) {
    addId(option.option_id, "option_move");
    optionIds.add(option.option_id);
    validateMovementJobs(option, `option ${option.option_id}`, fail);
    for (const claimId of array(option.preconditions)) {
      if (!claimIds.has(claimId)) fail(`option ${option.option_id} precondition missing claim ${claimId}`);
      addReverse(reverseDeps, claimId, option.option_id);
      const claim = array(data.claims).find((item) => item.claim_id === claimId);
      if (claim?.status === "disputed") warn(`option ${option.option_id} depends on disputed claim ${claimId}`);
    }
    for (const edgeId of array(option.expected_effects)) {
      if (!edgeIds.has(edgeId)) fail(`option ${option.option_id} expected_effect missing edge ${edgeId}`);
      addReverse(reverseDeps, edgeId, option.option_id);
    }
    if (option.review_gate && option.review_gate !== "none" && !gateIds.has(option.review_gate)) {
      // Gates are read after this loop; this warning is resolved below if needed.
    }
  }

  for (const gate of array(data.gates)) {
    addId(gate.gate_id, "gate");
    gateIds.add(gate.gate_id);
    validateMovementJobs(gate, `gate ${gate.gate_id}`, fail);
  }

  for (const option of array(data.option_moves)) {
    if (option.review_gate && option.review_gate !== "none" && !gateIds.has(option.review_gate)) {
      fail(`option ${option.option_id} references missing review_gate ${option.review_gate}`);
    }
  }

  for (const trigger of array(data.triggers)) {
    addId(trigger.trigger_id, "trigger");
    validateMovementJobs(trigger, `trigger ${trigger.trigger_id}`, fail);
    if (!enums.triggerTransitions.has(trigger.transition)) {
      fail(`trigger ${trigger.trigger_id} transition must be one of ${join(enums.triggerTransitions)}`);
    }
    for (const objectId of array(trigger.affected_objects)) {
      if (!ids.has(objectId)) fail(`trigger ${trigger.trigger_id} affected object missing ${objectId}`);
    }
    const closure = dependencyClosure(array(trigger.affected_objects), reverseDeps);
    pass(`trigger ${trigger.trigger_id} dependency closure: ${closure.join(", ") || "(none)"}`);
  }

  validateConfidenceModel(data.confidence_model, fail);

  for (const depId of array(data.decision_rendering?.depends_on)) {
    if (!ids.has(depId)) fail(`decision_rendering depends_on missing object ${depId}`);
  }

  if (data.validator_result?.passed !== true) {
    fail("validator_result.passed must be true before release");
  }

  const errors = messages.filter((message) => message.startsWith("ERROR"));
  if (errors.length === 0) {
    pass(`${path.basename(file)} passed structural, reference, movement, and closure checks`);
  }

  return { ok: errors.length === 0, messages };
}

function validateConfidenceModel(model, fail) {
  for (const field of [
    "overall",
    "provenance_strength",
    "source_independence",
    "recency",
    "mechanism_fit",
    "contradiction_load",
    "hidden_variable_risk",
    "adversarial_risk",
    "adapter_fit"
  ]) {
    if (!enums.ordinals.has(model?.[field])) fail(`confidence_model.${field} must be low|medium|high`);
  }
}

function validateMovementJobs(object, label, fail) {
  const jobs = array(object?.movement_jobs);
  if (jobs.length === 0) {
    fail(`${label} missing movement_jobs`);
    return;
  }
  for (const job of jobs) {
    if (!enums.movementJobs.has(job)) fail(`${label} has invalid movement job ${job}`);
  }
}

function requireObject(value, label, fail) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
}

function requireFields(value, fields, label, fail) {
  for (const field of fields) {
    if (value?.[field] === undefined) fail(`${label} missing ${field}`);
  }
}

function addReverse(map, from, to) {
  if (!from || !to) return;
  if (!map.has(from)) map.set(from, new Set());
  map.get(from).add(to);
}

function dependencyClosure(startIds, reverseDeps) {
  const seen = new Set();
  const queue = [...startIds];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const next of reverseDeps.get(current) || []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return [...seen].sort();
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function join(set) {
  return [...set].join("|");
}
