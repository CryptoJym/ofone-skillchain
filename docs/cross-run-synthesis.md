# Of One Cross-Run Synthesis

Created: 2026-05-13 13:38 MDT

Inputs:

- `research/results/2026-05-13-01-universal-mappability-audit-result.md`
- `research/results/2026-05-13-02-formal-schema-and-idempotency-result.md`
- `research/results/2026-05-13-03-council-geometry-lens-selection-result.md`
- `research/results/2026-05-13-04-adversarial-edge-case-falsification-result.md`
- `research/results/2026-05-13-05-evaluation-benchmark-design-result.md`
- `research/results/2026-05-13-06-product-architecture-synthesis-result.md`

## Executive Verdict

The six Deep Research runs converge on a strong but narrower claim:

```text
Of One can become a portable domain-questioning and decision-compiler architecture for bounded objectives, as long as it uses a shared kernel plus domain adapters, typed evidence and claim state, constrained analytic lenses, explicit uncertainty, and enforceable human-review gates.
```

The runs do not support the stronger claim that Of One is a literal universal ontology or that one fixed vocabulary natively maps every section of reality. The architecture becomes defensible when "universal" means task-invariant inquiry structure, not universal world substance.

The most important improvement is to make Of One a compiler, not a conversation style:

```text
bounded objective + domain adapter + evidence ledger + claim graph + lens selection + decision criteria + update triggers
= auditable domain map and decision support package
```

## Universally Mappable: Final Interpretation

Of One is universally portable only at three layers:

1. Inquiry layer: every serious domain investigation needs scope, units, observables, relations, constraints, evidence, uncertainty, evaluation criteria, alternatives, and update triggers.
2. Compiler layer: every run can be represented as versioned state, immutable evidence, atomic claims, dependency edges, options, reviews, and audit events.
3. Decision layer: every decision-relevant domain needs tradeoffs, stakes, reversibility, dissent, kill tests, and triggers for when the map must change.

Of One is not universal at the semantic layer. Domains disagree about what counts as evidence, mechanism, intervention, falsification, value, proof, and acceptable uncertainty. Those meanings must come from adapters.

## Repaired Questioning Kernel

Every Of One run should begin with this twelve-part questioning spine:

1. Task and frame: What are we trying to do here: explain, predict, prove, diagnose, decide, intervene, critique, or synthesize?
2. Boundary, resolution, and horizon: What is inside scope, outside scope, too coarse, too fine, current, stale, or future-facing?
3. Units, variables, and participants: What are the relevant entities, variables, actors, artifacts, institutions, states, or abstractions?
4. State space and observables: What can the domain be like, and what can we actually observe or measure?
5. Relations, rules, and generators: What relations, causal links, logical rules, mechanisms, or generative processes shape the domain?
6. Constraints, invariants, and symmetries: What cannot change, what tends to remain stable, and what limits the feasible region?
7. Interventions, queries, and control channels: Where can action, inquiry, leverage, experimentation, or proof search enter the system?
8. Dynamics, path dependence, and regimes: How does the domain evolve over time, and what regime shifts would invalidate the current map?
9. Observation, proof, measurement, and provenance: What evidence exists, where did it come from, how reliable is it, and what does it actually support?
10. Uncertainty, identifiability, and deception: What is unknown, unknowable, ambiguous, confounded, stale, adversarial, or potentially misleading?
11. Evaluation criteria and stakes: What standards decide better or worse, and who or what is exposed to the consequences?
12. Alternatives, tradeoffs, and update triggers: What competing maps, options, objections, kill tests, and feedback events would force revision?

Vocabulary repairs:

- Replace `actor` with `units / entities / variables / participants`; actor is a subtype.
- Split `goal` into analyst task, stakeholder objective, system function, and evaluation criterion.
- Replace `power/control` with intervention surface, query surface, or control channel.
- Split `evidence` into proof, measurement, observation, testimony, simulation, expert judgment, provenance, and confidence.
- Split `value/cost/utility` into evaluation criteria, stakes, and tradeoffs.
- Treat `idempotency` as a compiler/workflow property, not a property of reality.

## Product Architecture

The final architecture should have seven separated layers:

1. World model: entities, variables, states, relations, constraints, mechanisms, dynamics, regimes.
2. Evidence model: raw sources, extraction spans, provenance, freshness, reliability, uncertainty, permission tags.
3. Claim model: atomic typed propositions, support, contradiction, supersession, confidence, dependency closure.
4. Decision model: hypotheses, kill tests, options, preconditions, reversibility, costs, stakes, recommendation deltas.
5. Council model: selected analytic lenses, structured memos, objections, minority reports, contention ledger.
6. Compiler model: objective versions, hashes, no-op/patch/rerun/trunk-rewrite logic, run logs, audit events.
7. Human-review model: approval tasks, dissent signoff, source review, redaction, export controls.

The authoritative store should be a transactional relational database with JSON support plus an append-only raw-evidence object store. Graph, vector, and search stores should be rebuildable projections, not sources of truth.

Run 06 proposes these core services:

- Intake and charter service.
- Objective versioning service.
- Adapter registry service.
- Evidence service.
- Claim compiler service.
- Tree of Knowledge graph service.
- Council Geometry service.
- Hypothesis and kill-test service.
- Option, wedge, and monitoring service.
- Review and export service.
- Audit and observability service.

## Compiler Objects

The durable state model should include:

- `ProjectState`: active objective head, adapter, scope hash, config hash, evidence set hash, trigger state, risk tier, readiness.
- `ObjectiveVersion`: versioned task, decision question, criteria, boundary, resolution, horizon, adapter, regime assumptions.
- `DecisionCharter`: scope, stakeholders, constraints, unknowns, review requirements.
- `DomainAdapter`: domain semantics for evidence, mechanism, intervention, value, uncertainty, falsification, and review.
- `EvidenceItem`: immutable source object with provenance, extraction spans, reliability, freshness, permission tags, and hashes.
- `Claim`: atomic proposition with canonical signature, modality, evidence refs, confidence, uncertainty vector, support and contradiction links.
- `KGNode` and `KGEdge`: typed domain graph separate from claims.
- `CouncilLensMemo`: structured lens output with findings, objections, assumptions, gaps, deltas, certainty, and provenance.
- `Hypothesis` and `KillTest`: competing explanation plus falsifier contract.
- `OptionTradeoff`: candidate path with preconditions, benefits, costs, downsides, reversibility, stakes, and linked claims.
- `MonitorRule` and `TriggerEvent`: machine-evaluable conditions that produce no-op, patch, scoped rerun, trunk rewrite, or human escalation.
- `RunLog` and `AuditEvent`: append-only replay, rollback, and accountability trail.

## Idempotency Rules

Of One should define idempotency mechanically:

```text
same objective head
+ same scope hash
+ same config hash
+ same active evidence hashes
+ same active trigger state
= no-op
```

If evidence or a derived claim changes, the system should compute a reverse-dependency closure and patch only impacted descendants. A patch that crosses into objective, scope, criteria, ontology mapping, adapter choice, or regime assumptions must be reclassified as a scoped rerun or trunk rewrite.

Required transition classes:

- `no_op`: identity tuple unchanged.
- `patch`: leaf objects changed inside validated dependency closure.
- `scoped_rerun`: affected subgraph, adapter section, or lens set must be recomputed.
- `trunk_rewrite`: boundary, objective, evaluation criteria, ontology mapping, adapter, or regime assumptions changed.
- `human_review`: risk, dissent, provenance, or consequence threshold requires approval.

Canonical JSON, JSON Pointer, and JSON Patch should be used for stable object identity and portable patch semantics.

## Council Geometry

Council Geometry survives only if implemented as a constrained selection system, not as role-play.

Product-ready formula:

```text
Council Geometry =
  Basis-12 axis model
  + typed lens registry
  + weighted selector
  + orthogonality control
  + contention ledger
  + patch engine
```

Each lens needs an axis vector, objective function, required inputs, output schema, evidence requirements, default weight, and known failure modes.

Recommended selector:

```text
score = coverage_gain + gap_bonus - redundancy_penalty - evidence_shortfall_penalty - roleplay_penalty
```

The council should stop adding lenses when minimum axis coverage is reached or when another lens does not materially change coverage. Disagreement must remain visible through robust findings, minority reports, conditional recommendations, research queue items, and dissent signoff.

## Domain Adapters

Initial adapters:

1. Strategic-agentic: markets, organizations, procurement, intelligence, operations, policy execution.
2. Scientific-explanatory: biology, climate, physics, medicine, engineering, partially observable natural systems.
3. Formal: mathematics, logic, proof search, formal systems.
4. Normative-evaluative: ethics, public values, art, legitimacy, creative strategy.

Every adapter must define:

- What counts as evidence.
- What counts as mechanism.
- What counts as intervention or query.
- What counts as falsification or proof.
- What counts as uncertainty.
- What value criteria are admissible.
- What review threshold is required.
- What vocabulary is forbidden because it creates ontology drag.

## Human Gates

Do not automate these without human review:

- Legal, medical, financial, safety, compliance, or public-policy recommendations.
- Claims or recommendations affecting rights, employment, education, health, money, physical safety, or reputation.
- Trunk rewrites.
- External research-pack release.
- Resolution of high-severity dissent or minority reports.
- Promotion of low-provenance evidence into a decision-critical claim.
- Adapter override in formal or normative domains.
- Deletion or backfill of audit records.

Human review should be a first-class state machine in the product, not a side ticket.

## Evaluation And Benchmark

The system should not claim superiority until it passes a predeclared benchmark.

Benchmark object: time-locked decision dossiers.

Task set:

- Scoped domain map.
- Causal or evidentiary explanation.
- Decision recommendation.
- Blind-spot and adversarial review.
- Update or patch behavior.

Arms:

- Generic deep-research prompt.
- Of One v1.
- Of One v3.
- Of One v3 plus Council Geometry plus hypothesis/claim ledger.

Scoring dimensions:

- Completeness.
- Causal accuracy.
- Decision relevance.
- Evidence quality.
- Uncertainty calibration.
- Blind-spot detection.
- Strategy usefulness.
- Reproducibility/idempotency.

Co-primary endpoints:

- Map Fidelity: completeness, causal accuracy, blind-spot detection.
- Decision Utility: decision relevance, evidence quality, strategy usefulness.

Guardrails:

- Uncertainty calibration.
- Reproducibility/idempotency.

Minimum evidence threshold:

- Predeclared benchmark spec.
- Frozen prompts and case construction rules.
- At least 21 retrospective cases across seven domains.
- At least two underlying model families.
- At least three repeated runs per arm-case-model cell.
- Blinded expert review with qualified raters.
- Full artifact release sufficient for audit.

## Roadmap

MVP:

- Ship the strategic-agentic adapter first.
- Build intake, objective versioning, evidence ledger, claim ledger, Tree of Knowledge graph, five-lens council, synthesis, hypothesis/kill-test workflow, option matrix, monitoring rules, review tasks, export packs, and audit log.
- Keep humans in the loop for all trunk changes, external exports, and substantive recommendations.
- Prove no-op stability, patch locality, audit replay, and review workflows.

V2:

- Add scientific-explanatory and normative-evaluative adapters.
- Add stronger contention handling, minority-report UX, live freshness monitoring, richer trigger logic, and low-risk leaf-only patch commits.
- Build the full packet-only benchmark harness.

V3:

- Add formal adapter.
- Add scenario simulation for regime-change analysis.
- Add multi-model adjudication for critical steps.
- Add signed provenance on released artifacts.
- Add policy-as-code review gates and search-enabled realism benchmark with frozen retrieval logs.

## Immediate Product Rule

The next implementation or design pass should use this as the north star:

```text
Build Of One as a versioned research compiler with a narrow kernel, explicit adapters, immutable evidence, atomic claims, constrained council lenses, schema-bounded prompts, auditable patches, and enforceable human gates.
```

That version can reveal bounded domains with higher decision fidelity. It should not claim to reveal every section of reality through one universal vocabulary.
