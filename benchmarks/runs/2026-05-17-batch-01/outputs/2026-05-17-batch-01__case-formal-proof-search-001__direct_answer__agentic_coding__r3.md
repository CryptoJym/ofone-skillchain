# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-formal-proof-search-001`
- Arm ID: `direct_answer`
- Model family: `agentic_coding`
- Repeat: `3`
- Run ID: `2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r3`
- Status: `completed`
- Case file: `benchmarks/cases/formal-proof-search.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/direct_answer.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local formal proof-search repeat-3 slice, run 1 of 3

## Answer

Do not mark the theorem proved or not entailed from the current dossier. The case still gives only an incomplete proof path, a candidate lemma, possible countermodel pressure, and a timeout-sensitive search posture. The correct direct answer is to keep the theorem unresolved until a proof certificate checks or a countermodel verifies against the same frozen formal encoding.

Treat the candidate lemma as a separate obligation. It can become useful support only after it is checked under the declared axioms and inference rules. If the lemma fails, a countermodel verifies, or the formalization changes, the proof path must be patched or rerun instead of converted into a conclusion.

## Confidence Or Uncertainty

Confidence is high that the present state should remain unresolved. Confidence in the theorem truth is low because the case provides no axiom set, theorem statement, checker output, proof certificate, verified lemma proof, countermodel artifact, or formalization-diff record.

## Source Or Gap Notes

The benchmark case supplies the abstract proof-search situation and expected pressure points only. Missing evidence includes the formal encoding, inference rules, checker version, certificate, countermodel-search result, lemma status, and timeout context. A checked certificate, verified countermodel, failed lemma, or changed formalization would materially update the answer.
