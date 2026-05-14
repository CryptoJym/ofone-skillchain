# OfOne Skillchain

OfOne is a typed causal-geometry compiler for turning bounded objectives into auditable decision maps.

Abstract geometry is primary. Adapters project domain language onto geometry.

## What Is Included

- [`SKILL.md`](./SKILL.md) - the Codex skillchain.
- [`docs/architecture-framing.md`](./docs/architecture-framing.md) - the architecture framing.
- [`docs/research-basis.md`](./docs/research-basis.md) - research-backed architecture basis.
- [`docs/object-schemas.md`](./docs/object-schemas.md) - minimum object schemas.
- [`schemas/ofone.schema.json`](./schemas/ofone.schema.json) - executable JSON Schema.
- [`scripts/ofone-validate.mjs`](./scripts/ofone-validate.mjs) - dependency-aware validator.
- [`examples/strategy-micro.json`](./examples/strategy-micro.json) - Micro strategy example.
- [`examples/formal-proof-map.json`](./examples/formal-proof-map.json) - Map mode formal example.
- [`examples/hybrid-policy-audit.json`](./examples/hybrid-policy-audit.json) - Audit mode hybrid example.
- [`index.html`](./index.html) - GitHub Pages site.

## Skillchain

```text
Charter -> Geometry Kernel -> Adapter Projection -> Scene Map -> Evidence Ledger -> Claim Graph -> Causal Graph -> Loop Map -> Option Moves -> Update Logic -> Human Gates -> Decision Pack
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
```

## Pages

The GitHub Pages site is served from the repository root.
