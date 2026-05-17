# OfOne v0.4 Skill R&D Review

## Judgment and inspection limits

**1. Executive judgment.**  
My overall judgment is **provisionally positive**: OfOne appears coherent as a **typed decision-state IR and toolchain**, not merely a prompting style, because the attached brief describes a frozen inquiry IR, profile-dispatched schemas, a two-layer validation stack, dependency closure, renderer, patch analyzer, regression fixtures, and a benchmark scaffold. Those are compiler-like and provenance-like system features, not just prompt-writing conventions. That said, my confidence is **medium, not high**, because I could not directly inspect the public GitHub repo or live docs in this session; repo-specific conclusions therefore rest on the attached brief plus external comparisons, not on direct code review. fileciteturn0file0 citeturn11view0turn11view1turn35view0turn23view0

**Evidence labels used in this report.**  
**Source-backed** means supported by external standards, official docs, or primary papers. **Brief-reported repo fact** means reported in the attached context brief. **Repo-observed fact** means directly inspected in the public repo or docs during this session; for this run, **there are effectively no repo-observed facts**, because the public repo/docs could not be fetched. **Inference** means a recommendation or conclusion drawn from source-backed material and/or the brief. **Open gap** means a claim that should be locally validated before being treated as settled. fileciteturn0file0 citeturn11view0turn11view1turn15view0turn1view3

**2. What I could and could not inspect.**  
I **could read the attached file** `ofone-v04-context-brief.md`, and it was the main repo-proximate source available in this session. I found **no relevant connected context sources available** through the connector surface in this run. I **could not directly read** the public repo URL, the live docs URL, the commit-specific archive, or a raw `SKILL.md` file from GitHub: those fetches failed in-session, so I could not verify the current public code or docs line-by-line. I also **cannot verify the client-visible launch label/model name from inside the session**, so the “GPT 5.5 Pro” expectation should be treated as an unverified session assumption, not a confirmed fact. fileciteturn0file0 citeturn11view0turn11view1turn15view0turn1view3

Because of that inspection limit, every repo-specific statement below is explicitly framed as either a **brief-reported repo fact** or an **inference**. Where the brief claims that v0.4 includes `artifact_identity`, `criteria`, `tradeoff_surface`, `actors`, `temporal_model`, `information_value`, `lenses`, `council_result`, `review_log`, Ajv-backed schema validation, semantic graph checks, a renderer, a patch analyzer, examples, negative fixtures, and a benchmark scaffold, I treat those as **brief-reported repo facts needing local validation against the actual repository**. fileciteturn0file0

## Architecture assessment

**3. Architecture assessment.**  
**Brief-reported repo fact:** the v0.4 shape described in the brief is much closer to a real IR/toolchain than to a prompt recipe. Freezing a core IR, adding lifecycle objects, using schemas plus semantic checks, and supporting render/patch/test steps implies a system that treats the artifact as the durable state and inference as a transformation pipeline. **Inference:** that is enough to call OfOne a **typed decision-state IR with compiler aspirations**, provided the repo actually enforces those contracts as the brief claims. fileciteturn0file0

**Source-backed comparison to compiler and IR design:** MLIR describes an IR as a graph-like typed structure with multiple equivalent forms, explicit verification constraints, extensible operations, and pass pipelines that can transform or reject invalid state. It also emphasizes human-readable text, in-memory representation, and serialized form all sharing the same semantics, plus pass failure on broken invariants. OfOne’s reported combination of schemas, semantic validation, renderer, and patch analyzer lines up strongly with that pattern. **Inference:** the best mental model for OfOne is not “prompting framework,” but “domain IR + validation passes + renderers + patch workflow.” citeturn35view0turn36view2

**Source-backed comparison to provenance and auditability:** W3C PROV centers provenance on entities, activities, and agents, with explicit support for identification, derivation, versioning, reproducibility, constraints, and validator-oriented rules. OfOne’s reported `artifact_identity`, `actors`, `review_log`, evidence handling, and dependency tracking are strongly aligned with that family of concerns. **Inference:** OfOne’s most durable architectural instinct is that a decision artifact should be inspectable the way provenance is inspectable: who changed what, based on which evidence, under which constraints, and with what review state. citeturn23view0

**Source-backed comparison to decision analysis and evidence-to-decision frameworks:** GRADE explicitly requires outcome-level certainty judgments, evidence tables, explicit criteria, documented judgments, balance of desirable and undesirable effects, and recommendation strength/direction. Influence diagrams formalize alternatives, information, and preferences, and recent work on value of information in influence diagrams shows that VoI is not an incidental extra but a structurally important property of decision models. **Inference:** OfOne’s reported `criteria`, `tradeoff_surface`, `information_value`, `lenses`, and `council_result` are pointing in the right direction: toward a typed deliberation substrate rather than a free-form note-taking system. citeturn54view0turn37search4turn44view0

**Source-backed comparison to causal and argument structures:** DAG-based causal models are useful because their relations have clear semantics: d-separation, conditional-independence implications, and identifiable path structure. AIF-style argument representations, by contrast, distinguish information, inference, conflict, and preference nodes. **Inference:** OfOne’s current concept set is promising, but it will only stay coherent if it sharply distinguishes at least four relation families in the validator and renderer: **causal**, **evidential**, **argumentative** (support/attack/preference), and **workflow/state** relations. If those remain conflated under generic edges, the system will drift from “typed IR” toward “JSON-shaped rhetoric.” citeturn47view0turn46view0

The strongest architecture decisions, based on the brief, are these. First, **freezing the core inquiry IR before adding lifecycle objects** is the right anti-sprawl move. Second, **separating JSON Schema validation from semantic graph validation** is correct, because structural validation and graph/global invariants are different jobs. Third, **adapter contracts** are a good way to project domain language onto a stable substrate rather than baking every domain concept into the core. Fourth, **negative fixtures plus a regression harness** signal seriousness about failure modes. Fifth, **renderer plus patch analyzer** shows an understanding that decisions are revised over time, not merely generated once. All five are strong signals of architectural maturity if the code matches the brief. fileciteturn0file0

The highest-risk weaknesses are also clear. The first is **ontology sprawl**: if every recurring analytic pattern becomes a first-class object, the substrate will lose clarity and validator burden will explode. A lightweight, “just enough” ontology discipline is generally healthier than premature universalization. The second is **hidden semantics in validators**: if critical meaning lives only in semantic checks and not in the visible schema/docs, adoption and debugging will suffer. The third is **relation-semantic blur**: causal, evidential, normative, and procedural edges obey different logic. The fourth is **JSON-first ergonomics**: if authoring and review stay JSON-centric, the system will feel clerical rather than decision-native. The fifth is **benchmark confounding**: without controlled baselines, any apparent gain may come from “more prompting effort,” not from the IR itself. citeturn49view0turn52view0turn42view0turn47view0turn45view0turn43view0

## Skill, schema, and renderer assessment

**4. Skill execution assessment.**  
**Open gap:** I could not directly inspect `SKILL.md`, so the recommendations here are **inferences** from the brief plus benchmarking literature. The brief says `SKILL.md` is the agent protocol. If that skill is meant to make OfOne execute well in an agentic coding/research workflow, it should behave less like a prose recipe and more like a deterministic compile loop: **ingest → choose adapter → draft IR skeleton → attach evidence/claims/unknowns → run schema validation → run semantic validation → render decision views → patch minimally on failure → only then emit narrative prose**. That kind of artifact-first discipline is exactly what makes structured evaluation more reliable than a single static prompt, and it matches how IRs and pass pipelines are typically made dependable. fileciteturn0file0 citeturn45view0turn35view0turn36view2

I would improve `SKILL.md` in six concrete ways. First, make the **artifact the source of truth** and prose a derived rendering. Second, require the agent to explicitly label every assertion as **evidence**, **claim**, **unknown**, **assumption**, or **decision state**. Third, add a **blocked-output rule**: if an unknown blocks a required decision surface, the skill must emit an `information_value` item and mark the artifact partial rather than hallucinating closure. Fourth, add **minimal-patch behavior** for updates, so revisions target only impacted subgraphs and review state. Fifth, require **explicit adapter selection and rejection reasons**, because adapter drift is otherwise hard to debug. Sixth, log **benchmark-relevant traces** such as validation outcomes, failure codes, and patch counts so the skill itself can be evaluated as a system component. Those changes are inference-driven, but they are strongly supported by structured evaluation work showing that prompt choice materially changes benchmark outcomes and by IR design patterns that emphasize explicit invariants and pass failures. citeturn45view0turn43view0turn36view2

**5. Schema and validator assessment.**  
**Source-backed:** JSON Schema Draft 2020-12 provides useful features for serious schema work, including `$dynamicRef` / `$dynamicAnchor`, `prefixItems`, and vocabulary separation. Ajv explicitly recommends strict mode because JSON Schema is permissive and can quietly ignore mistakes; Ajv also supports `unevaluatedProperties`, draft-specific instances, and standalone code generation. At the same time, JSON Schema instance validation is not the same thing as proving broader type-safety or graph correctness; complementary checks are still needed. **Inference:** OfOne’s reported split between schema validation and semantic graph checks is the right structure, but the schema layer should probably be tightened further. citeturn33view0turn34view0turn34view1turn34view3turn34view5turn52view0

I would improve the schemas in these ways. Adopt **a single explicit schema draft**, ideally 2020-12 if not already used, and avoid mixing drafts in one Ajv instance because Ajv treats 2020-12 as a separate, non-backwards-compatible mode. Use `$id` and schema versioning consistently. Use `unevaluatedProperties: false` on document regions that should be closed-world, especially around lifecycle objects whose silent drift would be dangerous. Add `dependentRequired` / `dependentSchemas` rules for fields that only make sense together. Separate reusable common definitions from profile-specific overlays so Micro, Map, and Audit can be checked for subschema compatibility over time. Generate standalone validators at build time for speed, portability, and reproducibility in CI. citeturn34view3turn34view5turn50view0turn52view0

I would improve the semantic validator even more aggressively. The validator should emit **stable machine-readable error codes**, severities, and suggested repairs, not just failures. It should enforce a **typed relation vocabulary** and legal source-target pairs by edge kind. It should distinguish **epistemic unknowns** from **access problems**, **measurement uncertainty**, **temporal staleness**, and **normative disagreement**, because those block different downstream actions. It should also check for disconnected or orphaned subgraphs, dead triggers, stale evidence windows, review-state inconsistencies, and semantic hash instability across non-meaningful reorderings. If the graph semantics continue to grow, exporting a graph-native validation view to **SHACL or an equivalent graph-constraint layer** would be principled, because SHACL is specifically designed for validating graph structures with targeted constraints and validation reports. citeturn42view0turn23view0turn35view0

**6. Renderer and patch assessment.**  
**Brief-reported repo fact:** OfOne already has a renderer and a dependency-closure patch analyzer. **Inference:** that is a powerful foundation, but the system will remain “JSON-centric” unless the renderer becomes the primary human interface and the JSON becomes mostly an interchange/storage format. MLIR is a useful analogy here: it treats human-readable text, in-memory IR, and serialized form as equivalent semantic surfaces, with reliable round-tripping. OfOne should aim for the same. fileciteturn0file0 citeturn35view0

The renderer should therefore become **decision-native**, not field-native. It should render at least four first-class views: an **executive decision brief**; an **analyst map** showing options, criteria, evidence, blockers, and tradeoffs; an **audit view** showing provenance, review state, and reasons for approval/rejection; and a **patch-impact view** showing what changed, what is invalidated, what needs re-review, and what new unknowns were introduced. A renderer that mostly mirrors JSON keys will undercut adoption; a renderer that narrates the live decision state will make the IR usable. citeturn35view0turn54view0

The patch workflow should move from “JSON diff with dependency closure” to **semantic diffs with decision consequences**. In practice that means patch operations like “add supporting evidence,” “downgrade confidence,” “invalidate criterion score,” “open gate,” “trigger re-review,” or “supersede artifact identity,” with the analyzer computing the impacted subgraph and the required review path. MLIR’s pass failure model is a good analogy: a patch should either preserve invariants, trigger bounded recomputation, or fail with explicit diagnostics. citeturn36view2turn35view1

## Research-lens recommendation and empirical validation

**7. Research-lens integration recommendation.**  
My recommendation is to **keep cross-surface research and cross-domain transfer out of the core IR in v0.5**, represented through existing objects such as subscenes, evidence, claims, unknowns, information value, lenses, council results, triggers, and renderings, exactly as the brief’s local proposal suggests. That is the more principled move unless you can show that “research lens” has its own unique invariants, lifecycle, and queries that the existing objects cannot express cleanly. A lightweight ontology discipline is generally more robust than premature reification, and provenance-oriented models already provide a rich way to represent activities, entities, agents, derivations, and review without multiplying core concepts. fileciteturn0file0 citeturn49view0turn23view0

The rule for future promotion should be strict. A concept deserves first-class status only if it brings at least one of these: **non-derivable invariants**, **distinct state transitions**, **dedicated validation logic**, **dedicated renderer affordances**, or **benchmark-proven usability/accuracy gains**. If “research lens” is just a recurring compound of existing objects, keep it as a **template, macro, or higher-order pattern**, not a core ontology element. That avoids sprawl while still giving users a convenient repeated structure. This is an inference, but it is the most defensible one. citeturn49view0turn35view0

**8. Benchmark and empirical validation plan.**  
There is **no source-backed basis yet to claim that OfOne beats direct answers or simpler structured prompts**. The brief says there is a benchmark scaffold and rubric, but no empirical results were provided to me, and I could not directly inspect benchmark code or outputs. So the right conclusion today is: **promising architecture, unproven advantage**. fileciteturn0file0

The next benchmark should be a **three-arm controlled comparison**. Arm A: direct answer with normal citations. Arm B: a lighter structured baseline, such as a compact decision checklist or simple JSON schema. Arm C: full OfOne skillchain. Use the same underlying tasks across all arms and score them blindly. Task families should cover at least strategic, scientific, formal, normative, and hybrid cases, plus **update tasks** where new evidence arrives after an initial decision, because patchability is one of OfOne’s claimed differentiators. HELM supports using multi-metric, scenario-covering evaluation; Dynabench supports including adversarial or challenge-style cases rather than only static conveniences. citeturn43view0turn43view1

The scorecard should be multi-dimensional. At minimum: **decision quality/correctness against a gold answer or expert panel**, **evidence grounding precision**, **uncertainty calibration**, **trace completeness**, **reviewability/auditability**, **update quality after perturbation**, **cost** in time/tokens, and **inter-run stability**. Do not collapse all of that into one scalar too early. Structured prompting research shows prompt choice alone can materially shift rankings, so the benchmark must control for that and measure whether OfOne’s gains persist under comparable prompt effort. citeturn45view0turn43view0

For statistical reporting, avoid relying on brittle “best of many tries” summaries. Report posterior intervals or another uncertainty-aware comparison method, especially if you use rubric scores or graded outcomes. Recent work argues that posterior-based evaluation is more stable and more decision-useful than naive `pass@k`-style ranking when sample counts are limited. citeturn45view1

A good near-term acceptance bar for “v0.5 is working” would be this: OfOne should beat the lighter baseline on **auditability, update quality, and uncertainty handling** without losing too much on cost, and it should beat direct answers on **decision trace quality** and **post-update consistency**. If it only wins because it is longer or more expensive, that is not yet a compelling architecture result. citeturn43view0turn45view0turn45view1

## Roadmap and concrete backlog

**9. v0.5 roadmap.**  
I would scope v0.5 around five packages only. First, **IR hardening**: tighten relation semantics, evidence-state semantics, state transitions, and artifact identity rules. Second, **skill hardening**: make the compile/validate/patch loop explicit and benchmarkable. Third, **decision-native rendering**: make human use center on views, not raw JSON. Fourth, **validator hardening**: improve diagnostics, compatibility testing, and graph checks. Fifth, **empirical validation**: run the benchmark described above and publish failures, not just successes. That is enough to make the project substantially stronger without into-theory-forever expansion. fileciteturn0file0 citeturn34view0turn42view0turn45view0turn49view0

I would **explicitly defer** the following to avoid ontology sprawl: first-class research objects; a full graph database or RDF-native core; automated criterion weighting or utility theory engines; additional adapter proliferation unless benchmark-justified; and any new ontology object whose only justification is “we keep talking about it.” Defer anything that lacks clear invariants, validator rules, and benchmark evidence. citeturn49view0turn23view0

**10. Concrete repo-change backlog.**  
The file targets below are drawn from the attached brief’s toolchain listing and should be read as **inferred targets needing local validation** before implementation planning. fileciteturn0file0

**`SKILL.md`** — Rewrite the protocol around an artifact-first compile loop.  
**Acceptance criteria:** every run explicitly emits adapter choice, claims/evidence/unknowns, validation state, and patch state; blocked decisions create `information_value` items rather than fabricated closure.  
**Suggested tests:** golden-path task, missing-evidence task, conflicting-evidence task, and minimal-patch update task.  
**Label:** Inference. citeturn45view0turn43view0

**`schemas/*.json`** — Standardize on an explicit draft, aggressively close unintended schema surface, and encode dependent-field logic.  
**Acceptance criteria:** all schemas declare `$schema` and `$id`; closed-world regions use `unevaluatedProperties: false`; compatibility checks exist between Micro/Map/Audit profiles.  
**Suggested tests:** schema compilation in strict mode, subschema compatibility tests, and fixtures that inject unknown extra fields or missing dependent fields.  
**Label:** Inference. citeturn33view0turn34view0turn34view5turn52view0

**`scripts/ofone-validate.mjs`** — Upgrade diagnostics from boolean-ish failure to machine-readable semantic reports.  
**Acceptance criteria:** stable error codes, severities, repair hints, impacted objects, and draft/version metadata in validator output.  
**Suggested tests:** snapshot expected diagnostics for every negative fixture; mutation tests that verify the validator fails for the right reason.  
**Label:** Inference. citeturn42view0turn36view2

**`lib/ofone-graph.mjs`** — Make relation typing explicit and compute impacted subgraphs for patches.  
**Acceptance criteria:** every edge has a declared semantic family; closure analysis can return “affected nodes / affected gates / required re-reviews.”  
**Suggested tests:** disconnected graph detection, dead-trigger detection, stale-evidence-window detection, and impact analysis on partial edits.  
**Label:** Inference. citeturn47view0turn44view0

**`lib/adapter-contracts.mjs`** — Narrow adapter semantics and require explicit rejection reasons.  
**Acceptance criteria:** each adapter has documented invariants, forbidden moves, and fallback behavior; hybrid/provisional behavior is explicit rather than catch-all.  
**Suggested tests:** one positive and one negative fixture per adapter, plus ambiguity tests where two adapters could plausibly apply.  
**Label:** Inference. fileciteturn0file0

**`scripts/ofone-render.mjs`** — Promote renderer output from key-value formatting to decision-native views.  
**Acceptance criteria:** executive, analyst, audit, and patch-impact views exist; renderings round-trip to stable object identities; human review can be done without raw JSON.  
**Suggested tests:** golden render snapshots, semantic-diff snapshots, and idempotent render/parse/render tests if a textual syntax is introduced.  
**Label:** Inference. citeturn35view0turn54view0

**`scripts/ofone-patch.mjs`** — Add semantic patch operations and re-review triggers.  
**Acceptance criteria:** patches can report not just changed fields but changed decision meaning; patch output includes invalidated claims, downgraded evidence confidence, reopened gates, and required approvals.  
**Suggested tests:** evidence supersession, criterion-weight change, actor reassignment, and trigger activation/deactivation scenarios.  
**Label:** Inference. citeturn36view2turn35view1

**`scripts/ofone-test.mjs`, `examples/*.json`, and `benchmarks/`** — Turn the scaffold into a publishable evaluation suite.  
**Acceptance criteria:** the benchmark supports the three-arm comparison, update tasks, multi-metric rubric scoring, cost measurement, and uncertainty-aware reporting.  
**Suggested tests:** direct-answer baseline runs, light-structure baseline runs, OfOne runs, plus rater-blind scoring harnesses and confidence-interval reporting.  
**Label:** Inference. fileciteturn0file0 citeturn43view0turn43view1turn45view0turn45view1

## Source register and local-validation gaps

**11. Source register with direct URLs.**  
The following direct URLs were either successfully inspected in this session or are the repo/doc URLs that were requested but not retrievable here.

```text
Attached brief used as repo-proximate source:
conversation attachment: ofone-v04-context-brief.md

Repo/doc URLs referenced but not retrievable in this session:
https://github.com/CryptoJym/ofone-skillchain
https://cryptojym.github.io/ofone-skillchain/
https://github.com/CryptoJym/ofone-skillchain/archive/5065da3808475f77cf242802fcdccc68c616d0ea.zip
https://raw.githubusercontent.com/CryptoJym/ofone-skillchain/5065da3808475f77cf242802fcdccc68c616d0ea/SKILL.md

Sources successfully inspected:
https://www.w3.org/TR/prov-overview/
https://json-schema.org/draft/2020-12
https://json-schema.org/learn/getting-started-step-by-step
https://ajv.js.org/strict-mode.html
https://ajv.js.org/json-schema.html
https://ajv.js.org/standalone.html
https://mlir.llvm.org/docs/LangRef/
https://mlir.llvm.org/docs/PassManagement/
https://mlir.llvm.org/docs/PatternRewriter/
https://www.w3.org/TR/shacl/
https://www.gradeworkinggroup.org/
https://arxiv.org/abs/2211.09110
https://arxiv.org/abs/2104.14337
https://arxiv.org/abs/2511.20836
https://arxiv.org/abs/2510.04265
https://arxiv.org/abs/2202.11629
https://arxiv.org/abs/1508.04633
https://arxiv.org/abs/1304.2355
https://arxiv.org/abs/1911.12651
https://arxiv.org/abs/1108.1488
https://en.wikipedia.org/wiki/Argument_Interchange_Format
https://en.wikipedia.org/wiki/Influence_diagram
```

**12. Open questions and claims needing local validation.**  
The following claims remain open or only partially supported because I could not directly inspect the public repo or live docs. The brief reports them, but they should be validated locally before they are treated as settled repo facts: the exact contents of `SKILL.md`; the exact schema draft/version used by the repo; the exact relation vocabulary and semantic-validator rule set; the actual implementation of `artifact_identity` hashing and whether it uses canonical serialization; the exact negative fixtures present; the exact behavior of renderer and patch analyzer; the exact contents of the benchmark scaffold and rubric; whether commit `5065da3808475f77cf242802fcdccc68c616d0ea` is the intended v0.4 public state; and whether the GitHub Pages site mirrors that same commit. Those are the main places where this report’s confidence is constrained by tooling access rather than by the architectural idea itself. fileciteturn0file0 citeturn11view0turn11view1turn15view0turn1view3