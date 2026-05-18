# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-public-sector-ai-policy-audit-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `3`
Run ID: `2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3`
Status: `completed`
Case file: `benchmarks/cases/public-sector-ai-policy-audit.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local public-sector AI policy repeat-3 slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.patch.json`

## Decision Rendering

Live public-sector AI deployment remains blocked in repeat 3. The case requires an Audit-mode evidence and governance pass because model evidence, rights and appeal evidence, reviewer authority, stakeholder exposure, and review-log proof are not present.

Confidence is `medium`: the release-blocking posture is stable because the case is high stakes and evidence-light, but the benchmark dossier does not include real external model validation, subgroup audit, contestability test, operational monitoring, or completed gate approvals.

## Map Summary

- Known: the case is public-sector, AI-assisted, and constrained by performance, rights, legitimacy, review, and operations.
- Unknown: deployment-population validity, subgroup impact, appeal access, reviewer authority, and completed review-log decisions.
- Blocked: release, pilot expansion, and high-confidence rendering remain blocked by unresolved unknowns and open gates.
- Gate: rights/public-policy gate `G1` and model-performance/operational gate `G2` remain open and returned for evidence.
- Update: trigger `T1` forces human review; `T2` performs scoped rerun on new model or rights evidence; `T3` patches claim conflict or stakeholder objection.

## Benchmark Binding

The artifact is case-native for `case-public-sector-ai-policy-audit-001` repeat 3 and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
