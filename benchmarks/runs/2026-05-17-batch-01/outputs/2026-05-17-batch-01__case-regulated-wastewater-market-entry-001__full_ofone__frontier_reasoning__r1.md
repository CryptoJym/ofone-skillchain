# Benchmark Raw Output

Run ID: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1`
Case ID: `case-regulated-wastewater-market-entry-001`
Arm: `full_ofone`
Model family: `frontier_reasoning`
Repeat: `1`
Status: `completed`

## Artifact JSON

```json
{
  "ofone_version": "0.5.0",
  "mode": "Map",
  "charter": {
    "objective": "Produce a decision-ready map for U.S. regulated wastewater market entry that separates bounded diligence from operational launch and keeps evidence, claims, unknowns, gates, option moves, triggers, and rendering explicit.",
    "scope": [
      "United States regulated wastewater treatment market entry",
      "Unfixed jurisdiction, influent profile, treatment proof, partner path, and customer commitment",
      "Direct-discharge and indirect-discharge paths",
      "Compliance, residuals, and reputation exposure"
    ],
    "horizon": "90 days to a narrowed go/no-go and pilot posture",
    "stakes": [
      "capital risk",
      "compliance exposure",
      "reputation exposure",
      "environmental consequence",
      "customer trust"
    ],
    "risk_tier": "high",
    "movement_jobs": [
      "BOUND",
      "GATE",
      "TRIGGER"
    ]
  },
  "adapter_projection": {
    "primary": "hybrid",
    "axes": {
      "strategic-agentic": [
        "market-entry sequencing",
        "partner path selection",
        "customer-commitment design",
        "reversibility before launch"
      ],
      "scientific-explanatory": [
        "influent characterization",
        "treatment performance proof",
        "residuals characterization",
        "permit-path mechanism fit"
      ],
      "normative-evaluative": [
        "compliance exposure",
        "reputation exposure",
        "affected-party risk",
        "truthful commitment boundaries"
      ]
    },
    "movement_jobs": [
      "BOUND",
      "LINK"
    ]
  },
  "scene": {
    "scene_id": "S1",
    "frames": [
      {
        "frame_id": "F1",
        "type": "strategic",
        "assumptions": [
          "market entry can be staged",
          "diligence and launch are separate decisions"
        ]
      },
      {
        "frame_id": "F2",
        "type": "evidential",
        "assumptions": [
          "generic federal rules are necessary but not sufficient for site-specific launch",
          "representative influent and residual data matter more than generic treatment claims"
        ]
      },
      {
        "frame_id": "F3",
        "type": "causal",
        "assumptions": [
          "permit-path ambiguity, influent ambiguity, and proof ambiguity compound launch risk",
          "better evidence can reverse the rendered recommendation through patch closure"
        ]
      }
    ],
    "tokens": [
      {
        "token_id": "K1",
        "kind": "entity",
        "label": "wastewater market-entry team"
      },
      {
        "token_id": "K2",
        "kind": "variable",
        "label": "target jurisdiction and permitting authority"
      },
      {
        "token_id": "K3",
        "kind": "variable",
        "label": "influent composition and variability"
      },
      {
        "token_id": "K4",
        "kind": "constraint",
        "label": "direct-discharge versus indirect-discharge pathway"
      },
      {
        "token_id": "K5",
        "kind": "variable",
        "label": "residuals and sludge classification"
      },
      {
        "token_id": "K6",
        "kind": "variable",
        "label": "pilot-performance evidence"
      },
      {
        "token_id": "K7",
        "kind": "variable",
        "label": "partner path and operating model"
      },
      {
        "token_id": "K8",
        "kind": "variable",
        "label": "customer commitment shape"
      },
      {
        "token_id": "K9",
        "kind": "gate",
        "label": "compliance and launch gate"
      },
      {
        "token_id": "K10",
        "kind": "unknown",
        "label": "site-specific launch readiness"
      }
    ],
    "subscenes": [
      {
        "subscene_id": "SS1",
        "parent_scene": "S1",
        "purpose": "evidence_acquisition",
        "frames": [
          "F2"
        ],
        "tokens": [
          "K2",
          "K4",
          "K5"
        ],
        "entry_conditions": [
          "federal regulatory frame is known but no jurisdiction is fixed"
        ],
        "exit_conditions": [
          "one candidate jurisdiction, receiving water or POTW, and primary authority path are identified"
        ],
        "movement_jobs": [
          "BOUND",
          "GROUND"
        ]
      },
      {
        "subscene_id": "SS2",
        "parent_scene": "S1",
        "purpose": "causal_mechanism",
        "frames": [
          "F2",
          "F3"
        ],
        "tokens": [
          "K3",
          "K5",
          "K6"
        ],
        "entry_conditions": [
          "candidate wastewater source and discharge pathway are narrowed"
        ],
        "exit_conditions": [
          "pilot protocol, success criteria, and residuals plan are tied to the intended regulatory path"
        ],
        "movement_jobs": [
          "LINK",
          "TEST",
          "WARN"
        ]
      },
      {
        "subscene_id": "SS3",
        "parent_scene": "S1",
        "purpose": "option_decision",
        "frames": [
          "F1",
          "F3"
        ],
        "tokens": [
          "K7",
          "K8",
          "K9",
          "K10"
        ],
        "entry_conditions": [
          "team must choose between diligence, pilot, conditional partnership, or launch posture"
        ],
        "exit_conditions": [
          "dominant near-term move is selected or launch remains blocked by unknowns and gates"
        ],
        "movement_jobs": [
          "MOVE",
          "EVALUATE",
          "GATE"
        ]
      }
    ],
    "state_variables": [
      "jurisdiction",
      "permit authority",
      "discharge pathway",
      "influent profile",
      "technology-performance proof",
      "residuals classification",
      "partner path",
      "customer commitment level"
    ],
    "observed_variables": [
      "federal NPDES permit requirement for direct discharge",
      "technology-based industrial effluent structure",
      "pretreatment pathway for indirect discharge to POTWs",
      "hazardous-waste examples among wastewater residuals"
    ],
    "hidden_variables": [
      "site-specific permit limits",
      "local limits and ordinances",
      "influent shock loads and variability",
      "residuals disposal outcome",
      "local enforcement and community sensitivity"
    ],
    "movement_jobs": [
      "BOUND",
      "WARN"
    ]
  },
  "evidence": [
    {
      "evidence_id": "E1",
      "source": "url",
      "span_or_locator": "https://www.epa.gov/npdes/npdes-permit-basics, lines 70-76",
      "provenance": "US EPA NPDES Permit Basics page",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:ae68c5f8e66f6576820fd6ca942eff808148d5b1eca91c1d7e369931212f16f4",
      "retrieved_at": "2026-05-21T06:00:00Z",
      "extract": "The Clean Water Act prohibits anybody from discharging pollutants through a point source into a water of the United States unless they have an NPDES permit; the permit contains limits, monitoring, reporting, and other provisions to protect water quality and people's health.",
      "source_owner": "US EPA",
      "chain_of_custody": "retrieved from public EPA webpage during this benchmark response",
      "supports": [
        "C1",
        "C7"
      ],
      "risks": [
        "does_not_resolve_site_specific_jurisdiction",
        "does_not_resolve_indirect_discharge_details"
      ],
      "movement_jobs": [
        "GROUND",
        "BOUND"
      ]
    },
    {
      "evidence_id": "E2",
      "source": "url",
      "span_or_locator": "https://www.epa.gov/npdes/npdes-state-program-authorization-information, lines 78-89",
      "provenance": "US EPA NPDES State Program Authorization Information page",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:433ad3fee3898a352b5c6086fd4a1180ceb68fbfed03465961ee49e778cda09d",
      "retrieved_at": "2026-05-21T06:00:00Z",
      "extract": "States, territories, and tribes may receive authorization for one or more NPDES program components; if EPA disapproves a program or a component is not authorized, EPA remains the permitting authority, and EPA continues to issue permits on tribal lands unless the tribe administers its own approved program.",
      "source_owner": "US EPA",
      "chain_of_custody": "retrieved from public EPA webpage during this benchmark response",
      "supports": [
        "C2",
        "C7"
      ],
      "risks": [
        "does_not_pick_the_target_state_or_tribal_context",
        "component_level_authorization_can_still_vary"
      ],
      "movement_jobs": [
        "GROUND",
        "LINK"
      ]
    },
    {
      "evidence_id": "E3",
      "source": "url",
      "span_or_locator": "https://www.epa.gov/eg/industrial-effluent-guidelines, lines 69-73",
      "provenance": "US EPA Industrial Effluent Guidelines page",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:a6a7d4a38a900796f12f32fb1ee0cbd4d82ba32bf3229693e09868e87d8cc6bb",
      "retrieved_at": "2026-05-21T06:00:00Z",
      "extract": "Effluent Guidelines are national standards for industrial wastewater discharges to surface waters and publicly owned treatment works; EPA issues them by industry category and the standards are technology-based.",
      "source_owner": "US EPA",
      "chain_of_custody": "retrieved from public EPA webpage during this benchmark response",
      "supports": [
        "C3",
        "C6"
      ],
      "risks": [
        "category_specific_limits_not_yet_mapped",
        "technology_standard_alone_does_not_guarantee_site_fit"
      ],
      "movement_jobs": [
        "GROUND",
        "LINK"
      ]
    },
    {
      "evidence_id": "E4",
      "source": "url",
      "span_or_locator": "https://www.epa.gov/npdes/national-pretreatment-program, lines 79-90",
      "provenance": "US EPA National Pretreatment Program page",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:ccbae10fa18e5b33beb99c90a7c23084dadc9b3806412c766f757915845dc8e6",
      "retrieved_at": "2026-05-21T06:00:00Z",
      "extract": "The national pretreatment program is a component of NPDES; EPA and authorized NPDES states approve local municipalities to perform permitting, administrative, and enforcement tasks for discharges into POTWs; the program protects POTW infrastructure and reduces conventional and toxic pollutant levels from industries and other nondomestic wastewater sources.",
      "source_owner": "US EPA",
      "chain_of_custody": "retrieved from public EPA webpage during this benchmark response",
      "supports": [
        "C3",
        "C7"
      ],
      "risks": [
        "local_limits_and_control_authority_requirements_remain_unknown",
        "municipal_acceptance_for_specific_waste_stream_is_unproven"
      ],
      "movement_jobs": [
        "GROUND",
        "LINK"
      ]
    },
    {
      "evidence_id": "E5",
      "source": "url",
      "span_or_locator": "https://www.epa.gov/hw/defining-hazardous-waste-listed-characteristic-and-mixed-radiological-wastes, lines 119-120 and 146-153",
      "provenance": "US EPA listed hazardous waste page",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:583d553329eb91a400975deeff987f2fa3dfa83dd7e9db794e60c5de3c235a2b",
      "retrieved_at": "2026-05-21T06:00:00Z",
      "extract": "EPA identifies listed hazardous wastes that include petroleum refinery wastewater treatment sludges and multiple electroplating wastewater treatment sludges, showing that wastewater residuals can create hazardous-waste obligations separate from water-discharge permits.",
      "source_owner": "US EPA",
      "chain_of_custody": "retrieved from public EPA webpage during this benchmark response",
      "supports": [
        "C4"
      ],
      "risks": [
        "listed_examples_may_not_match_target_stream",
        "characteristic_hazardous_waste_analysis_is_still_missing"
      ],
      "movement_jobs": [
        "GROUND",
        "WARN"
      ]
    },
    {
      "evidence_id": "E6",
      "source": "file",
      "span_or_locator": "benchmarks/cases/regulated-wastewater-market-entry.md, lines 252-259",
      "provenance": "public OfOne benchmark case file",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:e29953cac0e53c09f59f2178a9750caf47b28f8d7e3e046605d5bca011d49a09",
      "retrieved_at": "2026-05-21T06:00:00Z",
      "extract": "The case defines missing jurisdiction-specific regulatory evidence, missing pilot-performance evidence, compliance and reputation gates, the distinction between diligence and operational launch, and patch closure from new evidence to rendering as explicit pressure points.",
      "source_owner": "CryptoJym/ofone-skillchain",
      "chain_of_custody": "retrieved from public benchmark case file during this benchmark response",
      "supports": [
        "C0",
        "C5",
        "C8"
      ],
      "risks": [
        "case_pressure_points_do_not_replace_site_specific_regulatory_evidence"
      ],
      "movement_jobs": [
        "GROUND",
        "BOUND"
      ]
    }
  ],
  "claims": [
    {
      "claim_id": "C0",
      "text": "This case requires a decision map that keeps unresolved jurisdiction, influent, proof, partner path, and customer commitment explicit rather than collapsing them into a launch recommendation.",
      "type": "descriptive",
      "supports": [
        "E6"
      ],
      "contradicts": [],
      "depends_on": [],
      "confidence": {
        "level": "high",
        "basis": [
          "provenance",
          "recency",
          "adapter_fit"
        ],
        "failure_modes": [
          "case_interpretation_error"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "BOUND"
      ]
    },
    {
      "claim_id": "C1",
      "text": "If the venture will directly discharge pollutants from a point source to waters of the United States, it needs NPDES permit coverage with limits, monitoring, and reporting before operational launch.",
      "type": "operational",
      "supports": [
        "E1"
      ],
      "contradicts": [],
      "depends_on": [],
      "confidence": {
        "level": "high",
        "basis": [
          "provenance",
          "recency",
          "adapter_fit"
        ],
        "failure_modes": [
          "activity_may_not_be_direct_discharge",
          "receiving_water_status_may_be_contested"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "GROUND",
        "GATE"
      ]
    },
    {
      "claim_id": "C2",
      "text": "The permitting authority and path are jurisdiction-specific because authorization can differ by program component and EPA can retain authority for some components or lands.",
      "type": "causal",
      "supports": [
        "E2"
      ],
      "contradicts": [],
      "depends_on": [
        "C1"
      ],
      "confidence": {
        "level": "high",
        "basis": [
          "provenance",
          "recency",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "authority_split_not_yet_mapped",
          "tribal_or_federal_land_context_unknown"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "LINK",
        "WARN"
      ]
    },
    {
      "claim_id": "C3",
      "text": "Industrial wastewater obligations are pollutant- and category-specific, including national effluent guidelines for direct discharges and pretreatment requirements for indirect discharges to POTWs.",
      "type": "descriptive",
      "supports": [
        "E3",
        "E4"
      ],
      "contradicts": [],
      "depends_on": [
        "C1",
        "C2"
      ],
      "confidence": {
        "level": "high",
        "basis": [
          "provenance",
          "recency",
          "mechanism_fit"
        ],
        "failure_modes": [
          "wrong_industry_category_selected",
          "local_limits_not_yet_known"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "GROUND",
        "LINK"
      ]
    },
    {
      "claim_id": "C4",
      "text": "Residuals and sludges can create separate hazardous-waste obligations, so market-entry diligence must include residual characterization and disposition, not only liquid effluent quality.",
      "type": "operational",
      "supports": [
        "E5"
      ],
      "contradicts": [],
      "depends_on": [
        "C3"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "mechanism_fit",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "target_residuals_may_not_be_listed",
          "characteristic_testing_is_missing"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "WARN",
        "GATE"
      ]
    },
    {
      "claim_id": "C5",
      "text": "Because U1 through U5 remain open, the only justified near-term posture is bounded diligence and pilot scoping; operational launch or an unconditional commercial commitment is premature.",
      "type": "normative",
      "supports": [
        "E6"
      ],
      "contradicts": [],
      "depends_on": [
        "C0",
        "C1",
        "C2",
        "C3",
        "C4"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "adapter_fit",
          "mechanism_fit",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "unknowns_resolve_faster_than_expected",
          "specific_jurisdiction_and_customer_case_already_meet_gate"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "claim_id": "C6",
      "text": "A representative pilot tied to one named jurisdiction, one discharge path, one influent profile, and one residuals plan can materially reduce launch-decision error.",
      "type": "predictive",
      "supports": [
        "E3",
        "E4"
      ],
      "contradicts": [],
      "depends_on": [
        "C2",
        "C3",
        "C4"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "mechanism_fit",
          "adapter_fit",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "pilot_not_representative",
          "scale_up_mismatch",
          "permit_terms_change"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "TEST",
        "EVALUATE"
      ]
    },
    {
      "claim_id": "C7",
      "text": "Two partner paths should be kept analytically separate: an indirect-discharge path through a POTW and a direct-discharge path that requires surface-water permit coverage.",
      "type": "operational",
      "supports": [
        "E1",
        "E2",
        "E4"
      ],
      "contradicts": [],
      "depends_on": [
        "C1",
        "C2",
        "C3"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "mechanism_fit",
          "adapter_fit"
        ],
        "failure_modes": [
          "hybrid_path_not_yet_defined",
          "non_discharge_or_reuse_path_selected"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "LINK",
        "MOVE"
      ]
    },
    {
      "claim_id": "C8",
      "text": "Any customer commitment before U1 through U5 are narrowed should be conditional and diligence-scoped rather than a revenue-launch promise.",
      "type": "normative",
      "supports": [
        "E6"
      ],
      "contradicts": [],
      "depends_on": [
        "C5",
        "C7"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "adapter_fit",
          "adversarial_risk",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "customer_requires_unconditional_commitment",
          "internal_pressure_blurs_pilot_and_launch"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "WARN",
        "GATE"
      ]
    }
  ],
  "unknowns": [
    {
      "unknown_id": "U1",
      "kind": "missing_evidence",
      "description": "Named target jurisdiction, receiving water or POTW, and permitting authority are not fixed.",
      "blocks": [
        "O2_run_pilot",
        "O3_conditional_partner",
        "O4_launch_now",
        "R1"
      ],
      "resolution_move": "Select one target jurisdiction and discharge pathway, then obtain a jurisdiction-specific regulatory path memo and authority confirmation.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "GATE",
        "TEST"
      ]
    },
    {
      "unknown_id": "U2",
      "kind": "missing_measurement",
      "description": "Representative influent composition, variability, and mass-balance data are not fixed.",
      "blocks": [
        "O2_run_pilot",
        "O4_launch_now",
        "R1"
      ],
      "resolution_move": "Collect customer-like composite sampling data, upset-case scenarios, and mass balance for pollutants and residuals.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "TEST",
        "GATE"
      ]
    },
    {
      "unknown_id": "U3",
      "kind": "missing_measurement",
      "description": "Pilot-performance evidence on representative influent and residual handling is missing.",
      "blocks": [
        "O3_conditional_partner",
        "O4_launch_now",
        "R1"
      ],
      "resolution_move": "Run a representative pilot or equivalent full-scale demonstration tied to named permit or pretreatment success metrics.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "TEST",
        "GATE"
      ]
    },
    {
      "unknown_id": "U4",
      "kind": "missing_claim",
      "description": "Partner path is not fixed across direct-discharge operator, indirect-discharge/POTW path, or channel/EPC/O&M structure.",
      "blocks": [
        "O3_conditional_partner",
        "O4_launch_now",
        "R1"
      ],
      "resolution_move": "Choose one operating model and one accountable partner path aligned to the selected regulatory pathway.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "MOVE",
        "GATE"
      ]
    },
    {
      "unknown_id": "U5",
      "kind": "missing_claim",
      "description": "Customer commitment is not scoped to diligence, pilot, or launch and therefore risks over-commitment.",
      "blocks": [
        "O3_conditional_partner",
        "O4_launch_now",
        "R1"
      ],
      "resolution_move": "Convert the commercial ask into a conditional LOI or pilot agreement with explicit compliance and performance contingencies.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "MOVE",
        "GATE"
      ]
    }
  ],
  "kill_tests": [
    {
      "test_id": "KT1",
      "target": "C5",
      "test_type": "measurement",
      "condition": "A named jurisdiction and discharge path are fixed, representative influent and residuals are characterized, pilot results meet the intended permit or pretreatment envelope with workable residuals disposition, and the launch gate can be approved.",
      "falsifies": [
        "C5"
      ],
      "movement_jobs": [
        "TEST",
        "WARN"
      ]
    },
    {
      "test_id": "KT2",
      "target": "C6",
      "test_type": "constraint_violation",
      "condition": "Representative pilot results fail against the selected jurisdiction's expected permit or pretreatment success criteria, or residuals characterization makes commercialization infeasible.",
      "falsifies": [
        "C6"
      ],
      "movement_jobs": [
        "TEST",
        "WARN"
      ]
    }
  ],
  "edges": [
    {
      "edge_id": "X1",
      "from": "C1",
      "to": "C5",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK"
      ]
    },
    {
      "edge_id": "X2",
      "from": "C2",
      "to": "C5",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E2"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK"
      ]
    },
    {
      "edge_id": "X3",
      "from": "C3",
      "to": "C5",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E3",
        "E4"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK"
      ]
    },
    {
      "edge_id": "X4",
      "from": "O1_scope_path",
      "to": "U1",
      "relation_family": "workflow_state",
      "relation": "updates",
      "evidence_refs": [],
      "confidence": "medium",
      "movement_jobs": [
        "MOVE"
      ]
    },
    {
      "edge_id": "X5",
      "from": "O1_scope_path",
      "to": "U4",
      "relation_family": "workflow_state",
      "relation": "updates",
      "evidence_refs": [],
      "confidence": "medium",
      "movement_jobs": [
        "MOVE"
      ]
    },
    {
      "edge_id": "X6",
      "from": "C4",
      "to": "G1",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E5"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "LINK",
        "GATE"
      ]
    },
    {
      "edge_id": "X7",
      "from": "O2_run_pilot",
      "to": "U2",
      "relation_family": "workflow_state",
      "relation": "updates",
      "evidence_refs": [],
      "confidence": "medium",
      "movement_jobs": [
        "MOVE",
        "TEST"
      ]
    },
    {
      "edge_id": "X8",
      "from": "O2_run_pilot",
      "to": "U3",
      "relation_family": "workflow_state",
      "relation": "updates",
      "evidence_refs": [],
      "confidence": "medium",
      "movement_jobs": [
        "MOVE",
        "TEST"
      ]
    },
    {
      "edge_id": "X9",
      "from": "O3_conditional_partner",
      "to": "U5",
      "relation_family": "workflow_state",
      "relation": "updates",
      "evidence_refs": [],
      "confidence": "medium",
      "movement_jobs": [
        "MOVE"
      ]
    },
    {
      "edge_id": "X10",
      "from": "U1",
      "to": "O3_conditional_partner",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    },
    {
      "edge_id": "X11",
      "from": "U2",
      "to": "O2_run_pilot",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "medium",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    },
    {
      "edge_id": "X12",
      "from": "U3",
      "to": "O3_conditional_partner",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    },
    {
      "edge_id": "X13",
      "from": "G1",
      "to": "R1",
      "relation_family": "workflow_state",
      "relation": "constrains",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "GATE",
        "LINK"
      ]
    },
    {
      "edge_id": "X14",
      "from": "C7",
      "to": "C8",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E1",
        "E2",
        "E4"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "LINK"
      ]
    }
  ],
  "loops": [
    {
      "loop_id": "L1",
      "type": "learning",
      "edges": [
        "X4",
        "X7",
        "X8",
        "X13"
      ],
      "polarity": "balancing",
      "delay": "medium",
      "gain": "medium",
      "control_points": [
        "fix one target jurisdiction before pilot spend",
        "tie pilot success metrics to the intended permit or pretreatment path",
        "keep launch decision behind G1 until unknowns close"
      ],
      "observable_cues": [
        "U1 through U3 move from open toward resolved",
        "pilot design references named influent and residuals plan",
        "decision rendering confidence increases"
      ],
      "failure_mode": "A nonrepresentative pilot or wrong regulatory path creates false confidence and causes premature launch pressure.",
      "movement_jobs": [
        "TRIGGER",
        "EVALUATE",
        "WARN"
      ]
    }
  ],
  "option_moves": [
    {
      "option_id": "O1_scope_path",
      "move_type": "query",
      "preconditions": [],
      "expected_effects": [
        "X4",
        "X5"
      ],
      "tradeoffs": [
        "low irreversibility",
        "slower revenue signaling",
        "highest regulatory-information value"
      ],
      "blocking_unknowns": [],
      "review_gate": "G1",
      "movement_jobs": [
        "MOVE",
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "option_id": "O2_run_pilot",
      "move_type": "test",
      "preconditions": [
        "C1",
        "C7"
      ],
      "expected_effects": [
        "X7",
        "X8"
      ],
      "tradeoffs": [
        "requires sample access and protocol discipline",
        "burns time and capital",
        "best way to reduce U2 and U3 if representative"
      ],
      "blocking_unknowns": [
        "U1",
        "U2"
      ],
      "review_gate": "G2",
      "movement_jobs": [
        "MOVE",
        "TEST",
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "option_id": "O3_conditional_partner",
      "move_type": "revise",
      "preconditions": [
        "C6",
        "C7"
      ],
      "expected_effects": [
        "X9"
      ],
      "tradeoffs": [
        "preserves customer momentum without full launch",
        "adds contracting complexity",
        "still unsafe if represented as launch-ready"
      ],
      "blocking_unknowns": [
        "U3",
        "U4",
        "U5"
      ],
      "review_gate": "G3",
      "movement_jobs": [
        "MOVE",
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "option_id": "O4_launch_now",
      "move_type": "act",
      "preconditions": [],
      "expected_effects": [],
      "tradeoffs": [
        "fastest commercial signal",
        "highest compliance and reputation downside",
        "poor reversibility"
      ],
      "blocking_unknowns": [
        "U1",
        "U2",
        "U3",
        "U4",
        "U5"
      ],
      "review_gate": "G1",
      "movement_jobs": [
        "MOVE",
        "WARN",
        "GATE"
      ]
    }
  ],
  "triggers": [
    {
      "trigger_id": "T1",
      "condition": "new_evidence",
      "affected_objects": [
        "U1",
        "U2",
        "U3",
        "U4",
        "U5"
      ],
      "transition": "patch",
      "movement_jobs": [
        "TRIGGER"
      ]
    },
    {
      "trigger_id": "T2",
      "condition": "regime_shift",
      "affected_objects": [
        "C1",
        "C2",
        "C3",
        "G1",
        "R1"
      ],
      "transition": "scoped_rerun",
      "movement_jobs": [
        "TRIGGER",
        "WARN"
      ]
    },
    {
      "trigger_id": "T3",
      "condition": "review_required",
      "affected_objects": [
        "G1",
        "G2",
        "G3",
        "R1"
      ],
      "transition": "human_review",
      "movement_jobs": [
        "TRIGGER",
        "GATE"
      ]
    }
  ],
  "gates": [
    {
      "gate_id": "G1",
      "condition": "Any operational launch, long-term binding customer commitment, or public claim of permit-ready performance.",
      "reviewer": "executive decision owner with regulatory/compliance reviewer",
      "required_decision": "approve diligence only, approve pilot only, or block launch until jurisdiction, influent, discharge path, and residuals plan are fixed.",
      "status": "open",
      "movement_jobs": [
        "GATE"
      ]
    },
    {
      "gate_id": "G2",
      "condition": "Use of pilot data to support commercial design, permit assumptions, or launch messaging.",
      "reviewer": "technical lead plus regulatory/compliance reviewer",
      "required_decision": "confirm pilot representativeness against the selected regulatory path and target influent before commercial use.",
      "status": "open",
      "movement_jobs": [
        "GATE"
      ]
    },
    {
      "gate_id": "G3",
      "condition": "Selection of an exclusive partner or unconditional customer contract.",
      "reviewer": "executive decision owner plus customer-facing owner",
      "required_decision": "keep commitment conditional and diligence-scoped unless U1 through U5 are materially resolved and G1 can be closed.",
      "status": "open",
      "movement_jobs": [
        "GATE"
      ]
    }
  ],
  "confidence_model": {
    "overall": "medium",
    "provenance_strength": "high",
    "source_independence": "medium",
    "recency": "high",
    "mechanism_fit": "medium",
    "contradiction_load": "low",
    "hidden_variable_risk": "high",
    "adversarial_risk": "medium",
    "adapter_fit": "high",
    "movement_jobs": [
      "EVALUATE",
      "WARN"
    ]
  },
  "decision_rendering": {
    "rendering_id": "R1",
    "summary": "Federal regulatory evidence supports a jurisdiction-first diligence posture, but unresolved jurisdiction, influent, pilot proof, partner path, and customer-commitment shape still block operational launch.",
    "recommendation": "Proceed with bounded diligence now: lock one candidate jurisdiction and discharge pathway, define representative influent and residuals, and structure only a conditional pilot or diligence-scoped customer commitment. Do not operationally launch or imply guaranteed compliance yet.",
    "confidence": "medium",
    "depends_on": [
      "C5",
      "C6",
      "C7",
      "C8",
      "U1",
      "U2",
      "U3",
      "U4",
      "U5",
      "TS1",
      "COUNCIL"
    ],
    "movement_jobs": [
      "EVALUATE",
      "MOVE",
      "GATE"
    ]
  },
  "artifact_identity": {
    "artifact_id": "OFONE-2026-05-21-case-regulated-wastewater-market-entry-001-frontier_reasoning-r1",
    "case_id": "case-regulated-wastewater-market-entry-001",
    "objective_head": "regulated wastewater market entry",
    "scope_hash": "unknown",
    "config_hash": "unknown",
    "active_evidence_hashes": [
      "sha256:ae68c5f8e66f6576820fd6ca942eff808148d5b1eca91c1d7e369931212f16f4",
      "sha256:433ad3fee3898a352b5c6086fd4a1180ceb68fbfed03465961ee49e778cda09d",
      "sha256:a6a7d4a38a900796f12f32fb1ee0cbd4d82ba32bf3229693e09868e87d8cc6bb",
      "sha256:ccbae10fa18e5b33beb99c90a7c23084dadc9b3806412c766f757915845dc8e6",
      "sha256:583d553329eb91a400975deeff987f2fa3dfa83dd7e9db794e60c5de3c235a2b",
      "sha256:e29953cac0e53c09f59f2178a9750caf47b28f8d7e3e046605d5bca011d49a09"
    ],
    "created_at": "2026-05-21T06:00:00Z",
    "status": "review_pending",
    "movement_jobs": [
      "BOUND",
      "TRIGGER"
    ]
  },
  "actors": [
    {
      "actor_id": "A1",
      "label": "executive decision owner",
      "role": "decision_owner",
      "incentives": [
        "enter an attractive market with controlled downside"
      ],
      "exposures": [
        "capital risk",
        "timing risk",
        "reputation exposure"
      ],
      "authority": "approve",
      "legitimacy_basis": "owns the market-entry decision",
      "movement_jobs": [
        "BOUND",
        "WARN",
        "GATE"
      ]
    },
    {
      "actor_id": "A2",
      "label": "regulatory and compliance reviewer",
      "role": "reviewer",
      "incentives": [
        "avoid permit and hazardous-waste missteps",
        "preserve license to operate"
      ],
      "exposures": [
        "legal risk",
        "enforcement risk",
        "reputation exposure"
      ],
      "authority": "block",
      "legitimacy_basis": "assigned gating responsibility for compliance and truthfulness",
      "movement_jobs": [
        "BOUND",
        "WARN",
        "GATE"
      ]
    },
    {
      "actor_id": "A3",
      "label": "pilot customer or industrial host",
      "role": "beneficiary",
      "incentives": [
        "solve wastewater pain without production disruption"
      ],
      "exposures": [
        "production risk",
        "shared compliance exposure",
        "vendor lock-in risk"
      ],
      "authority": "advise",
      "legitimacy_basis": "provides the representative operating context and commercial demand signal",
      "movement_jobs": [
        "BOUND",
        "MOVE",
        "WARN"
      ]
    },
    {
      "actor_id": "A4",
      "label": "receiving community and affected stakeholders",
      "role": "affected_party",
      "incentives": [
        "avoid environmental harm and misrepresentation"
      ],
      "exposures": [
        "environmental consequence",
        "public-trust loss"
      ],
      "authority": "observe",
      "legitimacy_basis": "bears downstream consequences of a bad launch decision",
      "movement_jobs": [
        "BOUND",
        "WARN"
      ]
    }
  ],
  "criteria": [
    {
      "criterion_id": "CR1",
      "name": "Regulatory path specificity before launch",
      "kind": "threshold",
      "priority": "must",
      "threshold": "Do not launch before one jurisdiction, one discharge pathway, and one permitting authority are fixed.",
      "owned_by": [
        "A2"
      ],
      "movement_jobs": [
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "criterion_id": "CR2",
      "name": "Representative performance proof",
      "kind": "threshold",
      "priority": "must",
      "threshold": "Do not commercialize beyond diligence or pilot until representative influent and residuals proof exists for the selected path.",
      "owned_by": [
        "A2",
        "A3"
      ],
      "movement_jobs": [
        "EVALUATE",
        "TEST",
        "GATE"
      ]
    },
    {
      "criterion_id": "CR3",
      "name": "Compliance and reputation protection",
      "kind": "constraint",
      "priority": "must",
      "threshold": "Do not imply guaranteed compliance or launch readiness while material unknowns remain open.",
      "owned_by": [
        "A2",
        "A4"
      ],
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    },
    {
      "criterion_id": "CR4",
      "name": "Reversibility and capital discipline",
      "kind": "objective",
      "priority": "should",
      "threshold": "Prefer moves that buy information before irreversible spend.",
      "owned_by": [
        "A1"
      ],
      "movement_jobs": [
        "EVALUATE",
        "MOVE"
      ]
    },
    {
      "criterion_id": "CR5",
      "name": "Customer-signal quality",
      "kind": "objective",
      "priority": "should",
      "threshold": "Preserve customer momentum with conditional commitments that match real evidence quality.",
      "owned_by": [
        "A1",
        "A3"
      ],
      "movement_jobs": [
        "EVALUATE",
        "MOVE",
        "WARN"
      ]
    }
  ],
  "tradeoff_surface": {
    "surface_id": "TS1",
    "options": [
      "O1_scope_path",
      "O2_run_pilot",
      "O3_conditional_partner",
      "O4_launch_now"
    ],
    "criteria": [
      "CR1",
      "CR2",
      "CR3",
      "CR4",
      "CR5"
    ],
    "dominant_option": "O1_scope_path",
    "why": [
      "CR1",
      "CR2",
      "CR4"
    ],
    "reversal_conditions": [
      "T1",
      "T2"
    ],
    "movement_jobs": [
      "EVALUATE",
      "TRIGGER"
    ]
  },
  "temporal_model": {
    "time_horizon": "90 days",
    "decision_deadline": "2026-08-31",
    "evidence_validity_windows": [
      {
        "evidence_id": "E1",
        "valid_until": "unknown",
        "staleness_trigger": "EPA NPDES guidance or policy changes, or a specific discharge path is selected."
      },
      {
        "evidence_id": "E2",
        "valid_until": "unknown",
        "staleness_trigger": "Authority tables change, or the selected state, tribal, territorial, or federal context narrows."
      },
      {
        "evidence_id": "E3",
        "valid_until": "unknown",
        "staleness_trigger": "Relevant industrial category, technology assumptions, or effluent-guideline updates change."
      },
      {
        "evidence_id": "E4",
        "valid_until": "unknown",
        "staleness_trigger": "Local pretreatment status, categorical standards, or POTW acceptance conditions change."
      },
      {
        "evidence_id": "E5",
        "valid_until": "unknown",
        "staleness_trigger": "Residuals characterization shows a different listing or characteristic outcome."
      },
      {
        "evidence_id": "E6",
        "valid_until": "unknown",
        "staleness_trigger": "Benchmark case text is revised or an explicit update event is introduced."
      }
    ],
    "update_cadence": "weekly until U1 through U5 are resolved or accepted as deliberate risk",
    "movement_jobs": [
      "BOUND",
      "TRIGGER",
      "WARN"
    ]
  },
  "information_value": [
    {
      "unknown_id": "U1",
      "decision_impact": "high",
      "resolution_cost": "low",
      "time_to_resolve": "1 to 3 weeks",
      "risk_reduction": "high",
      "recommended_next_query": "Name one target jurisdiction, one discharge pathway, the likely receiving water or POTW, and the primary permitting authority.",
      "movement_jobs": [
        "TEST",
        "MOVE",
        "EVALUATE"
      ]
    },
    {
      "unknown_id": "U2",
      "decision_impact": "high",
      "resolution_cost": "medium",
      "time_to_resolve": "2 to 4 weeks",
      "risk_reduction": "high",
      "recommended_next_query": "Obtain representative composite sampling, variability bounds, and mass-balance data for pollutants and residuals from the target waste stream.",
      "movement_jobs": [
        "TEST",
        "MOVE",
        "EVALUATE"
      ]
    },
    {
      "unknown_id": "U3",
      "decision_impact": "high",
      "resolution_cost": "medium",
      "time_to_resolve": "4 to 8 weeks",
      "risk_reduction": "high",
      "recommended_next_query": "Design and run a pilot with success metrics tied to the intended permit or pretreatment path and residuals disposition plan.",
      "movement_jobs": [
        "TEST",
        "MOVE",
        "EVALUATE"
      ]
    },
    {
      "unknown_id": "U4",
      "decision_impact": "medium",
      "resolution_cost": "low",
      "time_to_resolve": "1 to 3 weeks",
      "risk_reduction": "medium",
      "recommended_next_query": "Choose between direct-discharge operator, indirect-discharge/POTW path, or channel/EPC/O&M model for the selected opportunity.",
      "movement_jobs": [
        "MOVE",
        "EVALUATE",
        "WARN"
      ]
    },
    {
      "unknown_id": "U5",
      "decision_impact": "medium",
      "resolution_cost": "low",
      "time_to_resolve": "1 to 2 weeks",
      "risk_reduction": "medium",
      "recommended_next_query": "Convert the customer ask into a conditional LOI or pilot agreement with explicit compliance, schedule, and evidence contingencies.",
      "movement_jobs": [
        "MOVE",
        "EVALUATE",
        "WARN"
      ]
    }
  ],
  "lenses": [
    {
      "lens_id": "LENS1",
      "name": "strategic sequencing lens",
      "adapter_axis": "strategic-agentic",
      "questions": [
        "What is the lowest-regret next move given current unknowns?",
        "Which partner and commitment shapes preserve reversibility?"
      ],
      "claims_examined": [
        "C5",
        "C7",
        "C8"
      ],
      "blind_spots": [
        "site-specific commercial urgency and switching costs are not quantified"
      ],
      "contention": [
        "O1 should dominate O4 while U1 through U5 remain open"
      ],
      "movement_jobs": [
        "WARN",
        "MOVE",
        "EVALUATE"
      ]
    },
    {
      "lens_id": "LENS2",
      "name": "regulatory and scientific fit lens",
      "adapter_axis": "scientific-explanatory",
      "questions": [
        "What evidence is still missing to tie technology proof to the actual permit or pretreatment path?",
        "What residuals obligations could change feasibility?"
      ],
      "claims_examined": [
        "C1",
        "C2",
        "C3",
        "C4",
        "C6"
      ],
      "blind_spots": [
        "named jurisdiction, local limits, representative influent distributions, and residuals test results are missing"
      ],
      "contention": [
        "generic treatment proof cannot substitute for representative pilot evidence"
      ],
      "movement_jobs": [
        "WARN",
        "TEST",
        "EVALUATE"
      ]
    },
    {
      "lens_id": "LENS3",
      "name": "governance and reputation lens",
      "adapter_axis": "normative-evaluative",
      "questions": [
        "What promises would be misleading before evidence closes?",
        "Which affected parties bear downside if launch occurs too early?"
      ],
      "claims_examined": [
        "C5",
        "C8"
      ],
      "blind_spots": [
        "local stakeholder sensitivity, customer procurement pressure, and public-trust baseline are not measured"
      ],
      "contention": [
        "commercial pressure must not erase the diligence-versus-launch distinction"
      ],
      "movement_jobs": [
        "WARN",
        "GATE",
        "EVALUATE"
      ]
    }
  ],
  "council_result": {
    "coverage": [
      "strategic-agentic",
      "scientific-explanatory",
      "normative-evaluative"
    ],
    "missing_lenses": [
      "state-specific environmental counsel"
    ],
    "major_dissent": [
      "No dissent on near-term posture; the main unresolved issue is missing site-specific legal and pilot evidence."
    ],
    "decision_effect": "Approve O1 now, prepare O2 next, keep O3 conditional, and block O4 until gates can close.",
    "movement_jobs": [
      "EVALUATE",
      "WARN",
      "GATE"
    ]
  },
  "review_log": [],
  "benchmark_trace": {
    "trace_id": "BT1",
    "suite_id": "2026-05-17-batch-01",
    "cases_run": 5,
    "arms_run": [
      "direct_answer",
      "light_structured",
      "full_ofone"
    ],
    "model_families": 1,
    "superiority_ready": false,
    "diagnostics": [
      "case-native benchmark binding present",
      "no empirical superiority claim made"
    ],
    "case_id": "case-regulated-wastewater-market-entry-001",
    "run_id": "2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1",
    "case_file": "benchmarks/cases/regulated-wastewater-market-entry.md",
    "case_file_sha256": "sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16",
    "prompt_file": "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
    "prompt_file_sha256": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
    "input_bundle_sha256": "sha256:2849a7b8ab7af3553a448c44916d236e5cdd8dc4c4e37dd9fc5e3a18e4398b0b",
    "movement_jobs": [
      "GROUND",
      "WARN",
      "TRIGGER"
    ]
  }
}
```

## Validator Result

Expected local validation status: **likely pass** for the public **Map** profile, because the artifact includes the core Map surfaces the public schema/docs and validation model call for: artifact identity, scene, evidence, claims, unknowns, criteria, tradeoff surface, temporal model, edges, loops, option moves, triggers, gates, confidence model, decision rendering, actors, information-value objects for rendering-blocking unknowns, hybrid lens coverage, council result, and benchmark-trace binding. I am **not** claiming the local validator has already been executed. citeturn56view3turn20view0turn48view3turn48view4

Expected warnings: no schema-layer warning is necessary from the map substance itself, but the artifact intentionally preserves open unknowns and open gates rather than hiding them in prose. That is consistent with the public validation model, which treats missing evidence as explicit unknown objects and requires rendering-impacting triggers to participate in dependency closure. citeturn48view3turn48view4

Blocked release state: **blocked for operational launch**. Gates `G1` through `G3` are intentionally left open, the rendering is diligence-only, and the case itself explicitly says the pressure points are missing jurisdiction-specific regulatory evidence, missing pilot-performance evidence, compliance and reputation gates, and the distinction between a diligence move and an operational launch. In other words, the artifact is decision-ready as a map, but **not** launch-ready as an operating green light. citeturn31view0turn48view3turn26view0turn26view2

Residual limitation: benchmark-trace validation is expected to be satisfied because the artifact includes both the case-native run-binding fields the benchmark prompt requires and the broader trace fields the public OfOne docs describe. If a local validator were pinned to a different benchmark-trace revision, the repair would be additive and non-substantive rather than a rewrite of the wastewater decision map. citeturn48view4turn20view0

## Rendering

The current map says **do not launch**. Federal EPA sources establish that a direct point-source discharge to waters of the United States needs NPDES permit coverage; permitting authority can differ by jurisdiction and component; industrial wastewater rules are category- and pollutant-specific; indirect discharge to a POTW follows pretreatment governance; and wastewater residuals can separately create hazardous-waste obligations. Because this opportunity still lacks a fixed jurisdiction, a fixed discharge path, representative influent characterization, representative pilot proof, a fixed partner model, and a commitment structure matched to the evidence quality, the map supports only a **bounded diligence posture**. citeturn37view1turn40view0turn40view1turn38view3turn38view4turn38view5turn42view1turn42view3

The rendered recommendation is therefore: **lock one candidate jurisdiction and one discharge pathway first; then build a representative sampling and pilot package around that exact path; then convert any commercial motion into a conditional LOI or pilot agreement rather than a launch promise.** If the likely path is indirect discharge, treat the POTW/control-authority route as its own partner and regulatory track. If the likely path is direct discharge, treat permit authority, expected limits, monitoring, and reporting as first-order diligence objects. Do not blur these two paths into one generic “U.S. market entry” story. citeturn37view1turn40view0turn40view1turn38view3turn38view5

What the team should do next is narrow scope in sequence. First, choose one target jurisdiction and receiving route. Second, obtain representative influent and residuals data. Third, design a pilot whose success criteria are tied to the intended permit or pretreatment envelope instead of generic removal claims. Fourth, keep customer and partner commitments conditional until the open gates can actually close. This sequencing is exactly what the case pressure points require: explicit unknowns, explicit gates, and a clean separation between diligence and launch. citeturn31view0turn38view3turn38view5turn42view3

What would make the recommendation stronger or weaker is also explicit. It becomes stronger toward commercialization only if the team resolves `U1` through `U5`, especially the named authority path, representative influent/residuals, and representative pilot proof. It becomes weaker, and could shift to “defer entry,” if the chosen jurisdiction has an unfavorable permit path, if pretreatment/POTW acceptance fails, or if pilot or residuals evidence shows infeasibility. That is an inference from the regulatory structure and the case’s own requirement for patch closure from new evidence to rendering. citeturn40view0turn40view1turn38view5turn42view1turn31view0turn48view4

## Patch Report

No external update event was supplied with the case, so the represented update path is the map’s own **`T1 = new_evidence`** trigger. Under the public validation model, that is the right transition type for this case because the missing facts are localized unknowns, and rendering-impacting triggers are supposed to patch the dependency closure that reaches the final rendering rather than silently changing the answer. citeturn48view4turn49view1turn49view2

Affected closure for `T1` if new evidence arrives: start with `U1`, `U2`, `U3`, `U4`, and `U5`. The closure then reaches the near-term choice objects (`O1_scope_path`, `O2_run_pilot`, `O3_conditional_partner`), the tradeoff surface `TS1`, the learning loop `L1`, the relevant gates (`G1`–`G3`), and the rendered recommendation `R1`. In practical terms, positive evidence would patch the answer from “bounded diligence only” toward “approve representative pilot” and then, only if the gates close, toward a narrower jurisdiction-specific entry recommendation. Negative evidence would patch the answer the other direction, tightening it to “defer or exit this segment.” citeturn48view4turn49view1turn49view4turn37view1turn38view3turn38view5turn42view3

The smallest concrete patch that would change the rendering is this: a named jurisdiction and authority path, a representative influent and residuals characterization package, and pilot results tied to the intended permit or pretreatment success criteria. If those arrive and are favorable, `C5` weakens, `C6` strengthens, `TS1` can shift from `O1_scope_path` dominance toward `O2_run_pilot` or `O3_conditional_partner`, and `R1` changes from “do not launch; diligence only” to “pilot-approved, conditional commercialization path available.” Until that evidence exists, the current rendering remains the correct closure. citeturn40view0turn40view1turn38view3turn38view5turn42view3turn31view0