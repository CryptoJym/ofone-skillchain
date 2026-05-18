# Batch 01 Review Template

## Review Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID:
- Arm ID:
- Run ID:
- Reviewer:
- Review date:
- Blinding status: `blinded | partially_blinded | unblinded`

## Pre-Score Compliance Gate

Complete this gate before metric scoring. Any `fail` in the first four rows requires `Auto-reject before aggregate scoring: yes`, regardless of later metric scores.

| Check | Result | Notes |
| --- | --- | --- |
| Case fidelity | `pass | fail | unknown` | Does the output answer the exact benchmark case and not a copied or adjacent example? |
| Required outputs present | `pass | fail | unknown` | Does the output satisfy the arm prompt's required artifacts or sections? |
| Independence from other arms/examples | `pass | fail | unknown` | Did the run avoid inspecting or reusing another arm/example artifact unless explicitly allowed? |
| No-superiority compliance | `pass | fail | unknown` | Does the output avoid unsupported benchmark or method-superiority claims? |
| Auto-reject before aggregate scoring | `yes | no` | Required when any gate row fails. |

## Semantic Fidelity

- Case binding:
- Copied-example risk:
- Evidence provenance adequacy:
- Artifact/source identity:

## Scores

Score each metric from 1 to 5. Use `NA` only when the case does not exercise that metric.

| Metric | Score | Rationale |
| --- | ---: | --- |
| decision_quality |  |  |
| evidence_grounding_precision |  |  |
| uncertainty_calibration |  |  |
| trace_completeness |  |  |
| auditability |  |  |
| update_quality |  |  |
| cost |  |  |
| inter_run_stability |  |  |

## Required Notes

- Strongest decision-relevant contribution:
- Most important unsupported claim or missing evidence:
- Hidden variable or unknown that changed the review:
- Gate, safety, or release concern:
- Patch/update behavior, if applicable:
- Failure mode observed:

## Adjudication

- Accept run for aggregate scoring: `yes | no`
- If no, reason:
- Reviewer confidence: `low | medium | high`
