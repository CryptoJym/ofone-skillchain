# Benchmark Raw Output

Run ID: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1`
Rerun of: `2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1`
Status: `completed`
Execution mode: `Mode A: Controlled Non-Deep-Research Execution`
Case ID: `case-regulated-wastewater-market-entry-001`
Arm ID: `full_ofone`
Model family: `frontier_reasoning`
Repeat: `1`

## Artifact JSON

```json
{
  "ofone_version": "0.6.0",
  "mode": "Map",
  "charter": {
    "objective": "Decide whether the team may take bounded regulated wastewater market-entry diligence before any operational launch commitment.",
    "scope": [
      "case-regulated-wastewater-market-entry-001 benchmark case",
      "controlled Mode A rerun 1 full-OfOne package",
      "jurisdiction, influent profile, treatment proof, partner path, customer commitment, compliance, and reputation gates"
    ],
    "horizon": "one diligence and proof cycle before any commercial launch authorization",
    "stakes": [
      "regulatory noncompliance exposure",
      "technical treatment-performance risk",
      "partner and customer commitment risk",
      "reputation damage from premature wastewater market entry"
    ],
    "risk_tier": "high",
    "movement_jobs": [
      "BOUND",
      "GROUND",
      "GATE",
      "EVALUATE"
    ]
  },
  "artifact_identity": {
    "artifact_id": "OFONE-batch01-frontier-wastewater-rerun1",
    "case_id": "case-regulated-wastewater-market-entry-001",
    "objective_head": "regulated wastewater diligence before launch",
    "scope_hash": "sha256:2849a7b8ab7af3553a448c44916d236e5cdd8dc4c4e37dd9fc5e3a18e4398b0b",
    "config_hash": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
    "active_evidence_hashes": [
      "sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16",
      "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
      "unknown"
    ],
    "created_at": "2026-05-21T12:10:00Z",
    "status": "validated",
    "movement_jobs": [
      "BOUND",
      "GROUND"
    ]
  },
  "adapter_projection": {
    "primary": "hybrid",
    "axes": {
      "strategic-agentic": [
        "bounded market-entry diligence move",
        "partner and customer commitment sequencing",
        "launch commitment timing"
      ],
      "scientific-explanatory": [
        "influent characterization",
        "pilot performance proof",
        "residuals and PFAS treatment uncertainty"
      ],
      "normative-evaluative": [
        "compliance gate before release",
        "reputation and public-policy exposure",
        "human review before operational launch"
      ]
    },
    "movement_jobs": [
      "BOUND",
      "EVALUATE",
      "GATE"
    ]
  },
  "scene": {
    "scene_id": "S1",
    "frames": [
      {
        "frame_id": "F1",
        "type": "strategic",
        "assumptions": [
          "The case asks for a market-entry decision map, not an operational launch approval.",
          "A diligence move can be scoped separately from a regulated treatment deployment."
        ]
      },
      {
        "frame_id": "F2",
        "type": "causal",
        "assumptions": [
          "Treatment proof depends on jurisdiction, influent profile, discharge or reuse path, residuals, and PFAS exposure.",
          "Generic market interest does not substitute for site-specific pilot evidence."
        ]
      },
      {
        "frame_id": "F3",
        "type": "normative",
        "assumptions": [
          "Compliance and reputation gates must stay open while the regulatory path and customer proof are missing.",
          "The recommendation should preserve unknowns rather than convert them into launch permission."
        ]
      }
    ],
    "tokens": [
      {
        "token_id": "K1",
        "kind": "option",
        "label": "bounded market-entry diligence"
      },
      {
        "token_id": "K2",
        "kind": "option",
        "label": "operational wastewater launch"
      },
      {
        "token_id": "K3",
        "kind": "unknown",
        "label": "jurisdiction and discharge path"
      },
      {
        "token_id": "K4",
        "kind": "unknown",
        "label": "influent and treatment proof"
      },
      {
        "token_id": "K5",
        "kind": "gate",
        "label": "compliance and reputation release gate"
      },
      {
        "token_id": "K6",
        "kind": "entity",
        "label": "launch decision owner"
      }
    ],
    "subscenes": [
      {
        "subscene_id": "SS1",
        "parent_scene": "S1",
        "purpose": "evidence_acquisition",
        "frames": [
          "F1",
          "F2"
        ],
        "tokens": [
          "K1",
          "K3",
          "K4"
        ],
        "entry_conditions": [
          "Team is considering entry into a regulated U.S. wastewater treatment market."
        ],
        "exit_conditions": [
          "Jurisdiction, influent, proof, partner, customer, and residual-risk facts are either resolved or explicitly left launch-blocking."
        ],
        "movement_jobs": [
          "GROUND",
          "BOUND",
          "TEST"
        ]
      },
      {
        "subscene_id": "SS2",
        "parent_scene": "S1",
        "purpose": "review_gate",
        "frames": [
          "F2",
          "F3"
        ],
        "tokens": [
          "K2",
          "K5",
          "K6"
        ],
        "entry_conditions": [
          "A move would create pilot, commercial, discharge, reuse, or reputational exposure."
        ],
        "exit_conditions": [
          "Compliance and reputation reviewers approve or return the decision for more evidence."
        ],
        "movement_jobs": [
          "GATE",
          "EVALUATE",
          "WARN"
        ]
      }
    ],
    "state_variables": [
      "jurisdiction_fixed",
      "influent_profile_fixed",
      "treatment_proof_state",
      "partner_path_state",
      "customer_commitment_state",
      "gate_status"
    ],
    "observed_variables": [
      "case names jurisdiction, influent profile, treatment proof, partner path, and customer commitment as unfixed",
      "case asks for evidence, claims, unknowns, option moves, gates, update triggers, and rendered recommendation",
      "full-OfOne prompt bars empirical superiority claims"
    ],
    "hidden_variables": [
      "actual state and local permit path",
      "site-specific effluent limits and reuse/discharge route",
      "operator or EPC partner capacity",
      "customer willingness to sign after proof"
    ],
    "movement_jobs": [
      "BOUND",
      "GROUND",
      "LINK"
    ]
  },
  "evidence": [
    {
      "evidence_id": "E1",
      "source": "file",
      "span_or_locator": "benchmarks/cases/regulated-wastewater-market-entry.md",
      "provenance": "frozen benchmark case file",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16",
      "retrieved_at": "2026-05-21T12:10:00Z",
      "extract": "The case states that the jurisdiction, influent profile, treatment proof, partner path, and customer commitment are not yet fixed and asks for a decision-ready map.",
      "source_owner": "ofone-skillchain benchmark case",
      "chain_of_custody": "Read directly from the checked-out repository before Mode A execution.",
      "supports": [
        "C1",
        "C2",
        "C3",
        "C4"
      ],
      "risks": [
        "scenario_level_only",
        "missing_site_specific_facts"
      ],
      "movement_jobs": [
        "GROUND",
        "BOUND"
      ]
    },
    {
      "evidence_id": "E2",
      "source": "file",
      "span_or_locator": "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
      "provenance": "frozen full-OfOne benchmark arm prompt",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
      "retrieved_at": "2026-05-21T12:10:00Z",
      "extract": "The full-OfOne arm must return artifact JSON, validator result, rendering, and patch report while separating map objects and avoiding empirical superiority claims.",
      "source_owner": "ofone-skillchain benchmark prompt",
      "chain_of_custody": "Read directly from the checked-out repository before Mode A execution.",
      "supports": [
        "C2",
        "C5"
      ],
      "risks": [
        "benchmark_instruction_not_operating_fact"
      ],
      "movement_jobs": [
        "GROUND",
        "BOUND"
      ]
    },
    {
      "evidence_id": "E3",
      "source": "file",
      "span_or_locator": "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md",
      "provenance": "Mode A controlled execution contract for this wastewater repair slot",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "unknown",
      "retrieved_at": "2026-05-21T12:10:00Z",
      "extract": "The controlled repair uses a local non-Deep-Research execution path, freezes the exact rerun ID and benchmark trace, and bars insertion before computed local validation and local review.",
      "source_owner": "ofone-skillchain repair protocol",
      "chain_of_custody": "Prepared and executed as a local Mode A benchmark repair contract.",
      "supports": [
        "C5"
      ],
      "risks": [
        "process_evidence_not_market_fact"
      ],
      "movement_jobs": [
        "GROUND",
        "GATE"
      ]
    }
  ],
  "claims": [
    {
      "claim_id": "C1",
      "text": "The case supports bounded diligence for regulated wastewater entry, not operational launch approval.",
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
          "case text could omit external pressure to launch quickly"
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
      "claim_id": "C2",
      "text": "A benchmark-valid answer must keep evidence, claims, unknowns, option moves, gates, triggers, and rendering as separate map objects.",
      "type": "operational",
      "supports": [
        "E1",
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
          "adapter_fit"
        ],
        "failure_modes": [
          "the answer could collapse the map into a narrative recommendation"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "LINK"
      ]
    },
    {
      "claim_id": "C3",
      "text": "The next allowed move is to scope a reversible diligence and proof path, because the launch-critical wastewater facts are missing.",
      "type": "normative",
      "supports": [
        "E1"
      ],
      "contradicts": [],
      "depends_on": [
        "U1",
        "U2",
        "U3",
        "U4",
        "TS1"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "mechanism_fit",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "diligence may require commitments that create de facto launch exposure",
          "jurisdiction-specific facts may make the market unattractive"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "EVALUATE",
        "MOVE"
      ]
    },
    {
      "claim_id": "C4",
      "text": "Operational wastewater launch remains blocked until jurisdiction, influent, treatment proof, partner path, customer commitment, residual risk, and compliance/reputation gates are resolved.",
      "type": "operational",
      "supports": [
        "E1"
      ],
      "contradicts": [],
      "depends_on": [
        "U1",
        "U2",
        "U3",
        "U4",
        "G1",
        "G2"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "hidden_variable_risk",
          "adapter_fit"
        ],
        "failure_modes": [
          "some launch facts may be easier to resolve than the case implies",
          "review authority may be split across multiple regulators or partners"
        ]
      },
      "status": "active",
      "review_gate": true,
      "movement_jobs": [
        "CLAIM",
        "GATE",
        "WARN"
      ]
    },
    {
      "claim_id": "C5",
      "text": "This controlled wastewater rerun is replacement evidence only after computed validation, local review, matrix insertion, publication, and Pages parity; it does not support a superiority claim by itself.",
      "type": "operational",
      "supports": [
        "E2",
        "E3"
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
          "operator could treat a single valid replacement as method-level evidence"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "GATE"
      ]
    }
  ],
  "unknowns": [
    {
      "unknown_id": "U1",
      "kind": "missing_evidence",
      "description": "The jurisdiction, discharge or reuse route, and applicable permit path are not fixed.",
      "blocks": [
        "O2",
        "R1"
      ],
      "resolution_move": "Identify target jurisdiction, discharge/reuse route, permit pathway, and regulator-facing evidence requirements.",
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
      "description": "The influent profile and treatment performance proof are missing.",
      "blocks": [
        "O2",
        "R1"
      ],
      "resolution_move": "Run or acquire pilot evidence tied to the actual influent and target effluent or reuse standard.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "TEST",
        "GROUND"
      ]
    },
    {
      "unknown_id": "U3",
      "kind": "missing_evidence",
      "description": "The partner/operator path and customer commitment are not fixed.",
      "blocks": [
        "O2",
        "R1"
      ],
      "resolution_move": "Secure partner/operator diligence and conditional customer commitment before launch planning.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "MOVE",
        "TEST"
      ]
    },
    {
      "unknown_id": "U4",
      "kind": "missing_evidence",
      "description": "Residuals, PFAS, safety, compliance, and reputation exposure are not characterized for the target use case.",
      "blocks": [
        "O2",
        "R1"
      ],
      "resolution_move": "Define residuals handling, PFAS exposure, safety controls, compliance obligations, and reputation review criteria.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "GATE",
        "TEST"
      ]
    }
  ],
  "kill_tests": [
    {
      "test_id": "KT1",
      "target": "C3",
      "test_type": "stakeholder_objection",
      "condition": "Gate escalation shows the diligence path would require permit, pilot, partner, or customer commitments that create launch-like exposure.",
      "falsifies": [
        "C3"
      ],
      "movement_jobs": [
        "TEST",
        "WARN",
        "GATE"
      ]
    },
    {
      "test_id": "KT2",
      "target": "C4",
      "test_type": "adapter_conflict",
      "condition": "Source contradiction or site-specific evidence shows that a mandatory regulatory or technical requirement cannot be satisfied.",
      "falsifies": [
        "C4"
      ],
      "movement_jobs": [
        "TEST",
        "WARN",
        "GATE"
      ]
    }
  ],
  "criteria": [
    {
      "criterion_id": "CR1",
      "name": "Regulatory path before launch",
      "kind": "constraint",
      "priority": "must",
      "threshold": "No launch move without a named jurisdiction, discharge/reuse path, and permit strategy.",
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
      "name": "Treatment proof before commitment",
      "kind": "threshold",
      "priority": "must",
      "threshold": "Treatment performance must be demonstrated for the actual influent and target standard before operational commitment.",
      "owned_by": [
        "A3"
      ],
      "movement_jobs": [
        "TEST",
        "EVALUATE"
      ]
    },
    {
      "criterion_id": "CR3",
      "name": "Partner and customer evidence",
      "kind": "threshold",
      "priority": "should",
      "threshold": "The move should produce partner/operator and customer commitment evidence without creating premature obligations.",
      "owned_by": [
        "A1"
      ],
      "movement_jobs": [
        "MOVE",
        "EVALUATE"
      ]
    },
    {
      "criterion_id": "CR4",
      "name": "Compliance and reputation gate",
      "kind": "constraint",
      "priority": "must",
      "threshold": "Compliance, safety, residuals/PFAS, and reputation review must approve before launch.",
      "owned_by": [
        "A2"
      ],
      "movement_jobs": [
        "GATE",
        "WARN"
      ]
    }
  ],
  "tradeoff_surface": {
    "surface_id": "TS1",
    "options": [
      "O1",
      "O2"
    ],
    "criteria": [
      "CR1",
      "CR2",
      "CR3",
      "CR4"
    ],
    "dominant_option": "O1",
    "why": [
      "CR1",
      "CR2",
      "CR4"
    ],
    "reversal_conditions": [
      "U1",
      "U2",
      "U3",
      "U4",
      "T1"
    ],
    "movement_jobs": [
      "EVALUATE",
      "TRIGGER"
    ]
  },
  "actors": [
    {
      "actor_id": "A1",
      "label": "market-entry decision owner",
      "role": "decision_owner",
      "incentives": [
        "learn whether the market is worth entering without premature commitment"
      ],
      "exposures": [
        "financial",
        "reputation",
        "operational"
      ],
      "authority": "approve",
      "legitimacy_basis": "owns market-entry sequencing and commitment boundary",
      "movement_jobs": [
        "BOUND",
        "MOVE"
      ]
    },
    {
      "actor_id": "A2",
      "label": "compliance and reputation reviewer",
      "role": "reviewer",
      "incentives": [
        "prevent noncompliant or reputation-damaging wastewater launch"
      ],
      "exposures": [
        "compliance",
        "public-policy",
        "reputation"
      ],
      "authority": "block",
      "legitimacy_basis": "owns the compliance and reputation release gates",
      "movement_jobs": [
        "GATE",
        "WARN"
      ]
    },
    {
      "actor_id": "A3",
      "label": "technical proof owner",
      "role": "operator",
      "incentives": [
        "generate treatment proof tied to real influent and standards"
      ],
      "exposures": [
        "technical failure",
        "safety",
        "residuals handling"
      ],
      "authority": "advise",
      "legitimacy_basis": "responsible for proof plan and technical evidence quality",
      "movement_jobs": [
        "GROUND",
        "TEST"
      ]
    }
  ],
  "temporal_model": {
    "time_horizon": "one diligence and proof cycle",
    "decision_deadline": "before any operational wastewater launch or commercial commitment",
    "evidence_validity_windows": [
      {
        "evidence_id": "E1",
        "valid_until": "until benchmark case changes",
        "staleness_trigger": "case file hash changes"
      },
      {
        "evidence_id": "E2",
        "valid_until": "until full-OfOne prompt changes",
        "staleness_trigger": "prompt file hash changes"
      },
      {
        "evidence_id": "E3",
        "valid_until": "until wastewater Mode A contract changes",
        "staleness_trigger": "contract path or run ID changes"
      }
    ],
    "update_cadence": "revalidate after new jurisdiction, proof, partner, customer, compliance, or reputation evidence",
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
      "resolution_cost": "medium",
      "time_to_resolve": "one regulatory diligence pass",
      "risk_reduction": "high",
      "recommended_next_query": "Which jurisdiction, discharge or reuse route, permit pathway, and regulator evidence standard will govern the first target deployment?",
      "movement_jobs": [
        "TEST",
        "GATE",
        "EVALUATE"
      ]
    },
    {
      "unknown_id": "U2",
      "decision_impact": "high",
      "resolution_cost": "high",
      "time_to_resolve": "one pilot or proof cycle",
      "risk_reduction": "high",
      "recommended_next_query": "What influent profile and treatment-performance evidence are required to satisfy the target permit or customer standard?",
      "movement_jobs": [
        "TEST",
        "GROUND",
        "EVALUATE"
      ]
    },
    {
      "unknown_id": "U3",
      "decision_impact": "medium",
      "resolution_cost": "medium",
      "time_to_resolve": "partner and customer diligence cycle",
      "risk_reduction": "medium",
      "recommended_next_query": "Which operator/partner path and conditional customer commitment can be proven without creating launch obligations?",
      "movement_jobs": [
        "MOVE",
        "TEST",
        "EVALUATE"
      ]
    },
    {
      "unknown_id": "U4",
      "decision_impact": "high",
      "resolution_cost": "medium",
      "time_to_resolve": "compliance and safety review cycle",
      "risk_reduction": "high",
      "recommended_next_query": "What residuals, PFAS, safety, compliance, and reputation risks must be controlled before launch?",
      "movement_jobs": [
        "GATE",
        "TEST",
        "WARN"
      ]
    }
  ],
  "lenses": [
    {
      "lens_id": "LENS1",
      "name": "Strategic-agentic lens",
      "adapter_axis": "strategic-agentic",
      "questions": [
        "Which move reduces market uncertainty without launch commitment?",
        "Which partner and customer facts change the entry decision?"
      ],
      "claims_examined": [
        "C1",
        "C3"
      ],
      "blind_spots": [
        "actual partner and customer appetite are absent"
      ],
      "contention": [
        "A diligence move can drift into launch if customer or partner commitments are not bounded."
      ],
      "movement_jobs": [
        "EVALUATE",
        "MOVE",
        "WARN"
      ]
    },
    {
      "lens_id": "LENS2",
      "name": "Scientific proof lens",
      "adapter_axis": "scientific-explanatory",
      "questions": [
        "What influent and treatment proof would support entry?",
        "Which residuals or PFAS findings would block the move?"
      ],
      "claims_examined": [
        "C3",
        "C4"
      ],
      "blind_spots": [
        "site-specific influent and effluent standard are absent"
      ],
      "contention": [
        "Generic treatment confidence is not enough for regulated wastewater launch."
      ],
      "movement_jobs": [
        "TEST",
        "GROUND",
        "EVALUATE"
      ]
    },
    {
      "lens_id": "LENS3",
      "name": "Compliance and reputation lens",
      "adapter_axis": "normative-evaluative",
      "questions": [
        "Which compliance or reputation review must approve launch?",
        "Which public-policy exposure remains unresolved?"
      ],
      "claims_examined": [
        "C2",
        "C4",
        "C5"
      ],
      "blind_spots": [
        "reviewer identity and local approval threshold are still abstract"
      ],
      "contention": [
        "Launch must remain blocked even when diligence is recommended."
      ],
      "movement_jobs": [
        "GATE",
        "WARN",
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
    "missing_lenses": [],
    "major_dissent": [
      "No dissent against bounded diligence; strong dissent remains against operational launch while U1-U4 and G1-G2 are open."
    ],
    "decision_effect": "Permits bounded diligence only and keeps operational launch blocked.",
    "movement_jobs": [
      "EVALUATE",
      "GATE"
    ]
  },
  "edges": [
    {
      "edge_id": "X1",
      "from": "E1",
      "to": "C1",
      "relation_family": "evidential",
      "relation": "supports",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "GROUND"
      ]
    },
    {
      "edge_id": "X2",
      "from": "E1",
      "to": "C2",
      "relation_family": "evidential",
      "relation": "supports",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "GROUND"
      ]
    },
    {
      "edge_id": "X3",
      "from": "E2",
      "to": "C5",
      "relation_family": "evidential",
      "relation": "supports",
      "evidence_refs": [
        "E2"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "GROUND"
      ]
    },
    {
      "edge_id": "X4",
      "from": "C1",
      "to": "O1",
      "relation_family": "causal",
      "relation": "enables",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "MOVE"
      ]
    },
    {
      "edge_id": "X5",
      "from": "O1",
      "to": "C3",
      "relation_family": "causal",
      "relation": "enables",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "LINK",
        "MOVE"
      ]
    },
    {
      "edge_id": "X6",
      "from": "U1",
      "to": "R1",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    },
    {
      "edge_id": "X7",
      "from": "U2",
      "to": "R1",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "WARN",
        "TEST"
      ]
    },
    {
      "edge_id": "X8",
      "from": "U3",
      "to": "O2",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "WARN",
        "MOVE"
      ]
    },
    {
      "edge_id": "X9",
      "from": "U4",
      "to": "R1",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    },
    {
      "edge_id": "X10",
      "from": "G1",
      "to": "O2",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "GATE",
        "LINK"
      ]
    },
    {
      "edge_id": "X11",
      "from": "G2",
      "to": "O2",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "GATE",
        "LINK"
      ]
    },
    {
      "edge_id": "X12",
      "from": "CR1",
      "to": "TS1",
      "relation_family": "causal",
      "relation": "constrains",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "edge_id": "X13",
      "from": "CR2",
      "to": "TS1",
      "relation_family": "causal",
      "relation": "constrains",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "high",
      "movement_jobs": [
        "TEST",
        "EVALUATE"
      ]
    },
    {
      "edge_id": "X14",
      "from": "TS1",
      "to": "R1",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "EVALUATE",
        "LINK"
      ]
    },
    {
      "edge_id": "X15",
      "from": "C4",
      "to": "G1",
      "relation_family": "workflow_state",
      "relation": "depends_on",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "GATE",
        "LINK"
      ]
    }
  ],
  "loops": [
    {
      "loop_id": "L1",
      "type": "review",
      "edges": [
        "X6",
        "X7",
        "X9",
        "X10",
        "X11",
        "X14"
      ],
      "polarity": "balancing",
      "delay": "medium",
      "gain": "high",
      "control_points": [
        "G1 compliance release gate",
        "G2 reputation release gate",
        "T1 evidence patch trigger"
      ],
      "observable_cues": [
        "U1-U4 remain open",
        "reviewer withholds launch approval",
        "new proof changes TS1"
      ],
      "failure_mode": "If compliance and proof gates are treated as documentation instead of release controls, diligence can be mistaken for launch clearance.",
      "movement_jobs": [
        "LINK",
        "GATE",
        "WARN"
      ]
    }
  ],
  "option_moves": [
    {
      "option_id": "O1",
      "move_type": "query",
      "preconditions": [
        "C1",
        "C2"
      ],
      "expected_effects": [
        "X5"
      ],
      "tradeoffs": [
        "Improves information value while preserving the launch boundary; still needs scope control and review before external commitments."
      ],
      "blocking_unknowns": [],
      "review_gate": "none",
      "movement_jobs": [
        "MOVE",
        "TEST",
        "EVALUATE"
      ]
    },
    {
      "option_id": "O2",
      "move_type": "act",
      "preconditions": [
        "C4"
      ],
      "expected_effects": [
        "X10",
        "X11"
      ],
      "tradeoffs": [
        "Could capture market opportunity but creates compliance, technical, partner, customer, safety, and reputation exposure before proof."
      ],
      "blocking_unknowns": [
        "U1",
        "U2",
        "U3",
        "U4"
      ],
      "review_gate": "G1",
      "movement_jobs": [
        "MOVE",
        "GATE",
        "WARN"
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
        "TS1",
        "R1"
      ],
      "transition": "patch",
      "movement_jobs": [
        "TRIGGER",
        "TEST"
      ]
    },
    {
      "trigger_id": "T2",
      "condition": "review_required",
      "affected_objects": [
        "G1",
        "G2",
        "O2",
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
      "condition": "Compliance gate remains open until jurisdiction, discharge/reuse path, permit strategy, residuals/PFAS controls, and treatment proof are approved.",
      "reviewer": "A2 compliance and reputation reviewer",
      "required_decision": "Approve regulated launch readiness or return for more jurisdiction and proof evidence.",
      "status": "open",
      "movement_jobs": [
        "GATE",
        "WARN"
      ]
    },
    {
      "gate_id": "G2",
      "condition": "Reputation and public-policy gate remains open until partner/operator path, customer commitment, and safety/reputation exposure are reviewed.",
      "reviewer": "A2 compliance and reputation reviewer",
      "required_decision": "Approve external market commitment or keep activity in bounded diligence.",
      "status": "open",
      "movement_jobs": [
        "GATE",
        "WARN"
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
    "summary": "Known: the case is a regulated wastewater market-entry decision with key launch facts unfixed. Assumed: bounded diligence can be scoped away from launch commitment. Blocked: jurisdiction, influent, treatment proof, partner path, customer commitment, residuals/PFAS, compliance, and reputation proof remain open. Gate: G1 and G2 stay open. Update: new evidence resolving U1-U4 patches TS1 and the recommendation.",
    "recommendation": "Proceed only with bounded market-entry diligence O1. Do not proceed to operational wastewater launch O2 until U1-U4 are resolved or explicitly accepted, treatment proof is tied to the target jurisdiction and influent, and compliance/reputation gates G1 and G2 are approved.",
    "confidence": "medium",
    "depends_on": [
      "C1",
      "C2",
      "C3",
      "C4",
      "U1",
      "U2",
      "U3",
      "U4",
      "TS1",
      "G1",
      "G2"
    ],
    "movement_jobs": [
      "MOVE",
      "WARN",
      "GATE"
    ]
  },
  "benchmark_trace": {
    "trace_id": "BT-wastewater-rerun1",
    "suite_id": "ofone-v0.5-three-arm-evaluation",
    "cases_run": 1,
    "arms_run": [
      "full_ofone"
    ],
    "model_families": 1,
    "superiority_ready": false,
    "diagnostics": [
      "Controlled Mode A replacement for one excluded regulated wastewater frontier full-OfOne slot.",
      "Single-run replacement evidence is not sufficient for aggregate or superiority claims."
    ],
    "case_id": "case-regulated-wastewater-market-entry-001",
    "run_id": "2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1",
    "case_file": "benchmarks/cases/regulated-wastewater-market-entry.md",
    "case_file_sha256": "sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16",
    "prompt_file": "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
    "prompt_file_sha256": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
    "input_bundle_sha256": "sha256:2849a7b8ab7af3553a448c44916d236e5cdd8dc4c4e37dd9fc5e3a18e4398b0b",
    "movement_jobs": [
      "BOUND",
      "GATE",
      "WARN"
    ]
  },
  "validator_result": {
    "passed": true,
    "diagnostics": [
      {
        "code": "OFONE_JSON_SCHEMA",
        "severity": "info",
        "check": "json_schema",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "Map artifact matches executable JSON Schema profile",
        "repair_hint": null
      },
      {
        "code": "OFONE_ADAPTER_CONTRACT",
        "severity": "info",
        "check": "adapter_contract",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "hybrid adapter contract loaded",
        "repair_hint": null
      },
      {
        "code": "OFONE_ADAPTER_GATE_COVERAGE",
        "severity": "info",
        "check": "adapter_gate_coverage",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "gate coverage present for compliance, reputation",
        "repair_hint": null
      },
      {
        "code": "OFONE_BENCHMARK_TRACE",
        "severity": "warning",
        "check": "benchmark_trace",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "benchmark_trace BT-wastewater-rerun1 is not superiority-ready",
        "repair_hint": null
      },
      {
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info",
        "check": "dependency_closure",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "trigger T1: C3, C4, COUNCIL, IV:U1, IV:U2, IV:U3, IV:U4, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9 [includes rendering]",
        "repair_hint": null
      },
      {
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info",
        "check": "dependency_closure",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "trigger T2: C3, C4, COUNCIL, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9 [includes rendering]",
        "repair_hint": null
      },
      {
        "code": "OFONE_SEMANTIC_VALIDATION",
        "severity": "info",
        "check": "semantic_validation",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "semantic graph checks completed",
        "repair_hint": null
      }
    ],
    "checks": [
      {
        "check": "json_schema",
        "passed": true,
        "notes": "Map artifact matches executable JSON Schema profile",
        "code": "OFONE_JSON_SCHEMA",
        "severity": "info"
      },
      {
        "check": "adapter_contract",
        "passed": true,
        "notes": "hybrid adapter contract loaded",
        "code": "OFONE_ADAPTER_CONTRACT",
        "severity": "info"
      },
      {
        "check": "adapter_gate_coverage",
        "passed": true,
        "notes": "gate coverage present for compliance, reputation",
        "code": "OFONE_ADAPTER_GATE_COVERAGE",
        "severity": "info"
      },
      {
        "check": "benchmark_trace",
        "passed": true,
        "notes": "benchmark_trace BT-wastewater-rerun1 is not superiority-ready",
        "code": "OFONE_BENCHMARK_TRACE",
        "severity": "warning"
      },
      {
        "check": "dependency_closure",
        "passed": true,
        "notes": "trigger T1: C3, C4, COUNCIL, IV:U1, IV:U2, IV:U3, IV:U4, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9 [includes rendering]",
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info"
      },
      {
        "check": "dependency_closure",
        "passed": true,
        "notes": "trigger T2: C3, C4, COUNCIL, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9 [includes rendering]",
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info"
      },
      {
        "check": "semantic_validation",
        "passed": true,
        "notes": "semantic graph checks completed",
        "code": "OFONE_SEMANTIC_VALIDATION",
        "severity": "info"
      }
    ]
  }
}
```

## Validator Result

```json
{
  "passed": true,
  "validator": {
    "schema_draft": "https://json-schema.org/draft/2020-12/schema",
    "ajv_strict": false
  },
  "results": [
    {
      "file": "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.artifact.json",
      "passed": true,
      "diagnostics": [
        {
          "code": "OFONE_JSON_SCHEMA",
          "severity": "info",
          "check": "json_schema",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "Map artifact matches executable JSON Schema profile",
          "repair_hint": null
        },
        {
          "code": "OFONE_ADAPTER_CONTRACT",
          "severity": "info",
          "check": "adapter_contract",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "hybrid adapter contract loaded",
          "repair_hint": null
        },
        {
          "code": "OFONE_ADAPTER_GATE_COVERAGE",
          "severity": "info",
          "check": "adapter_gate_coverage",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "gate coverage present for compliance, reputation",
          "repair_hint": null
        },
        {
          "code": "OFONE_BENCHMARK_TRACE",
          "severity": "warning",
          "check": "benchmark_trace",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "benchmark_trace BT-wastewater-rerun1 is not superiority-ready",
          "repair_hint": null
        },
        {
          "code": "OFONE_DEPENDENCY_CLOSURE",
          "severity": "info",
          "check": "dependency_closure",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "trigger T1: C3, C4, COUNCIL, IV:U1, IV:U2, IV:U3, IV:U4, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9 [includes rendering]",
          "repair_hint": null
        },
        {
          "code": "OFONE_DEPENDENCY_CLOSURE",
          "severity": "info",
          "check": "dependency_closure",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "trigger T2: C3, C4, COUNCIL, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9 [includes rendering]",
          "repair_hint": null
        },
        {
          "code": "OFONE_SEMANTIC_VALIDATION",
          "severity": "info",
          "check": "semantic_validation",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "semantic graph checks completed",
          "repair_hint": null
        }
      ]
    }
  ]
}
```

## Rendering

# OfOne Analyst Map

## Lifecycle
- Artifact: OFONE-batch01-frontier-wastewater-rerun1; case=case-regulated-wastewater-market-entry-001; version=0.6.0
- Identity tuple: objective=regulated wastewater diligence before launch; scope=sha256:2849a7b8ab7af3553a448c44916d236e5cdd8dc4c4e37dd9fc5e3a18e4398b0b; config=sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e
- Evidence hashes: sha256:790cd65cf34d0572c9e171127e58aebadbf8ad0c8f09e16d044d6dbbd5b5ec16, sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e, unknown
- Status: validated; created=2026-05-21T12:10:00Z

## Mode And Charter
- Mode: Map
- Objective: Decide whether the team may take bounded regulated wastewater market-entry diligence before any operational launch commitment.
- Scope: case-regulated-wastewater-market-entry-001 benchmark case; controlled Mode A rerun 1 full-OfOne package; jurisdiction, influent profile, treatment proof, partner path, customer commitment, compliance, and reputation gates
- Risk: high

## Geometry And Adapter
- Adapter: hybrid
- Frames: F1:strategic, F2:causal, F3:normative
- Tokens: K1:bounded market-entry diligence, K2:operational wastewater launch, K3:jurisdiction and discharge path, K4:influent and treatment proof, K5:compliance and reputation release gate, K6:launch decision owner
- Subscenes: SS1:evidence_acquisition, SS2:review_gate

## Evidence And Claims
- Evidence: E1:high, E2:high, E3:high
- Claims: C1:active:high, C2:active:high, C3:active:medium, C4:active:medium, C5:active:high
- Dissent / contradiction: none recorded

## Graph And Loops
- causal edges: X4:C1-enables->O1, X5:O1-enables->C3, X12:CR1-constrains->TS1, X13:CR2-constrains->TS1
- evidential edges: X1:E1-supports->C1, X2:E1-supports->C2, X3:E2-supports->C5
- argumentative edges: X14:TS1-supports->R1
- workflow state edges: X6:U1-blocks->R1, X7:U2-blocks->R1, X8:U3-blocks->O2, X9:U4-blocks->R1, X10:G1-blocks->O2, X11:G2-blocks->O2, X15:C4-depends_on->G1
- Loops: L1:review:balancing

## Decision Surface
- CR1: must constraint; Regulatory path before launch; threshold=No launch move without a named jurisdiction, discharge/reuse path, and permit strategy.
- CR2: must threshold; Treatment proof before commitment; threshold=Treatment performance must be demonstrated for the actual influent and target standard before operational commitment.
- CR3: should threshold; Partner and customer evidence; threshold=The move should produce partner/operator and customer commitment evidence without creating premature obligations.
- CR4: must constraint; Compliance and reputation gate; threshold=Compliance, safety, residuals/PFAS, and reputation review must approve before launch.
- TS1: dominant=O1; criteria=CR1, CR2, CR3, CR4; reverses_on=U1, U2, U3, U4, T1

## Actors And Time
- Actor A1: market-entry decision owner; role=decision_owner; authority=approve; exposures=financial, reputation, operational
- Actor A2: compliance and reputation reviewer; role=reviewer; authority=block; exposures=compliance, public-policy, reputation
- Actor A3: technical proof owner; role=operator; authority=advise; exposures=technical failure, safety, residuals handling
- Temporal: horizon=one diligence and proof cycle; deadline=before any operational wastewater launch or commercial commitment; cadence=revalidate after new jurisdiction, proof, partner, customer, compliance, or reputation evidence
- Evidence windows: E1:until benchmark case changes, E2:until full-OfOne prompt changes, E3:until wastewater Mode A contract changes

## Options And Gates
- Options: O1:query, O2:act
- Unknowns: U1:open:The jurisdiction, discharge or reuse route, and applicable permit path are not fixed.; U2:open:The influent profile and treatment performance proof are missing.; U3:open:The partner/operator path and customer commitment are not fixed.; U4:open:Residuals, PFAS, safety, compliance, and reputation exposure are not characterized for the target use case.
- Kill tests: KT1:stakeholder_objection->C3, KT2:adapter_conflict->C4
- Gates: G1:open:Compliance gate remains open until jurisdiction, discharge/reuse path, permit strategy, residuals/PFAS controls, and treatment proof are approved.; G2:open:Reputation and public-policy gate remains open until partner/operator path, customer commitment, and safety/reputation exposure are reviewed.

## Information Value
- U1: impact=high; cost=medium; risk_reduction=high; next=Which jurisdiction, discharge or reuse route, permit pathway, and regulator evidence standard will govern the first target deployment?
- U2: impact=high; cost=high; risk_reduction=high; next=What influent profile and treatment-performance evidence are required to satisfy the target permit or customer standard?
- U3: impact=medium; cost=medium; risk_reduction=medium; next=Which operator/partner path and conditional customer commitment can be proven without creating launch obligations?
- U4: impact=high; cost=medium; risk_reduction=high; next=What residuals, PFAS, safety, compliance, and reputation risks must be controlled before launch?

## Lens Council
- LENS1: Strategic-agentic lens; axis=strategic-agentic; blind_spots=actual partner and customer appetite are absent
- LENS2: Scientific proof lens; axis=scientific-explanatory; blind_spots=site-specific influent and effluent standard are absent
- LENS3: Compliance and reputation lens; axis=normative-evaluative; blind_spots=reviewer identity and local approval threshold are still abstract
- Council: coverage=strategic-agentic, scientific-explanatory, normative-evaluative; dissent=No dissent against bounded diligence; strong dissent remains against operational launch while U1-U4 and G1-G2 are open.; effect=Permits bounded diligence only and keeps operational launch blocked.

## Decision Rendering
- Rendering: R1
- Recommendation: Proceed only with bounded market-entry diligence O1. Do not proceed to operational wastewater launch O2 until U1-U4 are resolved or explicitly accepted, treatment proof is tied to the target jurisdiction and influent, and compliance/reputation gates G1 and G2 are approved.
- Confidence: medium
- Depends on: C1, C2, C3, C4, U1, U2, U3, U4, TS1, G1, G2

## Update Logic
- T1: new_evidence -> patch; rendering affected; closure=C3, C4, COUNCIL, IV:U1, IV:U2, IV:U3, IV:U4, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9
- T2: review_required -> human_review; rendering affected; closure=C3, C4, COUNCIL, KT1, KT2, L1, LENS1, LENS2, LENS3, O1, O2, R1, T1, T2, TS1, X10, X11, X12, X13, X14, X15, X4, X5, X6, X7, X8, X9

## Patch Report

```json
{
  "input": "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.artifact.json",
  "operation": {
    "operation_id": "trigger_activation",
    "label": "Trigger activation",
    "description": "Activate a trigger and patch all affected downstream dependencies."
  },
  "changed_objects": [
    {
      "id": "T1",
      "type": "trigger",
      "label": "new_evidence"
    }
  ],
  "trigger_expansion": [
    {
      "trigger_id": "T1",
      "transition": "patch",
      "affected_objects": [
        "U1",
        "U2",
        "U3",
        "U4",
        "TS1",
        "R1"
      ]
    }
  ],
  "affected_closure": [
    {
      "id": "C3",
      "type": "claim",
      "label": "The next allowed move is to scope a reversible diligence and proof path, because the launch-critical wastewater facts are missing."
    },
    {
      "id": "C4",
      "type": "claim",
      "label": "Operational wastewater launch remains blocked until jurisdiction, influent, treatment proof, partner path, customer commitment, residual risk, and compliance/reputation gates are resolved."
    },
    {
      "id": "COUNCIL",
      "type": "council_result",
      "label": "Permits bounded diligence only and keeps operational launch blocked."
    },
    {
      "id": "IV:U1",
      "type": "information_value",
      "label": "Which jurisdiction, discharge or reuse route, permit pathway, and regulator evidence standard will govern the first target deployment?"
    },
    {
      "id": "IV:U2",
      "type": "information_value",
      "label": "What influent profile and treatment-performance evidence are required to satisfy the target permit or customer standard?"
    },
    {
      "id": "IV:U3",
      "type": "information_value",
      "label": "Which operator/partner path and conditional customer commitment can be proven without creating launch obligations?"
    },
    {
      "id": "IV:U4",
      "type": "information_value",
      "label": "What residuals, PFAS, safety, compliance, and reputation risks must be controlled before launch?"
    },
    {
      "id": "KT1",
      "type": "kill_test",
      "label": "Gate escalation shows the diligence path would require permit, pilot, partner, or customer commitments that create launch-like exposure."
    },
    {
      "id": "KT2",
      "type": "kill_test",
      "label": "Source contradiction or site-specific evidence shows that a mandatory regulatory or technical requirement cannot be satisfied."
    },
    {
      "id": "L1",
      "type": "loop",
      "label": ""
    },
    {
      "id": "LENS1",
      "type": "lens",
      "label": "Strategic-agentic lens"
    },
    {
      "id": "LENS2",
      "type": "lens",
      "label": "Scientific proof lens"
    },
    {
      "id": "LENS3",
      "type": "lens",
      "label": "Compliance and reputation lens"
    },
    {
      "id": "O1",
      "type": "option_move",
      "label": "query"
    },
    {
      "id": "O2",
      "type": "option_move",
      "label": "act"
    },
    {
      "id": "R1",
      "type": "rendering",
      "label": "Proceed only with bounded market-entry diligence O1. Do not proceed to operational wastewater launch O2 until U1-U4 are resolved or explicitly accepted, treatment proof is tied to the target jurisdiction and influent, and compliance/reputation gates G1 and G2 are approved."
    },
    {
      "id": "T2",
      "type": "trigger",
      "label": "review_required"
    },
    {
      "id": "TS1",
      "type": "tradeoff_surface",
      "label": "TS1"
    },
    {
      "id": "U1",
      "type": "unknown",
      "label": "The jurisdiction, discharge or reuse route, and applicable permit path are not fixed."
    },
    {
      "id": "U2",
      "type": "unknown",
      "label": "The influent profile and treatment performance proof are missing."
    },
    {
      "id": "U3",
      "type": "unknown",
      "label": "The partner/operator path and customer commitment are not fixed."
    },
    {
      "id": "U4",
      "type": "unknown",
      "label": "Residuals, PFAS, safety, compliance, and reputation exposure are not characterized for the target use case."
    },
    {
      "id": "X10",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X11",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X12",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X13",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X14",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X15",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X4",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X5",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X6",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X7",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X8",
      "type": "edge",
      "label": ""
    },
    {
      "id": "X9",
      "type": "edge",
      "label": ""
    }
  ],
  "affected_by_type": {
    "claim": [
      "C3",
      "C4"
    ],
    "council_result": [
      "COUNCIL"
    ],
    "information_value": [
      "IV:U1",
      "IV:U2",
      "IV:U3",
      "IV:U4"
    ],
    "kill_test": [
      "KT1",
      "KT2"
    ],
    "loop": [
      "L1"
    ],
    "lens": [
      "LENS1",
      "LENS2",
      "LENS3"
    ],
    "option_move": [
      "O1",
      "O2"
    ],
    "rendering": [
      "R1"
    ],
    "trigger": [
      "T2"
    ],
    "tradeoff_surface": [
      "TS1"
    ],
    "unknown": [
      "U1",
      "U2",
      "U3",
      "U4"
    ],
    "edge": [
      "X10",
      "X11",
      "X12",
      "X13",
      "X14",
      "X15",
      "X4",
      "X5",
      "X6",
      "X7",
      "X8",
      "X9"
    ]
  },
  "affected_semantic_layers": [
    "argumentative",
    "causal",
    "workflow_state"
  ],
  "invalidated_claims": [
    "C3",
    "C4"
  ],
  "reopened_gates": [],
  "required_approvals": [
    {
      "gate_id": "G1",
      "status": "open",
      "reviewer": "A2 compliance and reputation reviewer",
      "required_decision": "Approve regulated launch readiness or return for more jurisdiction and proof evidence."
    },
    {
      "gate_id": "G2",
      "status": "open",
      "reviewer": "A2 compliance and reputation reviewer",
      "required_decision": "Approve external market commitment or keep activity in bounded diligence."
    }
  ],
  "suggested_transition": "human_review",
  "rendering_affected": true,
  "rendering_regeneration_required": true,
  "changed_decision_meaning": "Trigger activation changes T1:trigger; 34 downstream object(s) are in closure, so the current decision rendering must be regenerated. human review blocks release.",
  "required_revalidation": [
    "json_schema",
    "semantic_validation",
    "decision_surface_check",
    "trigger_transition_check",
    "council_review_check",
    "rendering_regeneration",
    "human_gate_review"
  ],
  "semantic_patch_operations": [
    {
      "op": "trigger_activation",
      "targets": [
        "T1"
      ],
      "effect": "Activate a trigger and patch all affected downstream dependencies."
    },
    {
      "op": "reassess_claims",
      "targets": [
        "C3",
        "C4"
      ],
      "effect": "Recompute support, contradiction load, confidence, and failure modes."
    },
    {
      "op": "collect_approvals",
      "targets": [
        "G1",
        "G2"
      ],
      "effect": "Route changed decision state to named reviewers."
    },
    {
      "op": "regenerate_rendering",
      "targets": [
        "R1"
      ],
      "effect": "Render a new decision view after validation passes."
    }
  ],
  "patch_report": {
    "summary": "trigger_activation on T1 affects 34 downstream object(s); transition=human_review; rendering=affected",
    "next_steps": [
      "rerun validation after applying any object edits",
      "reassess affected claims: C3, C4",
      "collect required approvals: G1:A2 compliance and reputation reviewer, G2:A2 compliance and reputation reviewer",
      "regenerate decision rendering",
      "record trigger state change in patch history or review log",
      "route through the required human gate before release"
    ]
  }
}
```
