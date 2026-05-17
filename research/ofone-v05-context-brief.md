# OfOne v0.5 Recursive Review Context Brief

Date prepared: 2026-05-17
Prepared for: ChatGPT Deep Research Pro recursive review run 02

## Current Public Targets

- Public repository: https://github.com/CryptoJym/ofone-skillchain
- Public GitHub Pages site: https://cryptojym.github.io/ofone-skillchain/
- Current commit for review: `18c9bc2b5a5c514ab58d537937732827d5aa038f`
- Package version: `0.4.0`

## Project Identity

OfOne is a typed causal-geometry compiler for turning bounded objectives into auditable decision maps.

The intended strategic center is not "prompt framework." The intended center is a decision-state intermediate representation:

```text
source/context
-> typed inquiry state
-> validated graph
-> decision surface
-> human rendering
-> patchable lifecycle
```

The repo currently divides responsibility as follows:

- `SKILL.md` = agent protocol and compile-loop discipline.
- `schemas/*.json` = type/profile layer for Micro, Map, and Audit artifacts.
- `lib/ofone-graph.mjs` = graph indexing, reverse dependencies, semantic layers, and closure.
- `lib/adapter-contracts.mjs` = domain semantic contract layer.
- `scripts/ofone-validate.mjs` = JSON Schema plus semantic validation.
- `scripts/ofone-render.mjs` = human-facing projection.
- `scripts/ofone-patch.mjs` = dependency-closure and semantic patch helper.
- `scripts/ofone-benchmark.mjs` = benchmark manifest checker.
- `scripts/ofone-schema-check.mjs` = schema/profile compatibility checker.
- `examples/*.json` = concrete artifacts.
- `tests/invalid/fixtures.json` = negative fixtures.
- `benchmarks/` = empirical validation scaffold.

## Current Implemented Capabilities

The current public repo includes:

- Ajv-backed JSON Schema validation.
- Profile schemas for Micro, Map, and Audit artifacts.
- Closed compiler-state object definitions for major IR objects.
- Artifact-first compile-loop instructions in the skill.
- Computed validator diagnostics with stable diagnostic codes.
- Semantic edge relation families: causal, evidential, argumentative, workflow_state.
- Relation-family and endpoint legality checks.
- Adapter contracts for strategic, scientific, formal, normative, hybrid, and provisional adapters.
- Decision-lifecycle objects: artifact identity, criteria, tradeoff surface, actors, temporal model, information value, lenses, council result, and review log.
- Unknown/null objects for missing evidence or unresolved blockers.
- Nested scenes/subscenes.
- Loop physics fields: polarity, delay, gain, control points, observable cues.
- Decision-native render modes: Executive, Analyst, Audit, and PatchImpact.
- Semantic patch operations for evidence, confidence, criteria, gates, re-review, artifact supersession, actor reassignment, and trigger activation/deactivation.
- Benchmark suite manifest with direct-answer, light-structured, and full-OfOne arms.
- Negative regression fixtures covering invalid hashes, illegal edge relations, disputed option dependencies, missing rendering dependencies, unresolved unknowns, lens coverage, actor gates, adapter mismatches, review logs, and closed-world drift.

## Recent Integration History Since Run 01

Run 01 recommended that OfOne should harden the existing compiler behavior rather than expand the ontology prematurely. Local implementation passes integrated:

1. Artifact-first compile-loop skill updates and structured validator diagnostics.
2. Explicit semantic relation families for graph edges.
3. Decision-native renderer modes.
4. Semantic patch workflow operations.
5. Executable three-arm benchmark suite manifest.
6. Schema compatibility checks and closed-world/dependent-field tightening.

Recent commits:

- `18c9bc2 Add schema compatibility checks`
- `bda4f25 Add executable benchmark suite`
- `ab2b47f Add semantic patch workflow`
- `bfbe662 Add decision-native render modes`
- `e3fe28d Add semantic edge families`
- `a518ab3 Harden OfOne compiler diagnostics`
- `5065da3 Add v0.4 decision lifecycle surface`

## Local Verification Snapshot

The following commands passed locally after the latest implementation pass:

```bash
npm run schema:check
npm run validate
npm run benchmark
npm test
```

The public Pages site was also checked and contains references to `npm run schema:check`, `npm run benchmark`, semantic patch workflow, and v0.4 decision surface.

## Known Caveat From Run 01

Run 01 reported that it could read the attached context brief but could not directly fetch the public repo/docs. For Run 02, please explicitly state:

- whether you could inspect the public GitHub repo;
- whether you could inspect the public GitHub Pages site;
- which files or URLs you actually read;
- which repo observations came only from this attached brief.

Treat public repo/pages inspection as more authoritative than this brief. Treat this brief as local launch context and changelog, not proof that every implementation is correct.

## Current Strategic Question

We are running a recursive improvement loop:

```text
Deep Research critique
-> local backlog synthesis
-> implementation and verification
-> public commit/pages update
-> new Deep Research critique
-> repeat until no high-value actionable recommendations remain
```

Your task is to determine the next useful iteration after the current public state.

The desired review should avoid generic praise or ontology expansion. It should answer:

- What should be fixed now?
- What should be improved next?
- What should be deferred to avoid ontology sprawl?
- What would count as convergence or "no more high-value recommendations"?
- What specific repo changes, tests, benchmark cases, or docs would materially improve OfOne?

## Evaluation Bias

Favor recommendations that improve:

- correctness;
- validation enforceability;
- graph/dependency semantics;
- decision usefulness;
- patchability;
- benchmark credibility;
- agent execution reliability;
- user-facing renderer clarity;
- convergence criteria.

Deprioritize recommendations that merely add vocabulary, fields, or grand architecture language without a clear invariant, state transition, validation rule, renderer affordance, benchmark gain, or workflow improvement.
