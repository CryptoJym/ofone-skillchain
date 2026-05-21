# Batch 01 Excluded Runs

Status: `in_progress`

This log records run slots that have completed or been reviewed but are excluded from aggregate scoring before any metric average or method comparison.

## Excluded

| Run ID | Case | Arm | Reason | Source |
| --- | --- | --- | --- | --- |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1` | `case-strategic-gated-diligence-001` | `full_ofone` | Case-fidelity failure: the artifact identity is bound to `case-strategy-micro-001`, not the benchmark case. | `research/results/2026-05-17-06-ofone-batch01-independent-review-result.md` |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1` | `case-strategic-gated-diligence-001` | `full_ofone` | Semantic-validation failure: computed local validator rejects relation legality and option expected-effect references, and the artifact self-attested validator pass conflicts with the computed result. | `benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1.md` |

## Exclusion Rule

Schema-valid is not benchmark-valid. A full-OfOne run must pass the pre-score compliance gate before metric scores can enter aggregate comparison. Any wrong-case artifact identity, copied-example artifact, missing required output, other-arm leakage, or unsupported superiority claim is an auto-reject condition.

## Current Effect

- Direct-answer first-slice run remains aggregate-eligible.
- Light-structured first-slice run remains aggregate-eligible.
- Original full-OfOne first-slice run remains excluded and immutable.
- Remedial full-OfOne rerun 1 is reviewed and aggregate-eligible as a replacement for the excluded original only.
- Frontier full-OfOne strategic repeat-1 remains excluded and immutable.
- Remedial frontier full-OfOne rerun 1 was harvested but rejected before matrix insertion because the output was an advisory research report, not a benchmark raw output package.
- No empirical superiority or method-performance claim is supported.

## Remedial Reruns

| Run ID | Replaces | Status | Aggregate Policy | Notes |
| --- | --- | --- | --- | --- |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1` | `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1` | `reviewed` | `replace_for_aggregate_only` | Case-native artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun1` | `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1` | `failed` | `not_aggregate_eligible` | Raw export preserved with SHA-256 `c0900989fe10e528648ea57d6f20f1f18f662fcff89bb04194bbc99fb5a9d385`, but exact benchmark header, artifact JSON, validator, rendering, and patch sections were absent. |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun2` | `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1` | `active_researching` | `replace_for_aggregate_only` | Launched in clean ChatGPT Deep Research conversation https://chatgpt.com/c/6a0ea350-3584-83e8-9d3e-ab7759c489f6 with visible plan title `Strategic gated diligence`, `Researching...`, and `Stop research`; no harvest, review, or aggregate eligibility exists yet. |

## Rerun Semantics

- Excluded originals are immutable evidence records. Do not edit or delete the original raw output, artifact, validator artifact, patch artifact, review, or independent adjudication.
- The execution matrix declares `rerun_policy.preserve_original_runs=true`.
- Remedial reruns use `rerun_id_template={original_run_id}__rerun{rerun_number}` and carry `rerun_of`, `reason`, `status`, and `aggregate_policy`.
- The first remedial rerun repairs the excluded repeat-1 slot and does not consume repeat 2 or repeat 3.
- The frontier full-OfOne remedial rerun should repair the excluded frontier repeat-1 slot without mutating the original completed output.
- A remedial rerun can replace the excluded original for aggregate scoring only after it passes pre-score compliance, benchmark trace binding, machine-artifact hash checks, and review/adjudication.
- Failed remedial attempts may be recorded as evidence outside `remedial_runs`; they do not increase completion/remedial counters and cannot replace an excluded original.
- Remedial reruns are tracked in `execution-matrix.json` under `remedial_runs`; they do not consume a new predeclared repeat slot.

## Provenance Binding

The excluded original now carries run-record-level `benchmark_trace` fields for the case file, arm prompt, and input bundle hashes. The failed artifact itself remains unchanged because it is evidence of the Run 06 defect. Future aggregate-eligible `full_ofone` artifacts must carry matching artifact-level `benchmark_trace` values, or the benchmark checker rejects them.
