export {
  BEDROCK_TYPES,
  DEFAULT_POLICY,
  QUESTION_TYPES,
  WHY_KINDS,
  aggregatePenalty,
  answerContextQualifies,
  array,
  clamp,
  clone,
  jaccard,
  object,
  policyFor,
  questionFamily,
  sha256Hex,
  stableStringify,
  unique
} from "./question-geometry/util.mjs";

export {
  answerLabels,
  expectedBeliefDisplacement,
  expectedInformationGain,
  fisherRaoDistance,
  normalizeBeliefMap,
  normalizeBeliefs,
  posteriorForAnswer,
  probabilityOfAnswer,
  shannonEntropy
} from "./question-geometry/belief.mjs";

export {
  decisionSnapshot,
  decisionSnapshotForState,
  expectedDecisionGain,
  robustDecisionSnapshot
} from "./question-geometry/decision.mjs";

export { evaluateCausalDepth } from "./question-geometry/causal.mjs";

export {
  applyEffects,
  chainEvent,
  chainGenesis,
  computeStateMetrics,
  normalizeHypothesisBeliefs,
  previewStateAfterAnswer,
  progressBetween,
  unresolvedImpact,
  verifyHistoryChain
} from "./question-geometry/state.mjs";

export { buildQuestionLandscape, scoreQuestion } from "./question-geometry/landscape.mjs";
export { validateQuestionGeometry } from "./question-geometry/validation.mjs";
export { applyAnswer, enforceLoop, evaluateConvergence, synthesizeEscapeQuestion } from "./question-geometry/runtime.mjs";
