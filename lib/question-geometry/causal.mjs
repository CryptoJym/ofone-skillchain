import { BEDROCK_TYPES, WHY_KINDS, array, jaccard, object } from "./util.mjs";

function graphCycle(nodes, links) {
  const adjacency = new Map(nodes.map((node) => [node.node_id, []]));
  for (const link of links) {
    if (!adjacency.has(link.from_node)) adjacency.set(link.from_node, []);
    adjacency.get(link.from_node).push(link.to_node);
  }
  const visiting = new Set();
  const visited = new Set();
  const path = [];
  function dfs(nodeId) {
    if (visiting.has(nodeId)) {
      const start = path.indexOf(nodeId);
      return [...path.slice(start), nodeId];
    }
    if (visited.has(nodeId)) return null;
    visiting.add(nodeId);
    path.push(nodeId);
    for (const next of adjacency.get(nodeId) || []) {
      const cycle = dfs(next);
      if (cycle) return cycle;
    }
    path.pop();
    visiting.delete(nodeId);
    visited.add(nodeId);
    return null;
  }
  for (const nodeId of adjacency.keys()) {
    const cycle = dfs(nodeId);
    if (cycle) return cycle;
  }
  return null;
}

function pathToBedrock(startId, nodeIndex, adjacency, seen = new Set()) {
  if (seen.has(startId)) return false;
  seen.add(startId);
  const node = nodeIndex.get(startId);
  if (!node) return false;
  if (node.status === "bedrock" && BEDROCK_TYPES.includes(node.bedrock?.type)) return true;
  return (adjacency.get(startId) || []).some((next) =>
    pathToBedrock(next, nodeIndex, adjacency, new Set(seen))
  );
}

export function evaluateCausalDepth(state) {
  const causal = object(state.causal_depth);
  const nodes = array(causal.nodes);
  const links = array(causal.links);
  const targets = array(causal.targets);
  const nodeIndex = new Map(nodes.map((node) => [node.node_id, node]));
  const adjacency = new Map(nodes.map((node) => [node.node_id, []]));
  const findings = [];

  for (const link of links) {
    if (!nodeIndex.has(link.from_node) || !nodeIndex.has(link.to_node)) {
      findings.push({ severity: "error", code: "QG_WHY_LINK_ENDPOINT", object_id: link.link_id, message: "Why link references a missing node." });
      continue;
    }
    adjacency.get(link.from_node).push(link.to_node);
    if (!WHY_KINDS.includes(link.why_kind)) {
      findings.push({ severity: "error", code: "QG_WHY_KIND", object_id: link.link_id, message: "Why link must declare the kind of explanation requested." });
    }
    if (!String(link.contrast || "").trim()) {
      findings.push({ severity: "error", code: "QG_WHY_CONTRAST", object_id: link.link_id, message: "Why traversal must state the contrast: why P rather than Q." });
    }
    if (["cause", "mechanism", "enabling_condition", "constraint"].includes(link.why_kind)
      && !String(link.counterfactual_test || "").trim()
      && !String(link.intervention_test || "").trim()) {
      findings.push({ severity: "error", code: "QG_CAUSAL_TEST", object_id: link.link_id, message: "Causal-depth link requires a counterfactual or intervention test." });
    }
    if (array(link.alternatives_considered).length === 0) {
      findings.push({ severity: "warning", code: "QG_MONO_CAUSAL_RISK", object_id: link.link_id, message: "No alternative contributing cause was considered; the chain may be falsely linear." });
    }
    const from = nodeIndex.get(link.from_node);
    const to = nodeIndex.get(link.to_node);
    if (from && to && jaccard(from.proposition, to.proposition) >= 0.86) {
      findings.push({ severity: "error", code: "QG_TAUTOLOGICAL_WHY", object_id: link.link_id, message: "The purported explanation substantially restates the explanandum." });
    }
  }

  const cycle = graphCycle(nodes, links);
  if (cycle) {
    findings.push({ severity: "error", code: "QG_CAUSAL_CYCLE", object_id: cycle[0], message: `Causal-depth traversal is circular: ${cycle.join(" -> ")}` });
  }

  for (const node of nodes.filter((candidate) => candidate.status === "bedrock")) {
    const bedrock = object(node.bedrock);
    if (!BEDROCK_TYPES.includes(bedrock.type)) {
      findings.push({ severity: "error", code: "QG_BEDROCK_TYPE", object_id: node.node_id, message: "Bedrock node uses an unsupported termination type." });
    }
    if (bedrock.frame_relative !== true) {
      findings.push({ severity: "error", code: "QG_BEDROCK_FRAME", object_id: node.node_id, message: "Bedrock must be explicitly frame-relative, never asserted as final metaphysical bedrock." });
    }
    if (!String(bedrock.justification || "").trim()) {
      findings.push({ severity: "error", code: "QG_BEDROCK_JUSTIFICATION", object_id: node.node_id, message: "Bedrock requires a justification for stopping causal descent in this frame." });
    }
    if (!String(bedrock.reopen_condition || "").trim()) {
      findings.push({ severity: "error", code: "QG_BEDROCK_REOPEN", object_id: node.node_id, message: "Bedrock requires a falsifier or condition that would reopen inquiry." });
    }
  }

  let materialTargets = 0;
  let coveredTargets = 0;
  for (const target of targets) {
    if (target.material === false) continue;
    materialTargets += 1;
    if (pathToBedrock(target.start_node, nodeIndex, adjacency)) coveredTargets += 1;
    else findings.push({ severity: "blocker", code: "QG_CAUSAL_DEPTH_OPEN", object_id: target.target_id, message: "Material causal target has not reached justified frame-relative bedrock." });
  }

  return {
    passed: !findings.some((finding) => finding.severity === "error")
      && (materialTargets === 0 || coveredTargets === materialTargets),
    coverage: materialTargets === 0 ? 0 : coveredTargets / materialTargets,
    material_targets: materialTargets,
    covered_targets: coveredTargets,
    cycle,
    findings
  };
}
