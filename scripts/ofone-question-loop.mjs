#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  applyAnswer,
  buildQuestionLandscape,
  enforceLoop,
  evaluateConvergence,
  validateQuestionGeometry
} from "../lib/question-geometry.mjs";

function usage() {
  console.error(`Usage:
  node scripts/ofone-question-loop.mjs check <state.json>
  node scripts/ofone-question-loop.mjs landscape <state.json>
  node scripts/ofone-question-loop.mjs step <state.json> [--write] [--output <path>]
  node scripts/ofone-question-loop.mjs answer <state.json> <question_id> <answer> [--effects <effects.json>] [--write] [--output <path>]
  node scripts/ofone-question-loop.mjs attempt-stop <state.json> [--write] [--output <path>]

The process exits non-zero when validation fails or when a stop attempt is rejected.
A rejected stop attempt returns the next enforced inquiry directive instead of allowing silent completion.`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseOptions(args) {
  const options = { write: false, output: null, effects: null };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--write") options.write = true;
    else if (value === "--output") options.output = args[++index];
    else if (value === "--effects") options.effects = args[++index];
    else positional.push(value);
  }
  return { options, positional };
}

function writeState(sourcePath, state, options) {
  const target = options.output || (options.write ? sourcePath : null);
  if (!target) return null;
  fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(state, null, 2)}\n`);
  return target;
}

function print(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

const [command, ...rest] = process.argv.slice(2);
if (!command) {
  usage();
  process.exit(64);
}

const { options, positional } = parseOptions(rest);
const statePath = positional[0];
if (!statePath) {
  usage();
  process.exit(64);
}

let state;
try {
  state = readJson(statePath);
} catch (error) {
  console.error(`Unable to read ${statePath}: ${error.message}`);
  process.exit(66);
}

try {
  if (command === "check") {
    const result = validateQuestionGeometry(state);
    print(result);
    process.exit(result.passed ? 0 : 1);
  }

  if (command === "landscape") {
    print(buildQuestionLandscape(state));
    process.exit(0);
  }

  if (command === "step") {
    const result = enforceLoop(state);
    const written = writeState(statePath, result.state, options);
    print({ directive: result.directive, convergence: result.convergence, validation: result.validation, written });
    process.exit(result.validation.passed ? 0 : 1);
  }

  if (command === "answer") {
    const questionId = positional[1];
    const answer = positional[2];
    if (!questionId || answer == null) {
      usage();
      process.exit(64);
    }
    const effects = options.effects ? readJson(options.effects) : null;
    const result = applyAnswer(state, questionId, answer, effects);
    const written = writeState(statePath, result.state, options);
    print({ directive: result.directive, convergence: result.convergence, validation: result.validation, written });
    process.exit(result.validation.passed ? 0 : 1);
  }

  if (command === "attempt-stop") {
    const convergence = evaluateConvergence(state);
    if (convergence.release_allowed) {
      state.status = "converged";
      state.convergence = {
        ...(state.convergence || {}),
        last_evaluation: convergence,
        stopped_at_iteration: Number(state.iteration || 0),
        stop_reason: convergence.stop_reason
      };
      const written = writeState(statePath, state, options);
      print({ allowed: true, convergence, written });
      process.exit(0);
    }

    // A rejected stop is not a dead end. The harness immediately computes the
    // strongest available continuation or an escape/reframe probe.
    const continuation = enforceLoop(state);
    const written = writeState(statePath, continuation.state, options);
    print({
      allowed: false,
      convergence,
      next_directive: continuation.directive,
      written
    });
    process.exit(2);
  }

  usage();
  process.exit(64);
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
