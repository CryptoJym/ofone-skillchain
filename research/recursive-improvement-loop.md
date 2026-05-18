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

## Heartbeat Contract

On every heartbeat:

1. Read the tracker and the active run-scoped status ledger.
2. Inspect the live external research surface when available.
3. If the visible status materially changed, update the status ledger first, then the tracker summary.
4. If complete, harvest faithfully before synthesis.
5. Adjudicate findings before implementation.
6. Implement only accepted, high-value findings whose evidence survives local verification.
7. Run the required local checks.
8. Commit and push accepted changes.
9. Confirm public visibility before resubmission.
10. Decide the next mode: `resubmit`, `benchmark_handoff`, `converged`, `blocked`, or `observe`.

## Convergence Boundary

The loop is indefinite at the operating level and finite at the cycle level.

Convergence does not mean OfOne can never improve. It means the current objective has no unimplemented high-value recommendation under the active rubric. New benchmark failures, new external evidence, new model capabilities, or a changed objective can reopen the loop as a new cycle.

## Current Active Run

- Run: 07, OfOne Post-Run06 Benchmark Hardening Review.
- Conversation: https://chatgpt.com/c/6a0a6259-357c-83e8-b67a-6db72e4af30a
- Status ledger: `research/status/2026-05-17-07-ofone-post-run06-hardening-review.md`
- Target result: `research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md`
- Current mode: `waiting_on_external_research`.

