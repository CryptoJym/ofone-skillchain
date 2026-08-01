# OfOne Question Geometry Engine

**Status:** Executable architecture introduced in OfOne 0.7.0  
**Purpose:** Turn OfOne from a decision-map compiler with query annotations into an adaptive, machine-enforced inquiry policy.

## 1. The Claim

OfOne does not assume that one fixed list or order of questions is optimal in every domain.

The portable claim is narrower and stronger:

> A bounded inquiry can be represented as a changing epistemic state. At each state, candidate questions, observations, tests, proofs, or interventions can be compared by their expected effect on uncertainty, causal discrimination, decision regret, future inquiry options, cost, delay, and risk. Every answer changes the state and therefore changes the question landscape.

There is no context-free best question. There can be a best next information action relative to:

- an active frame;
- a set of hypotheses or model classes;
- a belief or uncertainty state;
- an answer-channel model;
- a decision objective and loss basis;
- costs, delays, rights, and risks;
- and a stopping rule.

## 2. Representation Geometry and Navigation Geometry

OfOne now separates two coupled systems.

### 2.1 Representation geometry

The existing OfOne artifact represents the bounded terrain:

```text
charter
-> scene / frame / subscene
-> evidence and claims
-> causal and constraint graph
-> loops and unknowns
-> options, criteria, tradeoffs
-> gates, triggers, and decision rendering
```

### 2.2 Navigation geometry

The Question Geometry sidecar decides how to explore that terrain:

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

The map and navigator remain separate so that a valid representation is not mistaken for a good search policy.

## 3. Epistemic State

At iteration `t`, the engine treats inquiry state as:

\[
x_t = (F_t, H_t, b_t, U_t, D_t, C_t, G_t)
\]

where:

- `F_t` is the active frame and its assumptions;
- `H_t` is the active hypothesis or model-class set;
- `b_t` is the belief state or robust scenario set;
- `U_t` is the set of addressable unknowns;
- `D_t` is the decision model and loss/utility basis;
- `C_t` is the causal-depth graph;
- `G_t` is the governance, cost, risk, and stopping configuration.

A question `q` is not merely text. It is an operator with:

- a type;
- targets;
- an answer space;
- an answer-channel model;
- direct and future value;
- prerequisites;
- costs, risks, and delay;
- and answer-conditioned state transitions.

An answer `a` moves the inquiry to a new state:

\[
x_{t+1} = T(x_t, q, a)
\]

The engine must recompute the landscape after every transition.

## 4. The Question Landscape

For a state `x`, the available questions form `Q(x)`. Each state therefore has its own local question field. Answers deform the field by changing beliefs, active hypotheses, resolved unknowns, prerequisites, causal structure, and decision sensitivity.

The engine records:

- all scored questions;
- the Pareto frontier;
- declared or computed dominance exclusions;
- ranked eligible questions;
- local maxima;
- local minima;
- plateaus;
- the selected question;
- and the maximum remaining net question value.

### 4.1 Local maxima

A local maximum is a question whose score is not lower than neighboring questions sharing a target or operator family. It may be the right immediate move, but it may also be a myopic trap.

Examples:

- a cheap survey that confirms the current model but cannot falsify it;
- another source that appears independent but shares the same upstream data;
- a high-information descriptive question that cannot change the decision;
- a highly discriminating question that blocks access to a safer later experiment.

### 4.2 Local minima

A local minimum is not automatically useless. It can be:

- a bridge question that unlocks a valuable measurement;
- an oracle-calibration probe;
- a safety or permission gate;
- a frame challenge;
- a source-lineage check;
- or an exploration move that escapes a deceptive basin.

This is why the engine includes bounded lookahead and unlock value rather than optimizing one-step information gain alone.

### 4.3 Other landscape structures

A serious implementation must also expect:

- **plateaus:** many questions have nearly equal value;
- **ridges:** one operator family remains useful across many states;
- **saddles:** a question improves one objective while worsening another;
- **disconnected basins:** the current vocabulary cannot reach a missing model class;
- **hysteresis:** path-dependent answers change which later questions are possible;
- **moving targets:** asking changes the system being observed.

Question space is usually discrete and non-smooth. Gradient metaphors are useful, but the runtime uses graph search, Pareto filtering, explicit lookahead, and escape operators rather than pretending a differentiable global surface always exists.

## 5. Multi-Objective Question Value

The default value vector is:

\[
V(q \mid x) = (
\Delta D,
I,
\Delta_{FR},
C_d,
M_e,
U_l,
R_g,
A,
N,
L,
E,
-C,
-R,
-T,
-Z
)
\]

where:

- `ΔD`: expected decision-value or regret improvement;
- `I`: expected information gain;
- `Δ_FR`: expected Fisher–Rao displacement on the belief simplex;
- `C_d`: causal discrimination;
- `M_e`: model-expansion value;
- `U_l`: unlock value;
- `R_g`: robustness gain;
- `A`: actionability;
- `N`: novelty;
- `L`: bounded lookahead value;
- `E`: exploration bonus for uncertain scoring;
- `C`: cost;
- `R`: risk;
- `T`: delay;
- `Z`: redundancy.

The engine preserves the Pareto frontier before applying a configured scalarization. This is important because question quality is generally only partially ordered.

## 6. Information-Theoretic Components

### 6.1 Entropy and expected information gain

In probabilistic mode, hypotheses `h` have beliefs `b(h)`. A question has an answer channel `P(a | h, q)`. The posterior is:

\[
b_{q,a}(h) = \frac{P(a \mid h,q)b(h)}{\sum_{h'} P(a \mid h',q)b(h')}
\]

Expected information gain is:

\[
EIG(q) = H(b) - \sum_a P(a \mid q)H(b_{q,a})
\]

This favors questions expected to reduce uncertainty, but it is not sufficient by itself.

### 6.2 Expected decision value

Let `U(d,h)` be the value of decision `d` when `h` is true. Current decision value is:

\[
V(b) = \max_d \sum_h b(h)U(d,h)
\]

Expected sample information value is:

\[
EVSI(q) = \sum_a P(a \mid q)V(b_{q,a}) - V(b)
\]

The runtime subtracts cost, risk, delay, and redundancy through the configured score. A fascinating question with no decision effect can therefore lose to a smaller but decisive measurement.

### 6.3 Expected value of perfect information

The residual value of perfect information is:

\[
EVPI = \sum_h b(h)\max_d U(d,h) - \max_d \sum_h b(h)U(d,h)
\]

OfOne uses normalized EVPI as a convergence guard. A large residual EVPI means that uncertainty can still materially improve the decision, even when the current leading option has a visible margin.

### 6.4 Information geometry

Belief states live on a probability simplex. The runtime computes Fisher–Rao distance:

\[
d_{FR}(p,q) = 2\arccos\left(\sum_i\sqrt{p_iq_i}\right)
\]

Expected normalized displacement measures how far a question is likely to move the belief state, not merely how many entropy bits it removes. Two questions can have similar entropy reduction but induce very different movements through model space.

### 6.5 Noisy channels and oracle quality

A question is only as useful as its answer channel. The schema therefore records:

- noise;
- missingness;
- deception risk;
- source dependencies;
- and the oracle or measurement process.

Repeated evidence from one upstream mechanism must not be counted as independent confirmation.

### 6.6 Blackwell dominance

If one information experiment can be produced by adding noise to another, the noisier experiment is decision-theoretically dominated unless it is cheaper, safer, faster, or otherwise constrained. The current engine supports explicit dominance declarations and excludes dominated questions. A future exact finite-experiment solver can automate more of the Blackwell partial order.

### 6.7 Rate–distortion interpretation

Inquiry is resource-bounded compression. The goal is not a complete model of the universe; it is a representation whose remaining distortion is acceptable for the decision.

- distortion corresponds to decision regret, causal error, or violated constraints;
- rate corresponds to question cost, time, tokens, experiments, and access;
- the convergence surface is the declared distortion tolerance under resource and safety limits.

### 6.8 Nonmyopic planning

A low-value question can unlock a high-value later question. The runtime therefore computes a one-step expected lookahead from answer-conditioned state transitions and allows configured supplied lookahead where a deeper plan has been evaluated externally.

The architecture is compatible with deeper belief-state planning or POMDP solvers, but it does not claim that exact global planning is tractable in arbitrary domains.

### 6.9 Adaptive-submodularity caveat

Greedy selection can have strong guarantees when information value exhibits adaptive diminishing returns. The runtime never assumes this universally. If complementarity, delayed unlocks, adversarial answers, or path dependence are material, bounded lookahead and model-expansion probes are required.

### 6.10 Causal information versus observational information

Observation can discriminate correlations without identifying interventions. Causal and mechanism questions therefore require counterfactual or intervention tests. The engine rejects a causal-depth link that merely restates the explanandum or lacks a testable causal implication.

## 7. Typed Causal-Depth Traversal

The useful idea behind the Five Whys is causal descent, not the number five.

A why query must be typed:

- cause;
- mechanism;
- reason or motive;
- purpose or function;
- justification;
- constitutive definition;
- enabling condition;
- constraint;
- historical origin.

It must also state a contrast: why `P` rather than `Q`?

The traversal is a graph, not necessarily a line. Multiple contributing causes, interactions, feedback, delays, and necessary/sufficient conditions may branch. Each material causal target must reach a justified, frame-relative bedrock node before release.

See [`causal-depth-traversal.md`](./causal-depth-traversal.md).

## 8. Three Epistemic Modes

### Heuristic

Use when probabilities would be fabricated. The agent supplies bounded ordinal or normalized judgments with rationales. The validator still enforces targets, costs, risks, causal tests, required passes, and stopping gates.

### Probabilistic

Use when hypotheses, priors, and answer likelihoods are defensible. The engine computes posteriors, entropy, information gain, decision value, EVPI, and Fisher–Rao displacement.

### Robust

Use when one probability distribution is not credible. The decision model accepts multiple belief scenarios and uses either:

- minimax regret; or
- maximin utility.

Robustness is derived from worst-case regret across the supplied scenario set. This is preferable to false precision when uncertainty about the probabilities is itself material.

## 9. Enforced Runtime State Machine

The executable boundary is:

```text
active
-> waiting_for_answer
-> active
-> ...
-> converged | human_review_required | invalid
```

The agent cannot directly set `converged`. The stop command recomputes all gates:

```bash
node scripts/ofone-question-loop.mjs attempt-stop <state.json> --write
```

- exit `0`: release allowed;
- exit `2`: stop rejected and next directive returned;
- exit `1`: invalid state or runtime failure.

A rejected stop is itself a transition back into inquiry.

## 10. Persistence Without Runaway Behavior

The purpose of the harness is to resist premature closure. It does not reward stubborn repetition.

Material progress includes:

- entropy reduction;
- reduction in unresolved decision impact;
- decision-robustness gain;
- causal-depth coverage gain;
- contradiction resolution.

After a configurable stall window, repeated low-progress questions force an operator change. The engine synthesizes an escape question targeting a missing challenge pass or the highest-impact unresolved unknown.

A configurable maximum iteration count creates a human-review boundary. It is not a claim that a fixed number of questions is sufficient.

## 11. Machine-Checked Convergence

Release is blocked while any of these remain:

- required challenge pass missing;
- unaccepted high-impact or decision-blocking unknown;
- material causal target without frame-relative bedrock;
- invalid or circular causal explanation;
- unresolved decision-sensitive contradiction;
- decision robustness below threshold;
- residual EVPI above threshold;
- a robustness/EVPI waiver present without a named `waived_by` owner;
- positive-net-value eligible question;
- residual risk without a named owner;
- or iteration safety boundary reached.

The final rendering must include residual uncertainty, reversal evidence, and reopening triggers.

## 12. Files

- `schemas/ofone.question-geometry.schema.json`
- `lib/question-geometry.mjs`
- `scripts/ofone-question-loop.mjs`
- `scripts/ofone-question-geometry-check.mjs`
- `scripts/ofone-question-geometry-test.mjs`
- `scripts/ofone-question-benchmark.mjs`
- `examples/question-geometry/causal-depth.json`
- `skills/question-geometry/PROTOCOL.md`
- `benchmarks/question-geometry/`

## 13. Current Boundaries

The engine is executable, but the following claims remain unearned until broader benchmarks exist:

- universal superiority over domain-specialist inquiry;
- globally optimal question sequences in arbitrary open worlds;
- exact automated Blackwell comparison for all finite experiments;
- reliable automatic generation of complete hypothesis spaces;
- or guaranteed discovery of unknown unknowns.

The architecture makes those gaps explicit and benchmarkable rather than hiding them behind persuasive language.
