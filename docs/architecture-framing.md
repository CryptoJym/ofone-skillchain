# The Of One Methodology: Domain-Adaptive Inquiry Compiler

**Status:** Reframed after Deep Research validation
**Category:** Research Methodology + Knowledge Architecture + Decision Compiler
**Co-Authors:** James Brady, GPT-5.1, GPT-5.2, GPT-5.5 Pro Deep Research, Claude Opus 4.5, Codex
**Last Updated:** 2026-05-13

---

## Summary

Of One is a domain-adaptive questioning system that turns a bounded objective into an auditable domain map for better decision making.

The corrected framing is:

```text
bounded objective + domain adapter + inquiry kernel + evidence ledger + claim graph + analytic lenses + options + update triggers
= auditable domain map and decision support package
```

Of One should not be framed as a literal universal ontology or as one fixed vocabulary that natively maps every section of reality. The universal part is the repeatable inquiry structure. The domain-specific part is supplied by adapters that define what evidence, mechanism, intervention, value, uncertainty, and falsification mean in that domain.

---

## Core Claim

Of One can be universal only at three layers:

1. **Inquiry layer:** every serious domain investigation needs scope, units, observables, relations, constraints, evidence, uncertainty, evaluation criteria, alternatives, and update triggers.
2. **Compiler layer:** every run can be represented as versioned state, immutable evidence, atomic claims, dependency edges, options, reviews, and audit events.
3. **Decision layer:** every decision-relevant domain needs tradeoffs, stakes, reversibility, dissent, kill tests, and triggers for when the map must change.

Of One is not universal at the semantic layer. Domains disagree about what counts as proof, evidence, mechanism, intervention, falsification, value, and acceptable uncertainty.

---

## The Repaired Questioning Kernel

Every Of One run begins with twelve invariant question dimensions.

| # | Dimension | Core Question |
|---|---|---|
| 1 | Task and frame | Are we explaining, predicting, proving, diagnosing, deciding, intervening, critiquing, or synthesizing? |
| 2 | Boundary, resolution, horizon | What is inside scope, outside scope, too coarse, too fine, current, stale, or future-facing? |
| 3 | Units, variables, participants | What entities, variables, actors, artifacts, institutions, states, or abstractions matter? |
| 4 | State space and observables | What can the domain be like, and what can we actually observe or measure? |
| 5 | Relations, rules, generators | What relations, causal links, logical rules, mechanisms, or generative processes shape the domain? |
| 6 | Constraints, invariants, symmetries | What cannot change, tends to remain stable, or limits the feasible region? |
| 7 | Interventions, queries, control channels | Where can action, inquiry, leverage, experimentation, or proof search enter the system? |
| 8 | Dynamics, path dependence, regimes | How does the domain evolve, and what regime shifts would invalidate the map? |
| 9 | Observation, proof, measurement, provenance | What evidence exists, where did it come from, and what does it actually support? |
| 10 | Uncertainty, identifiability, deception | What is unknown, unknowable, ambiguous, confounded, stale, adversarial, or misleading? |
| 11 | Evaluation criteria and stakes | What standards decide better or worse, and who or what is exposed to consequences? |
| 12 | Alternatives, tradeoffs, update triggers | What competing maps, options, objections, kill tests, and feedback events would force revision? |

---

## Vocabulary Repairs

The original vocabulary was useful but too narrow. The revised architecture uses broader primitives.

| Old Term | Repaired Primitive | Reason |
|---|---|---|
| Actor | Units / entities / variables / participants | Formal, physical, biological, and normative domains are not always agentic. |
| Goal | Analyst task / stakeholder objective / system function / evaluation criterion | Goals are not one thing. |
| Power / control | Intervention surface / query surface / control channel | Some domains are investigated, proved, or measured rather than controlled. |
| Evidence | Proof / measurement / observation / testimony / simulation / expert judgment / provenance / confidence | Evidence semantics differ by domain. |
| Value / cost / utility | Evaluation criteria / stakes / tradeoffs | Normative and strategic domains need plural criteria. |
| Idempotency | Compiler/workflow property | The world is not idempotent; a bounded research workflow can be. |

---

## Product Architecture

Of One should be implemented as a versioned research compiler with seven separated layers.

1. **World model:** entities, variables, states, relations, constraints, mechanisms, dynamics, regimes.
2. **Evidence model:** raw sources, extraction spans, provenance, freshness, reliability, uncertainty, permission tags.
3. **Claim model:** atomic typed propositions, support, contradiction, supersession, confidence, dependency closure.
4. **Decision model:** hypotheses, kill tests, options, preconditions, reversibility, costs, stakes, recommendation deltas.
5. **Council model:** selected analytic lenses, structured memos, objections, minority reports, contention ledger.
6. **Compiler model:** objective versions, hashes, no-op/patch/rerun/trunk-rewrite logic, run logs, audit events.
7. **Human-review model:** approval tasks, dissent signoff, source review, redaction, export controls.

Authoritative truth should live in a transactional relational store with JSON support plus an append-only raw-evidence object store. Graph, vector, and search stores should be rebuildable projections.

---

## Skillchain Geometry

The executable shape of Of One is a single chain of linked skills:

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

Each stage must emit:

- current object state
- evidence or explicit evidence gap
- uncertainty and dissent
- next dependency
- human-review flag when needed

The chain is geometric because every stage maps the domain along an axis and constrains the next stage. The output is not a flat answer. It is an auditable map of relationships, constraints, options, and update conditions.

---

## Domain Adapters

Initial adapters:

1. **Strategic-agentic:** markets, organizations, procurement, intelligence, operations, policy execution.
2. **Scientific-explanatory:** biology, climate, physics, medicine, engineering, partially observable natural systems.
3. **Formal:** mathematics, logic, proof search, formal systems.
4. **Normative-evaluative:** ethics, public values, art, legitimacy, creative strategy.

Each adapter must define:

- what counts as evidence
- what counts as mechanism
- what counts as intervention or query
- what counts as falsification or proof
- what counts as uncertainty
- what value criteria are admissible
- what review threshold is required
- what vocabulary is forbidden because it creates ontology drag

---

## Idempotency

Of One should define idempotency mechanically:

```text
same objective head
+ same scope hash
+ same config hash
+ same active evidence hashes
+ same active trigger state
= no-op
```

If evidence or a derived claim changes, the system computes a reverse-dependency closure and patches only impacted descendants. A patch that crosses objective, scope, criteria, ontology mapping, adapter choice, or regime assumptions must become a scoped rerun or trunk rewrite.

Transition classes:

- `no_op`: identity tuple unchanged.
- `patch`: leaf objects changed inside validated dependency closure.
- `scoped_rerun`: affected subgraph, adapter section, or lens set must be recomputed.
- `trunk_rewrite`: boundary, objective, evaluation criteria, ontology mapping, adapter, or regime assumptions changed.
- `human_review`: risk, dissent, provenance, or consequence threshold requires approval.

---

## Human Gates

Do not automate these without human review:

- legal, medical, financial, safety, compliance, or public-policy recommendations
- claims or recommendations affecting rights, employment, education, health, money, physical safety, or reputation
- trunk rewrites
- external research-pack release
- resolution of high-severity dissent or minority reports
- promotion of low-provenance evidence into a decision-critical claim
- adapter override in formal or normative domains
- deletion or backfill of audit records

Human review is part of the architecture, not a separate administrative step.

---

## Benchmark Standard

Of One should not claim superiority until benchmarked against alternatives.

Minimum standard:

- predeclared benchmark spec
- frozen prompts and case construction rules
- at least 21 retrospective cases across seven domains
- at least two model families
- at least three repeated runs per arm-case-model cell
- blinded expert review
- full artifact release sufficient for audit

Score on:

- completeness
- causal accuracy
- decision relevance
- evidence quality
- uncertainty calibration
- blind-spot detection
- strategy usefulness
- reproducibility / idempotency

---

## Final Framing

Use this public positioning:

```text
Of One is a domain-adaptive inquiry compiler for high-fidelity decision maps.
```

Use this operational rule:

```text
Build Of One as a versioned research compiler with a narrow kernel, explicit adapters, immutable evidence, atomic claims, constrained council lenses, schema-bounded prompts, auditable patches, and enforceable human gates.
```

Avoid this claim:

```text
Of One is a universal ontology that can reveal any domain through one fixed vocabulary.
```
