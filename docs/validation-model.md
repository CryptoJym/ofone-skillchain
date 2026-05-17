# Validation Model

OfOne validation is two-layered.

```text
parse JSON
-> JSON Schema profile validation
-> semantic graph validation
-> dependency closure
-> gate/release validation
-> computed validator_result
```

The artifact may include `validator_result`, but that field is not trusted as proof. `scripts/ofone-validate.mjs` computes the result. Use `--write` to write the computed result back into the artifact.

## Schema Layer

`schemas/ofone.schema.json` dispatches to the profile that matches `mode`:

- `schemas/ofone.micro.schema.json`
- `schemas/ofone.map.schema.json`
- `schemas/ofone.audit.schema.json`

All profiles share `schemas/ofone.base.schema.json`.

Every profile schema declares `$schema` and `$id`, and the dispatcher must route each valid example to exactly one profile matching its `mode`.

Compiler-state object definitions are closed against accidental field drift where extra fields would weaken validation: evidence, claims, unknowns, criteria, tradeoff surfaces, actors, temporal models, review logs, edges, loops, options, triggers, gates, confidence models, decision renderings, validator results, review cycles, and benchmark traces. Domain-specific extension data should live in adapter extensions, lenses, subscenes, or explicit top-level extension objects rather than unvalidated fields inside core objects.

Dependent field rules bind lifecycle, evidence identity, tradeoff, temporal, and review surfaces:

- `artifact_identity` depends on evidence state.
- `tradeoff_surface` depends on criteria and option moves.
- `temporal_model` depends on evidence.
- `review_log` depends on gates and actors.
- `evidence.content_hash` requires retrieval, extract, owner, and chain-of-custody fields.
- `tradeoff_surface` decision fields require options and criteria.
- `validator_result.diagnostics` requires check summaries.

## Semantic Layer

The semantic validator checks:

- stable IDs and duplicate IDs
- nested subscene parent, frame, and token references
- movement jobs
- adapter contract loading
- hybrid adapter axis count
- high-risk human gates
- evidence support references
- claim support, contradiction, dependency, and confidence basis
- explicit unknown/null objects and the objects they block
- kill-test targets and falsification references
- edge endpoint references and relation legality
- loop type and loop physics
- option preconditions, expected effects, and review gates
- trigger transitions, transition/closure consistency, and dependency closure
- decision rendering dependencies
- artifact identity evidence-hash coverage
- decision criteria and tradeoff-surface references
- temporal evidence validity windows
- information-value entries for rendering-blocking unknowns
- actor ownership for criteria and gates
- hybrid/provisional lens coverage
- council contention and review-log requirements
- recursive review-cycle state and benchmark-trace readiness boundaries

Option `blocking_unknowns` values must reference `unknowns[].unknown_id`. Missing evidence should not remain loose prose once an artifact is schema-bound.

Source material is never trusted as instruction. The validator can accept evidence extracted from public pages, GitHub files, benchmark cases, and model reviews, but the compiler must ignore commands embedded in those sources. Source text can only affect an artifact after it is represented as evidence, claims, unknowns, gates, triggers, review-cycle findings, or rejected findings.

## Mode-Aware Profiles

The base schema defines portable object shapes. Profiles decide how much is required:

- Micro requires the core map plus at least one criterion. Lifecycle, tradeoff, actor, temporal, lens, council, and review fields may be omitted unless the risk or evidence state demands them.
- Map requires artifact identity, criteria, a tradeoff surface, temporal model, edges, loops, option moves, and the core graph. Semantic checks require actors for strategic/normative/hybrid maps, information value for rendering-blocking unknowns, and lens coverage for hybrid/provisional maps.
- Audit requires the full decision-lifecycle layer, including actors, information value, lenses, council result, and review log. Approved gates require corresponding review entries.

## Regression Tests

`npm test` runs validator regression tests against valid examples and generated invalid fixtures from `tests/invalid/fixtures.json`.

Negative coverage includes:

- missing evidence hash
- closed-world evidence object with an extra unmodeled field
- artifact identity evidence-hash mismatch
- illegal edge relation
- disputed-claim option dependency without a review gate
- missing decision-surface dependency from the rendering
- rendering-blocking unknown without information value
- hybrid map with insufficient lens-axis coverage
- criterion owned by a missing actor
- high-risk artifact without gate
- adapter mismatch
- unresolved unknown with no blocked object
- approved Audit gate without review log
- rendering-impacting trigger incorrectly declared as `no_op`

## Relation Legality

Edges are not only strings. Relation legality is checked against endpoint object types, and every edge carries a semantic family: `causal`, `evidential`, `argumentative`, or `workflow_state`. Examples:

- evidence may `support` claims as evidential edges
- claims may `support` claims as argumentative edges
- claims may `contradict` claims
- variables or claims may `cause` variables or claims
- constraints, claims, or gates may `constrain` claims, options, edges, loops, or renderings
- gates or claims may `block` options or renderings
- triggers, evidence, or claims may `update` claims, edges, loops, options, or renderings

## Rendering Closure

`decision_rendering.rendering_id` is a graph node. Any object in `decision_rendering.depends_on` gets a reverse dependency to that rendering node, so trigger closure can show whether the final answer must be patched.
Artifact identity, temporal model, information-value objects, tradeoff surfaces, lenses/council result, review-log entries, review cycles, and benchmark traces also participate in reverse dependency closure when present.

## Recursive Review State

Recursive improvement cycles should not live only in tracker prose. Use optional typed objects when a map or repo review is being iterated:

- `review_cycle`: source review, URL, round, status, accepted findings, rejected findings, unresolved findings, implemented commits, and stop reason.
- `benchmark_trace`: suite ID, cases run, arms run, model-family count, superiority readiness, and diagnostic notes.

`review_cycle.status=implemented` requires implemented commits when accepted findings exist. `review_cycle.status=converged` cannot carry unresolved findings. `benchmark_trace.superiority_ready=true` is invalid until it reports at least 21 cases and at least two model families.

## Nested Scenes And Unknowns

Scenes can contain `subscenes` for local evidence acquisition, causal mechanism work, option decisions, proof steps, stakeholder context, and review gates. This lets a bounded inquiry decompose without creating a separate artifact.

Unknowns are null objects: addressable absences such as missing evidence, missing measurement, unresolved conflict, or unobserved variables. If an unknown blocks an option or rendering, it participates in dependency closure and can force patching or review when resolved.

## Research Lens Integration

Cross-surface and cross-domain research are validated through existing objects rather than a new schema branch:

- research runs live in `scene.subscenes`
- captured reports, URLs, exports, and local code observations live in `evidence`
- accepted conclusions become `claims`
- unresolved access, trend, measurement, or analogy gaps become `unknowns`
- next research actions become `information_value`
- cross-surface and cross-domain reviews live in `lenses` and `council_result`
- any accepted finding that changes the decision creates a `trigger`

This keeps the compiler domain-independent while still making deep research auditable.
