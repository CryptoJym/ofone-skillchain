# Batch 01 Failure Analysis

Status: `in_progress`

This file is reserved for failure analysis from `2026-05-17-batch-01`.

Raw output collection, local unblinded review, and the first independent review have started. Failure analysis remains in progress and must be completed before any batch result is used to support a method-comparison claim.

Preliminary local-review failure signals from the first three reviewed slots:

- Direct answer: useful but not traceable as decision state.
- Light structured answer: more actionable, but still lacks object-bound evidence, gates, and update closure.
- Full OfOne answer: strong traceability and update behavior, but rejected from aggregate scoring because the artifact is copied from the strategic Micro wastewater example and is not bound to the benchmark case.

Preliminary local-review signals from the first scientific mechanism slice:

- Direct answer: correctly blocks intervention reliance, but remains prose-only and low traceability.
- Light structured answer: gives a practical validation plan, but does not make measurement, confounder, gate, and update dependencies addressable.
- Full OfOne answer: preserves measurement/mechanism/confounder separation and patch closure, but costs more and still relies on scenario-level case evidence rather than real measurement data.

Run 06 added the first independent failure finding:

- Benchmark workflow failure: full-OfOne validation proved schema/semantic validity, but the benchmark workflow did not prove run-to-case fidelity.
- Review failure: the local unblinded review over-weighted trace richness and missed wrong-case artifact identity as an auto-reject defect.
- Corrective rule: every full-OfOne run must pass pre-score compliance before metric scoring; schema-valid is not benchmark-valid.

Run 07 and the remedial full-OfOne rerun added the first corrective proof:

- The original rejected output, artifact, validator report, patch report, review, and independent adjudication remain immutable evidence.
- The remedial rerun is case-native, carries artifact-level benchmark trace binding for the case file, prompt file, and input bundle, and has companion validator, rendering, patch, and review artifacts.
- The execution matrix tracks the rerun outside the original 90-slot count and marks it aggregate-eligible only as a replacement for the excluded original.
- This repairs the first-slice benchmark-control failure, but it does not produce aggregate scoring or support a superiority claim.

The scientific mechanism slice adds a non-remedial full-OfOne case-binding proof: the full artifact carries matching artifact identity, benchmark trace, validator result, rendering, patch report, and local review for `case-scientific-mechanism-check-001`.

The regulated wastewater slice adds a hybrid strategic/scientific/normative case-binding proof:

- Direct answer: correctly blocks launch and allows diligence, but has low traceability and no machine-addressable update closure.
- Light structured answer: gives a useful gated diligence checklist, but criteria, gates, and patch effects remain prose.
- Full OfOne answer: preserves evidence, claim, unknown, option, gate, trigger, tradeoff, rendering, validator, and patch artifacts for `case-regulated-wastewater-market-entry-001`; remaining limitation is that generic source-backed regulatory evidence does not resolve jurisdiction-specific launch authority.

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
