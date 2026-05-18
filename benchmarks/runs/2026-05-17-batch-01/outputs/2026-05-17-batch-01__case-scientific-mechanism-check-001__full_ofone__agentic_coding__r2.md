# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-scientific-mechanism-check-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `2`
Run ID: `2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2`
Status: `completed`
Case file: `benchmarks/cases/scientific-mechanism-check.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local scientific repeat-2 slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.patch.json`

## Decision Rendering

Run a targeted validation cycle before any intervention reliance.

Confidence is `medium`. The frozen case supports a test-first decision because the mechanism is plausible rather than established, measurements are limited, and confounding is possible. The intervention remains gated until measurement adequacy and confounder pressure are resolved.

## Map Summary

- Known: plausible mechanism, limited measurements, possible confounding, and proposed intervention.
- Assumed: the team can define a validation cycle before acting on the intervention.
- Blocked: intervention reliance while measurement adequacy and confounder pressure remain open.
- Gate: `G1` requires reviewer action before reliance.
- Update: trigger `T1` patches the mechanism, option, tradeoff, gate, and rendering when contradictory measurement evidence appears.

## Benchmark Binding

The artifact is case-native for `case-scientific-mechanism-check-001` and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
