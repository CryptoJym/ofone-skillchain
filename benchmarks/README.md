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
- pre-score compliance gates before metric scoring
- excluded-run logs for wrong-case, copied-example, leakage, required-output, or no-superiority failures
- immutable validator and patch artifacts for full-OfOne runs
- immutable remedial rerun records when an excluded original must be replaced for aggregate scoring without rewriting history

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
Its status is `in_progress`; thirty-six local `agentic_coding` raw outputs have unblinded local reviews across the strategic gated diligence repeat-1, repeat-2, and repeat-3 slices, scientific mechanism repeat-1, repeat-2, and repeat-3 slices, regulated wastewater repeat-1 and repeat-2 slices, formal proof-search repeat-1 and repeat-2 slices, and public-sector AI policy audit repeat-1 and repeat-2 slices.
Run 06 independently reviewed the first slice and accepted the direct-answer and light-structured slots while excluding the full-OfOne slot from aggregate scoring because its artifact identity was copied from another case.
Run 07 hardened the workflow, and the full-OfOne slot now has a reviewed remedial rerun at `runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.md` with companion artifact, validator, rendering, patch report, and local review files.
The scientific mechanism slice now has direct, light-structured, and full-OfOne repeat-1 outputs; the full-OfOne artifact is case-native and includes validator, rendering, patch report, and local review files.
The regulated wastewater slice now has direct, light-structured, and full-OfOne repeat-1 outputs; the full-OfOne artifact is case-native and includes validator, rendering, patch report, and local review files.
The formal proof-search slice now has direct, light-structured, and full-OfOne repeat-1 outputs; the full-OfOne artifact is case-native and includes validator, rendering, patch report, and local review files.
The public-sector AI policy audit slice now has direct, light-structured, and full-OfOne repeat-1 outputs; the full-OfOne artifact is case-native and includes validator, Audit rendering, patch report, review-log objects, and local review files.
The strategic gated diligence repeat-2 slice now has direct, light-structured, and full-OfOne outputs; the full-OfOne artifact is case-native and includes validator, Map rendering, patch report, and local review files.
The strategic gated diligence repeat-3 slice now has direct, light-structured, and full-OfOne outputs; the full-OfOne artifact is case-native and includes validator, Map rendering, patch report, and local review files.
The scientific mechanism repeat-2 slice now has direct, light-structured, and full-OfOne outputs; the full-OfOne artifact is case-native and includes validator, Map rendering, patch report, and local review files.
The scientific mechanism repeat-3 slice now has direct, light-structured, and full-OfOne outputs; the full-OfOne artifact is case-native and includes validator, Map rendering, patch report, and local review files.
The regulated wastewater repeat-2 slice now has direct, light-structured, and full-OfOne outputs; the full-OfOne artifact is case-native and includes validator, Map rendering, patch report, and local review files.
The formal proof-search repeat-2 slice now has direct, light-structured, and full-OfOne outputs; the full-OfOne artifact is case-native and includes validator, Map rendering, patch report, and local review files.
The public-sector AI policy audit repeat-2 slice now has direct, light-structured, and full-OfOne outputs; the full-OfOne artifact is case-native and includes validator, Audit rendering, patch report, review-log objects, and local review files.
The harvested independent review is stored at `../research/results/2026-05-17-06-ofone-batch01-independent-review-result.md`; the excluded-run log is `results/2026-05-17-batch-01-excluded-runs.md`.
Aggregate scoring and superiority claims remain blocked.

## Validate The Suite

```bash
npm run benchmark
```

The suite checker verifies the three comparison arms, required task-family coverage, required metrics, referenced case files, rubrics, linked OfOne artifacts, declared benchmark batch manifests, execution matrices, prompt files, review templates, result placeholders, model-family plans, release guards, pre-score compliance gates, full-OfOne case binding, benchmark trace hashes, machine-artifact hashes, semantic-fidelity fields, excluded-run state, remedial rerun records, rerun semantics, and public checker attestations.

Batch 01 currently publishes a machine-readable checker attestation at [`benchmarks/results/2026-05-17-batch-01-checker-attestation.json`](./results/2026-05-17-batch-01-checker-attestation.json). The attestation is proof of the current benchmark-control state, not proof of empirical superiority.
It intentionally warns until the suite reaches the declared case/run/model-family minimums and releases failure analysis.
