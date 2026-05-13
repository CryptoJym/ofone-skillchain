---
name: ofone
description: Use when mapping a bounded domain, uncovering decision-relevant structure, stress-testing understanding, or turning evidence into an auditable domain map
---

# OfOne

## Overview

OfOne is a domain-adaptive inquiry compiler. It turns a bounded objective into an auditable decision map through adapters, evidence, claims, analytic lenses, options, triggers, and human review gates.

Core rule: do not use OfOne as a universal ontology. The universal part is the inquiry geometry; domain semantics come from adapters.

## When To Use

Use for:

- unfamiliar domains where the agent must reveal structure before recommending action
- strategy, research, diagnosis, proof-search, policy, product, operational, or creative domains
- decisions needing evidence, uncertainty, dissent, and update conditions
- reruns where new evidence may require no-op, patch, scoped rerun, or trunk rewrite

Do not use for:

- casual explanations where no decision, map, or audit trail is needed
- high-stakes advice without human review
- claims of full domain understanding without evidence

## Pressure Mode

If the user asks for a quick, compact, or "just give me the answer" result, still keep the chain intact. Use one or two bullets per stage, but do not omit adapter, evidence, claims, update logic, or human gates.

If the user asks for the old eight-part frame, treat it as legacy vocabulary. Say the repaired OfOne uses the twelve-axis kernel because the old actor/goal language breaks in formal, scientific, and normative domains.

Do not start external research just to apply the skill unless the user asks for live/current due diligence or the host system requires verification. Use provided evidence, mark missing evidence explicitly, and keep moving.

## Skillchain Geometry

Run the chain in order:

```text
0 Charter
-> 1 Adapter
-> 2 Kernel Map
-> 3 Evidence Ledger
-> 4 Claim Graph
-> 5 Domain Graph
-> 6 Council Geometry
-> 7 Hypotheses And Kill Tests
-> 8 Options And Tradeoffs
-> 9 Update Logic
-> 10 Decision Pack
```

Every stage emits: object state, evidence refs or gaps, uncertainty, dissent, next dependency, and human-review flag.

## Quick Reference

| Stage | Purpose | Output |
|---|---|---|
| Charter | Bound the objective | task, decision question, scope, horizon, stakes |
| Adapter | Translate semantics | domain family, evidence rules, proof rules, forbidden vocabulary |
| Kernel Map | Ask the invariant questions | twelve-axis domain map |
| Evidence Ledger | Ground the map | sources, spans, reliability, freshness, permissions |
| Claim Graph | Atomize what is known | claims, support, contradiction, confidence |
| Domain Graph | Model the domain | units, states, relations, constraints, mechanisms, regimes |
| Council Geometry | Select analytic lenses | lens memos, objections, minority reports, contention |
| Hypotheses | Test explanations | competing hypotheses, kill tests, blocking unknowns |
| Options | Support decisions | tradeoffs, preconditions, reversibility, risks |
| Update Logic | Control reruns | no-op, patch, scoped rerun, trunk rewrite, human review |
| Decision Pack | Export result | map, evidence, claims, options, dissent, triggers, audit notes |

## Adapter Families

Pick the closest adapter before asking kernel questions.

| Adapter | Use For | Semantics To Define |
|---|---|---|
| Strategic-agentic | markets, organizations, operations, policy execution | incentives, actors, leverage, constraints, risk |
| Scientific-explanatory | biology, climate, physics, medicine, engineering | measurement, mechanism, causality, uncertainty |
| Formal | math, logic, proof search, formal systems | axioms, inference, proof, countermodel, decidability |
| Normative-evaluative | ethics, legitimacy, art, contested values | value pluralism, stakes, dissent, review threshold |

If no adapter fits, state the mismatch and create a provisional adapter before continuing.

## Repaired Kernel Questions

Ask all twelve. Keep domain-native wording from the adapter.

1. Task and frame: explain, predict, prove, diagnose, decide, intervene, critique, or synthesize?
2. Boundary, resolution, horizon: what is in scope, out of scope, too coarse, too fine, current, stale, or future-facing?
3. Units, variables, participants: what entities, variables, actors, artifacts, states, or abstractions matter?
4. State space and observables: what can the domain be like, and what can be observed or measured?
5. Relations, rules, generators: what causal links, logical rules, mechanisms, or generative processes shape it?
6. Constraints, invariants, symmetries: what limits the feasible region or remains stable?
7. Interventions, queries, control channels: where can action, inquiry, experimentation, or proof search enter?
8. Dynamics, path dependence, regimes: how does it evolve, and what regime shifts invalidate the map?
9. Observation, proof, measurement, provenance: what evidence exists, where did it come from, and what does it support?
10. Uncertainty, identifiability, deception: what is unknown, confounded, stale, adversarial, or misleading?
11. Evaluation criteria and stakes: what standards decide better or worse, and who bears consequences?
12. Alternatives, tradeoffs, update triggers: what rival maps, options, objections, kill tests, or feedback events force revision?

## Execution Contract

Before recommending action:

1. State the charter and adapter.
2. Produce the twelve-axis kernel map.
3. Separate evidence from assumptions.
4. Convert important findings into atomic claims.
5. Build a domain graph separate from the claim graph.
6. Select only lenses that add axis coverage or reduce a named uncertainty.
7. Preserve dissent and minority reports.
8. Produce options with tradeoffs, preconditions, reversibility, and blocking unknowns.
9. Classify future changes as no-op, patch, scoped rerun, trunk rewrite, or human review.
10. Export a decision pack with evidence, uncertainty, dissent, and update triggers.

## Idempotency Rule

Use this no-op test:

```text
same objective head + same scope hash + same config hash + same active evidence hashes + same active trigger state = no-op
```

New evidence should patch only the affected dependency closure. Boundary, objective, criteria, ontology, adapter, or regime changes require scoped rerun or trunk rewrite.

## Human Review Gates

Stop and require human review for:

- legal, medical, financial, safety, compliance, or public-policy recommendations
- effects on rights, employment, education, health, money, physical safety, or reputation
- trunk rewrites
- external research-pack release
- high-severity dissent or unresolved expert disagreement
- low-provenance evidence used in a high-consequence claim
- adapter overrides in formal or normative domains
- deletion or backfill of audit records

## Output Template

```markdown
# OfOne Decision Map

## Charter
Objective, scope, horizon, stakes, review gates.

## Adapter
Domain family, semantic rules, forbidden vocabulary.

## Kernel Map
Twelve dimensions with evidence or gaps.

## Evidence Ledger
Sources, spans, reliability, freshness, permission limits.

## Claim Graph
Atomic claims, support, contradiction, confidence, open disputes.

## Domain Graph
Units, states, relations, mechanisms, constraints, regimes.

## Council Geometry
Selected lenses, why each was selected, dissent, minority reports.

## Options
Tradeoffs, preconditions, reversibility, risks, blocking unknowns.

## Update Logic
No-op/patch/rerun/trunk-rewrite triggers.

## Decision Pack
Recommendation if justified, confidence, human gates, next evidence.
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Calling OfOne a universal ontology | Say it is a portable inquiry compiler with adapters. |
| Collapsing back to the old eight-piece frame | Use the twelve-axis kernel; legacy terms are aliases only. |
| Forcing actor/goal language into formal or scientific domains | Use units, variables, proof objects, mechanisms, or observables. |
| Producing a fluent recommendation before evidence | Build the evidence ledger and claim graph first. |
| Treating council lenses as expert role-play | Use lens contracts, axis coverage, redundancy checks, and contention. |
| Hiding uncertainty in prose | Surface uncertainty, dissent, and blocking unknowns explicitly. |
| Rerunning everything on small changes | Use no-op and patch rules before scoped reruns or trunk rewrites. |
