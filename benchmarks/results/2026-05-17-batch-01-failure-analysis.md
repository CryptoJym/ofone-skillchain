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

The formal proof-search slice adds a formal-adapter case-binding proof:

- Direct answer: correctly refuses to mark the theorem proved from an incomplete proof path, but remains prose-only and low traceability.
- Light structured answer: isolates candidate lemma, countermodel pressure, and update conditions, but does not make proof obligations and closure addressable.
- Full OfOne answer: preserves proof certificate absence, candidate lemma obligation, countermodel pressure, bounded-timeout risk, criteria, trigger, rendering, validator, and patch artifacts for `case-formal-proof-search-001`; remaining limitation is that the benchmark dossier does not include actual axiom, theorem, checker, or countermodel artifacts.

The public-sector AI policy audit slice adds a high-risk hybrid/normative case-binding proof:

- Direct answer: correctly blocks live deployment and calls for a gated policy audit, but remains prose-only with no addressable gate or review-log state.
- Light structured answer: makes release conditions, reviewer authority, and evidence gaps clearer, but still leaves rights, model, stakeholder, and review dependencies as text.
- Full OfOne answer: preserves model evidence gaps, rights and legitimacy claims, stakeholder exposure, gates, review-log objects, trigger closure, Audit rendering, validator, and patch artifacts for `case-public-sector-ai-policy-audit-001`; remaining limitation is that the benchmark dossier lacks real external policy, model validation, subgroup, appeal-access, and operational-monitoring artifacts.

The strategic gated diligence repeat-2 slice adds the first non-remedial repeated-run check for the original strategic case:

- Direct answer: preserves the diligence-versus-launch distinction and names update conditions, but remains prose-only and low traceability.
- Light structured answer: clarifies gate, unknowns, and guardrails in a table, but still lacks addressable criteria, review gate state, and dependency closure.
- Full OfOne answer: preserves evidence hashes, claims, actors, criteria, open unknowns, gate, trigger closure, Map rendering, validator, and patch artifacts for `case-strategic-gated-diligence-001` repeat 2; remaining limitation is that the benchmark dossier still provides only scenario-level evidence rather than a real launch checklist or named reviewer.

The scientific mechanism repeat-2 slice adds the first repeated-run check for the scientific case:

- Direct answer: again blocks intervention reliance and states the evidence gaps, but remains prose-only and cannot expose dependency closure.
- Light structured answer: improves decision usability with a validation checklist, but measurement, confounder, and update dependencies remain non-addressable.
- Full OfOne answer: preserves measurement quality, mechanism confidence, hidden-variable pressure, criteria, gate, trigger closure, Map rendering, validator, and patch artifacts for `case-scientific-mechanism-check-001` repeat 2; remaining limitation is still the abstract scenario-level evidence rather than real measurement and replication data.

The regulated wastewater repeat-2 slice adds a repeated-run check for the hybrid wastewater case:

- Direct answer: again blocks operational launch while allowing diligence, but leaves permit, pilot, partner, and customer dependencies as prose.
- Light structured answer: clarifies decision posture, approval condition, and evidence gaps in a compact table, but still lacks typed criteria, gate state, and patch closure.
- Full OfOne answer: preserves generic public EPA evidence identity, case-native benchmark trace, launch-blocking unknowns, criteria, gate, trigger closure, Map rendering, validator, and patch artifacts for `case-regulated-wastewater-market-entry-001` repeat 2; remaining limitation is still that generic source-backed evidence cannot resolve jurisdiction-specific launch authority.

The formal proof-search repeat-2 slice adds a repeated-run check for the formal-adapter case:

- Direct answer: again identifies proof and countermodel obligations, but proof state, timeout risk, and falsification pressure remain prose-only.
- Light structured answer: clarifies lemma, checker, and countermodel tasks, but cannot expose dependency closure from a changed checker result to the recommendation.
- Full OfOne answer: preserves formal evidence identity, proof-certificate absence, candidate lemma obligation, countermodel pressure, criteria, trigger closure, Map rendering, validator, and patch artifacts for `case-formal-proof-search-001` repeat 2; remaining limitation is still that the benchmark dossier lacks actual axiom, theorem, checker, or countermodel artifacts.

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
