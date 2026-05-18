# Raw Benchmark Output

## Run Metadata

- Batch ID: `2026-05-17-batch-01`
- Case ID: `case-strategic-gated-diligence-001`
- Arm ID: `full_ofone`
- Model family: `agentic_coding`
- Repeat: `1`
- Run ID: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1`
- Status: `completed`
- Case file: `benchmarks/cases/strategic-gated-diligence.md`
- Prompt file: `benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md`
- Rubric: `benchmarks/rubrics/decision-map-rubric.md`
- Actual order: local slice 1, run 3 of 3

## Artifact JSON

Artifact file:

`benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.artifact.json`

This is a copied raw-run artifact from the current validated strategic Micro example. It is stored as JSON beside this Markdown output rather than inlined, so the run has a machine-readable artifact while the raw Markdown remains reviewable.

Independent Run 06 later rejected this slot from aggregate scoring because the copied artifact is not bound to `case-strategic-gated-diligence-001`; schema-valid is not benchmark-valid.

## Validator Result

Command:

```bash
node scripts/ofone-validate.mjs --json benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.artifact.json
```

Observed result:

- passed: `true`
- schema profile: Micro artifact matches executable JSON Schema profile
- adapter contract: hybrid adapter contract loaded
- gate coverage: compliance and reputation gate coverage present
- dependency closure: trigger `T1` reaches `C1`, `C2`, `COUNCIL`, `KT1`, `L1`, `LENS1`, `LENS2`, `LENS3`, `O1`, `OFONE-strategy-micro-001`, `R1`, `T1`, `TEMPORAL`, `TS1`, `X1`, `X2`, including rendering
- semantic validation: completed

Immutable validator artifact:

`benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.validator.json`

SHA-256: `4ba12cd353b24ee34e57f28ffb407cceebf1c11c07eece6c1969e30e80782a04`

## Rendering

# OfOne Executive Decision Brief

## Decision

- Approve a reversible diligence move, not full entry.

## Confidence

- medium: Do not launch operationally. Run a gated diligence sprint.

## Why

- C1: Current evidence is insufficient for full operational market entry. (active, confidence=high)
- C2: A gated diligence move is more reversible than launch. (active, confidence=medium)

## Decision Surface

- CR1: must threshold; Gate safety; threshold=Do not release or launch while required gate remains open.
- CR2: should objective; Unknown resolution value; threshold=Prefer moves that resolve rendering-blocking unknowns before irreversible action.
- CR3: must constraint; Affected-party exposure; threshold=Do not hide material exposure to affected parties.
- TS1: dominant=O1; criteria=CR1, CR2, CR3; reverses_on=U1, T1

## Blocking Unknowns

- U1: Target segment, jurisdiction, and pilot-performance evidence are not yet specified.; blocks=O1, R1; resolution=Collect segment, jurisdiction, and pilot-performance evidence before operational entry.

## Next Best Evidence

- U1: impact=high; cost=low; risk_reduction=high; next=Collect segment, jurisdiction, and pilot-performance evidence before operational entry.

## What Would Change This

- T1: new_evidence -> patch; changes rendering

## Human Gates

- G1: open; customer commitment, permit filing, compliance exposure, reputation exposure, or operational launch; reviewer=human regulatory and business owner

## Patch Report

Command:

```bash
npm run patch -- benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.artifact.json --operation trigger_activation T1
```

Patch result summary:

- operation: `trigger_activation`
- changed object: `T1`
- trigger transition: `patch`
- trigger affected object: `E1`
- affected closure size: 16 downstream objects
- affected layers: argumentative, causal, evidential, workflow_state
- invalidated claims: `C1`, `C2`
- rendering affected: `true`
- rendering regeneration required: `true`
- required revalidation: JSON Schema, semantic validation, decision-surface check, temporal-validity check, trigger-transition check, council-review check, rendering regeneration

Next patch steps:

1. Reassess affected claims `C1` and `C2`.
2. Regenerate decision rendering after validation passes.
3. Record trigger state change in patch history or review log.

Immutable patch artifact:

`benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.patch.json`

SHA-256: `8abecdbe35662f35aedc1d5f6eabe4e468e7dfa10e3c48393eccc804e1c83f55`

## Release Note

This raw output is one completed run slot. It has been locally reviewed and independently adjudicated. The run is excluded from aggregate benchmark evidence until rerun with a case-native artifact.
