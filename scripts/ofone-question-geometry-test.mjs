#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyAnswer,
  buildQuestionLandscape,
  enforceLoop,
  evaluateCausalDepth,
  evaluateConvergence,
  expectedBeliefDisplacement,
  robustDecisionSnapshot,
  scoreQuestion,
  validateQuestionGeometry
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

test("valid example passes semantic validation", () => {
  const result = validateQuestionGeometry(clone(fixture));
  assert.equal(result.passed, true, JSON.stringify(result.findings, null, 2));
});

test("question landscape selects the decision-sensitive discriminator", () => {
  const landscape = buildQuestionLandscape(clone(fixture));
  assert.equal(landscape.selected_question_id, "Q-DISCRIMINATE");
  const dominated = landscape.scored.find((item) => item.question_id === "Q-PRICE-ONLY");
  assert.equal(dominated.eligible, false);
  assert.match(dominated.exclusion_reasons.join(" "), /dominated_by/);
});


test("probabilistic geometry measures expected movement on the belief simplex", () => {
  const state = clone(fixture);
  const question = state.questions.find((candidate) => candidate.question_id === "Q-DISCRIMINATE");
  const displacement = expectedBeliefDisplacement(question, state.hypotheses);
  assert.ok(displacement > 0);
  assert.ok(displacement <= 1);
});

test("bounded lookahead credits a bridge question for unlocking a stronger next question", () => {
  let state = clone(fixture);
  let result = enforceLoop(state);
  result = applyAnswer(result.state, "Q-DISCRIMINATE", "activation_failure");
  state = result.state;
  const frameQuestion = state.questions.find((candidate) => candidate.question_id === "Q-FRAME");
  frameQuestion.status = "pending";
  state.policy.current_question_id = null;
  frameQuestion.metrics.lookahead_value = 0;
  const scored = scoreQuestion(frameQuestion, state);
  assert.ok(scored.vector.lookahead_value > 0, JSON.stringify(scored, null, 2));
});


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

test("stop is rejected before the enforced inquiry passes complete", () => {
  const convergence = evaluateConvergence(clone(fixture));
  assert.equal(convergence.release_allowed, false);
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_BLOCKING_UNKNOWN"));
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_HIGH_VALUE_QUESTION_REMAINS"));
});

test("runtime loop forces continuation and converges only after all hard passes", () => {
  let state = clone(fixture);
  let result = enforceLoop(state);
  assert.equal(result.directive.type, "ask");
  assert.equal(result.directive.question.question_id, "Q-DISCRIMINATE");
  state = result.state;

  const answers = {
    "Q-DISCRIMINATE": "activation_failure",
    "Q-FRAME": "frame_survives",
    "Q-MODEL-EXPANSION": "no_material_surprise",
    "Q-SOURCE-INDEPENDENCE": "independent_support",
    "Q-ADVERSARIAL": "no_material_distortion",
    "Q-STOP-COUNTEREXAMPLE": "reversal_tested"
  };

  for (let step = 0; step < 12; step += 1) {
    const questionId = result.directive.question?.question_id;
    if (!questionId) break;
    assert.ok(answers[questionId], `Unexpected question ${questionId}`);
    result = applyAnswer(state, questionId, answers[questionId]);
    state = result.state;
    if (result.directive.type === "stop") break;
  }

  assert.equal(result.directive.type, "stop");
  assert.equal(state.status, "converged");
  assert.equal(result.convergence.release_allowed, true);
  assert.deepEqual(result.convergence.missing_passes, []);
  assert.ok(result.convergence.metrics.decision_robustness >= state.policy.thresholds.minimum_decision_robustness);
});

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

test("bedrock must remain frame-relative and reopenable", () => {
  const state = clone(fixture);
  const bedrock = state.causal_depth.nodes.find((node) => node.status === "bedrock").bedrock;
  bedrock.frame_relative = false;
  bedrock.reopen_condition = "";
  const result = evaluateCausalDepth(state);
  assert.ok(result.findings.some((finding) => finding.code === "QG_BEDROCK_FRAME"));
  assert.ok(result.findings.some((finding) => finding.code === "QG_BEDROCK_REOPEN"));
});

test("low-yield repetition forces an escape operator instead of silent stopping", () => {
  const state = clone(fixture);
  state.questions.find((question) => question.question_id === "Q-DISCRIMINATE").status = "answered";
  state.policy.current_question_id = null;
  state.history = [1, 2, 3].map((iteration) => ({
    iteration,
    question_id: `Q-STALE-${iteration}`,
    question_text: "Repeat the same low-yield question",
    question_type: "evidence",
    question_family: "epistemic",
    answer: "indeterminate",
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
  }));
  const result = enforceLoop(state);
  assert.equal(result.directive.type, "ask");
  assert.equal(result.directive.question.generated_by_engine, true);
  assert.notEqual(result.directive.question.type, "evidence");
});

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
