# Frontier Full-OfOne Repair Protocol

Status: `active_after_rerun5`
Batch: `2026-05-17-batch-01`
Case: `case-strategic-gated-diligence-001`
Arm: `full_ofone`
Model family: `frontier_reasoning`
Repeat: `1`

This protocol governs frontier full-OfOne replacement slots after completed frontier artifacts fail computed local validation before aggregate eligibility. The first strategic replacement is the controlled Mode A rerun 5 package. The regulated wastewater frontier full-OfOne slot later reused the same governed path and produced controlled Mode A rerun 1. The protocol remains active to preserve repair boundaries and block same-shape reruns.

## Evidence Basis

| Run | Outcome | Aggregate policy |
| --- | --- | --- |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1` | Completed and harvested, then excluded because computed local validation failed semantic graph checks. | `excluded_before_aggregate` |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun1` | Returned an advisory report instead of the benchmark package. | `not_aggregate_eligible` |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun2` | Returned package shape, but computed local validation failed required `movement_jobs` fields and tradeoff reversal-condition semantics. | `not_aggregate_eligible` |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun3` | Returned benchmark package sections, but omitted exact run metadata and failed current-schema `benchmark_trace` and relation-legality checks. | `not_aggregate_eligible` |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun4` | Returned a meta/advisory report titled `Running an Unspecified OfOne Benchmark Packet Exactly`. | `not_aggregate_eligible` |
| `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5` | Controlled Mode A non-Deep-Research package with raw output, artifact JSON, computed validator JSON, rendering, patch report, and local review. | `replace_for_aggregate_only` |
| `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1` | Completed and harvested, then excluded because computed local validation failed relation legality and relation-family checks. | `excluded_before_aggregate` |
| `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1` | Controlled Mode A non-Deep-Research package with raw output, artifact JSON, computed validator JSON, rendering, patch report, and local review. | `replace_for_aggregate_only` |

The repeated failure mode is now a process finding: attachment-led or same-shape ChatGPT Deep Research remedial launches are not a reliable way to produce these full-OfOne artifact packages. The valid controlled replacements came from the non-Deep-Research path and do not license another same-shape launch.

## Hard Rule

Same-shape Deep Research remedial reruns are barred for this slot.

Do not launch another attachment-only, pasted-file-only, or "run the attached packet exactly" ChatGPT Deep Research remedial attempt for this frontier full-OfOne replacement. A prepared packet or successful packet preflight is not enough to authorize another run.

## Allowed Next Modes

One of these modes must be selected before any further frontier full-OfOne replacement attempt.

### Mode A: Controlled Non-Deep-Research Execution

Use a controlled local or operator-driven execution path that can emit the required artifact package directly. The resulting package must include:

- raw Markdown wrapper beginning with `# Benchmark Raw Output`
- exact run metadata, including `Run ID:` and `Status: completed`
- artifact JSON with the canonical `benchmark_trace`
- computed local validator JSON
- rendering Markdown
- patch report JSON
- local review showing pre-score compliance before aggregate eligibility

The run cannot enter `remedial_runs`, aggregate comparison, or any superiority claim until `npm run validate`, `npm run benchmark`, local review, and Pages parity all pass.

Active Mode A contracts:

- `benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md`
- `benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md`

The first contract freezes strategic rerun 5 as `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5`. The second freezes regulated wastewater rerun 1 as `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1`. Both preserve the original excluded runs as immutable evidence and keep same-shape attachment-led Deep Research reruns barred. Both controlled reruns are executed, validator-valid, locally reviewed, and recorded in `remedial_runs` as `replace_for_aggregate_only`; run `npm run frontier:controlled:check` to verify exact run IDs, source hashes, machine artifact hashes, reviewed matrix insertion, and original-run immutability.

### Mode B: Inline Deep Research Launch Contract

Use ChatGPT Deep Research only if the visible first user message itself contains the full executable output contract inline. The visible message must include:

- exact run ID
- frozen case, prompt, and input-bundle hashes
- the exact `# Benchmark Raw Output` first-line requirement
- required `## Artifact JSON`, `## Validator Result`, `## Rendering`, and `## Patch Report` sections
- explicit instruction to return only the benchmark package, not a memo, report, analysis, or interpretation of the packet
- launch proof that the inline contract, not only an attachment label, was visible before `Start`

Even with valid launch proof, the run remains outside replacement eligibility until extracted artifacts pass computed local validation and local review.

## Escalation

If another attempt returns a meta/advisory report, omits the exact benchmark package contract, or cannot produce machine-checkable sidecars, stop Deep Research execution for this slot and use Mode A only.

## Publication Gate

Before publication or resubmission, run:

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

Superiority claims remain blocked until the benchmark matrix has released aggregate-eligible evidence across the required cases, repeats, and model families.
