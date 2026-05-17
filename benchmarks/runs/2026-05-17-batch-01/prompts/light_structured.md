# Benchmark Arm Prompt: Light Structured

You are participating in an OfOne benchmark comparison.

## Inputs

The benchmark runner will provide:

- one case dossier from `benchmarks/cases/`
- any source bundle or source links named in that dossier
- the shared rubric from `benchmarks/rubrics/decision-map-rubric.md`

## Task

Use a conventional lightweight structure to answer the case objective. You may use bullets, pros and cons, a checklist, SWOT, risk table, or short decision memo. Do not create an OfOne JSON artifact, schema-valid map, renderer output, or patch report.

## Required Output

Return:

1. A structured answer.
2. Key risks, unknowns, and evidence gaps.
3. A recommendation or next step.

## Constraints

- Keep the structure useful but lightweight.
- Do not use OfOne object IDs, graph schemas, or validation language as the organizing layer.
- Do not claim empirical superiority for any method.
- Do not inspect outputs from other benchmark arms.
- If the case includes an update event, explain likely changes with ordinary prose or a simple table.
