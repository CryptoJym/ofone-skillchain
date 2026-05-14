#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { adapterContract } from "../lib/adapter-contracts.mjs";
import { array, buildObjectIndex, dependencyClosure, objectType } from "../lib/ofone-graph.mjs";

const args = process.argv.slice(2);
const write = args.includes("--write");
const files = args.filter((arg) => arg !== "--write");

if (files.length === 0) {
  console.error("Usage: node scripts/ofone-validate.mjs [--write] <ofone-map.json> [...]");
  process.exit(2);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const schemasDir = path.join(repoRoot, "schemas");

const enums = {
  modes: new Set(["Micro", "Map", "Audit"]),
  movementJobs: new Set(["BOUND", "GROUND", "CLAIM", "LINK", "TEST", "MOVE", "EVALUATE", "WARN", "TRIGGER", "GATE"]),
  ordinals: new Set(["low", "medium", "high"]),
  adapters: new Set(["strategic-agentic", "scientific-explanatory", "formal", "normative-evaluative", "hybrid", "provisional"]),
  loopTypes: new Set(["reinforcing", "balancing", "measurement", "incentive", "learning", "contradiction", "review", "deception", "regime"]),
  triggerTransitions: new Set(["no_op", "patch", "scoped_rerun", "trunk_rewrite", "human_review"])
};

const ajv = new Ajv2020({ allErrors: true, strict: false });
for (const schemaName of ["ofone.base.schema.json", "ofone.micro.schema.json", "ofone.map.schema.json", "ofone.audit.schema.json", "ofone.schema.json"]) {
  ajv.addSchema(JSON.parse(fs.readFileSync(path.join(schemasDir, schemaName), "utf8")));
}

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
    return { ok: false, messages: [`ERROR invalid JSON: ${error.message}`] };
  }

  const checks = [];
  const fail = (check, notes) => checks.push({ check, passed: false, notes });
  const warn = (check, notes) => checks.push({ check, passed: true, notes, warning: true });
  const pass = (check, notes) => checks.push({ check, passed: true, notes });

  const schemaId = schemaIdForMode(data.mode);
  const validateSchema = ajv.getSchema(schemaId);

  if (!validateSchema) {
    fail("schema_profile", `no schema profile for mode ${data.mode}`);
  } else if (!validateSchema(data)) {
    for (const error of validateSchema.errors || []) {
      fail("json_schema", `${error.instancePath || "/"} ${error.message}`);
    }
  } else {
    pass("json_schema", `${data.mode} artifact matches executable JSON Schema profile`);
  }

  validateSemantic(data, { fail, warn, pass });

  const failedChecks = checks.filter((check) => check.passed === false);
  const ok = failedChecks.length === 0;

  if (data.validator_result?.passed !== undefined && data.validator_result.passed !== ok) {
    warn("self_attestation", `artifact validator_result.passed=${data.validator_result.passed}; computed result is ${ok}`);
  }

  const computedResult = {
    passed: ok,
    checks: checks.map(({ check, passed, notes }) => ({ check, passed, notes }))
  };

  if (write) {
    data.validator_result = computedResult;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    pass("validator_result", "wrote computed validator_result into artifact");
  }

  for (const check of checks) {
    const prefix = check.passed ? (check.warning ? "WARN" : "OK") : "ERROR";
    messages.push(`${prefix} ${check.check}: ${check.notes}`);
  }

  return { ok, messages };
}

function validateSemantic(data, { fail, warn, pass }) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    fail("root", "artifact root must be an object");
    return;
  }

  if (!enums.modes.has(data.mode)) fail("mode", `mode must be one of ${join(enums.modes)}`);

  validateMovementJobs(data.charter, "charter", fail);
  validateMovementJobs(data.adapter_projection, "adapter_projection", fail);
  validateMovementJobs(data.scene, "scene", fail);
  validateMovementJobs(data.confidence_model, "confidence_model", fail);
  validateMovementJobs(data.decision_rendering, "decision_rendering", fail);

  const primaryAdapter = data.adapter_projection?.primary;
  const contract = adapterContract(primaryAdapter);
  if (!contract) {
    fail("adapter_contract", `adapter_projection.primary must be one of ${join(enums.adapters)}`);
  } else {
    pass("adapter_contract", `${primaryAdapter} adapter contract loaded`);
  }

  if (primaryAdapter === "hybrid" && Object.keys(data.adapter_projection?.axes || {}).length < 2) {
    fail("adapter_contract", "hybrid adapter requires at least two adapter axes");
  }

  if (!enums.ordinals.has(data.charter?.risk_tier)) fail("risk_tier", "charter.risk_tier must be low|medium|high");
  if (data.charter?.risk_tier === "high" && array(data.gates).length === 0) {
    fail("human_gate", "high-risk charter requires at least one gate");
  }

  const idEntries = collectIdEntries(data);
  const ids = new Set();
  for (const entry of idEntries) {
    if (!entry.id) {
      fail("ids", `${entry.label} missing id`);
      continue;
    }
    if (ids.has(entry.id)) fail("ids", `duplicate id ${entry.id}`);
    ids.add(entry.id);
  }

  const index = buildObjectIndex(data);
  const evidenceIds = new Set(array(data.evidence).map((item) => item.evidence_id));
  const claimIds = new Set(array(data.claims).map((item) => item.claim_id));
  const edgeIds = new Set(array(data.edges).map((item) => item.edge_id));
  const gateIds = new Set(array(data.gates).map((item) => item.gate_id));

  validateEvidence(data, contract, claimIds, { fail, warn });
  validateClaims(data, contract, evidenceIds, claimIds, index, { fail, warn });
  validateEdges(data, evidenceIds, index, { fail });
  validateLoops(data, edgeIds, { fail });
  validateOptions(data, claimIds, edgeIds, gateIds, data, { fail, warn });
  validateTriggers(data, index, { fail, pass });
  validateConfidenceModel(data.confidence_model, { fail });
  validateRendering(data, index, { fail });

  if (data.mode === "Micro" && array(data.decision_rendering?.depends_on).length > 6) {
    warn("mode_profile", "Micro rendering has more than six dependencies; consider Map mode");
  }

  pass("semantic_validation", "semantic graph checks completed");
}

function validateEvidence(data, contract, claimIds, { fail, warn }) {
  for (const evidence of array(data.evidence)) {
    validateMovementJobs(evidence, `evidence ${evidence.evidence_id}`, fail);
    if (contract && !contract.allowedEvidenceSources.includes(evidence.source)) {
      warn("adapter_contract", `evidence ${evidence.evidence_id} source ${evidence.source} is unusual for ${data.adapter_projection.primary}`);
    }
    if (evidence.content_hash === "unknown" && data.mode === "Audit") {
      fail("evidence_identity", `audit evidence ${evidence.evidence_id} requires stable content_hash`);
    }
    for (const claimId of array(evidence.supports)) {
      if (!claimIds.has(claimId)) fail("references", `evidence ${evidence.evidence_id} supports missing claim ${claimId}`);
    }
  }
}

function validateClaims(data, contract, evidenceIds, claimIds, index, { fail, warn }) {
  for (const claim of array(data.claims)) {
    validateMovementJobs(claim, `claim ${claim.claim_id}`, fail);
    if (contract && !contract.allowedClaimTypes.includes(claim.type)) {
      warn("adapter_contract", `claim ${claim.claim_id} type ${claim.type} is unusual for ${data.adapter_projection.primary}`);
    }
    if (array(claim.supports).length === 0 && claim.status === "active") {
      fail("claim_support", `active claim ${claim.claim_id} has no evidence support`);
    }
    for (const evidenceId of array(claim.supports)) {
      if (!evidenceIds.has(evidenceId)) fail("references", `claim ${claim.claim_id} supports missing evidence ${evidenceId}`);
    }
    for (const claimId of array(claim.contradicts)) {
      if (!claimIds.has(claimId)) fail("references", `claim ${claim.claim_id} contradicts missing claim ${claimId}`);
    }
    for (const depId of array(claim.depends_on)) {
      if (!index.ids.has(depId)) fail("references", `claim ${claim.claim_id} depends_on missing object ${depId}`);
    }
    if (!claim.confidence || !enums.ordinals.has(claim.confidence.level)) {
      fail("confidence", `claim ${claim.claim_id} confidence.level must be low|medium|high`);
    }
    if (array(claim.confidence?.basis).length === 0) fail("confidence", `claim ${claim.claim_id} confidence basis is empty`);
    if (array(claim.confidence?.failure_modes).length === 0) fail("confidence", `claim ${claim.claim_id} failure_modes is empty`);
  }
}

function validateEdges(data, evidenceIds, index, { fail }) {
  for (const edge of array(data.edges)) {
    validateMovementJobs(edge, `edge ${edge.edge_id}`, fail);
    if (!index.ids.has(edge.from)) fail("references", `edge ${edge.edge_id} from missing object ${edge.from}`);
    if (!index.ids.has(edge.to)) fail("references", `edge ${edge.edge_id} to missing object ${edge.to}`);
    for (const evidenceId of array(edge.evidence_refs)) {
      if (!evidenceIds.has(evidenceId)) fail("references", `edge ${edge.edge_id} references missing evidence ${evidenceId}`);
    }
    const fromType = objectType(index, edge.from);
    const toType = objectType(index, edge.to);
    if (!isLegalRelation(edge.relation, fromType, toType)) {
      fail("relation_legality", `edge ${edge.edge_id} cannot use ${edge.relation} from ${fromType} to ${toType}`);
    }
  }
}

function validateLoops(data, edgeIds, { fail }) {
  for (const loop of array(data.loops)) {
    validateMovementJobs(loop, `loop ${loop.loop_id}`, fail);
    if (!enums.loopTypes.has(loop.type)) fail("loop_type", `loop ${loop.loop_id} type must be one of ${join(enums.loopTypes)}`);
    for (const edgeId of array(loop.edges)) {
      if (!edgeIds.has(edgeId)) fail("references", `loop ${loop.loop_id} references missing edge ${edgeId}`);
    }
    if (array(loop.observable_cues).length === 0) fail("loop_physics", `loop ${loop.loop_id} needs at least one observable cue`);
    if (array(loop.control_points).length === 0) fail("loop_physics", `loop ${loop.loop_id} needs at least one control point`);
  }
}

function validateOptions(data, claimIds, edgeIds, gateIds, artifact, { fail, warn }) {
  const claims = array(artifact.claims);
  for (const option of array(data.option_moves)) {
    validateMovementJobs(option, `option ${option.option_id}`, fail);
    for (const claimId of array(option.preconditions)) {
      if (!claimIds.has(claimId)) fail("references", `option ${option.option_id} precondition missing claim ${claimId}`);
      const claim = claims.find((item) => item.claim_id === claimId);
      if (claim?.status === "disputed") warn("option_dependency", `option ${option.option_id} depends on disputed claim ${claimId}`);
    }
    for (const edgeId of array(option.expected_effects)) {
      if (!edgeIds.has(edgeId)) fail("references", `option ${option.option_id} expected_effect missing edge ${edgeId}`);
    }
    if (option.review_gate && option.review_gate !== "none" && !gateIds.has(option.review_gate)) {
      fail("references", `option ${option.option_id} references missing review_gate ${option.review_gate}`);
    }
  }
}

function validateTriggers(data, index, { fail, pass }) {
  for (const trigger of array(data.triggers)) {
    validateMovementJobs(trigger, `trigger ${trigger.trigger_id}`, fail);
    if (!enums.triggerTransitions.has(trigger.transition)) {
      fail("trigger_transition", `trigger ${trigger.trigger_id} transition must be one of ${join(enums.triggerTransitions)}`);
    }
    for (const objectId of array(trigger.affected_objects)) {
      if (!index.ids.has(objectId)) fail("references", `trigger ${trigger.trigger_id} affected object missing ${objectId}`);
    }
    const closure = dependencyClosure(array(trigger.affected_objects), index.reverseDeps);
    const includesRendering = data.decision_rendering?.rendering_id ? closure.includes(data.decision_rendering.rendering_id) : false;
    pass("dependency_closure", `trigger ${trigger.trigger_id}: ${closure.join(", ") || "(none)"}${includesRendering ? " [includes rendering]" : ""}`);
  }
}

function validateConfidenceModel(model, { fail }) {
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
    if (!enums.ordinals.has(model?.[field])) fail("confidence_model", `confidence_model.${field} must be low|medium|high`);
  }
}

function validateRendering(data, index, { fail }) {
  const rendering = data.decision_rendering;
  if (!rendering?.rendering_id) fail("decision_rendering", "decision_rendering.rendering_id is required");
  validateMovementJobs(rendering, "decision_rendering", fail);
  for (const depId of array(rendering?.depends_on)) {
    if (!index.ids.has(depId)) fail("references", `decision_rendering depends_on missing object ${depId}`);
  }
}

function collectIdEntries(data) {
  return [
    { label: "scene", id: data.scene?.scene_id },
    ...array(data.scene?.frames).map((item) => ({ label: "frame", id: item.frame_id })),
    ...array(data.scene?.tokens).map((item) => ({ label: "token", id: item.token_id })),
    ...array(data.evidence).map((item) => ({ label: "evidence", id: item.evidence_id })),
    ...array(data.claims).map((item) => ({ label: "claim", id: item.claim_id })),
    ...array(data.edges).map((item) => ({ label: "edge", id: item.edge_id })),
    ...array(data.loops).map((item) => ({ label: "loop", id: item.loop_id })),
    ...array(data.option_moves).map((item) => ({ label: "option_move", id: item.option_id })),
    ...array(data.triggers).map((item) => ({ label: "trigger", id: item.trigger_id })),
    ...array(data.gates).map((item) => ({ label: "gate", id: item.gate_id })),
    { label: "decision_rendering", id: data.decision_rendering?.rendering_id }
  ];
}

function isLegalRelation(relation, fromType, toType) {
  const from = normalizeType(fromType);
  const to = normalizeType(toType);

  const rules = {
    supports: () => ["evidence", "claim", "edge"].includes(from.base) && ["claim", "edge", "rendering"].includes(to.base),
    contradicts: () => from.base === "claim" && to.base === "claim",
    causes: () => ["token:entity", "token:variable", "claim"].includes(from.raw) && ["token:variable", "claim"].includes(to.raw),
    constrains: () => ["token:constraint", "claim", "gate"].includes(from.raw) && ["claim", "option_move", "edge", "loop", "rendering"].includes(to.base),
    enables: () => ["claim", "token:entity", "token:variable", "option_move"].includes(from.raw) && ["option_move", "claim"].includes(to.base),
    observes: () => ["evidence", "token:evidence", "token:variable"].includes(from.raw) && ["claim", "token:variable"].includes(to.raw),
    evaluates: () => ["claim", "option_move", "token:entity", "token:variable"].includes(from.raw) && ["option_move", "claim", "rendering"].includes(to.base),
    updates: () => ["trigger", "evidence", "claim"].includes(from.base) && ["claim", "edge", "loop", "option_move", "rendering"].includes(to.base),
    blocks: () => ["gate", "claim"].includes(from.base) && ["option_move", "rendering"].includes(to.base),
    depends_on: () => ["option_move", "claim", "rendering"].includes(from.base) && ["claim", "edge", "evidence", "loop", "gate"].includes(to.base)
  };

  return rules[relation]?.() ?? false;
}

function normalizeType(type) {
  const raw = type || "missing";
  return { raw, base: raw.split(":")[0] };
}

function schemaIdForMode(mode) {
  if (mode === "Micro") return "https://cryptojym.github.io/ofone-skillchain/schemas/ofone.micro.schema.json";
  if (mode === "Map") return "https://cryptojym.github.io/ofone-skillchain/schemas/ofone.map.schema.json";
  if (mode === "Audit") return "https://cryptojym.github.io/ofone-skillchain/schemas/ofone.audit.schema.json";
  return "https://cryptojym.github.io/ofone-skillchain/schemas/ofone.schema.json";
}

function validateMovementJobs(object, label, fail) {
  const jobs = array(object?.movement_jobs);
  if (jobs.length === 0) {
    fail("movement_jobs", `${label} missing movement_jobs`);
    return;
  }
  for (const job of jobs) {
    if (!enums.movementJobs.has(job)) fail("movement_jobs", `${label} has invalid movement job ${job}`);
  }
}

function join(set) {
  return [...set].join("|");
}
