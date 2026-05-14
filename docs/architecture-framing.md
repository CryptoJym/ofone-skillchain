# OfOne Architecture: Typed Causal-Geometry Compiler

**Status:** Active architecture
**Category:** Research Methodology + Knowledge Architecture + Decision Compiler
**Last Updated:** 2026-05-14

---

## Summary

OfOne turns a bounded objective into an auditable decision map by compiling domain language into typed causal geometry.

The operating geometry is:

```text
bounded objective
+ geometry primitives
+ adapter projection
+ scene map
+ evidence ledger
+ claim graph
+ causal / constraint graph
+ loop map
+ option moves
+ decision surface
+ update triggers
+ human gates
= decision rendering
```

The internal map is structured state. The final answer is an addressable rendering node derived from that state.

---

## Core Principle

Abstract geometry is primary. Adapters project domain language onto geometry.

This makes OfOne portable across domains without forcing a single domain vocabulary. Medicine, proof search, policy, strategy, engineering, art, and ethics each supply different semantics for evidence, proof, mechanism, uncertainty, value, and review thresholds. The compiler layer remains stable.

---

## Primitive Geometry Layer

| Primitive | Meaning |
|---|---|
| Scene | A bounded state-space snapshot: what exists, what changes, what can be observed. |
| Subscene | A local decomposition of a scene for evidence acquisition, causal mechanism work, option decisions, proof steps, stakeholder context, or review gates. |
| Frame | A coordinate system for interpreting the scene: causal, logical, strategic, normative, temporal, evidential. |
| Token | The smallest typed unit: entity, variable, claim, evidence item, uncertainty, constraint, option, trigger. |
| Unknown | An addressable null object for missing evidence, missing measurement, unresolved conflict, missing adapter, or unobserved variable. |
| Move | A transformation: infer, observe, test, intervene, decide, revise. |
| Edge | A typed relation: causes, constrains, supports, contradicts, enables, observes, evaluates, updates. |
| Loop | A recurrent dependency: feedback, control, learning, incentive, measurement, contradiction, review. |
| Invariant | A constraint or symmetry that survives across frames or reruns. |
| Gate | A condition that blocks movement until evidence, review, permission, or redaction exists. |

---

## Traversal Order

The user-facing chain is a traversal through a typed graph:

```text
0 Charter
-> 1 Geometry Kernel
-> 2 Adapter Projection
-> 3 Scene Map
-> 4 Evidence Ledger
-> 5 Claim Graph
-> 6 Causal / Constraint Graph
-> 7 Loop Map
-> 8 Hypotheses And Kill Tests
-> 9 Option Moves
-> 10 Tradeoff Surface
-> 11 Update / Patch Logic
-> 12 Human Gates
-> 13 Decision Pack
```

The underlying system is a graph with reverse edges. Evidence can invalidate an adapter. A claim conflict can force boundary revision. A kill test can reveal missing observables. A human gate can reclassify stakes. A regime shift can trigger trunk rewrite.

---

## Movement Economy

Every emitted sentence or object must perform at least one job:

| Job | Meaning |
|---|---|
| BOUND | objective, scope, horizon, stake, exclusion |
| GROUND | evidence, provenance, reliability, gap |
| CLAIM | atomic proposition |
| LINK | support, contradiction, causality, dependency, evaluation |
| TEST | hypothesis, kill test, counterfactual, falsifier |
| MOVE | intervention, query, proof step, experiment, reversible action |
| EVALUATE | criteria, tradeoffs, costs, stakes, reversibility |
| WARN | uncertainty, dissent, hidden variable, adversarial risk |
| TRIGGER | no-op, patch, rerun, trunk rewrite, monitor |
| GATE | review, permission, redaction, approval |

The compression rule is simple: delete content that does none of these.

---

## Output Modes

| Mode | Use When | Output |
|---|---|---|
| Micro | quick, lower-stakes decision support | charter, adapter, top claims, decisive uncertainty, recommendation or gate |
| Map | normal OfOne run | geometry chain, evidence, claims, graph, options, triggers |
| Audit | high stakes, handoff, research pack | full schemas, dependencies, dissent, validators, review log |

---

## Layer Boundaries

OfOne separates three layers:

1. **Core IR:** charter, adapter projection, scene, evidence, claims, unknowns, kill tests, edges, loops, option moves, triggers, gates, confidence model, and decision rendering.
2. **Decision lifecycle:** artifact identity, criteria, tradeoff surface, actors, temporal model, information value, lenses, council result, and review log.
3. **Domain extensions:** adapter-specific structures such as proof certificates, measurement protocols, competitor maps, rights-impact records, or failure-mode tables.

A new object belongs in core only if it improves almost every serious decision map. Otherwise it belongs in the decision lifecycle or in an adapter extension.

---

## Adapter Algebra

Adapters are composable. Hybrid domains assign axes to adapters rather than pretending one adapter controls everything.

```text
adapter_mix = {
  strategic: ["incentives", "leverage", "market moves"],
  scientific: ["measurement", "causality", "mechanism"],
  formal: ["rules", "proof", "countermodel"],
  normative: ["stakes", "legitimacy", "plural values"]
}
```

Do not fake numeric precision. State which adapter controls which axes.

---

## Object Model

Minimum object families:

- `ArtifactIdentity`: case ID, objective head, scope hash, config hash, active evidence hashes, created-at marker, lifecycle status.
- `Scene`: scope, state variables, observed variables, hidden variables, horizon.
- `Subscene`: local decomposition of a scene for evidence acquisition, causal mechanism work, option decisions, proof steps, stakeholder context, or review gates.
- `Frame`: frame type, semantics, adapter ownership, assumptions.
- `Token`: entity, variable, evidence, claim, constraint, uncertainty, option, trigger, gate.
- `Evidence`: source, span, provenance, reliability, recency, permission, content hash, retrieval marker, source owner, chain of custody, risks.
- `Claim`: atomic proposition, type, support, contradiction, dependencies, confidence, status.
- `Unknown`: addressable null object for missing evidence, missing measurement, unresolved conflict, missing adapter, or unobserved variable.
- `KillTest`: falsifier, countermodel, measurement test, stakeholder objection, or constraint violation tied to a target object.
- `Criterion`: explicit decision standard, priority, threshold, owner, and movement jobs.
- `TradeoffSurface`: option comparison, criteria basis, dominant option, and reversal conditions.
- `Actor`: decision owner, reviewer, affected party, adversary, authority, incentives, exposure, legitimacy basis.
- `TemporalModel`: decision horizon, deadline, evidence validity windows, staleness triggers, and update cadence.
- `InformationValue`: impact/cost/time/risk-reduction view of which unknown to resolve next.
- `Lens`: constrained review axis with questions, examined claims, blind spots, and contention.
- `CouncilResult`: coverage, missing lenses, dissent, and decision effect.
- `ReviewLog`: auditable gate decision linked to a reviewer actor.
- `Edge`: typed relation between tokens or claims with evidence and confidence.
- `Loop`: recurrent dependency, polarity, delay, gain, control points, observable cues, risk.
- `OptionMove`: action/query/proof/intervention, preconditions, reversibility, risks.
- `Trigger`: condition, affected objects, transition class.
- `Gate`: condition, reviewer, required decision, release status.

Executable artifacts:

- `schemas/ofone.schema.json`: profile dispatcher for Micro, Map, and Audit schemas.
- `schemas/ofone.base.schema.json`: shared object definitions.
- `scripts/ofone-validate.mjs`: JSON Schema plus semantic graph validator and closure reporter.
- `scripts/ofone-test.mjs`: validator regression harness for valid examples and invalid fixtures.
- `scripts/ofone-render.mjs`: decision-native renderer from internal map to Micro, Map, or Audit answer.
- `scripts/ofone-patch.mjs`: patch report helper for dependency closure from changed object IDs.
- `examples/*.json`: strategy, formal proof-search, and hybrid policy examples.

---

## Causal Frame Mechanics

Every Map or Audit run should identify:

- state variables
- observed variables
- hidden variables
- causal or logical edges
- control or query channels
- feedback loops
- constraints and invariants
- regime assumptions
- failure modes
- counterfactuals or kill tests

Loop classes:

- reinforcing
- balancing
- measurement
- incentive
- learning
- contradiction
- review
- deception
- regime

Each loop carries polarity, delay, gain, control points, observable cues, and a named failure mode.

---

## Confidence Basis

Confidence remains ordinal. Each confidence judgment identifies:

- provenance strength
- source independence
- recency
- mechanism fit
- contradiction load
- hidden-variable risk
- adversarial risk
- adapter fit

This avoids fake decimal precision while making the basis inspectable.

---

## Dependency Closure

Updates propagate through typed references:

```text
new evidence
-> affected claims
-> affected edges
-> affected loops
-> affected options
-> affected criteria / tradeoff / temporal / lens / review objects
-> affected decision rendering node
```

Unknowns participate in closure. If `U1` blocks `O1` and `R1`, resolving `U1` is a patch event for the option and the visible rendering.

Boundary, objective, criteria, adapter projection, ontology mapping, or regime changes bypass patching and become scoped reruns or trunk rewrites.

---

## Idempotency

OfOne defines idempotency mechanically:

```text
same objective head
+ same scope hash
+ same config hash
+ same active evidence hashes
+ same active trigger state
= no-op
```

Transition classes:

- `no_op`: identity tuple unchanged.
- `patch`: leaf objects changed inside validated dependency closure.
- `scoped_rerun`: affected subgraph, adapter section, or lens set must be recomputed.
- `trunk_rewrite`: boundary, objective, evaluation criteria, ontology mapping, adapter projection, or regime assumptions changed.
- `human_review`: risk, dissent, provenance, or consequence threshold requires approval.

---

## Human Gates

Human review is required for legal, medical, financial, safety, compliance, public-policy, rights, employment, education, health, money, physical safety, reputation, trunk rewrites, external research packs, high-severity dissent, low-provenance evidence in high-consequence claims, adapter overrides, or audit deletion/backfill.

---

## Validator

Before a decision rendering is final, OfOne runs JSON Schema validation, then semantic graph validation. The artifact may include `validator_result`, but the validator computes pass/fail and can write the computed result back into the artifact.

v0.4 validation also checks artifact identity hashes, criterion ownership, tradeoff-surface references, temporal validity windows, information-value coverage for rendering-blocking unknowns, lens-axis coverage, council contention, review-log coverage for approved Audit gates, and confidence consistency against hidden-variable or contradiction load.

- every emitted item performs a movement-economy job
- evidence, claims, graph, and rendering stay separate
- edge relations are legal for their endpoint object types
- evidence carries stable source identity and custody fields
- subscenes reference valid scene, frame, and token IDs
- unknowns are explicit objects when missing evidence or measurement blocks movement
- kill tests target and falsify existing objects
- strong claims list support, contradiction or gap, confidence basis, and failure mode
- causal edges, hidden variables, loop physics, and regime assumptions are explicit enough for the chosen mode
- options do not hide dependence on disputed claims
- adapter projection fits the domain language
- update triggers and human gates are present
- trigger closure reaches the rendering node when the final answer depends on changed objects
- output size fits the selected mode

---

## Final Framing

```text
OfOne is a typed causal-geometry compiler for high-fidelity decision maps.
```
