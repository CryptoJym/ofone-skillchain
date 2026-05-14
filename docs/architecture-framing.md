# OfOne Architecture: Typed Causal-Geometry Compiler

**Status:** Active architecture
**Category:** Research Methodology + Knowledge Architecture + Decision Compiler
**Last Updated:** 2026-05-13

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
+ update triggers
+ human gates
= decision rendering
```

The internal map is structured state. The final answer is a rendering of that state.

---

## Core Principle

Abstract geometry is primary. Adapters project domain language onto geometry.

This makes OfOne portable across domains without forcing a single domain vocabulary. Medicine, proof search, policy, strategy, engineering, art, and ethics each supply different semantics for evidence, proof, mechanism, uncertainty, value, and review thresholds. The compiler layer remains stable.

---

## Primitive Geometry Layer

| Primitive | Meaning |
|---|---|
| Scene | A bounded state-space snapshot: what exists, what changes, what can be observed. |
| Frame | A coordinate system for interpreting the scene: causal, logical, strategic, normative, temporal, evidential. |
| Token | The smallest typed unit: entity, variable, claim, evidence item, uncertainty, constraint, option, trigger. |
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

- `Scene`: scope, state variables, observed variables, hidden variables, horizon.
- `Frame`: frame type, semantics, adapter ownership, assumptions.
- `Token`: entity, variable, evidence, claim, constraint, uncertainty, option, trigger, gate.
- `Evidence`: source, span, provenance, reliability, recency, permission, risks.
- `Claim`: atomic proposition, type, support, contradiction, dependencies, confidence, status.
- `Edge`: typed relation between tokens or claims with evidence and confidence.
- `Loop`: recurrent dependency, feedback direction, observed behavior, risk.
- `OptionMove`: action/query/proof/intervention, preconditions, reversibility, risks.
- `Trigger`: condition, affected objects, transition class.
- `Gate`: condition, reviewer, required decision, release status.

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

Before a decision rendering is final, OfOne checks:

- every emitted item performs a movement-economy job
- evidence, claims, graph, and rendering stay separate
- strong claims list support, contradiction or gap, confidence basis, and failure mode
- causal edges, hidden variables, loops, and regime assumptions are explicit enough for the chosen mode
- options do not hide dependence on disputed claims
- adapter projection fits the domain language
- update triggers and human gates are present
- output size fits the selected mode

---

## Final Framing

```text
OfOne is a typed causal-geometry compiler for high-fidelity decision maps.
```
