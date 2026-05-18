# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-formal-proof-search-001`
- Arm ID: `direct_answer`
- Model family: `agentic_coding`
- Repeat: `2`
- Run ID: `2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r2`
- Status: `completed`
- Case file: `benchmarks/cases/formal-proof-search.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/direct_answer.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local formal proof-search repeat-2 slice, run 1 of 3

## Answer

Do not report the theorem as proved. The current case only states that there is an incomplete proof path, a candidate lemma, and possible countermodel pressure. The right direct answer is to keep the theorem unresolved while running proof-certificate search and countermodel search against the same frozen formal encoding.

Treat the candidate lemma as its own proof obligation. If the lemma is checked, it may support a path toward the theorem. If it is refuted or a countermodel is verified, the proof path must be revised or the theorem must be marked not entailed under the declared axioms. A timeout should remain an unresolved search result, not a proof of failure.

## Confidence Or Uncertainty

Confidence is high that the proof state should remain unresolved from the current dossier. Confidence is low on the truth of the theorem because the case provides no axiom set, theorem statement, inference system, checker output, proof certificate, lemma proof, or countermodel artifact.

## Source Or Gap Notes

The case establishes only the abstract proof-search situation: incomplete proof path, candidate lemma, possible countermodel pressure, and a requirement to separate axioms, claims, obligations, countermodel tests, unknowns, and triggers.

Missing evidence includes the formal axiom encoding, theorem text, inference rules, checker version, proof certificate, countermodel-search output, and lemma status. The answer should update if a certificate checks, a countermodel verifies, the lemma fails, or the formalization changes.
