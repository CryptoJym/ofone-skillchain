import {
  array,
  clamp,
  clone,
  object,
  policyFor,
  questionFamily,
  unique
} from "./util.mjs";
import { normalizeBeliefs, posteriorForAnswer } from "./belief.mjs";
import { evaluateCausalDepth } from "./causal.mjs";
import { buildQuestionLandscape, scoreQuestion } from "./landscape.mjs";
import {
  applyEffects,
  computeStateMetrics,
  normalizeHypothesisBeliefs,
  progressBetween
} from "./state.mjs";
import { validateQuestionGeometry } from "./validation.mjs";

function completedPasses(state, causalResult) {
  const passes = new Set();
  for (const event of array(state.history)) {
    for (const tag of array(event.pass_tags)) passes.add(tag);
  }
  for (const question of array(state.questions).filter((candidate) => candidate.status === "answered")) {
    for (const tag of array(question.pass_tags)) passes.add(tag);
  }
  if (causalResult.passed && causalResult.material_targets > 0) passes.add("causal_depth");
  return passes;
}

function acceptedResidualIds(state) {
  return new Set(array(state.convergence?.accepted_residual_unknowns));
}

export function evaluateConvergence(state) {
  const policy = policyFor(state);
  const causal = evaluateCausalDepth(state);
  const passes = completedPasses(state, causal);
  const landscape = buildQuestionLandscape(state);
  const metrics = computeStateMetrics(state);
  const accepted = acceptedResidualIds(state);
  const blockers = [];

  for (const required of policy.required_passes) {
    if (!passes.has(required)) blockers.push({ code: "QG_REQUIRED_PASS", detail: required });
  }
  for (const unknown of array(state.unknowns)) {
    if (unknown.status !== "open" || accepted.has(unknown.unknown_id)) continue;
    if (clamp(unknown.impact ?? 0) >= policy.thresholds.high_impact_unknown || array(unknown.blocks).length > 0) {
      blockers.push({ code: "QG_BLOCKING_UNKNOWN", detail: unknown.unknown_id });
    }
  }
  for (const finding of causal.findings.filter((item) => item.severity === "error")) {
    blockers.push({ code: finding.code, detail: finding.object_id || finding.message });
  }
  for (const contradiction of array(state.contradictions).filter(
    (item) => item.status !== "resolved" && item.decision_sensitive !== false
  )) {
    blockers.push({ code: "QG_UNRESOLVED_CONTRADICTION", detail: contradiction.contradiction_id });
  }
  if (metrics.decision_robustness < policy.thresholds.minimum_decision_robustness
    && !state.convergence?.robustness_waiver) {
    blockers.push({ code: "QG_DECISION_NOT_ROBUST", detail: metrics.decision_robustness });
  }
  if (metrics.residual_evpi > policy.thresholds.maximum_residual_evpi
    && !state.convergence?.robustness_waiver) {
    blockers.push({ code: "QG_RESIDUAL_DECISION_INFORMATION", detail: metrics.residual_evpi });
  }
  if (landscape.maximum_net_question_value != null
    && landscape.maximum_net_question_value > policy.thresholds.minimum_net_question_value) {
    blockers.push({ code: "QG_HIGH_VALUE_QUESTION_REMAINS", detail: landscape.selected_question_id });
  }
  if (state.convergence?.accepted_residual_unknowns?.length
    && !String(state.convergence?.accepted_by || "").trim()) {
    blockers.push({ code: "QG_RESIDUAL_NOT_OWNED", detail: "accepted_by" });
  }
  if (Number(state.iteration || 0) >= policy.max_iterations_before_human_review) {
    blockers.push({ code: "QG_ITERATION_REVIEW_GATE", detail: policy.max_iterations_before_human_review });
  }

  const releaseAllowed = blockers.length === 0;
  return {
    release_allowed: releaseAllowed,
    blockers,
    completed_passes: [...passes].sort(),
    missing_passes: policy.required_passes.filter((pass) => !passes.has(pass)),
    causal_depth: causal,
    metrics,
    landscape,
    stop_reason: releaseAllowed
      ? "Decision is robust within the declared frame; no unaccepted blocking unknown or positive-net-value question remains."
      : null
  };
}

function recentStall(state) {
  const policy = policyFor(state);
  const events = array(state.history).slice(-policy.stall_window);
  return events.length >= policy.stall_window
    && events.every((event) => Number(event.progress?.total ?? 0) < policy.thresholds.minimum_material_progress);
}

function nextAutoId(state) {
  const existing = new Set(array(state.questions).map((question) => question.question_id));
  let index = 1;
  while (existing.has(`Q-AUTO-${index}`)) index += 1;
  return `Q-AUTO-${index}`;
}

function highestImpactUnknown(state) {
  return [...array(state.unknowns)]
    .filter((unknown) => unknown.status === "open")
    .sort((left, right) => clamp(right.impact ?? 0) - clamp(left.impact ?? 0))[0] || null;
}

export function synthesizeEscapeQuestion(state, convergence = evaluateConvergence(state)) {
  const missing = convergence.missing_passes[0];
  const unknown = highestImpactUnknown(state);
  const target = unknown?.unknown_id || state.frame?.frame_id || "FRAME";
  const templates = {
    causal_depth: {
      type: "contrastive_why",
      text: "Why does the material outcome occur rather than its nearest credible alternative, and what mechanism, counterfactual, or intervention would distinguish the causes?",
      metrics: { causal_discrimination: 0.95, information_gain: 0.55, unlock_value: 0.55, actionability: 0.55, novelty: 0.8, lookahead_value: 0.75 }
    },
    frame_challenge: {
      type: "frame_challenge",
      text: "Which assumption is shared by every active explanation, and what would become visible if that assumption were false?",
      metrics: { model_expansion: 0.9, information_gain: 0.6, robustness_gain: 0.8, novelty: 0.9, lookahead_value: 0.8 }
    },
    model_expansion: {
      type: "model_expansion",
      text: "What observation would be surprising under every active hypothesis, and what new model class could explain it?",
      metrics: { model_expansion: 1, information_gain: 0.65, robustness_gain: 0.75, novelty: 1, lookahead_value: 0.9 }
    },
    adversarial: {
      type: "adversarial",
      text: "Who benefits if the current explanation is accepted, and how could evidence, incentives, or access be strategically distorted?",
      metrics: { model_expansion: 0.55, robustness_gain: 0.9, causal_discrimination: 0.45, novelty: 0.8, actionability: 0.5 }
    },
    source_independence: {
      type: "source_independence",
      text: "Which apparently independent evidence items share an upstream source, measurement process, incentive, or failure mode?",
      metrics: { information_gain: 0.55, robustness_gain: 0.95, actionability: 0.65, novelty: 0.7 }
    },
    stopping_counterexample: {
      type: "stopping_counterexample",
      text: "What plausible evidence would reverse the current decision, and have we sought the cheapest safe version of that evidence?",
      metrics: { decision_gain: 0.7, robustness_gain: 1, information_gain: 0.5, actionability: 0.75, novelty: 0.75 }
    },
    stalled: {
      type: "unlock",
      text: "Recent questions produced little material progress. What different operator—measurement, intervention, contrast, source change, scale change, or frame shift—would escape this low-yield question basin?",
      metrics: { unlock_value: 1, model_expansion: 0.8, novelty: 1, lookahead_value: 1, actionability: 0.65 }
    }
  };
  const template = templates[missing] || templates.stalled;
  return {
    question_id: nextAutoId(state),
    type: template.type,
    text: template.text,
    targets: [target],
    answer_space: ["structured_response"],
    costs: { cognitive: 0.2, time: 0.15 },
    risks: {},
    delay: 0.05,
    prerequisites: [],
    pass_tags: [missing || "escape"],
    metrics: template.metrics,
    status: "pending",
    generated_by_engine: true,
    generation_reason: missing ? `required_pass:${missing}` : "stalled_or_empty_landscape"
  };
}

function selectQuestion(state, landscape) {
  const policy = policyFor(state);
  const scoredById = new Map(landscape.scored.map((item) => [item.question_id, item]));
  let candidateIds = [...landscape.ranked_eligible];
  if (recentStall(state)) {
    const recentFamilies = new Set(array(state.history)
      .slice(-policy.stall_window)
      .map((event) => event.question_family));
    const diversified = candidateIds.filter((id) => !recentFamilies.has(scoredById.get(id)?.family));
    if (diversified.length > 0) candidateIds = diversified;
  }
  const pareto = new Set(landscape.pareto_frontier);
  const paretoFirst = candidateIds.filter((id) => pareto.has(id));
  return (paretoFirst.length > 0 ? paretoFirst : candidateIds)[0] || null;
}

export function enforceLoop(inputState) {
  const state = clone(inputState);
  state.iteration = Number(state.iteration || 0);
  state.policy = policyFor(state);
  state.questions = array(state.questions);
  state.history = array(state.history);
  state.convergence = object(state.convergence);

  const validation = validateQuestionGeometry(state);
  if (!validation.passed) {
    state.status = "invalid";
    return {
      state,
      directive: { type: "repair", message: "Question Geometry state is invalid; repair errors before inquiry continues." },
      validation,
      convergence: evaluateConvergence(state)
    };
  }

  const convergence = evaluateConvergence(state);
  state.landscape = convergence.landscape;
  state.convergence.last_evaluation = {
    release_allowed: convergence.release_allowed,
    blockers: convergence.blockers,
    completed_passes: convergence.completed_passes,
    metrics: convergence.metrics
  };
  if (convergence.release_allowed) {
    state.status = "converged";
    state.policy.current_question_id = null;
    return { state, directive: { type: "stop", message: convergence.stop_reason }, validation, convergence };
  }

  const current = state.questions.find((question) => question.question_id === state.policy.current_question_id);
  if (current && current.status === "selected") {
    state.status = "waiting_for_answer";
    return { state, directive: { type: "ask", question: current }, validation, convergence };
  }
  if (state.iteration >= state.policy.max_iterations_before_human_review) {
    state.status = "human_review_required";
    return {
      state,
      directive: {
        type: "human_review",
        message: "Safety review boundary reached without convergence. Reframe, change the oracle, or explicitly accept residual risk; do not silently stop or repeat the same strategy."
      },
      validation,
      convergence
    };
  }

  let selectedId = selectQuestion(state, convergence.landscape);
  if (!selectedId || recentStall(state)) {
    const escape = synthesizeEscapeQuestion(state, convergence);
    state.questions.push(escape);
    state.landscape = buildQuestionLandscape(state);
    selectedId = escape.question_id;
  }
  const selected = state.questions.find((question) => question.question_id === selectedId);
  selected.status = "selected";
  state.policy.current_question_id = selectedId;
  state.status = "waiting_for_answer";
  return {
    state,
    directive: { type: "ask", question: selected },
    validation,
    convergence: evaluateConvergence(state)
  };
}

export function applyAnswer(inputState, questionId, answer, externalEffects = null) {
  const state = clone(inputState);
  state.policy = policyFor(state);
  state.questions = array(state.questions);
  state.history = array(state.history);
  state.hypotheses = array(state.hypotheses);
  state.unknowns = array(state.unknowns);
  state.contradictions = array(state.contradictions);
  state.convergence = object(state.convergence);
  state.frame = object(state.frame);

  const question = state.questions.find((candidate) => candidate.question_id === questionId);
  if (!question) throw new Error(`Unknown question: ${questionId}`);
  if (!["selected", "pending"].includes(question.status)) {
    throw new Error(`Question ${questionId} cannot be answered from status ${question.status}`);
  }

  const before = computeStateMetrics(state);
  const beliefs = normalizeBeliefs(state.hypotheses);
  if (Object.keys(object(question.answer_model?.likelihoods)).length > 0) {
    const posterior = posteriorForAnswer(question, answer, beliefs);
    for (const hypothesis of state.hypotheses) {
      if (Object.prototype.hasOwnProperty.call(posterior, hypothesis.hypothesis_id)) {
        hypothesis.belief = posterior[hypothesis.hypothesis_id];
      }
    }
  }
  const declaredEffects = object(question.answer_effects)[answer] || {};
  applyEffects(state, { ...declaredEffects, ...object(externalEffects) });
  normalizeHypothesisBeliefs(state);

  question.status = "answered";
  question.answer = answer;
  question.answered_at_iteration = Number(state.iteration || 0) + 1;
  state.iteration = Number(state.iteration || 0) + 1;
  state.policy.current_question_id = null;
  state.status = "active";

  const after = computeStateMetrics(state);
  const scored = scoreQuestion(question, inputState);
  state.history.push({
    iteration: state.iteration,
    question_id: question.question_id,
    question_text: question.text,
    question_type: question.type,
    question_family: questionFamily(question.type),
    answer,
    pass_tags: array(question.pass_tags),
    score_before: scored.scalar,
    progress: progressBetween(before, after),
    metrics_before: before,
    metrics_after: after
  });
  return enforceLoop(state);
}
