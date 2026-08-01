import {
  array,
  clamp,
  clone,
  object,
  policyFor,
  questionFamily
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
import {
  appendAnswerEvent,
  initializeHistoryIntegrity,
  protectedStateHash,
  rebindLastEventStateAfter,
  sha256Tagged,
  validateProvenance,
  verifyHistoryIntegrity
} from "./integrity.mjs";
import { completedPassesFromState, validatePassResult } from "./passes.mjs";
import { issueSelectionReceipt, refreshCurrentSelectionReceipt, validateCurrentSelection } from "./selection.mjs";
import {
  acceptedResidualIds,
  governanceFindings,
  validateAcceptedRiskRecord,
  validateRobustnessWaiver
} from "./governance.mjs";

function prepareState(inputState) {
  const state = clone(inputState);
  state.iteration = Number(state.iteration || 0);
  state.policy = policyFor(state);
  state.questions = array(state.questions);
  state.history = array(state.history);
  state.hypotheses = array(state.hypotheses);
  state.unknowns = array(state.unknowns);
  state.contradictions = array(state.contradictions);
  state.convergence = object(state.convergence);
  state.frame = object(state.frame);
  if (!state.history_integrity && state.history.length === 0) initializeHistoryIntegrity(state);
  return state;
}

export function initializeQuestionGeometryState(inputState) {
  const state = prepareState(inputState);
  const validation = validateQuestionGeometry(state);
  return { state, validation };
}

export function evaluateConvergence(inputState) {
  const state = inputState;
  const policy = policyFor(state);
  const causal = evaluateCausalDepth(state);
  const passes = completedPassesFromState(state, causal);
  const landscape = buildQuestionLandscape(state);
  const metrics = computeStateMetrics(state);
  const accepted = acceptedResidualIds(state);
  const blockers = [];
  const integrity = verifyHistoryIntegrity(state);

  for (const finding of integrity.findings.filter((item) => item.severity === "error")) {
    blockers.push({ code: finding.code, detail: finding.object_id || finding.message });
  }
  for (const required of policy.required_passes) {
    if (!passes.has(required)) blockers.push({ code: "QG_REQUIRED_PASS", detail: required });
  }
  for (const unknown of array(state.unknowns)) {
    if (unknown.status === "accepted_risk" && !accepted.has(unknown.unknown_id)) {
      blockers.push({ code: "QG_ACCEPTED_RISK_INVALID", detail: unknown.unknown_id });
      continue;
    }
    if (unknown.status !== "open" || accepted.has(unknown.unknown_id)) continue;
    if (clamp(unknown.impact ?? 0) >= policy.thresholds.high_impact_unknown || array(unknown.blocks).length > 0) {
      blockers.push({ code: "QG_BLOCKING_UNKNOWN", detail: unknown.unknown_id });
    }
  }
  for (const finding of causal.findings.filter((item) => item.severity === "error" || item.severity === "blocker")) {
    blockers.push({ code: finding.code, detail: finding.object_id || finding.message });
  }
  for (const contradiction of array(state.contradictions).filter(
    (item) => item.status !== "resolved" && item.decision_sensitive !== false
  )) {
    blockers.push({ code: "QG_UNRESOLVED_CONTRADICTION", detail: contradiction.contradiction_id });
  }

  const waiver = validateRobustnessWaiver(state.convergence?.robustness_waiver, state, metrics);
  if (metrics.decision_robustness < policy.thresholds.minimum_decision_robustness && !waiver.applies) {
    blockers.push({ code: "QG_DECISION_NOT_ROBUST", detail: metrics.decision_robustness });
  }
  if (metrics.residual_evpi > policy.thresholds.maximum_residual_evpi && !waiver.applies) {
    blockers.push({ code: "QG_RESIDUAL_DECISION_INFORMATION", detail: metrics.residual_evpi });
  }
  if (landscape.maximum_net_question_value != null
    && landscape.maximum_net_question_value > policy.thresholds.minimum_net_question_value) {
    blockers.push({ code: "QG_HIGH_VALUE_QUESTION_REMAINS", detail: landscape.selected_question_id });
  }

  const selected = array(state.questions).filter((question) => question.status === "selected");
  if (selected.length > 0 || state.policy?.current_question_id != null || state.status === "waiting_for_answer") {
    blockers.push({ code: "QG_SELECTED_QUESTION_UNANSWERED", detail: state.policy?.current_question_id || selected[0]?.question_id || "selection_state" });
  }
  if (Number(state.iteration || 0) >= policy.max_iterations_before_human_review) {
    blockers.push({ code: "QG_ITERATION_REVIEW_GATE", detail: policy.max_iterations_before_human_review });
  }

  for (const finding of governanceFindings(state, metrics).filter((item) => item.severity === "error")) {
    blockers.push({ code: finding.code, detail: finding.object_id || finding.message });
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
    history_integrity: integrity,
    robustness_waiver: waiver,
    stop_reason: releaseAllowed
      ? "Decision is robust within the declared frame; no unaccepted blocking unknown, unanswered selected question, invalid governance record, or positive-net-value question remains."
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
    pass_conditions: missing && missing !== "causal_depth"
      ? { [missing]: { qualifying_answers: ["structured_response"], minimum_reliability: "medium" } }
      : {},
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
  const state = prepareState(inputState);
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
    metrics: convergence.metrics,
    history_head_hash: state.history_integrity.head_hash
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
        message: "Safety review boundary reached without convergence. Reframe, change the oracle, or use typed human risk acceptance/waiver records; do not silently stop or repeat the same strategy."
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
  issueSelectionReceipt(state, selectedId, {
    landscape: state.landscape,
    selector: "question_geometry",
    selection_reason: recentStall(state) ? "escape from low-yield basin" : "highest-value Pareto-eligible continuation"
  });
  const selected = state.questions.find((question) => question.question_id === selectedId);
  return {
    state,
    directive: { type: "ask", question: selected, selection_receipt: state.policy.current_selection },
    validation,
    convergence: evaluateConvergence(state)
  };
}

function assertAnswerContext(state, question, answer, context) {
  const selectionValidation = validateCurrentSelection(state);
  if (!selectionValidation.passed || question.status !== "selected"
    || state.policy.current_question_id !== question.question_id
    || state.status !== "waiting_for_answer") {
    throw new Error(`Question ${question.question_id} lacks a valid runtime-issued selection receipt: ${selectionValidation.findings.map((finding) => finding.code).join(", ")}`);
  }
  if (array(question.answer_space).length > 0 && !array(question.answer_space).includes(answer)) {
    throw new Error(`Answer ${answer} is outside the answer_space for ${question.question_id}.`);
  }
  const provenanceFindings = validateProvenance(context.provenance, question.question_id);
  if (provenanceFindings.length > 0) {
    throw new Error(`Invalid answer provenance: ${provenanceFindings.map((finding) => finding.code).join(", ")}`);
  }
  for (const result of array(context.pass_results)) {
    const passValidation = validatePassResult(result, question, answer, context.provenance, question.question_id);
    if (!passValidation.passed) {
      throw new Error(`Invalid pass assessment: ${passValidation.findings.map((finding) => finding.code).join(", ")}`);
    }
  }
  if (Object.prototype.hasOwnProperty.call(object(context.effects), "accept_unknowns")) {
    throw new Error("Bare effects.accept_unknowns is forbidden. Supply typed risk_acceptances with human authority, expiry, scope, evidence, and reopening conditions.");
  }
  if (Object.prototype.hasOwnProperty.call(object(context.effects), "set_convergence")) {
    throw new Error("effects.set_convergence is forbidden. Convergence, risk acceptance, and waivers are runtime-owned governance state.");
  }
  for (const record of array(context.risk_acceptances)) {
    const riskValidation = validateAcceptedRiskRecord(record, state, record.acceptance_id);
    if (!riskValidation.passed || !riskValidation.active) {
      throw new Error(`Invalid or inactive risk acceptance: ${riskValidation.findings.map((finding) => finding.code).join(", ") || "outside active time window"}`);
    }
  }
  if (context.robustness_waiver != null) {
    const waiverValidation = validateRobustnessWaiver(context.robustness_waiver, state);
    if (!waiverValidation.passed || !waiverValidation.active) {
      throw new Error(`Invalid or inactive robustness waiver: ${waiverValidation.findings.map((finding) => finding.code).join(", ") || "expired"}`);
    }
  }
}

function applyGovernanceContext(state, context) {
  state.convergence.accepted_risks = array(state.convergence.accepted_risks);
  const unknownIndex = new Map(array(state.unknowns).map((unknown) => [unknown.unknown_id, unknown]));
  const actions = [];
  for (const record of array(context.risk_acceptances)) {
    if (state.convergence.accepted_risks.some((candidate) => candidate.acceptance_id === record.acceptance_id)) {
      throw new Error(`Duplicate risk acceptance ID: ${record.acceptance_id}`);
    }
    state.convergence.accepted_risks.push(clone(record));
    const unknown = unknownIndex.get(record.unknown_id);
    if (unknown) unknown.status = "accepted_risk";
    actions.push({ type: "accepted_risk", object_id: record.acceptance_id, unknown_id: record.unknown_id });
  }
  if (context.robustness_waiver != null) {
    state.convergence.robustness_waiver = clone(context.robustness_waiver);
    actions.push({ type: "robustness_waiver", object_id: context.robustness_waiver.waiver_id });
  }
  return actions;
}

export function selectQuestionByPolicy(inputState, questionId, options = {}) {
  const state = prepareState(inputState);
  const validation = validateQuestionGeometry(state);
  if (!validation.passed) {
    throw new Error(`Cannot select from invalid state: ${validation.findings.filter((finding) => finding.severity === "error").map((finding) => finding.code).join(", ")}`);
  }
  issueSelectionReceipt(state, questionId, {
    selector: options.selector || "external_policy",
    selection_reason: options.selection_reason || "explicit policy-arm selection",
    allow_ineligible: options.allow_ineligible === true
  });
  return state;
}

export function applyAnswer(inputState, questionId, answer, answerContext = {}) {
  const state = prepareState(inputState);
  const preValidation = validateQuestionGeometry(state);
  if (!preValidation.passed) {
    throw new Error(`Cannot apply answer to invalid state: ${preValidation.findings.filter((finding) => finding.severity === "error").map((finding) => finding.code).join(", ")}`);
  }
  const integrity = verifyHistoryIntegrity(state);
  if (!integrity.passed) throw new Error("Cannot apply answer: history integrity verification failed.");

  const question = state.questions.find((candidate) => candidate.question_id === questionId);
  if (!question) throw new Error(`Unknown question: ${questionId}`);
  const context = {
    effects: object(answerContext.effects),
    provenance: object(answerContext.provenance),
    pass_results: array(answerContext.pass_results),
    risk_acceptances: array(answerContext.risk_acceptances),
    robustness_waiver: answerContext.robustness_waiver ?? null
  };
  assertAnswerContext(state, question, answer, context);

  const selectionReceipt = clone(state.policy.current_selection);
  const beforeStateHash = protectedStateHash(state);
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
  const appliedEffects = { ...declaredEffects, ...context.effects };
  applyEffects(state, appliedEffects);
  const governanceActions = applyGovernanceContext(state, context);
  normalizeHypothesisBeliefs(state);

  question.status = "answered";
  question.answer = answer;
  question.answered_at_iteration = state.history.length + 1;
  state.policy.current_question_id = null;
  state.policy.current_selection = null;
  state.status = "active";
  state.iteration = state.history.length + 1;

  const after = computeStateMetrics(state);
  const scored = scoreQuestion(question, inputState);
  const afterStateHash = protectedStateHash(state);
  appendAnswerEvent(state, {
    question_id: question.question_id,
    question_text: question.text,
    question_type: question.type,
    question_family: questionFamily(question.type),
    answer,
    selection_receipt: selectionReceipt,
    provenance: clone(context.provenance),
    pass_results: clone(context.pass_results),
    governance_actions: governanceActions,
    declared_effects_hash: sha256Tagged(declaredEffects),
    external_effects: clone(context.effects),
    external_effects_hash: sha256Tagged(context.effects),
    score_before: scored.scalar,
    progress: progressBetween(before, after),
    metrics_before: before,
    metrics_after: after,
    state_before_hash: beforeStateHash,
    state_after_hash: afterStateHash
  });

  const result = enforceLoop(state);
  rebindLastEventStateAfter(result.state);
  refreshCurrentSelectionReceipt(result.state);
  const finalValidation = validateQuestionGeometry(result.state);
  if (!finalValidation.passed) {
    throw new Error(`Answer produced invalid committed state: ${finalValidation.findings.filter((finding) => finding.severity === "error").map((finding) => finding.code).join(", ")}`);
  }
  result.validation = finalValidation;
  result.convergence = evaluateConvergence(result.state);
  return result;
}
