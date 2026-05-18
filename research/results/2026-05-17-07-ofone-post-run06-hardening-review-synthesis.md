# Run 07 Local Synthesis

Source report: `research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md`

Conversation: https://chatgpt.com/c/6a0a6259-357c-83e8-b67a-6db72e4af30a

## Local Adjudication

Run 07 is accepted as benchmark-hardening counsel, not empirical proof of OfOne superiority.

Accepted direct observations:

- The Run 06 remediation materially closed the exact wrong-case copied-artifact defect by combining case-binding checks, pre-score compliance gates, semantic-fidelity fields, machine-artifact hashes, excluded-run logging, and matrix state semantics.
- The first-slice `full_ofone` run is still excluded and should remain immutable.
- Broader Batch 01 execution should not resume until the excluded `full_ofone` path is rerun under strengthened workflow controls.

Accepted high-value findings:

| Priority | Finding | Decision | Implementation target |
| --- | --- | --- | --- |
| P0 | Rerun semantics are not explicit enough for excluded slots. | Accept. | Add matrix/manifest rerun policy, per-excluded-run rerun plan, and checker enforcement. |
| P0 | Full-OfOne benchmark artifacts are not bound to case/prompt/input hashes. | Accept. | Add run-bound provenance metadata and checker comparison against artifact `benchmark_trace` when a run is aggregate-eligible. |
| P1 | `superiorityReady()` is under-specified relative to declared minimums for repeated runs and model-family evidence. | Accept. | Recompute readiness from released, aggregate-eligible evidence and declare missing repeat/model-family evidence. |
| P1 | Public machine-check attestation is thin. | Accept narrow version. | Publish `npm run benchmark -- --json` output as a machine-readable attestation for the current benchmark state. |
| P2 | Runtime/token/cost telemetry is not published. | Defer. | Keep as benchmark telemetry backlog; do not block the rerun-protocol hardening pass. |
| P2 | Agentic-coding runtime environment is loosely described. | Defer. | Document when the next real benchmark run is executed. |

Rejected or limited findings:

- Do not rerun the excluded `full_ofone` path before the provenance and rerun protocol patch lands. The rerun is the next operating step after this hardening batch verifies and publishes.
- Do not mutate the original excluded artifact to add `benchmark_trace`; it is evidence of the failure mode and should remain immutable.

## Next Mode

Current next mode: `implement`.

After implementation, local verification, commit/push, and public Pages parity, the loop should move to `benchmark_handoff` for a controlled remedial `full_ofone` rerun, not another broad architecture review.
