# Question Geometry Runtime Gate

Question Geometry is an executable inquiry policy, not a checklist and not decorative semantics. It controls whether an OfOne agent may stop, which question it may answer, how an answer enters state, and what evidence is sufficient to count as progress.

## Non-Negotiable Release Rule

For every nontrivial Question Geometry run, the JSON sidecar governed by `schemas/ofone.question-geometry.schema.json` is the canonical inquiry state. Persuasive prose, confidence, elapsed effort, a plausible explanation, or a pass tag cannot authorize completion.

A final decision rendering is permitted only after:

```bash
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

returns exit code `0` and `release_allowed=true`.

Exit code `2` means the stop attempt was rejected. The returned `next_directive` is mandatory. Continue the loop; do not paraphrase the blocker away, silently waive it, edit the state by hand, or replace machine state with narrative confidence.

## Runtime-Issued Selection

An answer may be committed only for the one question selected by the runtime. `step` or an explicit benchmark policy creates a signed selection receipt binding:

- the selected question;
- selection policy and reason;
- inquiry iteration;
- prior answer-history head;
- protected state hash;
- candidate-landscape hash;
- and eligibility at selection.

Changing `status` to `selected`, choosing a merely pending question, replaying an old receipt, or answering against a different history head is rejected.

```bash
node scripts/ofone-question-loop.mjs step <state.json> --write
```

The returned question and `selection_receipt` are the only valid next answer target.

## Evidence-Bearing Answer Commit

Every answer requires provenance. Prefer one answer-context file so the answer, evidence basis, pass assessment, optional effects, and any human governance action remain reviewable together:

```bash
node scripts/ofone-question-loop.mjs answer \
  <state.json> <question_id> <answer> \
  --context <answer-context.json> \
  --write
```

Required provenance fields are:

- `source_type`;
- stable `source_id`;
- `observed_at`;
- `reliability`;
- `chain_of_custody`;
- and one or more `evidence_refs`.

Synthetic tests and benchmark oracles still require explicit synthetic provenance. “The model answered” is not evidence lineage.

## Pass Tags Are Routing Labels, Not Completion

A question may advertise `pass_tags`, but answering it does not automatically complete those passes. Each non-causal challenge pass requires a committed `pass_result` tied to:

- the selected question and actual answer;
- a qualifying answer declared by `pass_conditions`;
- a supported outcome: `satisfied`, `not_satisfied`, or `inconclusive`;
- a basis and substantive rationale;
- evidence references and adequate provenance reliability;
- and pass-specific details.

Satisfied-pass details are enforced:

- `frame_challenge`: tested assumption, alternative frame, result;
- `model_expansion`: surprise test, candidate model class, result;
- `adversarial`: actor or attack surface, distortion test, result;
- `source_independence`: sources examined, dependency result, result;
- `stopping_counterexample`: reversal condition, cheapest safe test, result.

`causal_depth` is completed only by the causal-depth graph validator reaching justified frame-relative bedrock for each material target.

## Tamper-Evident Answer History

The canonical chain metadata lives in `history_integrity`.

Every answer is an immutable event in a SHA-256 hash chain. The event binds:

- its previous event hash;
- runtime selection receipt;
- provenance and pass results;
- declared and external effect hashes;
- before/after metrics;
- protected state before and after the answer;
- and its own event hash.

`iteration` must equal committed event count. Every answered question must have exactly one event. Editing an answer, question state, hypothesis, unknown, causal graph, decision model, governance record, or protected policy outside the answer-event protocol invalidates the chain and blocks release.

Selection metadata, transient rendering status, and cached landscape state are normalized out of the protected-state hash so the runtime can select the next question without falsifying the previous epistemic commitment.

## Human Governance Is Typed and Bounded

An unresolved unknown may be accepted only through an entry in `convergence.accepted_risks` containing:

- a unique acceptance ID and the unknown it governs;
- a named human actor, role, and authority basis;
- acceptance and expiry timestamps;
- bounded scope and rationale;
- evidence references;
- and reopening conditions.

A `convergence.robustness_waiver` for robustness or residual information requires the same human authority plus explicit minimum robustness and maximum residual-EVPI bounds. Expired, overly broad, anonymous, evidence-free, or quantitatively inapplicable records do not waive a blocker.

Legacy bare fields such as `accepted_residual_unknowns`, `accepted_by`, or `effects.accept_unknowns` are rejected.

## Enforced Compile-and-Inquire Loop

```text
bound objective and frame
-> declare hypotheses, including OTHER/model-class failure
-> declare decision-sensitive unknowns
-> declare actions and loss/utility basis
-> map material causal-depth targets
-> generate candidate questions/tests/interventions
-> validate schema, semantics, history, selection, and governance
-> compute the current question landscape
-> issue a receipt for the selected Pareto-eligible question
-> acquire and provenance the answer
-> commit the answer event
-> update beliefs, unknowns, causal links, contradictions, and options
-> measure material epistemic progress
-> run answer-qualified challenge passes
-> verify the event chain
-> attempt convergence
-> continue, change operators, reframe, escalate, or release
```

Use these commands as the runtime boundary:

```bash
npm run question:check
node scripts/ofone-question-loop.mjs initialize <state.json> --write
node scripts/ofone-question-loop.mjs step <state.json> --write
node scripts/ofone-question-loop.mjs answer <state.json> <question_id> <answer> --context <answer-context.json> --write
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

## Effective Persistence, Not Repetition

The harness exists to push beyond premature closure. It does not authorize infinite repetition.

If recent questions produce less than the configured material-progress threshold, the runtime must change operators. It should move among measurement, causal contrast, intervention, source change, model expansion, adversarial review, scale change, or frame revision. Repeating a semantically equivalent question is a failure unless new evidence, a new oracle, or a changed condition makes it genuinely different.

The maximum-iteration threshold is a safety and human-review boundary, not an epistemic claim that a fixed number of rounds is enough. Reaching it requires reframe, escalation, or typed residual-risk acceptance; it never authorizes silent completion.

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

Causal descent ends only at typed, frame-relative bedrock: decision-sufficient depth, observable mechanism, controllable root cause, invariant or law, axiom or definition, value commitment, authority boundary, irreducible stochasticity, inaccessible or unidentifiable boundary, frame boundary, or explicitly accepted residual risk.

Every bedrock claim requires a justification and reopening condition. Never claim final metaphysical bedrock.

## Dynamic Question Landscape

Questions are scored only relative to the current epistemic state. After each answer, recompute the landscape.

```text
decision-regret reduction
+ information gain
+ belief-space displacement
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

Unless a bounded low-stakes policy explicitly narrows them before the run, stopping requires:

- `causal_depth`
- `frame_challenge`
- `model_expansion`
- `adversarial`
- `source_independence`
- `stopping_counterexample`

The agent cannot mark a pass complete merely by mentioning it or attaching a tag. A qualifying answer assessment must be committed, or the causal-depth validator must pass.

## Stop Surface

The runtime blocks release while any of the following remain:

- history or selection integrity fails;
- a selected question remains unanswered;
- a required pass lacks qualifying evidence;
- a high-impact or decision-blocking unknown is unresolved and not governed by active human risk acceptance;
- a material causal claim has not reached justified frame-relative bedrock;
- a decision-sensitive contradiction remains open;
- the current decision is below its robustness threshold;
- residual EVPI exceeds its threshold;
- a positive-net-value eligible question remains;
- a waiver is expired, anonymous, unbounded, or quantitatively inapplicable;
- or the safety review boundary has been reached.

When release is allowed, render the decision together with residual uncertainty, provenance, decision-reversing evidence, governance records, and all reopening triggers.
