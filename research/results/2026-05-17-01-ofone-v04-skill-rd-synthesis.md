# OfOne Run 01 Local Synthesis

Date: 2026-05-17
Run: OfOne v0.4 Skill R&D Review
Result: `research/results/2026-05-17-01-ofone-v04-skill-rd-result.md`
ChatGPT URL: https://chatgpt.com/c/6a0a12c9-be8c-83e8-8014-58a7b02f36bb

## Acceptance

Run 01 is accepted as research counsel with one important caveat: ChatGPT could read the attached `ofone-v04-context-brief.md`, but it reported that it could not directly fetch the public GitHub repo or live docs. Its repo-specific observations must be locally validated before becoming implementation truth.

Local validation confirms the current repo has the main v0.4 substrate described in the brief:

- `package.json` is version `0.4.0`.
- `validate`, `validate:write`, `render`, `patch`, and `test` scripts are wired.
- Ajv is installed and `scripts/ofone-validate.mjs` uses `Ajv2020`.
- Profile schemas exist under `schemas/`.
- `lib/ofone-graph.mjs` indexes the rendering node and computes dependency closure.
- `scripts/ofone-render.mjs` emits Micro, Map, and Audit renderings.
- `scripts/ofone-patch.mjs` reports affected closure, invalidated claims, revalidation needs, transition class, and rendering impact.
- `tests/invalid/fixtures.json` contains negative fixtures for hash, edge legality, disputed option dependencies, rendering dependencies, unknowns, lenses, actors, high risk gates, adapter mismatch, and review logs.
- `npm test` passed on 2026-05-17 during harvest.

## Strategic Read

The report's core recommendation is sound: v0.5 should not expand the ontology unless a concept has non-derivable invariants, distinct state transitions, dedicated validation logic, dedicated renderer affordances, or benchmark-proven gains.

The highest-leverage direction is to harden the compiler behavior already present:

- artifact-first execution in `SKILL.md`
- machine-readable validator diagnostics
- explicit semantic relation families
- decision-native renderings
- semantic patch operations
- controlled benchmarks against direct answers and lighter structured baselines

## Concrete Backlog

### P0 - Rewrite `SKILL.md` Around The Artifact-First Compile Loop

Status: integrated in local pass 01.

Goal: make the skill execute as a deterministic compile/validate/render/patch workflow instead of a prose-first reasoning protocol.

Acceptance:

- The skill tells agents to treat the OfOne artifact as source of truth and prose as rendering.
- Every run explicitly records adapter choice and rejected adapter alternatives.
- Every assertion is forced into evidence, claim, unknown, assumption, or decision-state form.
- Blocked decisions emit `information_value` instead of fabricated closure.
- Updates use minimal-patch behavior against the affected subgraph.
- The skill logs benchmark-relevant traces: validation outcomes, failure codes, patch counts, and render mode.

### P0 - Upgrade Validator Output To Structured Diagnostics

Status: integrated in local pass 01.

Goal: make `scripts/ofone-validate.mjs` emit machine-readable diagnostics suitable for tests, CI, patch planning, and renderer feedback.

Current state: validation emits stable structured diagnostics through `--json`, writes computed diagnostics into `validator_result`, and invalid fixtures assert exact diagnostic codes. Ajv remains configured with `strict: false`; this is intentionally left as a phased compatibility decision.

Acceptance:

- Every check emits stable `code`, `severity`, `message`, `object_id`, `object_type`, `path`, and optional `repair_hint`.
- Existing console output can remain, but JSON diagnostics become the canonical validator result.
- Negative fixture tests assert exact diagnostic codes, not only substring presence.
- Decide whether strict Ajv mode can be enabled now or whether strict-mode warnings need a phased compatibility plan.

### P1 - Add Explicit Semantic Relation Families

Status: integrated in local pass 02.

Goal: prevent edge semantics from collapsing causal, evidential, argumentative, and workflow relations into one generic edge surface.

Current state: edges carry `relation_family`, the schema requires it, the validator checks relation-family compatibility with relation and endpoint types, render output groups graph edges by semantic family, and patch output reports affected semantic layers.

Acceptance:

- Edges have explicit semantic family: `causal`, `evidential`, `argumentative`, or `workflow_state`.
- The validator checks relation-family compatibility with relation name and endpoint types.
- Renderer groups graph sections by semantic family.
- Patch closure can report which semantic layer changed.

### P1 - Make Renderings Decision-Native

Status: integrated in local pass 03.

Goal: make `scripts/ofone-render.mjs` the primary human interface instead of a readable listing of object fields.

Acceptance:

- Render modes include executive decision brief, analyst map, audit report, and patch-impact view.
- Each view answers: decision, confidence, why, blockers, next best evidence, what would change this, review gates, and patch impact.
- Audit view exposes provenance, review state, dissent, and evidence identity.
- Snapshot tests cover the renderings.

### P1 - Upgrade Patch Analyzer Into Semantic Patch Workflow

Status: integrated in local pass 04.

Goal: move `scripts/ofone-patch.mjs` from closure reporting toward semantic patch operations.

Acceptance:

- Patch operations include at least: add supporting evidence, supersede evidence, downgrade confidence, invalidate criterion, open/reopen gate, trigger re-review, and supersede artifact identity.
- Patch output states changed decision meaning, invalidated claims, reopened gates, required approvals, and whether rendering regeneration is required.
- Tests cover evidence supersession, criterion change, actor reassignment, and trigger activation/deactivation.

### P1 - Turn Benchmark Scaffold Into A Three-Arm Evaluation Suite

Status: integrated in local pass 05.

Goal: test whether OfOne beats direct answers and lighter structured prompts on the things it claims to improve.

Acceptance:

- Arms: direct answer, light structured baseline, full OfOne skillchain.
- Task families: strategic, scientific, formal, normative, hybrid, and update/patch tasks.
- Metrics: decision quality, evidence grounding precision, uncertainty calibration, trace completeness, auditability, update quality, cost, and inter-run stability.
- Results publish failures and tradeoffs, not only wins.

### P2 - Schema Tightening And Compatibility Tests

Status: integrated in local pass 06.

Goal: make profile schemas stricter without blocking useful extension patterns.

Acceptance:

- All profile schemas have explicit `$schema` and `$id`.
- Closed-world regions use `unevaluatedProperties: false` where unintended drift is dangerous.
- Profile compatibility tests prove Micro, Map, and Audit overlays remain coherent.
- Dependent field rules cover lifecycle objects, evidence identity, tradeoff surfaces, and review logs.

## Deferred

Do not make cross-surface research or cross-domain transfer first-class core objects in v0.5. Keep them as lenses, subscenes, templates, or macros until they demonstrate distinct invariants, state transitions, validation needs, renderer affordances, or benchmark gains.

## Integration Log

- 2026-05-17 local pass 01: added structured validator diagnostics with stable codes, severities, message, object metadata fields, path, and repair hint; added `--json` validator output; formalized validator diagnostics in `schemas/ofone.base.schema.json`; changed invalid regression fixtures to assert exact diagnostic codes; updated `SKILL.md` with artifact-first compile loop, adapter rejection, assertion classification, blocked-decision information value, minimal-patch behavior, and benchmark trace requirements; ran `npm test` successfully.
- 2026-05-17 local pass 02: added explicit edge `relation_family` across schema and examples; validator now rejects family/relation/endpoint mismatches with `OFONE_RELATION_FAMILY`; renderer groups edges by semantic family; patch reports `affected_semantic_layers`; added negative fixture for relation-family mismatch; ran `npm test` successfully.
- 2026-05-17 local pass 03: added render modes for Executive decision brief, Analyst map, Audit report, and Patch Impact view; Patch Impact view accepts changed object IDs and renders affected closure, semantic layers, rendering impact, invalidated claims, and revalidation needs; added renderer smoke coverage to `npm test`; ran `npm test` successfully.
- 2026-05-17 local pass 04: added semantic patch operations to `scripts/ofone-patch.mjs`, including evidence support/supersession, confidence downgrade, criterion invalidation, gate open/reopen, re-review, artifact supersession, actor reassignment, and trigger activation/deactivation; patch output now states changed decision meaning, reopened gates, required approvals, rendering regeneration requirement, and semantic patch operations; added patch workflow regression checks to `npm test`; ran `npm test` successfully.
- 2026-05-17 local pass 05: added `benchmarks/suite.json` with direct-answer, light-structured, and full-OfOne arms; required task families; required metrics; minimums before superiority claims; and linked cases/artifacts; added additional case files plus `scripts/ofone-benchmark.mjs`; wired `npm run benchmark` and benchmark manifest checks into `npm test`; ran `npm run benchmark` and `npm test` successfully.
- 2026-05-17 local pass 06: added targeted closed-world schema rules for compiler-state object definitions, dependent field rules for lifecycle/evidence identity/tradeoff/review state, `scripts/ofone-schema-check.mjs`, `npm run schema:check`, profile dispatch compatibility checks, and a closed-world negative fixture; wired schema compatibility into `npm test`; ran `npm run schema:check`, `npm run validate`, `npm run benchmark`, and `npm test` successfully.
