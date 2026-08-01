export {
  BEDROCK_TYPES,
  DEFAULT_POLICY,
  PASS_BASIS_TYPES,
  PASS_OUTCOMES,
  PROVENANCE_SOURCE_TYPES,
  QUESTION_TYPES,
  RELIABILITY_LEVELS,
  WHY_KINDS,
  aggregatePenalty,
  array,
  clamp,
  clone,
  isIsoDate,
  isSubstantive,
  jaccard,
  object,
  policyFor,
  questionFamily,
  reliabilityAtLeast,
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
  computeStateMetrics,
  normalizeHypothesisBeliefs,
  previewStateAfterAnswer,
  progressBetween,
  unresolvedImpact
} from "./question-geometry/state.mjs";

export { buildQuestionLandscape, scoreQuestion } from "./question-geometry/landscape.mjs";
export { validateQuestionGeometry } from "./question-geometry/validation.mjs";
export {
  applyAnswer,
  enforceLoop,
  evaluateConvergence,
  initializeQuestionGeometryState,
  selectQuestionByPolicy,
  synthesizeEscapeQuestion
} from "./question-geometry/runtime.mjs";

export {
  HISTORY_PROTOCOL,
  appendAnswerEvent,
  canonicalStringify,
  computeAnswerEventHash,
  historyProtectedState,
  initializeHistoryIntegrity,
  protectedStateHash,
  rebindLastEventStateAfter,
  sha256Tagged,
  validateProvenance,
  verifyHistoryIntegrity
} from "./question-geometry/integrity.mjs";

export {
  PASS_DETAIL_REQUIREMENTS,
  completedPassesFromState,
  passResultFindingsForState,
  validatePassResult
} from "./question-geometry/passes.mjs";

export {
  acceptedResidualIds,
  governanceAsOf,
  governanceFindings,
  validAcceptedRiskRecords,
  validateAcceptedRiskRecord,
  validateRobustnessWaiver
} from "./question-geometry/governance.mjs";

export {
  SELECTION_PROTOCOL,
  computeSelectionHash,
  issueSelectionReceipt,
  refreshCurrentSelectionReceipt,
  validateCommittedSelection,
  validateCurrentSelection
} from "./question-geometry/selection.mjs";
