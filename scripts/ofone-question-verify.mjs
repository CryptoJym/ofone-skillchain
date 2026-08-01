#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { answerContextQualifies, verifyHistoryChain } from "../lib/question-geometry.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const args = process.argv.slice(2);
const only = args.includes("--smoke") ? "smoke" : args.includes("--determinism") ? "determinism" : "all";

let failures = 0;
function report(name, passed, detail = "") {
  if (passed) console.log(`PASS ${name}`);
  else {
    failures += 1;
    console.error(`FAIL ${name}${detail ? `: ${detail}` : ""}`);
  }
}
function run(cmd, cmdArgs, options = {}) {
  return spawnSync(cmd, cmdArgs, { cwd: root, encoding: "utf8", ...options });
}

function checkStates() {
  const check = run(process.execPath, [
    "scripts/ofone-question-geometry-check.mjs",
    "examples/question-geometry/causal-depth.json"
  ]);
  report("example state passes schema + semantic + loop check", check.status === 0, check.stderr || check.stdout.slice(-300));

  const contextPath = path.join(root, "examples", "question-geometry", "answer-contexts", "frame-challenge.example.json");
  let contextOk = false;
  let detail = "";
  try {
    const context = JSON.parse(fs.readFileSync(contextPath, "utf8"));
    contextOk = answerContextQualifies(context);
    if (!contextOk) detail = "example answer context does not qualify (needs provenance + finding)";
  } catch (error) {
    detail = error.message;
  }
  report("example answer context is well-formed and qualifying", contextOk, detail);
}

function checkDeterminism() {
  const fresh = run(process.execPath, [
    "scripts/ofone-question-benchmark.mjs",
    "benchmarks/question-geometry/suite.json"
  ]);
  if (fresh.status !== 0) {
    report("benchmark runner executes", false, fresh.stderr.slice(-300));
    return;
  }
  report("benchmark runner executes", true);
  try {
    const freshReport = JSON.parse(fresh.stdout);
    const committed = JSON.parse(fs.readFileSync(path.join(root, "benchmarks", "question-geometry", "example-results.json"), "utf8"));
    delete freshReport.generated_at;
    delete committed.generated_at;
    const identical = JSON.stringify(freshReport) === JSON.stringify(committed);
    report("committed example-results reproduce byte-identically (modulo timestamp)", identical,
      identical ? "" : "fresh benchmark output differs from committed example-results.json; regenerate with question:benchmark:write and review the diff");
  } catch (error) {
    report("committed example-results reproduce byte-identically (modulo timestamp)", false, error.message);
  }
}

function checkSmoke() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "qg-smoke-"));
  const statePath = path.join(temp, "state.json");
  const contextPath = path.join(temp, "context.json");
  fs.copyFileSync(path.join(root, "examples", "question-geometry", "causal-depth.json"), statePath);
  fs.writeFileSync(contextPath, `${JSON.stringify({
    provenance: "question:verify lifecycle smoke oracle",
    finding: "scripted smoke answer",
    qualifies: true
  }, null, 2)}\n`);
  const answers = {
    "Q-DISCRIMINATE": "activation_failure",
    "Q-FRAME": "frame_survives",
    "Q-MODEL-EXPANSION": "no_material_surprise",
    "Q-SOURCE-INDEPENDENCE": "independent_support",
    "Q-ADVERSARIAL": "no_material_distortion",
    "Q-STOP-COUNTEREXAMPLE": "reversal_tested"
  };
  const loop = (command, extra = []) => run(process.execPath, ["scripts/ofone-question-loop.mjs", command, statePath, ...extra]);

  try {
    report("initialize succeeds", loop("initialize", ["--write"]).status === 0);
    report("premature attempt-stop is rejected with exit 2", loop("attempt-stop").status === 2);

    const wrongAnswer = loop("answer", ["Q-FRAME", "frame_survives", "--context", contextPath]);
    report("answering a non-issued question is refused", wrongAnswer.status === 1);

    let converged = false;
    for (let step = 0; step < 12; step += 1) {
      const stepResult = loop("step", ["--write"]);
      if (stepResult.status !== 0) break;
      const parsed = JSON.parse(stepResult.stdout);
      if (parsed.directive?.type === "stop") { converged = true; break; }
      const questionId = parsed.directive?.question?.question_id;
      if (!questionId || !answers[questionId]) break;
      const answered = loop("answer", [questionId, answers[questionId], "--context", contextPath, "--write"]);
      if (answered.status !== 0) break;
      const after = JSON.parse(answered.stdout);
      if (after.directive?.type === "stop") { converged = true; break; }
    }
    report("enforced loop reaches convergence through the CLI", converged);
    report("attempt-stop releases with exit 0 after convergence", loop("attempt-stop", ["--write"]).status === 0);

    const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    report("converged history chain verifies clean", verifyHistoryChain(state).length === 0);

    state.history[0].answer = "tampered_answer";
    fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
    const tampered = loop("attempt-stop");
    const tamperedOut = `${tampered.stdout}${tampered.stderr}`;
    report("tampered history is refused with the chain blocker",
      tampered.status === 2 && tamperedOut.includes("QG_HISTORY_CHAIN_BROKEN"));
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

if (only === "all" || only === "smoke") {
  if (only === "all") checkStates();
  checkSmoke();
}
if (only === "all" || only === "determinism") {
  checkDeterminism();
}

if (failures > 0) {
  console.error(`${failures} Question Geometry verification check(s) failed.`);
  process.exit(1);
}
console.log("Question Geometry verification passed.");
