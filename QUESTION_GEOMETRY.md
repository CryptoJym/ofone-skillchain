# OfOne Question Geometry

OfOne 0.7 adds an executable adaptive-inquiry layer beside the stable decision-map compiler. The enforcement-hardening update strengthens that layer so selection, evidence, challenge-pass completion, history, and human governance are machine-enforced rather than trusted as agent narration.

Question Geometry treats questions as state-changing operators. It ranks candidate questions over the current epistemic state, records local maxima/minima and the Pareto frontier, updates beliefs and causal structure after answers, forces answer-qualified challenge passes, detects tampering, and rejects premature stop attempts.

Start here:

- [`docs/question-geometry-engine.md`](./docs/question-geometry-engine.md)
- [`docs/causal-depth-traversal.md`](./docs/causal-depth-traversal.md)
- [`docs/question-geometry-integration.md`](./docs/question-geometry-integration.md)
- [`docs/question-geometry-enforcement-hardening.md`](./docs/question-geometry-enforcement-hardening.md)
- [`skills/question-geometry/PROTOCOL.md`](./skills/question-geometry/PROTOCOL.md)
- [`examples/question-geometry/causal-depth.json`](./examples/question-geometry/causal-depth.json)
- [`examples/question-geometry/answer-contexts/frame-challenge.example.json`](./examples/question-geometry/answer-contexts/frame-challenge.example.json)
- [`benchmarks/question-geometry/README.md`](./benchmarks/question-geometry/README.md)

## Runtime

```bash
npm run question:check
npm run question:test
npm run question:landscape

node scripts/ofone-question-loop.mjs initialize examples/question-geometry/causal-depth.json --write
node scripts/ofone-question-loop.mjs step examples/question-geometry/causal-depth.json --write
node scripts/ofone-question-loop.mjs answer \
  examples/question-geometry/causal-depth.json \
  <selected_question_id> <answer> \
  --context <answer-context.json> \
  --write
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
- runtime-issued, state-bound question selection;
- selected-question-only answering;
- answer provenance, evidence references, and custody;
- answer-qualified challenge passes rather than tag-based completion;
- SHA-256 answer-event chaining and protected-state verification;
- iteration/history and question/event consistency;
- typed causal-depth traversal instead of a fixed Five Whys count;
- frame challenge, model expansion, adversarial, source-independence, and reversal passes;
- stall detection and operator switching;
- residual EVPI, decision robustness, selected-question, and positive-net-value-question stop guards;
- typed, expiring human accepted-risk records and bounded robustness waivers;
- human review at the configured runaway-safety boundary.

The included interactive benchmark is a smoke test. It does not establish universal or empirical superiority.
