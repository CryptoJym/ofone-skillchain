# OfOne Audit Report

# OfOne Analyst Map

## Lifecycle
- Artifact: OFONE-2026-05-18-B01-POLICY-FULL-R1; case=case-public-sector-ai-policy-audit-001; version=0.6.0
- Identity tuple: objective=public-sector AI policy audit with rights, legitimacy, review, and operational gates; scope=sha256:eafc104563df8651821c28617ce84dc0c43119bd2c09d3fedd2e5fcba52f3178; config=sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e
- Evidence hashes: sha256:eafc104563df8651821c28617ce84dc0c43119bd2c09d3fedd2e5fcba52f3178, sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e, sha256:f8c670fa5a6bf20575d0c23f00b5485f56718e24cf53acec929ea1ebe8fcb079
- Status: review_pending; created=2026-05-18T04:34:00Z

## Mode And Charter
- Mode: Audit
- Objective: Audit a public-sector AI-assisted decision process before release.
- Scope: policy design; model performance evidence; rights and legitimacy; human review gates; operational monitoring
- Risk: high

## Geometry And Adapter
- Adapter: hybrid
- Frames: F1:normative, F2:causal, F3:evidential, F4:strategic
- Tokens: K1:public-sector organization, K2:affected people, K3:deployment-population model performance, K4:rights, legitimacy, and contestability requirements, K5:human review and override behavior, K6:subgroup impact and appeal accessibility
- Subscenes: SS1:evidence_acquisition, SS2:stakeholder_context, SS3:review_gate

## Evidence And Claims
- Evidence: E1:medium, E2:medium, E3:medium
- Claims: C1:active:high, C2:active:high, C3:active:medium, C4:active:high
- Dissent / contradiction: none recorded

## Graph And Loops
- causal edges: X4:K4-constrains->O1
- evidential edges: X1:E1-supports->C1, X2:E3-supports->C4
- argumentative edges: X3:C3-supports->C2, X5:C4-supports->TS1, X7:CR2-supports->TS1
- workflow state edges: X6:G1-blocks->O2
- Loops: L1:measurement:mixed, L2:review:balancing, L3:incentive:reinforcing

## Decision Surface
- CR1: must threshold; Rights and public-policy gate; threshold=No live release before rights, public-policy, and contestability gates are reviewed.
- CR2: must threshold; Model evidence fit; threshold=Model evidence must cover the deployment population, subgroup impact, and operational workflow.
- CR3: must constraint; Review-log accountability; threshold=Gate decisions must name reviewer authority and produce review-log evidence before release.
- CR4: should objective; Legitimacy and affected-party exposure; threshold=Prefer moves that surface affected-party exposure and preserve appeal access.
- TS1: dominant=O1; criteria=CR1, CR2, CR3, CR4; reverses_on=U1, U2, U3, T1, T2

## Actors And Time
- Actor A1: public agency decision owner; role=decision_owner; authority=approve; exposures=legal exposure, public trust, rights
- Actor A2: technical and policy reviewer; role=reviewer; authority=block; exposures=operational safety, model validity, review quality
- Actor A3: affected-party representative; role=affected_party; authority=observe; exposures=rights, appeal access, distributional harm
- Temporal: horizon=one policy cycle before live release; deadline=before any public deployment decision; cadence=before release, on new model evidence, on stakeholder objection, and after any review decision
- Evidence windows: E1:unknown, E2:unknown, E3:unknown

## Options And Gates
- Options: O1:defer, O2:test
- Unknowns: U1:open:No deployment-population performance or subgroup-impact evidence is present.; U2:open:No notice, explanation, appeal-access, or affected-party consultation evidence is present.; U3:open:No completed review-log decision or accountable release authority is present.
- Kill tests: KT1:stakeholder_objection->C2, KT2:measurement->C3, KT3:adapter_conflict->C4
- Gates: G1:open:rights and public-policy release gate for high-risk public-sector AI deployment; G2:open:model performance and operational safety gate before controlled pilot

## Information Value
- U1: impact=high; cost=medium; risk_reduction=high; next=Collect deployment-population performance, subgroup error, calibration, and monitoring evidence.
- U2: impact=high; cost=medium; risk_reduction=high; next=Test notice, explanation, appeal access, and affected-party consultation evidence.
- U3: impact=high; cost=low; risk_reduction=medium; next=Assign reviewer authority and record returned-for-evidence or blocked gate decisions.

## Lens Council
- LENS1: strategic agency lens; axis=strategic-agentic; blind_spots=agency incentives and caseworker override behavior are not evidenced
- LENS2: model evidence lens; axis=scientific-explanatory; blind_spots=U1 blocks model validity and subgroup impact assessment
- LENS3: normative legitimacy lens; axis=normative-evaluative; blind_spots=U2 blocks rights and legitimacy review
- LENS4: formal policy-rule lens; axis=formal; blind_spots=review log and gate state are not yet release evidence
- Council: coverage=strategic-agentic, scientific-explanatory, formal, normative-evaluative; dissent=U1, U2, and U3 block release and rendering confidence; effect=Block live deployment and return the policy for model evidence, rights/appeal evidence, and review-log proof.

## Decision Rendering
- Rendering: R1
- Recommendation: Do not release the AI-assisted decision process. Return it for an Audit-mode evidence pass, rights and legitimacy review, named human gates, and recorded review-log decisions.
- Confidence: medium
- Depends on: C1, C2, C3, C4, U1, U2, U3, O1, O2, G1, G2, TS1, COUNCIL

## Update Logic
- T1: review_required -> human_review; rendering affected; closure=C2, COUNCIL, KT1, L1, L2, L3, LENS3, O1, O2, R1, RL1, T1, TS1, X3, X4, X5, X6, X7
- T2: new_evidence -> scoped_rerun; rendering affected; closure=C1, C2, C3, C4, COUNCIL, KT1, KT2, KT3, L1, L2, L3, LENS1, LENS2, LENS3, LENS4, O1, O2, OFONE-2026-05-18-B01-POLICY-FULL-R1, R1, T1, T2, T3, TEMPORAL, TS1, X1, X2, X3, X4, X5, X6, X7
- T3: claim_conflict -> patch; rendering affected; closure=C3, COUNCIL, KT2, L1, L2, L3, LENS2, O1, O2, R1, T3, TS1, X3, X4, X5, X6, X7

## Audit Evidence Identity
- E1: sha256:eafc104563df8651821c28617ce84dc0c43119bd2c09d3fedd2e5fcba52f3178; retrieved=2026-05-18T04:34:00Z; owner=OfOne benchmark suite
- E2: sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e; retrieved=2026-05-18T04:34:00Z; owner=OfOne benchmark suite
- E3: sha256:f8c670fa5a6bf20575d0c23f00b5485f56718e24cf53acec929ea1ebe8fcb079; retrieved=2026-05-18T04:34:00Z; owner=local benchmark executor

## Dissent / Contradiction
- none recorded

## Review Log
- RL1: gate=G1; actor=A1; decision=returned_for_evidence; notes=Release gate remains open because model evidence, rights evidence, and review-log proof are incomplete.
- RL2: gate=G2; actor=A2; decision=returned_for_evidence; notes=Controlled evaluation requires deployment-population performance and subgroup-impact evidence before approval.

## Validator Result
- PASS json_schema: Audit artifact matches executable JSON Schema profile
- PASS adapter_contract: hybrid adapter contract loaded
- PASS adapter_gate_coverage: gate coverage present for legal, safety, public-policy, rights
- PASS benchmark_trace: benchmark_trace BT-2026-05-17-B01-POLICY-FULL-R1 is not superiority-ready
- PASS dependency_closure: trigger T1: C2, COUNCIL, KT1, L1, L2, L3, LENS3, O1, O2, R1, RL1, T1, TS1, X3, X4, X5, X6, X7 [includes rendering]
- PASS dependency_closure: trigger T2: C1, C2, C3, C4, COUNCIL, KT1, KT2, KT3, L1, L2, L3, LENS1, LENS2, LENS3, LENS4, O1, O2, OFONE-2026-05-18-B01-POLICY-FULL-R1, R1, T1, T2, T3, TEMPORAL, TS1, X1, X2, X3, X4, X5, X6, X7 [includes rendering]
- PASS dependency_closure: trigger T3: C3, COUNCIL, KT2, L1, L2, L3, LENS2, O1, O2, R1, T3, TS1, X3, X4, X5, X6, X7 [includes rendering]
- PASS semantic_validation: semantic graph checks completed

