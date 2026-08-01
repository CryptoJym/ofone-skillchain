import { createHash } from "node:crypto";

export const EPSILON = 1e-9;

export function sha256Hex(text) {
  return createHash("sha256").update(text).digest("hex");
}

export const QUESTION_TYPES = [
  "causal_why", "contrastive_why", "mechanism", "evidence", "discriminating",
  "model_expansion", "counterfactual", "intervention", "calibration",
  "frame_challenge", "source_independence", "adversarial", "unlock", "safety",
  "stopping_counterexample", "other"
];

export const WHY_KINDS = [
  "cause", "mechanism", "reason_or_motive", "purpose_or_function",
  "justification", "constitutive_or_definition", "enabling_condition",
  "constraint", "historical_origin"
];

export const BEDROCK_TYPES = [
  "decision_sufficient", "observable_mechanism", "controllable_root_cause",
  "invariant_or_law", "axiom_or_definition", "value_commitment",
  "authority_boundary", "irreducible_stochasticity",
  "inaccessible_or_unidentifiable", "frame_boundary", "accepted_residual_risk"
];

export const DEFAULT_POLICY = {
  scoring_mode: "multi_objective",
  weights: {
    decision_gain: 1.35,
    information_gain: 1,
    belief_displacement: 0.55,
    causal_discrimination: 0.95,
    model_expansion: 0.9,
    unlock_value: 0.85,
    robustness_gain: 0.9,
    actionability: 0.65,
    novelty: 0.5,
    lookahead_value: 0.85,
    exploration_bonus: 0.4,
    cost: 0.7,
    risk: 0.9,
    delay: 0.45,
    redundancy: 0.8
  },
  thresholds: {
    minimum_net_question_value: 0.08,
    high_impact_unknown: 0.65,
    minimum_decision_robustness: 0.7,
    maximum_residual_evpi: 0.12,
    maximum_redundancy: 0.82,
    minimum_material_progress: 0.025,
    local_plateau_width: 0.03
  },
  required_passes: [
    "causal_depth", "frame_challenge", "model_expansion", "adversarial",
    "source_independence", "stopping_counterexample"
  ],
  stall_window: 3,
  max_iterations_before_human_review: 40,
  exploration_rate: 0.12,
  lookahead_depth: 1,
  current_question_id: null
};

export function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function clamp(value, min = 0, max = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

export function array(value) {
  return Array.isArray(value) ? value : [];
}

export function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function unique(values) {
  return [...new Set(array(values).filter((value) => value != null))];
}

export function normalizedText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return new Set(normalizedText(value).split(" ").filter(Boolean));
}

export function jaccard(leftValue, rightValue) {
  const left = tokens(leftValue);
  const right = tokens(rightValue);
  if (left.size === 0 && right.size === 0) return 1;
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

export function policyFor(state) {
  const supplied = object(state?.policy);
  return {
    ...DEFAULT_POLICY,
    ...supplied,
    weights: { ...DEFAULT_POLICY.weights, ...object(supplied.weights) },
    thresholds: { ...DEFAULT_POLICY.thresholds, ...object(supplied.thresholds) },
    required_passes: unique(supplied.required_passes || DEFAULT_POLICY.required_passes)
  };
}

export function aggregatePenalty(values) {
  const numbers = Object.values(object(values)).map((value) => clamp(value));
  return numbers.length === 0 ? 0 : Math.max(...numbers);
}

export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

export function answerContextQualifies(context) {
  const ctx = object(context);
  return String(ctx.provenance || "").trim().length > 0
    && String(ctx.finding || "").trim().length > 0
    && ctx.qualifies !== false;
}

export function questionFamily(type) {
  if (["causal_why", "contrastive_why", "mechanism", "counterfactual", "intervention"].includes(type)) return "causal";
  if (["model_expansion", "frame_challenge"].includes(type)) return "model";
  if (["evidence", "calibration", "source_independence"].includes(type)) return "epistemic";
  if (["adversarial", "safety", "stopping_counterexample"].includes(type)) return "challenge";
  if (["unlock", "discriminating"].includes(type)) return "navigation";
  return "other";
}
