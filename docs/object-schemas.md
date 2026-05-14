# OfOne Object Schemas

These are minimum schema shapes for machine-checkable OfOne artifacts. The executable schema is `../schemas/ofone.schema.json`.

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
  "supports": ["C1"],
  "risks": ["stale", "selection_bias"]
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

## Edge

```json
{
  "edge_id": "X1",
  "from": "token_or_claim_id",
  "to": "token_or_claim_id",
  "relation": "causes|constrains|supports|contradicts|enables|observes|evaluates|updates",
  "evidence_refs": ["E1"],
  "confidence": "low|medium|high"
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

## Full Schema

Use [`../schemas/ofone.schema.json`](../schemas/ofone.schema.json) for full top-level validation across charter, adapter projection, scene, evidence, claims, edges, loops, options, triggers, gates, confidence model, decision rendering, and validator result.
