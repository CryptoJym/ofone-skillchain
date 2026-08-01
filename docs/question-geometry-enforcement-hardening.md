# Question Geometry Enforcement Hardening

## Purpose

This hardening closes the gap between an agent being told to continue questioning and the runtime actually preventing premature or superficial completion.

The Question Geometry loop now enforces four separate commitments:

1. **Selection commitment:** the runtime chooses the answerable question and issues a receipt bound to state and history.
2. **Evidence commitment:** every answer carries explicit provenance and evidence references.
3. **Interpretation commitment:** a challenge pass is completed only by an answer-qualified assessment with pass-specific detail.
4. **State commitment:** each answer and resulting protected state are committed to a tamper-evident hash chain.

Human risk acceptance is a fifth, separate governance commitment. It cannot be smuggled into ordinary effects or prose.

## Threat Model

The hardening assumes that an agent, model, or operator may accidentally or strategically attempt to:

- answer a convenient pending question instead of the selected one;
- mark a question `selected` manually;
- replay a stale selection after state changes;
- claim a challenge pass merely because its name appeared;
- provide an answer with no inspectable source lineage;
- edit beliefs, unknowns, causal links, or governance state directly;
- accept residual uncertainty anonymously or indefinitely;
- apply a robustness waiver outside its quantitative limits;
- or stop while a selected question remains unanswered.

These are now validation errors or convergence blockers.

## Selection Receipts

`step` computes the current landscape and issues `ofone-question-selection-v1`. The receipt binds:

```text
question ID
+ selector and reason
+ answer-history head
+ protected state hash
+ candidate-landscape hash
+ iteration
+ eligibility
= selection hash
```

The runtime accepts an answer only when the live receipt validates. Committed answer events preserve that receipt, proving that the answer corresponded to a question actually selected from the prior state.

## Provenance-Bearing Answer Events

Answers are committed as `ofone-question-geometry-history-v1` events. Required provenance includes a source type, source ID, observation time, reliability, custody, and evidence references. The event also records effect hashes, before/after metrics, before/after protected-state hashes, and its prior event hash.

The resulting chain detects:

- answer edits;
- event deletion or reordering;
- duplicate answers;
- mismatched question state;
- event-count or iteration drift;
- changed protected inquiry state;
- and stale selection receipts.

This is tamper-evident auditability, not cryptographic identity authentication. A future signed-attestation layer may bind human or tool identities to events, but the current chain already makes silent state rewriting machine-detectable.

## Answer-Qualified Challenge Passes

`pass_tags` nominate the type of challenge a question may satisfy. They confer no completion by themselves.

A satisfied challenge pass must include:

- a qualifying answer under the question's `pass_conditions`;
- adequate source reliability;
- rationale and evidence;
- a recognized basis;
- and the pass-specific fields necessary to show what was actually tested.

Failed and inconclusive pass outcomes are preserved as evidence of attempted inquiry but leave the pass incomplete.

## Typed Governance

`accepted_risks` and `robustness_waiver` are typed, expiring, human-owned records. The validator checks authority, scope, timestamps, evidence, reopening conditions, and quantitative applicability.

A waiver does not mean “ignore confidence.” It means a named human has accepted a bounded operating region such as:

```text
decision robustness >= 0.62
and residual EVPI <= 0.18
until a declared expiry or reopening event
```

Outside those limits, the waiver does not apply.

## Persistence Without Runaway Behavior

The hardening keeps the earlier persistence rule: the engine must continue while material, positive-net-value inquiry remains. When recent questions produce little progress, it synthesizes a different operator instead of repeating the same family.

The iteration ceiling remains a human-review boundary. It is not a license to release an unresolved decision, and it is not proof that inquiry must always reach the ceiling.

## Runtime Commands

```bash
npm run question:check
npm run question:test
npm run question:benchmark

node scripts/ofone-question-loop.mjs initialize <state.json> --write
node scripts/ofone-question-loop.mjs step <state.json> --write
node scripts/ofone-question-loop.mjs answer <state.json> <question_id> <answer> --context <answer-context.json> --write
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

The answer command also supports separate provenance, pass-assessment, effects, risk-acceptance, and waiver files, but the combined context form is preferred for reviewability.

## Limits

This implementation does not prove that its scoring weights are universally optimal, authenticate external identities, or eliminate model misspecification. It enforces a disciplined query policy and makes specific classes of premature closure and state manipulation observable.

Empirical advantage remains a benchmark question. The interactive benchmark is a smoke-test scaffold, not evidence of universal superiority.
