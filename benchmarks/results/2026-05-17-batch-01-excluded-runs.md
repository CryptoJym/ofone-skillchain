# Batch 01 Excluded Runs

Status: `in_progress`

This log records run slots that have completed or been reviewed but are excluded from aggregate scoring before any metric average or method comparison.

## Excluded

| Run ID | Case | Arm | Reason | Source |
| --- | --- | --- | --- | --- |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1` | `case-strategic-gated-diligence-001` | `full_ofone` | Case-fidelity failure: the artifact identity is bound to `case-strategy-micro-001`, not the benchmark case. | `research/results/2026-05-17-06-ofone-batch01-independent-review-result.md` |

## Exclusion Rule

Schema-valid is not benchmark-valid. A full-OfOne run must pass the pre-score compliance gate before metric scores can enter aggregate comparison. Any wrong-case artifact identity, copied-example artifact, missing required output, other-arm leakage, or unsupported superiority claim is an auto-reject condition.

## Current Effect

- Direct-answer first-slice run remains aggregate-eligible.
- Light-structured first-slice run remains aggregate-eligible.
- Full-OfOne first-slice run must be rerun with a case-native artifact before it can be compared.
- No empirical superiority or method-performance claim is supported.
