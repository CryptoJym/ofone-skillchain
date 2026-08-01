import { EPSILON, array, clamp, object, sha256Hex, stableStringify, unique } from "./util.mjs";
import { normalizeBeliefs, posteriorForAnswer, shannonEntropy } from "./belief.mjs";
import { decisionSnapshotForState } from "./decision.mjs";
import { evaluateCausalDepth } from "./causal.mjs";

export function unresolvedImpact(state) {
  return array(state.unknowns)
    .filter((unknown) => unknown.status === "open")
    .reduce((sum, unknown) => sum + clamp(unknown.impact ?? 0), 0);
}

export function normalizeHypothesisBeliefs(state) {
  const normalized = normalizeBeliefs(state.hypotheses);
  for (const hypothesis of array(state.hypotheses)) {
    if (Object.prototype.hasOwnProperty.call(normalized, hypothesis.hypothesis_id)) {
      hypothesis.belief = normalized[hypothesis.hypothesis_id];
    } else if (hypothesis.active === false) {
      hypothesis.belief = 0;
    }
  }
}

function mergeFrame(target, patch) {
  for (const [key, value] of Object.entries(object(patch))) {
    if (Array.isArray(value)) target[key] = unique([...array(target[key]), ...value]);
    else if (value && typeof value === "object") target[key] = { ...object(target[key]), ...value };
    else target[key] = value;
  }
}

export function applyEffects(state, effects) {
  const effect = object(effects);
  const unknownIndex = new Map(array(state.unknowns).map((unknown) => [unknown.unknown_id, unknown]));
  for (const id of array(effect.resolve_unknowns)) {
    const unknown = unknownIndex.get(id);
    if (unknown) unknown.status = "resolved";
  }
  for (const id of array(effect.accept_unknowns)) {
    const unknown = unknownIndex.get(id);
    if (unknown) unknown.status = "accepted_risk";
    state.convergence.accepted_residual_unknowns = unique([
      ...array(state.convergence.accepted_residual_unknowns), id
    ]);
  }

  const hypothesisIndex = new Map(array(state.hypotheses).map((hypothesis) => [hypothesis.hypothesis_id, hypothesis]));
  for (const id of array(effect.eliminate_hypotheses)) {
    const hypothesis = hypothesisIndex.get(id);
    if (hypothesis) {
      hypothesis.active = false;
      hypothesis.belief = 0;
    }
  }
  for (const [id, multiplier] of Object.entries(object(effect.belief_multipliers))) {
    const hypothesis = hypothesisIndex.get(id);
    if (hypothesis) {
      hypothesis.belief = Math.max(0, Number(hypothesis.belief ?? hypothesis.prior ?? 0) * Number(multiplier));
    }
  }
  for (const hypothesis of array(effect.add_hypotheses)) {
    if (!hypothesisIndex.has(hypothesis.hypothesis_id)) state.hypotheses.push(hypothesis);
  }

  const questionIndex = new Map(array(state.questions).map((question) => [question.question_id, question]));
  for (const id of array(effect.activate_questions)) {
    const question = questionIndex.get(id);
    if (question && question.status === "blocked") question.status = "pending";
  }
  for (const id of array(effect.retire_questions)) {
    const question = questionIndex.get(id);
    if (question && question.status !== "answered") question.status = "retired";
  }

  state.causal_depth = object(state.causal_depth);
  state.causal_depth.nodes = array(state.causal_depth.nodes);
  state.causal_depth.links = array(state.causal_depth.links);
  state.causal_depth.nodes.push(...array(effect.add_causal_nodes));
  state.causal_depth.links.push(...array(effect.add_causal_links));

  if (effect.frame_shift) mergeFrame(state.frame, effect.frame_shift);
  if (effect.set_convergence) state.convergence = { ...state.convergence, ...effect.set_convergence };
  if (effect.resolve_contradictions) {
    const ids = new Set(array(effect.resolve_contradictions));
    for (const contradiction of array(state.contradictions)) {
      if (ids.has(contradiction.contradiction_id)) contradiction.status = "resolved";
    }
  }
}

export function previewStateAfterAnswer(inputState, question, answer) {
  const state = JSON.parse(JSON.stringify(inputState));
  state.questions = array(state.questions);
  state.hypotheses = array(state.hypotheses);
  state.unknowns = array(state.unknowns);
  state.contradictions = array(state.contradictions);
  state.convergence = object(state.convergence);
  state.frame = object(state.frame);
  const previewQuestion = state.questions.find((candidate) => candidate.question_id === question.question_id);
  const beliefs = normalizeBeliefs(state.hypotheses);
  if (Object.keys(object(question.answer_model?.likelihoods)).length > 0) {
    const posterior = posteriorForAnswer(question, answer, beliefs);
    for (const hypothesis of state.hypotheses) {
      if (Object.prototype.hasOwnProperty.call(posterior, hypothesis.hypothesis_id)) {
        hypothesis.belief = posterior[hypothesis.hypothesis_id];
      }
    }
  }
  applyEffects(state, object(question.answer_effects)[answer] || {});
  normalizeHypothesisBeliefs(state);
  if (previewQuestion) {
    previewQuestion.status = "answered";
    previewQuestion.answer = answer;
  }
  for (const candidate of state.questions) {
    if (candidate.status === "selected") candidate.status = "pending";
  }
  state.policy.current_question_id = null;
  state.status = "active";
  return state;
}

export function computeStateMetrics(state) {
  const beliefs = normalizeBeliefs(state.hypotheses);
  const entropy = shannonEntropy(beliefs);
  const maxEntropy = Math.log2(Math.max(Object.keys(beliefs).length, 1));
  const causal = evaluateCausalDepth(state);
  const decision = decisionSnapshotForState(state, beliefs);
  const contradictions = array(state.contradictions).filter((item) => item.status !== "resolved");
  return {
    entropy_bits: entropy,
    normalized_entropy: maxEntropy <= EPSILON ? 0 : clamp(entropy / maxEntropy),
    unresolved_impact: unresolvedImpact(state),
    active_hypotheses: Object.keys(beliefs).length,
    causal_bedrock_coverage: causal.coverage,
    decision_robustness: decision.robustness,
    decision_margin: decision.margin,
    residual_evpi: decision.normalized_evpi ?? 0,
    expected_value_perfect_information: decision.expected_value_perfect_information ?? 0,
    robust_maximum_regret: decision.maximum_regret ?? null,
    current_best_action_id: decision.best_action_id,
    unresolved_contradictions: contradictions.length
  };
}

export function chainGenesis(state) {
  return sha256Hex(`${String(state?.engine_id || "")}:${String(state?.qg_version || "")}`);
}

export function chainEvent(state, event) {
  const previous = array(state.history);
  const prevHash = previous.length > 0
    ? String(previous[previous.length - 1].event_hash || "")
    : chainGenesis(state);
  const body = { ...event };
  delete body.event_hash;
  body.prev_event_hash = prevHash;
  body.event_hash = sha256Hex(prevHash + stableStringify(body));
  return body;
}

export function verifyHistoryChain(state) {
  const findings = [];
  let prevHash = chainGenesis(state);
  for (const [index, event] of array(state.history).entries()) {
    const body = { ...event };
    delete body.event_hash;
    if (String(event.prev_event_hash || "") !== prevHash) {
      findings.push({ index, code: "QG_HISTORY_CHAIN_BROKEN", message: `History event ${index} prev_event_hash does not extend the chain.` });
      prevHash = String(event.event_hash || "");
      continue;
    }
    const expectedHash = sha256Hex(prevHash + stableStringify(body));
    if (String(event.event_hash || "") !== expectedHash) {
      findings.push({ index, code: "QG_HISTORY_CHAIN_BROKEN", message: `History event ${index} content does not match its event_hash.` });
    }
    prevHash = String(event.event_hash || "");
  }
  return findings;
}

export function progressBetween(before, after) {
  const entropyReduction = Math.max(0, before.normalized_entropy - after.normalized_entropy);
  const unresolvedReduction = before.unresolved_impact <= EPSILON
    ? 0
    : Math.max(0, before.unresolved_impact - after.unresolved_impact) / before.unresolved_impact;
  const robustnessGain = Math.max(0, after.decision_robustness - before.decision_robustness);
  const causalGain = Math.max(0, after.causal_bedrock_coverage - before.causal_bedrock_coverage);
  const contradictionReduction = before.unresolved_contradictions <= 0
    ? 0
    : Math.max(0, before.unresolved_contradictions - after.unresolved_contradictions) / before.unresolved_contradictions;
  return {
    entropy_reduction: entropyReduction,
    unresolved_impact_reduction: unresolvedReduction,
    decision_robustness_gain: robustnessGain,
    causal_depth_gain: causalGain,
    contradiction_reduction: contradictionReduction,
    total: entropyReduction * 0.2
      + unresolvedReduction * 0.25
      + robustnessGain * 0.2
      + causalGain * 0.2
      + contradictionReduction * 0.15
  };
}
