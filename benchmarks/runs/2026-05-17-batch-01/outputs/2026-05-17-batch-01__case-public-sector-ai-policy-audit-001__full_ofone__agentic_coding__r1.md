# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-public-sector-ai-policy-audit-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `1`
Run ID: `2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1`
Status: `completed`
Case file: `benchmarks/cases/public-sector-ai-policy-audit.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local public-sector AI policy slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.patch.json`

## Decision Rendering

Live public-sector AI deployment is blocked pending model evidence, rights evidence, named human gates, and review-log proof. The safe move is an Audit-mode evidence and governance pass, not a release decision.

Confidence is `medium`: the decision posture is clear from the high-stakes public-sector case, but the benchmark dossier does not include real model validation, subgroup impact evidence, appeal-access evidence, or completed gate approvals.

## Map Summary

- Known: the case is public-sector, AI-assisted, and constrained by performance, rights, legitimacy, review, and operations.
- Assumed: release authority must be accountable and review logs must be separate from the final recommendation.
- Blocked: release and rendering confidence are blocked by unresolved model evidence, rights/appeal evidence, and review-log proof.
- Gate: rights/public-policy release gate `G1` and model-performance/operational gate `G2` remain open and returned for evidence.
- Update: trigger `T1` forces human review; trigger `T2` performs a scoped rerun on new evidence; trigger `T3` patches the map on claim conflict.

## Benchmark Binding

The artifact is case-native for `case-public-sector-ai-policy-audit-001` and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
