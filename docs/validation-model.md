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

## Semantic Layer

The semantic validator checks:

- stable IDs and duplicate IDs
- movement jobs
- adapter contract loading
- hybrid adapter axis count
- high-risk human gates
- evidence support references
- claim support, contradiction, dependency, and confidence basis
- edge endpoint references and relation legality
- loop type and loop physics
- option preconditions, expected effects, and review gates
- trigger transitions and dependency closure
- decision rendering dependencies

## Relation Legality

Edges are not only strings. Relation legality is checked against endpoint object types. Examples:

- evidence or claims may `support` claims
- claims may `contradict` claims
- variables or claims may `cause` variables or claims
- constraints, claims, or gates may `constrain` claims, options, edges, loops, or renderings
- gates or claims may `block` options or renderings
- triggers, evidence, or claims may `update` claims, edges, loops, options, or renderings

## Rendering Closure

`decision_rendering.rendering_id` is a graph node. Any object in `decision_rendering.depends_on` gets a reverse dependency to that rendering node, so trigger closure can show whether the final answer must be patched.
