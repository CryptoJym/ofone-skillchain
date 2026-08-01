#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyAnswer,
  buildQuestionLandscape,
  computeStateMetrics,
  enforceLoop,
  evaluateConvergence,
  normalizeBeliefs,
  decisionSnapshot
} from "../lib/question-geometry.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const suitePath = process.argv.find((argument) => argument.endsWith(".json"))
  || path.join(root, "benchmarks", "question-geometry", "suite.json");
const write = process.argv.includes("--write");
const suite = JSON.parse(fs.readFileSync(path.resolve(suitePath), "utf8"));
const clone = (value) => JSON.parse(JSON.stringify(value));

function loadInitial(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, relativePath), "utf8"));
}

function resetSelection(state) {
  for (const question of state.questions || []) {
    if (question.status === "selected") question.status = "pending";
  }
  state.policy.current_question_id = null;
  if (state.status !== "converged") state.status = "active";
  return state;
}

function answerCost(question) {
  return Object.values(question?.costs || {}).reduce((sum, value) => sum + Number(value || 0), 0);
}

function answerRisk(question) {
  return Object.values(question?.risks || {}).reduce((sum, value) => sum + Number(value || 0), 0);
}

function hiddenUtility(state, actionId, hiddenHypothesis) {
  const action = (state.decision_model?.actions || []).find((candidate) => candidate.action_id === actionId);
  return Number(action?.utilities?.[hiddenHypothesis] ?? 0);
}

function optimalHiddenUtility(state, hiddenHypothesis) {
  return Math.max(...(state.decision_model?.actions || []).map((action) => hiddenUtility(state, action.action_id, hiddenHypothesis)));
}

function policyWeights(state, arm) {
  const next = clone(state);
  if (arm.policy === "information_gain") {
    next.policy.weights = Object.fromEntries(Object.keys(next.policy.weights).map((key) => [key, key === "information_gain" ? 1 : 0]));
  } else if (arm.policy === "decision_value") {
    next.policy.weights = Object.fromEntries(Object.keys(next.policy.weights).map((key) => [key, key === "decision_gain" ? 1 : 0]));
  }
  return next;
}

function askAndReset(state, questionId, answer) {
  const question = state.questions.find((candidate) => candidate.question_id === questionId);
  if (!question || !["pending", "selected"].includes(question.status)) return { state, asked: false, cost: 0, risk: 0 };
  question.status = "selected";
  state.policy.current_question_id = questionId;
  const result = applyAnswer(state, questionId, answer, null, suite.oracle_context || null);
  return {
    state: resetSelection(result.state),
    asked: true,
    cost: answerCost(question),
    risk: answerRisk(question)
  };
}

function baselineRun(initial, caseSpec, arm) {
  let state = policyWeights(clone(initial), arm);
  let cost = 0;
  let risk = 0;
  const transcript = [];
  const budget = Number(arm.question_budget || 0);

  if (arm.policy === "declared_order") {
    for (const questionId of (caseSpec.fixed_order || []).slice(0, budget)) {
      const answer = caseSpec.oracle_answers[questionId];
      const result = askAndReset(state, questionId, answer);
      state = result.state;
      if (result.asked) {
        cost += result.cost;
        risk += result.risk;
        transcript.push({ question_id: questionId, answer });
      }
    }
  } else if (["information_gain", "decision_value"].includes(arm.policy)) {
    for (let step = 0; step < budget; step += 1) {
      const landscape = buildQuestionLandscape(state);
      const questionId = landscape.selected_question_id;
      if (!questionId || caseSpec.oracle_answers[questionId] == null) break;
      const answer = caseSpec.oracle_answers[questionId];
      const result = askAndReset(state, questionId, answer);
      state = policyWeights(result.state, arm);
      if (!result.asked) break;
      cost += result.cost;
      risk += result.risk;
      transcript.push({ question_id: questionId, answer });
    }
  }

  return { state, cost, risk, transcript };
}

function fullRun(initial, caseSpec, arm) {
  let state = clone(initial);
  let result = enforceLoop(state);
  let cost = 0;
  let risk = 0;
  const transcript = [];
  for (let step = 0; step < Number(arm.question_budget || 0); step += 1) {
    if (result.directive.type === "stop" || result.directive.type === "human_review" || result.directive.type === "repair") break;
    const question = result.directive.question;
    if (!question) break;
    const answer = caseSpec.oracle_answers[question.question_id] ?? "structured_response";
    cost += answerCost(question);
    risk += answerRisk(question);
    transcript.push({ question_id: question.question_id, answer, generated_by_engine: question.generated_by_engine === true });
    result = applyAnswer(result.state, question.question_id, answer, null, suite.oracle_context || null);
  }
  return { state: result.state, cost, risk, transcript, directive: result.directive };
}

function summarize(run, initial, caseSpec, arm) {
  const beliefs = normalizeBeliefs(run.state.hypotheses);
  const decision = decisionSnapshot(run.state.decision_model, beliefs);
  const convergence = evaluateConvergence(run.state);
  const chosen = decision.best_action_id;
  const optimal = optimalHiddenUtility(initial, caseSpec.hidden_hypothesis);
  const chosenUtility = hiddenUtility(initial, chosen, caseSpec.hidden_hypothesis);
  const required = new Set(run.state.policy.required_passes || []);
  const completed = new Set(convergence.completed_passes || []);
  const coverage = required.size === 0 ? 1 : [...required].filter((pass) => completed.has(pass)).length / required.size;
  const blockingUnknowns = (run.state.unknowns || []).filter((unknown) =>
    unknown.status === "open" && ((unknown.blocks || []).length > 0 || Number(unknown.impact || 0) >= run.state.policy.thresholds.high_impact_unknown)
  );
  return {
    arm_id: arm.arm_id,
    chosen_action: chosen,
    optimal_action: caseSpec.optimal_action,
    decision_regret: optimal - chosenUtility,
    decision_robustness: decision.robustness,
    questions_asked: run.transcript.length,
    cumulative_cost: run.cost,
    cumulative_risk: run.risk,
    required_pass_coverage: coverage,
    blocking_unknowns_remaining: blockingUnknowns.map((unknown) => unknown.unknown_id),
    premature_stop: !convergence.release_allowed,
    human_review_required: run.state.status === "human_review_required",
    final_status: run.state.status,
    transcript: run.transcript
  };
}

const results = [];
for (const caseSpec of suite.cases) {
  const initial = loadInitial(caseSpec.initial_state_path);
  const arms = [];
  for (const arm of suite.arms) {
    let run;
    if (arm.policy === "no_questions") run = { state: clone(initial), cost: 0, risk: 0, transcript: [] };
    else if (arm.policy === "enforced_multi_objective_loop") run = fullRun(initial, caseSpec, arm);
    else run = baselineRun(initial, caseSpec, arm);
    arms.push(summarize(run, initial, caseSpec, arm));
  }
  results.push({ case_id: caseSpec.case_id, hidden_hypothesis: caseSpec.hidden_hypothesis, arms });
}

const report = {
  suite_id: suite.suite_id,
  generated_at: new Date().toISOString(),
  status: suite.status,
  release_guard: suite.release_guard,
  results
};

if (write) {
  const outputPath = path.join(root, "benchmarks", "question-geometry", "example-results.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
} else {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}
