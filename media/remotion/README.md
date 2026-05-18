# OfOne Remotion Walkthrough

This package renders a visual walkthrough of the OfOne operating flow from raw objective to validated decision rendering and patchable benchmark state.

The Remotion source is intentionally kept separate from generated outputs:

- `src/data/ofoneWalkthrough.ts` contains the frame/cue data.
- `src/OfOneWalkthrough.tsx` renders the animated walkthrough.
- `voiceover/ofone-walkthrough-voiceover.txt` is the narration source.
- `public/audio/ofone-walkthrough.mp3` is generated locally and ignored by git.
- `out/` contains rendered videos and is ignored by git.

## Setup

```bash
cd media/remotion
npm install
npm run preview
```

## Generate Voiceover

From the repository root:

```bash
npm run voiceover
```

The generator reads `OPENAI_API_KEY` from the environment and writes `media/remotion/public/audio/ofone-walkthrough.mp3`.

Optional overrides:

```bash
OPENAI_TTS_MODEL=gpt-4o-mini-tts OPENAI_TTS_VOICE=alloy npm run voiceover
```

## Render

Preview without audio:

```bash
cd media/remotion
npm run preview
```

Render with generated audio:

```bash
cd media/remotion
npm run render -- --props='{"audioSrc":"audio/ofone-walkthrough.mp3"}'
```

Render a poster frame:

```bash
cd media/remotion
npm run still
```

## Walkthrough Story

1. Objective enters.
2. Geometry kernel creates primitives.
3. Adapter projection maps domain language.
4. Evidence ledger separates source from claim.
5. Claim graph exposes support and contradiction.
6. Loops and gates make dynamics and review explicit.
7. Validator rejects malformed state.
8. Renderer produces a human decision view.
9. Patch closure updates only affected dependencies.
10. Benchmark boundary blocks superiority claims until evidence exists.

