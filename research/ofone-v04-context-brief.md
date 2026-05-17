# OfOne v0.4 Context Brief For Deep Research

Prepared: 2026-05-17

## Public Repo

- Repo: https://github.com/CryptoJym/ofone-skillchain
- Pages: https://cryptojym.github.io/ofone-skillchain/
- Commit: `5065da3808475f77cf242802fcdccc68c616d0ea`
- Version: `0.4.0`

## Current Shape

OfOne is a typed causal-geometry compiler for turning bounded objectives into auditable decision maps.

The core idea is that abstract geometry is primary and adapters project domain language onto that geometry. The system aims to move from answer generation to auditable, typed, patchable decision state.

The v0.4 release freezes the core inquiry IR and adds a decision-lifecycle layer:

- `artifact_identity`
- `criteria`
- `tradeoff_surface`
- `actors`
- `temporal_model`
- `information_value`
- `lenses`
- `council_result`
- `review_log`

## Toolchain

- `SKILL.md`: agent protocol.
- `schemas/*.json`: profile-dispatched Micro, Map, Audit schemas.
- `scripts/ofone-validate.mjs`: Ajv-backed JSON Schema validation plus semantic graph checks.
- `lib/ofone-graph.mjs`: object indexing and dependency closure.
- `lib/adapter-contracts.mjs`: adapter semantics for strategic, scientific, formal, normative, hybrid, provisional.
- `scripts/ofone-render.mjs`: human-readable Micro, Map, Audit renderer.
- `scripts/ofone-patch.mjs`: dependency closure patch analyzer.
- `scripts/ofone-test.mjs`: valid-example and invalid-fixture regression harness.
- `examples/*.json`: strategy, formal proof, hybrid policy, and source-backed wastewater examples.
- `benchmarks/`: benchmark scaffold and rubric.

## Validation Coverage Now Present

The validator checks JSON Schema first, then semantic graph checks for IDs, references, relation legality, adapter contracts, loop physics, gates, trigger transitions, dependency closure, subscenes, unknown/null objects, kill-test references, artifact identity hashes, criterion ownership, tradeoff-surface dependencies, temporal evidence windows, information value for blocking unknowns, lens coverage, and Audit review logs.

Negative fixtures include:

- missing evidence hash
- artifact identity hash mismatch
- illegal edge relation
- disputed option dependency without gate
- missing decision-surface rendering dependency
- rendering-blocking unknown without information value
- hybrid map with insufficient lens-axis coverage
- criterion owned by missing actor
- high-risk artifact without gate
- adapter mismatch
- unresolved unknown with no blocked object
- approved Audit gate without review log

## Proposed Local Research-Lens Extension

Uncommitted local notes propose that research tools should remain outside the core IR.

Cross-surface research and cross-domain transfer should be represented through existing objects:

- research runs as `scene.subscenes`
- captured reports, URLs, exports, and local code observations as `evidence`
- accepted conclusions as `claims`
- unresolved access, trend, measurement, or analogy gaps as `unknowns`
- next research actions as `information_value`
- cross-surface and cross-domain reviews as `lenses` / `council_result`
- accepted findings that change the decision as `triggers`

This should be reviewed as proposed architecture, not as released public repo state.

## What We Need From The Research Run

1. External due diligence on whether OfOne’s IR and decision-lifecycle architecture aligns with durable patterns from knowledge representation, argumentation frameworks, causal modeling, decision analysis, evidence grading, benchmark design, and compiler/static-analysis practice.
2. Concrete improvements to the OfOne skill and toolchain, ranked by value and implementation cost.
3. Whether the research-lens extension should be kept as lenses/subscenes or promoted into first-class schema objects.
4. A v0.5 roadmap with acceptance criteria, tests, examples, and benchmark work.
5. Warnings about ontology sprawl, false universality, reliability failure modes, and usability barriers.
