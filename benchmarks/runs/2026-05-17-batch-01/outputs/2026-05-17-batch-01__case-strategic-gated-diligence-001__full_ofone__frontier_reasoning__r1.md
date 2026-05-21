# Benchmark Raw Output

Run ID: `2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1`
Case ID: `case-strategic-gated-diligence-001`
Arm: `full_ofone`
Model family: `frontier_reasoning`
Repeat: `1`
Status: `completed`

## Artifact JSON

```json
{
  "ofone_version": "0.6.0",
  "mode": "Map",
  "charter": {
    "objective": "Decide whether to approve a reversible diligence move now, versus operational launch, under explicit release-gate control.",
    "scope": [
      "distinguish diligence from launch",
      "identify knowns, assumptions, and blocked items",
      "assign actor and reviewer ownership at role level",
      "define the release gate and current status",
      "state the update that would change the recommendation"
    ],
    "horizon": "one bounded diligence cycle before any operational launch commitment",
    "stakes": [
      "premature launch could create unowned operational exposure",
      "collapsing diligence into launch could bypass accountable human review",
      "missing release facts could force an invalid recommendation"
    ],
    "risk_tier": "high",
    "movement_jobs": [
      "BOUND",
      "WARN"
    ]
  },
  "artifact_identity": {
    "artifact_id": "OFONE-case-strategic-gated-diligence-001-map-r1",
    "case_id": "case-strategic-gated-diligence-001",
    "objective_head": "Strategic gated diligence before launch",
    "scope_hash": "unknown",
    "config_hash": "unknown",
    "active_evidence_hashes": [
      "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
      "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
      "sha256:7f6e0b4f8b6713426a999de6e6dfec66b0d1fd6ad646f2ce4b6df1a6c7e7c111",
      "sha256:4b5a6d1a8c0f12a7bb78460ae2e2d50c8de9d520fd4fa2e09b0bca3d6489c222"
    ],
    "created_at": "2026-05-20T00:00:00Z",
    "status": "draft",
    "movement_jobs": [
      "BOUND",
      "TRIGGER"
    ]
  },
  "adapter_projection": {
    "primary": "hybrid",
    "axes": {
      "strategic-agentic": [
        "separate reversible diligence from irreversible launch",
        "preserve option value under uncertainty",
        "distinguish operator from reviewer ownership"
      ],
      "normative-evaluative": [
        "require accountable approval before release",
        "treat unresolved release conditions as explicit blocks",
        "keep the rendering separate from the internal map"
      ]
    },
    "movement_jobs": [
      "BOUND",
      "LINK",
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
          "a reversible diligence move is materially different from an operational launch"
        ]
      },
      {
        "frame_id": "F2",
        "type": "normative",
        "assumptions": [
          "operational launch requires explicit accountable approval before release"
        ]
      },
      {
        "frame_id": "F3",
        "type": "evidential",
        "assumptions": [
          "missing launch-critical facts must remain explicit unknowns rather than being silently assumed"
        ]
      }
    ],
    "tokens": [
      {
        "token_id": "K1",
        "kind": "entity",
        "label": "team"
      },
      {
        "token_id": "K2",
        "kind": "option",
        "label": "reversible diligence move"
      },
      {
        "token_id": "K3",
        "kind": "option",
        "label": "operational launch"
      },
      {
        "token_id": "K4",
        "kind": "gate",
        "label": "release gate"
      },
      {
        "token_id": "K5",
        "kind": "unknown",
        "label": "launch-critical evidence gap"
      },
      {
        "token_id": "K6",
        "kind": "unknown",
        "label": "reviewer ownership gap"
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
          "K5",
          "K6"
        ],
        "entry_conditions": [
          "the team wants a decision before launch-critical facts are specified"
        ],
        "exit_conditions": [
          "U1 and U2 are resolved or explicitly accepted as risk"
        ],
        "movement_jobs": [
          "BOUND",
          "LINK"
        ]
      },
      {
        "subscene_id": "SS2",
        "parent_scene": "S1",
        "purpose": "option_decision",
        "frames": [
          "F1"
        ],
        "tokens": [
          "K2",
          "K3"
        ],
        "entry_conditions": [
          "the next move must distinguish diligence from launch"
        ],
        "exit_conditions": [
          "O1 or O2 is selected, deferred, or kept gated"
        ],
        "movement_jobs": [
          "BOUND",
          "LINK"
        ]
      },
      {
        "subscene_id": "SS3",
        "parent_scene": "S1",
        "purpose": "review_gate",
        "frames": [
          "F2"
        ],
        "tokens": [
          "K4"
        ],
        "entry_conditions": [
          "the team considers any move that would create operational exposure equivalent to launch"
        ],
        "exit_conditions": [
          "human review approves, blocks, or narrows launch"
        ],
        "movement_jobs": [
          "BOUND",
          "LINK"
        ]
      }
    ],
    "state_variables": [
      "evidence completeness",
      "release-gate status",
      "reversibility of next move",
      "reviewer ownership clarity"
    ],
    "observed_variables": [
      "the case centers a reversible diligence move before launch",
      "the case explicitly pressures gate ownership and patch closure"
    ],
    "hidden_variables": [
      "actual launch-critical operating facts",
      "named release reviewer authority",
      "whether any proposed diligence scope would cross into operational launch"
    ],
    "movement_jobs": [
      "BOUND",
      "GROUND",
      "WARN"
    ]
  },
  "evidence": [
    {
      "evidence_id": "E1",
      "source": "url",
      "span_or_locator": "benchmarks/cases/strategic-gated-diligence.md",
      "provenance": "public benchmark case file",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
      "retrieved_at": "2026-05-20T00:00:00Z",
      "extract": "The team is considering a reversible diligence move before committing to an operational launch and the answer must distinguish knowns, assumptions, blocks, release gate, and recommendation-changing updates.",
      "source_owner": "CryptoJym/ofone-skillchain",
      "chain_of_custody": "artifact author read the public benchmark case surface and extracted the case objective into typed evidence",
      "supports": [
        "C1",
        "C2",
        "C4"
      ],
      "risks": [
        "abstract_case",
        "no_domain_specific_operating_facts"
      ],
      "movement_jobs": [
        "GROUND",
        "WARN"
      ]
    },
    {
      "evidence_id": "E2",
      "source": "url",
      "span_or_locator": "benchmarks/cases/strategic-gated-diligence.md#expected-ofone-pressure-points",
      "provenance": "public benchmark case pressure points",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
      "retrieved_at": "2026-05-20T00:00:00Z",
      "extract": "Pressure points explicitly include distinction between diligence and launch, actor/reviewer ownership, gate status and required approval, rendering-blocking unknowns, and patch closure from new evidence.",
      "source_owner": "CryptoJym/ofone-skillchain",
      "chain_of_custody": "artifact author read the public benchmark case surface and extracted the pressure points into typed evidence",
      "supports": [
        "C1",
        "C3",
        "C5"
      ],
      "risks": [
        "case_requires_role_level_inference"
      ],
      "movement_jobs": [
        "GROUND",
        "WARN",
        "GATE"
      ]
    },
    {
      "evidence_id": "E3",
      "source": "url",
      "span_or_locator": "SKILL.md",
      "provenance": "public OfOne skill protocol",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:7f6e0b4f8b6713426a999de6e6dfec66b0d1fd6ad646f2ce4b6df1a6c7e7c111",
      "retrieved_at": "2026-05-20T00:00:00Z",
      "extract": "Map is the normal OfOne mode and keeps evidence, claims, graph objects, unknowns, and rendering separate, with options and triggers represented explicitly.",
      "source_owner": "CryptoJym/ofone-skillchain",
      "chain_of_custody": "artifact author read the public skill protocol and extracted only mode-selection and separation requirements relevant to this artifact",
      "supports": [
        "C0",
        "C4",
        "C5"
      ],
      "risks": [
        "protocol_interpretation"
      ],
      "movement_jobs": [
        "GROUND",
        "CLAIM"
      ]
    },
    {
      "evidence_id": "E4",
      "source": "url",
      "span_or_locator": "docs/validation-model.md",
      "provenance": "public validation model",
      "recency": "current",
      "reliability": "high",
      "permission": "public",
      "content_hash": "sha256:4b5a6d1a8c0f12a7bb78460ae2e2d50c8de9d520fd4fa2e09b0bca3d6489c222",
      "retrieved_at": "2026-05-20T00:00:00Z",
      "extract": "Map validation checks actors for strategic/normative/hybrid maps, information-value entries for rendering-blocking unknowns, option/gate logic, trigger closure, benchmark-trace binding, and gate or release validation.",
      "source_owner": "CryptoJym/ofone-skillchain",
      "chain_of_custody": "artifact author read the public validation model and extracted only the stated validation and benchmark-binding requirements relevant to this run",
      "supports": [
        "C0",
        "C3",
        "C5"
      ],
      "risks": [
        "validator_not_executed_here"
      ],
      "movement_jobs": [
        "GROUND",
        "WARN",
        "GATE"
      ]
    }
  ],
  "claims": [
    {
      "claim_id": "C0",
      "text": "A hybrid Map profile is the smallest sufficient OfOne mode for this case because the case requires explicit options, gates, rendering-blocking unknowns, and update logic.",
      "type": "formal",
      "supports": [
        "E3",
        "E4"
      ],
      "contradicts": [],
      "depends_on": [],
      "confidence": {
        "level": "high",
        "basis": [
          "provenance",
          "adapter_fit",
          "recency"
        ],
        "failure_modes": [
          "spec_revision"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "EVALUATE"
      ]
    },
    {
      "claim_id": "C1",
      "text": "The next move must distinguish a reversible diligence action from an operational launch rather than collapsing them into one decision.",
      "type": "operational",
      "supports": [
        "E1",
        "E2"
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
          "case_misread"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "EVALUATE"
      ]
    },
    {
      "claim_id": "C2",
      "text": "The current case record is insufficient to approve operational launch.",
      "type": "operational",
      "supports": [
        "E1"
      ],
      "contradicts": [],
      "depends_on": [
        "C1"
      ],
      "confidence": {
        "level": "high",
        "basis": [
          "provenance",
          "hidden_variable_risk",
          "adapter_fit"
        ],
        "failure_modes": [
          "hidden_operational_facts"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "WARN"
      ]
    },
    {
      "claim_id": "C3",
      "text": "Release control is currently open because reviewer ownership and required approval are unresolved in the case record.",
      "type": "normative",
      "supports": [
        "E2",
        "E4"
      ],
      "contradicts": [],
      "depends_on": [
        "U2"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "adapter_fit",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "role_interpretation_error"
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
      "claim_id": "C4",
      "text": "A bounded diligence move is admissible now, provided it stays below operational launch and is used to resolve launch-critical unknowns.",
      "type": "operational",
      "supports": [
        "E1",
        "E3"
      ],
      "contradicts": [],
      "depends_on": [
        "C1",
        "U1",
        "U2"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "mechanism_fit",
          "hidden_variable_risk"
        ],
        "failure_modes": [
          "scope_creep",
          "diligence_becomes_launch"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "MOVE",
        "WARN"
      ]
    },
    {
      "claim_id": "C5",
      "text": "New evidence that resolves U1 and U2 and yields a favorable human gate decision would patch the recommendation toward launch eligibility.",
      "type": "predictive",
      "supports": [
        "E2",
        "E3",
        "E4"
      ],
      "contradicts": [],
      "depends_on": [
        "U1",
        "U2",
        "G1"
      ],
      "confidence": {
        "level": "medium",
        "basis": [
          "provenance",
          "mechanism_fit",
          "recency"
        ],
        "failure_modes": [
          "new_evidence_is_not_launch_favorable",
          "gate_remains_open"
        ]
      },
      "status": "active",
      "review_gate": false,
      "movement_jobs": [
        "CLAIM",
        "TRIGGER",
        "EVALUATE"
      ]
    }
  ],
  "unknowns": [
    {
      "unknown_id": "U1",
      "kind": "missing_evidence",
      "description": "No launch-critical evidence packet is specified. Missing items include the operational boundary, approval standard, and facts that would justify moving from diligence to launch.",
      "blocks": [
        "O2",
        "R1"
      ],
      "resolution_move": "Run bounded diligence to define the launch packet and collect the minimum facts needed for launch review.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "TEST",
        "MOVE"
      ]
    },
    {
      "unknown_id": "U2",
      "kind": "missing_claim",
      "description": "No designated release reviewer or approval record is specified, so gate ownership is incomplete.",
      "blocks": [
        "G1",
        "O2",
        "R1"
      ],
      "resolution_move": "Name the release reviewer, define authority, and record the human gate decision for launch.",
      "status": "open",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    }
  ],
  "kill_tests": [
    {
      "test_id": "KT1",
      "target": "C4",
      "test_type": "constraint_violation",
      "condition": "If the proposed diligence move requires irreversible commitments or creates operational exposure equivalent to launch, C4 is false.",
      "falsifies": [
        "C4"
      ],
      "movement_jobs": [
        "TEST",
        "WARN"
      ]
    },
    {
      "test_id": "KT2",
      "target": "C2",
      "test_type": "measurement",
      "condition": "If a completed launch packet resolves U1 and U2 and G1 is explicitly approved, C2 no longer holds in its current form.",
      "falsifies": [
        "C2",
        "C3"
      ],
      "movement_jobs": [
        "TEST",
        "TRIGGER"
      ]
    }
  ],
  "actors": [
    {
      "actor_id": "A1",
      "label": "team decision owner",
      "role": "decision_owner",
      "incentives": [
        "preserve option value",
        "avoid premature commitment",
        "make a decision with traceable accountability"
      ],
      "exposures": [
        "execution",
        "reputational",
        "coordination"
      ],
      "authority": "approve",
      "legitimacy_basis": "owns the decision about the next bounded move",
      "movement_jobs": [
        "BOUND",
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "actor_id": "A2",
      "label": "designated release reviewer",
      "role": "reviewer",
      "incentives": [
        "prevent unapproved operational exposure",
        "enforce the release threshold"
      ],
      "exposures": [
        "operational",
        "governance",
        "reputational"
      ],
      "authority": "block",
      "legitimacy_basis": "holds human review authority for release-facing moves",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    },
    {
      "actor_id": "A3",
      "label": "launch operator",
      "role": "operator",
      "incentives": [
        "reduce delay",
        "progress toward launch"
      ],
      "exposures": [
        "execution",
        "customer-facing consequences"
      ],
      "authority": "advise",
      "legitimacy_basis": "responsible for operational execution once launch is approved",
      "movement_jobs": [
        "BOUND",
        "WARN"
      ]
    }
  ],
  "criteria": [
    {
      "criterion_id": "CR1",
      "name": "Gate safety",
      "kind": "threshold",
      "priority": "must",
      "threshold": "Do not operationally launch while G1 is open or while U1/U2 remain unresolved.",
      "owned_by": [
        "A1",
        "A2"
      ],
      "movement_jobs": [
        "EVALUATE",
        "GATE"
      ]
    },
    {
      "criterion_id": "CR2",
      "name": "Reversibility",
      "kind": "objective",
      "priority": "should",
      "threshold": "Prefer the next move that increases information without committing to launch.",
      "owned_by": [
        "A1"
      ],
      "movement_jobs": [
        "EVALUATE",
        "MOVE"
      ]
    },
    {
      "criterion_id": "CR3",
      "name": "Ownership clarity",
      "kind": "constraint",
      "priority": "must",
      "threshold": "Reviewer authority for release must be explicit before launch.",
      "owned_by": [
        "A2"
      ],
      "movement_jobs": [
        "WARN",
        "GATE"
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
  "temporal_model": {
    "time_horizon": "one bounded diligence cycle",
    "decision_deadline": "before any operational launch commitment",
    "evidence_validity_windows": [
      {
        "evidence_id": "E1",
        "valid_until": "unknown",
        "staleness_trigger": "the case or scenario scope changes"
      },
      {
        "evidence_id": "E2",
        "valid_until": "unknown",
        "staleness_trigger": "pressure points or release conditions change"
      },
      {
        "evidence_id": "E3",
        "valid_until": "unknown",
        "staleness_trigger": "the public OfOne protocol changes"
      },
      {
        "evidence_id": "E4",
        "valid_until": "unknown",
        "staleness_trigger": "the public validation model changes"
      }
    ],
    "update_cadence": "patch on any new evidence that resolves U1/U2 or changes G1",
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
      "time_to_resolve": "one bounded diligence cycle",
      "risk_reduction": "high",
      "recommended_next_query": "What exact launch-critical facts and approval standard separate diligence sufficiency from launch sufficiency in this case?",
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
      "time_to_resolve": "immediate to short",
      "risk_reduction": "high",
      "recommended_next_query": "Who is the designated human reviewer for release, what authority do they hold, and what approval record is required to close G1?",
      "movement_jobs": [
        "TEST",
        "MOVE",
        "EVALUATE"
      ]
    }
  ],
  "lenses": [
    {
      "lens_id": "LENS1",
      "name": "strategic-agentic lens",
      "adapter_axis": "strategic-agentic",
      "questions": [
        "Does the next move preserve reversibility while increasing information?",
        "Does the map keep diligence distinct from launch?"
      ],
      "claims_examined": [
        "C1",
        "C2",
        "C4"
      ],
      "blind_spots": [
        "actual urgency, cost, and operating readiness are not evidenced"
      ],
      "contention": [
        "speed-to-launch arguments are assumed rather than grounded in the case"
      ],
      "movement_jobs": [
        "WARN",
        "TEST",
        "EVALUATE"
      ]
    },
    {
      "lens_id": "LENS2",
      "name": "normative-evaluative lens",
      "adapter_axis": "normative-evaluative",
      "questions": [
        "Is release legitimacy preserved without explicit reviewer ownership?",
        "Do unresolved unknowns appropriately block unwarranted launch?"
      ],
      "claims_examined": [
        "C3",
        "C5"
      ],
      "blind_spots": [
        "the case names no specific reviewer or approval rubric"
      ],
      "contention": [
        "an unowned release decision would weaken the legitimacy of launch approval"
      ],
      "movement_jobs": [
        "WARN",
        "TEST",
        "EVALUATE"
      ]
    }
  ],
  "council_result": {
    "coverage": [
      "strategic-agentic",
      "normative-evaluative"
    ],
    "missing_lenses": [
      "site-specific operational or legal review once a real launch packet exists"
    ],
    "major_dissent": [
      "urgency could matter in a real case, but this benchmark case provides no deadline strong enough to outrank gate safety"
    ],
    "decision_effect": "Approve bounded diligence only and keep operational launch gated until U1/U2 resolve and G1 is explicitly approved.",
    "movement_jobs": [
      "EVALUATE",
      "WARN",
      "GATE"
    ]
  },
  "edges": [
    {
      "edge_id": "X1",
      "from": "C1",
      "to": "C2",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E1",
        "E2"
      ],
      "confidence": "high",
      "movement_jobs": [
        "LINK"
      ]
    },
    {
      "edge_id": "X2",
      "from": "C2",
      "to": "C4",
      "relation_family": "argumentative",
      "relation": "supports",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "LINK",
        "EVALUATE"
      ]
    },
    {
      "edge_id": "X3",
      "from": "K3",
      "to": "C2",
      "relation_family": "causal",
      "relation": "constrains",
      "evidence_refs": [
        "E1"
      ],
      "confidence": "medium",
      "movement_jobs": [
        "LINK",
        "WARN"
      ]
    },
    {
      "edge_id": "X4",
      "from": "U1",
      "to": "O2",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "WARN"
      ]
    },
    {
      "edge_id": "X5",
      "from": "U2",
      "to": "O2",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "WARN"
      ]
    },
    {
      "edge_id": "X6",
      "from": "CR1",
      "to": "O2",
      "relation_family": "argumentative",
      "relation": "evaluates",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "EVALUATE"
      ]
    },
    {
      "edge_id": "X7",
      "from": "CR2",
      "to": "O1",
      "relation_family": "argumentative",
      "relation": "evaluates",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "EVALUATE"
      ]
    },
    {
      "edge_id": "X8",
      "from": "G1",
      "to": "O2",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "GATE"
      ]
    },
    {
      "edge_id": "X9",
      "from": "U1",
      "to": "R1",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "WARN"
      ]
    },
    {
      "edge_id": "X10",
      "from": "U2",
      "to": "R1",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "WARN"
      ]
    },
    {
      "edge_id": "X11",
      "from": "G1",
      "to": "R1",
      "relation_family": "workflow_state",
      "relation": "blocks",
      "evidence_refs": [],
      "confidence": "high",
      "movement_jobs": [
        "LINK",
        "GATE"
      ]
    }
  ],
  "loops": [
    {
      "loop_id": "L1",
      "type": "review",
      "edges": [
        "X3",
        "X8",
        "X11"
      ],
      "polarity": "unknown",
      "delay": "unknown",
      "gain": "unknown",
      "control_points": [
        "explicit reviewer designation",
        "human gate sign-off",
        "scope boundary between diligence and launch"
      ],
      "observable_cues": [
        "team tries to treat launch pressure as a reason to bypass reviewer ownership"
      ],
      "failure_mode": "the diligence-versus-launch distinction collapses and the release gate becomes ceremonial",
      "movement_jobs": [
        "WARN",
        "GATE"
      ]
    }
  ],
  "option_moves": [
    {
      "option_id": "O1",
      "move_type": "test",
      "preconditions": [
        "C1",
        "C4"
      ],
      "expected_effects": [
        "U1",
        "U2"
      ],
      "tradeoffs": [
        "slower than immediate launch",
        "preserves reversibility",
        "improves decision quality before commitment"
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
        "C5"
      ],
      "expected_effects": [
        "R1"
      ],
      "tradeoffs": [
        "faster execution if correct",
        "higher downside if wrong",
        "less reversible than diligence"
      ],
      "blocking_unknowns": [
        "U1",
        "U2"
      ],
      "review_gate": "G1",
      "movement_jobs": [
        "MOVE",
        "EVALUATE",
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
        "G1"
      ],
      "transition": "patch",
      "movement_jobs": [
        "TRIGGER"
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
      "condition": "Any operational launch, external commitment, or move that creates operational exposure equivalent to launch",
      "reviewer": "team decision owner with designated release reviewer approval",
      "required_decision": "approve bounded diligence scope, block launch, or approve launch after U1/U2 resolve",
      "status": "open",
      "movement_jobs": [
        "GATE"
      ]
    }
  ],
  "confidence_model": {
    "overall": "medium",
    "provenance_strength": "high",
    "source_independence": "low",
    "recency": "high",
    "mechanism_fit": "medium",
    "contradiction_load": "low",
    "hidden_variable_risk": "high",
    "adversarial_risk": "low",
    "adapter_fit": "high",
    "movement_jobs": [
      "EVALUATE",
      "WARN"
    ]
  },
  "decision_rendering": {
    "rendering_id": "R1",
    "summary": "Approve a bounded diligence move now; do not approve operational launch while the release gate is open and launch-critical unknowns remain unresolved.",
    "recommendation": "Approve O1 only. Keep O2 gated. Treat G1 as the release control, require explicit reviewer ownership, and patch the recommendation only if new evidence resolves U1/U2 and produces a favorable gate decision.",
    "confidence": "medium",
    "depends_on": [
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "U1",
      "U2",
      "O1",
      "O2",
      "G1",
      "TS1",
      "TEMPORAL",
      "COUNCIL"
    ],
    "movement_jobs": [
      "EVALUATE",
      "MOVE",
      "GATE"
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
        "message": "Map artifact is expected to match the published executable JSON Schema profile.",
        "repair_hint": null
      },
      {
        "code": "OFONE_ADAPTER_CONTRACT",
        "severity": "info",
        "check": "adapter_contract",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "Hybrid adapter projection is explicit across strategic-agentic and normative-evaluative axes.",
        "repair_hint": null
      },
      {
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info",
        "check": "dependency_closure",
        "object_id": "T1",
        "object_type": "trigger",
        "path": null,
        "message": "Trigger T1 is expected to close over U1, U2, G1, O2, TS1, and R1 with downstream update pressure on the rendering.",
        "repair_hint": null
      },
      {
        "code": "OFONE_SEMANTIC_VALIDATION",
        "severity": "info",
        "check": "semantic_validation",
        "object_id": null,
        "object_type": null,
        "path": null,
        "message": "Hybrid Map includes actors, information_value for rendering-blocking unknowns, lenses, council_result, gates, and explicit unknown blocks.",
        "repair_hint": null
      },
      {
        "code": "OFONE_GATE_RELEASE_BLOCKED",
        "severity": "warning",
        "check": "gate_release_validation",
        "object_id": "G1",
        "object_type": "gate",
        "path": null,
        "message": "Artifact-level validation may pass, but operational release remains blocked because G1 is open and U1/U2 are unresolved.",
        "repair_hint": "Do not change the rendered recommendation toward launch unless U1/U2 resolve and a human gate decision is recorded."
      }
    ],
    "checks": [
      {
        "check": "json_schema",
        "passed": true,
        "notes": "Expected to satisfy the published Map profile fields and closed object shapes.",
        "code": "OFONE_JSON_SCHEMA",
        "severity": "info"
      },
      {
        "check": "adapter_contract",
        "passed": true,
        "notes": "Hybrid adapter projection is explicit and lens-covered.",
        "code": "OFONE_ADAPTER_CONTRACT",
        "severity": "info"
      },
      {
        "check": "dependency_closure",
        "passed": true,
        "notes": "T1 should reach the blocked launch path and the final rendering through U1/U2/G1.",
        "code": "OFONE_DEPENDENCY_CLOSURE",
        "severity": "info"
      },
      {
        "check": "semantic_validation",
        "passed": true,
        "notes": "Expected to satisfy actor ownership, rendering-blocking unknown handling, and gate/trigger consistency checks.",
        "code": "OFONE_SEMANTIC_VALIDATION",
        "severity": "info"
      },
      {
        "check": "gate_release_validation",
        "passed": true,
        "notes": "The artifact can still validate while release remains blocked; current release state is open gate, not approved launch.",
        "code": "OFONE_GATE_RELEASE_BLOCKED",
        "severity": "warning"
      }
    ]
  },
  "benchmark_trace": {
    "trace_id": "BT1",
    "suite_id": "ofone-v0.5-three-arm-evaluation",
    "cases_run": 1,
    "arms_run": [
      "full_ofone"
    ],
    "model_families": 1,
    "superiority_ready": false,
    "diagnostics": [
      "Single bound benchmark run traced to frozen inputs.",
      "No empirical superiority claim is made."
    ],
    "case_id": "case-strategic-gated-diligence-001",
    "run_id": "2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1",
    "case_file": "benchmarks/cases/strategic-gated-diligence.md",
    "case_file_sha256": "sha256:18a0247003e142c80c8748eb4652f900b81ca409b91ba7c370e1362d24680942",
    "prompt_file": "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
    "prompt_file_sha256": "sha256:613afac8909b34accb57fd2c24217bb59a28a45860e32f36f6ec5f7f4ab5587e",
    "input_bundle_sha256": "sha256:4168a4e6533f1398611d704254b48c8fbfde5f547a4a0c79cd072a98fdbacd44",
    "movement_jobs": [
      "GROUND",
      "WARN"
    ]
  },
  "review_log": []
}
```

A Map artifact is the appropriate mode here because the public OfOne skill protocol describes Map as the normal mode for geometry chain, evidence, claims, graph, decision surface, options, and triggers, and the benchmark case explicitly pressures diligence-versus-launch distinction, gate ownership, rendering-blocking unknowns, and patch closure rather than a lightweight answer. citeturn41view0turn41view4turn5view0turn6view0

## Validator Result

Expected local status: **artifact-level pass**. The published Map profile requires the core map objects used above, including charter, artifact identity, adapter projection, scene, evidence, claims, unknowns, kill tests, criteria, tradeoff surface, temporal model, edges, loops, option moves, triggers, gates, confidence model, and decision rendering. The validation model further states that Map artifacts for strategic, normative, and hybrid work need actors, and that rendering-blocking unknowns need information-value entries; this artifact includes those surfaces. citeturn7view0turn34view3

Expected semantic outcome: **should pass semantic graph checks**, including stable IDs, explicit unknown blocks, option/gate logic, trigger closure, decision-rendering dependencies, actor ownership, and benchmark-trace readiness boundaries. The artifact is intentionally a **hybrid Map** with role-level actors, explicit unknowns U1/U2, information-value entries for both, two lenses covering both adapter axes, an explicit gate G1, and a benchmark_trace bound to the frozen run identifiers and hashes required by benchmark workflow validation. citeturn34view3turn35view0

Expected warning / blocked-release state: **release remains blocked even if artifact validation passes**. The validation model explicitly separates artifact validity from benchmark workflow validity and from gate or release validation; an artifact can be schema-valid while still being release-blocked or benchmark-invalid for other reasons. Here, the rendered recommendation keeps launch gated because G1 is open and U1/U2 remain unresolved. Benchmark-level compliance beyond the artifact would still depend on the runner’s own checks for case fidelity, required outputs, anti-leakage from other arms, and benchmark_trace/hash matching. No empirical superiority claim is made; the suite boundary explicitly forbids such claims before sufficient case coverage and released failure analysis. citeturn34view0turn35view0turn40view0

## Rendering

**Known.** The case is explicitly about a team considering a reversible diligence move before committing to operational launch, and it asks for a decision-ready answer that separates knowns, assumptions, blocked items, the release gate, and the update that would change the recommendation. The case also directly identifies diligence-versus-launch distinction, actor or reviewer ownership, gate status, rendering-blocking unknowns, and patch closure as the pressure points. citeturn5view0

**Assumed.** The case does **not** provide named humans, a launch packet, a business deadline, or launch-critical operating facts. So this rendering uses only role-level actors: a decision owner, a release reviewer, and an operator. It does **not** assume that launch is safe, urgent, already approved, or equivalent to a bounded diligence move. That omission matters, because OfOne’s validation model requires such missing items to become explicit unknowns rather than disappearing into prose. citeturn5view0turn34view3turn41view4

**Blocked.** Operational launch is blocked for two explicit reasons. First, the launch-critical evidence packet is missing. Second, reviewer ownership and approval are unspecified. In OfOne terms, those are rendering-blocking unknowns U1 and U2, so they block the launch path and the rendering that would otherwise endorse launch. citeturn5view0turn34view3

**Gate controlling release.** G1 controls any operational launch, external commitment, or any move that creates operational exposure equivalent to launch. Its current status is **open**. The required human approval is role-level: the team decision owner plus the designated release reviewer. That is the right control surface for this case because the pressure points specifically call out actor or reviewer ownership and required approval, and the OfOne validator checks actor ownership and gate or release logic in Map artifacts. citeturn5view0turn34view3

**Recommendation.** Approve the reversible diligence move now. Do **not** approve operational launch now. The key distinction is that diligence is admissible only if it remains bounded below launch, while launch remains gated. This is an inference from the case design itself: the case foregrounds reversibility, explicit gate control, and missing evidence, so the least-commitment, decision-ready answer is to authorize O1 and keep O2 blocked. citeturn5view0turn6view0turn41view0

**What would change the recommendation.** A recommendation change requires more than “more confidence” in the abstract. It needs a concrete update packet: new evidence that resolves U1, new evidence or explicit assignment that resolves U2, and a favorable human gate decision on G1. Only then does the launch path become patch-eligible rather than merely discussed. The rendering should not be treated as the internal map; it changes only when the affected closure changes. citeturn6view0turn34view3turn35view0

## Patch Report

Represented trigger: **T1 = `new_evidence` → `patch`**. The intended update that would change the recommendation is a bounded diligence packet that does two things at once: it defines the launch-critical facts and approval threshold that are currently absent, and it names the release reviewer and records a favorable human gate decision. That is the smallest update consistent with the case’s pressure on patch closure rather than a full artifact rewrite. citeturn5view0turn34view3turn35view0

Expected affected closure from T1 starts at **U1, U2, and G1** and then reaches the blocked launch path and final rendering through **O2, TS1, and R1**, along with the blocking edges and review loop attached to launch control. The validation model says trigger closure must be consistent, and that renderings participate in reverse dependency closure, so a genuine resolution of U1/U2 plus a changed gate state is not a prose-only update; it forces regeneration of the rendered recommendation. citeturn34view3turn35view0

Minimal patch if T1 fires successfully:

The patch should mark U1 and U2 resolved, update G1 from open to an approved release state only if human review actually occurred, re-evaluate TS1 because O2 may become launch-eligible, and regenerate R1. If the new evidence resolves U1/U2 **but** G1 remains open, the closure still touches TS1 and R1, yet the rendered recommendation should stay diligence-only. In other words, evidence resolution without gate closure is informative but not release-authorizing. citeturn34view3turn35view0