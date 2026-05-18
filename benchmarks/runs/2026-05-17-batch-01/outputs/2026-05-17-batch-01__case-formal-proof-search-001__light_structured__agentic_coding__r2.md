# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-formal-proof-search-001`
- Arm ID: `light_structured`
- Model family: `agentic_coding`
- Repeat: `2`
- Run ID: `2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r2`
- Status: `completed`
- Case file: `benchmarks/cases/formal-proof-search.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/light_structured.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local formal proof-search repeat-2 slice, run 2 of 3

## Structured Answer

| Area | Repeat-2 Assessment |
| --- | --- |
| Current theorem status | Unresolved; no checked proof certificate is present. |
| Candidate lemma | Open proof obligation; do not treat it as support until checked. |
| Countermodel pressure | Active risk path; a valid countermodel defeats entailment under the same encoding. |
| Search timeout | Inconclusive; timeout is not non-provability. |
| Best next step | Freeze axioms, theorem, inference rules, checker, and candidate lemma; then run proof and countermodel tracks. |
| Update condition | Patch if lemma/countermodel evidence changes; rerun if axiom or inference encoding changes. |

## Risks, Unknowns, And Evidence Gaps

- No axiom set, theorem statement, or inference-system contract is supplied.
- No proof certificate or proof-checker output exists.
- The candidate lemma may be false, too strong, irrelevant, or dependent on missing assumptions.
- Countermodel pressure may expose a real contradiction or only a modeling mismatch.
- A bounded solver timeout can be misread as a mathematical result.

## Recommendation

Continue proof search, but report the state as unresolved. First freeze the formal encoding, then test the candidate lemma, attempt a checkable theorem certificate, and run countermodel search on the same encoding. Only move to proved/not-entailed after a checkable certificate or verified countermodel.
