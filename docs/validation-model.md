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
- trigger transitions and dependency closure
- decision rendering dependencies

Option `blocking_unknowns` values must reference `unknowns[].unknown_id`. Missing evidence should not remain loose prose once an artifact is schema-bound.

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

## Nested Scenes And Unknowns

Scenes can contain `subscenes` for local evidence acquisition, causal mechanism work, option decisions, proof steps, stakeholder context, and review gates. This lets a bounded inquiry decompose without creating a separate artifact.

Unknowns are null objects: addressable absences such as missing evidence, missing measurement, unresolved conflict, or unobserved variables. If an unknown blocks an option or rendering, it participates in dependency closure and can force patching or review when resolved.
