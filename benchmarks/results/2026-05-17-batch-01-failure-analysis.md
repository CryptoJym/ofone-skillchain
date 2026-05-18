# Batch 01 Failure Analysis

Status: `in_progress`

This file is reserved for failure analysis from `2026-05-17-batch-01`.

Raw output collection, local unblinded review, and the first independent review have started. Failure analysis remains in progress and must be completed before any batch result is used to support a method-comparison claim.

Preliminary local-review failure signals from the first three reviewed slots:

- Direct answer: useful but not traceable as decision state.
- Light structured answer: more actionable, but still lacks object-bound evidence, gates, and update closure.
- Full OfOne answer: strong traceability and update behavior, but rejected from aggregate scoring because the artifact is copied from the strategic Micro wastewater example and is not bound to the benchmark case.

Run 06 added the first independent failure finding:

- Benchmark workflow failure: full-OfOne validation proved schema/semantic validity, but the benchmark workflow did not prove run-to-case fidelity.
- Review failure: the local unblinded review over-weighted trace richness and missed wrong-case artifact identity as an auto-reject defect.
- Corrective rule: every full-OfOne run must pass pre-score compliance before metric scoring; schema-valid is not benchmark-valid.

Minimum sections once runs exist:

- validation failures
- evidence-grounding failures
- decision-surface failures
- update/patch failures
- over-mapping or token-cost failures
- baseline failure modes
- OfOne failure modes
- case-binding and copied-example failures
- corrective backlog
