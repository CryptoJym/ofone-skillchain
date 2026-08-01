#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  applyAnswer,
  buildQuestionLandscape,
  enforceLoop,
  evaluateConvergence,
  initializeQuestionGeometryState,
  validateQuestionGeometry
} from "../lib/question-geometry.mjs";

function usage() {
  console.error(`Usage:
  node scripts/ofone-question-loop.mjs initialize <state.json> [--write] [--output <path>]
  node scripts/ofone-question-loop.mjs check <state.json>
  node scripts/ofone-question-loop.mjs landscape <state.json>
  node scripts/ofone-question-loop.mjs step <state.json> [--write] [--output <path>]
  node scripts/ofone-question-loop.mjs answer <state.json> <question_id> <answer>
      --context <answer-context.json>
      [--provenance <provenance.json>] [--assessment <pass-results.json>]
      [--effects <effects.json>] [--risk-acceptance <record-or-array.json>]
      [--robustness-waiver <waiver.json>]
      [--source-type <type>] [--source-id <id>] [--observed-at <iso>]
      [--reliability <level>] [--chain-of-custody <text>]
      [--evidence-ref <id> ...] [--write] [--output <path>]
  node scripts/ofone-question-loop.mjs attempt-stop <state.json> [--write] [--output <path>]

The answer command requires evidence-bearing provenance. A pass tag is not completion:
pass_results must include answer-qualified rationale, basis, evidence, and pass-specific details.
The process exits non-zero when validation fails or when a stop attempt is rejected.
A rejected stop returns the next enforced inquiry directive instead of allowing silent completion.`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function requireValue(args, index, flag) {
  const value = args[index + 1];
  if (value == null || value.startsWith("--")) throw new Error(`${flag} requires a value.`);
  return value;
}

function parseOptions(args) {
  const options = {
    write: false,
    output: null,
    context: null,
    effects: null,
    provenance: null,
    assessment: null,
    riskAcceptance: null,
    robustnessWaiver: null,
    provenanceFields: {},
    evidenceRefs: []
  };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--write") options.write = true;
    else if (value === "--output") options.output = requireValue(args, index++, value);
    else if (value === "--context") options.context = requireValue(args, index++, value);
    else if (value === "--effects") options.effects = requireValue(args, index++, value);
    else if (value === "--provenance") options.provenance = requireValue(args, index++, value);
    else if (value === "--assessment") options.assessment = requireValue(args, index++, value);
    else if (value === "--risk-acceptance") options.riskAcceptance = requireValue(args, index++, value);
    else if (value === "--robustness-waiver") options.robustnessWaiver = requireValue(args, index++, value);
    else if (value === "--source-type") options.provenanceFields.source_type = requireValue(args, index++, value);
    else if (value === "--source-id") options.provenanceFields.source_id = requireValue(args, index++, value);
    else if (value === "--observed-at") options.provenanceFields.observed_at = requireValue(args, index++, value);
    else if (value === "--reliability") options.provenanceFields.reliability = requireValue(args, index++, value);
    else if (value === "--chain-of-custody") options.provenanceFields.chain_of_custody = requireValue(args, index++, value);
    else if (value === "--evidence-ref") options.evidenceRefs.push(requireValue(args, index++, value));
    else if (value.startsWith("--")) throw new Error(`Unknown option: ${value}`);
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

function mergeAnswerContext(options) {
  const context = options.context ? readJson(options.context) : {};
  if (options.effects) context.effects = { ...(context.effects || {}), ...readJson(options.effects) };
  if (options.provenance) context.provenance = { ...(context.provenance || {}), ...readJson(options.provenance) };
  if (options.assessment) {
    const assessment = readJson(options.assessment);
    context.pass_results = Array.isArray(assessment) ? assessment : (assessment.pass_results || []);
  }
  if (options.riskAcceptance) {
    const records = readJson(options.riskAcceptance);
    context.risk_acceptances = Array.isArray(records) ? records : [records];
  }
  if (options.robustnessWaiver) context.robustness_waiver = readJson(options.robustnessWaiver);

  const hasInlineProvenance = Object.keys(options.provenanceFields).length > 0 || options.evidenceRefs.length > 0;
  if (hasInlineProvenance) {
    context.provenance = {
      ...(context.provenance || {}),
      ...options.provenanceFields,
      evidence_refs: [
        ...new Set([...(context.provenance?.evidence_refs || []), ...options.evidenceRefs])
      ]
    };
  }
  return context;
}

let parsed;
try {
  parsed = parseOptions(process.argv.slice(3));
} catch (error) {
  console.error(error.message);
  usage();
  process.exit(64);
}
const command = process.argv[2];
if (!command) {
  usage();
  process.exit(64);
}
const { options, positional } = parsed;
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
  if (command === "initialize") {
    const result = initializeQuestionGeometryState(state);
    const written = writeState(statePath, result.state, options);
    print({ validation: result.validation, history_integrity: result.state.history_integrity, written });
    process.exit(result.validation.passed ? 0 : 1);
  }

  if (command === "check") {
    const result = validateQuestionGeometry(state);
    print(result);
    process.exit(result.passed ? 0 : 1);
  }

  if (command === "landscape") {
    const validation = validateQuestionGeometry(state);
    if (!validation.passed) {
      print({ validation });
      process.exit(1);
    }
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
    const context = mergeAnswerContext(options);
    const result = applyAnswer(state, questionId, answer, context);
    const written = writeState(statePath, result.state, options);
    print({
      directive: result.directive,
      convergence: result.convergence,
      validation: result.validation,
      committed_event: result.state.history.at(-1),
      history_head_hash: result.state.history_integrity.head_hash,
      written
    });
    process.exit(result.validation.passed ? 0 : 1);
  }

  if (command === "attempt-stop") {
    const validation = validateQuestionGeometry(state);
    if (!validation.passed) {
      print({ allowed: false, validation });
      process.exit(1);
    }
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
      print({ allowed: true, convergence, history_head_hash: state.history_integrity.head_hash, written });
      process.exit(0);
    }

    const continuation = enforceLoop(state);
    const written = writeState(statePath, continuation.state, options);
    print({
      allowed: false,
      convergence,
      next_directive: continuation.directive,
      history_head_hash: continuation.state.history_integrity.head_hash,
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
