# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-public-sector-ai-policy-audit-001`
- Arm ID: `light_structured`
- Model family: `agentic_coding`
- Repeat: `3`
- Run ID: `2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r3`
- Status: `completed`
- Case file: `benchmarks/cases/public-sector-ai-policy-audit.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/light_structured.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local public-sector AI policy repeat-3 slice, run 2 of 3

## Structured Answer

| Area | Assessment |
| --- | --- |
| Decision posture | Block live deployment; continue only with audit, controlled evaluation, and recorded review gates. |
| What is known | The case concerns a public-sector AI-assisted decision process constrained by performance, rights, legitimacy, review, and operations. |
| What is unknown | Deployment-population validity, subgroup impact, appeal accessibility, affected-party exposure, reviewer authority, review-log proof, and monitoring. |
| Primary risk | A public decision process could become opaque, biased, over-deferential to model output, or illegitimate without real review and contestability. |
| Release condition | Release requires model and subgroup evidence, rights and appeal evidence, named gate owners, review-log decisions, and monitoring controls. |
| Update condition | Patch the decision when model evidence, stakeholder objection, policy change, review-log decision, appeal test, or incident appears. |

## Key Risks, Unknowns, And Evidence Gaps

- Rights risk: affected people may receive consequential public decisions without notice, explanation, or appeal access.
- Legitimacy risk: human review may be symbolic instead of capable of blocking or changing outcomes.
- Performance risk: validation evidence may not match the deployment population, workflow, or subgroup distribution.
- Operational risk: reviewers may defer to model output without meaningful override authority or monitoring.
- Governance risk: reviewer ownership, gate status, and review-log evidence are missing.
- Evidence gap: the benchmark dossier contains no real external policy record, model card, subgroup audit, appeal test, review log, or incident plan.

## Recommendation

Use a staged audit sequence:

1. Assign the public decision owner, technical reviewer, rights reviewer, and affected-party representation.
2. Produce deployment-population performance evidence, subgroup-impact evidence, and calibration evidence.
3. Document notice, explanation, appeal, override, and contestability procedures.
4. Open public-policy, rights, model-evidence, operational, and review-log gates.
5. Record review-log decisions before any pilot or release.
6. Keep broad deployment blocked until gates close with evidence.

This lightweight answer remains human-readable and decision-useful, but it intentionally does not create typed evidence objects, stakeholder objects, review logs, or dependency closure. It makes no empirical superiority claim.
