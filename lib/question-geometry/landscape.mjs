import {
  EPSILON,
  aggregatePenalty,
  array,
  clamp,
  jaccard,
  object,
  policyFor,
  questionFamily,
  unique
} from "./util.mjs";
import {
  answerLabels,
  expectedBeliefDisplacement,
  expectedInformationGain,
  normalizeBeliefs,
  probabilityOfAnswer
} from "./belief.mjs";
import { expectedDecisionGain } from "./decision.mjs";
import { previewStateAfterAnswer } from "./state.mjs";

function questionRedundancy(question, state) {
  const answered = array(state.questions).filter((candidate) => candidate.status === "answered");
  const historyTexts = array(state.history).map((event) => event.question_text).filter(Boolean);
  const comparisons = [...answered.map((candidate) => candidate.text), ...historyTexts];
  if (comparisons.length === 0) return clamp(question.metrics?.redundancy ?? 0);
  const highest = Math.max(...comparisons.map((text) => jaccard(question.text, text)));
  return clamp(Math.max(highest, Number(question.metrics?.redundancy ?? 0)));
}

function prerequisitesSatisfied(question, state) {
  const answered = new Set(array(state.questions)
    .filter((candidate) => candidate.status === "answered")
    .map((candidate) => candidate.question_id));
  return array(question.prerequisites).every((id) => answered.has(id));
}

function expectedLookaheadValue(question, state) {
  const policy = policyFor(state);
  const supplied = clamp(question.metrics?.lookahead_value ?? 0);
  if (policy.lookahead_depth < 1) return supplied;
  const labels = answerLabels(question);
  const beliefs = normalizeBeliefs(state.hypotheses);
  if (labels.length === 0) return supplied;
  const hasLikelihoods = Object.keys(object(question.answer_model?.likelihoods)).length > 0;
  let expectedBestNext = 0;
  for (const answer of labels) {
    const probability = hasLikelihoods ? probabilityOfAnswer(question, answer, beliefs) : 1 / labels.length;
    if (probability <= EPSILON) continue;
    const preview = previewStateAfterAnswer(state, question, answer);
    const scores = array(preview.questions)
      .filter((candidate) => candidate.question_id !== question.question_id)
      .map((candidate) => scoreQuestion(candidate, preview, { includeLookahead: false }))
      .filter((candidate) => candidate.eligible)
      .map((candidate) => Math.max(0, candidate.scalar));
    expectedBestNext += probability * (scores.length > 0 ? Math.max(...scores) : 0);
  }
  return clamp(Math.max(supplied, expectedBestNext));
}

export function scoreQuestion(question, state, options = {}) {
  const policy = policyFor(state);
  const information = expectedInformationGain(question, state.hypotheses);
  const displacement = expectedBeliefDisplacement(question, state.hypotheses);
  const decision = expectedDecisionGain(question, state);
  const metrics = object(question.metrics);
  const cost = aggregatePenalty(question.costs);
  const risk = aggregatePenalty(question.risks);
  const delay = clamp(question.delay ?? metrics.delay ?? 0);
  const redundancy = questionRedundancy(question, state);
  const vector = {
    decision_gain: decision.normalized,
    information_gain: information.normalized,
    belief_displacement: displacement,
    causal_discrimination: clamp(metrics.causal_discrimination ?? 0),
    model_expansion: clamp(metrics.model_expansion ?? 0),
    unlock_value: clamp(metrics.unlock_value ?? 0),
    robustness_gain: clamp(metrics.robustness_gain ?? 0),
    actionability: clamp(metrics.actionability ?? 0),
    novelty: clamp(metrics.novelty ?? (1 - redundancy)),
    lookahead_value: options.includeLookahead === false
      ? clamp(metrics.lookahead_value ?? 0)
      : expectedLookaheadValue(question, state),
    exploration_bonus: clamp((metrics.score_uncertainty ?? 0) * policy.exploration_rate),
    cost,
    risk,
    delay,
    redundancy
  };
  const positiveKeys = [
    "decision_gain", "information_gain", "belief_displacement", "causal_discrimination",
    "model_expansion", "unlock_value", "robustness_gain", "actionability", "novelty",
    "lookahead_value", "exploration_bonus"
  ];
  const negativeKeys = ["cost", "risk", "delay", "redundancy"];
  const positive = positiveKeys.reduce((sum, key) => sum + vector[key] * Number(policy.weights[key] ?? 0), 0);
  const negative = negativeKeys.reduce((sum, key) => sum + vector[key] * Number(policy.weights[key] ?? 0), 0);
  const normalizer = Math.max(
    Object.entries(policy.weights)
      .filter(([key]) => !negativeKeys.includes(key))
      .reduce((sum, [, value]) => sum + Math.abs(Number(value) || 0), 0),
    1
  );
  const dominatedBy = question.dominance?.dominated_by || null;
  const eligible = question.status === "pending"
    && prerequisitesSatisfied(question, state)
    && !dominatedBy
    && redundancy <= policy.thresholds.maximum_redundancy;
  return {
    question_id: question.question_id,
    type: question.type,
    family: questionFamily(question.type),
    targets: array(question.targets),
    vector,
    scalar: (positive - negative) / normalizer,
    eligible,
    exclusion_reasons: [
      ...(question.status !== "pending" ? [`status:${question.status}`] : []),
      ...(!prerequisitesSatisfied(question, state) ? ["prerequisites_unmet"] : []),
      ...(dominatedBy ? [`blackwell_or_declared_dominated_by:${dominatedBy}`] : []),
      ...(redundancy > policy.thresholds.maximum_redundancy ? ["redundant_with_answered_question"] : [])
    ],
    expected_information_gain_bits: information.raw_bits,
    expected_decision_gain_utility: decision.raw_utility,
    answer_probabilities: information.answer_probabilities
  };
}

function vectorDominates(left, right) {
  const maximize = [
    "decision_gain", "information_gain", "belief_displacement", "causal_discrimination",
    "model_expansion", "unlock_value", "robustness_gain", "actionability", "novelty",
    "lookahead_value"
  ];
  const minimize = ["cost", "risk", "delay", "redundancy"];
  let strictlyBetter = false;
  for (const key of maximize) {
    if (left[key] + EPSILON < right[key]) return false;
    if (left[key] > right[key] + EPSILON) strictlyBetter = true;
  }
  for (const key of minimize) {
    if (left[key] > right[key] + EPSILON) return false;
    if (left[key] + EPSILON < right[key]) strictlyBetter = true;
  }
  return strictlyBetter;
}

function areNeighbors(left, right) {
  if (left.question_id === right.question_id) return false;
  const leftTargets = new Set(left.targets);
  return right.targets.some((target) => leftTargets.has(target)) || left.family === right.family;
}

export function buildQuestionLandscape(state) {
  const policy = policyFor(state);
  const scored = array(state.questions).map((question) => scoreQuestion(question, state));
  const eligible = scored.filter((item) => item.eligible);
  const pareto = eligible.filter((candidate) =>
    !eligible.some((other) => other.question_id !== candidate.question_id && vectorDominates(other.vector, candidate.vector))
  );
  const localMaxima = [];
  const localMinima = [];
  for (const candidate of eligible) {
    const neighbors = eligible.filter((other) => areNeighbors(candidate, other));
    if (neighbors.length === 0) continue;
    if (neighbors.every((other) => candidate.scalar >= other.scalar - EPSILON)) localMaxima.push(candidate.question_id);
    if (neighbors.every((other) => candidate.scalar <= other.scalar + EPSILON)) localMinima.push(candidate.question_id);
  }
  const ranked = [...eligible].sort((left, right) => right.scalar - left.scalar);
  const plateaus = [];
  for (let index = 0; index < ranked.length - 1; index += 1) {
    if (Math.abs(ranked[index].scalar - ranked[index + 1].scalar) <= policy.thresholds.local_plateau_width) {
      plateaus.push([ranked[index].question_id, ranked[index + 1].question_id]);
    }
  }
  return {
    generated_at_iteration: Number(state.iteration || 0),
    scored,
    pareto_frontier: pareto.map((item) => item.question_id),
    ranked_eligible: ranked.map((item) => item.question_id),
    local_maxima: unique(localMaxima),
    local_minima: unique(localMinima),
    plateaus,
    selected_question_id: ranked[0]?.question_id || null,
    maximum_net_question_value: ranked[0]?.scalar ?? null
  };
}
