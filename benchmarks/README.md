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
- at least 21 retrospective cases across seven domains before performance claims
- repeated runs across multiple model families
- blinded expert review where possible
- full artifact release or redacted release notes when source permission blocks publication

Benchmarks should compare the validated OfOne artifact and its rendering against direct-answer baselines and simpler structured-prompt baselines.

## Starter Assets

- `cases/regulated-wastewater-market-entry.md`
- `rubrics/decision-map-rubric.md`

The source-backed example at `../examples/source-backed-wastewater-map.json` is the first repository artifact intended to exercise source identity, external URLs, blocking unknowns, and rendering patchability against public reference material.
