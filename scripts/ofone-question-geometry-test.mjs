#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyAnswer,
  buildQuestionLandscape,
  chainEvent,
  enforceLoop,
  evaluateCausalDepth,
  evaluateConvergence,
  expectedBeliefDisplacement,
  robustDecisionSnapshot,
  scoreQuestion,
  synthesizeEscapeQuestion,
  validateQuestionGeometry,
  verifyHistoryChain
} from "../lib/question-geometry.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const examplePath = path.join(root, "examples", "question-geometry", "causal-depth.json");
const fixture = JSON.parse(fs.readFileSync(examplePath, "utf8"));
const clone = (value) => JSON.parse(JSON.stringify(value));
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function oracleContext(finding = "scripted test oracle answer") {
  return { provenance: "test oracle", finding, qualifies: true };
}

const ORACLE_ANSWERS = {
  "Q-DISCRIMINATE": "activation_failure",
  "Q-FRAME": "frame_survives",
  "Q-MODEL-EXPANSION": "no_material_surprise",
  "Q-SOURCE-INDEPENDENCE": "independent_support",
  "Q-ADVERSARIAL": "no_material_distortion",
  "Q-STOP-COUNTEREXAMPLE": "reversal_tested"
};

function runLoopToConvergence(state, contextFor = () => oracleContext()) {
  let result = enforceLoop(state);
  for (let step = 0; step < 12; step += 1) {
    if (result.directive.type === "stop") break;
    const questionId = result.directive.question?.question_id;
    if (!questionId || !ORACLE_ANSWERS[questionId]) break;
    result = applyAnswer(result.state, questionId, ORACLE_ANSWERS[questionId], null, contextFor(questionId));
    if (result.directive.type === "stop") break;
  }
  return result;
}

function chainedHistory(state, events) {
  const carrier = { ...state, history: [] };
  const out = [];
  for (const event of events) {
    const chained = chainEvent(carrier, event);
    out.push(chained);
    carrier.history = out;
  }
  return out;
}

// 1
test("valid example passes semantic validation", () => {
  const result = validateQuestionGeometry(clone(fixture));
  assert.equal(result.passed, true, JSON.stringify(result.findings, null, 2));
});

// 2
test("question landscape selects the decision-sensitive discriminator", () => {
  const landscape = buildQuestionLandscape(clone(fixture));
  assert.equal(landscape.selected_question_id, "Q-DISCRIMINATE");
  const dominated = landscape.scored.find((item) => item.question_id === "Q-PRICE-ONLY");
  assert.equal(dominated.eligible, false);
  assert.match(dominated.exclusion_reasons.join(" "), /dominated_by/);
});

// 3
test("probabilistic geometry measures expected movement on the belief simplex", () => {
  const state = clone(fixture);
  const question = state.questions.find((candidate) => candidate.question_id === "Q-DISCRIMINATE");
  const displacement = expectedBeliefDisplacement(question, state.hypotheses);
  assert.ok(displacement > 0);
  assert.ok(displacement <= 1);
});

// 4
test("bounded lookahead credits a bridge question for unlocking a stronger next question", () => {
  let state = clone(fixture);
  let result = enforceLoop(state);
  result = applyAnswer(result.state, "Q-DISCRIMINATE", "activation_failure", null, oracleContext());
  state = result.state;
  const frameQuestion = state.questions.find((candidate) => candidate.question_id === "Q-FRAME");
  frameQuestion.status = "pending";
  state.policy.current_question_id = null;
  frameQuestion.metrics.lookahead_value = 0;
  const scored = scoreQuestion(frameQuestion, state);
  assert.ok(scored.vector.lookahead_value > 0, JSON.stringify(scored, null, 2));
});

// 5
test("robust mode selects the minimax-regret action across belief scenarios", () => {
  const snapshot = robustDecisionSnapshot({
    robust_rule: "minimax_regret",
    utility_scale: 20,
    actions: [
      { action_id: "A-RISKY", utilities: { H1: 10, H2: -10 } },
      { action_id: "A-SAFE", utilities: { H1: 3, H2: 3 } }
    ],
    belief_scenarios: [
      { scenario_id: "S1", beliefs: { H1: 0.9, H2: 0.1 } },
      { scenario_id: "S2", beliefs: { H1: 0.1, H2: 0.9 } }
    ]
  }, { H1: 0.5, H2: 0.5 });
  assert.equal(snapshot.best_action_id, "A-SAFE");
  assert.ok(snapshot.maximum_regret >= 0);
});

// 6
test("stop is rejected before the enforced inquiry passes complete", () => {
  const convergence = evaluateConvergence(clone(fixture));
  assert.equal(convergence.release_allowed, false);
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_BLOCKING_UNKNOWN"));
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_HIGH_VALUE_QUESTION_REMAINS"));
});

// 7
test("runtime loop converges only after provenance-qualified hard passes", () => {
  const result = runLoopToConvergence(clone(fixture));
  assert.equal(result.directive.type, "stop");
  assert.equal(result.state.status, "converged");
  assert.equal(result.convergence.release_allowed, true);
  assert.deepEqual(result.convergence.missing_passes, []);
  assert.ok(result.convergence.metrics.decision_robustness >= result.state.policy.thresholds.minimum_decision_robustness);
  assert.ok(result.state.history.length >= 6);
  for (const event of result.state.history) {
    assert.ok(event.event_hash, "every answer event is hash-chained");
    assert.ok(event.answer_context, "every answer event records its context");
  }
  assert.equal(verifyHistoryChain(result.state).length, 0);
});

// 8
test("causal-depth traversal rejects circular explanation", () => {
  const state = clone(fixture);
  state.causal_depth.links.push({
    link_id: "CL-CYCLE",
    from_node: "CN-EVENT-CONTRACT",
    to_node: "CN-DECLINE",
    why_kind: "cause",
    contrast: "circular return rather than independent explanation",
    confidence: 0.2,
    evidence_refs: ["E-BAD"],
    counterfactual_test: "none",
    intervention_test: "none",
    alternatives_considered: ["non-circular model"],
    status: "hypothesized"
  });
  const result = evaluateCausalDepth(state);
  assert.equal(result.passed, false);
  assert.ok(result.findings.some((finding) => finding.code === "QG_CAUSAL_CYCLE"));
});

// 9
test("bedrock must remain frame-relative and reopenable", () => {
  const state = clone(fixture);
  const bedrock = state.causal_depth.nodes.find((node) => node.status === "bedrock").bedrock;
  bedrock.frame_relative = false;
  bedrock.reopen_condition = "";
  const result = evaluateCausalDepth(state);
  assert.ok(result.findings.some((finding) => finding.code === "QG_BEDROCK_FRAME"));
  assert.ok(result.findings.some((finding) => finding.code === "QG_BEDROCK_REOPEN"));
});

// 10
test("low-yield repetition forces an escape operator instead of silent stopping", () => {
  const state = clone(fixture);
  state.questions.find((question) => question.question_id === "Q-DISCRIMINATE").status = "answered";
  state.policy.current_question_id = null;
  state.history = chainedHistory(state, [1, 2, 3].map((iteration) => ({
    iteration,
    question_id: `Q-STALE-${iteration}`,
    question_text: "Repeat the same low-yield question",
    question_type: "evidence",
    question_family: "epistemic",
    answer: "indeterminate",
    answer_context: oracleContext("stale probe"),
    pass_tags: [],
    score_before: 0.1,
    progress: {
      entropy_reduction: 0,
      unresolved_impact_reduction: 0,
      decision_robustness_gain: 0,
      causal_depth_gain: 0,
      contradiction_reduction: 0,
      total: 0
    }
  })));
  const result = enforceLoop(state);
  assert.equal(result.directive.type, "ask");
  assert.equal(result.directive.question.generated_by_engine, true);
  assert.notEqual(result.directive.question.type, "evidence");
});

// 11
test("robustness waiver requires a named human owner before it can bypass gates", () => {
  const state = clone(fixture);
  state.convergence.robustness_waiver = true;
  let convergence = evaluateConvergence(state);
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_WAIVER_NOT_OWNED"));
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_DECISION_NOT_ROBUST"));
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_RESIDUAL_DECISION_INFORMATION"));
  state.convergence.waived_by = "named human reviewer";
  convergence = evaluateConvergence(state);
  assert.ok(!convergence.blockers.some((blocker) => blocker.code === "QG_WAIVER_NOT_OWNED"));
  assert.ok(!convergence.blockers.some((blocker) => blocker.code === "QG_DECISION_NOT_ROBUST"));
  assert.ok(!convergence.blockers.some((blocker) => blocker.code === "QG_RESIDUAL_DECISION_INFORMATION"));
});

// 12
test("a waiver smuggled through answer effects stays inert without a named owner", () => {
  const state = clone(fixture);
  const issued = enforceLoop(state);
  const questionId = issued.directive.question.question_id;
  const question = issued.state.questions.find((candidate) => candidate.question_id === questionId);
  const answer = ORACLE_ANSWERS[questionId];
  question.answer_effects = {
    ...(question.answer_effects || {}),
    [answer]: {
      ...((question.answer_effects || {})[answer] || {}),
      set_convergence: { robustness_waiver: true }
    }
  };
  const result = applyAnswer(issued.state, questionId, answer, null, oracleContext());
  assert.equal(result.state.convergence.robustness_waiver, true);
  const convergence = evaluateConvergence(result.state);
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_WAIVER_NOT_OWNED"));
  assert.equal(convergence.release_allowed, false);
});

// 13
test("answering a question the runtime did not issue is refused", () => {
  const state = clone(fixture);
  const issued = enforceLoop(state);
  assert.equal(issued.directive.question.question_id, "Q-DISCRIMINATE");
  assert.throws(
    () => applyAnswer(issued.state, "Q-FRAME", "frame_survives", null, oracleContext()),
    /not the runtime-issued selection/
  );
});

// 14
test("answering the issued question after selection is cleared is refused", () => {
  const state = clone(fixture);
  const issued = enforceLoop(state);
  issued.state.policy.current_question_id = null;
  assert.throws(
    () => applyAnswer(issued.state, "Q-DISCRIMINATE", "activation_failure", null, oracleContext()),
    /not the runtime-issued selection/
  );
});

// 15
test("an answer without a context does not qualify its challenge pass", () => {
  const result = runLoopToConvergence(
    clone(fixture),
    (questionId) => (questionId === "Q-FRAME" ? null : oracleContext())
  );
  assert.notEqual(result.directive.type, "stop");
  assert.ok(result.convergence.missing_passes.includes("frame_challenge"));
  assert.equal(result.directive.question?.generated_by_engine, true,
    "the engine synthesizes an escape question to re-earn the unqualified pass");
});

// 16
test("a context without a finding does not qualify", () => {
  const result = runLoopToConvergence(
    clone(fixture),
    (questionId) => (questionId === "Q-ADVERSARIAL" ? { provenance: "test oracle", finding: "" } : oracleContext())
  );
  assert.notEqual(result.directive.type, "stop");
  assert.ok(result.convergence.missing_passes.includes("adversarial"));
});

// 17
test("a context marked qualifies:false does not qualify", () => {
  const result = runLoopToConvergence(
    clone(fixture),
    (questionId) => (questionId === "Q-SOURCE-INDEPENDENCE"
      ? { provenance: "test oracle", finding: "shared upstream source suspected", qualifies: false }
      : oracleContext())
  );
  assert.notEqual(result.directive.type, "stop");
  assert.ok(result.convergence.missing_passes.includes("source_independence"));
});

// 18
test("unqualified challenge-pass answers surface a validation warning", () => {
  const state = clone(fixture);
  const issued = enforceLoop(state);
  const result = applyAnswer(issued.state, "Q-DISCRIMINATE", "activation_failure", null, null);
  const question = result.state.questions.find((candidate) => candidate.question_id === "Q-DISCRIMINATE");
  assert.ok(question.pass_tags.length > 0);
  const validation = validateQuestionGeometry(result.state);
  assert.ok(validation.findings.some((finding) =>
    finding.code === "QG_PASS_CONTEXT_MISSING" && finding.object_id === "Q-DISCRIMINATE"));
});

// 19
test("tampering an answered event breaks the hash chain", () => {
  const result = runLoopToConvergence(clone(fixture));
  const state = clone(result.state);
  state.history[0].answer = "tampered_answer";
  const validation = validateQuestionGeometry(state);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_HISTORY_CHAIN_BROKEN"));
});

// 20
test("deleting a history event breaks the hash chain", () => {
  const result = runLoopToConvergence(clone(fixture));
  const state = clone(result.state);
  state.history.splice(1, 1);
  assert.ok(verifyHistoryChain(state).length > 0);
});

// 21
test("reordering history events breaks the hash chain", () => {
  const result = runLoopToConvergence(clone(fixture));
  const state = clone(result.state);
  [state.history[0], state.history[1]] = [state.history[1], state.history[0]];
  assert.ok(verifyHistoryChain(state).length > 0);
});

// 22
test("a broken chain blocks release even when every other gate is green", () => {
  const result = runLoopToConvergence(clone(fixture));
  assert.equal(evaluateConvergence(result.state).release_allowed, true);
  const state = clone(result.state);
  state.history[2].answer = "tampered_answer";
  const convergence = evaluateConvergence(state);
  assert.equal(convergence.release_allowed, false);
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_HISTORY_CHAIN_BROKEN"));
});

// 23
test("hand-setting status to converged does not release the stop gate", () => {
  const state = clone(fixture);
  state.status = "converged";
  const convergence = evaluateConvergence(state);
  assert.equal(convergence.release_allowed, false);
});

// 24
test("the iteration safety bound forces human review instead of silent convergence", () => {
  const state = clone(fixture);
  state.iteration = 40;
  const convergence = evaluateConvergence(state);
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_ITERATION_REVIEW_GATE"));
  const result = enforceLoop(state);
  assert.equal(result.directive.type, "human_review");
  assert.equal(result.state.status, "human_review_required");
});

// 25
test("answer-channel likelihood rows must normalize to one", () => {
  const state = clone(fixture);
  const question = state.questions.find((candidate) => candidate.question_id === "Q-DISCRIMINATE");
  const hypothesisId = Object.keys(question.answer_model.likelihoods)[0];
  for (const answer of Object.keys(question.answer_model.likelihoods[hypothesisId])) {
    question.answer_model.likelihoods[hypothesisId][answer] = 0.9;
  }
  const validation = validateQuestionGeometry(state);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_ANSWER_MODEL_NORMALIZATION"));
});

// 26
test("duplicate object identifiers are rejected", () => {
  const state = clone(fixture);
  state.hypotheses.push(clone(state.hypotheses[0]));
  const validation = validateQuestionGeometry(state);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_DUPLICATE_ID"));
});

// 27
test("a question with a missing prerequisite reference is rejected", () => {
  const state = clone(fixture);
  state.questions[0].prerequisites = ["Q-DOES-NOT-EXIST"];
  const validation = validateQuestionGeometry(state);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_QUESTION_PREREQUISITE"));
});

// 28
test("escape synthesis targets the first missing challenge pass", () => {
  const state = clone(fixture);
  const escape = synthesizeEscapeQuestion(state, {
    missing_passes: ["frame_challenge"],
    landscape: buildQuestionLandscape(state)
  });
  assert.equal(escape.type, "frame_challenge");
  assert.equal(escape.generated_by_engine, true);
});

let failures = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error.stack || error.message);
  }
}

if (failures > 0) {
  console.error(`${failures} Question Geometry test(s) failed.`);
  process.exit(1);
}
console.log(`${tests.length} Question Geometry tests passed.`);
