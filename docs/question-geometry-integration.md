# Integrating Question Geometry with OfOne 0.6 Artifacts

Question Geometry is introduced as a linked sidecar rather than a destructive rewrite of the stable OfOne decision-map IR.

## Compatibility rule

Existing Micro, Map, and Audit artifacts remain valid under their current schemas. A Question Geometry run references the map through:

```json
{
  "linked_artifact_id": "OFONE-example-001"
}
```

The sidecar owns adaptive inquiry state; the OfOne artifact remains the source of truth for evidence, claims, causal/constraint structure, options, gates, and rendering.

## Object mapping

| OfOne object | Question Geometry use |
|---|---|
| charter | objective, decision, stakes, horizon |
| adapter projection | active frame and question-generation constraints |
| scene / frames | inquiry boundary, resolution, contrast, assumptions |
| evidence | answer provenance and source-channel model |
| claims | candidate explananda and hypothesis implications |
| unknowns | typed decision-sensitive unknowns |
| kill tests | candidate counterfactual, falsification, or intervention questions |
| causal edges / loops | causal-depth targets and why-link candidates |
| criteria / tradeoff surface | utility, loss, hard constraints, and decision robustness |
| actors / gates | oracle authority, permission, risk, and residual-risk owner |
| temporal model | question delay, deadline, evidence staleness, and re-open triggers |
| information_value | legacy ordinal prioritization input only |
| triggers | answer-conditioned patch, rerun, reframe, or review transitions |
| decision rendering | release target guarded by `attempt-stop` |

## `information_value` compatibility

The existing OfOne `information_value` object remains useful as a human-readable ordinal assessment. It must not be described as computed information theory unless it was produced from an explicit belief, answer-channel, and decision model.

For executable inquiry, use Question Geometry fields:

- expected information gain;
- expected decision gain;
- Fisher–Rao belief displacement;
- residual EVPI;
- causal discrimination;
- model-expansion value;
- unlock and lookahead value;
- cost, risk, delay, and redundancy.

## Runtime integration

The installed OfOne skill is assembled from:

1. top-level `SKILL.md`;
2. `skills/question-geometry/PROTOCOL.md`.

This makes the Question Geometry stop gate part of the installed OfOne harness without requiring old artifacts to adopt new top-level fields.

## Update propagation

After an answer:

```text
answer event
-> Question Geometry belief / unknown / causal update
-> affected OfOne evidence and claim objects
-> dependency closure
-> affected options, criteria, gates, and rendering
-> patch or scoped rerun
-> recomputed question landscape
```

A Question Geometry answer should be persisted as an OfOne evidence item when it changes the map. The resulting OfOne object IDs can then be referenced in the question history or causal-depth evidence references.

## Recommended operating sequence

```text
1. Compile or load the OfOne map.
2. Create a linked Question Geometry state.
3. Validate both artifacts.
4. Run `question-loop step`.
5. Acquire the selected answer through an allowed oracle/tool.
6. Write answer evidence into OfOne.
7. Apply the answer to Question Geometry.
8. Patch/revalidate the OfOne map.
9. Repeat until `attempt-stop` permits release.
```
