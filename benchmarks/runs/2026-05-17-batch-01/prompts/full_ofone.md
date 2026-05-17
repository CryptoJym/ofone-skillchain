# Benchmark Arm Prompt: Full OfOne

You are participating in an OfOne benchmark comparison.

## Inputs

The benchmark runner will provide:

- one case dossier from `benchmarks/cases/`
- any source bundle or source links named in that dossier
- the shared rubric from `benchmarks/rubrics/decision-map-rubric.md`
- the current OfOne repo specification, schemas, validator, renderer, and patch helper

## Task

Produce a full OfOne response for the case objective.

## Required Output

Return:

1. A schema-valid OfOne artifact JSON for the appropriate mode.
2. The validator result, including any warnings or blocked release state.
3. A human-readable rendering appropriate to the case.
4. A patch report if the case includes an update event or trigger.

## Constraints

- Preserve the distinction between evidence, claims, graph structure, criteria, option moves, gates, and rendering.
- Include source identity and explicit unknowns when evidence is missing or provisional.
- Do not treat the rendered recommendation as the internal map.
- Do not claim empirical superiority for OfOne.
- Do not inspect outputs from other benchmark arms.
- If the artifact cannot pass validation, return the artifact, diagnostics, and concrete repair plan rather than hiding the failure.
