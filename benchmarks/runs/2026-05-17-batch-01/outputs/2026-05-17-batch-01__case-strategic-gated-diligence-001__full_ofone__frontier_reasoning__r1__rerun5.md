# Benchmark Raw Output

Run ID: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5`
Rerun of: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1`
Status: `completed`
Execution mode: `Mode A: Controlled Non-Deep-Research Execution`
Case ID: `case-strategic-gated-diligence-001`
Arm ID: `full_ofone`
Model family: `frontier_reasoning`
Repeat: `1`

## Artifact JSON

```json
{
  "ofone_version": "0.6.0",
  "mode": "Map",
  "charter": {
    "objective": "Decide whether to take a reversible diligence move before any operational launch commitment.",
    "scope": [
      "case-strategic-gated-diligence-001 benchmark case",
      "controlled Mode A rerun 5 full-OfOne package",
      "decision boundary between reversible diligence and operational launch"
    ],
    "horizon": "one diligence cycle before launch authorization",
    "stakes": [
      "avoidable operational launch exposure",
      "reviewer accountability",
      "evidence quality before commitment"
    ],
    "risk_tier": "medium",
    "movement_jobs": [
      "BOUND",
      "GATE",
      "EVALUATE"
    ]
  },
  "artifact_identity": {
    "artifact_id": "OFONE-batch01-frontier-strategic-rerun5",
    "case_id": "case-strategic-gated-diligence-001",
    "objective_head": "reversible diligence before operational launch",
    "scope_hash": "sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44",
    "config_hash": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
    "active_evidence_hashes": [
      "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
      "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
      "sha256:3ee2f6b69dc5fc90febfac98a44493db3aacbc15ac69d16d0cd4e8bd8adb493f"
    ],
    "created_at": "2026-05-21T09:14:07Z",
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
        "reversible information-gathering move",
        "operator and decision-owner separation",
        "launch commitment timing"
      ],
      "normative-evaluative": [
        "reviewer authority before release",
        "explicit gate status",
        "accountability for blocked unknowns"
      ]
    },
    "movement_jobs": [
      "BOUND",
      "EVALUATE"
    ]
  },
  "scene": {
    "scene_id": "S1",
    "frames": [
      {
        "frame_id": "F1",
        "type": "strategic",
        "assumptions": [
          "A reversible diligence move can be separated from an operational launch commitment.",
          "The benchmark case provides scenario facts rather than private operating details."
        ]
      },
      {
        "frame_id": "F2",
        "type": "normative",
        "assumptions": [
          "A reviewer gate is required before release when launch exposure is not fully characterized.",
          "The recommendation should not erase blocked unknowns."
        ]
      },
      {
        "frame_id": "F3",
        "type": "evidential",
        "assumptions": [
          "Only the frozen case, prompt, and Mode A contract are active source inputs.",
          "Missing operating facts must stay represented as unknowns."
        ]
      }
    ],
    "tokens": [
      {
        "token_id": "K1",
        "kind": "option",
        "label": "reversible diligence move"
      },
      {
        "token_id": "K2",
        "kind": "option",
        "label": "operational launch"
      },
      {
        "token_id": "K3",
        "kind": "gate",
        "label": "launch release gate"
      },
      {
        "token_id": "K4",
        "kind": "unknown",
        "label": "blocked launch facts"
      },
      {
        "token_id": "K5",
        "kind": "entity",
        "label": "decision owner"
      }
    ],
    "subscenes": [
      {
        "subscene_id": "SS1",
        "parent_scene": "S1",
        "purpose": "evidence_acquisition",
        "frames": [
          "F3"
        ],
        "tokens": [
          "K1",
          "K4"
        ],
        "entry_conditions": [
          "Team is considering a reversible diligence move."
        ],
        "exit_conditions": [
          "Blocking launch unknowns are either resolved or accepted behind a review gate."
        ],
        "movement_jobs": [
          "GROUND",
          "BOUND"
        ]
      },
      {
        "subscene_id": "SS2",
        "parent_scene": "S1",
        "purpose": "option_decision",
        "frames": [
          "F1",
          "F2"
        ],
        "tokens": [
          "K1",
          "K2",
          "K3",
          "K5"
        ],
        "entry_conditions": [
          "Known case facts distinguish diligence from launch."
        ],
        "exit_conditions": [
          "Recommendation states which move is allowed and which remains blocked."
        ],
        "movement_jobs": [
          "MOVE",
          "EVALUATE",
          "GATE"
        ]
      }
    ],
    "state_variables": [
      "diligence_move_reversibility",
      "launch_commitment_state",
      "review_gate_status",
      "blocking_unknown_count"
    ],
    "observed_variables": [
      "case asks for reversible diligence before launch",
      "case requires known/assumed/blocked/gate/update separation",
      "Mode A contract bars another same-shape attachment-led Deep Research rerun"
    ],
    "hidden_variables": [
      "actual operating launch exposure",
      "reviewer identity and approval threshold",
      "cost and timing of the diligence move"
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
      "span_or_locator": "benchmarks/cases/strategic-gated-diligence.md",
      "provenance": "frozen benchmark case file",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
      "retrieved_at": "2026-05-21T09:14:07Z",
      "extract": "The team is considering a reversible diligence move before committing to an operational launch and must distinguish knowns, assumptions, blockers, gate, and update conditions.",
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
        "missing_operating_specifics"
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
      "retrieved_at": "2026-05-21T09:14:07Z",
      "extract": "The full-OfOne arm must return artifact JSON, validator result, rendering, and patch report without claiming empirical superiority.",
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
      "span_or_locator": "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md",
      "provenance": "published Mode A controlled execution contract",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:3ee2f6b69dc5fc90febfac98a44493db3aacbc15ac69d16d0cd4e8bd8adb493f",
      "retrieved_at": "2026-05-21T09:14:07Z",
      "extract": "The controlled rerun is run id rerun5, uses frozen case/prompt/input hashes, blocks attachment-led execution, and blocks matrix insertion before local validation.",
      "source_owner": "ofone-skillchain repair protocol",
      "chain_of_custody": "Read directly from the checked-out repository before Mode A execution.",
      "supports": [
        "C5"
      ],
      "risks": [
        "process_evidence_not_case_fact"
      ],
      "movement_jobs": [
        "GROUND",
        "BOUND",
        "GATE"
      ]
    }
  ],
  "claims": [
    {
      "claim_id": "C1",
      "text": "The case authorizes analysis of a reversible diligence move, not an operational launch commitment.",
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
          "case text could omit implied launch pressure"
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
      "text": "A decision-ready answer must keep known facts, assumptions, blockers, gate state, and update conditions separate.",
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
          "benchmark prompt could be misapplied as narrative instead of map structure"
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
      "text": "The reversible diligence move is the dominant next move because it can reduce launch uncertainty without crossing the release boundary.",
      "type": "normative",
      "supports": [
        "E1"
      ],
      "contradicts": [],
      "depends_on": [
        "C1",
        "U1",
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
          "diligence may be less reversible than assumed",
          "reviewer may require approval before any external diligence contact"
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
      "text": "Operational launch remains blocked until the launch reviewer approves the gate and the blocking unknowns are resolved or explicitly accepted.",
      "type": "operational",
      "supports": [
        "E1"
      ],
      "contradicts": [],
      "depends_on": [
        "G1",
        "U1",
        "U2"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "hidden_variable_risk",
          "adapter_fit"
        ],
        "failure_modes": [
          "gate owner is not named in the case",
          "scope may change from reversible diligence to launch"
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
      "text": "This controlled rerun is benchmark evidence only after computed validation, local review, matrix insertion, publication, and Pages parity; it does not support a superiority claim by itself.",
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
          "operator could confuse prepared or validated package with aggregate superiority"
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
      "description": "Specific launch facts are not present: launch surface, operational owner, customer or stakeholder exposure, budget, dependency commitments, and rollback constraints.",
      "blocks": [
        "O2",
        "R1"
      ],
      "resolution_move": "Run the reversible diligence move to collect the minimum operating facts needed for launch review.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "GATE",
        "TEST"
      ]
    },
    {
      "unknown_id": "U2",
      "kind": "missing_claim",
      "description": "The launch reviewer and approval threshold are not named in the case.",
      "blocks": [
        "G1",
        "O2",
        "R1"
      ],
      "resolution_move": "Assign the launch reviewer and define the approval threshold before any launch commitment.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "GATE",
        "BOUND"
      ]
    }
  ],
  "kill_tests": [
    {
      "test_id": "KT1",
      "target": "C3",
      "test_type": "stakeholder_objection",
      "condition": "Gate escalation or reviewer objection shows the proposed diligence move is not actually reversible or creates launch-like exposure.",
      "falsifies": [
        "C3"
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
      "name": "Reversibility before commitment",
      "kind": "constraint",
      "priority": "must",
      "threshold": "The next move must not create an operational launch commitment or irreversible external obligation.",
      "owned_by": [
        "A1"
      ],
      "movement_jobs": [
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "criterion_id": "CR2",
      "name": "Reviewer-controlled launch release",
      "kind": "threshold",
      "priority": "must",
      "threshold": "Operational launch requires named reviewer approval while gate G1 is open.",
      "owned_by": [
        "A2"
      ],
      "movement_jobs": [
        "GATE",
        "EVALUATE"
      ]
    },
    {
      "criterion_id": "CR3",
      "name": "Information value",
      "kind": "objective",
      "priority": "should",
      "threshold": "The move should materially reduce U1 and U2 at lower cost than premature launch.",
      "owned_by": [
        "A1",
        "A3"
      ],
      "movement_jobs": [
        "TEST",
        "EVALUATE"
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
      "CR3"
    ],
    "dominant_option": "O1",
    "why": [
      "CR1",
      "CR2",
      "CR3"
    ],
    "reversal_conditions": [
      "U1",
      "U2",
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
      "label": "decision owner",
      "role": "decision_owner",
      "incentives": [
        "obtain useful launch information without premature commitment"
      ],
      "exposures": [
        "operational",
        "reputation"
      ],
      "authority": "approve",
      "legitimacy_basis": "responsible for deciding whether the next move is diligence or launch",
      "movement_jobs": [
        "BOUND",
        "MOVE"
      ]
    },
    {
      "actor_id": "A2",
      "label": "launch reviewer",
      "role": "reviewer",
      "incentives": [
        "prevent launch before evidence and approval threshold are met"
      ],
      "exposures": [
        "operational",
        "reputation"
      ],
      "authority": "block",
      "legitimacy_basis": "owns the launch release gate",
      "movement_jobs": [
        "GATE",
        "WARN"
      ]
    },
    {
      "actor_id": "A3",
      "label": "diligence operator",
      "role": "operator",
      "incentives": [
        "collect narrow information quickly"
      ],
      "exposures": [
        "scope creep",
        "misread external signal"
      ],
      "authority": "advise",
      "legitimacy_basis": "executes the reversible diligence task inside approved scope",
      "movement_jobs": [
        "GROUND",
        "TEST"
      ]
    }
  ],
  "temporal_model": {
    "time_horizon": "one diligence cycle",
    "decision_deadline": "before any operational launch commitment",
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
        "valid_until": "until Mode A contract changes",
        "staleness_trigger": "contract file hash changes"
      }
    ],
    "update_cadence": "revalidate after new operating evidence or reviewer decision",
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
      "time_to_resolve": "one diligence cycle",
      "risk_reduction": "high",
      "recommended_next_query": "What facts define the launch surface, rollback boundary, owner, budget, and stakeholder exposure?",
      "movement_jobs": [
        "TEST",
        "MOVE",
        "EVALUATE"
      ]
    },
    {
      "unknown_id": "U2",
      "decision_impact": "high",
      "resolution_cost": "low",
      "time_to_resolve": "before diligence starts",
      "risk_reduction": "medium",
      "recommended_next_query": "Who is the launch reviewer, and what evidence threshold closes G1?",
      "movement_jobs": [
        "TEST",
        "GATE",
        "BOUND"
      ]
    }
  ],
  "lenses": [
    {
      "lens_id": "LENS1",
      "name": "Strategic-agentic lens",
      "adapter_axis": "strategic-agentic",
      "questions": [
        "Which move reduces uncertainty without creating commitment?",
        "Who owns the next action and who can stop scope creep?"
      ],
      "claims_examined": [
        "C1",
        "C3"
      ],
      "blind_spots": [
        "actual cost and rollback boundary are absent"
      ],
      "contention": [
        "Diligence can drift into launch if no reviewer gate is explicit."
      ],
      "movement_jobs": [
        "EVALUATE",
        "WARN"
      ]
    },
    {
      "lens_id": "LENS2",
      "name": "Normative release lens",
      "adapter_axis": "normative-evaluative",
      "questions": [
        "What authority must approve launch?",
        "Which unknowns make release inappropriate?"
      ],
      "claims_examined": [
        "C2",
        "C4"
      ],
      "blind_spots": [
        "reviewer identity and approval threshold are unspecified"
      ],
      "contention": [
        "Launch should remain blocked even if diligence is allowed."
      ],
      "movement_jobs": [
        "GATE",
        "EVALUATE"
      ]
    }
  ],
  "council_result": {
    "coverage": [
      "strategic-agentic",
      "normative-evaluative"
    ],
    "missing_lenses": [],
    "major_dissent": [
      "No dissent against reversible diligence; dissent remains against operational launch while U1 and U2 are open."
    ],
    "decision_effect": "Permits reversible diligence only and keeps launch blocked.",
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
      "from": "E3",
      "to": "C5",
      "relation_family": "evidential",
      "relation": "supports",
      "evidence_refs": [
        "E3"
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
      "edge_id": "X8",
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
      "edge_id": "X9",
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
      "edge_id": "X10",
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
        "X9"
      ],
      "polarity": "balancing",
      "delay": "medium",
      "gain": "medium",
      "control_points": [
        "G1 launch release gate",
        "T1 new evidence patch trigger"
      ],
      "observable_cues": [
        "U1 or U2 remains open",
        "reviewer withholds launch approval",
        "diligence evidence changes the tradeoff surface"
      ],
      "failure_mode": "If the gate is treated as a formality, diligence can be mistaken for launch clearance.",
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
        "Improves information value while preserving reversibility; still requires scope discipline."
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
        "X7"
      ],
      "tradeoffs": [
        "Launch could create operational exposure before the case-defined blockers are resolved."
      ],
      "blocking_unknowns": [
        "U1",
        "U2"
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
        "C3",
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
      "condition": "Launch release requires named reviewer approval after U1 and U2 are resolved or explicitly accepted.",
      "reviewer": "A2 launch reviewer",
      "required_decision": "Approve launch release or return for more diligence evidence.",
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
    "summary": "Known: the case is about reversible diligence before launch. Assumed: the diligence move can be scoped so it does not create launch exposure. Blocked: launch-specific facts and reviewer threshold are missing. Gate: G1 remains open. Update: new evidence resolving U1 and U2 patches the tradeoff surface and recommendation.",
    "recommendation": "Proceed with the reversible diligence move O1 only. Do not proceed to operational launch O2 until U1 and U2 are resolved or accepted by the launch reviewer and G1 is approved.",
    "confidence": "medium",
    "depends_on": [
      "C1",
      "C2",
      "C3",
      "C4",
      "U1",
      "U2",
      "TS1",
      "G1"
    ],
    "movement_jobs": [
      "MOVE",
      "WARN",
      "GATE"
    ]
  },
  "benchmark_trace": {
    "trace_id": "BT-rerun5",
    "suite_id": "ofone-v0.5-three-arm-evaluation",
    "cases_run": 1,
    "arms_run": [
      "full_ofone"
    ],
    "model_families": 1,
    "superiority_ready": false,
    "diagnostics": [
      "Controlled Mode A replacement for one excluded frontier full-OfOne slot.",
      "Single-run artifact is not sufficient for superiority or aggregate release claims."
    ],
    "case_id": "case-strategic-gated-diligence-001",
    "run_id": "2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5",
    "case_file": "benchmarks/cases/strategic-gated-diligence.md",
    "case_file_sha256": "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
    "prompt_file": "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
    "prompt_file_sha256": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
    "input_bundle_sha256": "sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44",
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
        "code": "OFONE_BENCHMARK_TRACE",
        "severity": "warning",
        "check": "benchmark_trace",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "benchmark_trace BT-rerun5 is not superiority-ready",
        "repair_hint": null
      },
      {
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info",
        "check": "dependency_closure",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "trigger T1: C3, C4, COUNCIL, IV:U1, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9 [includes rendering]",
        "repair_hint": null
      },
      {
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info",
        "check": "dependency_closure",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "trigger T2: C3, C4, COUNCIL, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9 [includes rendering]",
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
        "check": "benchmark_trace",
        "passed": true,
        "notes": "benchmark_trace BT-rerun5 is not superiority-ready",
        "code": "OFONE_BENCHMARK_TRACE",
        "severity": "warning"
      },
      {
        "check": "dependency_closure",
        "passed": true,
        "notes": "trigger T1: C3, C4, COUNCIL, IV:U1, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9 [includes rendering]",
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info"
      },
      {
        "check": "dependency_closure",
        "passed": true,
        "notes": "trigger T2: C3, C4, COUNCIL, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9 [includes rendering]",
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
      "file": "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.artifact.json",
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
          "code": "OFONE_BENCHMARK_TRACE",
          "severity": "warning",
          "check": "benchmark_trace",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "benchmark_trace BT-rerun5 is not superiority-ready",
          "repair_hint": null
        },
        {
          "code": "OFONE_DEPENDENCY_CLOSURE",
          "severity": "info",
          "check": "dependency_closure",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "trigger T1: C3, C4, COUNCIL, IV:U1, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9 [includes rendering]",
          "repair_hint": null
        },
        {
          "code": "OFONE_DEPENDENCY_CLOSURE",
          "severity": "info",
          "check": "dependency_closure",
          "object_id": null,
          "object_type": null,
          "path": null,
          "message": "trigger T2: C3, C4, COUNCIL, KT1, L1, LENS1, LENS2, O1, O2, R1, T1, T2, TS1, X10, X4, X5, X6, X7, X8, X9 [includes rendering]",
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

## Patch Report

```json
{
  "input": "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.artifact.json",
  "operation": {
    "operation_id": "add_supporting_evidence",
    "label": "Add supporting evidence",
    "description": "Attach or modify evidence support and reassess supported claims."
  },
  "changed_objects": [
    {
      "id": "T1",
      "type": "trigger",
      "label": "new_evidence"
    }
  ],
  "trigger_expansion": [],
  "affected_closure": [
    {
      "id": "C3",
      "type": "claim",
      "label": "The reversible diligence move is the dominant next move because it can reduce launch uncertainty without crossing the release boundary."
    },
    {
      "id": "COUNCIL",
      "type": "council_result",
      "label": "Permits reversible diligence only and keeps launch blocked."
    },
    {
      "id": "KT1",
      "type": "kill_test",
      "label": "Gate escalation or reviewer objection shows the proposed diligence move is not actually reversible or creates launch-like exposure."
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
      "id": "O1",
      "type": "option_move",
      "label": "query"
    },
    {
      "id": "R1",
      "type": "rendering",
      "label": "Proceed with the reversible diligence move O1 only. Do not proceed to operational launch O2 until U1 and U2 are resolved or accepted by the launch reviewer and G1 is approved."
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
      "C3"
    ],
    "council_result": [
      "COUNCIL"
    ],
    "kill_test": [
      "KT1"
    ],
    "loop": [
      "L1"
    ],
    "lens": [
      "LENS1"
    ],
    "option_move": [
      "O1"
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
    "edge": [
      "X4",
      "X5",
      "X6",
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
    "C3"
  ],
  "reopened_gates": [],
  "required_approvals": [],
  "suggested_transition": "patch",
  "rendering_affected": true,
  "rendering_regeneration_required": true,
  "changed_decision_meaning": "Add supporting evidence changes T1:trigger; 14 downstream object(s) are in closure, so the current decision rendering must be regenerated.",
  "required_revalidation": [
    "json_schema",
    "semantic_validation",
    "decision_surface_check",
    "trigger_transition_check",
    "council_review_check",
    "rendering_regeneration"
  ],
  "semantic_patch_operations": [
    {
      "op": "add_supporting_evidence",
      "targets": [
        "T1"
      ],
      "effect": "Attach or modify evidence support and reassess supported claims."
    },
    {
      "op": "reassess_claims",
      "targets": [
        "C3"
      ],
      "effect": "Recompute support, contradiction load, confidence, and failure modes."
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
    "summary": "add_supporting_evidence on T1 affects 14 downstream object(s); transition=patch; rendering=affected",
    "next_steps": [
      "rerun validation after applying any object edits",
      "reassess affected claims: C3",
      "regenerate decision rendering"
    ]
  }
}
```
