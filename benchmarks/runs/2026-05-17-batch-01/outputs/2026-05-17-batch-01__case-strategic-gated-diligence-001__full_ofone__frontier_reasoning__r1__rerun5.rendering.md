# OfOne Analyst Map

## Lifecycle
- Artifact: OFONE-batch01-frontier-strategic-rerun5; case=case-strategic-gated-diligence-001; version=0.6.0
- Identity tuple: objective=reversible diligence before operational launch; scope=sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44; config=sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e
- Evidence hashes: sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942, sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e, sha256:3ee2f6b69dc5fc90febfac98a44493db3aacbc15ac69d16d0cd4e8bd8adb493f
- Status: validated; created=2026-05-21T09:14:07Z

## Mode And Charter
- Mode: Map
- Objective: Decide whether to take a reversible diligence move before any operational launch commitment.
- Scope: case-strategic-gated-diligence-001 benchmark case; controlled Mode A rerun 5 full-OfOne package; decision boundary between reversible diligence and operational launch
- Risk: medium

## Geometry And Adapter
- Adapter: hybrid
- Frames: F1:strategic, F2:normative, F3:evidential
- Tokens: K1:reversible diligence move, K2:operational launch, K3:launch release gate, K4:blocked launch facts, K5:decision owner
- Subscenes: SS1:evidence_acquisition, SS2:option_decision

## Evidence And Claims
- Evidence: E1:high, E2:high, E3:high
- Claims: C1:active:high, C2:active:high, C3:active:medium, C4:active:medium, C5:active:high
- Dissent / contradiction: none recorded

## Graph And Loops
- causal edges: X4:C1-enables->O1, X5:O1-enables->C3, X8:CR1-constrains->TS1
- evidential edges: X1:E1-supports->C1, X2:E1-supports->C2, X3:E3-supports->C5
- argumentative edges: X9:TS1-supports->R1
- workflow state edges: X6:U1-blocks->R1, X7:G1-blocks->O2, X10:C4-depends_on->G1
- Loops: L1:review:balancing

## Decision Surface
- CR1: must constraint; Reversibility before commitment; threshold=The next move must not create an operational launch commitment or irreversible external obligation.
- CR2: must threshold; Reviewer-controlled launch release; threshold=Operational launch requires named reviewer approval while gate G1 is open.
- CR3: should objective; Information value; threshold=The move should materially reduce U1 and U2 at lower cost than premature launch.
- TS1: dominant=O1; criteria=CR1, CR2, CR3; reverses_on=U1, U2, T1

## Actors And Time
- Actor A1: decision owner; role=decision_owner; authority=approve; exposures=operational, reputation
- Actor A2: launch reviewer; role=reviewer; authority=block; exposures=operational, reputation
- Actor A3: diligence operator; role=operator; authority=advise; exposures=scope creep, misread external signal
- Temporal: horizon=one diligence cycle; deadline=before any operational launch commitment; cadence=revalidate after new operating evidence or reviewer decision
- Evidence windows: E1:until benchmark case changes, E2:until full-OfOne prompt changes, E3:until Mode A contract changes

## Options And Gates
- Options: O1:query, O2:act
- Unknowns: U1:open:Specific launch facts are not present: launch surface, operational owner, customer or stakeholder exposure, budget, dependency commitments, and rollback constraints.; U2:open:The launch reviewer and approval threshold are not named in the case.
- Kill tests: KT1:stakeholder_objection->C3
- Gates: G1:open:Launch release requires named reviewer approval after U1 and U2 are resolved or explicitly accepted.

## Information Value
- U1: impact=high; cost=medium; risk_reduction=high; next=What facts define the launch surface, rollback boundary, owner, budget, and stakeholder exposure?
- U2: impact=high; cost=low; risk_reduction=medium; next=Who is the launch reviewer, and what evidence threshold closes G1?

## Lens Council
- LENS1: Strategic-agentic lens; axis=strategic-agentic; blind_spots=actual cost and rollback boundary are absent
- LENS2: Normative release lens; axis=normative-evaluative; blind_spots=reviewer identity and approval threshold are unspecified
- Council: coverage=strategic-agentic, normative-evaluative; dissent=No dissent against reversible diligence; dissent remains against operational launch while U1 and U2 are open.; effect=Permits reversible diligence only and keeps launch blocked.

## Decision Rendering
- Rendering: R1
- Recommendation: Proceed with the reversible diligence move O1 only. Do not proceed to operational launch O2 until U1 and U2 are resolved or accepted by the launch reviewer and G1 is approved.
- Confidence: medium
- Depends on: C1, C2, C3, C4, U1, U2, TS1, G1

## Update Logic
- T1: new_evidence -> patch; rendering affected; closure=C3, C4, COUNCIL, IV:U1, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9
- T2: review_required -> human_review; rendering affected; closure=C3, C4, COUNCIL, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9

