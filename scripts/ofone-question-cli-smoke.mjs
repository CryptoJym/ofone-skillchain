#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const cli = path.join(root, "scripts", "ofone-question-loop.mjs");
const fixturePath = path.join(root, "examples", "question-geometry", "causal-depth.json");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ofone-question-cli-"));
const statePath = path.join(temp, "state.json");
const contextPath = path.join(temp, "answer-context.json");

const answers = {
  "Q-DISCRIMINATE": "activation_failure",
  "Q-FRAME": "frame_survives",
  "Q-MODEL-EXPANSION": "no_material_surprise",
  "Q-SOURCE-INDEPENDENCE": "independent_support",
  "Q-ADVERSARIAL": "no_material_distortion",
  "Q-STOP-COUNTEREXAMPLE": "reversal_tested"
};

function passDetails(passId) {
  return {
    frame_challenge: {
      tested_assumption: "Instrumentation is directionally usable",
      alternative_frame: "Instrumentation failure or regime shift",
      result: "The bounded alternative frame was tested."
    },
    model_expansion: {
      surprise_test: "Search for evidence surprising under every active hypothesis",
      candidate_model_class: "Regime shift, omitted mechanism, or instrumentation failure",
      result: "The active model class was challenged."
    },
    adversarial: {
      actor_or_attack_surface: "Product, sales, and analytics reporting owners",
      distortion_test: "Compare raw events with owner-shaped summaries",
      result: "Incentive-linked distortion was tested."
    },
    source_independence: {
      sources_examined: ["raw events", "CRM labels", "interviews"],
      dependency_result: "An independent raw sample tested the shared-source failure mode.",
      result: "Source independence was evaluated."
    },
    stopping_counterexample: {
      reversal_condition: "The intervention fails or a competing model predicts the evidence better",
      cheapest_safe_test: "A bounded matched-cohort intervention",
      result: "Decision-reversing evidence was actively sought."
    }
  }[passId];
}

function contextFor(question) {
  const evidenceRef = `CLI-SMOKE:${question.question_id}`;
  return {
    provenance: {
      source_type: "test_fixture",
      source_id: `cli-smoke:${question.question_id}`,
      observed_at: "2026-08-01T13:00:00Z",
      reliability: "high",
      chain_of_custody: "Deterministic CLI lifecycle smoke test.",
      evidence_refs: [evidenceRef]
    },
    pass_results: (question.pass_tags || [])
      .filter((passId) => passId !== "causal_depth")
      .map((passId) => ({
        pass_id: passId,
        outcome: "satisfied",
        basis: "evidence",
        rationale: `CLI smoke evidence evaluated ${passId}; completion was not inferred from the pass tag.`,
        evidence_refs: [evidenceRef],
        details: passDetails(passId)
      })),
    effects: {},
    risk_acceptances: [],
    robustness_waiver: null
  };
}

function run(args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  assert.equal(
    result.status,
    expectedStatus,
    `Command failed: ${args.join(" ")}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
  );
  return result.stdout.trim() ? JSON.parse(result.stdout) : null;
}

try {
  const initial = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  delete initial.history_integrity;
  initial.history = [];
  initial.iteration = 0;
  initial.status = "active";
  initial.policy.current_question_id = null;
  initial.policy.current_selection = null;
  fs.writeFileSync(statePath, `${JSON.stringify(initial, null, 2)}\n`);

  const initialized = run(["initialize", statePath, "--write"]);
  assert.equal(initialized.validation.passed, true);
  assert.equal(initialized.history_integrity.event_count, 0);

  const rejected = run(["attempt-stop", statePath, "--write"], 2);
  assert.equal(rejected.allowed, false);
  assert.equal(rejected.next_directive.type, "ask");

  for (let step = 0; step < 20; step += 1) {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    if (state.status === "converged") break;
    const question = state.questions.find((candidate) => candidate.question_id === state.policy.current_question_id);
    assert.ok(question, "CLI state must contain the runtime-selected question.");
    const answer = answers[question.question_id];
    assert.ok(answer, `Unexpected selected question ${question.question_id}`);
    fs.writeFileSync(contextPath, `${JSON.stringify(contextFor(question), null, 2)}\n`);
    const committed = run([
      "answer",
      statePath,
      question.question_id,
      answer,
      "--context",
      contextPath,
      "--write"
    ]);
    assert.equal(committed.validation.passed, true);
    assert.ok(committed.committed_event.event_hash.startsWith("sha256:"));
  }

  const allowed = run(["attempt-stop", statePath, "--write"], 0);
  assert.equal(allowed.allowed, true);
  assert.equal(allowed.convergence.release_allowed, true);

  const finalState = JSON.parse(fs.readFileSync(statePath, "utf8"));
  assert.equal(finalState.status, "converged");
  assert.equal(finalState.history.length, 6);
  assert.equal(finalState.history_integrity.event_count, 6);
  console.log("PASS Question Geometry CLI lifecycle smoke test");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
