# OfOne Analyst Map

## Lifecycle
- Artifact: OFONE-2026-05-18-B01-FORMAL-FULL-R1; case=case-formal-proof-search-001; version=0.6.0
- Identity tuple: objective=formal proof-search map with lemma and countermodel pressure; scope=sha256:01634155f084b1646ac6930ab1cdc4787575fff4daf285c017271e0e2719e756; config=sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e
- Evidence hashes: sha256:34f661606d2f46ef1ac0c5fb0c536824b1bc385ae374484aea3c56c65d81395a, sha256:c797b129856f6055e9cb81eb9c3eb764dd839b8edaeb93109db0f1337f2b98ff
- Status: draft; created=2026-05-18T04:20:00Z

## Mode And Charter
- Mode: Map
- Objective: Map the formal proof-search state so axioms, candidate lemma, proof obligations, countermodel pressure, unknowns, and update triggers remain separate.
- Scope: formal proof search; candidate lemma validation; countermodel testing; update behavior after lemma failure
- Risk: medium

## Geometry And Adapter
- Adapter: formal
- Frames: F1:logical, F2:evidential, F3:temporal
- Tokens: K1:axiom set A, K2:target theorem T, K3:candidate lemma L, K4:inference system R, K5:possible countermodel, K6:bounded solver timeout
- Subscenes: SS1:proof_step, SS2:evidence_acquisition, SS3:review_gate

## Evidence And Claims
- Evidence: E1:medium, E2:medium
- Claims: C1:active:high, C2:active:high, C3:active:medium, C4:active:medium
- Dissent / contradiction: C3: status=active; contradicts=C1

## Graph And Loops
- causal edges: X1:K4-constrains->C1
- argumentative edges: X2:C2-supports->C1, X3:C3-contradicts->C1
- workflow state edges: X4:U1-blocks->O1, X5:U2-blocks->O1
- Loops: L1:learning:unknown, L2:contradiction:mixed

## Decision Surface
- CR1: must threshold; Proof-certificate validity; threshold=Do not render theorem T proved without a checkable certificate or explicit proof path under R.
- CR2: must constraint; Countermodel exclusion; threshold=A verified countermodel defeats the entailment claim under the same formalization.
- CR3: should constraint; Lemma obligation isolation; threshold=Keep candidate lemma status separate from theorem status until the lemma obligation is resolved.
- TS1: dominant=O1; criteria=CR1, CR2, CR3; reverses_on=U1, U2, T1, T2

## Actors And Time
- Actor A1: proof reviewer; role=reviewer; authority=approve; exposures=formal error, benchmark scoring error
- Temporal: horizon=bounded proof-search cycle; deadline=before declaring proved or not entailed; cadence=after every proof-checker or countermodel result
- Evidence windows: E1:case dossier changes, E2:case dossier changes

## Options And Gates
- Options: O1:prove, O2:test, O3:revise
- Unknowns: U1:open:No checked proof certificate or countermodel artifact is present.; U2:open:The candidate lemma has not been proved as a separate obligation.
- Kill tests: KT1:countermodel->C1, KT2:counterexample->C2
- Gates: none recorded

## Information Value
- U1: impact=high; cost=medium; risk_reduction=high; next=Run proof checker and countermodel search under the same formalization and retain artifacts.
- U2: impact=high; cost=medium; risk_reduction=high; next=Resolve candidate lemma L as a separate proof obligation before using it in theorem proof path.

## Lens Council
- LENS1: formal proof lens; axis=formal; blind_spots=actual axiom and theorem text are absent
- Council: coverage=formal; dissent=U1 and U2 block the rendered proof conclusion; effect=Return unresolved until proof certificate, countermodel, and candidate lemma status are recorded.

## Decision Rendering
- Rendering: R1
- Recommendation: Do not declare T proved or not entailed until a checked certificate, verified countermodel, or failed lemma obligation is recorded.
- Confidence: medium
- Depends on: C1, C2, C3, C4, U1, U2, O1, O2, O3, TS1, L1, L2, COUNCIL

## Update Logic
- T1: new_evidence -> patch; rendering affected; closure=L2, O2, R1, T1, TS1, X3
- T2: scope_change -> scoped_rerun; rendering affected; closure=C1, C2, C3, COUNCIL, KT1, KT2, L1, L2, LENS1, O1, O2, O3, R1, SS1, SS3, T1, T2, TS1, X1, X2, X3, X4, X5

