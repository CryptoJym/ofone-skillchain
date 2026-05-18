# Batch 01 Failure Analysis

Status: `in_progress`

This file is reserved for failure analysis from `2026-05-17-batch-01`.

Raw output collection and local unblinded review have started, but independent review and failure analysis have not been completed. Failure analysis must be completed before any batch result is used to support a method-comparison claim.

Preliminary local-review failure signals from the first three reviewed slots:

- Direct answer: useful but not traceable as decision state.
- Light structured answer: more actionable, but still lacks object-bound evidence, gates, and update closure.
- Full OfOne answer: strongest traceability and update behavior, but materially higher cost and still dependent on scenario-level evidence.

Minimum sections once runs exist:

- validation failures
- evidence-grounding failures
- decision-surface failures
- update/patch failures
- over-mapping or token-cost failures
- baseline failure modes
- OfOne failure modes
- corrective backlog
