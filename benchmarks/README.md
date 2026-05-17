# OfOne Benchmark Scaffold

OfOne should not claim empirical superiority without benchmark evidence. This scaffold keeps the benchmark path explicit.

## Folders

- `cases/` - time-locked decision dossiers and source bundles.
- `rubrics/` - blinded review criteria for fidelity, calibration, actionability, and update quality.
- `runs/` - frozen prompts, model settings, artifacts, and renderings.
- `reviews/` - reviewer notes and adjudications.
- `results/` - aggregate findings and failure analysis.

## Minimum Benchmark Standard

- predeclared cases and rubrics
- at least 21 retrospective cases across the six declared task families before performance claims
- at least 3 cases per task family, plus enough additional cross-family cases to reach the 21-case minimum
- repeated runs across multiple model families
- blinded expert review where possible
- full artifact release or redacted release notes when source permission blocks publication

Benchmarks should compare the validated OfOne artifact and its rendering against direct-answer baselines and simpler structured-prompt baselines.

## Starter Assets

- `suite.json`
- `runs/2026-05-17-batch-01/manifest.json`
- `runs/2026-05-17-batch-01/execution-matrix.json`
- `runs/2026-05-17-batch-01/prompts/direct_answer.md`
- `runs/2026-05-17-batch-01/prompts/light_structured.md`
- `runs/2026-05-17-batch-01/prompts/full_ofone.md`
- `reviews/2026-05-17-batch-01-review-template.md`
- `cases/regulated-wastewater-market-entry.md`
- `rubrics/decision-map-rubric.md`

The source-backed example at `../examples/source-backed-wastewater-map.json` is the first repository artifact intended to exercise source identity, external URLs, blocking unknowns, and rendering patchability against public reference material.

## Batch 01

`runs/2026-05-17-batch-01/manifest.json` freezes the first five-case execution plan before any model outputs are collected.
It declares the three benchmark arms, frozen arm prompts, repeated-run and model-family plan, review template, result placeholders, raw-output directory, and release guard.
`runs/2026-05-17-batch-01/execution-matrix.json` predeclares 90 run slots across 5 cases, 3 arms, 2 model families, and 3 repeats.
Its status is `not_started`; it supports only the claim that a first benchmark batch has been predeclared.

## Validate The Suite

```bash
npm run benchmark
```

The suite checker verifies the three comparison arms, required task-family coverage, required metrics, referenced case files, rubrics, linked OfOne artifacts, declared benchmark batch manifests, execution matrices, prompt files, review templates, result placeholders, model-family plans, and release guards.
It intentionally warns until the suite reaches the declared case/run/model-family minimums and releases failure analysis.
