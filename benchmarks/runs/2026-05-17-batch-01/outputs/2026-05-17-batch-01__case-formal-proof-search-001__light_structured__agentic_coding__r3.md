# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-formal-proof-search-001`
- Arm ID: `light_structured`
- Model family: `agentic_coding`
- Repeat: `3`
- Run ID: `2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r3`
- Status: `completed`
- Case file: `benchmarks/cases/formal-proof-search.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/light_structured.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local formal proof-search repeat-3 slice, run 2 of 3

## Structured Answer

| Area | Repeat-3 Assessment |
| --- | --- |
| Current theorem status | Unresolved; no checked certificate or verified countermodel is present. |
| Candidate lemma | Open proof obligation; it is not support until independently checked. |
| Countermodel pressure | Active falsification path; must be evaluated under the same encoding. |
| Timeout handling | Inconclusive; timeout is neither proof nor disproof. |
| Best next step | Freeze axioms, theorem, inference rules, checker, lemma statement, and search bounds; then run proof and countermodel tracks. |
| Update condition | Patch on lemma/countermodel evidence; scoped-rerun on axiom, theorem, or inference-rule changes. |

## Risks, Unknowns, And Evidence Gaps

- No axiom set, theorem statement, inference contract, proof certificate, or checker output is supplied.
- The candidate lemma may be false, too strong, irrelevant, or dependent on hidden assumptions.
- A countermodel may defeat entailment or expose a mismatch in the formalization.
- A timeout can be misread as a proof-search result when it is only bounded non-completion.

## Recommendation

Continue proof search under a frozen formalization and keep the theorem unresolved. Promote status only after a checkable proof certificate or verified countermodel exists; otherwise preserve the lemma, countermodel, timeout, and formalization-change dependencies as explicit update conditions.
