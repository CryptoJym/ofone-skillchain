# Dependency Closure

OfOne updates propagate through typed object references. The decision rendering is an addressable graph node, not just prose, so closure can prove when the visible answer is affected.

```text
new evidence
-> affected claims
-> affected edges
-> affected loops
-> affected options
-> affected decision rendering (`rendering_id`)
```

The validator builds reverse dependencies from evidence support, claim dependencies and contradictions, edge endpoints, loop edge membership, option preconditions/effects, trigger affected objects, gate references, and `decision_rendering.depends_on`.
It also includes subscene membership, explicit unknown/null objects that block options or renderings, and kill tests that falsify claims.

Transition classes:

- `no_op`: identity tuple unchanged.
- `patch`: leaf objects changed inside validated dependency closure.
- `scoped_rerun`: affected subgraph, adapter section, or lens set must be recomputed.
- `trunk_rewrite`: boundary, objective, criteria, adapter projection, ontology mapping, or regime assumption changed.
- `human_review`: risk, dissent, provenance, or consequence threshold requires approval.

The validator reports dependency closure for each trigger in an artifact and marks whether closure reaches the rendering node. The patch helper exposes the same operation:

```bash
npm run patch -- examples/strategy-micro.json E1
npm run patch -- examples/strategy-micro.json U1
```

The patch helper returns a structured report with changed objects, affected closure grouped by type, invalidated claims, required revalidation, rendering impact, and next steps. It is still a patch analyzer, not a full artifact-rewriter.
