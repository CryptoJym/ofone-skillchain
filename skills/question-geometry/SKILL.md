---
name: ofone-question-geometry
description: Use for adaptive, machine-enforced inquiry that must keep discovering, testing, reframing, and asking the highest-value next question until a validated convergence gate permits release
---

# OfOne Question Geometry

Use the executable protocol in [`PROTOCOL.md`](./PROTOCOL.md). The runtime state, selection receipt, provenance-bearing answer event, challenge-pass assessment, history hash chain, governance records, and convergence gate are authoritative. Prose is never a substitute for those machine states.

The shortest safe operating sequence is:

```bash
node scripts/ofone-question-loop.mjs initialize <state.json> --write
node scripts/ofone-question-loop.mjs step <state.json> --write
node scripts/ofone-question-loop.mjs answer <state.json> <question_id> <answer> --context <answer-context.json> --write
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

A stop is valid only when the final command exits `0` with `release_allowed=true`. Exit `2` means the returned continuation is mandatory.

Do not manually select a question, answer a pending question, infer a pass from `pass_tags`, omit answer provenance, edit committed state outside the answer protocol, use bare risk-acceptance fields, or claim causal bedrock without a contrast, test, alternatives, frame-relative justification, and reopening condition.

Implement causal-depth traversal, not a fixed number of whys. Persist by producing material epistemic movement; when progress stalls, change the inquiry operator rather than repeating the same question family.
