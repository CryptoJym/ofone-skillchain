# OfOne Question Geometry

OfOne 0.7 adds an executable adaptive-inquiry layer beside the stable decision-map compiler.

Question Geometry treats questions as state-changing operators. It ranks candidate questions over the current epistemic state, records local maxima/minima and the Pareto frontier, updates beliefs and causal structure after answers, forces challenge passes, and rejects premature stop attempts.

Start here:

- [`docs/question-geometry-engine.md`](./docs/question-geometry-engine.md)
- [`docs/causal-depth-traversal.md`](./docs/causal-depth-traversal.md)
- [`docs/question-geometry-integration.md`](./docs/question-geometry-integration.md)
- [`skills/question-geometry/PROTOCOL.md`](./skills/question-geometry/PROTOCOL.md)
- [`examples/question-geometry/causal-depth.json`](./examples/question-geometry/causal-depth.json)
- [`benchmarks/question-geometry/README.md`](./benchmarks/question-geometry/README.md)

## Runtime

```bash
npm run question:check
npm run question:test
npm run question:landscape
node scripts/ofone-question-loop.mjs step examples/question-geometry/causal-depth.json --write
node scripts/ofone-question-loop.mjs attempt-stop examples/question-geometry/causal-depth.json --write
```

A rejected stop exits with code `2` and returns the next mandatory inquiry directive.

## What is enforced

- explicit alternatives, including model-class failure;
- typed unknowns;
- probabilistic, heuristic, or robust decision modes;
- expected information and decision value;
- Fisher–Rao belief displacement;
- bounded lookahead and unlock value;
- Pareto and local-extrema analysis;
- typed causal-depth traversal instead of a fixed Five Whys count;
- frame challenge, model expansion, adversarial, source-independence, and reversal passes;
- stall detection and operator switching;
- residual EVPI, decision robustness, and positive-net-value-question stop guards;
- human review at the configured runaway-safety boundary.

The included interactive benchmark is a smoke test. It does not establish universal or empirical superiority.
