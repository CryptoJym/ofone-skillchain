import {
  PASS_BASIS_TYPES,
  PASS_OUTCOMES,
  array,
  isSubstantive,
  object,
  reliabilityAtLeast,
  unique
} from "./util.mjs";
import { validateProvenance } from "./integrity.mjs";

export const PASS_DETAIL_REQUIREMENTS = {
  frame_challenge: ["tested_assumption", "alternative_frame", "result"],
  model_expansion: ["surprise_test", "candidate_model_class", "result"],
  adversarial: ["actor_or_attack_surface", "distortion_test", "result"],
  source_independence: ["sources_examined", "dependency_result", "result"],
  stopping_counterexample: ["reversal_condition", "cheapest_safe_test", "result"]
};

const BASIS_SOURCE_TYPES = {
  evidence: ["human", "human_review", "tool", "file", "url", "observation", "simulation", "benchmark_oracle", "test_fixture"],
  counterfactual: ["tool", "observation", "simulation", "benchmark_oracle", "test_fixture"],
  intervention: ["human", "tool", "observation", "simulation", "benchmark_oracle", "test_fixture"],
  formal_proof: ["human_review", "tool", "file", "agent_inference", "test_fixture"],
  independent_review: ["human", "human_review", "file", "url", "test_fixture"],
  human_judgment: ["human", "human_review"]
};

function detailIsSubstantive(value) {
  if (Array.isArray(value)) return value.length > 0 && value.every((item) => isSubstantive(item, 3));
  return isSubstantive(value, 8);
}

export function validatePassResult(resultInput, question, answer, provenance, objectId = null) {
  const result = object(resultInput);
  const findings = [];
  const add = (code, message) => findings.push({ severity: "error", code, message, object_id: objectId });
  const passId = result.pass_id;

  if (!String(passId || "").trim()) add("QG_PASS_ID", "Pass result requires pass_id.");
  if (!array(question?.pass_tags).includes(passId)) {
    add("QG_PASS_TAG_BINDING", "Pass result is not bound to a pass_tag declared by the selected question.");
  }
  if (!PASS_OUTCOMES.includes(result.outcome)) add("QG_PASS_OUTCOME", "Pass result requires a supported outcome.");
  if (!PASS_BASIS_TYPES.includes(result.basis)) add("QG_PASS_BASIS", "Pass result requires a supported evidential basis.");
  if (!isSubstantive(result.rationale, 24)) add("QG_PASS_RATIONALE", "Pass result requires a substantive rationale, not a label or placeholder.");

  const evidenceRefs = unique([...array(provenance?.evidence_refs), ...array(result.evidence_refs)]);
  if (evidenceRefs.length === 0) add("QG_PASS_EVIDENCE", "Pass result requires evidence references.");
  findings.push(...validateProvenance(provenance, objectId));

  const condition = object(question?.pass_conditions?.[passId]);
  if (result.outcome === "satisfied") {
    if (array(condition.qualifying_answers).length > 0 && !array(condition.qualifying_answers).includes(answer)) {
      add("QG_PASS_ANSWER_NOT_QUALIFYING", `Answer ${answer} is not a qualifying answer for ${passId}.`);
    }
    const minimumReliability = condition.minimum_reliability || "medium";
    if (!reliabilityAtLeast(provenance?.reliability, minimumReliability)) {
      add("QG_PASS_RELIABILITY", `Pass ${passId} requires at least ${minimumReliability} provenance reliability.`);
    }
    const allowedSources = BASIS_SOURCE_TYPES[result.basis] || [];
    if (!allowedSources.includes(provenance?.source_type)) {
      add(
        "QG_PASS_SOURCE_BASIS",
        `Source type ${provenance?.source_type || "missing"} cannot satisfy a pass with basis ${result.basis}.`
      );
    }
    if (provenance?.source_type === "agent_inference"
      && result.basis === "formal_proof"
      && !String(provenance?.content_hash || "").trim()) {
      add("QG_PASS_INFERENCE_ARTIFACT", "Agent-inference formal proof requires a content_hash for the proof artifact.");
    }
    for (const field of PASS_DETAIL_REQUIREMENTS[passId] || []) {
      const value = object(result.details)[field];
      if (!detailIsSubstantive(value)) {
        add("QG_PASS_DETAIL", `Satisfied ${passId} pass requires substantive details.${field}.`);
      }
    }
  }

  return {
    passed: !findings.some((finding) => finding.severity === "error"),
    findings,
    evidence_refs: evidenceRefs
  };
}

export function passResultFindingsForState(state) {
  const questionIndex = new Map(array(state.questions).map((question) => [question.question_id, question]));
  const findings = [];
  for (const event of array(state.history)) {
    const question = questionIndex.get(event.question_id);
    const seen = new Set();
    for (const result of array(event.pass_results)) {
      if (seen.has(result.pass_id)) {
        findings.push({ severity: "error", code: "QG_PASS_DUPLICATE", message: "An answer event cannot report the same pass twice.", object_id: event.event_id });
      }
      seen.add(result.pass_id);
      findings.push(...validatePassResult(result, question, event.answer, event.provenance, event.event_id).findings);
    }
    for (const passId of array(question?.pass_tags).filter((value) => value !== "causal_depth")) {
      if (!array(event.pass_results).some((result) => result.pass_id === passId)) {
        findings.push({
          severity: "warning",
          code: "QG_PASS_UNQUALIFIED",
          message: `Answered question carries ${passId}, but no answer-qualified pass result was committed. The pass remains incomplete.`,
          object_id: event.event_id
        });
      }
    }
  }
  return findings;
}

export function completedPassesFromState(state, causalResult) {
  const questionIndex = new Map(array(state.questions).map((question) => [question.question_id, question]));
  const passes = new Set();
  for (const event of array(state.history)) {
    const question = questionIndex.get(event.question_id);
    for (const result of array(event.pass_results)) {
      const validation = validatePassResult(result, question, event.answer, event.provenance, event.event_id);
      if (result.outcome === "satisfied" && validation.passed) passes.add(result.pass_id);
    }
  }
  if (causalResult.passed && causalResult.material_targets > 0) passes.add("causal_depth");
  return passes;
}
