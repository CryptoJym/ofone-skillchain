# Dependency Closure

OfOne updates propagate through typed object references. The decision rendering is an addressable graph node, not just prose, so closure can prove when the visible answer is affected.

```text
new evidence
-> affected claims
-> affected edges
-> affected loops
-> affected options
-> affected identity / temporal / tradeoff / lens / review objects
-> affected decision rendering (`rendering_id`)
```

The validator builds reverse dependencies from evidence support, claim dependencies and contradictions, edge endpoints, loop edge membership, option preconditions/effects, trigger affected objects, gate references, and `decision_rendering.depends_on`.
It also includes subscene membership, explicit unknown/null objects that block options or renderings, kill tests that falsify claims, artifact identity, temporal evidence windows, information-value entries, tradeoff surfaces, lens/council review, review-log entries, recursive review cycles, and benchmark traces.

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
npm run patch -- examples/strategy-micro.json --operation supersede_evidence E1
npm run patch -- examples/strategy-micro.json --operation trigger_activation T1
```

Supported semantic patch operations include `add_supporting_evidence`, `supersede_evidence`, `downgrade_confidence`, `invalidate_criterion`, `open_gate`, `reopen_gate`, `trigger_re_review`, `supersede_artifact_identity`, `actor_reassignment`, `trigger_activation`, and `trigger_deactivation`.

For `trigger_activation` and `trigger_deactivation`, closure starts from the trigger plus the trigger's declared `affected_objects`. This prevents a trigger patch from only traversing objects that depend on the trigger label while skipping the evidence, claim, unknown, or criterion that the trigger watches.

The patch helper returns a structured report with changed objects, affected closure grouped by type, affected semantic layers, invalidated claims, reopened gates, required approvals, changed decision meaning, required revalidation, rendering impact, and next steps. It is still a patch analyzer, not a full artifact-rewriter.
