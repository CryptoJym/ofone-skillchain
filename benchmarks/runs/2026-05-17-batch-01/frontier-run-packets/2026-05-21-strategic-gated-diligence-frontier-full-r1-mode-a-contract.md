# Frontier Full-OfOne Mode A Controlled Execution Contract

Status: `prepared_not_executed`
Protocol: `research/frontier-full-ofone-repair-protocol.md`
Mode: `Mode A: Controlled Non-Deep-Research Execution`
Prepared: `2026-05-21T03:02:51-06:00`

This contract is the only authorized next local/operator-driven repair path for the unrepaired frontier full-OfOne strategic gated diligence repeat-1 slot. It is not a completed benchmark run, not a launched ChatGPT Deep Research run, and not aggregate evidence.

## Run Metadata

Batch ID: `2026-05-17-batch-01`
Case ID: `case-strategic-gated-diligence-001`
Arm ID: `full_ofone`
Model family: `frontier_reasoning`
Repeat: `1`
Run ID: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5`
Rerun of: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1`
Rerun number: `5`
Status before execution: `prepared_not_executed`
Aggregate policy before execution: `not_aggregate_eligible`

## Source Binding

Use only the frozen benchmark inputs listed here:

- Case file: `benchmarks/cases/strategic-gated-diligence.md`
- Case file SHA-256: `sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942`
- Arm prompt: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
- Arm prompt SHA-256: `sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e`
- Input bundle SHA-256: `sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44`

Canonical artifact-level `benchmark_trace` values:

```json
{
  "case_id": "case-strategic-gated-diligence-001",
  "run_id": "2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5",
  "case_file": "benchmarks/cases/strategic-gated-diligence.md",
  "case_file_sha256": "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
  "prompt_file": "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
  "prompt_file_sha256": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
  "input_bundle_sha256": "sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44"
}
```

## Required Raw Output Shape

The final raw Markdown output must begin with this exact first heading:

```markdown
# Benchmark Raw Output
```

It must then include exact run metadata with:

```markdown
Run ID: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5`
Rerun of: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1`
Status: `completed`
```

It must include actual case-bound sections:

- `## Artifact JSON`
- `## Validator Result`
- `## Rendering`
- `## Patch Report`

Do not return a memo, report, analysis of this contract, research narrative, or advisory plan. Return only the benchmark package.

## Controlled Execution Rules

- Do not use attachments as the execution contract.
- Do not launch another same-shape ChatGPT Deep Research remedial rerun.
- Do not inspect outputs from other benchmark arms while authoring the replacement.
- Do not reuse the excluded original or any failed remedial artifact as the replacement artifact.
- Do not insert this run into `remedial_runs` before the required output package exists and passes computed local validation.
- Do not grant aggregate eligibility, compare aggregates, or make superiority claims before local review and Pages parity pass.

## Required Local Verification

After a controlled output package exists, run:

```bash
npm run frontier:controlled:check
npm run frontier:protocol:check
npm run schema:check
npm run validate
npm run review:check
npm run research:check
npm run benchmark
npm test
```

After commit and push, run:

```bash
npm run pages:check
```

Superiority claims remain blocked.
