# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-formal-proof-search-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `3`
Run ID: `2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3`
Status: `completed`
Case file: `benchmarks/cases/formal-proof-search.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local formal proof-search repeat-3 slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.patch.json`

## Decision Rendering

Keep the theorem unresolved. The repeat-3 map requires a checked proof certificate before proved status and a verified countermodel before not-entailed status. The candidate lemma remains a separate proof obligation, not evidence by itself.

Confidence is `medium`: the decision posture is well-supported by the case, but theorem truth is unknowable from the abstract dossier.

## Map Summary

- Known: the proof path is incomplete, a candidate lemma exists, and countermodel pressure is possible.
- Unknown: axiom encoding, theorem statement, inference rules, checker output, lemma status, proof certificate, and countermodel result.
- Blocked: proved/not-entailed status is blocked until formal evidence resolves the proof or countermodel path.
- Gate: criterion-level acceptance blocks proof reliance without a checkable certificate.
- Update: `T1` patches the map on countermodel or lemma-status evidence; `T2` scopes a rerun if formalization changes.

## Benchmark Binding

The artifact is case-native for `case-formal-proof-search-001`, repeat 3, and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hash. It does not claim empirical superiority for OfOne.
