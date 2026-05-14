export const ADAPTER_CONTRACTS = {
  "strategic-agentic": {
    allowedEvidenceSources: ["file", "url", "observation", "testimony", "simulation", "tool"],
    allowedClaimTypes: ["descriptive", "causal", "predictive", "operational", "normative"],
    confidenceBasis: ["provenance", "independence", "recency", "mechanism_fit", "contradiction_load", "hidden_variable_risk", "adversarial_risk", "adapter_fit"],
    requiredGateTriggers: ["financial", "compliance", "employment", "reputation", "public-policy", "money"],
    hiddenVariablePrompts: ["incentives", "constraints", "agency", "adversarial response", "switching costs"],
    validKillTests: ["counterparty refusal", "unit economics failure", "constraint violation", "adversarial move"]
  },
  "scientific-explanatory": {
    allowedEvidenceSources: ["file", "url", "observation", "simulation", "tool"],
    allowedClaimTypes: ["descriptive", "causal", "predictive", "operational"],
    confidenceBasis: ["provenance", "independence", "recency", "mechanism_fit", "contradiction_load", "hidden_variable_risk", "adapter_fit"],
    requiredGateTriggers: ["medical", "health", "safety", "physical safety", "compliance"],
    hiddenVariablePrompts: ["measurement error", "confounders", "selection bias", "regime shift", "unobserved mechanism"],
    validKillTests: ["failed replication", "counterexample observation", "measurement invalidation", "mechanism mismatch"]
  },
  formal: {
    allowedEvidenceSources: ["file", "tool", "simulation", "observation"],
    allowedClaimTypes: ["formal", "descriptive", "operational"],
    confidenceBasis: ["provenance", "mechanism_fit", "contradiction_load", "adapter_fit"],
    requiredGateTriggers: ["external research-pack release"],
    hiddenVariablePrompts: ["axiom mismatch", "unproved lemma", "countermodel", "decidability boundary", "solver timeout"],
    validKillTests: ["countermodel", "failed proof obligation", "axiom inconsistency", "inference-rule mismatch"]
  },
  "normative-evaluative": {
    allowedEvidenceSources: ["file", "url", "observation", "testimony", "tool"],
    allowedClaimTypes: ["normative", "descriptive", "operational", "predictive"],
    confidenceBasis: ["provenance", "independence", "recency", "contradiction_load", "hidden_variable_risk", "adversarial_risk", "adapter_fit"],
    requiredGateTriggers: ["rights", "public-policy", "education", "employment", "reputation", "high-severity dissent"],
    hiddenVariablePrompts: ["stakeholder legitimacy", "rights exposure", "distributional harm", "dissent", "contested criteria"],
    validKillTests: ["rights conflict", "stakeholder objection", "criterion reversal", "legitimacy failure"]
  },
  hybrid: {
    allowedEvidenceSources: ["file", "url", "observation", "testimony", "simulation", "tool"],
    allowedClaimTypes: ["descriptive", "causal", "predictive", "normative", "formal", "operational"],
    confidenceBasis: ["provenance", "independence", "recency", "mechanism_fit", "contradiction_load", "hidden_variable_risk", "adversarial_risk", "adapter_fit"],
    requiredGateTriggers: ["legal", "medical", "financial", "safety", "compliance", "public-policy", "rights", "employment", "education", "health", "money", "physical safety", "reputation"],
    hiddenVariablePrompts: ["adapter mismatch", "criteria conflict", "cross-domain translation error", "regime shift", "unobserved stakeholder"],
    validKillTests: ["adapter conflict", "source contradiction", "gate escalation", "regime shift"]
  },
  provisional: {
    allowedEvidenceSources: ["file", "url", "observation", "testimony", "simulation", "tool"],
    allowedClaimTypes: ["descriptive", "causal", "predictive", "normative", "formal", "operational"],
    confidenceBasis: ["provenance", "independence", "recency", "mechanism_fit", "contradiction_load", "hidden_variable_risk", "adversarial_risk", "adapter_fit"],
    requiredGateTriggers: ["adapter override", "high-severity dissent", "external research-pack release"],
    hiddenVariablePrompts: ["wrong ontology", "missing primitive", "misclassified evidence", "unstable criteria", "adapter drift"],
    validKillTests: ["failed projection", "unmapped primitive", "persistent contradiction", "human adapter override"]
  }
};

export function adapterContract(adapterName) {
  return ADAPTER_CONTRACTS[adapterName];
}
