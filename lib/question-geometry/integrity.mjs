import crypto from "node:crypto";
import {
  PROVENANCE_SOURCE_TYPES,
  RELIABILITY_LEVELS,
  array,
  clone,
  isIsoDate,
  object,
  policyFor
} from "./util.mjs";

export const HISTORY_PROTOCOL = "ofone-question-geometry-history-v1";
const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort()
      .map((key) => [key, canonicalize(value[key])])
  );
}

export function canonicalStringify(value) {
  return JSON.stringify(canonicalize(value));
}

export function sha256Tagged(value) {
  const input = typeof value === "string" ? value : canonicalStringify(value);
  return `sha256:${crypto.createHash("sha256").update(input).digest("hex")}`;
}

function normalizedQuestion(question) {
  const next = clone(question);
  if (next.status === "selected") next.status = "pending";
  return next;
}

export function historyProtectedState(state) {
  const snapshot = clone(state) || {};
  delete snapshot.history;
  delete snapshot.history_integrity;
  delete snapshot.landscape;
  delete snapshot.status;
  delete snapshot.iteration;
  delete snapshot.validator_result;

  snapshot.policy = policyFor(snapshot);
  snapshot.policy.current_question_id = null;
  delete snapshot.policy.current_selection;
  snapshot.questions = array(snapshot.questions).map(normalizedQuestion);

  snapshot.convergence = object(snapshot.convergence);
  delete snapshot.convergence.last_evaluation;
  delete snapshot.convergence.stopped_at_iteration;
  delete snapshot.convergence.stop_reason;
  delete snapshot.convergence.attempted_stop_at;

  return snapshot;
}

export function protectedStateHash(state) {
  return sha256Tagged(historyProtectedState(state));
}

export function historyGenesisHash(state, baselineStateHash) {
  return sha256Tagged({
    protocol: HISTORY_PROTOCOL,
    qg_version: state.qg_version,
    engine_id: state.engine_id,
    baseline_state_hash: baselineStateHash
  });
}

export function initializeHistoryIntegrity(inputState) {
  const state = inputState;
  state.history = array(state.history);
  if (state.history.length > 0 && !state.history_integrity) {
    throw new Error("Cannot initialize integrity around pre-existing unchained history; audit or migrate the events explicitly.");
  }
  if (state.history_integrity) return state;

  state.policy = policyFor(state);
  const baseline = protectedStateHash(state);
  const genesis = historyGenesisHash(state, baseline);
  state.history_integrity = {
    protocol: HISTORY_PROTOCOL,
    algorithm: "sha256",
    baseline_state_hash: baseline,
    genesis_hash: genesis,
    head_hash: genesis,
    event_count: 0,
    last_event_id: null
  };
  state.iteration = 0;
  return state;
}

export function validateProvenance(provenance, objectId = null) {
  const value = object(provenance);
  const findings = [];
  const add = (code, message) => findings.push({
    severity: "error",
    code,
    message,
    object_id: objectId
  });

  if (!PROVENANCE_SOURCE_TYPES.includes(value.source_type)) {
    add("QG_PROVENANCE_SOURCE_TYPE", "Answer provenance requires a supported source_type.");
  }
  if (!String(value.source_id || "").trim()) {
    add("QG_PROVENANCE_SOURCE_ID", "Answer provenance requires a stable source_id.");
  }
  if (!isIsoDate(value.observed_at)) {
    add("QG_PROVENANCE_OBSERVED_AT", "Answer provenance requires an ISO-like observed_at timestamp.");
  }
  if (!RELIABILITY_LEVELS.includes(value.reliability)) {
    add("QG_PROVENANCE_RELIABILITY", "Answer provenance requires low, medium, or high reliability.");
  }
  if (!String(value.chain_of_custody || "").trim()) {
    add("QG_PROVENANCE_CUSTODY", "Answer provenance requires chain_of_custody.");
  }
  if (array(value.evidence_refs).length === 0) {
    add("QG_PROVENANCE_EVIDENCE", "Answer provenance requires at least one evidence reference, including a synthetic oracle/test reference where appropriate.");
  }
  if (value.content_hash != null && !HASH_PATTERN.test(String(value.content_hash))) {
    add("QG_PROVENANCE_CONTENT_HASH", "content_hash must be sha256:<64 lowercase hex> when supplied.");
  }
  return findings;
}

export function computeAnswerEventHash(event) {
  const payload = clone(event);
  delete payload.event_hash;
  return sha256Tagged(payload);
}

export function appendAnswerEvent(state, eventInput) {
  state.history = array(state.history);
  const integrity = object(state.history_integrity);
  const iteration = state.history.length + 1;
  const event = {
    event_protocol: HISTORY_PROTOCOL,
    event_id: `AE-${String(iteration).padStart(4, "0")}`,
    iteration,
    previous_event_hash: integrity.head_hash,
    ...clone(eventInput)
  };
  event.event_hash = computeAnswerEventHash(event);
  state.history.push(event);
  state.history_integrity = {
    ...integrity,
    head_hash: event.event_hash,
    event_count: state.history.length,
    last_event_id: event.event_id
  };
  state.iteration = state.history.length;
  return event;
}

export function rebindLastEventStateAfter(state) {
  const history = array(state.history);
  if (history.length === 0) return null;
  const event = history[history.length - 1];
  event.state_after_hash = protectedStateHash(state);
  event.event_hash = computeAnswerEventHash(event);
  state.history_integrity.head_hash = event.event_hash;
  state.history_integrity.event_count = history.length;
  state.history_integrity.last_event_id = event.event_id;
  return event;
}

export function verifyHistoryIntegrity(state) {
  const findings = [];
  const add = (severity, code, message, objectId = null) =>
    findings.push({ severity, code, message, object_id: objectId });
  const integrity = object(state.history_integrity);
  const history = array(state.history);

  if (integrity.protocol !== HISTORY_PROTOCOL) {
    add("error", "QG_HISTORY_PROTOCOL", `history_integrity.protocol must be ${HISTORY_PROTOCOL}.`);
  }
  if (integrity.algorithm !== "sha256") {
    add("error", "QG_HISTORY_ALGORITHM", "history_integrity.algorithm must be sha256.");
  }
  for (const [field, value] of [
    ["baseline_state_hash", integrity.baseline_state_hash],
    ["genesis_hash", integrity.genesis_hash],
    ["head_hash", integrity.head_hash]
  ]) {
    if (!HASH_PATTERN.test(String(value || ""))) {
      add("error", "QG_HISTORY_HASH_FORMAT", `${field} must use sha256:<64 lowercase hex>.`, field);
    }
  }

  const expectedGenesis = historyGenesisHash(state, integrity.baseline_state_hash);
  if (integrity.genesis_hash !== expectedGenesis) {
    add("error", "QG_HISTORY_GENESIS", "Genesis hash does not bind the engine identity to the declared baseline state.");
  }
  if (Number(integrity.event_count) !== history.length) {
    add("error", "QG_HISTORY_COUNT", "history_integrity.event_count does not match history length.");
  }
  if (Number(state.iteration || 0) !== history.length) {
    add("error", "QG_ITERATION_HISTORY", "iteration must equal the number of committed answer events.");
  }

  const questionIndex = new Map(array(state.questions).map((question) => [question.question_id, question]));
  const seenQuestions = new Set();
  let previousEventHash = integrity.genesis_hash;
  let expectedStateBefore = integrity.baseline_state_hash;

  for (let index = 0; index < history.length; index += 1) {
    const event = history[index];
    const objectId = event.event_id || `history[${index}]`;
    if (event.event_protocol !== HISTORY_PROTOCOL) {
      add("error", "QG_EVENT_PROTOCOL", "Answer event protocol is missing or unsupported.", objectId);
    }
    if (Number(event.iteration) !== index + 1) {
      add("error", "QG_EVENT_ITERATION", "Answer events must be contiguous and 1-indexed.", objectId);
    }
    if (event.previous_event_hash !== previousEventHash) {
      add("error", "QG_HISTORY_PREVIOUS_HASH", "Answer event previous_event_hash does not match the prior committed event.", objectId);
    }
    if (event.state_before_hash !== expectedStateBefore) {
      add("error", "QG_HISTORY_STATE_BEFORE", "Answer event state_before_hash does not match the previously committed epistemic state.", objectId);
    }
    if (!HASH_PATTERN.test(String(event.state_after_hash || ""))) {
      add("error", "QG_HISTORY_STATE_AFTER", "Answer event requires a canonical state_after_hash.", objectId);
    }
    const expectedEventHash = computeAnswerEventHash(event);
    if (event.event_hash !== expectedEventHash) {
      add("error", "QG_HISTORY_EVENT_HASH", "Answer event content does not match event_hash.", objectId);
    }
    findings.push(...validateProvenance(event.provenance, objectId));
    if (!Object.prototype.hasOwnProperty.call(event, "external_effects")) {
      add("error", "QG_EVENT_EXTERNAL_EFFECTS", "Answer event must preserve the external effects payload, even when it is empty.", objectId);
    }
    if (event.external_effects_hash !== sha256Tagged(object(event.external_effects))) {
      add("error", "QG_EVENT_EXTERNAL_EFFECTS_HASH", "external_effects does not match external_effects_hash.", objectId);
    }

    const question = questionIndex.get(event.question_id);
    if (!question) {
      add("error", "QG_HISTORY_QUESTION", "Answer event references a missing question.", objectId);
    } else {
      if (seenQuestions.has(event.question_id)) {
        add("error", "QG_HISTORY_DUPLICATE_ANSWER", "A question may have only one committed answer event.", objectId);
      }
      seenQuestions.add(event.question_id);
      if (question.status !== "answered" || question.answer !== event.answer
        || Number(question.answered_at_iteration) !== Number(event.iteration)) {
        add("error", "QG_HISTORY_QUESTION_STATE", "Question answer state does not match its committed history event.", event.question_id);
      }
      if (array(question.answer_space).length > 0 && !array(question.answer_space).includes(event.answer)) {
        add("error", "QG_HISTORY_ANSWER_SPACE", "Committed answer is outside the question answer_space.", objectId);
      }
      const declaredEffects = object(question.answer_effects)[event.answer] || {};
      if (event.declared_effects_hash !== sha256Tagged(declaredEffects)) {
        add("error", "QG_EVENT_DECLARED_EFFECTS_HASH", "Question-declared effects for the committed answer do not match declared_effects_hash.", objectId);
      }
    }

    previousEventHash = event.event_hash;
    expectedStateBefore = event.state_after_hash;
  }

  const expectedHead = history.length > 0 ? history[history.length - 1].event_hash : integrity.genesis_hash;
  if (integrity.head_hash !== expectedHead) {
    add("error", "QG_HISTORY_HEAD", "history_integrity.head_hash does not match the canonical event-chain head.");
  }
  const expectedLastEventId = history.length > 0 ? history[history.length - 1].event_id : null;
  if ((integrity.last_event_id ?? null) !== expectedLastEventId) {
    add("error", "QG_HISTORY_LAST_EVENT", "history_integrity.last_event_id is inconsistent with history.");
  }

  const answered = array(state.questions).filter((question) => question.status === "answered");
  if (answered.length !== history.length) {
    add("error", "QG_HISTORY_ANSWER_COUNT", "Every answered question must have exactly one committed history event, and vice versa.");
  }

  const currentStateHash = protectedStateHash(state);
  if (currentStateHash !== expectedStateBefore) {
    add("error", "QG_HISTORY_CURRENT_STATE", "Current protected inquiry state does not match the committed history head; state or history was edited outside the answer-event protocol.");
  }

  return {
    passed: !findings.some((finding) => finding.severity === "error"),
    findings,
    current_state_hash: currentStateHash,
    expected_state_hash: expectedStateBefore,
    head_hash: integrity.head_hash,
    event_count: history.length
  };
}
