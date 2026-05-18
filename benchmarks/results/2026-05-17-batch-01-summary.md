# Batch 01 Results Summary

Status: `in_progress`

This file is reserved for aggregate findings from `2026-05-17-batch-01`.

Raw output collection, local unblinded review, and the first independent frontier review have started. Three of 90 predeclared run slots have completed and have local reviews for the first local `agentic_coding` slice:

- `case-strategic-gated-diligence-001` / `direct_answer` / `agentic_coding` / repeat 1
- `case-strategic-gated-diligence-001` / `light_structured` / `agentic_coding` / repeat 1
- `case-strategic-gated-diligence-001` / `full_ofone` / `agentic_coding` / repeat 1

Run 06 independently adjudicated the first slice. It accepted the direct-answer and light-structured slots for later aggregate scoring, but rejected the full-OfOne slot because the artifact identity is copied from `case-strategy-micro-001` rather than bound to `case-strategic-gated-diligence-001`.

Run 07 hardened the benchmark workflow, then the first full-OfOne slot was rerun as a remedial record:

- `case-strategic-gated-diligence-001` / `full_ofone` / `agentic_coding` / repeat 1 / remedial rerun 1

The original excluded full-OfOne run remains immutable evidence. The remedial rerun is tracked outside the original 90-slot count and can replace the excluded original only for future aggregate scoring after review.

Current first-slice aggregate eligibility:

| Run slot | Eligibility | Reason |
| --- | --- | --- |
| `direct_answer` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| `light_structured` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| `full_ofone` / `agentic_coding` / repeat 1 | excluded | Wrong-case copied artifact; schema-valid is not benchmark-valid. |
| `full_ofone` / `agentic_coding` / repeat 1 / remedial rerun 1 | eligible for future aggregate scoring as replacement | Case-native artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |

No aggregate scoring or performance comparison has been completed. No performance or superiority claim is supported by this in-progress state.

Required before this file can move beyond `in_progress`:

- raw outputs for every case, arm, model family, and repeated run
- validation reports and patch artifacts for full-OfOne artifacts
- review notes using `benchmarks/reviews/2026-05-17-batch-01-review-template.md`
- aggregate score table
- excluded-run log with reasons
- limitation notes for blinding, source access, model variance, and reviewer expertise
