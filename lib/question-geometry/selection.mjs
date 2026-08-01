import { array, clone, object } from "./util.mjs";
import { buildQuestionLandscape } from "./landscape.mjs";
import { protectedStateHash, sha256Tagged } from "./integrity.mjs";

export const SELECTION_PROTOCOL = "ofone-question-selection-v1";

function selectionLandscape(state) {
  const preview = clone(state);
  preview.questions = array(preview.questions).map((question) => ({
    ...question,
    status: question.status === "selected" ? "pending" : question.status
  }));
  preview.policy = { ...object(preview.policy), current_question_id: null, current_selection: null };
  preview.status = preview.status === "waiting_for_answer" ? "active" : preview.status;
  return buildQuestionLandscape(preview);
}

export function computeSelectionHash(receiptInput) {
  const receipt = clone(receiptInput);
  delete receipt.selection_hash;
  return sha256Tagged(receipt);
}

function buildReceipt(state, questionId, landscape, options = {}) {
  const eligible = landscape.ranked_eligible.includes(questionId);
  const receipt = {
    selection_protocol: SELECTION_PROTOCOL,
    selection_id: `SEL-${array(state.history).length + 1}-${questionId}`,
    question_id: questionId,
    selector: options.selector || "question_geometry",
    selection_reason: options.selection_reason || "highest-value eligible question",
    issued_at_iteration: array(state.history).length,
    history_head_hash: state.history_integrity?.head_hash || null,
    state_hash: protectedStateHash(state),
    landscape_hash: sha256Tagged(landscape),
    eligible_at_selection: eligible
  };
  receipt.selection_hash = computeSelectionHash(receipt);
  return receipt;
}

export function issueSelectionReceipt(state, questionId, options = {}) {
  const question = array(state.questions).find((candidate) => candidate.question_id === questionId);
  if (!question) throw new Error(`Cannot select missing question ${questionId}.`);
  if (question.status !== "pending") throw new Error(`Question ${questionId} is not pending.`);

  const landscape = options.landscape || selectionLandscape(state);
  const eligible = landscape.ranked_eligible.includes(questionId);
  if (!eligible && options.allow_ineligible !== true) {
    throw new Error(`Question ${questionId} is not eligible in the current landscape.`);
  }

  const receipt = buildReceipt(state, questionId, landscape, options);
  question.status = "selected";
  state.policy.current_question_id = questionId;
  state.policy.current_selection = receipt;
  state.status = "waiting_for_answer";
  return receipt;
}

export function refreshCurrentSelectionReceipt(state) {
  const questionId = state.policy?.current_question_id;
  if (!questionId) return null;
  const question = array(state.questions).find((candidate) => candidate.question_id === questionId);
  if (!question || question.status !== "selected") return null;
  const previous = object(state.policy.current_selection);
  const landscape = selectionLandscape(state);
  const receipt = buildReceipt(state, questionId, landscape, {
    selector: previous.selector || "question_geometry",
    selection_reason: previous.selection_reason || "refreshed after committed state expansion"
  });
  state.policy.current_selection = receipt;
  return receipt;
}

export function validateCurrentSelection(state) {
  const findings = [];
  const add = (code, message, objectId = null) => findings.push({ severity: "error", code, message, object_id: objectId });
  const selected = array(state.questions).filter((question) => question.status === "selected");
  const receipt = object(state.policy?.current_selection);

  if (selected.length === 0 && state.policy?.current_question_id == null && Object.keys(receipt).length === 0) {
    return { passed: true, findings, receipt: null };
  }
  if (selected.length !== 1) add("QG_SELECTION_COUNT", "A live selection requires exactly one selected question.");
  const question = selected[0];
  if (!question || state.policy?.current_question_id !== question.question_id) {
    add("QG_SELECTION_CURRENT_ID", "current_question_id must name the selected question.");
  }
  if (receipt.selection_protocol !== SELECTION_PROTOCOL) add("QG_SELECTION_PROTOCOL", "Selection receipt protocol is missing or unsupported.");
  if (receipt.question_id !== question?.question_id) add("QG_SELECTION_QUESTION", "Selection receipt does not bind the selected question.");
  if (Number(receipt.issued_at_iteration) !== array(state.history).length) add("QG_SELECTION_ITERATION", "Selection receipt was issued against a different iteration.");
  if (receipt.history_head_hash !== state.history_integrity?.head_hash) add("QG_SELECTION_HISTORY_HEAD", "Selection receipt was issued against a different history head.");
  if (receipt.state_hash !== protectedStateHash(state)) add("QG_SELECTION_STATE", "Selection receipt was issued against a different protected inquiry state.");
  const landscape = selectionLandscape(state);
  if (receipt.landscape_hash !== sha256Tagged(landscape)) add("QG_SELECTION_LANDSCAPE", "Selection receipt landscape hash does not match the current candidate landscape.");
  if (receipt.selection_hash !== computeSelectionHash(receipt)) add("QG_SELECTION_HASH", "Selection receipt content does not match selection_hash.");
  if (state.status !== "waiting_for_answer") add("QG_SELECTION_STATUS", "Live selection requires status=waiting_for_answer.");

  return { passed: findings.length === 0, findings, receipt };
}

export function validateCommittedSelection(event) {
  const receipt = object(event.selection_receipt);
  const findings = [];
  const add = (code, message) => findings.push({ severity: "error", code, message, object_id: event.event_id || null });
  if (receipt.selection_protocol !== SELECTION_PROTOCOL) add("QG_EVENT_SELECTION_PROTOCOL", "Committed answer event lacks a valid selection receipt.");
  if (receipt.question_id !== event.question_id) add("QG_EVENT_SELECTION_QUESTION", "Committed selection receipt does not bind the answered question.");
  if (Number(receipt.issued_at_iteration) !== Number(event.iteration) - 1) add("QG_EVENT_SELECTION_ITERATION", "Committed selection receipt has the wrong issue iteration.");
  if (receipt.history_head_hash !== event.previous_event_hash) add("QG_EVENT_SELECTION_HISTORY", "Committed selection receipt does not bind the previous history head.");
  if (receipt.state_hash !== event.state_before_hash) add("QG_EVENT_SELECTION_STATE", "Committed selection receipt does not bind the pre-answer protected state.");
  if (receipt.selection_hash !== computeSelectionHash(receipt)) add("QG_EVENT_SELECTION_HASH", "Committed selection receipt content does not match selection_hash.");
  return { passed: findings.length === 0, findings };
}
