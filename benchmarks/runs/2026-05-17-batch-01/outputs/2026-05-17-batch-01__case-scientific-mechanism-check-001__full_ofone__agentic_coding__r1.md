# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-scientific-mechanism-check-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `1`
Run ID: `2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1`
Status: `completed`
Case file: `benchmarks/cases/scientific-mechanism-check.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local scientific slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.patch.json`

## Decision Rendering

Proceed with measurement and confounder validation, not intervention reliance.

Confidence is `medium`. The frozen case supports a test-first move because the mechanism is plausible but not established, measurements are limited, and confounding is possible. The proposed intervention remains gated by `G1` until `U1` measurement adequacy and `U2` confounder pressure are resolved.

## Map Summary

- Known: the case includes a plausible mechanism, limited measurements, possible confounding, and a proposed intervention.
- Assumed: a validation cycle can test measurement adequacy and confounder pressure before intervention reliance.
- Blocked: intervention reliance and the rendered recommendation are blocked while `U1` remains open.
- Gate: `G1` requires validation reviewer `A2` to approve, block, or require replication/confounder testing.
- Update: trigger `T1` patches the mechanism, gate, option, tradeoff, and rendering path when contradictory new measurement evidence arrives.

## Benchmark Binding

The artifact is case-native for `case-scientific-mechanism-check-001` and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
