# OfOne Skillchain

OfOne is a typed causal-geometry compiler for turning bounded objectives into auditable decision maps.

Abstract geometry is primary. Adapters project domain language onto geometry.
The v0.4 line freezes the core inquiry IR and adds decision-lifecycle objects for identity, criteria, tradeoffs, actors, time, information value, lens review, council review, and gate review logs.

## What Is Included

- [`SKILL.md`](./SKILL.md) - the Codex skillchain.
- [`docs/architecture-framing.md`](./docs/architecture-framing.md) - the architecture framing.
- [`docs/research-basis.md`](./docs/research-basis.md) - research-backed architecture basis.
- [`docs/object-schemas.md`](./docs/object-schemas.md) - minimum object schemas.
- [`docs/adapter-contracts.md`](./docs/adapter-contracts.md) - executable adapter semantics.
- [`docs/validation-model.md`](./docs/validation-model.md) - schema, semantic, closure, and rendering validation model.
- [`schemas/ofone.schema.json`](./schemas/ofone.schema.json) - profile dispatcher for Micro, Map, and Audit schemas.
- [`schemas/ofone.base.schema.json`](./schemas/ofone.base.schema.json) - shared object definitions.
- [`scripts/ofone-validate.mjs`](./scripts/ofone-validate.mjs) - schema-backed semantic validator.
- [`scripts/ofone-render.mjs`](./scripts/ofone-render.mjs) - human-readable Micro, Map, and Audit renderer.
- [`scripts/ofone-patch.mjs`](./scripts/ofone-patch.mjs) - dependency-closure patch helper.
- [`scripts/ofone-test.mjs`](./scripts/ofone-test.mjs) - validator regression tests with negative fixtures.
- [`examples/strategy-micro.json`](./examples/strategy-micro.json) - Micro strategy example.
- [`examples/formal-proof-map.json`](./examples/formal-proof-map.json) - Map mode formal example.
- [`examples/hybrid-policy-audit.json`](./examples/hybrid-policy-audit.json) - Audit mode hybrid example.
- [`examples/source-backed-wastewater-map.json`](./examples/source-backed-wastewater-map.json) - source-backed Map example using public EPA NPDES sources.
- [`benchmarks/`](./benchmarks/) - benchmark protocol scaffold.
- [`index.html`](./index.html) - GitHub Pages site.

## Skillchain

```text
Charter -> Geometry Kernel -> Adapter Projection -> Scene Map -> Evidence Ledger -> Claim Graph -> Causal Graph -> Loop Map -> Option Moves -> Decision Surface -> Update Logic -> Human Gates -> Decision Pack
```

## Install Locally For Codex

Copy `SKILL.md` into a Codex skill directory:

```bash
mkdir -p ~/.codex/skills/ofone
cp SKILL.md ~/.codex/skills/ofone/SKILL.md
```

Then use it when mapping a bounded domain, stress-testing understanding, or producing a decision-ready research map.

## Validate Examples

```bash
npm run validate
npm test
```

The validator executes JSON Schema first, then semantic graph checks for IDs, references, edge legality, edge semantic families, adapter contracts, loop physics, gates, trigger transitions, and dependency closure.
It also checks nested subscenes, explicit unknown/null objects, kill-test references, artifact identity hashes, criterion ownership, tradeoff-surface dependencies, temporal evidence windows, information value for blocking unknowns, lens coverage, and Audit review logs.
Each validation finding also has a stable diagnostic object with `code`, `severity`, `message`, optional object metadata, and an optional repair hint. Use JSON output when another tool needs machine-readable diagnostics:

```bash
node scripts/ofone-validate.mjs --json examples/strategy-micro.json
```

To compute and write `validator_result` into the examples:

```bash
npm run validate:write
```

## Render And Patch

```bash
npm run render -- examples/strategy-micro.json Micro
npm run patch -- examples/strategy-micro.json E1
```

`render` produces a decision-native view: decision, confidence, why, blocking unknowns, change triggers, human gates, evidence identity, and dissent where applicable. `patch` produces a structured patch report with affected objects, invalidated claims, revalidation requirements, and rendering impact.

## Pages

The GitHub Pages site is served from the repository root.
