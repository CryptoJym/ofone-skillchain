# OfOne Question Geometry Engine

**Status:** Executable architecture introduced in OfOne 0.7.0; enforcement hardened in the current 0.7.0 line  
**Purpose:** Turn OfOne from a decision-map compiler with query annotations into an adaptive, machine-enforced inquiry policy.

## 1. The claim

OfOne does not assume that one fixed list or order of questions is optimal in every domain.

The portable claim is narrower and stronger:

> A bounded inquiry can be represented as a changing epistemic state. At each state, candidate questions, observations, tests, proofs, or interventions can be compared by their expected effect on uncertainty, causal discrimination, decision regret, future inquiry options, cost, delay, and risk. Every answer changes the state and therefore changes the question landscape.

There is no context-free best question. There can be a best next information action relative to an active frame, hypotheses, beliefs, an answer channel, a decision objective, costs, risks, and an explicit stopping rule.

## 2. Two coupled geometries

### Representation geometry

The OfOne artifact represents the bounded terrain:

```text
charter
-> scene / frame / subscene
-> evidence and claims
-> causal and constraint graph
-> loops and unknowns
-> options, criteria, tradeoffs
-> gates, triggers, and decision rendering
```

### Navigation geometry

The Question Geometry sidecar determines how to explore it:

```text
frame and decision
+ hypotheses and beliefs
+ typed unknowns
+ causal-depth targets
+ candidate information actions
+ answer channels
+ multi-objective query scores
+ adaptive transitions
+ convergence gate
= next question, reframe, escalation, or release
```

A valid map is not automatically a good search policy. The two systems therefore remain separate but linked.

## 3. Epistemic state and question operators

At iteration `t`, inquiry state is:

\[
x_t = (F_t, H_t, b_t, U_t, D_t, C_t, G_t)
\]

where `F` is the frame, `H` the model set, `b` the belief state, `U` the unknowns, `D` the decision model, `C` the causal-depth graph, and `G` governance and stopping configuration.

A question is not merely text. It has:

- a type and target;
- an answer space;
- an answer-channel model;
- prerequisites;
- cost, delay, and risk;
- expected direct and future value;
- declared answer effects;
- and a runtime-issued selection receipt.

An answer moves the inquiry:

\[
x_{t+1} = T(x_t, q, a)
\]

The landscape is recomputed after every accepted transition.

## 4. The dynamic question landscape

For a state `x`, available questions form `Q(x)`. Answers deform this field by changing beliefs, model classes, unknowns, causal structure, prerequisites, governance, and decision sensitivity.

The engine records:

- every scored question;
- the Pareto frontier;
- declared dominance exclusions;
- ranked eligible questions;
- local maxima and minima;
- plateaus;
- the selected question;
- and the maximum remaining net question value.

A local maximum can be the correct immediate move or a myopic trap. A local minimum can still be a bridge, calibration, safety, source-lineage, or frame-change question whose future value exceeds its immediate score. This is why the runtime includes lookahead, unlock value, model-expansion probes, and operator switching.

The space is usually discrete and non-smooth. Gradient language is a metaphor; the implementation uses graph search, Pareto filtering, bounded lookahead, and explicit escape operators.

## 5. Multi-objective question value

The default value vector includes:

```text
expected decision gain
expected information gain
Fisher–Rao belief displacement
causal discrimination
model-expansion value
unlock value
robustness gain
actionability
novelty
bounded lookahead
exploration value
minus cost, risk, delay, and redundancy
```

The engine preserves the Pareto frontier before scalarization because question quality is generally only partially ordered.

## 6. Information-theoretic components

### Entropy and expected information gain

For hypotheses `h`, belief state `b(h)`, question `q`, and answer channel `P(a | h,q)`:

\[
b_{q,a}(h)=\frac{P(a\mid h,q)b(h)}{\sum_{h'}P(a\mid h',q)b(h')}
\]

\[
EIG(q)=H(b)-\sum_a P(a\mid q)H(b_{q,a})
\]

### Expected decision value

For utility `U(d,h)`:

\[
V(b)=\max_d\sum_h b(h)U(d,h)
\]

\[
EVSI(q)=\sum_aP(a\mid q)V(b_{q,a})-V(b)
\]

The runtime then subtracts costs, risks, delay, and redundancy. The most informative question is not necessarily the most decision-useful question.

### Residual value of perfect information

\[
EVPI=\sum_hb(h)\max_dU(d,h)-\max_d\sum_hb(h)U(d,h)
\]

Normalized EVPI is a convergence guard: large residual EVPI means information can still materially improve the decision.

### Information geometry

Belief states live on a probability simplex. The engine computes Fisher–Rao distance:

\[
d_{FR}(p,q)=2\arccos\left(\sum_i\sqrt{p_iq_i}\right)
\]

This measures expected movement through model space, not only entropy reduction.

### Noisy channels, dependence, and dominance

Question quality depends on the oracle. Answer provenance records noise, missingness, source dependencies, custody, and evidence identity. Repeated observations from one upstream process do not count as independent confirmation.

The runtime supports explicit Blackwell-style dominance declarations. A noisier experiment is excluded unless its lower cost, risk, or delay makes it preferable.

### Bounded planning

One-step lookahead captures bridge questions that unlock stronger later actions. The architecture is compatible with deeper belief-state or POMDP planning, but does not claim exact global planning is tractable in arbitrary open worlds.

## 7. Typed causal-depth traversal

The useful idea inside Five Whys is causal descent, not the number five.

Every why link identifies:

- the explanandum and contrast: why `P` rather than `Q`;
- the kind of explanation: cause, mechanism, motive, purpose, justification, definition, enabling condition, constraint, or historical origin;
- evidence and confidence;
- a counterfactual or intervention test for causal links;
- alternative contributing causes;
- and a reopening or rejection condition.

The traversal is a graph, not necessarily a line. Only **supported** links count toward a path to bedrock; hypothesized links remain open inquiry. Each material causal target must reach a justified, evidence-backed, frame-relative bedrock node before release.

See [`causal-depth-traversal.md`](./causal-depth-traversal.md).

## 8. Three epistemic modes

- **Heuristic:** use bounded qualitative judgments when probabilities would be fabricated.
- **Probabilistic:** compute posteriors, entropy, information gain, decision value, EVPI, and Fisher–Rao displacement.
- **Robust:** compare multiple belief scenarios using minimax regret or maximin utility when one distribution is not credible.

## 9. Runtime-issued selection

A candidate being present in the state does not authorize answering it. The runtime must select it and issue a receipt binding:

- question ID;
- iteration;
- current history head;
- protected-state hash;
- landscape hash;
- selector and reason;
- and eligibility at selection time.

Only the currently selected, receipt-bound question can be answered. A forged status edit or an answer to a merely pending question is rejected.

## 10. Answer provenance and qualified challenge passes

Every accepted answer requires provenance:

- source type and stable source ID;
- observation time;
- reliability;
- custody statement;
- evidence references;
- and a content hash when the source class requires one.

A challenge pass is not completed by a tag or by mentioning its name. It requires an answered tagged question plus pass-specific structured details, a substantive rationale, a compatible evidentiary basis, and a qualifying outcome. Unsupported agent inference cannot self-certify an evidence, intervention, or independent-review pass.

Required default passes are:

- `causal_depth`;
- `frame_challenge`;
- `model_expansion`;
- `adversarial`;
- `source_independence`;
- `stopping_counterexample`.

## 11. Tamper-evident history

The history is an append-only hash chain. Each event binds:

- the previous event hash;
- question and answer;
- selection receipt;
- provenance;
- declared and external effects;
- qualified pass results;
- before/after metrics;
- protected-state hashes;
- and the event hash itself.

The validator checks the entire chain, iteration count, question state, selection identity, effect hashes, and current protected state. Editing an earlier answer, changing policy after initialization, rewriting beliefs or unknowns outside an event, or fabricating an iteration invalidates the state.

## 12. Human-owned governance

The runtime, not question effects, owns convergence and governance state. Question-declared or externally supplied effects cannot write `convergence`, accept risk, or fabricate a waiver.

Accepted residual unknowns require typed, expiring records with:

- a named human actor, role, and authority;
- scope and rationale;
- acceptance and expiry timestamps;
- evidence references;
- and reopening conditions.

A robustness/EVPI waiver is also a typed, expiring human decision. It must specify quantitative minimum robustness and maximum residual-EVPI bounds. It applies only when the actual state falls within those bounds. Legacy bare booleans or anonymous `waived_by` strings are invalid.

## 13. Enforced state machine

```text
uninitialized
-> active
-> waiting_for_answer
-> active
-> ...
-> converged | human_review_required | invalid
```

Initialization establishes the canonical protected-state hash before the first selection. The agent cannot directly set `converged`.

```bash
node scripts/ofone-question-loop.mjs initialize <state.json> --write
node scripts/ofone-question-loop.mjs step <state.json> --write
node scripts/ofone-question-loop.mjs answer <state.json> <question_id> <answer> --context <context.json> --write
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

Exit codes:

- `0`: the operation succeeded; for `attempt-stop`, release is allowed;
- `2`: stop rejected and the next directive is mandatory;
- `1`: invalid state or runtime failure.

## 14. Persistence without runaway behavior

The harness resists premature closure but does not reward stubborn repetition.

Material progress includes entropy reduction, unresolved-impact reduction, robustness gain, causal-depth gain, and contradiction resolution. After a configured stall window, repeated low-progress questions force an operator change among measurement, causal contrast, intervention, source change, scale change, model expansion, adversarial review, or reframing.

A maximum iteration count is a human-review safety boundary, not an epistemic claim that a fixed number of questions is sufficient.

## 15. Machine-checked convergence

Release is blocked while any of these remain:

- invalid or tampered history;
- an unanswered selected question;
- a required qualified challenge pass missing;
- an unaccepted high-impact or decision-blocking unknown;
- a material causal target without supported frame-relative bedrock;
- an invalid, circular, or tautological causal explanation;
- an unresolved decision-sensitive contradiction;
- decision robustness below threshold;
- residual EVPI above threshold;
- a positive-net-value eligible question;
- an invalid, expired, future-dated, anonymous, overly broad, or quantitatively inapplicable risk record or waiver;
- or the iteration safety boundary.

When release is allowed, the final rendering must still expose residual uncertainty, reversal evidence, and reopening triggers.

## 16. Files

- `schemas/ofone.question-geometry.schema.json`
- `lib/question-geometry.mjs`
- `lib/question-geometry/integrity.mjs`
- `lib/question-geometry/selection.mjs`
- `lib/question-geometry/passes.mjs`
- `lib/question-geometry/governance.mjs`
- `scripts/ofone-question-loop.mjs`
- `scripts/ofone-question-geometry-check.mjs`
- `scripts/ofone-question-geometry-test.mjs`
- `scripts/ofone-question-cli-smoke.mjs`
- `scripts/ofone-question-benchmark.mjs`
- `examples/question-geometry/causal-depth.json`
- `examples/question-geometry/answer-contexts/`
- `skills/question-geometry/PROTOCOL.md`
- `benchmarks/question-geometry/`

## 17. Current boundaries

The engine is executable, but these claims remain unearned until broader benchmarks exist:

- universal superiority over domain-specialist inquiry;
- globally optimal question sequences in arbitrary open worlds;
- exact automatic Blackwell comparison for all finite experiments;
- reliable generation of complete model classes;
- guaranteed discovery of unknown unknowns;
- or proof that the current weighting and stop thresholds are optimal.

The architecture makes these gaps explicit and benchmarkable instead of hiding them behind persuasive language.
