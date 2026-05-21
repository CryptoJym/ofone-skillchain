# Regulated Wastewater Frontier Full-OfOne Mode A Controlled Execution Contract

Status: `executed_reviewed`
Protocol: `research/frontier-full-ofone-repair-protocol.md`
Mode: `Mode A: Controlled Non-Deep-Research Execution`
Prepared: `2026-05-21T05:58:00-06:00`
Executed: `2026-05-21T06:10:00-06:00`

This contract is the authorized local/operator-driven repair path for the excluded regulated wastewater frontier full-OfOne repeat-1 slot. It is not a launched ChatGPT Deep Research run. Its controlled Mode A rerun 1 output is completed, validator-valid, locally reviewed, and matrix-inserted only as replacement evidence for aggregate scoring.

## Run Metadata

Batch ID: `2026-05-17-batch-01`
Case ID: `case-regulated-wastewater-market-entry-001`
Arm ID: `full_ofone`
Model family: `frontier_reasoning`
Repeat: `1`
Run ID: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1`
Rerun of: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1`
Rerun number: `1`
Status before execution: `prepared_not_executed`
Aggregate policy before execution: `not_aggregate_eligible`
Status after execution: `reviewed`
Aggregate policy after execution: `replace_for_aggregate_only`

## Source Binding

Use only the frozen benchmark inputs listed here:

- Case file: `benchmarks/cases/regulated-wastewater-market-entry.md`
- Case file SHA-256: `sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16`
- Arm prompt: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
- Arm prompt SHA-256: `sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e`
- Input bundle SHA-256: `sha256:2849a7b8ab7af3553a448c44916d236e5cdd8dc4c4e37dd9fc5e3a18e4398b0b`

Canonical artifact-level `benchmark_trace` values:

```json
{
  "case_id": "case-regulated-wastewater-market-entry-001",
  "run_id": "2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1",
  "case_file": "benchmarks/cases/regulated-wastewater-market-entry.md",
  "case_file_sha256": "sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16",
  "prompt_file": "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
  "prompt_file_sha256": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
  "input_bundle_sha256": "sha256:2849a7b8ab7af3553a448c44916d236e5cdd8dc4c4e37dd9fc5e3a18e4398b0b"
}
```

## Required Raw Output Shape

The final raw Markdown output must begin with this exact first heading:

```markdown
# Benchmark Raw Output
```

It must then include exact run metadata with:

```markdown
Run ID: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1`
Rerun of: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1`
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
- Do not launch another same-shape ChatGPT Deep Research remedial rerun for this wastewater slot.
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

## Execution Result

Controlled rerun 1 was produced under this contract and preserved as separate raw, machine, and review artifacts:

- Raw output: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.md`
- Artifact JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.artifact.json`
- Validator JSON: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.validator.json`
- Rendering: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.rendering.md`
- Patch report: `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.patch.json`
- Local review: `benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.md`

Pinned SHA-256 values:

- Raw output: `sha256:eb8251313f684035e12f5ce9999645c8c1273663549bb2ee0da26021904e7fce`
- Artifact JSON: `sha256:99869ab95cb00d04ae611efbf89fbe65257c00ab845e02ef0581bb625794a4ee`
- Validator JSON: `sha256:9af57bff15e7bafc69ebe718f356b68d8e9a85cef11881ffe025fcb5587de793`
- Rendering: `sha256:6992173710a3394fe784f445e65fb2203dfd8fe6b86d17cf15ad6f95e674f5dd`
- Patch report: `sha256:520562c0394148f6fb21be4f4dcec4be93cff9bcfbf31a472f25a199fa1db45f`
- Local review: `sha256:929df0ac477a063c2577738673aeb4a606b81c788ccdf3945bcd80b397148c46`

The original regulated wastewater frontier full-OfOne run remains excluded and immutable. Rerun 1 is not a new predeclared slot; it is replacement evidence for aggregate scoring only after validation, local review, publication, and Pages parity.
