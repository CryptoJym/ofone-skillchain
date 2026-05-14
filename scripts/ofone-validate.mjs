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
  validateOptionalMovementJobs(data.artifact_identity, "artifact_identity", fail);
  validateMovementJobs(data.adapter_projection, "adapter_projection", fail);
  validateMovementJobs(data.scene, "scene", fail);
  validateOptionalMovementJobs(data.temporal_model, "temporal_model", fail);
  validateOptionalMovementJobs(data.tradeoff_surface, "tradeoff_surface", fail);
  validateOptionalMovementJobs(data.council_result, "council_result", fail);
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
  validateAdapterGateCoverage(data, contract, { warn, pass });

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
  const unknownIds = new Set(array(data.unknowns).map((item) => item.unknown_id));
  const criterionIds = new Set(array(data.criteria).map((item) => item.criterion_id));
  const actorIds = new Set(array(data.actors).map((item) => item.actor_id));
  const edgeIds = new Set(array(data.edges).map((item) => item.edge_id));
  const gateIds = new Set(array(data.gates).map((item) => item.gate_id));

  if (data.artifact_identity) validateArtifactIdentity(data, { fail });
  validateSubscenes(data, index, { fail });
  validateEvidence(data, contract, claimIds, { fail, warn });
  validateClaims(data, contract, evidenceIds, claimIds, index, { fail, warn });
  validateUnknowns(data, index, { fail });
  validateKillTests(data, contract, index, { fail, warn });
  validateActors(data, { fail });
  validateCriteria(data, actorIds, { fail });
  validateTradeoffSurface(data, criterionIds, { fail });
  if (data.temporal_model) validateTemporalModel(data, evidenceIds, { fail });
  validateInformationValue(data, unknownIds, { fail });
  validateLenses(data, claimIds, { fail });
  if (data.council_result) validateCouncilResult(data, { fail });
  validateReviewLog(data, gateIds, actorIds, { fail });
  validateEdges(data, evidenceIds, index, { fail });
  validateLoops(data, edgeIds, { fail });
  validateOptions(data, claimIds, unknownIds, edgeIds, gateIds, data, { fail, warn });
  validateTriggers(data, index, { fail, pass });
  validateConfidenceModel(data.confidence_model, { fail });
  validateRendering(data, index, { fail });
  validateDecisionSurface(data, { fail, warn });
  validateProfileExpectations(data, { fail, warn });

  if (data.mode === "Micro" && array(data.decision_rendering?.depends_on).length > 6) {
    warn("mode_profile", "Micro rendering has more than six dependencies; consider Map mode");
  }

  pass("semantic_validation", "semantic graph checks completed");
}

function validateAdapterGateCoverage(data, contract, { warn, pass }) {
  if (!contract) return;
  const artifactText = JSON.stringify({
    objective: data.charter?.objective,
    scope: data.charter?.scope,
    stakes: data.charter?.stakes,
    claims: array(data.claims).map((claim) => claim.text),
    recommendation: data.decision_rendering?.recommendation
  });
  const expected = contract.requiredGateTriggers.filter((term) => containsNormalized(artifactText, term));
  if (expected.length === 0) return;

  const gateText = JSON.stringify(array(data.gates).map((gate) => [gate.condition, gate.reviewer, gate.required_decision]));
  const covered = expected.some((term) => containsNormalized(gateText, term)) || containsNormalized(gateText, "review");
  if (covered) {
    pass("adapter_gate_coverage", `gate coverage present for ${expected.join(", ")}`);
  } else {
    warn("adapter_gate_coverage", `artifact implies ${expected.join(", ")} exposure but gate text does not name the exposure`);
  }
}

function validateArtifactIdentity(data, { fail }) {
  const identity = data.artifact_identity;
  const evidenceHashes = new Set(array(data.evidence).map((evidence) => evidence.content_hash));
  const activeHashes = new Set(array(identity?.active_evidence_hashes));

  for (const hash of evidenceHashes) {
    if (!activeHashes.has(hash)) fail("identity", `artifact_identity.active_evidence_hashes missing evidence hash ${hash}`);
  }
}

function validateSubscenes(data, index, { fail }) {
  for (const subscene of array(data.scene?.subscenes)) {
    validateMovementJobs(subscene, `subscene ${subscene.subscene_id}`, fail);
    if (!index.ids.has(subscene.parent_scene)) fail("references", `subscene ${subscene.subscene_id} parent_scene missing ${subscene.parent_scene}`);
    for (const frameId of array(subscene.frames)) {
      if (!index.ids.has(frameId)) fail("references", `subscene ${subscene.subscene_id} frame missing ${frameId}`);
    }
    for (const tokenId of array(subscene.tokens)) {
      if (!index.ids.has(tokenId)) fail("references", `subscene ${subscene.subscene_id} token missing ${tokenId}`);
    }
  }
}

function validateActors(data, { fail }) {
  for (const actor of array(data.actors)) {
    validateMovementJobs(actor, `actor ${actor.actor_id}`, fail);
  }
}

function validateCriteria(data, actorIds, { fail }) {
  for (const criterion of array(data.criteria)) {
    validateMovementJobs(criterion, `criterion ${criterion.criterion_id}`, fail);
    for (const actorId of array(criterion.owned_by)) {
      if (!actorIds.has(actorId)) fail("criteria", `criterion ${criterion.criterion_id} owned_by missing actor ${actorId}`);
    }
  }
}

function validateTradeoffSurface(data, criterionIds, { fail }) {
  const surface = data.tradeoff_surface;
  const optionIds = new Set(array(data.option_moves).map((option) => option.option_id));
  const unknownIds = new Set(array(data.unknowns).map((unknown) => unknown.unknown_id));
  const triggerIds = new Set(array(data.triggers).map((trigger) => trigger.trigger_id));

  for (const optionId of array(surface?.options)) {
    if (!optionIds.has(optionId)) fail("decision_surface", `tradeoff_surface option missing ${optionId}`);
  }
  for (const criterionId of array(surface?.criteria)) {
    if (!criterionIds.has(criterionId)) fail("decision_surface", `tradeoff_surface criterion missing ${criterionId}`);
  }
  if (surface?.dominant_option && !optionIds.has(surface.dominant_option)) {
    fail("decision_surface", `tradeoff_surface dominant_option missing ${surface.dominant_option}`);
  }
  for (const reasonId of array(surface?.why)) {
    if (!criterionIds.has(reasonId)) fail("decision_surface", `tradeoff_surface why missing criterion ${reasonId}`);
  }
  for (const reversalId of array(surface?.reversal_conditions)) {
    if (!unknownIds.has(reversalId) && !triggerIds.has(reversalId)) {
      fail("decision_surface", `tradeoff_surface reversal condition missing unknown or trigger ${reversalId}`);
    }
  }
}

function validateTemporalModel(data, evidenceIds, { fail }) {
  const windows = array(data.temporal_model?.evidence_validity_windows);
  const windowIds = new Set(windows.map((window) => window.evidence_id));

  for (const evidenceId of evidenceIds) {
    if (!windowIds.has(evidenceId)) fail("temporal_validity", `temporal_model missing evidence validity window for ${evidenceId}`);
  }
  for (const window of windows) {
    if (!evidenceIds.has(window.evidence_id)) fail("temporal_validity", `temporal_model references missing evidence ${window.evidence_id}`);
    if (!window.valid_until && !window.staleness_trigger) {
      fail("temporal_validity", `temporal_model evidence window ${window.evidence_id} needs valid_until or staleness_trigger`);
    }
  }
}

function validateInformationValue(data, unknownIds, { fail }) {
  for (const item of array(data.information_value)) {
    validateMovementJobs(item, `information_value ${item.unknown_id}`, fail);
    if (!unknownIds.has(item.unknown_id)) fail("unknown_value", `information_value references missing unknown ${item.unknown_id}`);
  }
}

function validateLenses(data, claimIds, { fail }) {
  for (const lens of array(data.lenses)) {
    validateMovementJobs(lens, `lens ${lens.lens_id}`, fail);
    for (const claimId of array(lens.claims_examined)) {
      if (!claimIds.has(claimId)) fail("lens_coverage", `lens ${lens.lens_id} examines missing claim ${claimId}`);
    }
  }
}

function validateCouncilResult(data, { fail }) {
  validateMovementJobs(data.council_result, "council_result", fail);
}

function validateReviewLog(data, gateIds, actorIds, { fail }) {
  for (const review of array(data.review_log)) {
    validateMovementJobs(review, `review_log ${review.review_id}`, fail);
    if (!gateIds.has(review.gate_id)) fail("review_log", `review_log ${review.review_id} references missing gate ${review.gate_id}`);
    if (!actorIds.has(review.actor_id)) fail("review_log", `review_log ${review.review_id} references missing actor ${review.actor_id}`);
  }
}

function validateEvidence(data, contract, claimIds, { fail, warn }) {
  for (const evidence of array(data.evidence)) {
    validateMovementJobs(evidence, `evidence ${evidence.evidence_id}`, fail);
    if (contract && !contract.allowedEvidenceSources.includes(evidence.source)) {
      fail("adapter_contract", `evidence ${evidence.evidence_id} source ${evidence.source} is not allowed for ${data.adapter_projection.primary}`);
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
      fail("adapter_contract", `claim ${claim.claim_id} type ${claim.type} is not allowed for ${data.adapter_projection.primary}`);
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
    for (const basis of array(claim.confidence?.basis)) {
      if (contract && !contract.confidenceBasis.includes(basis)) {
        fail("adapter_contract", `claim ${claim.claim_id} confidence basis ${basis} is not allowed for ${data.adapter_projection.primary}`);
      }
    }
    if (array(claim.confidence?.failure_modes).length === 0) fail("confidence", `claim ${claim.claim_id} failure_modes is empty`);
  }
}

function validateUnknowns(data, index, { fail }) {
  for (const unknown of array(data.unknowns)) {
    validateMovementJobs(unknown, `unknown ${unknown.unknown_id}`, fail);
    const jobs = array(unknown.movement_jobs);
    if (!jobs.includes("WARN")) fail("unknown", `unknown ${unknown.unknown_id} must carry WARN movement job`);
    if (array(unknown.blocks).length === 0 && unknown.status === "open") {
      fail("unknown", `open unknown ${unknown.unknown_id} must block at least one object`);
    }
    for (const blockedId of array(unknown.blocks)) {
      if (!index.ids.has(blockedId)) fail("references", `unknown ${unknown.unknown_id} blocks missing object ${blockedId}`);
    }
    const blocksRendering = data.decision_rendering?.rendering_id && array(unknown.blocks).includes(data.decision_rendering.rendering_id);
    if (blocksRendering && data.charter?.risk_tier === "high" && array(data.gates).length === 0) {
      fail("human_gate", `high-risk unknown ${unknown.unknown_id} blocks rendering without a human gate`);
    }
  }
}

function validateKillTests(data, contract, index, { fail, warn }) {
  for (const test of array(data.kill_tests)) {
    validateMovementJobs(test, `kill_test ${test.test_id}`, fail);
    if (!array(test.movement_jobs).includes("TEST")) fail("kill_test", `kill_test ${test.test_id} must carry TEST movement job`);
    if (!index.ids.has(test.target)) fail("references", `kill_test ${test.test_id} target missing ${test.target}`);
    for (const claimId of array(test.falsifies)) {
      if (!index.ids.has(claimId)) fail("references", `kill_test ${test.test_id} falsifies missing object ${claimId}`);
    }
    if (contract && !contract.validKillTests.some((cue) => containsNormalized(test.condition, cue) || containsNormalized(test.test_type, cue))) {
      warn("adapter_contract", `kill_test ${test.test_id} does not obviously match ${data.adapter_projection.primary} contract kill-test cues`);
    }
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

function validateOptions(data, claimIds, unknownIds, edgeIds, gateIds, artifact, { fail, warn }) {
  const claims = array(artifact.claims);
  for (const option of array(data.option_moves)) {
    validateMovementJobs(option, `option ${option.option_id}`, fail);
    for (const claimId of array(option.preconditions)) {
      if (!claimIds.has(claimId)) fail("references", `option ${option.option_id} precondition missing claim ${claimId}`);
      const claim = claims.find((item) => item.claim_id === claimId);
      if (claim?.status === "disputed" && (!option.review_gate || option.review_gate === "none")) {
        fail("option_dependency", `option ${option.option_id} depends on disputed claim ${claimId} without a review gate`);
      } else if (claim?.status === "disputed") {
        warn("option_dependency", `option ${option.option_id} depends on disputed claim ${claimId} behind review gate ${option.review_gate}`);
      }
    }
    for (const unknownId of array(option.blocking_unknowns)) {
      if (!unknownIds.has(unknownId)) fail("references", `option ${option.option_id} blocking_unknown missing unknown ${unknownId}`);
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
  const renderingDeps = new Set(array(rendering?.depends_on));
  for (const depId of array(rendering?.depends_on)) {
    if (!index.ids.has(depId)) fail("references", `decision_rendering depends_on missing object ${depId}`);
  }
  for (const unknown of array(data.unknowns)) {
    if (array(unknown.blocks).includes(rendering?.rendering_id) && !renderingDeps.has(unknown.unknown_id)) {
      fail("decision_rendering", `decision_rendering missing blocking unknown dependency ${unknown.unknown_id}`);
    }
  }
}

function validateDecisionSurface(data, { fail, warn }) {
  const renderingDeps = new Set(array(data.decision_rendering?.depends_on));
  const requiresFullSurface = data.mode === "Map" || data.mode === "Audit";

  if (array(data.criteria).length === 0) fail("decision_surface", "decision rendering requires at least one criterion");
  if (requiresFullSurface && !data.tradeoff_surface?.surface_id) fail("decision_surface", `${data.mode} decision rendering requires tradeoff_surface`);
  if (data.tradeoff_surface?.surface_id && !renderingDeps.has(data.tradeoff_surface.surface_id)) {
    fail("decision_surface", `decision_rendering must depend_on tradeoff_surface ${data.tradeoff_surface.surface_id}`);
  }

  if (data.decision_rendering?.confidence === "high" && data.confidence_model?.hidden_variable_risk === "high") {
    warn("confidence_consistency", "high decision confidence with high hidden_variable_risk");
  }
  if (data.decision_rendering?.confidence === "high" && data.confidence_model?.contradiction_load === "high") {
    warn("confidence_consistency", "high decision confidence with high contradiction_load");
  }
  if (data.decision_rendering?.confidence === "high") {
    for (const unknown of array(data.unknowns)) {
      if (unknown.status === "open" && array(unknown.blocks).includes(data.decision_rendering.rendering_id)) {
        warn("confidence_consistency", `high decision confidence while open unknown ${unknown.unknown_id} blocks rendering`);
      }
    }
  }
}

function validateProfileExpectations(data, { fail, warn }) {
  const primaryAdapter = data.adapter_projection?.primary;
  const isHybridOrProvisional = primaryAdapter === "hybrid" || primaryAdapter === "provisional";
  const hasStrategicOrNormative = primaryAdapter === "strategic-agentic" || primaryAdapter === "normative-evaluative" || primaryAdapter === "hybrid";

  if ((data.mode === "Map" || data.mode === "Audit") && data.artifact_identity?.status === "released") {
    warn("lifecycle", "released artifacts should usually have an immutable release tag outside the mutable map");
  }

  if ((data.mode === "Map" || data.mode === "Audit") && hasStrategicOrNormative && array(data.actors).length === 0) {
    fail("actor_gate_alignment", `${data.mode} ${primaryAdapter} artifact requires actors`);
  }

  if ((data.mode === "Map" || data.mode === "Audit") && array(data.unknowns).some((unknown) => unknown.status === "open" && array(unknown.blocks).includes(data.decision_rendering?.rendering_id))) {
    const ivUnknowns = new Set(array(data.information_value).map((item) => item.unknown_id));
    for (const unknown of array(data.unknowns)) {
      if (unknown.status === "open" && array(unknown.blocks).includes(data.decision_rendering?.rendering_id) && !ivUnknowns.has(unknown.unknown_id)) {
        fail("unknown_value", `open unknown ${unknown.unknown_id} blocks rendering without information_value entry`);
      }
    }
  }

  if ((data.mode === "Map" || data.mode === "Audit") && isHybridOrProvisional) {
    const lensAxes = new Set(array(data.lenses).map((lens) => lens.adapter_axis));
    if (lensAxes.size < 2) fail("lens_coverage", `${data.mode} ${primaryAdapter} artifact requires lenses covering at least two adapter axes`);
  }

  if (data.mode === "Audit" && !data.council_result?.decision_effect) {
    fail("council_contention", "Audit artifact requires council_result.decision_effect");
  }

  if (data.mode === "Audit") {
    const reviewByGate = new Set(array(data.review_log).map((review) => review.gate_id));
    for (const gate of array(data.gates)) {
      if (gate.status === "approved" && !reviewByGate.has(gate.gate_id)) {
        fail("review_log", `approved gate ${gate.gate_id} requires review_log entry`);
      }
    }
  }
}

function collectIdEntries(data) {
  const entries = [
    { label: "scene", id: data.scene?.scene_id },
    ...array(data.scene?.frames).map((item) => ({ label: "frame", id: item.frame_id })),
    ...array(data.scene?.tokens).map((item) => ({ label: "token", id: item.token_id })),
    ...array(data.scene?.subscenes).map((item) => ({ label: "subscene", id: item.subscene_id })),
    ...array(data.evidence).map((item) => ({ label: "evidence", id: item.evidence_id })),
    ...array(data.claims).map((item) => ({ label: "claim", id: item.claim_id })),
    ...array(data.unknowns).map((item) => ({ label: "unknown", id: item.unknown_id })),
    ...array(data.kill_tests).map((item) => ({ label: "kill_test", id: item.test_id })),
    ...array(data.criteria).map((item) => ({ label: "criterion", id: item.criterion_id })),
    ...array(data.actors).map((item) => ({ label: "actor", id: item.actor_id })),
    ...array(data.information_value).map((item) => ({ label: "information_value", id: `IV:${item.unknown_id}` })),
    ...array(data.lenses).map((item) => ({ label: "lens", id: item.lens_id })),
    ...array(data.review_log).map((item) => ({ label: "review_log", id: item.review_id })),
    ...array(data.edges).map((item) => ({ label: "edge", id: item.edge_id })),
    ...array(data.loops).map((item) => ({ label: "loop", id: item.loop_id })),
    ...array(data.option_moves).map((item) => ({ label: "option_move", id: item.option_id })),
    ...array(data.triggers).map((item) => ({ label: "trigger", id: item.trigger_id })),
    ...array(data.gates).map((item) => ({ label: "gate", id: item.gate_id })),
    { label: "decision_rendering", id: data.decision_rendering?.rendering_id }
  ];

  if (data.artifact_identity) entries.unshift({ label: "artifact_identity", id: data.artifact_identity.artifact_id });
  if (data.tradeoff_surface) entries.push({ label: "tradeoff_surface", id: data.tradeoff_surface.surface_id });
  return entries;
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

function validateOptionalMovementJobs(object, label, fail) {
  if (object === undefined || object === null) return;
  validateMovementJobs(object, label, fail);
}

function containsNormalized(haystack, needle) {
  const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return normalize(haystack).includes(normalize(needle));
}

function join(set) {
  return [...set].join("|");
}
