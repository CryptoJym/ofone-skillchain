# Benchmark Run Output

Batch ID: `2026-05-17-batch-01`
Case ID: `case-formal-proof-search-001`
Arm ID: `full_ofone`
Model family: `agentic_coding`
Repeat: `1`
Run ID: `2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1`
Status: `completed`
Case file: `benchmarks/cases/formal-proof-search.md`
Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
Rubric: `benchmarks/rubrics/decision-map-rubric.md`
Actual order: local formal proof-search slice, run 3 of 3

## Required Outputs

1. Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.artifact.json`
2. Validator result: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.validator.json`
3. Human rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.rendering.md`
4. Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.patch.json`

## Decision Rendering

The proof state is unresolved. Run proof-certificate and countermodel tracks under the same formal encoding, and keep candidate lemma L as a separate proof obligation. Do not declare theorem T proved or not entailed until a checked certificate, verified countermodel, or failed lemma obligation is recorded.

Confidence is `medium`: the formal posture is clear, but the case does not provide actual axioms, theorem text, checker output, or countermodel artifacts.

## Map Summary

- Known: the case contains an incomplete proof path, candidate lemma, and countermodel pressure.
- Assumed: all proof and countermodel work must use the same axiom and inference encoding.
- Blocked: rendered proof conclusion is blocked by missing certificate/countermodel evidence and unresolved lemma status.
- Gate: no human safety gate is required for this medium-risk formal map, but proof reviewer `A1` owns proof-validity criteria.
- Update: trigger `T1` patches the map when countermodel evidence changes; trigger `T2` causes a scoped rerun if the axiom or inference-system scope changes.

## Benchmark Binding

The artifact is case-native for `case-formal-proof-search-001` and carries `benchmark_trace` values for the frozen case file, full-OfOne prompt, and input-bundle hashes. It does not claim empirical superiority for OfOne.
