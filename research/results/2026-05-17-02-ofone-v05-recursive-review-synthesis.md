# Run 02 Synthesis: OfOne v0.5 Recursive Compiler Review

Date: 2026-05-17
Source result: `research/results/2026-05-17-02-ofone-v05-recursive-review-result.md`
ChatGPT URL: https://chatgpt.com/c/6a0a2b54-1904-83e8-a7f7-c0d9036bdff3

## Accepted Findings

- Public implementation labels were inconsistent: the review framed the system as v0.5 while package/examples/pages still presented v0.4.
- Trigger activation/deactivation semantics were under-modeled. Patch closure could start at the trigger object instead of the trigger's declared affected objects.
- `scoped_rerun` existed in docs/schema but patch classification could not return it.
- Trigger transition labels were not semantically checked against condition and closure.
- The benchmark checker allowed a `full_ofone` arm with `ofone_artifact: null`.
- Benchmark scaffold checks could be mistaken for empirical superiority readiness.
- Recursive review cycles needed typed state rather than tracker prose only.
- Source material and model-generated critique needed an explicit hostile-source / prompt-injection boundary.
- Generic gate text should not satisfy adapter exposure coverage merely by saying "review."

## Implemented Changes

- Bumped package/docs/examples/page labeling to v0.5.0.
- Added trigger expansion to the patch helper: `trigger_activation` and `trigger_deactivation` now start closure from the trigger plus `affected_objects`.
- Added `scoped_rerun` patch classification for declared scoped triggers and scoped decision-surface changes.
- Added validator checks for trigger transition/closure consistency:
  - rendering-impacting triggers cannot be `no_op`;
  - `review_required` must be `human_review`;
  - `scope_change` and `regime_shift` must be `scoped_rerun`, `trunk_rewrite`, or `human_review`;
  - `human_review` requires gate objects.
- Added a scientific mechanism Map artifact and wired it into the benchmark suite.
- Hardened benchmark validation so every `full_ofone` arm requires an actual artifact.
- Added benchmark superiority readiness reporting; scaffold validation now warns that current empirical superiority is not established.
- Added optional first-class `review_cycle` and `benchmark_trace` schema objects, graph indexing, validator checks, and object-schema docs.
- Added hostile-source policy language to `SKILL.md`, `README.md`, and validation docs.
- Removed generic "review" as sufficient adapter gate coverage.
- Added negative fixtures for rendering-impacting `no_op` triggers, invalid review-cycle implementation state, and premature benchmark superiority trace.
- Refreshed example `validator_result` blocks with the v0.5 validator.

## Verification

- `npm run schema:check` passed.
- `npm run validate` passed across examples.
- `npm run benchmark` passed and reported `BENCH_SUPERIORITY_READY` warning, not readiness.
- `npm test` passed all renderer, patch workflow, benchmark, schema, and invalid-fixture checks.

## Remaining Backlog

- Build actual benchmark runs and expert/side-by-side reviews; current suite is a scaffold, not empirical proof.
- Consider moving `validate:write` to sidecar or explicit in-place semantics in a later compatibility release.
- Build an authoring flow so normal users do not write JSON.
- Continue recursive Deep Research after this implementation is public.
