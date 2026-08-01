# Causal-Depth Traversal: The Typed Why Operator

## Purpose

Causal-depth traversal formalizes the useful process commonly associated with “Five Whys” while removing the arbitrary number and the false assumption that every explanation is a single linear root-cause chain.

The operator asks an effective why, tests the resulting explanatory link, and continues until the active frame reaches justified decision-sufficient bedrock or exposes a reason to reframe.

## 1. Why Is Not One Relation

The question “Why P?” is incomplete. It can request:

| Why kind | What it seeks |
|---|---|
| cause | an event or condition that changed the probability of P |
| mechanism | the process by which a cause produces P |
| reason or motive | an agent’s deliberative basis |
| purpose or function | the role P serves in a system |
| justification | a reason P should be believed or permitted |
| constitutive or definition | what makes P count as P |
| enabling condition | what made P possible without producing it alone |
| constraint | what prevented alternatives to P |
| historical origin | the path by which the present structure arose |

Confusing these creates category errors. A motive is not automatically a cause, a function is not historical origin, and a justification is not evidence that a mechanism occurred.

## 2. Contrastive Form

Every traversal edge must state:

> Why P rather than Q?

The contrast determines relevance. “Why did conversion decline rather than remain stable?” and “Why did conversion decline here rather than in another segment?” can produce different valid explanations.

## 3. Graph, Not Ritual Chain

A material effect may have:

- multiple sufficient causes;
- jointly necessary causes;
- enabling conditions;
- feedback loops;
- delayed causes;
- common causes;
- selection effects;
- and causes at different scales.

The data structure therefore uses nodes and typed links. A validator warns when no alternative cause has been considered and rejects circular or tautological descent.

## 4. Required Link Contract

Each link records:

```json
{
  "link_id": "CL1",
  "from_node": "effect",
  "to_node": "candidate_explanation",
  "why_kind": "mechanism",
  "contrast": "P rather than Q",
  "confidence": 0.7,
  "evidence_refs": ["E1"],
  "counterfactual_test": "what would differ if the explanation were absent",
  "intervention_test": "what manipulation should change the effect",
  "alternatives_considered": ["another cause"],
  "status": "hypothesized"
}
```

Causal, mechanism, enabling-condition, and constraint links require a counterfactual or intervention test.

## 5. Bedrock Is Frame-Relative

The traversal never claims final metaphysical explanation. It terminates for the active inquiry at one of these typed boundaries:

- `decision_sufficient`
- `observable_mechanism`
- `controllable_root_cause`
- `invariant_or_law`
- `axiom_or_definition`
- `value_commitment`
- `authority_boundary`
- `irreducible_stochasticity`
- `inaccessible_or_unidentifiable`
- `frame_boundary`
- `accepted_residual_risk`

A bedrock object must include:

- `frame_relative: true`;
- a stopping justification;
- and a reopening condition.

## 6. Bedrock Test

For a material target, stop descending only when all applicable conditions hold:

1. The current node is typed.
2. The explanatory link is not tautological.
3. The relation matches the requested why kind.
4. Evidence or an explicit hypothesis status exists.
5. Causal claims carry a counterfactual or intervention test.
6. Credible alternatives have been considered.
7. Further descent has lower expected decision value than its cost/risk, or crosses a declared boundary.
8. A condition exists that would reopen inquiry.

## 7. Failure Modes

The validator and runtime are designed to expose:

- **arbitrary depth:** stopping because the count reached five;
- **infinite regress:** continuing without a decision or frame criterion;
- **circularity:** P because Q and Q because P;
- **tautology:** restating P using near-synonyms;
- **mono-causal compression:** hiding interacting causes in one narrative;
- **level switching:** moving between individual, organizational, and systemic explanations without declaring a frame change;
- **teleology:** treating purpose as efficient cause;
- **motive substitution:** treating stated reason as actual mechanism;
- **correlation substitution:** treating prediction as intervention evidence;
- **root-cause theater:** selecting the most controllable cause rather than the best-supported one;
- **bedrock laundering:** calling an inaccessible unknown a resolved root cause.

## 8. Relationship to the Question Landscape

A why question is one operator family within the larger geometry. It should be selected when causal depth has decision value, not applied mechanically to every token.

A causal why can be a local maximum when it sharply discriminates interventions. It can be a local minimum when the current evidence cannot identify causes, in which case a measurement, source-lineage, or frame question may be the correct next move.
