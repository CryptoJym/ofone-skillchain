# OfOne Object Schemas

These are minimum schema shapes for machine-checkable OfOne artifacts. The executable schema dispatcher is `../schemas/ofone.schema.json`; mode profiles live in `../schemas/ofone.micro.schema.json`, `../schemas/ofone.map.schema.json`, and `../schemas/ofone.audit.schema.json`.

Run:

```bash
npm run validate
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

## Full Schema

Use [`../schemas/ofone.schema.json`](../schemas/ofone.schema.json) for profile-dispatched validation across charter, adapter projection, scene, evidence, claims, edges, loops, options, triggers, gates, confidence model, and decision rendering. `validator_result` is computed by `../scripts/ofone-validate.mjs --write` rather than trusted as self-attestation.

Validator regression fixtures live in [`../tests/invalid/fixtures.json`](../tests/invalid/fixtures.json). Run `npm test` to prove malformed artifacts are rejected.
