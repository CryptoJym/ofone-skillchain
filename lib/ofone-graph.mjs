export function array(value) {
  return Array.isArray(value) ? value : [];
}

export function buildObjectIndex(data) {
  const ids = new Map();
  const reverseDeps = new Map();

  const add = (id, type, object) => {
    if (!id) return;
    ids.set(id, { id, type, object });
  };

  add("CHARTER", "charter", data.charter);
  add("ADAPTER", "adapter_projection", data.adapter_projection);
  add("CONFIDENCE", "confidence_model", data.confidence_model);
  add(data.artifact_identity?.artifact_id, "artifact_identity", data.artifact_identity);
  add(data.scene?.scene_id, "scene", data.scene);

  for (const frame of array(data.scene?.frames)) add(frame.frame_id, "frame", frame);
  for (const token of array(data.scene?.tokens)) add(token.token_id, `token:${token.kind || "unknown"}`, token);
  for (const subscene of array(data.scene?.subscenes)) add(subscene.subscene_id, "subscene", subscene);
  for (const evidence of array(data.evidence)) add(evidence.evidence_id, "evidence", evidence);
  for (const claim of array(data.claims)) add(claim.claim_id, "claim", claim);
  for (const unknown of array(data.unknowns)) add(unknown.unknown_id, "unknown", unknown);
  for (const test of array(data.kill_tests)) add(test.test_id, "kill_test", test);
  for (const criterion of array(data.criteria)) add(criterion.criterion_id, "criterion", criterion);
  add(data.tradeoff_surface?.surface_id, "tradeoff_surface", data.tradeoff_surface);
  for (const actor of array(data.actors)) add(actor.actor_id, "actor", actor);
  add("TEMPORAL", "temporal_model", data.temporal_model);
  for (const item of array(data.information_value)) add(`IV:${item.unknown_id}`, "information_value", item);
  for (const lens of array(data.lenses)) add(lens.lens_id, "lens", lens);
  add("COUNCIL", "council_result", data.council_result);
  for (const review of array(data.review_log)) add(review.review_id, "review_log", review);
  add(data.review_cycle?.cycle_id, "review_cycle", data.review_cycle);
  add(data.benchmark_trace?.trace_id, "benchmark_trace", data.benchmark_trace);
  for (const edge of array(data.edges)) add(edge.edge_id, "edge", edge);
  for (const loop of array(data.loops)) add(loop.loop_id, "loop", loop);
  for (const option of array(data.option_moves)) add(option.option_id, "option_move", option);
  for (const trigger of array(data.triggers)) add(trigger.trigger_id, "trigger", trigger);
  for (const gate of array(data.gates)) add(gate.gate_id, "gate", gate);
  add(data.decision_rendering?.rendering_id, "rendering", data.decision_rendering);

  for (const evidence of array(data.evidence)) {
    for (const claimId of array(evidence.supports)) addReverse(reverseDeps, evidence.evidence_id, claimId);
    addReverse(reverseDeps, evidence.evidence_id, data.artifact_identity?.artifact_id);
  }

  addReverse(reverseDeps, data.artifact_identity?.artifact_id, data.decision_rendering?.rendering_id);

  for (const subscene of array(data.scene?.subscenes)) {
    addReverse(reverseDeps, subscene.parent_scene, subscene.subscene_id);
    for (const frameId of array(subscene.frames)) addReverse(reverseDeps, frameId, subscene.subscene_id);
    for (const tokenId of array(subscene.tokens)) addReverse(reverseDeps, tokenId, subscene.subscene_id);
  }

  for (const claim of array(data.claims)) {
    for (const evidenceId of array(claim.supports)) addReverse(reverseDeps, evidenceId, claim.claim_id);
    for (const claimId of array(claim.contradicts)) addReverse(reverseDeps, claimId, claim.claim_id);
    for (const depId of array(claim.depends_on)) addReverse(reverseDeps, depId, claim.claim_id);
  }

  for (const unknown of array(data.unknowns)) {
    for (const blockedId of array(unknown.blocks)) addReverse(reverseDeps, unknown.unknown_id, blockedId);
  }

  for (const test of array(data.kill_tests)) {
    addReverse(reverseDeps, test.target, test.test_id);
    for (const claimId of array(test.falsifies)) addReverse(reverseDeps, test.test_id, claimId);
  }

  for (const criterion of array(data.criteria)) {
    for (const actorId of array(criterion.owned_by)) addReverse(reverseDeps, actorId, criterion.criterion_id);
  }

  if (data.tradeoff_surface?.surface_id) {
    for (const optionId of array(data.tradeoff_surface.options)) addReverse(reverseDeps, optionId, data.tradeoff_surface.surface_id);
    for (const criterionId of array(data.tradeoff_surface.criteria)) addReverse(reverseDeps, criterionId, data.tradeoff_surface.surface_id);
    for (const reasonId of array(data.tradeoff_surface.why)) addReverse(reverseDeps, reasonId, data.tradeoff_surface.surface_id);
    for (const reversalId of array(data.tradeoff_surface.reversal_conditions)) addReverse(reverseDeps, reversalId, data.tradeoff_surface.surface_id);
    addReverse(reverseDeps, data.tradeoff_surface.surface_id, data.decision_rendering?.rendering_id);
  }

  for (const item of array(data.information_value)) {
    addReverse(reverseDeps, item.unknown_id, `IV:${item.unknown_id}`);
    addReverse(reverseDeps, `IV:${item.unknown_id}`, data.decision_rendering?.rendering_id);
  }

  for (const window of array(data.temporal_model?.evidence_validity_windows)) addReverse(reverseDeps, window.evidence_id, "TEMPORAL");
  addReverse(reverseDeps, "TEMPORAL", data.decision_rendering?.rendering_id);

  for (const lens of array(data.lenses)) {
    for (const claimId of array(lens.claims_examined)) addReverse(reverseDeps, claimId, lens.lens_id);
    addReverse(reverseDeps, lens.lens_id, "COUNCIL");
  }

  addReverse(reverseDeps, "COUNCIL", data.decision_rendering?.rendering_id);

  for (const review of array(data.review_log)) {
    addReverse(reverseDeps, review.gate_id, review.review_id);
    addReverse(reverseDeps, review.actor_id, review.review_id);
    addReverse(reverseDeps, review.review_id, data.decision_rendering?.rendering_id);
  }

  addReverse(reverseDeps, data.review_cycle?.cycle_id, data.decision_rendering?.rendering_id);
  addReverse(reverseDeps, data.benchmark_trace?.trace_id, data.decision_rendering?.rendering_id);

  for (const edge of array(data.edges)) {
    addReverse(reverseDeps, edge.from, edge.edge_id);
    addReverse(reverseDeps, edge.to, edge.edge_id);
    for (const evidenceId of array(edge.evidence_refs)) addReverse(reverseDeps, evidenceId, edge.edge_id);
  }

  for (const loop of array(data.loops)) {
    for (const edgeId of array(loop.edges)) addReverse(reverseDeps, edgeId, loop.loop_id);
  }

  for (const option of array(data.option_moves)) {
    for (const claimId of array(option.preconditions)) addReverse(reverseDeps, claimId, option.option_id);
    for (const edgeId of array(option.expected_effects)) addReverse(reverseDeps, edgeId, option.option_id);
    if (option.review_gate && option.review_gate !== "none") addReverse(reverseDeps, option.review_gate, option.option_id);
  }

  for (const trigger of array(data.triggers)) {
    for (const objectId of array(trigger.affected_objects)) addReverse(reverseDeps, objectId, trigger.trigger_id);
  }

  if (data.decision_rendering?.rendering_id) {
    for (const depId of array(data.decision_rendering.depends_on)) {
      addReverse(reverseDeps, depId, data.decision_rendering.rendering_id);
    }
  }

  return { ids, reverseDeps };
}

export function addReverse(map, from, to) {
  if (!from || !to) return;
  if (!map.has(from)) map.set(from, new Set());
  map.get(from).add(to);
}

export function dependencyClosure(startIds, reverseDeps) {
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

export function objectType(index, id) {
  return index.ids.get(id)?.type || "missing";
}
