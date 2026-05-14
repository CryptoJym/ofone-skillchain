# Dependency Closure

OfOne updates propagate through typed object references.

```text
new evidence
-> affected claims
-> affected edges
-> affected loops
-> affected options
-> affected decision rendering
```

Transition classes:

- `no_op`: identity tuple unchanged.
- `patch`: leaf objects changed inside validated dependency closure.
- `scoped_rerun`: affected subgraph, adapter section, or lens set must be recomputed.
- `trunk_rewrite`: boundary, objective, criteria, adapter projection, ontology mapping, or regime assumption changed.
- `human_review`: risk, dissent, provenance, or consequence threshold requires approval.

The validator reports dependency closure for each trigger in an artifact.
