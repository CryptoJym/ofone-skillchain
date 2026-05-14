# Adapter Contracts

Adapters project domain language onto primitive geometry. In v0.3 they are also executable contracts in `lib/adapter-contracts.mjs`.

Each contract defines:

- allowed evidence sources
- allowed claim types
- expected confidence-basis fields
- required gate triggers
- typical hidden-variable prompts
- valid kill tests

## Adapter Families

| Adapter | Use For | Common Hidden Variables |
|---|---|---|
| `strategic-agentic` | markets, organizations, operations, policy execution | incentives, constraints, agency, adversarial response, switching costs |
| `scientific-explanatory` | biology, climate, physics, medicine, engineering | measurement error, confounders, selection bias, regime shift, unobserved mechanism |
| `formal` | math, logic, proof search, formal systems | axiom mismatch, unproved lemma, countermodel, decidability boundary, solver timeout |
| `normative-evaluative` | ethics, legitimacy, art, contested values | stakeholder legitimacy, rights exposure, distributional harm, dissent, contested criteria |
| `hybrid` | mixed domains | adapter mismatch, criteria conflict, cross-domain translation error, regime shift |
| `provisional` | domains that do not fit known adapters | wrong ontology, missing primitive, misclassified evidence, unstable criteria |

Hybrid adapters must expose at least two axes in `adapter_projection.axes`. Provisional adapters should carry an adapter-review gate when the projection controls consequential recommendations.

## Why Contracts Matter

The contract prevents adapter projection from becoming decorative. It lets validation ask whether an artifact used plausible evidence types, claim types, confidence bases, gates, and kill tests for the selected domain semantics.
