# Question Geometry Runtime Gate

Question Geometry is an executable inquiry policy, not a checklist and not decorative semantics. It controls whether an OfOne agent may stop.

## Non-Negotiable Rule

For every nontrivial Question Geometry run, the JSON sidecar governed by `schemas/ofone.question-geometry.schema.json` is the canonical inquiry state. The agent may not emit a final decision merely because its prose is coherent, because one explanation looks plausible, or because additional work feels unlikely to help.

A final decision rendering is permitted only after:

```bash
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

returns exit code `0` and `release_allowed=true`.

Exit code `2` means the stop attempt was rejected. The returned `next_directive` is mandatory. Continue the loop; do not paraphrase the blocker away, silently waive it, or replace the machine state with narrative confidence.

## Enforced Compile-and-Inquire Loop

```text
bound objective and frame
-> declare hypotheses, including OTHER/model-class failure
-> declare decision-sensitive unknowns
-> declare actions and loss/utility basis
-> map material causal-depth targets
-> generate candidate questions/tests/interventions
-> validate schema and semantics
-> compute the current question landscape
-> ask the selected Pareto-eligible question
-> record the answer and its provenance
-> update beliefs, unknowns, causal links, contradictions, and options
-> measure material epistemic progress
-> run required challenge passes
-> attempt convergence
-> continue, reframe, escalate, or release
```

Use these commands as the runtime boundary:

```bash
npm run question:check
node scripts/ofone-question-loop.mjs step <state.json> --write
node scripts/ofone-question-loop.mjs answer <state.json> <question_id> <answer> --write
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

## Effective Persistence, Not Repetition

The harness exists to push beyond premature closure. It does not authorize infinite repetition.

If recent questions produce less than the configured material-progress threshold, the runtime must change operators. It should move among measurement, causal contrast, intervention, source change, model expansion, adversarial review, scale change, or frame revision. Repeating a semantically equivalent question is a failure unless new evidence, a new oracle, or a changed condition makes it genuinely different.

The maximum-iteration threshold is a safety and human-review boundary, not an epistemic claim that a fixed number of rounds is enough. Reaching it requires reframe, escalation, or explicit residual-risk acceptance; it never authorizes silent completion.

## The Typed Why Operator

Do not implement “Five Whys.” Implement causal-depth traversal.

Every why edge must specify:

- the explanandum;
- the contrast: why P rather than Q;
- the kind of why: cause, mechanism, motive, purpose, justification, definition, enabling condition, constraint, or historical origin;
- evidence and confidence;
- a counterfactual or intervention test for causal/mechanistic claims;
- alternative contributing causes;
- and the condition that would reject or reopen the link.

A why traversal may branch. Do not compress multiple sufficient, necessary, interacting, delayed, or feedback causes into a neat linear story merely to produce a root cause.

Causal descent ends only at a typed, frame-relative bedrock:

- decision-sufficient depth;
- observable mechanism;
- controllable root cause;
- invariant or law;
- axiom or definition;
- value commitment;
- authority boundary;
- irreducible stochasticity;
- inaccessible or unidentifiable boundary;
- frame boundary;
- or explicitly accepted residual risk.

Every bedrock claim requires a justification and a reopening condition. Never claim final metaphysical bedrock.

## Dynamic Question Landscape

Questions are scored only relative to the current epistemic state. After each answer, recompute the landscape.

The score is multi-objective:

```text
decision-regret reduction
+ information gain
+ causal discrimination
+ model-expansion value
+ unlock/lookahead value
+ robustness and actionability
+ novelty/exploration value
- cost
- risk
- delay
- redundancy
```

Do not pretend every pair of questions has a total ordering. Preserve the Pareto frontier and explicit dominance. A local maximum may be myopically attractive; use lookahead, model-expansion, or escape probes when it traps the inquiry. A local minimum may still be a bridge, calibration, safety, or frame-change question whose future value exceeds its immediate score.

## Required Challenge Passes

Unless the configured policy explicitly narrows them for a bounded low-stakes task, stopping requires all of these:

- `causal_depth`
- `frame_challenge`
- `model_expansion`
- `adversarial`
- `source_independence`
- `stopping_counterexample`

The agent cannot mark a pass complete merely by mentioning it. A question carrying that pass tag must be answered, or the corresponding causal-depth validator must pass.

## Stop Surface

The runtime blocks release while any of the following remain:

- a high-impact or decision-blocking unknown is neither resolved nor explicitly accepted;
- a material causal claim has not reached justified frame-relative bedrock;
- a decision-sensitive contradiction remains open;
- the current decision is not robust enough for the configured threshold;
- a positive-net-value eligible question remains;
- a required challenge pass is missing;
- residual risk lacks a named human owner;
- or the safety review boundary has been reached.

When release is allowed, render the decision together with residual uncertainty, the evidence that could reverse it, and all reopening triggers.
