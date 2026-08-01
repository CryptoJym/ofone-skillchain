import { EPSILON, array, clamp, object, unique } from "./util.mjs";

export function normalizeBeliefs(hypotheses) {
  const active = array(hypotheses).filter((hypothesis) => hypothesis.active !== false);
  if (active.length === 0) return {};
  const raw = Object.fromEntries(active.map((hypothesis) => [
    hypothesis.hypothesis_id,
    Math.max(0, Number(hypothesis.belief ?? hypothesis.prior ?? 0))
  ]));
  const total = Object.values(raw).reduce((sum, value) => sum + value, 0);
  if (total <= EPSILON) {
    const equal = 1 / active.length;
    return Object.fromEntries(active.map((hypothesis) => [hypothesis.hypothesis_id, equal]));
  }
  return Object.fromEntries(Object.entries(raw).map(([id, value]) => [id, value / total]));
}

export function normalizeBeliefMap(values) {
  const entries = Object.entries(object(values)).map(([id, value]) => [id, Math.max(0, Number(value || 0))]);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (entries.length === 0) return {};
  if (total <= EPSILON) return Object.fromEntries(entries.map(([id]) => [id, 1 / entries.length]));
  return Object.fromEntries(entries.map(([id, value]) => [id, value / total]));
}

export function shannonEntropy(probabilities) {
  const values = Array.isArray(probabilities) ? probabilities : Object.values(object(probabilities));
  return values.reduce((sum, probability) => {
    const p = Number(probability);
    return !Number.isFinite(p) || p <= 0 ? sum : sum - p * Math.log2(p);
  }, 0);
}

export function answerLabels(question) {
  const declared = array(question.answer_space);
  if (declared.length > 0) return declared;
  const labels = new Set();
  for (const byAnswer of Object.values(object(question.answer_model?.likelihoods))) {
    for (const label of Object.keys(object(byAnswer))) labels.add(label);
  }
  return [...labels];
}

export function probabilityOfAnswer(question, answer, beliefs) {
  const likelihoods = object(question.answer_model?.likelihoods);
  return Object.entries(beliefs).reduce((sum, [hypothesisId, prior]) => {
    const likelihood = Number(object(likelihoods[hypothesisId])[answer] ?? 0);
    return sum + prior * Math.max(0, likelihood);
  }, 0);
}

export function posteriorForAnswer(question, answer, beliefs) {
  const likelihoods = object(question.answer_model?.likelihoods);
  const unnormalized = {};
  let total = 0;
  for (const [hypothesisId, prior] of Object.entries(beliefs)) {
    const likelihood = Number(object(likelihoods[hypothesisId])[answer] ?? 0);
    const value = prior * Math.max(0, likelihood);
    unnormalized[hypothesisId] = value;
    total += value;
  }
  if (total <= EPSILON) return { ...beliefs };
  return Object.fromEntries(Object.entries(unnormalized).map(([id, value]) => [id, value / total]));
}

export function fisherRaoDistance(left, right) {
  const keys = unique([...Object.keys(object(left)), ...Object.keys(object(right))]);
  const affinity = keys.reduce((sum, key) => {
    const p = Math.max(0, Number(object(left)[key] ?? 0));
    const q = Math.max(0, Number(object(right)[key] ?? 0));
    return sum + Math.sqrt(p * q);
  }, 0);
  return 2 * Math.acos(clamp(affinity, 0, 1));
}

export function expectedBeliefDisplacement(question, hypotheses) {
  const beliefs = normalizeBeliefs(hypotheses);
  const labels = answerLabels(question);
  if (labels.length === 0 || Object.keys(object(question.answer_model?.likelihoods)).length === 0) {
    return clamp(question.metrics?.belief_displacement ?? 0);
  }
  const expected = labels.reduce((sum, answer) => {
    const probability = probabilityOfAnswer(question, answer, beliefs);
    if (probability <= EPSILON) return sum;
    const posterior = posteriorForAnswer(question, answer, beliefs);
    return sum + probability * (fisherRaoDistance(beliefs, posterior) / Math.PI);
  }, 0);
  return clamp(expected);
}

export function expectedInformationGain(question, hypotheses) {
  const beliefs = normalizeBeliefs(hypotheses);
  const labels = answerLabels(question);
  const likelihoods = object(question.answer_model?.likelihoods);
  if (labels.length === 0 || Object.keys(likelihoods).length === 0) {
    return {
      raw_bits: null,
      normalized: clamp(question.metrics?.information_gain ?? 0),
      answer_probabilities: {}
    };
  }
  const priorEntropy = shannonEntropy(beliefs);
  let expectedPosteriorEntropy = 0;
  const answerProbabilities = {};
  for (const answer of labels) {
    const probability = probabilityOfAnswer(question, answer, beliefs);
    answerProbabilities[answer] = probability;
    if (probability <= EPSILON) continue;
    expectedPosteriorEntropy += probability * shannonEntropy(posteriorForAnswer(question, answer, beliefs));
  }
  const raw = Math.max(0, priorEntropy - expectedPosteriorEntropy);
  return {
    raw_bits: raw,
    normalized: clamp(raw / Math.max(priorEntropy, EPSILON)),
    answer_probabilities: answerProbabilities
  };
}
