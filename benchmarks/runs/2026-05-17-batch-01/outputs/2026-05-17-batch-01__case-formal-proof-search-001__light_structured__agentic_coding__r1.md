# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-formal-proof-search-001`
- Arm ID: `light_structured`
- Model family: `agentic_coding`
- Repeat: `1`
- Run ID: `2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r1`
- Status: `completed`
- Case file: `benchmarks/cases/formal-proof-search.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/light_structured.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local formal proof-search slice, run 2 of 3

## Structured Answer

| Area | Assessment |
| --- | --- |
| Current proof status | Unresolved. The case gives an incomplete proof path, not a verified proof. |
| Candidate lemma | Treat as a separate obligation; it cannot support the theorem until proved or checked. |
| Countermodel pressure | Active disproof path; a verified countermodel defeats entailment under the declared axioms. |
| Recommended next step | Run proof-certificate search and countermodel search against the same formal encoding. |
| Decision boundary | Only report "proved" after a checkable certificate; only report "not entailed" after a valid countermodel. |
| Update condition | Patch the proof map if the lemma fails or a countermodel appears; rerun if axioms or inference rules change. |

## Risks, Unknowns, And Evidence Gaps

- The actual axiom set and theorem statement are not provided.
- The inference system and checker version are unspecified.
- The candidate lemma may be false, irrelevant, or stronger than the axioms allow.
- Countermodel search may be bounded and therefore incomplete.
- Solver timeout can be mistaken for proof failure or non-provability.

## Recommendation

Proceed with a bounded proof-search plan:

1. Freeze the formal encoding: axioms, target theorem, inference rules, and candidate lemma.
2. Try to prove the candidate lemma as its own obligation.
3. Search for a proof certificate for the theorem under the frozen system.
4. Run countermodel search with the same encoding.
5. If the lemma is disproven or the encoding changes, revise the proof path before relying on any conclusion.

This gives a useful formal plan without pretending the theorem has already been settled.
