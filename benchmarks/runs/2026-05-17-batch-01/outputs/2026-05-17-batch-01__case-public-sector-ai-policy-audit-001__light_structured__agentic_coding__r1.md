# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-public-sector-ai-policy-audit-001`
- Arm ID: `light_structured`
- Model family: `agentic_coding`
- Repeat: `1`
- Run ID: `2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r1`
- Status: `completed`
- Case file: `benchmarks/cases/public-sector-ai-policy-audit.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/light_structured.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local public-sector AI policy slice, run 2 of 3

## Structured Answer

| Area | Assessment |
| --- | --- |
| Decision posture | Block live deployment; continue with a gated audit and evidence pass. |
| What is known | The case is a public-sector AI-assisted decision process with performance, rights, legitimacy, review, and operational constraints. |
| What is not known | Model validity, subgroup impact, appeal access, reviewer authority, completed review log, and operational monitoring design. |
| Best next step | Build an audit dossier that separates model evidence, policy claims, stakeholder exposure, gates, and review logs. |
| Release condition | Release only after performance, rights, contestability, and human-review gates are satisfied and recorded. |
| Update condition | New model evidence, stakeholder objection, policy-rule change, review decision, or operational incident should patch the decision map. |

## Key Risks, Unknowns, And Evidence Gaps

- Rights risk: affected people may face errors without adequate notice, explanation, or appeal.
- Legitimacy risk: public trust may be harmed if the review process is symbolic or opaque.
- Performance risk: model evidence may not match the deployment population.
- Operational risk: caseworkers may defer to the AI output without meaningful override.
- Governance risk: gate ownership and review-log proof are not established.
- Evidence gap: no source-backed model validation, subgroup audit, appeal-access test, or completed human review exists in the benchmark dossier.

## Recommendation

Use a gated audit sequence:

1. Define the decision owner, technical reviewer, and affected-party representation.
2. Produce model-performance and subgroup-impact evidence for the deployment population.
3. Document notice, explanation, contestability, override, and appeal procedures.
4. Create explicit public-policy and rights gates with named reviewer authority.
5. Record review-log decisions before release.
6. Treat live deployment, irreversible automation, or broad rollout as blocked until the gate is closed with evidence.

This structured answer is intentionally conservative because the case is high-stakes and evidence-light. It does not support any empirical superiority claim for an evaluation method.
