# OfOne Post-Run Benchmark Hardening Review

Harvest source: ChatGPT Deep Research Run 07 at <https://chatgpt.com/c/6a0a6259-357c-83e8-b67a-6db72e4af30a>

Visible completion metadata: Research completed in 1h 12m; 14 citations; 9 searches; 17 May; 14 sources.

Harvest note: ChatGPT's export and copy controls were not accessible through the available automation path in this session. This Markdown preserves the completed report content visible through the ChatGPT accessibility tree and browser surface. Citation numbers are retained where visible, but source popover URLs were not harvestable through the blocked export path.

## Executive Summary

This report serves as the requested Run 07 post-Run06 hardening review, using the attached prompt/context packet as the governing scope: verify whether the public OfOne benchmark workflow absorbed the Run06 critique, determine whether the prior wrong-case artifact failure is now blocked, and recommend only concrete, repo-actionable hardening before broader Batch 01 execution continues.

The high-confidence conclusion is that the public repository did implement the core Run06 blocker set. The baseline benchmark checker now validates pre-score compliance gates, semantic-fidelity fields, case-binding for `full_ofone` artifacts, immutable validator/patch artifact hashes, excluded-run state, and overlapping matrix state semantics. The current Batch 01 manifest, execution matrix, review template, excluded-run log, and the updated first-slice review records all reflect those controls.

However, the workflow is not yet ready for broader execution without one more narrow hardening pass and an end-to-end remedial rerun. The excluded `full_ofone` slot is still the only public test of the failure mode, and it remains excluded. In addition, two concrete gaps remain: the public workflow still lacks explicit rerun semantics for excluded slots, and the current case-binding check is only partial provenance binding because it verifies `artifact_identity.case_id` and optional `benchmark_trace.run_id`, but does not require a case/input/source hash match against the benchmark dossier.

| Question | Answer | Basis |
| --- | --- | --- |
| Executive verdict | Defer broader Batch 01 execution. The post-Run06 hardening is materially correct, but it still needs a controlled remedial rerun plus a small provenance/rerun pass before wider execution. | The critical controls are present, but the excluded slot remains unresolved and rerun mechanics are not yet formalized. |
| Can the next Batch 01 slice run now? | No. Not on a broader basis. The safer next action is to rerun the excluded `full_ofone` path first under the hardened workflow. | The first-slice `full_ofone` slot remains excluded, and the public workflow has not yet demonstrated a passing case-native rerun. |
| Must the excluded full-OfOne slot be rerun before broader execution? | Yes. | The excluded-run log explicitly says that slot must be rerun with a case-native artifact before it can be compared. |
| Is any empirical superiority claim supported? | No. | The suite's own minimums are much larger than the current public state, and both manifest and matrix explicitly block superiority claims. |

The public materials also do not publish quantitative latency, token, or cost telemetry for the benchmark runs, and they do not publish the local command outputs or CI attestations behind the maintainer's statement that `npm run benchmark`, `npm run research:check`, and `npm run pages:check` passed. Those remain unverified self-reports or unspecified items, not public proof.

## Scope and Evidence Base

The report states that it directly inspected the benchmark suite, Batch 01 manifest, execution matrix, review template, excluded-run log, summary, failure-analysis placeholder, case dossier, rubric, arm prompts, Run06 result and ledger, the three first-slice raw outputs, the rejected `full_ofone` artifact plus its validator/patch artifacts, the three local review files, and the key enforcement code in `scripts/ofone-benchmark.mjs`, `scripts/ofone-research-check.mjs`, `scripts/ofone-pages-check.mjs`, and `docs/validation-model.md`. For current public state, it also inspected the current main-branch manifest and execution matrix, which expose the same first-slice state visible publicly.

The evidentiary posture is split into repo facts, maintainer self-reports, and inference. Repo facts are claims directly supported by inspected public files or code. Maintainer self-reports are claims recorded in the attached packet or tracker/manifest metadata, such as local command passes and Deep Research launch metadata. Inferences are analytical conclusions from the inspected repo state, such as the risk of provenance spoofing or the incompleteness of rerun semantics.

The public packet is narrower than the user-assumed evidence envelope. Run results, artifacts, failure logs, and hardening actions are present. Quantitative performance metrics, quantitative regression telemetry, full local test outputs, CI logs, the agentic-coding runtime environment, and explicit rerun protocol semantics are not publicly specified.

## Observed State and Blocker Audit

Run06's core empirical outcome is stable across the public materials: only three Batch 01 run slots have been completed/reviewed so far; `direct_answer` and `light_structured` are aggregate-eligible; the first-slice `full_ofone` run is explicitly excluded because the artifact is a copied example tied to `case-strategy-micro-001` and a wastewater market-entry objective rather than the benchmark case `case-strategic-gated-diligence-001`.

The raw full-OfOne output itself admits that it is a copied strategic Micro example, the artifact JSON confirms the wrong objective and case identity, the validator artifact still passes schema/semantic validation, and the review/failure-analysis/excluded-run materials now consistently treat that as a benchmark-invalid run.

| Run06 blocker | Current public implementation | Status | Residual note |
| --- | --- | --- | --- |
| Benchmark-case binding for `full_ofone` runs | `scripts/ofone-benchmark.mjs` compares `artifact_identity.case_id` to the run's `case_id` and additionally compares `benchmark_trace.run_id` if that field exists. The matrix records the rejected slot as `aggregate_eligible=false` with `case_fidelity=fail`. | Implemented | Binding is still partial because `benchmark_trace.run_id` is optional and no dossier/input hash is checked. |
| Pre-score compliance gate with auto-reject semantics | The review template requires case fidelity, required outputs, independence, no-superiority compliance, and auto-reject before aggregate scoring. The checker fails if failed gate fields do not force `auto_reject=true` and `aggregate_eligible=false`. | Implemented | Strong control; no major design gap at this layer. |
| Immutable validator and patch artifact capture | The execution matrix records `validator_json`, `validator_sha256`, `patch_json`, and `patch_sha256`; the benchmark checker recomputes hashes and fails mismatches; the public validator and patch artifacts are present for the excluded slot. | Implemented | Good control, but still only validates the artifact that was produced, not whether the artifact came from the correct input dossier. |
| Semantic-fidelity review fields | The review template and checker require `case_binding`, `copied_example_risk`, `evidence_provenance_adequacy`, and `artifact_source_identity`; the updated review files populate them. | Implemented | Still human-authored rather than machine-derived. |
| Matrix state semantics | The checker enforces that reviewed runs remain visible as completed runs, excluded runs remain visible as reviewed runs, and the matrix documents overlap semantics. | Implemented | This closed the specific Run06 bookkeeping inconsistency. |
| Excluded-run logging | The manifest points to an excluded-run log, the log exists, and the checker validates excluded-run entries plus independent adjudication state. | Implemented | The log says the slot "must be rerun," but the public protocol does not yet define how reruns are represented. |

The exact Run06 failure mode should now be blocked if the published benchmark checker is run and its failures are treated as blocking. A stronger spoofing variant remains possible because case binding is not yet tied to a declared case-dossier hash or source bundle hash.

The release guard is preserved. The suite minimum before superiority claims requires three cases per family, 21 total cases, three runs per case/arm, two model families, and published failure analysis. The current manifest and matrix keep `superiority_claims_allowed=false`, and the Batch 01 state is still only three completed/reviewed slots out of 90 with one excluded full-OfOne run. No empirical superiority claim is supported.

## Root Causes and Remaining Gaps

The original Run06 defect was straightforward: the workflow treated artifact validity as though it were benchmark validity. The raw `full_ofone` output explicitly said the artifact was copied from the validated strategic Micro example; the artifact JSON still carried the wastewater market-entry objective and `case-strategy-micro-001`; the validator JSON still passed; and the patch JSON still operated on the copied object lineage.

The current hardening blocks the same observed mistake, but it does not yet fully bind artifacts to benchmark inputs, it does not define public rerun semantics, and one release-safety helper is still under-specified relative to the declared suite minimums.

| Major issue | Evidence | Affected components | Reproducible steps | Assessment |
| --- | --- | --- | --- | --- |
| Wrong-case copied artifact caused the original exclusion | Raw output says the artifact is copied from the strategic Micro example; artifact JSON names a wastewater market-entry objective and `case-strategy-micro-001`; validator JSON still passes. | Output generation, review gate, aggregate scoring logic | Compare the case dossier's objective with the raw `full_ofone` output and artifact JSON; inspect validator pass output. | Resolved for the exact observed defect by current checker/gates. |
| Provenance binding remains partial | The checker only compares `artifact_identity.case_id` and optional `benchmark_trace.run_id`; the artifact has no `benchmark_trace` block in the inspected excluded example; no manifest field declares dossier or source hashes. | `scripts/ofone-benchmark.mjs`, run schema/records, artifact contract | Inspect `checkFullOfOneCaseBinding`; inspect the artifact JSON and confirm no mandatory dossier-binding metadata is enforced. | High-value remaining gap; it permits a spoofed near-variant even though the exact Run06 defect is blocked. |
| Rerun protocol is unspecified | The excluded-run log says the slot must be rerun, but no `rerun` handling appears in the checker, matrix, or manifest. | Manifest, execution matrix, checker, results bookkeeping | Search the benchmark checker, matrix, and manifest for rerun semantics; compare with excluded-run log language. | Blocker for clean remediation execution; the repo says "rerun" but does not define how. |
| Superiority-readiness helper is incomplete relative to declared minimums | The suite minimums include `runs_per_case_per_arm` and `model_families`; plan validation warns on those counts, but `superiorityReady()` only checks family coverage, total case count, `results_release`, and `failure_analysis`. | `scripts/ofone-benchmark.mjs`, future release gating | Compare suite minimum fields with `superiorityReady()` logic. | Medium-high future safety defect; not a blocker for the next rerun, but a blocker before any later superiority-ready release logic is trusted. |

## Hardening Plan

The narrow Run07 hardening objective should be to prove the repaired workflow works end to end, not to reopen OfOne broadly. The smallest credible plan is: strengthen provenance binding, add explicit rerun semantics, rerun the excluded `full_ofone` path under the hardened workflow, publish machine-check outputs, and only then resume broader Batch 01 execution.

| Area | Current public state | Proposed Run07 hardening | Effort | Risk | Expected impact |
| --- | --- | --- | --- | --- | --- |
| Artifact provenance binding | Case binding checks `artifact_identity.case_id` and optional `benchmark_trace.run_id`, but nothing binds the artifact to a declared case-dossier hash or source bundle hash. | Require a run-bound provenance block for every `full_ofone` artifact, ideally including `benchmark_trace.case_id`, `benchmark_trace.run_id`, `case_file_sha256`, `prompt_file_sha256`, and `input_bundle_sha256`, and fail the checker if any required value is absent or mismatched. | Medium | Low | Closes the remaining high-value spoofing gap. |
| Rerun semantics | Public logs say the excluded slot must be rerun, but the matrix/checker do not define `rerun_of`, replacement rules, or whether a rerun consumes a planned repeat. | Add explicit rerun metadata such as `rerun_of`, `rerun_reason`, and `aggregate_policy`, while preserving the excluded original immutable. | Small to medium | Low | Prevents historical mutation and keeps auditability clean. |
| End-to-end validation of the fix | The excluded slot is still excluded; no public passing case-native `full_ofone` rerun exists yet. | Execute the remedial rerun first, using the hardened provenance checks and publishing validator/patch/checker outputs. | Small operationally after code patch | Low | Converts the current fix from design intent into demonstrated workflow evidence. |
| Release-readiness computation | Current manifest/matrix manually block superiority claims, but `superiorityReady()` does not fully enforce the suite's minimums for repeated runs and model-family evidence. | Recompute readiness from released, aggregate-eligible results, including minimum repeated runs and minimum model-family coverage. | Medium | Medium | Future-proofs the release guard and prevents false readiness later. |
| Public checker attestation and telemetry | The packet reports local checker passes, but the corresponding benchmark/research/pages outputs are not publicly attached; quantitative runtime/token telemetry is not published. | Publish machine-readable checker outputs and lightweight run telemetry fields such as started/finished timestamps, validator duration, and token/time estimates when available. | Small | Low | Improves auditability and future regression tracking. |

Recommended sequence:

1. Add provenance-binding fields and checker enforcement.
2. Add explicit rerun semantics to manifest/matrix/results model.
3. Add negative fixtures and checker regressions.
4. Publish checker outputs and Pages parity evidence.
5. Rerun excluded full-OfOne path with a case-native artifact.
6. Review and adjudicate rerun for aggregate eligibility.
7. Resume broader Batch 01 execution only if rerun passes.

## Verification, Rollback, and Missing Data

Minimum useful verification set:

| Required test | What it proves | Acceptance criterion |
| --- | --- | --- |
| Negative wrong-case artifact fixture | The exact Run06 failure still fails. | A copied artifact with a mismatched `artifact_identity.case_id` must fail case binding or be auto-rejected before aggregate scoring. |
| Negative forged-binding fixture | Provenance spoofing is closed. | An artifact whose `case_id` is edited to match but whose dossier/source hash does not match the declared benchmark input must fail once the proposed provenance block is added. |
| Negative machine-artifact hash mismatch | Immutable machine-artifact capture still works. | Any validator/patch artifact hash mismatch must fail the checker. |
| Negative excluded-run bookkeeping fixture | State semantics remain auditable. | Any excluded run missing from `reviewed_runs`, or any reviewed run missing from `completed_runs`, must fail. |
| Positive remedial rerun | End-to-end workflow correctness is demonstrated. | The rerun must produce a case-native artifact, pass pre-score compliance, carry valid machine artifacts, remain no-superiority compliant, and be explicitly adjudicated as aggregate-eligible before broader execution resumes. |

The verification plan should publish at least four artifacts together: the updated checker result, the rerun raw output, the rerun artifact/validator/patch trio, and the adjudicated rerun review. The public manifest/matrix should expose rerun semantics clearly enough that an external reviewer can tell whether the rerun replaces an excluded slot, supplements it, or consumes a planned repeat.

Rollback should be conservative. If the remediation patch or rerun fails, retain the current excluded slot exactly as excluded, preserve the original artifacts immutably, keep `aggregate_scoring_allowed=false` and `superiority_claims_allowed=false`, and revert only the new hardening commit or mark the rerun as failed without mutating prior evidence.

Remaining missing or unspecified items include checker command outputs or CI attestations for the claimed local pass state; explicit rerun semantics; quantitative run telemetry such as tokens/latency/runtime; and stronger environment details for the `agentic_coding` execution surface.

Final decision: accept the post-Run06 hardening as a materially correct remediation of the original blocker set; reject the idea that broader Batch 01 execution should continue immediately; defer wider execution until the repo adds explicit rerun semantics, strengthens provenance binding, and successfully reruns the excluded `full_ofone` path under the hardened workflow. No empirical superiority claim is supported.
