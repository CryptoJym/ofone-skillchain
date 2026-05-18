# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-regulated-wastewater-market-entry-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `2`
Run ID: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2`
Status: `completed`
Case file: `benchmarks/cases/regulated-wastewater-market-entry.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local regulated wastewater repeat-2 slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.patch.json`

## Decision Rendering

Proceed with gated diligence only. The repeat-2 map keeps operational launch blocked until jurisdiction-specific regulatory path, influent characterization, treatment proof, partner accountability, and customer commitment are source-backed and approved by the human compliance/business gate.

Confidence is `medium`: generic public regulatory evidence supports the need for permit-aware controls, but the case still lacks the site-specific facts needed for launch authority.

## Map Summary

- Known: regulated US wastewater market entry is under consideration, and generic NPDES evidence shows discharge permitting can matter.
- Unknown: jurisdiction, influent profile, treatment proof, partner path, customer commitment, and permit authority remain unresolved.
- Blocked: launch, customer promises, and release-grade rendering are blocked by U1/U2/U3 and gate G1.
- Gate: `G1` requires compliance/business review before movement beyond diligence.
- Update: `T1` patches the rendering when jurisdiction, pilot, partner, or customer evidence arrives; `T2` triggers a scoped rerun if the regulatory regime or discharge context changes.

## Benchmark Binding

The artifact is case-native for `case-regulated-wastewater-market-entry-001`, repeat 2, and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hash. It does not claim empirical superiority for OfOne.
