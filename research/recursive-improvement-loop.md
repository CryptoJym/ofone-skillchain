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
- Current mode: `benchmark_handoff`.
- Latest bounded action: remedial `full_ofone` benchmark rerun 1 for `case-strategic-gated-diligence-001`, `case-scientific-mechanism-check-001` / `agentic_coding` repeat-1, `case-regulated-wastewater-market-entry-001` / `agentic_coding` repeat-1, `case-formal-proof-search-001` / `agentic_coding` repeat-1, `case-public-sector-ai-policy-audit-001` / `agentic_coding` repeat-1, `case-strategic-gated-diligence-001` / `agentic_coding` repeat-2, `case-scientific-mechanism-check-001` / `agentic_coding` repeat-2, `case-regulated-wastewater-market-entry-001` / `agentic_coding` repeat-2, `case-formal-proof-search-001` / `agentic_coding` repeat-2, `case-public-sector-ai-policy-audit-001` / `agentic_coding` repeat-2, `case-strategic-gated-diligence-001` / `agentic_coding` repeat-3, `case-scientific-mechanism-check-001` / `agentic_coding` repeat-3, `case-regulated-wastewater-market-entry-001` / `agentic_coding` repeat-3, and `case-formal-proof-search-001` / `agentic_coding` repeat-3 have been produced under the hardened workflow and are Pages-confirmed.
- Next bounded action: continue controlled Batch 01 benchmark execution by selecting the next predeclared uncompleted slice under the hardened provenance and rerun protocol.
