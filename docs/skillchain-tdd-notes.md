# OfOne Skillchain TDD Notes

Created: 2026-05-13

Purpose: record the RED-GREEN-REFACTOR work used to create `/Users/jamesbrady/.codex/skills/ofone/SKILL.md` under the `writing-skills` guidance.

## RED: Baseline Pressure Scenarios

Baseline used only the old Of One framing:

```text
Actors, Outcomes, Mechanisms, Constraints, Dynamics, Evidence.
ACTOR + GOAL + CURRENT STATE + CONSTRAINT + POWER + CHANGE + EVIDENCE + DECISION.
```

### Scenario 1: Regulated Wastewater Market

Result: the agent produced a useful staged-entry recommendation but did not construct an evidence ledger, claim graph, adapter semantics, idempotency rules, or human-review gates.

Observed gap: old framing can produce plausible strategy too quickly under weak evidence.

### Scenario 2: Formal Proof Search

Result: the agent mapped axioms, theorem, proof-search procedure, model finder, and verifier as "actors." It acknowledged this as a broad interpretation.

Observed gap: old framing invites agenticity stretch. Formal domains need adapter-native terms such as axioms, inference rules, proof certificates, countermodels, and decidability limits.

### Scenario 3: Quick Deploy Skillchain

Result: the agent declared a deploy-ready universal skillchain around Actor, Goal, Current State, Constraint, Power, Change, Evidence, Decision.

Observed gaps:

- no domain adapters
- no twelve-axis repaired kernel
- no evidence ledger or atomic claim graph
- no Council Geometry constraints
- no idempotency/update rules
- no human-review gates
- no testing or auditability

## GREEN: Skill Written

Created `/Users/jamesbrady/.codex/skills/ofone/SKILL.md`.

The skill directly addresses the observed failures by requiring:

- bounded charter before mapping
- adapter selection before kernel questions
- repaired twelve-axis kernel
- evidence ledger before recommendations
- atomic claim graph separate from domain graph
- constrained Council Geometry
- hypotheses, kill tests, options, and update triggers
- no-op / patch / scoped rerun / trunk rewrite / human-review classes
- explicit human gates

## REFACTOR Targets For Verification

Verification should check whether an agent using the skill:

1. rejects universal-ontology framing
2. picks or creates an adapter before mapping
3. uses non-agentic vocabulary in formal/scientific domains
4. separates evidence from claims and assumptions
5. surfaces human-review gates
6. avoids declaring deployment readiness without audit/test context

## REFACTOR: First Verification Result

The regulated wastewater verification passed:

- adapter chosen: pass
- evidence ledger before recommendation: pass
- claim graph: pass
- Council Geometry not role-play: pass
- human review gates: pass
- update logic: pass

Two pressure verification agents overran while attempting broader responses. The skill was patched with a `Pressure Mode` section requiring compact execution without dropping adapter, evidence, claims, update logic, or human gates, and instructing agents not to start external research merely to apply the skill unless current due diligence is requested or required.
