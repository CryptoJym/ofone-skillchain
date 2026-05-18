# OfOne Analyst Map

## Lifecycle
- Artifact: OFONE-2026-05-18-B01-WW-FULL-R3; case=case-regulated-wastewater-market-entry-001; version=0.6.0
- Identity tuple: objective=regulated wastewater market entry gated diligence repeat 2; scope=sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16; config=sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e
- Evidence hashes: sha256:c7fd750ee9060a3267cfc286f2244b75c7119ce2f8389f2f82f1618b51a9aba0, sha256:504fcaa0e637fa14bf840ceb5a4ab4f7d7487989ccd0b03e4ee9bcd3574aedbe, sha256:de73970b06ef29c9dda1c6f1ffd04c97e2ca665849fe6cbfe161b3ccbd86a6c4
- Status: draft; created=2026-05-18T10:05:27Z

## Mode And Charter
- Mode: Map
- Objective: Map regulated wastewater market entry as a repeat-3 gated diligence decision, separating source-backed generic regulatory evidence from site-specific unknowns before any launch move.
- Scope: regulated wastewater market-entry decision; jurisdiction-specific diligence boundary; technical proof and launch gating
- Risk: medium

## Geometry And Adapter
- Adapter: hybrid
- Frames: F1:strategic, F2:evidential, F3:causal
- Tokens: K1:wastewater market-entry team, K2:NPDES permit coverage, K3:discharge category and receiving water, K4:permit limits, monitoring, and reporting, K5:state, tribal, territorial, or EPA permitting authority, K6:jurisdiction-specific permit path
- Subscenes: SS1:evidence_acquisition, SS2:causal_mechanism, SS3:option_decision

## Evidence And Claims
- Evidence: E1:high, E2:high, E3:high
- Claims: C1:active:high, C2:active:medium, C3:active:medium
- Dissent / contradiction: none recorded

## Graph And Loops
- causal edges: X2:K2-constrains->C3, X3:K5-constrains->C2, X4:K4-constrains->C3
- argumentative edges: X1:C1-supports->C3
- Loops: L1:review:unknown

## Decision Surface
- CR1: must threshold; Gate safety; threshold=Do not release or launch while required gate remains open.
- CR2: should objective; Unknown resolution value; threshold=Prefer moves that resolve rendering-blocking regulatory, technical, partner, and customer unknowns before irreversible action.
- CR3: must constraint; Affected-party exposure; threshold=Do not hide material exposure to affected parties.
- TS1: dominant=O1; criteria=CR1, CR2, CR3; reverses_on=U1, U2, U3, T1, T2

## Actors And Time
- Actor A1: human review owner; role=reviewer; authority=approve; exposures=capital risk, compliance exposure, reputation exposure, environmental consequence
- Actor A2: affected party; role=affected_party; authority=observe; exposures=capital risk, compliance exposure, reputation exposure, environmental consequence
- Temporal: horizon=90 days; deadline=90 days; cadence=weekly until jurisdiction, influent, partner, and customer unknowns resolve
- Evidence windows: E1:unknown, E2:unknown, E3:unknown

## Options And Gates
- Options: O1:query
- Unknowns: U1:open:Jurisdiction, permitting authority, discharge class, and receiving-water context are not fixed for the opportunity.; U2:open:Influent profile and treatment proof for the actual wastewater stream are not fixed.; U3:open:Partner path and customer commitment are not fixed.
- Kill tests: KT1:adapter_conflict->C3
- Gates: G1:open:customer commitment, permit filing, compliance exposure, reputation exposure, technical performance claim, or operational launch

## Information Value
- U1: impact=high; cost=medium; risk_reduction=high; next=Identify target jurisdiction, permitting authority, discharge class, receiving-water context, and permit pathway.
- U2: impact=high; cost=medium; risk_reduction=high; next=Collect influent profile and pilot-performance evidence for the actual wastewater stream.
- U3: impact=medium; cost=medium; risk_reduction=medium; next=Verify accountable partner/operator path and customer commitment terms.

## Lens Council
- LENS1: strategic agentic lens; axis=strategic-agentic; blind_spots=Jurisdiction, influent profile, treatment proof, partner path, and customer commitment are not yet fixed.
- LENS2: scientific explanatory lens; axis=scientific-explanatory; blind_spots=Jurisdiction, influent profile, treatment proof, partner path, and customer commitment are not yet fixed.
- LENS3: normative evaluative lens; axis=normative-evaluative; blind_spots=Jurisdiction, influent profile, treatment proof, partner path, and customer commitment are not yet fixed.
- Council: coverage=strategic-agentic, scientific-explanatory, normative-evaluative; dissent=U1, U2, and U3 block O1 and R1; effect=Proceed with source-backed regulatory, technical, partner, and customer diligence; do not commit to operational launch until U1, U2, and U3 are resolved and G1 is approved.

## Decision Rendering
- Rendering: R1
- Recommendation: Approve reversible diligence and block launch or customer promises until the compliance/business gate receives site-specific evidence.
- Confidence: medium
- Depends on: C1, C2, C3, O1, U1, U2, U3, TS1, G1, COUNCIL, BT-2026-05-17-B01-WW-FULL-R3

## Update Logic
- T1: new_evidence -> patch; rendering affected; closure=IV:U1, IV:U2, IV:U3, O1, R1, T1, TS1
- T2: regime_shift -> scoped_rerun; rendering affected; closure=C3, COUNCIL, KT1, L1, LENS2, LENS3, O1, R1, T2, TS1, X1, X2, X3, X4

