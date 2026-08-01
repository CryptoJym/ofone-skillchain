import {
  QUESTION_TYPES,
  RELIABILITY_LEVELS,
  array,
  isIsoDate,
  object,
  policyFor
} from "./util.mjs";
import { evaluateCausalDepth } from "./causal.mjs";
import { computeStateMetrics } from "./state.mjs";
import { verifyHistoryIntegrity } from "./integrity.mjs";
import { passResultFindingsForState } from "./passes.mjs";
import { governanceFindings } from "./governance.mjs";
import { validateCommittedSelection, validateCurrentSelection } from "./selection.mjs";

export function validateQuestionGeometry(state) {
  const findings = [];
  const add = (severity, code, message, objectId = null) =>
    findings.push({ severity, code, message, object_id: objectId });

  if (!state || typeof state !== "object") {
    add("error", "QG_DOCUMENT", "Question Geometry state must be an object.");
    return { passed: false, findings };
  }
  if (!String(state.qg_version || "").trim()) add("error", "QG_VERSION", "qg_version is required.");
  if (!String(state.engine_id || "").trim()) add("error", "QG_ENGINE_ID", "engine_id is required.");
  if (!["heuristic", "probabilistic", "robust"].includes(state.mode)) add("error", "QG_MODE", "mode must be heuristic, probabilistic, or robust.");
  if (!["active", "waiting_for_answer", "human_review_required", "converged", "invalid"].includes(state.status)) add("error", "QG_STATUS", "status is missing or unsupported.");
  if (!Number.isInteger(Number(state.iteration)) || Number(state.iteration) < 0) add("error", "QG_ITERATION", "iteration must be a non-negative integer.");
  if (!isIsoDate(state.temporal_context?.as_of)) add("error", "QG_TEMPORAL_AS_OF", "temporal_context.as_of is required for deterministic governance evaluation.");
  if (!String(state.objective?.decision || "").trim()) add("error", "QG_DECISION", "objective.decision is required.");
  if (!String(state.frame?.frame_id || "").trim()) add("error", "QG_FRAME", "frame.frame_id is required.");

  const hypothesisIds = new Set();
  for (const hypothesis of array(state.hypotheses)) {
    if (!hypothesis.hypothesis_id) add("error", "QG_HYPOTHESIS_ID", "Hypothesis ID is required.");
    else if (hypothesisIds.has(hypothesis.hypothesis_id)) add("error", "QG_DUPLICATE_ID", "Duplicate hypothesis ID.", hypothesis.hypothesis_id);
    else hypothesisIds.add(hypothesis.hypothesis_id);
  }
  if (hypothesisIds.size < 2) {
    add("error", "QG_HYPOTHESIS_SPACE", "At least two alternatives are required, including model-class failure where appropriate.");
  }
  if (!array(state.hypotheses).some((hypothesis) => hypothesis.other === true)) {
    add("warning", "QG_OTHER_HYPOTHESIS", "No explicit OTHER/model-class-misspecification hypothesis exists.");
  }

  const unknownIds = new Set();
  for (const unknown of array(state.unknowns)) {
    if (!unknown.unknown_id) add("error", "QG_UNKNOWN_ID", "Unknown ID is required.");
    else if (unknownIds.has(unknown.unknown_id)) add("error", "QG_DUPLICATE_ID", "Duplicate unknown ID.", unknown.unknown_id);
    else unknownIds.add(unknown.unknown_id);
  }

  const questionIds = new Set();
  const selected = [];
  for (const question of array(state.questions)) {
    if (!question.question_id) add("error", "QG_QUESTION_ID", "Question ID is required.");
    else if (questionIds.has(question.question_id)) add("error", "QG_DUPLICATE_ID", "Duplicate question ID.", question.question_id);
    else questionIds.add(question.question_id);
    if (!QUESTION_TYPES.includes(question.type)) add("error", "QG_QUESTION_TYPE", `Unsupported question type: ${question.type}`, question.question_id);
    if (!String(question.text || "").trim()) add("error", "QG_QUESTION_TEXT", "Question text is required.", question.question_id);
    if (!array(question.targets).length) add("warning", "QG_QUESTION_TARGET", "Question does not identify its target.", question.question_id);
    if (question.status === "selected") selected.push(question.question_id);
    if (question.status === "answered") {
      if (question.answer == null) add("error", "QG_ANSWER_MISSING", "Answered question requires answer.", question.question_id);
      if (array(question.answer_space).length > 0 && !array(question.answer_space).includes(question.answer)) {
        add("error", "QG_ANSWER_SPACE", "Answered question has an answer outside answer_space.", question.question_id);
      }
    }
    for (const prerequisite of array(question.prerequisites)) {
      if (!array(state.questions).some((candidate) => candidate.question_id === prerequisite)) {
        add("error", "QG_QUESTION_PREREQUISITE", `Missing prerequisite ${prerequisite}.`, question.question_id);
      }
    }
    for (const [answerLabel, effects] of Object.entries(object(question.answer_effects))) {
      if (Object.prototype.hasOwnProperty.call(object(effects), "accept_unknowns")) {
        add("error", "QG_EFFECT_ACCEPT_UNKNOWN", `answer_effects.${answerLabel}.accept_unknowns is forbidden; use typed risk acceptance.`, question.question_id);
      }
      if (Object.prototype.hasOwnProperty.call(object(effects), "set_convergence")) {
        add("error", "QG_EFFECT_CONVERGENCE", `answer_effects.${answerLabel}.set_convergence is forbidden; convergence is runtime-owned.`, question.question_id);
      }
    }
    for (const [hypothesisId, probabilities] of Object.entries(object(question.answer_model?.likelihoods))) {
      if (!hypothesisIds.has(hypothesisId)) {
        add("error", "QG_ANSWER_MODEL_HYPOTHESIS", `Answer model references missing hypothesis ${hypothesisId}.`, question.question_id);
      }
      const total = Object.values(object(probabilities)).reduce((sum, value) => sum + Number(value || 0), 0);
      if (Math.abs(total - 1) > 1e-6) {
        add("error", "QG_ANSWER_MODEL_NORMALIZATION", `Likelihoods for ${hypothesisId} sum to ${total}, not 1.`, question.question_id);
      }
    }
    for (const [passId, condition] of Object.entries(object(question.pass_conditions))) {
      if (!array(question.pass_tags).includes(passId)) {
        add("error", "QG_PASS_CONDITION_BINDING", `pass_conditions.${passId} is not declared in pass_tags.`, question.question_id);
      }
      for (const answer of array(condition.qualifying_answers)) {
        if (!array(question.answer_space).includes(answer)) {
          add("error", "QG_PASS_CONDITION_ANSWER", `Pass condition references answer ${answer} outside answer_space.`, question.question_id);
        }
      }
      if (condition.minimum_reliability != null && !RELIABILITY_LEVELS.includes(condition.minimum_reliability)) {
        add("error", "QG_PASS_CONDITION_RELIABILITY", "Pass minimum_reliability must be low, medium, or high.", question.question_id);
      }
    }
  }

  if (selected.length > 1) add("error", "QG_MULTIPLE_SELECTED", "At most one question may be selected at a time.");
  const currentQuestionId = state.policy?.current_question_id ?? null;
  if (currentQuestionId != null && (selected.length !== 1 || selected[0] !== currentQuestionId)) {
    add("error", "QG_CURRENT_QUESTION", "policy.current_question_id must name the one selected question.");
  }
  if (state.status === "waiting_for_answer" && selected.length !== 1) {
    add("error", "QG_WAITING_SELECTION", "waiting_for_answer requires exactly one selected question.");
  }
  if (selected.length === 1 && state.status !== "waiting_for_answer") {
    add("error", "QG_SELECTED_STATUS", "A selected question requires status=waiting_for_answer.", selected[0]);
  }

  findings.push(...evaluateCausalDepth(state).findings);
  const policy = policyFor(state);
  if (policy.max_iterations_before_human_review < 1) {
    add("error", "QG_LOOP_BOUND", "A human-review safety bound is required; persistence must not become an unbounded runaway loop.");
  }
  if (policy.required_passes.length === 0) {
    add("error", "QG_REQUIRED_PASSES", "At least one machine-enforced inquiry pass is required.");
  }

  const currentSelection = validateCurrentSelection(state);
  findings.push(...currentSelection.findings);
  for (const event of array(state.history)) findings.push(...validateCommittedSelection(event).findings);

  const integrity = verifyHistoryIntegrity(state);
  findings.push(...integrity.findings);
  findings.push(...passResultFindingsForState(state));
  findings.push(...governanceFindings(state, computeStateMetrics(state)));

  return {
    passed: !findings.some((finding) => finding.severity === "error"),
    findings,
    integrity
  };
}
