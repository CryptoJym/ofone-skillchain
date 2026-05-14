---
name: ofone
description: Use when mapping a bounded domain, uncovering decision-relevant structure, stress-testing understanding, or turning evidence into an auditable domain map
---

# OfOne

## Overview

OfOne is a typed causal-geometry compiler for decision maps. It turns a bounded objective into structured objects: scenes, frames, tokens, edges, loops, claims, options, triggers, and gates.

Core principle: abstract geometry is primary. Adapters project domain language onto geometry. Answers are renderings of the map, not the map itself.

## When To Use

Use for:

- complex or unfamiliar domains where structure must be revealed before action
- strategy, research, diagnosis, proof-search, policy, product, operational, scientific, formal, or creative domains
- decisions needing evidence, uncertainty, dissent, causal loops, update conditions, and human gates
- reruns where new evidence may require no-op, patch, scoped rerun, trunk rewrite, or review

Do not use for casual explanations, low-stakes direct answers, or high-stakes advice without human review.

## Output Modes

Pick the smallest mode that preserves safety:

| Mode | Use When | Required Output |
|---|---|---|
| Micro | quick answer, low-to-medium stakes | charter, adapter, top claims, decisive uncertainty, recommendation or gate |
| Map | normal OfOne use | geometry chain, evidence, claims, graph, options, triggers |
| Audit | high stakes, research pack, handoff | full schemas, evidence ledger, dependencies, dissent, validators, review log |

Even in Micro mode, include adapter, evidence status, claim basis, update trigger, and human gate if relevant.

## Movement Economy

Every emitted sentence or object must earn its place by doing at least one job:

| Job | Meaning |
|---|---|
| BOUND | define objective, scope, horizon, stake, or exclusion |
| GROUND | cite evidence, provenance, reliability, or explicit gap |
| CLAIM | state an atomic proposition |
| LINK | connect objects with support, contradiction, causality, dependency, or evaluation |
| TEST | define hypothesis, kill test, counterfactual, or falsifier |
| MOVE | define intervention, query, proof step, experiment, or reversible action |
| EVALUATE | compare criteria, tradeoffs, costs, stakes, or reversibility |
| WARN | surface uncertainty, dissent, failure mode, adversarial risk, or hidden variable |
| TRIGGER | define no-op, patch, rerun, trunk rewrite, or monitoring condition |
| GATE | require human review, permission, redaction, or approval |

Delete sentences that do none of these.

## Primitive Geometry

Map all domains through these primitives before rendering domain language:

| Primitive | Meaning |
|---|---|
| Scene | bounded state-space snapshot: what exists, changes, and can be observed |
| Frame | coordinate system for interpreting the scene: causal, logical, strategic, normative, temporal, evidential |
| Token | smallest typed unit: entity, variable, claim, evidence item, uncertainty, constraint, option, trigger |
| Move | transformation: infer, observe, test, intervene, decide, revise |
| Edge | typed relation: causes, constrains, supports, contradicts, enables, observes, evaluates, updates |
| Loop | recurrent dependency: feedback, control, learning, incentive, measurement, contradiction, review |
| Invariant | constraint or symmetry that survives across frames or reruns |
| Gate | condition that blocks movement until evidence, review, permission, or redaction exists |

Adapters translate domain terms into these primitives.

## Traversal Order

Use this as the default traversal, while allowing loops and reverse edges when evidence changes the map:

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

Reverse edges are mandatory when:

- evidence contradicts a claim
- claim conflict changes an option
- missing observables weaken the scene map
- adapter mismatch changes semantics
- loop behavior changes causal interpretation
- high-stakes exposure triggers review
- regime change rewrites scope or assumptions

## Adapter Projection

Pick or compose adapters before rendering claims.

| Adapter | Use For | Defines |
|---|---|---|
| Strategic-agentic | markets, organizations, operations, policy execution | incentives, agency, leverage, constraints, risk |
| Scientific-explanatory | biology, climate, physics, medicine, engineering | measurement, mechanism, causality, uncertainty |
| Formal | math, logic, proof search, formal systems | axioms, inference, proof, countermodel, decidability |
| Normative-evaluative | ethics, legitimacy, art, contested values | plural criteria, stakes, dissent, review threshold |

Hybrid domains use adapter algebra:

```text
adapter_mix = {strategic: axes, scientific: axes, formal: axes, normative: axes}
```

Do not fake numeric precision. State which adapter controls which axes.

Each adapter is an executable contract. It defines allowed evidence sources, allowed claim types, confidence-basis expectations, typical hidden variables, required gate triggers, relation constraints, and valid kill tests. If a domain does not fit an adapter cleanly, use `provisional` and add a human gate for adapter override.

## Kernel Questions

Ask only at the resolution needed for the chosen mode.

1. Task and frame: explain, predict, prove, diagnose, decide, intervene, critique, or synthesize?
2. Boundary, resolution, horizon: what is in scope, out of scope, too coarse, too fine, current, stale, or future-facing?
3. Units, variables, participants: what tokens matter?
4. State space and observables: what can the scene be like, and what can be observed?
5. Relations, rules, generators: what edges shape the scene?
6. Constraints, invariants, symmetries: what limits movement or survives reruns?
7. Interventions, queries, control channels: what moves are possible?
8. Dynamics, path dependence, regimes: what loops or regime shifts matter?
9. Observation, proof, measurement, provenance: what grounds each claim?
10. Uncertainty, identifiability, deception: what is unknown, confounded, stale, adversarial, or misleading?
11. Evaluation criteria and stakes: what surfaces define better or worse?
12. Alternatives, tradeoffs, update triggers: what options, objections, kill tests, and triggers force revision?

## Minimal Schemas

Use stable IDs. Keep evidence, claims, graph objects, and renderings separate.

In the repo, validate Map and Audit artifacts with:

```bash
npm run validate
```

The executable schemas live at `schemas/ofone.*.schema.json`; `schemas/ofone.schema.json` dispatches to Micro, Map, or Audit profiles. The validator runs JSON Schema first, then semantic graph validation in `scripts/ofone-validate.mjs`.

```json
{
  "evidence_id": "E1",
  "source": "file|url|observation|testimony|simulation|tool",
  "span_or_locator": "string",
  "provenance": "string",
  "recency": "current|dated|unknown",
  "reliability": "low|medium|high",
  "permission": "internal|public|restricted",
  "content_hash": "sha256:...",
  "retrieved_at": "ISO-like timestamp or retrieval marker",
  "extract": "short source span or summary",
  "source_owner": "publisher, local owner, tool, or witness",
  "chain_of_custody": "how the source entered the artifact",
  "supports": ["C1"],
  "risks": ["stale", "selection_bias"]
}
```

```json
{
  "claim_id": "C1",
  "text": "atomic proposition",
  "type": "descriptive|causal|predictive|normative|formal|operational",
  "supports": ["E1"],
  "contradicts": ["C2"],
  "depends_on": ["A1"],
  "confidence": {
    "level": "low|medium|high",
    "basis": ["provenance", "independence", "recency", "mechanism_fit"],
    "failure_modes": ["confounding", "staleness"]
  },
  "status": "active|disputed|superseded|killed",
  "review_gate": false
}
```

```json
{
  "edge_id": "X1",
  "from": "token_or_claim_id",
  "to": "token_or_claim_id",
  "relation": "causes|constrains|supports|contradicts|enables|observes|evaluates|updates|blocks|depends_on",
  "evidence_refs": ["E1"],
  "confidence": "low|medium|high"
}
```

```json
{
  "loop_id": "L1",
  "type": "reinforcing|balancing|measurement|incentive|learning|contradiction|review|deception|regime",
  "edges": ["X1"],
  "polarity": "reinforcing|balancing|mixed|unknown",
  "delay": "short|medium|long|unknown",
  "gain": "low|medium|high|unknown",
  "control_points": ["decision gate, test, metric, or intervention"],
  "observable_cues": ["what would show the loop is active"],
  "failure_mode": "how the loop misleads or fails"
}
```

```json
{
  "trigger_id": "T1",
  "condition": "new_evidence|claim_conflict|regime_shift|scope_change|review_required",
  "affected_objects": ["C1", "O1"],
  "transition": "no_op|patch|scoped_rerun|trunk_rewrite|human_review"
}
```

```json
{
  "rendering_id": "R1",
  "summary": "short current map state",
  "recommendation": "decision rendering, not the internal map",
  "confidence": "low|medium|high",
  "depends_on": ["C1", "O1"],
  "movement_jobs": ["EVALUATE", "MOVE", "GATE"]
}
```

## Causal Frame Mechanics

Every Map or Audit output should include:

- state variables
- observed variables
- hidden variables
- causal or logical edges
- constraints and invariants
- feedback loops
- control or query channels
- regime assumptions
- failure modes
- counterfactuals or kill tests

Loop types: reinforcing, balancing, measurement, incentive, learning, contradiction, review, deception, regime. Every loop needs polarity, delay, gain, control points, observable cues, and a failure mode.

Confidence is ordinal, not fake-precise. State the basis across provenance strength, source independence, recency, mechanism fit, contradiction load, hidden-variable risk, adversarial risk, and adapter fit.

Dependency closure must be computable: new evidence points to affected claims, affected claims point to affected edges and loops, and affected loops/options point to the addressable decision rendering node.

## Execution Contract

Before recommending action:

1. State mode, charter, and adapter projection.
2. Build the scene map using geometry primitives.
3. Separate evidence, claims, graph, and rendering.
4. Convert important findings into atomic claims.
5. Build causal / constraint graph and loop map.
6. Select only lenses that add axis coverage or reduce named uncertainty.
7. Preserve dissent and minority reports.
8. Produce option moves with tradeoffs, preconditions, reversibility, and blocking unknowns.
9. Classify future changes as no-op, patch, scoped rerun, trunk rewrite, or human review.
10. Render the decision pack from the internal map.

## Idempotency Rule

```text
same objective head + same scope hash + same config hash + same active evidence hashes + same active trigger state = no-op
```

New evidence patches only the affected dependency closure. Boundary, objective, criteria, ontology mapping, adapter projection, or regime changes require scoped rerun or trunk rewrite.

## Human Gates

Require human review for legal, medical, financial, safety, compliance, public-policy, rights, employment, education, health, money, physical safety, reputation, trunk rewrites, external research-pack release, high-severity dissent, low-provenance evidence in high-consequence claims, adapter override, or audit deletion/backfill.

## Validator

Before final output, run the validator or answer these checks. The artifact may carry `validator_result`, but the validator computes pass/fail rather than trusting self-attestation.

- Did JSON Schema validation pass for the selected Micro, Map, or Audit profile?
- Did every sentence or object perform BOUND, GROUND, CLAIM, LINK, TEST, MOVE, EVALUATE, WARN, TRIGGER, or GATE?
- Are evidence, claims, domain graph, and final rendering separate?
- Are edge relations legal for their endpoint object types?
- Do evidence objects carry stable identity fields and source custody?
- Does each strong claim list support, contradiction or gaps, confidence basis, and failure mode?
- Are causal edges, hidden variables, loop physics, and regime assumptions explicit enough for the chosen mode?
- Does any option depend on a disputed claim?
- Did adapter projection distort the domain language?
- Are update triggers and human gates present?
- Does trigger dependency closure reach the rendering when the final answer depends on the changed object?
- Is the answer smaller than the map when the user only needs a rendering?

## Output Template

```markdown
# OfOne Decision Map

## Mode And Charter
Mode, objective, scope, horizon, stakes, review gates.

## Geometry And Adapter Projection
Scene, frames, tokens, adapter mix, translated domain semantics.

## Evidence And Claims
Evidence ledger summary, atomic claims, confidence, contradictions, gaps.

## Causal / Constraint / Loop Map
Edges, constraints, hidden variables, feedback loops, regime assumptions.

## Hypotheses And Kill Tests
Competing hypotheses, falsifiers, counterfactuals, blocking unknowns.

## Option Moves And Tradeoff Surface
Moves, preconditions, reversibility, risks, criteria, stakeholder exposure.

## Update / Patch Logic
No-op, patch, scoped rerun, trunk rewrite, human-review triggers.

## Decision Rendering
Recommendation if justified, confidence, dissent, gates, next evidence.

## Validator
Pass/fail checks with fixes or caveats.
```
