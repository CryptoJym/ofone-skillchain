# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-regulated-wastewater-market-entry-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `1`
Run ID: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1`
Status: `completed`
Case file: `benchmarks/cases/regulated-wastewater-market-entry.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local regulated wastewater slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.patch.json`

## Decision Rendering

Proceed with source-backed regulatory, technical, partner, and customer diligence. Do not commit to operational launch until the jurisdiction, influent profile, permit path, pilot proof, partner accountability, and customer commitment are resolved and the human compliance/business gate is approved.

Confidence is `medium`: the case strongly supports a gated diligence posture, but it does not contain enough evidence to evaluate market attractiveness, permit feasibility, or treatment performance.

## Map Summary

- Known: the opportunity is a regulated US wastewater market-entry question with unset jurisdiction, influent profile, treatment proof, partner path, and customer commitment.
- Assumed: reversible diligence is available before launch authority or customer commitment.
- Blocked: operational launch, customer commitment, and the rendered recommendation are blocked while jurisdiction-specific regulatory and treatment-proof unknowns remain open.
- Gate: `G1` requires a human regulatory and business owner to approve diligence only, block launch, or narrow the scope to a jurisdiction-specific permit path.
- Update: triggers `T1` and `T2` patch or rerun the map when jurisdiction-specific evidence, treatment proof, customer commitment, or regulatory regime facts change.

## Benchmark Binding

The artifact is case-native for `case-regulated-wastewater-market-entry-001` and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
