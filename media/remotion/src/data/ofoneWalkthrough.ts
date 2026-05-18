export type WalkthroughCue = {
  id: string;
  title: string;
  subtitle: string;
  narration: string;
  startFrame: number;
  durationFrames: number;
  tone: "teal" | "blue" | "amber" | "green" | "rose";
  artifacts: string[];
  movement: string;
};

export const walkthroughCues: WalkthroughCue[] = [
  {
    id: "01",
    title: "Objective Enters",
    subtitle: "A messy request becomes a bounded charter.",
    narration: "OfOne starts with a bounded objective. The question is not answered yet. It is chartered.",
    startFrame: 0,
    durationFrames: 360,
    tone: "teal",
    artifacts: ["objective", "scope", "stakes", "charter"],
    movement: "raw text -> charter"
  },
  {
    id: "02",
    title: "Geometry Kernel",
    subtitle: "The inquiry gets a portable base layer.",
    narration: "Scenes, frames, tokens, moves, edges, loops, invariants, and gates become the primitive geometry.",
    startFrame: 360,
    durationFrames: 360,
    tone: "blue",
    artifacts: ["scene", "frame", "token", "move", "edge", "loop", "gate"],
    movement: "charter -> geometry"
  },
  {
    id: "03",
    title: "Adapter Projection",
    subtitle: "Domain language maps into the same object grammar.",
    narration: "Adapters keep domain semantics intact while projecting strategy, science, proof search, or policy into the same map language.",
    startFrame: 720,
    durationFrames: 360,
    tone: "amber",
    artifacts: ["strategic", "scientific", "formal", "normative", "hybrid"],
    movement: "domain terms -> typed objects"
  },
  {
    id: "04",
    title: "Evidence Ledger",
    subtitle: "Evidence is logged before claims are trusted.",
    narration: "Evidence is not a claim. Sources carry identity, provenance, recency, excerpts, permissions, and risk.",
    startFrame: 1080,
    durationFrames: 360,
    tone: "green",
    artifacts: ["source", "content hash", "retrieved at", "extract", "risk"],
    movement: "source -> evidence"
  },
  {
    id: "05",
    title: "Claim Graph",
    subtitle: "Claims become atomic and dependency-aware.",
    narration: "Each claim shows support, contradiction, confidence basis, dependencies, and what would break it.",
    startFrame: 1440,
    durationFrames: 360,
    tone: "blue",
    artifacts: ["claim", "support", "contradiction", "confidence", "status"],
    movement: "interpretation -> claim graph"
  },
  {
    id: "06",
    title: "Loops And Gates",
    subtitle: "Dynamics and review blocks become explicit.",
    narration: "OfOne names feedback, incentives, measurement, review, deception, and regime shifts, then blocks unsafe movement with gates.",
    startFrame: 1800,
    durationFrames: 360,
    tone: "amber",
    artifacts: ["feedback loop", "temporal model", "review gate", "approval"],
    movement: "dynamics -> blocked or allowed moves"
  },
  {
    id: "07",
    title: "Validator",
    subtitle: "Malformed state is rejected before release.",
    narration: "Schema checks run first. Semantic graph checks follow. Unsupported or unsafe state cannot masquerade as a final decision.",
    startFrame: 2160,
    durationFrames: 360,
    tone: "rose",
    artifacts: ["schema", "edge legality", "adapter contract", "diagnostic"],
    movement: "graph -> validation result"
  },
  {
    id: "08",
    title: "Rendering",
    subtitle: "The answer is a projection of the map.",
    narration: "The user sees a decision, confidence, why, blocking unknowns, gates, triggers, and evidence identity.",
    startFrame: 2520,
    durationFrames: 360,
    tone: "green",
    artifacts: ["executive", "analyst", "audit", "patch impact"],
    movement: "valid graph -> audience view"
  },
  {
    id: "09",
    title: "Patch Closure",
    subtitle: "New evidence updates affected dependencies.",
    narration: "When evidence changes, OfOne follows dependency closure instead of rewriting the whole answer blindly.",
    startFrame: 2880,
    durationFrames: 360,
    tone: "blue",
    artifacts: ["trigger", "closure", "patch", "rendering impact"],
    movement: "changed object -> affected subgraph"
  },
  {
    id: "10",
    title: "Benchmark Boundary",
    subtitle: "Claims of superiority wait for controlled evidence.",
    narration: "The system can be useful before it is proven superior. Superiority claims wait for benchmark comparison.",
    startFrame: 3240,
    durationFrames: 360,
    tone: "teal",
    artifacts: ["benchmark", "review", "claim boundary", "next mode"],
    movement: "artifact -> empirical comparison"
  }
];

export const toneColors = {
  teal: "#0f766e",
  blue: "#1d4ed8",
  amber: "#b45309",
  green: "#15803d",
  rose: "#b91c1c"
} satisfies Record<WalkthroughCue["tone"], string>;

