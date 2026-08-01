import { EPSILON, array, clamp, object } from "./util.mjs";
import {
  answerLabels,
  normalizeBeliefMap,
  normalizeBeliefs,
  posteriorForAnswer,
  probabilityOfAnswer
} from "./belief.mjs";

function expectedUtility(action, beliefs) {
  const utilities = object(action.utilities);
  return Object.entries(beliefs).reduce(
    (sum, [hypothesisId, probability]) => sum + probability * Number(utilities[hypothesisId] ?? 0),
    0
  );
}

function utilityScale(decisionModel, actions) {
  const supplied = Number(decisionModel?.utility_scale);
  const all = actions.flatMap((action) => Object.values(object(action.utilities)).map(Number));
  const inferred = all.length > 0 ? Math.max(...all) - Math.min(...all) : 1;
  return Math.max(Math.abs(supplied || inferred || 1), EPSILON);
}

export function decisionSnapshot(decisionModel, beliefs) {
  const actions = array(decisionModel?.actions);
  if (actions.length === 0) {
    return {
      best_action_id: null,
      best_expected_utility: 0,
      second_expected_utility: 0,
      margin: 0,
      robustness: clamp(decisionModel?.robustness ?? 0),
      expected_value_perfect_information: 0,
      normalized_evpi: 0
    };
  }
  const ranked = actions
    .map((action) => ({ action_id: action.action_id, expected_utility: expectedUtility(action, beliefs) }))
    .sort((left, right) => right.expected_utility - left.expected_utility);
  const best = ranked[0];
  const second = ranked[1] || best;
  const scale = utilityScale(decisionModel, actions);
  const perfectValue = Object.entries(beliefs).reduce((sum, [hypothesisId, probability]) => {
    const bestForHypothesis = Math.max(...actions.map((action) => Number(object(action.utilities)[hypothesisId] ?? 0)));
    return sum + probability * bestForHypothesis;
  }, 0);
  const evpi = Math.max(0, perfectValue - best.expected_utility);
  return {
    best_action_id: best.action_id,
    best_expected_utility: best.expected_utility,
    second_expected_utility: second.expected_utility,
    margin: best.expected_utility - second.expected_utility,
    robustness: clamp(Math.abs(best.expected_utility - second.expected_utility) / scale),
    expected_value_perfect_information: evpi,
    normalized_evpi: clamp(evpi / scale),
    ranked_actions: ranked
  };
}

export function robustDecisionSnapshot(decisionModel, fallbackBeliefs = {}) {
  const actions = array(decisionModel?.actions);
  const configured = array(decisionModel?.belief_scenarios);
  const scenarios = configured.length > 0
    ? configured.map((scenario) => ({ scenario_id: scenario.scenario_id, beliefs: normalizeBeliefMap(scenario.beliefs) }))
    : [{ scenario_id: "fallback", beliefs: normalizeBeliefMap(fallbackBeliefs) }];
  if (actions.length === 0 || scenarios.length === 0) return decisionSnapshot(decisionModel, fallbackBeliefs);

  const scale = utilityScale(decisionModel, actions);
  const scenarioBest = new Map(scenarios.map((scenario) => [
    scenario.scenario_id,
    Math.max(...actions.map((action) => expectedUtility(action, scenario.beliefs)))
  ]));
  const rows = actions.map((action) => {
    const values = scenarios.map((scenario) => ({
      scenario_id: scenario.scenario_id,
      expected_utility: expectedUtility(action, scenario.beliefs)
    }));
    return {
      action_id: action.action_id,
      worst_case_utility: Math.min(...values.map((item) => item.expected_utility)),
      maximum_regret: Math.max(...values.map((item) => scenarioBest.get(item.scenario_id) - item.expected_utility)),
      scenario_values: values
    };
  });
  const rule = decisionModel?.robust_rule || "minimax_regret";
  rows.sort((left, right) => rule === "maximin"
    ? right.worst_case_utility - left.worst_case_utility
    : left.maximum_regret - right.maximum_regret);
  const best = rows[0];
  const second = rows[1] || best;
  const margin = rule === "maximin"
    ? best.worst_case_utility - second.worst_case_utility
    : second.maximum_regret - best.maximum_regret;
  return {
    best_action_id: best.action_id,
    best_expected_utility: rule === "maximin" ? best.worst_case_utility : -best.maximum_regret,
    second_expected_utility: rule === "maximin" ? second.worst_case_utility : -second.maximum_regret,
    margin,
    robustness: clamp(1 - best.maximum_regret / scale),
    maximum_regret: best.maximum_regret,
    normalized_evpi: clamp(best.maximum_regret / scale),
    expected_value_perfect_information: best.maximum_regret,
    robust_rule: rule,
    ranked_actions: rows
  };
}

export function decisionSnapshotForState(state, beliefs, scenarioOverride = null) {
  if (state?.mode !== "robust") return decisionSnapshot(state.decision_model, beliefs);
  const model = scenarioOverride
    ? { ...state.decision_model, belief_scenarios: scenarioOverride }
    : state.decision_model;
  return robustDecisionSnapshot(model, beliefs);
}

export function expectedDecisionGain(question, state) {
  const beliefs = normalizeBeliefs(state.hypotheses);
  const decisionModel = state.decision_model;
  const labels = answerLabels(question);
  const likelihoods = object(question.answer_model?.likelihoods);
  if (!decisionModel || labels.length === 0 || Object.keys(likelihoods).length === 0) {
    return { raw_utility: null, normalized: clamp(question.metrics?.decision_gain ?? 0) };
  }

  const prior = decisionSnapshotForState(state, beliefs);
  const priorValue = state.mode === "robust" ? -Number(prior.maximum_regret || 0) : prior.best_expected_utility;
  let expectedPostValue = 0;
  for (const answer of labels) {
    const probability = probabilityOfAnswer(question, answer, beliefs);
    if (probability <= EPSILON) continue;
    const posterior = posteriorForAnswer(question, answer, beliefs);
    let scenarios = null;
    if (state.mode === "robust" && array(decisionModel.belief_scenarios).length > 0) {
      scenarios = array(decisionModel.belief_scenarios).map((scenario) => ({
        ...scenario,
        beliefs: posteriorForAnswer(question, answer, normalizeBeliefMap(scenario.beliefs))
      }));
    }
    const post = decisionSnapshotForState(state, posterior, scenarios);
    const postValue = state.mode === "robust" ? -Number(post.maximum_regret || 0) : post.best_expected_utility;
    expectedPostValue += probability * postValue;
  }
  const raw = Math.max(0, expectedPostValue - priorValue);
  return {
    raw_utility: raw,
    normalized: clamp(raw / Math.max(Math.abs(Number(decisionModel.utility_scale) || 1), EPSILON))
  };
}
