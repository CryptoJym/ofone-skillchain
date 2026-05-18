# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-strategic-gated-diligence-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `1`
Run ID: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1`
Rerun of: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1`
Status: `completed`

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.patch.json`

## Decision Rendering

Proceed with a scoped diligence move, not operational launch.

Confidence is `medium`. The frozen case supports diligence because it is reversible and intended to gather missing launch-readiness evidence. Operational launch remains blocked by `U1` and gate `G1` until a reviewer approves the launch-like commitment after the diligence evidence is available.

## Map Summary

- Known: the case asks for a reversible diligence move before operational launch.
- Assumed: the diligence move can be scoped so it does not create irreversible launch exposure.
- Blocked: operational launch and the rendered launch recommendation are blocked by `U1`, the missing launch-readiness evidence.
- Gate: `G1` requires release reviewer `A2` to approve launch, keep launch blocked, or request more diligence evidence.
- Update: trigger `T1` patches the claim/gate/option/rendering path when new launch-readiness evidence arrives.

## Benchmark Binding

The artifact is case-native for `case-strategic-gated-diligence-001` and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
