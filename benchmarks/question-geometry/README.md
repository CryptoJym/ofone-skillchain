# Question Geometry Interactive Benchmark

This directory is the first executable scaffold for testing inquiry policy rather than only final answer structure.

## Why the existing benchmark is insufficient

A static dossier can test representation, evidence discipline, causal mapping, update behavior, and rendering. It cannot determine whether a method asks better questions because all arms receive the same information up front.

Question Geometry needs hidden-state, sequential cases in which the agent can request information and every information action has consequences.

## Current executable smoke test

Run:

```bash
npm run question:benchmark
npm run question:benchmark:write
```

The example compares:

1. direct stop;
2. fixed checklist;
3. greedy expected information gain;
4. greedy expected decision value;
5. full enforced Question Geometry.

The oracle returns case-declared answers. The report measures decision regret, robustness, question count, cost, risk, required-pass coverage, unresolved blockers, and premature stopping.

The included result is an implementation smoke test, not superiority evidence.

## Required production benchmark design

A publishable benchmark should use predeclared cases with:

- a hidden world state or causal model;
- an interactive oracle;
- noisy, missing, correlated, delayed, and sometimes deceptive answers;
- question-specific costs, risks, and access constraints;
- questions that alter future information access;
- open-world cases where every initial hypothesis is wrong;
- intervention and observation choices;
- explicit stopping opportunities;
- time and token parity across arms;
- repeated runs and multiple model families;
- blinded domain review;
- and complete failure analysis.

## Recommended domains

- strategic market entry;
- scientific mechanism discovery;
- formal proof search;
- medical differential diagnosis with human review;
- policy with contested values;
- software incident response;
- adversarial fraud investigation;
- creative direction under ambiguous criteria;
- and update cases where the prior decision must be patched.

## Metrics

Primary:

- decision regret;
- causal-model accuracy;
- critical-unknown discovery;
- model-class misspecification detection;
- calibration;
- information or decision value gained per unit cost;
- and correct stopping.

Guardrails:

- unsafe or rights-violating questions;
- privacy exposure;
- source-dependence errors;
- repeated low-yield questions;
- premature closure;
- runaway inquiry;
- and hidden human labor.
