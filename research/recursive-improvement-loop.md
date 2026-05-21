# OfOne Recursive Improvement Loop

This is the standing control plane for improving OfOne through external Deep Research, local implementation, public verification, and resubmission.

The loop may stay alive under a heartbeat, but each cycle is bounded and evidence-gated. The heartbeat is an orchestration mechanism, not proof that progress occurred.

## Loop State

```text
observe -> harvest -> adjudicate -> implement -> verify -> publish -> resubmit -> observe
```

Allowed terminal or pause states:

```text
converged | benchmark_handoff | blocked | waiting_on_external_research | waiting_on_publication
```

## Non-Negotiable Invariants

- A prepared prompt or context packet is not a launched run.
- A launched run requires visible Deep Research plan, Start or countdown, active research state, and stop-control evidence.
- Deep Research launch and observation must use the Chrome extension/plugin as the primary browser surface. Browser, Computer Use, coordinate clicking, AppleScript/JXA, and generic desktop automation are not automatic fallbacks because they can hijack the user's active workspace; if extension control is unavailable, troubleshoot extension availability first and leave the packet `prepared`/`blocked` until extension control is restored or the blocker is proven.
- An active run is not harvestable until a completed report is visible.
- A recommendation is not accepted until local adjudication separates direct observations, self-reported claims, inferences, open gaps, accepted findings, rejected findings, deferred findings, and unresolved blockers.
- A follow-on run is not launched until accepted findings have been implemented, verified locally, committed, pushed, and made visible through public repo or Pages surfaces.
- The loop must not overwrite unrelated local edits.
- Every cycle must produce at least one durable artifact: a harvested report, sidecar, synthesis, implementation commit, benchmark result, explicit rejection, deferred backlog, or no-op status proof.

## Recursive Learning Rule

Recursive learning means the system can continue revisiting OfOne after each public state change. It does not mean every pass should expand the ontology.

Use this decision procedure:

```text
external finding has P0/P1 release impact -> implement or reject with evidence, then resubmit
external finding exposes benchmark failure -> harden benchmark workflow, rerun affected slice, then resubmit if needed
external finding is repeated and non-blocking -> record as stale/deferred; do not relaunch broad architecture review
external finding is empirical uncertainty -> switch to benchmark execution
no new high-value finding -> mark converged for this objective and move to observe/benchmark mode
active external run still researching -> update ledger only on material status change
```

## Active Research Watchdog

Active external research is a live dependency, not a work item to restart.

Use this watchdog whenever the external surface still shows active research or stop-control:

```text
completed report visible -> harvest faithfully
auth/browser access blocked -> record blocked observation and stop local speculation
material progress changed -> update run ledger and tracker
unchanged but within normal interval -> make no file changes
unchanged after stall threshold -> record possible active-run stall, keep observing
stop-control still present -> do not stop, relaunch, or open a replacement run
```

Material progress means at least one visible research-state field changed: plan title, plan step completion, active step label, status text, search/source count, completed-report metadata, error/auth state, or stop-control availability.

The default stall threshold is 15 minutes since the last material status update while the run still shows active research. A stall note is status evidence only; it does not authorize stopping the run or launching a replacement. A long stall can move the loop to `blocked` only when browser access is unavailable, the external surface reports an unrecoverable error, or an operator explicitly changes the run state.

## Heartbeat Contract

On every heartbeat:

1. Read the tracker and the active run-scoped status ledger.
2. Inspect the live external research surface when available.
3. Apply the Active Research Watchdog before editing files.
4. If the visible status materially changed, update the status ledger first, then the tracker summary.
5. If complete, harvest faithfully before synthesis.
6. Adjudicate findings before implementation.
7. Implement only accepted, high-value findings whose evidence survives local verification.
8. Run the required local checks.
9. Commit and push accepted changes.
10. Confirm public visibility before resubmission.
11. Decide the next mode: `resubmit`, `benchmark_handoff`, `converged`, `blocked`, or `observe`.

## Convergence Boundary

The loop is indefinite at the operating level and finite at the cycle level.

Convergence does not mean OfOne can never improve. It means the current objective has no unimplemented high-value recommendation under the active rubric. New benchmark failures, new external evidence, new model capabilities, or a changed objective can reopen the loop as a new cycle.

## Current Active Run

- Latest run: 07, OfOne Post-Run06 Benchmark Hardening Review.
- Conversation: https://chatgpt.com/c/6a0a6259-357c-83e8-b67a-6db72e4af30a
- Status ledger: `research/status/2026-05-17-07-ofone-post-run06-hardening-review.md`
- Target result: `research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md`
- Local synthesis: `research/results/2026-05-17-07-ofone-post-run06-hardening-review-synthesis.md`
- Current mode: `benchmark_handoff`; no broad architecture review is active.
- Frontier full-OfOne repair protocol: `research/frontier-full-ofone-repair-protocol.md`
- Chrome-extension launch contract: `research/chrome-extension-deep-research-contract.md`
- Current Deep Research launch queue: `research/deep-research-launch-queue.json`
- Current Chrome-extension tab payloads: `research/deep-research-extension-payloads.json`
- Current Chrome-extension report intake: `research/deep-research-extension-report.json`
- Current manual recovery gate: `research/deep-research-manual-recovery.json`
- Latest bounded action: remedial `full_ofone` benchmark rerun 1 for `case-strategic-gated-diligence-001`, all five `agentic_coding` repeat-1 slices, all five `agentic_coding` repeat-2 slices, all five `agentic_coding` repeat-3 slices, all three `frontier_reasoning` strategic repeat-1 arms, and all three `case-regulated-wastewater-market-entry-001` / `frontier_reasoning` / repeat 1 arms have been produced or harvested under the hardened workflow. The strategic frontier direct-answer and light-structured arms are aggregate-eligible; the original strategic frontier full-OfOne arm completed at https://chatgpt.com/c/6a0e8476-9f6c-83e8-b201-ff3f97fae18b but is excluded before aggregate scoring because computed semantic validation failed. Remedial frontier full-OfOne reruns 1-4 are preserved as failed immutable evidence outside aggregate scoring and outside replacement eligibility. Controlled Mode A rerun 5, `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5`, is validator-valid, locally reviewed, recorded in `remedial_runs` as `replace_for_aggregate_only` replacement evidence, committed in `7068ea8`, pushed, and Pages-confirmed. The regulated wastewater frontier direct-answer and light-structured arms are aggregate-eligible; the original regulated wastewater frontier full-OfOne arm completed at https://chatgpt.com/c/6a0ee4ad-8854-83e8-866e-f671c12880da and has raw/artifact/validator/rendering/patch/review evidence, but computed local validation failed relation legality and relation-family checks. Controlled Mode A regulated wastewater rerun 1, `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1`, is validator-valid, locally reviewed, recorded in `remedial_runs` as `replace_for_aggregate_only` replacement evidence, committed in `c9364a8`, pushed, and Pages-confirmed. The formal proof-search frontier repeat-1 direct-answer arm from `benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-formal-proof-search-frontier-r1.md` completed in ChatGPT Deep Research at https://chatgpt.com/c/6a0f0a85-c75c-83e8-b0d0-4c15a041cb7b through the Chrome extension plugin. Visible metadata showed `Research completed in 10m`, `8 citations`, `101 searches`, title `Benchmark Raw Output`, and run metadata `Status: completed`; the report was harvested to `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__frontier_reasoning__r1.md`, locally reviewed, marked `reviewed`/aggregate-eligible in the local benchmark records, committed in `29669c4`, pushed, and Pages-confirmed. The formal proof-search `frontier_reasoning` repeat-1 `light_structured` report is completed-visible at https://chatgpt.com/c/6a0f1fe5-3494-83e8-9f92-1a2b732c4958 through Chrome extension control with visible metadata `Research completed in 9m`, `6 citations`, `120 searches`, report title `Benchmark Raw Output`, and run metadata `Status: completed`; raw Markdown harvest remains blocked by the cross-origin Deep Research iframe. `execution-matrix.json` now records this slot under `blocked_runs` with `completion.blocked=1`, `aggregate_eligible=false`, and links to the Chrome extension report plus manual recovery gate, so it is explicitly not reviewed, complete, aggregate-eligible, or publishable. The original excluded wastewater run remains immutable.
- Next bounded action: troubleshoot a Chrome-extension-safe raw Markdown harvest path for the completed-visible formal proof-search `frontier_reasoning` repeat-1 `light_structured` report, and run `npm run deep-research:manual-recovery:scan` before any source import to detect whether a marker-valid native ChatGPT Markdown export has appeared in the expected Downloads glob. If no valid export is present, leave the slot `completed_report_visible` with the blocker, allowed Chrome-extension probe ledger, and hash-bound manual recovery gate recorded. Do not use Browser, Computer Use, coordinate clicking, AppleScript/JXA, or generic desktop automation as fallback. OCR and screenshot reconstruction are also barred. The light-structured slot is not harvested, reviewed, complete, aggregate-eligible, or publishable until raw output is faithfully saved from a native ChatGPT Markdown export, locally reviewed, verified, committed, pushed, and Pages-confirmed. For the repaired strategic and regulated wastewater frontier full-OfOne slots, do not launch another same-shape Deep Research remedial rerun. Superiority claims remain blocked.
