# Chrome Extension Deep Research Contract

This contract defines how OfOne hands Deep Research work to a Chrome extension/plugin without taking over the user's active desktop session.

## Purpose

The extension surface is the primary launch and observation mechanism for recursive reviews and frontier benchmark runs. It should create clean isolated ChatGPT tabs, submit one packet or arm per tab, observe launch proof, and leave a durable result for local harvest. Desktop takeover surfaces are not valid launch proof.

## Queue

The current machine-readable queue is:

- `research/deep-research-launch-queue.json`
- Extension payloads: `research/deep-research-extension-payloads.json`
- Extension report intake: `research/deep-research-extension-report.json`
- Schema: `schemas/ofone.deep-research-launch.schema.json`
- Payload schema: `schemas/ofone.deep-research-extension-payloads.schema.json`
- Report schema: `schemas/ofone.deep-research-extension-report.schema.json`
- Checker: `npm run deep-research:check`
- Payload freshness checker: `npm run deep-research:payloads`
- Report intake checker: `npm run deep-research:report`

Each queue item identifies the benchmark slot, packet path, prompt anchor, expected output path, expected review path, required launch proof, and disallowed surfaces. A queue item may be ready for extension launch, blocked, active, harvested, reviewed, or rejected, but it is not complete until local harvest, review, verification, publication, and Pages parity all exist.

The extension payload file expands each queue item into one isolated tab lane with the exact prompt text extracted from the packet, packet and prompt SHA-256 hashes, expected harvest paths, isolation constraints, and launch-block status. Regenerate it after queue edits with `npm run deep-research:payloads:write`, then verify it with `npm run deep-research:payloads` and `npm run deep-research:check`.

The extension report file is the only accepted local intake for launch and harvest observations from the Chrome extension/plugin. It records whether the extension surface is unavailable, launch-ready, launched, active, completed, harvested, or rejected; binds that report to the exact payload file hash; and requires explicit launch or harvest proof before a blocked queue item can advance.

## Extension Duties

For each queue item, the extension should:

1. Open a clean isolated ChatGPT tab or conversation.
2. Select the current Pro/frontier-capable model and highest available reasoning mode.
3. Enable Deep Research when available.
4. Submit only the `prompt_text` from the matching item in `research/deep-research-extension-payloads.json`.
5. Capture launch proof: model label, reasoning label, Deep Research state, conversation URL, generated plan title, Start/countdown action, active research state, and stop-control evidence.
6. Preserve the queue item as active while stop-control remains visible.
7. Harvest only after a completed report is visible.
8. Write or update `research/deep-research-extension-report.json` with the matching `item_id`, `tab_lane`, extension namespace, isolated-tab proof, launch proof, and completed-report/raw-output hash proof as applicable.

The extension may run multiple tabs concurrently only when each arm is isolated and no tab can inspect another arm's output before raw harvest.

## Blocker Rule

If callable Chrome extension/plugin control is unavailable, troubleshoot extension availability before any other work. Required diagnostics are: current tool discovery result, `nodeRepl.requestMeta` backend list when `node_repl` is callable, `globalThis.browser` presence or absence, tab-list attempt or error, and the exact namespace or backend failure. The queue and report stay blocked until those diagnostics either restore callable extension control or prove a real extension blocker. Browser, Computer Use, coordinate clicking, AppleScript/JXA, and generic desktop automation are not fallbacks for launch or harvest because they can hijack the user's active workspace and blur launch evidence.

## Current State

The formal proof-search frontier repeat-1 direct-answer item is currently `reviewed` in `research/deep-research-launch-queue.json` and `harvested` in `research/deep-research-extension-report.json`. Chrome extension launch and harvest proof is recorded for https://chatgpt.com/c/6a0f0a85-c75c-83e8-b0d0-4c15a041cb7b with visible metadata `Research completed in 10m`, `8 citations`, `101 searches`, report title `Benchmark Raw Output`, and run metadata `Status: completed`. The raw output and local review are saved; publication parity is confirmed only after commit, push, and `npm run pages:check`.

The formal proof-search frontier repeat-1 light-structured item has a completed report visible at https://chatgpt.com/c/6a0f1fe5-3494-83e8-9f92-1a2b732c4958 with visible metadata `Research completed in 9m`, `6 citations`, `120 searches`, report title `Benchmark Raw Output`, and run metadata `Status: completed`. It remains `completed_report_visible`, not harvested or aggregate-eligible, because raw Markdown export is blocked by the cross-origin Deep Research iframe and no disallowed fallback may be used.
