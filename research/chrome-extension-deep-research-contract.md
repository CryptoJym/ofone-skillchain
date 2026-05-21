# Chrome Extension Deep Research Contract

This contract defines how OfOne hands Deep Research work to a Chrome extension/plugin without taking over the user's active desktop session.

## Purpose

The extension surface is the primary launch and observation mechanism for recursive reviews and frontier benchmark runs. It should create clean isolated ChatGPT tabs, submit one packet or arm per tab, observe launch proof, and leave a durable result for local harvest. Desktop takeover surfaces are not valid launch proof.

## Queue

The current machine-readable queue is:

- `research/deep-research-launch-queue.json`
- Schema: `schemas/ofone.deep-research-launch.schema.json`
- Checker: `npm run deep-research:check`

Each queue item identifies the benchmark slot, packet path, prompt anchor, expected output path, expected review path, required launch proof, and disallowed surfaces. A queue item may be ready for extension launch, blocked, active, harvested, reviewed, or rejected, but it is not complete until local harvest, review, verification, publication, and Pages parity all exist.

## Extension Duties

For each queue item, the extension should:

1. Open a clean isolated ChatGPT tab or conversation.
2. Select the current Pro/frontier-capable model and highest available reasoning mode.
3. Enable Deep Research when available.
4. Submit only the prompt section for the target arm.
5. Capture launch proof: model label, reasoning label, Deep Research state, conversation URL, generated plan title, Start/countdown action, active research state, and stop-control evidence.
6. Preserve the queue item as active while stop-control remains visible.
7. Harvest only after a completed report is visible.

The extension may run multiple tabs concurrently only when each arm is isolated and no tab can inspect another arm's output before raw harvest.

## Blocker Rule

If callable Chrome extension/plugin control is unavailable, the queue stays blocked. Browser, Computer Use, coordinate clicking, AppleScript/JXA, and generic desktop automation are not fallbacks for launch or harvest because they can hijack the user's active workspace and blur launch evidence.

## Current State

The formal proof-search frontier repeat-1 direct-answer item is currently `prepared_blocked_chrome_extension_unavailable`. No ChatGPT conversation has been opened for that item, no prompt has been submitted, no Deep Research plan has been generated, and no formal proof-search frontier slot is launched, harvested, reviewed, complete, or aggregate-eligible.
