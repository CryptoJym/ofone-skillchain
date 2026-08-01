# Question Geometry Enforcement Hardening

**Status:** Implemented on top of the 0.7.0 Question Geometry engine.
**Goal:** Close the gaps where the runtime still trusted agent narration instead of machine-checkable state.

## Why

The 0.7.0 engine already refused premature stops, but three trust gaps remained:

1. **Passes were honor-system.** A challenge pass (`frame_challenge`, `adversarial`, …) counted as complete the moment any question carrying its tag was marked answered — no evidence that the answer actually challenged anything.
2. **Answers had no provenance.** Nothing recorded where an answer came from, who or what the oracle was, or how it entered the state.
3. **History was editable.** The `history` array was plain JSON; an agent (or a bug) could rewrite, delete, or reorder answer events after the fact with no detection.

## What is enforced now

### 1. Runtime-issued, state-bound selection

`applyAnswer` refuses any question that is not simultaneously the engine's issued selection (`policy.current_question_id`) and in `selected` status. The only path to answering is: `step` issues a directive, and that exact question is answered. Attempting anything else throws `not the runtime-issued selection`.

### 2. Answer provenance and custody

The CLI accepts `--context <answer-context.json>` on `answer`. A context records `provenance`, the concrete `finding`, optional `oracle`, `evidence_refs`, `custody`, and `notes` (see [`examples/question-geometry/answer-contexts/frame-challenge.example.json`](../examples/question-geometry/answer-contexts/frame-challenge.example.json), schema `$defs.answerContext`). The context is stored on both the answered question and its history event.

### 3. Answer-qualified challenge passes

A required pass now counts toward convergence only when a history event carrying its tag has a **qualifying** context: non-empty `provenance`, non-empty `finding`, and not `qualifies: false`. Merely answering a tagged question no longer earns the pass; an unqualified pass answer surfaces the `QG_PASS_CONTEXT_MISSING` validation warning and leaves the `QG_REQUIRED_PASS` blocker in place. The `causal_depth` pass keeps its second, stronger path: the causal-depth validator itself passing on material targets.

### 4. SHA-256 answer-event chaining

Every history event is hash-chained: `event_hash = sha256(prev_event_hash + canonical(event))`, with the genesis hash derived from `engine_id` and `qg_version`. Editing, deleting, or reordering any event breaks the chain, which is detected in three places: semantic validation (`QG_HISTORY_CHAIN_BROKEN` errors), the convergence gate (a chain blocker that keeps `attempt-stop` at exit 2 even when every other gate is green), and `npm run question:verify`'s lifecycle smoke.

### 5. `initialize` subcommand

`node scripts/ofone-question-loop.mjs initialize <state.json> --write` validates a state, clears stale selections, normalizes bootstrap fields, and records the opening landscape — the sanctioned way to bring a hand-authored state into the enforced loop.

### 6. Continuous verification

- `npm run question:verify` — everything below in one gate.
- `npm run question:smoke` — drives the real CLI through initialize → step → context-qualified answers → convergence → release, then proves a tampered history is refused.
- `npm run question:determinism` — re-runs the interactive benchmark and requires byte-identical output (modulo timestamp) to the committed [`benchmarks/question-geometry/example-results.json`](../benchmarks/question-geometry/example-results.json).
- [`.github/workflows/question-geometry.yml`](../.github/workflows/question-geometry.yml) — a read-only CI workflow (recovered byte-intact from the hardening branch payload) that runs `question:verify` plus the full repository suite on every pull request or push touching the engine.

The engine's regression suite grew from 11 to 28 tests, covering selection enforcement, context qualification in all failure directions, chain tampering (edit, delete, reorder), waiver smuggling through answer effects, the iteration safety boundary, and validator negatives.

### Benchmark honesty note

The interactive benchmark's scripted answers now carry an explicitly labeled oracle context (`suite.oracle_context`: "scripted benchmark answers, not real inquiry") so the full-loop arm can still converge in simulation without pretending its passes were earned by real investigation. The suite remains, in its own words, `scaffold_example_not_superiority_evidence`.

## Provenance of this change

This hardening was delivered by the `agent/question-geometry-engine` lane as a checksum-bound, base64-chunked payload plus a self-applying workflow (commits `ded30e3..4057c91`). The chunk transport corrupted the archive: the committed chunks fail the payload's own SHA-256 acceptance check, the lane's 13 CI recovery attempts all failed, and exhaustive local reconstruction (single-deletion and two-defect searches, DEFLATE resynchronization) could not restore the exact bytes.

Two payload files were recovered byte-intact from the archive's undamaged prefix and adopted verbatim: the CI workflow above and the updated `QUESTION_GEOMETRY.md`. Everything else in this hardening was re-implemented from the payload's own recovered specification (its enforced-feature list, README verification counts, command surface, and file inventory). The corrupted chunks remain on the branch as evidence; no opaque payload bytes were merged.
