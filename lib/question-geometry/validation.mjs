import { QUESTION_TYPES, array, object, policyFor } from "./util.mjs";
import { evaluateCausalDepth } from "./causal.mjs";

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
  for (const question of array(state.questions)) {
    if (!question.question_id) add("error", "QG_QUESTION_ID", "Question ID is required.");
    else if (questionIds.has(question.question_id)) add("error", "QG_DUPLICATE_ID", "Duplicate question ID.", question.question_id);
    else questionIds.add(question.question_id);
    if (!QUESTION_TYPES.includes(question.type)) add("error", "QG_QUESTION_TYPE", `Unsupported question type: ${question.type}`, question.question_id);
    if (!String(question.text || "").trim()) add("error", "QG_QUESTION_TEXT", "Question text is required.", question.question_id);
    if (!array(question.targets).length) add("warning", "QG_QUESTION_TARGET", "Question does not identify its target.", question.question_id);
    for (const prerequisite of array(question.prerequisites)) {
      if (!array(state.questions).some((candidate) => candidate.question_id === prerequisite)) {
        add("error", "QG_QUESTION_PREREQUISITE", `Missing prerequisite ${prerequisite}.`, question.question_id);
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
  }

  findings.push(...evaluateCausalDepth(state).findings);
  const policy = policyFor(state);
  if (policy.max_iterations_before_human_review < 1) {
    add("error", "QG_LOOP_BOUND", "A human-review safety bound is required; persistence must not become an unbounded runaway loop.");
  }
  if (policy.required_passes.length === 0) {
    add("error", "QG_REQUIRED_PASSES", "At least one machine-enforced inquiry pass is required.");
  }

  return {
    passed: !findings.some((finding) => finding.severity === "error"),
    findings
  };
}
