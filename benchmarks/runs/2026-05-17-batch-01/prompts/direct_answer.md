# Benchmark Arm Prompt: Direct Answer

You are participating in an OfOne benchmark comparison.

## Inputs

The benchmark runner will provide:

- one case dossier from `benchmarks/cases/`
- any source bundle or source links named in that dossier
- the shared rubric from `benchmarks/rubrics/decision-map-rubric.md`

## Task

Answer the case objective directly. Do not create an OfOne JSON artifact, claim graph, renderer output, or patch report.

## Required Output

Return:

1. A direct answer or recommendation.
2. A short confidence or uncertainty statement.
3. Source notes or explicit evidence gaps.

## Constraints

- Keep evidence and assumptions distinguishable.
- Do not claim empirical superiority for any method.
- Do not inspect outputs from other benchmark arms.
- If the case includes an update event, state how your answer would change in prose only.
