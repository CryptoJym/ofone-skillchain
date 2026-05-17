# OfOne Object Schemas

These are minimum schema shapes for machine-checkable OfOne artifacts. The executable schema dispatcher is `../schemas/ofone.schema.json`; mode profiles live in `../schemas/ofone.micro.schema.json`, `../schemas/ofone.map.schema.json`, and `../schemas/ofone.audit.schema.json`.

Run:

```bash
npm run validate
```

## Artifact Identity

```json
{
  "artifact_id": "OFONE-2026-05-14-001",
  "case_id": "case-regulated-wastewater-market-entry-001",
  "objective_head": "regulated wastewater market entry",
  "scope_hash": "sha256:...",
  "config_hash": "sha256:...",
  "active_evidence_hashes": ["sha256:..."],
  "created_at": "2026-05-14T00:00:00Z",
  "status": "draft|validated|rendered|review_pending|released|superseded",
  "movement_jobs": ["BOUND", "TRIGGER"]
}
```

## Evidence

```json
{
  "evidence_id": "E1",
  "source": "file|url|observation|testimony|simulation|tool",
  "span_or_locator": "string",
  "provenance": "string",
  "recency": "current|dated|unknown",
  "reliability": "low|medium|high",
  "permission": "internal|public|restricted",
  "content_hash": "sha256:...",
  "retrieved_at": "ISO-like timestamp or retrieval marker",
  "extract": "short source span or summary",
  "source_owner": "publisher, local owner, tool, or witness",
  "chain_of_custody": "how the source entered the artifact",
  "supports": ["C1"],
  "risks": ["stale", "selection_bias"]
}
```

## Subscene

```json
{
  "subscene_id": "SS1",
  "parent_scene": "S1",
  "purpose": "evidence_acquisition|causal_mechanism|option_decision|review_gate|proof_step|stakeholder_context|other",
  "frames": ["F1"],
  "tokens": ["K1", "K2"],
  "entry_conditions": ["what must be true to enter this local scene"],
  "exit_conditions": ["what resolves or exits this local scene"],
  "movement_jobs": ["BOUND", "LINK"]
}
```

## Claim

```json
{
  "claim_id": "C1",
  "text": "atomic proposition",
  "type": "descriptive|causal|predictive|normative|formal|operational",
  "supports": ["E1"],
  "contradicts": ["C2"],
  "depends_on": ["A1"],
  "confidence": {
    "level": "low|medium|high",
    "basis": ["provenance", "independence", "recency", "mechanism_fit"],
    "failure_modes": ["confounding", "staleness"]
  },
  "status": "active|disputed|superseded|killed",
  "review_gate": false
}
```

## Unknown

```json
{
  "unknown_id": "U1",
  "kind": "missing_evidence|missing_measurement|missing_claim|missing_adapter|unresolved_conflict|unobserved_variable",
  "description": "No subgroup performance data available.",
  "blocks": ["O1", "R1"],
  "resolution_move": "Collect subgroup audit data.",
  "status": "open|resolved|accepted_risk",
  "movement_jobs": ["WARN", "GATE", "TEST"]
}
```

## Criterion

```json
{
  "criterion_id": "CR1",
  "name": "Compliance risk",
  "kind": "constraint|preference|objective|threshold",
  "priority": "must|should|could",
  "threshold": "No operational launch before permit path is identified.",
  "owned_by": ["A1"],
  "movement_jobs": ["EVALUATE", "GATE"]
}
```

## Tradeoff Surface

```json
{
  "surface_id": "TS1",
  "options": ["O1", "O2"],
  "criteria": ["CR1", "CR2"],
  "dominant_option": "O1",
  "why": ["CR1"],
  "reversal_conditions": ["U1", "T1"],
  "movement_jobs": ["EVALUATE", "TRIGGER"]
}
```

## Actor

```json
{
  "actor_id": "A1",
  "label": "regulatory owner",
  "role": "reviewer|beneficiary|operator|adversary|decision_owner|affected_party",
  "incentives": ["avoid compliance exposure"],
  "exposures": ["legal", "operational"],
  "authority": "approve|block|advise|observe",
  "legitimacy_basis": "assigned review responsibility",
  "movement_jobs": ["BOUND", "WARN", "GATE"]
}
```

## Temporal Model

```json
{
  "time_horizon": "90 days",
  "decision_deadline": "2026-08-14",
  "evidence_validity_windows": [
    {
      "evidence_id": "E1",
      "valid_until": "unknown",
      "staleness_trigger": "source changes or regime shifts"
    }
  ],
  "update_cadence": "weekly until blocking unknowns resolve",
  "movement_jobs": ["BOUND", "TRIGGER", "WARN"]
}
```

## Information Value

```json
{
  "unknown_id": "U1",
  "decision_impact": "high",
  "resolution_cost": "medium",
  "time_to_resolve": "2 weeks",
  "risk_reduction": "high",
  "recommended_next_query": "identify jurisdiction, discharge class, receiving water, and permit authority",
  "movement_jobs": ["TEST", "MOVE", "EVALUATE"]
}
```

## Kill Test

```json
{
  "test_id": "KT1",
  "target": "C1",
  "test_type": "counterexample|measurement|replication|countermodel|stakeholder_objection|constraint_violation|adapter_conflict",
  "condition": "What observation, proof artifact, stakeholder objection, or constraint violation kills the target claim.",
  "falsifies": ["C1"],
  "movement_jobs": ["TEST", "WARN"]
}
```

## Edge

```json
{
  "edge_id": "X1",
  "from": "token_or_claim_id",
  "to": "token_or_claim_id",
  "relation_family": "causal|evidential|argumentative|workflow_state",
  "relation": "causes|constrains|supports|contradicts|enables|observes|evaluates|updates|blocks|depends_on",
  "evidence_refs": ["E1"],
  "confidence": "low|medium|high"
}
```

## Loop

```json
{
  "loop_id": "L1",
  "type": "reinforcing|balancing|measurement|incentive|learning|contradiction|review|deception|regime",
  "edges": ["X1"],
  "polarity": "reinforcing|balancing|mixed|unknown",
  "delay": "short|medium|long|unknown",
  "gain": "low|medium|high|unknown",
  "control_points": ["decision gate, test, metric, or intervention"],
  "observable_cues": ["what would show the loop is active"],
  "failure_mode": "how the loop misleads or fails"
}
```

## Option Move

```json
{
  "option_id": "O1",
  "move_type": "act|query|test|prove|observe|defer|revise",
  "preconditions": ["C1"],
  "expected_effects": ["X1"],
  "tradeoffs": ["cost", "risk", "time", "reversibility"],
  "blocking_unknowns": ["U1"],
  "review_gate": "G1"
}
```

## Trigger

```json
{
  "trigger_id": "T1",
  "condition": "new_evidence|claim_conflict|regime_shift|scope_change|review_required",
  "affected_objects": ["C1", "O1"],
  "transition": "no_op|patch|scoped_rerun|trunk_rewrite|human_review"
}
```

## Decision Rendering

```json
{
  "rendering_id": "R1",
  "summary": "short current map state",
  "recommendation": "decision rendering, not the internal map",
  "confidence": "low|medium|high",
  "depends_on": ["C1", "O1"],
  "movement_jobs": ["EVALUATE", "MOVE", "GATE"]
}
```

## Lens And Council

```json
{
  "lens_id": "LENS1",
  "name": "regulatory feasibility",
  "adapter_axis": "scientific-explanatory",
  "questions": ["What evidence would permit operational launch?"],
  "claims_examined": ["C1"],
  "blind_spots": ["site-specific discharge facts"],
  "contention": ["jurisdiction-specific gap blocks launch"],
  "movement_jobs": ["WARN", "TEST", "EVALUATE"]
}
```

```json
{
  "coverage": ["strategic-agentic", "scientific-explanatory"],
  "missing_lenses": ["legal-specific counsel"],
  "major_dissent": ["jurisdiction-specific gap blocks launch"],
  "decision_effect": "gate operational launch",
  "movement_jobs": ["EVALUATE", "WARN", "GATE"]
}
```

## Review Log

```json
{
  "review_id": "RV1",
  "gate_id": "G1",
  "actor_id": "A1",
  "decision": "approved|blocked|returned_for_evidence|not_required",
  "timestamp": "2026-05-14T00:00:00Z",
  "notes": "Gate decision notes.",
  "movement_jobs": ["GATE", "WARN"]
}
```

## Recursive Review Cycle

```json
{
  "cycle_id": "RC2",
  "source_review": "OfOne Recursive Compiler Review",
  "source_url": "https://chatgpt.com/c/example",
  "round": 2,
  "status": "harvested|accepted|implemented|resubmitted|converged|blocked",
  "accepted_findings": ["trigger closure starts from affected objects"],
  "rejected_findings": ["finding already implemented"],
  "unresolved_findings": ["needs empirical benchmark results"],
  "implemented_commits": ["abc1234"],
  "convergence_gate": {
    "round": 2,
    "max_rounds": 4,
    "release_blockers": 0,
    "new_high_value_architecture_items": 1,
    "repeated_top_findings_count": 1,
    "benchmark_handoff_ready": false,
    "recommended_next_mode": "protocol_hardening",
    "stop_reason": "one accepted protocol hardening item remains",
    "movement_jobs": ["EVALUATE", "TRIGGER"]
  },
  "stop_reason": "not converged",
  "movement_jobs": ["TRIGGER", "EVALUATE"]
}
```

`convergence_gate` turns the recursive improvement loop into typed state. If `release_blockers` is zero and `benchmark_handoff_ready` is true, a review cannot keep recommending broad architecture iteration without a new P0/P1 defect.

## Benchmark Trace

```json
{
  "trace_id": "BT1",
  "suite_id": "ofone-v0.5-three-arm-evaluation",
  "cases_run": 5,
  "arms_run": ["direct_answer", "light_structured", "full_ofone"],
  "model_families": 0,
  "superiority_ready": false,
  "diagnostics": ["scaffold valid; empirical superiority not established"],
  "movement_jobs": ["GROUND", "WARN"]
}
```

## Full Schema

Use [`../schemas/ofone.schema.json`](../schemas/ofone.schema.json) for profile-dispatched validation across charter, adapter projection, scene, evidence, claims, decision surface, actors, time, lenses, edges, loops, options, triggers, gates, confidence model, decision rendering, recursive review cycles, and benchmark traces. `validator_result` is computed by `../scripts/ofone-validate.mjs --write` rather than trusted as self-attestation.

For recursive reviews of OfOne itself, use [`../schemas/ofone.review.schema.json`](../schemas/ofone.review.schema.json) and `npm run review:check` to validate the sidecar that records inspected surfaces, source policy, execution policy, evidence classes, ranked backlog, convergence gate, and benchmark handoff state.

Validator regression fixtures live in [`../tests/invalid/fixtures.json`](../tests/invalid/fixtures.json). Run `npm test` to prove malformed artifacts are rejected.
