# OfOne Deep Research Source Map

Date: 2026-05-17

## Decision

Use ChatGPT Deep Research with the latest visible GPT Pro model and highest visible thinking setting to recursively review the current public OfOne repo after Run 01 implementation work, then propose the next evidence-backed R&D improvements to the skillchain, schemas, validator, renderer, patch workflow, benchmarks, and convergence criteria.

## Primary Public Context

- GitHub repo: https://github.com/CryptoJym/ofone-skillchain
- GitHub Pages: https://cryptojym.github.io/ofone-skillchain/
- Current public commit at Run 02 preparation time: `18c9bc2b5a5c514ab58d537937732827d5aa038f`
- Package version at preparation time: `0.4.0`

## Key Repo Files For Review

- `README.md`
- `SKILL.md`
- `docs/architecture-framing.md`
- `docs/object-schemas.md`
- `docs/validation-model.md`
- `docs/dependency-closure.md`
- `docs/adapter-contracts.md`
- `docs/confidence-model.md`
- `docs/loop-taxonomy.md`
- `docs/research-basis.md`
- `schemas/ofone.schema.json`
- `schemas/ofone.base.schema.json`
- `schemas/ofone.micro.schema.json`
- `schemas/ofone.map.schema.json`
- `schemas/ofone.audit.schema.json`
- `scripts/ofone-validate.mjs`
- `scripts/ofone-render.mjs`
- `scripts/ofone-patch.mjs`
- `scripts/ofone-test.mjs`
- `lib/ofone-graph.mjs`
- `lib/adapter-contracts.mjs`
- `tests/invalid/fixtures.json`
- `benchmarks/rubrics/decision-map-rubric.md`
- `examples/source-backed-wastewater-map.json`
- `examples/hybrid-policy-audit.json`

## Current Run 02 Local Context

Run 01 implementation work has been committed and pushed through `18c9bc2b5a5c514ab58d537937732827d5aa038f`.

New launch packet:

- Run 02 prompt: `research/prompts/2026-05-17-02-ofone-v05-recursive-review.md`
- Run 02 context brief: `research/ofone-v05-context-brief.md`
- Run 02 ChatGPT URL: https://chatgpt.com/c/6a0a2b54-1904-83e8-a7f7-c0d9036bdff3
- Run 02 launch status: `active_researching`; Deep Research plan generated and `Start` clicked at 2026-05-17T14:56:09-06:00. The prompt and context brief were delivered as one pasted ChatGPT document labeled `Pasted text(4).txt`.

## Local Verification Snapshot

The following commands passed locally after the latest implementation pass:

- `npm run schema:check`
- `npm run validate`
- `npm run benchmark`
- `npm test`

The public GitHub Pages site was checked and contains references to the latest v0.4 decision surface, semantic patch workflow, `npm run schema:check`, and `npm run benchmark`.

## Harvested Research

- Run 01 result: `research/results/2026-05-17-01-ofone-v04-skill-rd-result.md`
- Run 01 synthesis/backlog: `research/results/2026-05-17-01-ofone-v04-skill-rd-synthesis.md`
- Run 02 result: `research/results/2026-05-17-02-ofone-v05-recursive-review-result.md`
- Run 02 synthesis/backlog: `research/results/2026-05-17-02-ofone-v05-recursive-review-synthesis.md`
- Run 03 result: `research/results/2026-05-17-03-ofone-v06-recursive-review-result.md`
- Run 03 synthesis/backlog: `research/results/2026-05-17-03-ofone-v06-recursive-review-synthesis.md`
- Run 03 structured sidecar: `research/review-sidecars/2026-05-17-03-ofone-v06-recursive-review-sidecar.json`
- Stable recursive review protocol: `research/review-protocol.md`
- Source register: `research/source-register.md`
- Acceptance caveat: ChatGPT reported that it could read the attached context brief but could not directly fetch the public repo/docs; repo-specific findings were locally checked before synthesis.
- Run 03 acceptance caveat: ChatGPT reported direct public-surface inspection but the export showed only one visible citation; treat it as external review counsel and keep local verification authoritative.

## Research Guardrails

- Treat the public repo as the source of truth for current released OfOne.
- Treat the local research-lens notes as proposed context, not merged release state.
- Do not request or expose secrets, credentials, private keys, private customer data, or unrelated local material.
- Distinguish sourced facts, repo-observed facts, inferences, and recommendations.
