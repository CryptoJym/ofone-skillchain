# OfOne Analyst Map

## Lifecycle
- Artifact: OFONE-2026-05-21-case-regulated-wastewater-market-entry-001-frontier_reasoning-r1; case=case-regulated-wastewater-market-entry-001; version=0.5.0
- Identity tuple: objective=regulated wastewater market entry; scope=unknown; config=unknown
- Evidence hashes: sha256:ae68c5f8e66f6576820fd6ca942eff808148d5b1eca91c1d7e369931212f16f4, sha256:433ad3fee3898a352b5c6086fd4a1180ceb68fbfed03465961ee49e778cda09d, sha256:a6a7d4a38a900796f12f32fb1ee0cbd4d82ba32bf3229693e09868e87d8cc6bb, sha256:ccbae10fa18e5b33beb99c90a7c23084dadc9b3806412c766f757915845dc8e6, sha256:583d553329eb91a400975deeff987f2fa3dfa83dd7e9db794e60c5de3c235a2b, sha256:e29953cac0e53c09f59f2178a9750caf47b28f8d7e3e046605d5bca011d49a09
- Status: review_pending; created=2026-05-21T06:00:00Z

## Mode And Charter
- Mode: Map
- Objective: Produce a decision-ready map for U.S. regulated wastewater market entry that separates bounded diligence from operational launch and keeps evidence, claims, unknowns, gates, option moves, triggers, and rendering explicit.
- Scope: United States regulated wastewater treatment market entry; Unfixed jurisdiction, influent profile, treatment proof, partner path, and customer commitment; Direct-discharge and indirect-discharge paths; Compliance, residuals, and reputation exposure
- Risk: high

## Geometry And Adapter
- Adapter: hybrid
- Frames: F1:strategic, F2:evidential, F3:causal
- Tokens: K1:wastewater market-entry team, K2:target jurisdiction and permitting authority, K3:influent composition and variability, K4:direct-discharge versus indirect-discharge pathway, K5:residuals and sludge classification, K6:pilot-performance evidence, K7:partner path and operating model, K8:customer commitment shape, K9:compliance and launch gate, K10:site-specific launch readiness
- Subscenes: SS1:evidence_acquisition, SS2:causal_mechanism, SS3:option_decision

## Evidence And Claims
- Evidence: E1:high, E2:high, E3:high, E4:high, E5:high, E6:high
- Claims: C0:active:high, C1:active:high, C2:active:high, C3:active:high, C4:active:medium, C5:active:medium, C6:active:medium, C7:active:medium, C8:active:medium
- Dissent / contradiction: none recorded

## Graph And Loops
- argumentative edges: X1:C1-supports->C5, X2:C2-supports->C5, X3:C3-supports->C5, X6:C4-supports->G1, X14:C7-supports->C8
- workflow state edges: X4:O1_scope_path-updates->U1, X5:O1_scope_path-updates->U4, X7:O2_run_pilot-updates->U2, X8:O2_run_pilot-updates->U3, X9:O3_conditional_partner-updates->U5, X10:U1-blocks->O3_conditional_partner, X11:U2-blocks->O2_run_pilot, X12:U3-blocks->O3_conditional_partner, X13:G1-constrains->R1
- Loops: L1:learning:balancing

## Decision Surface
- CR1: must threshold; Regulatory path specificity before launch; threshold=Do not launch before one jurisdiction, one discharge pathway, and one permitting authority are fixed.
- CR2: must threshold; Representative performance proof; threshold=Do not commercialize beyond diligence or pilot until representative influent and residuals proof exists for the selected path.
- CR3: must constraint; Compliance and reputation protection; threshold=Do not imply guaranteed compliance or launch readiness while material unknowns remain open.
- CR4: should objective; Reversibility and capital discipline; threshold=Prefer moves that buy information before irreversible spend.
- CR5: should objective; Customer-signal quality; threshold=Preserve customer momentum with conditional commitments that match real evidence quality.
- TS1: dominant=O1_scope_path; criteria=CR1, CR2, CR3, CR4, CR5; reverses_on=T1, T2

## Actors And Time
- Actor A1: executive decision owner; role=decision_owner; authority=approve; exposures=capital risk, timing risk, reputation exposure
- Actor A2: regulatory and compliance reviewer; role=reviewer; authority=block; exposures=legal risk, enforcement risk, reputation exposure
- Actor A3: pilot customer or industrial host; role=beneficiary; authority=advise; exposures=production risk, shared compliance exposure, vendor lock-in risk
- Actor A4: receiving community and affected stakeholders; role=affected_party; authority=observe; exposures=environmental consequence, public-trust loss
- Temporal: horizon=90 days; deadline=2026-08-31; cadence=weekly until U1 through U5 are resolved or accepted as deliberate risk
- Evidence windows: E1:unknown, E2:unknown, E3:unknown, E4:unknown, E5:unknown, E6:unknown

## Options And Gates
- Options: O1_scope_path:query, O2_run_pilot:test, O3_conditional_partner:revise, O4_launch_now:act
- Unknowns: U1:open:Named target jurisdiction, receiving water or POTW, and permitting authority are not fixed.; U2:open:Representative influent composition, variability, and mass-balance data are not fixed.; U3:open:Pilot-performance evidence on representative influent and residual handling is missing.; U4:open:Partner path is not fixed across direct-discharge operator, indirect-discharge/POTW path, or channel/EPC/O&M structure.; U5:open:Customer commitment is not scoped to diligence, pilot, or launch and therefore risks over-commitment.
- Kill tests: KT1:measurement->C5, KT2:constraint_violation->C6
- Gates: G1:open:Any operational launch, long-term binding customer commitment, or public claim of permit-ready performance.; G2:open:Use of pilot data to support commercial design, permit assumptions, or launch messaging.; G3:open:Selection of an exclusive partner or unconditional customer contract.

## Information Value
- U1: impact=high; cost=low; risk_reduction=high; next=Name one target jurisdiction, one discharge pathway, the likely receiving water or POTW, and the primary permitting authority.
- U2: impact=high; cost=medium; risk_reduction=high; next=Obtain representative composite sampling, variability bounds, and mass-balance data for pollutants and residuals from the target waste stream.
- U3: impact=high; cost=medium; risk_reduction=high; next=Design and run a pilot with success metrics tied to the intended permit or pretreatment path and residuals disposition plan.
- U4: impact=medium; cost=low; risk_reduction=medium; next=Choose between direct-discharge operator, indirect-discharge/POTW path, or channel/EPC/O&M model for the selected opportunity.
- U5: impact=medium; cost=low; risk_reduction=medium; next=Convert the customer ask into a conditional LOI or pilot agreement with explicit compliance, schedule, and evidence contingencies.

## Lens Council
- LENS1: strategic sequencing lens; axis=strategic-agentic; blind_spots=site-specific commercial urgency and switching costs are not quantified
- LENS2: regulatory and scientific fit lens; axis=scientific-explanatory; blind_spots=named jurisdiction, local limits, representative influent distributions, and residuals test results are missing
- LENS3: governance and reputation lens; axis=normative-evaluative; blind_spots=local stakeholder sensitivity, customer procurement pressure, and public-trust baseline are not measured
- Council: coverage=strategic-agentic, scientific-explanatory, normative-evaluative; dissent=No dissent on near-term posture; the main unresolved issue is missing site-specific legal and pilot evidence.; effect=Approve O1 now, prepare O2 next, keep O3 conditional, and block O4 until gates can close.

## Decision Rendering
- Rendering: R1
- Recommendation: Proceed with bounded diligence now: lock one candidate jurisdiction and discharge pathway, define representative influent and residuals, and structure only a conditional pilot or diligence-scoped customer commitment. Do not operationally launch or imply guaranteed compliance yet.
- Confidence: medium
- Depends on: C5, C6, C7, C8, U1, U2, U3, U4, U5, TS1, COUNCIL

## Update Logic
- T1: new_evidence -> patch; rendering affected; closure=IV:U1, IV:U2, IV:U3, IV:U4, IV:U5, L1, O1_scope_path, O2_run_pilot, O3_conditional_partner, O4_launch_now, R1, T1, T2, T3, TS1, X10, X11, X12, X13, X4, X5, X7, X8, X9
- T2: regime_shift -> scoped_rerun; rendering affected; closure=C2, C3, C4, C5, C6, C7, C8, COUNCIL, KT1, KT2, L1, LENS1, LENS2, LENS3, O1_scope_path, O2_run_pilot, O3_conditional_partner, O4_launch_now, R1, T2, T3, TS1, X1, X10, X11, X12, X13, X14, X2, X3, X4, X5, X6, X7, X8, X9
- T3: review_required -> human_review; rendering affected; closure=L1, O1_scope_path, O2_run_pilot, O3_conditional_partner, O4_launch_now, R1, T2, T3, TS1, X10, X11, X12, X13, X4, X5, X6, X7, X8, X9

