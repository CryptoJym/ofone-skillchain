#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyAnswer,
  buildQuestionLandscape,
  computeAnswerEventHash,
  enforceLoop,
  evaluateCausalDepth,
  evaluateConvergence,
  expectedBeliefDisplacement,
  initializeQuestionGeometryState,
  robustDecisionSnapshot,
  scoreQuestion,
  selectQuestionByPolicy,
  validateQuestionGeometry,
  verifyHistoryIntegrity
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

function detailsFor(passId) {
  const details = {
    frame_challenge: {
      tested_assumption: "Instrumentation is directionally usable",
      alternative_frame: "Instrumentation failure or regime shift",
      result: "The conclusion was tested against the alternative frame."
    },
    model_expansion: {
      surprise_test: "Search for observations surprising under every active hypothesis",
      candidate_model_class: "Regime shift, hidden mechanism, or instrumentation failure",
      result: "The active model class was explicitly challenged."
    },
    adversarial: {
      actor_or_attack_surface: "Product, sales, and analytics reporting owners",
      distortion_test: "Compare raw events with owner-shaped summaries",
      result: "Incentive-linked distortion was tested."
    },
    source_independence: {
      sources_examined: ["raw events", "CRM labels", "interviews"],
      dependency_result: "An independent raw sample tested shared upstream failure.",
      result: "Source dependence was explicitly evaluated."
    },
    stopping_counterexample: {
      reversal_condition: "The selected intervention fails or a competing mechanism predicts the data better",
      cheapest_safe_test: "A bounded matched-cohort intervention",
      result: "A decision-reversing observation was actively sought."
    }
  };
  return details[passId];
}

function answerContext(question, options = {}) {
  const evidenceRef = options.evidenceRef || `TEST:${question.question_id}`;
  const passResults = options.omitPassResults
    ? []
    : (question.pass_tags || []).filter((passId) => passId !== "causal_depth").map((passId) => ({
      pass_id: passId,
      outcome: options.passOutcome || "satisfied",
      basis: "evidence",
      rationale: `Regression evidence evaluated ${passId}; completion is not inferred from the tag.`,
      evidence_refs: [evidenceRef],
      details: detailsFor(passId)
    }));
  return {
    provenance: {
      source_type: options.sourceType || "test_fixture",
      source_id: options.sourceId || `fixture:${question.question_id}`,
      observed_at: options.observedAt || "2026-08-01T13:00:00Z",
      reliability: options.reliability || "high",
      chain_of_custody: options.chainOfCustody || "Deterministic local regression fixture.",
      evidence_refs: [evidenceRef]
    },
    pass_results: passResults,
    effects: options.effects || {},
    risk_acceptances: options.riskAcceptances || [],
    robustness_waiver: options.robustnessWaiver || null
  };
}

const canonicalAnswers = {
  "Q-DISCRIMINATE": "activation_failure",
  "Q-FRAME": "frame_survives",
  "Q-MODEL-EXPANSION": "no_material_surprise",
  "Q-SOURCE-INDEPENDENCE": "independent_support",
  "Q-ADVERSARIAL": "no_material_distortion",
  "Q-STOP-COUNTEREXAMPLE": "reversal_tested"
};

function runUntil(targetQuestionId = null, mutateContext = null, stateInput = fixture) {
  let result = enforceLoop(clone(stateInput));
  for (let step = 0; step < 20 && result.directive.type === "ask"; step += 1) {
    const question = result.directive.question;
    if (question.question_id === targetQuestionId) return result;
    const answer = canonicalAnswers[question.question_id];
    if (!answer) throw new Error(`Unexpected question ${question.question_id}`);
    let context = answerContext(question);
    if (mutateContext) context = mutateContext(question, context) || context;
    result = applyAnswer(result.state, question.question_id, answer, context);
  }
  return result;
}

function runToStop(stateInput = fixture, contextMutator = null) {
  let result = enforceLoop(clone(stateInput));
  for (let step = 0; step < 20 && result.directive.type === "ask"; step += 1) {
    const question = result.directive.question;
    const answer = canonicalAnswers[question.question_id];
    if (!answer) throw new Error(`Unexpected question ${question.question_id}`);
    let context = answerContext(question);
    if (contextMutator) context = contextMutator(question, context) || context;
    result = applyAnswer(result.state, question.question_id, answer, context);
  }
  return result;
}

function reinitialize(state) {
  const next = clone(state);
  next.history = [];
  delete next.history_integrity;
  next.iteration = 0;
  next.status = "active";
  next.policy.current_question_id = null;
  next.policy.current_selection = null;
  for (const question of next.questions) {
    delete question.answer;
    delete question.answered_at_iteration;
    if (question.status === "answered" || question.status === "selected") question.status = "pending";
  }
  return initializeQuestionGeometryState(next).state;
}

test("valid example passes semantic and history-integrity validation", () => {
  const result = validateQuestionGeometry(clone(fixture));
  assert.equal(result.passed, true, JSON.stringify(result.findings, null, 2));
  assert.equal(result.integrity.passed, true);
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
  let result = enforceLoop(clone(fixture));
  const question = result.directive.question;
  result = applyAnswer(result.state, question.question_id, "activation_failure", answerContext(question));
  const state = result.state;
  const frameQuestion = state.questions.find((candidate) => candidate.question_id === "Q-FRAME");
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

test("an unanswered runtime-selected question is an explicit stop blocker", () => {
  const result = enforceLoop(clone(fixture));
  const convergence = evaluateConvergence(result.state);
  assert.ok(convergence.blockers.some((blocker) => blocker.code === "QG_SELECTED_QUESTION_UNANSWERED"));
});

test("answering a pending question without a runtime-issued selection receipt is rejected", () => {
  const state = clone(fixture);
  assert.throws(() => applyAnswer(state, "Q-FRAME", "frame_survives", answerContext(state.questions.find((q) => q.question_id === "Q-FRAME"))), /selection|selected|invalid state/i);
});

test("manually spoofing selected status without a valid receipt is rejected", () => {
  const state = clone(fixture);
  const question = state.questions.find((candidate) => candidate.question_id === "Q-FRAME");
  question.status = "selected";
  state.policy.current_question_id = question.question_id;
  state.status = "waiting_for_answer";
  const validation = validateQuestionGeometry(state);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code.startsWith("QG_SELECTION")));
});

test("answer provenance is mandatory", () => {
  const result = enforceLoop(clone(fixture));
  assert.throws(() => applyAnswer(result.state, result.directive.question.question_id, "activation_failure", {}), /provenance/i);
});

test("a pass tag alone does not complete a challenge pass", () => {
  let result = runUntil("Q-FRAME");
  const question = result.directive.question;
  result = applyAnswer(result.state, question.question_id, "frame_survives", answerContext(question, { omitPassResults: true }));
  assert.ok(result.convergence.missing_passes.includes("frame_challenge"));
  assert.ok(result.validation.findings.some((finding) => finding.code === "QG_PASS_UNQUALIFIED"));
});

test("answer-qualified pass evidence completes the pass", () => {
  let result = runUntil("Q-FRAME");
  const question = result.directive.question;
  result = applyAnswer(result.state, question.question_id, "frame_survives", answerContext(question));
  assert.ok(!result.convergence.missing_passes.includes("frame_challenge"));
});

test("runtime loop converges only after all hard passes and event commitments", () => {
  const result = runToStop();
  assert.equal(result.directive.type, "stop");
  assert.equal(result.state.status, "converged");
  assert.equal(result.convergence.release_allowed, true);
  assert.deepEqual(result.convergence.missing_passes, []);
  assert.equal(result.state.history.length, result.state.iteration);
  assert.equal(result.state.history_integrity.event_count, result.state.history.length);
  assert.equal(verifyHistoryIntegrity(result.state).passed, true);
});

test("editing a committed answer event breaks the hash chain", () => {
  let result = enforceLoop(clone(fixture));
  const question = result.directive.question;
  result = applyAnswer(result.state, question.question_id, "activation_failure", answerContext(question));
  const tampered = clone(result.state);
  tampered.history[0].answer = "pricing_pattern";
  const validation = validateQuestionGeometry(tampered);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_HISTORY_EVENT_HASH"));
});

test("editing protected state outside an answer event breaks canonical head verification", () => {
  let result = enforceLoop(clone(fixture));
  const question = result.directive.question;
  result = applyAnswer(result.state, question.question_id, "activation_failure", answerContext(question));
  const tampered = clone(result.state);
  tampered.hypotheses[0].belief = 0.01;
  const validation = validateQuestionGeometry(tampered);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_HISTORY_CURRENT_STATE"));
});

test("iteration must equal committed answer-event count", () => {
  const state = clone(fixture);
  state.iteration = 7;
  const validation = validateQuestionGeometry(state);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_ITERATION_HISTORY"));
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
    counterfactual_test: "No counterfactual can justify a circular chain.",
    intervention_test: "No intervention can justify a circular chain.",
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

test("invalid bare risk acceptance is rejected", () => {
  const result = runUntil("Q-ADVERSARIAL");
  const question = result.directive.question;
  const context = answerContext(question, {
    effects: { accept_unknowns: ["U-ADVERSARIAL"] }
  });
  assert.throws(() => applyAnswer(result.state, question.question_id, "no_material_distortion", context), /Bare effects\.accept_unknowns/);
});

test("typed human risk acceptance can govern a deliberately unresolved unknown", () => {
  const modified = clone(fixture);
  modified.questions.find((question) => question.question_id === "Q-ADVERSARIAL")
    .answer_effects.no_material_distortion = { belief_multipliers: { "H-ONBOARDING": 1.05 } };
  const state = reinitialize(modified);
  const result = runToStop(state, (question, context) => {
    if (question.question_id === "Q-ADVERSARIAL") {
      context.risk_acceptances = [{
        acceptance_id: "RA-ADVERSARIAL-001",
        unknown_id: "U-ADVERSARIAL",
        accepted_by: { actor_id: "HUMAN-RISK-OWNER", role: "risk_owner", authority_basis: "Named decision owner for the bounded experiment" },
        accepted_at: "2026-08-01T13:00:00Z",
        expires_at: "2026-09-01T13:00:00Z",
        rationale: "Residual reporting-incentive risk is accepted only for a reversible, instrumented activation experiment.",
        scope: "One bounded activation experiment; no irreversible launch or pricing decision.",
        reopen_conditions: ["raw-event contradiction", "ownership incentives change", "experiment fails"],
        evidence_refs: ["E:Q-ADVERSARIAL"]
      }];
    }
    return context;
  });
  assert.equal(result.directive.type, "stop");
  assert.equal(result.state.unknowns.find((unknown) => unknown.unknown_id === "U-ADVERSARIAL").status, "accepted_risk");
});



test("future-dated risk acceptance is inactive and cannot waive an unknown", () => {
  const result = runUntil("Q-ADVERSARIAL");
  const question = result.directive.question;
  const context = answerContext(question, {
    riskAcceptances: [{
      acceptance_id: "RA-FUTURE-001",
      unknown_id: "U-ADVERSARIAL",
      accepted_by: { actor_id: "HUMAN-RISK-OWNER", role: "risk_owner", authority_basis: "Named decision owner" },
      accepted_at: "2026-08-02T13:00:00Z",
      expires_at: "2026-09-01T13:00:00Z",
      rationale: "This record is intentionally future-dated to verify that approval cannot become active before its acceptance time.",
      scope: "One bounded activation experiment.",
      reopen_conditions: ["raw evidence contradicts the decision"],
      evidence_refs: ["E:FUTURE-ACCEPTANCE"]
    }]
  });
  assert.throws(
    () => applyAnswer(result.state, question.question_id, "no_material_distortion", context),
    /Invalid or inactive risk acceptance/
  );
});

test("robustness waiver requires bounded human authority and quantitative limits", () => {
  const modified = clone(fixture);
  modified.policy.thresholds.minimum_decision_robustness = 0.95;
  const state = reinitialize(modified);
  const result = runToStop(state, (question, context) => {
    if (question.question_id === "Q-STOP-COUNTEREXAMPLE") {
      context.robustness_waiver = {
        waiver_id: "RW-001",
        approved_by: { actor_id: "HUMAN-DECISION-OWNER", role: "decision_owner", authority_basis: "Owns the reversible 30-day experiment" },
        approved_at: "2026-08-01T13:00:00Z",
        expires_at: "2026-09-01T13:00:00Z",
        rationale: "Proceed only with a reversible experiment despite not meeting the normal robustness threshold.",
        scope: "One instrumented activation experiment, not full rollout.",
        minimum_decision_robustness: 0.75,
        maximum_residual_evpi: 0.1,
        reopen_conditions: ["robustness falls below 0.75", "EVPI exceeds 0.1", "experiment contradicts mechanism"],
        evidence_refs: ["E:Q-STOP-COUNTEREXAMPLE"]
      };
    }
    return context;
  });
  assert.equal(result.directive.type, "stop");
  assert.equal(result.convergence.robustness_waiver.applies, true);
});



test("agent inference cannot self-certify an evidence-based challenge pass", () => {
  const result = runUntil("Q-FRAME");
  const question = result.directive.question;
  const context = answerContext(question, { sourceType: "agent_inference", reliability: "high" });
  assert.throws(
    () => applyAnswer(result.state, question.question_id, "frame_survives", context),
    /QG_PASS_SOURCE_BASIS/
  );
});

test("hypothesized links do not count as a supported path to causal bedrock", () => {
  const state = clone(fixture);
  state.causal_depth.links.find((link) => link.link_id === "CL-2").status = "hypothesized";
  const result = evaluateCausalDepth(state);
  assert.equal(result.passed, false);
  assert.ok(result.findings.some((finding) => finding.code === "QG_CAUSAL_DEPTH_OPEN"));
});

test("question-declared effects cannot write convergence or governance state", () => {
  const state = clone(fixture);
  state.questions.find((question) => question.question_id === "Q-FRAME")
    .answer_effects.frame_survives.set_convergence = { robustness_waiver: { forged: true } };
  const validation = validateQuestionGeometry(state);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_EFFECT_CONVERGENCE"));
});

test("external effects payload is preserved and independently hash-checked", () => {
  let result = enforceLoop(clone(fixture));
  const question = result.directive.question;
  result = applyAnswer(result.state, question.question_id, "activation_failure", answerContext(question));
  const tampered = clone(result.state);
  tampered.history[0].external_effects.forged_resolution = ["U-MODEL-CLASS"];
  tampered.history[0].event_hash = computeAnswerEventHash(tampered.history[0]);
  tampered.history_integrity.head_hash = tampered.history[0].event_hash;
  const validation = validateQuestionGeometry(tampered);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_EVENT_EXTERNAL_EFFECTS_HASH"));
});

test("temporal context is required for deterministic governance evaluation", () => {
  const state = clone(fixture);
  delete state.temporal_context;
  const validation = validateQuestionGeometry(state);
  assert.equal(validation.passed, false);
  assert.ok(validation.findings.some((finding) => finding.code === "QG_TEMPORAL_AS_OF"));
});

test("low-yield repetition forces a different escape operator", () => {
  const modified = clone(fixture);
  modified.unknowns.forEach((unknown) => { unknown.status = "resolved"; });
  modified.policy.required_passes = ["frame_challenge"];
  modified.questions.forEach((question) => { question.status = "retired"; });
  for (let index = 1; index <= 3; index += 1) {
    modified.questions.push({
      question_id: `Q-STALE-${index}`,
      type: "evidence",
      text: `Repeat low-yield evidence probe ${index}`,
      targets: ["F-CONVERSION"],
      answer_space: ["indeterminate"],
      costs: { time: 0.1 }, risks: {}, delay: 0.01,
      prerequisites: [], pass_tags: [], pass_conditions: {},
      metrics: { information_gain: 0.1, actionability: 0.1, novelty: 0.1 },
      status: "pending"
    });
  }
  let state = reinitialize(modified);
  let result;
  for (let index = 1; index <= 3; index += 1) {
    state = selectQuestionByPolicy(state, `Q-STALE-${index}`, {
      selector: "test_stall_policy",
      selection_reason: "Construct three committed low-progress events for the stall regression.",
      allow_ineligible: true
    });
    const question = state.questions.find((candidate) => candidate.question_id === `Q-STALE-${index}`);
    result = applyAnswer(state, question.question_id, "indeterminate", answerContext(question));
    state = result.state;
    if (index < 3 && state.policy.current_question_id) {
      state.questions.find((candidate) => candidate.question_id === state.policy.current_question_id).status = "pending";
      state.policy.current_question_id = null;
      state.policy.current_selection = null;
      state.status = "active";
    }
  }
  assert.equal(result.directive.type, "ask");
  assert.equal(result.directive.question.generated_by_engine, true);
  assert.notEqual(result.directive.question.type, "evidence");
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
