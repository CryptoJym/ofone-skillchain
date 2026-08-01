# OfOne 0.7.0 — Question Geometry Engine

## Release intent

This release implements the missing navigator around OfOne's typed decision map. It does not replace the 0.6 IR; it adds a linked, machine-checked inquiry sidecar and appends its runtime protocol to the installed OfOne skill.

## Added

- Question Geometry JSON Schema
- adaptive question landscape and scoring library
- expected information gain and expected decision value
- expected value of perfect information convergence guard
- Fisher–Rao belief-state displacement
- heuristic, probabilistic, and robust/minimax-regret modes
- one-step answer-conditioned lookahead
- Pareto frontier, dominance exclusions, local maxima, local minima, and plateaus
- typed causal-depth traversal with contrastive why edges
- circularity, tautology, mono-causal-risk, and bedrock validation
- mandatory frame, model-expansion, adversarial, source-independence, and reversal probes
- forced escape/reframe questions after low-yield stalls
- stop-attempt rejection with next-directive generation
- interactive hidden-state benchmark scaffold
- standalone and bundled skill protocol

## Compatibility

Existing Micro, Map, and Audit schemas are unchanged. Question Geometry examples live under `examples/question-geometry/` so the legacy `examples/*.json` validation path remains isolated.

## Validation performed during implementation

- JavaScript syntax checks for all new runtime scripts
- JSON Schema Draft 2020-12 meta-validation with Python `jsonschema`
- example validation against the new schema
- ten semantic/runtime regression tests
- end-to-end simulated loop from active state to convergence
- interactive benchmark smoke-test generation

## Nonclaims

This release does not claim globally optimal inquiry, guaranteed discovery of unknown unknowns, exact universal Blackwell ordering, or empirical superiority. Those claims remain behind the expanded interactive benchmark program.
