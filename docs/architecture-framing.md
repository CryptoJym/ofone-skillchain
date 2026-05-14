# The Of One Methodology: Domain-Adaptive Inquiry Compiler

**Status:** Active architecture
**Category:** Research Methodology + Knowledge Architecture + Decision Compiler
**Co-Authors:** James Brady, GPT-5.1, GPT-5.2, GPT-5.5 Pro Deep Research, Claude Opus 4.5, Codex
**Last Updated:** 2026-05-13

---

## Summary

Of One turns a bounded objective into an auditable domain map for decision making.

The operating geometry is:

```text
bounded objective + domain adapter + inquiry kernel + evidence ledger + claim graph + analytic lenses + options + update triggers
= auditable domain map and decision support package
```

The inquiry geometry is portable. Domain meaning comes from adapters that define evidence, mechanism, intervention, value, uncertainty, proof, and review thresholds for the domain being mapped.

---

## Core Claim

Of One is portable across domains at three layers:

1. **Inquiry layer:** every serious investigation needs scope, units, observables, relations, constraints, evidence, uncertainty, evaluation criteria, alternatives, and update triggers.
2. **Compiler layer:** every run can be represented as versioned state, immutable evidence, atomic claims, dependency edges, options, reviews, and audit events.
3. **Decision layer:** every decision-relevant domain needs tradeoffs, stakes, reversibility, dissent, kill tests, and triggers for when the map must change.

Adapters supply the domain semantics. They determine what counts as proof, measurement, mechanism, intervention, falsification, acceptable uncertainty, and admissible value criteria.

---

## The Inquiry Kernel

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

## Domain Primitives

The architecture uses domain-adaptive primitives rather than fixed human-centered terms.

| Primitive | Scope |
|---|---|
| Units / entities / variables / participants | People, organizations, artifacts, formal objects, biological entities, physical states, institutions, abstractions. |
| Task / objective / function / criterion | Analyst task, stakeholder objective, system function, evaluation standard, proof target, or design constraint. |
| Intervention / query / control channel | Action, measurement, experiment, proof search, leverage point, policy lever, or inquiry path. |
| Evidence semantics | Proof, measurement, observation, testimony, simulation, expert judgment, provenance, confidence. |
| Evaluation semantics | Criteria, stakes, tradeoffs, plural values, reversibility, exposure, consequences. |
| Compiler semantics | Objective versions, evidence hashes, dependency closures, no-op, patch, scoped rerun, trunk rewrite. |

---

## Product Architecture

Of One is implemented as a versioned research compiler with seven separated layers.

1. **World model:** entities, variables, states, relations, constraints, mechanisms, dynamics, regimes.
2. **Evidence model:** raw sources, extraction spans, provenance, freshness, reliability, uncertainty, permission tags.
3. **Claim model:** atomic typed propositions, support, contradiction, supersession, confidence, dependency closure.
4. **Decision model:** hypotheses, kill tests, options, preconditions, reversibility, costs, stakes, recommendation deltas.
5. **Council model:** selected analytic lenses, structured memos, objections, minority reports, contention ledger.
6. **Compiler model:** objective versions, hashes, no-op/patch/rerun/trunk-rewrite logic, run logs, audit events.
7. **Human-review model:** approval tasks, dissent signoff, source review, redaction, export controls.

Authoritative truth lives in a transactional relational store with JSON support plus an append-only raw-evidence object store. Graph, vector, and search stores are rebuildable projections.

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

Each stage emits:

- object state
- evidence refs or explicit evidence gap
- uncertainty and dissent
- next dependency
- human-review flag when needed

The chain is geometric because every stage maps the domain along an axis and constrains the next stage. The output is an auditable map of relationships, constraints, options, and update conditions.

---

## Domain Adapters

Initial adapters:

1. **Strategic-agentic:** markets, organizations, procurement, intelligence, operations, policy execution.
2. **Scientific-explanatory:** biology, climate, physics, medicine, engineering, partially observable natural systems.
3. **Formal:** mathematics, logic, proof search, formal systems.
4. **Normative-evaluative:** ethics, public values, art, legitimacy, creative strategy.

Each adapter defines:

- evidence semantics
- mechanism semantics
- intervention or query semantics
- falsification or proof semantics
- uncertainty semantics
- admissible evaluation criteria
- human-review thresholds
- vocabulary that should be translated into domain-native terms

---

## Idempotency

Of One defines idempotency mechanically:

```text
same objective head
+ same scope hash
+ same config hash
+ same active evidence hashes
+ same active trigger state
= no-op
```

If evidence or a derived claim changes, the system computes a reverse-dependency closure and patches only impacted descendants. A patch that crosses objective, scope, criteria, ontology mapping, adapter choice, or regime assumptions becomes a scoped rerun or trunk rewrite.

Transition classes:

- `no_op`: identity tuple unchanged.
- `patch`: leaf objects changed inside validated dependency closure.
- `scoped_rerun`: affected subgraph, adapter section, or lens set must be recomputed.
- `trunk_rewrite`: boundary, objective, evaluation criteria, ontology mapping, adapter, or regime assumptions changed.
- `human_review`: risk, dissent, provenance, or consequence threshold requires approval.

---

## Human Gates

Human review is required for:

- legal, medical, financial, safety, compliance, or public-policy recommendations
- claims or recommendations affecting rights, employment, education, health, money, physical safety, or reputation
- trunk rewrites
- external research-pack release
- resolution of high-severity dissent or minority reports
- promotion of low-provenance evidence into a decision-critical claim
- adapter overrides in formal or normative domains
- deletion or backfill of audit records

Human review is part of the architecture.

---

## Benchmark Standard

Of One earns superiority claims through benchmarked performance.

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
