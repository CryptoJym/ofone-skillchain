# OfOne Operating Walkthrough

OfOne is a typed decision-state compiler for bounded inquiry. It is not just a prompt style and it is not a final-answer template. The unit of work is a validated, patchable map that can be rendered into a human answer.

Current boundary: the architecture has been hardened enough to run validation, rendering, patch analysis, review sidecars, and benchmark slices. It is not finished in the sense of having no further improvements. The current loop mode is benchmark handoff: broad architecture iteration pauses while controlled benchmark evidence decides the next changes.

## When To Use It

Use OfOne when the answer depends on hidden assumptions, evidence quality, causal structure, stakeholder risk, gates, or future updates.

Strong uses:

- Strategy decisions with real uncertainty.
- Policy, governance, compliance, or rights-sensitive work.
- Scientific or diagnostic mapping with human review.
- Formal proof-search planning.
- Technical architecture tradeoffs.
- Any decision that needs patchable evidence and visible dissent.

Weak uses:

- Simple factual answers.
- Casual explanation.
- Low-stakes summarization.
- Urgent decisions where mapping overhead is worse than acting.
- High-stakes legal, medical, safety, or financial advice without a human review gate.

## Operating Flow

1. Write the charter.
   Define the decision, scope, stakes, criteria, horizon, authority, and stop condition.

2. Project the domain into geometry.
   Choose strategic, scientific, formal, normative, hybrid, or provisional adapters. Then represent the problem as scenes, frames, tokens, moves, edges, loops, invariants, unknowns, and gates.

3. Separate evidence from claims.
   Evidence carries source identity, provenance, recency, content hash, retrieval time, excerpt, and risk. Claims stay atomic and trace their support, contradiction, confidence basis, and dependency path.

4. Build the graph.
   Keep the evidence ledger, claim graph, causal or constraint graph, loop map, option moves, criteria, tradeoff surface, triggers, and gates distinct.

5. Validate before release.
   Run the schema and semantic validator. Unsupported claims, illegal relations, missing review gates, missing information value, stale evidence, bad benchmark traces, and unresolved review sidecars must block release or reduce confidence.

6. Render for the audience.
   The answer is a projection of the map. Render Executive, Analyst, Audit, or Patch Impact views depending on the audience and mode.

7. Patch instead of rewriting blindly.
   When new evidence arrives, compute affected closure. Patch the evidence, claims, edges, loops, options, gates, and rendering that depend on the changed object.

8. Benchmark before claiming superiority.
   OfOne can claim architectural coherence and working tooling. It should not claim empirical superiority until controlled benchmark results support it.

## Hyperframe Map

The walkthrough video uses ten frames:

| Frame | Visual Focus | System Meaning |
| --- | --- | --- |
| 01 | Objective enters | A messy request becomes a bounded charter. |
| 02 | Geometry kernel | The map gains frames, tokens, edges, loops, moves, and gates. |
| 03 | Adapter projection | Domain language maps into primitive geometry. |
| 04 | Evidence ledger | Sources become traceable evidence objects. |
| 05 | Claim graph | Claims become atomic, supported, disputed, or killed. |
| 06 | Loops and gates | Feedback, temporal validity, and human review become first-class. |
| 07 | Validator | The compiler rejects unsupported or malformed state. |
| 08 | Rendering | The user sees a decision-native view. |
| 09 | Patch closure | New evidence updates only affected dependencies. |
| 10 | Benchmark boundary | Superiority claims wait for controlled comparison. |

Source hyperframe: [`media/hyperframes/ofone-walkthrough.hyperframe.json`](../../media/hyperframes/ofone-walkthrough.hyperframe.json).

## Remotion Flow

The Remotion package in [`media/remotion`](../../media/remotion) turns the hyperframe into a narrated walkthrough.

```bash
cd media/remotion
npm install
npm run preview
```

After generating the OpenAI voiceover from the repository root:

```bash
npm run voiceover
cd media/remotion
npm run render -- --props='{"audioSrc":"audio/ofone-walkthrough.mp3"}'
```

Generated audio and video are build outputs. They are intentionally not committed.

## Voiceover Script

The narration source lives at [`media/remotion/voiceover/ofone-walkthrough-voiceover.txt`](../../media/remotion/voiceover/ofone-walkthrough-voiceover.txt).

The voiceover generator uses OpenAI text to speech through the Audio API. It reads `OPENAI_API_KEY` from the local environment and accepts:

- `OPENAI_TTS_MODEL`, default `gpt-4o-mini-tts`.
- `OPENAI_TTS_VOICE`, default `alloy`.
- `OFONE_VOICEOVER_INPUT`, default `media/remotion/voiceover/ofone-walkthrough-voiceover.txt`.
- `OFONE_VOICEOVER_OUTPUT`, default `media/remotion/public/audio/ofone-walkthrough.mp3`.

```bash
npm run voiceover
```

The generated audio is an artifact for rendering, not source truth.

## Decision Boundary

OfOne should keep improving through a bounded recursive loop:

```text
review -> adjudicate -> implement -> validate -> publish -> benchmark -> next-mode decision
```

The loop should not keep asking for broad architecture review while accepted findings remain unimplemented, while public pages are stale, or while the active mode is benchmark handoff. In benchmark handoff, the next high-value move is controlled benchmark execution and evidence review.

