# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-scientific-mechanism-check-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `3`
Run ID: `2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3`
Status: `completed`
Case file: `benchmarks/cases/scientific-mechanism-check.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local scientific repeat-3 slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.patch.json`

## Decision Rendering

Hold the intervention behind a validation gate. The mechanism remains provisional until measurement quality and confounder pressure are addressed.

Confidence is `medium` for the decision posture and lower for the mechanism itself. The frozen case supports a validation-first decision because measurements are limited, confounding is possible, and contradictory measurement should trigger a scoped patch.

## Map Summary

- Known: plausible mechanism, limited measurements, possible confounding, proposed intervention, and contradiction-triggered update pressure.
- Assumed: a validation reviewer can require protocol, replication, and confounder checks before reliance.
- Blocked: intervention reliance while measurement adequacy and confounder status are unresolved.
- Gate: `G1` remains open until validation reviewer approval.
- Update: `T1` patches the mechanism claim, unknowns, options, tradeoff surface, gate, and decision rendering if contradictory measurement evidence appears.

## Benchmark Binding

The artifact is case-native for `case-scientific-mechanism-check-001` and carries benchmark_trace values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
