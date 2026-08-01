import { BEDROCK_TYPES, WHY_KINDS, array, isSubstantive, jaccard, object } from "./util.mjs";

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

function pathToBedrock(startId, nodeIndex, supportedAdjacency, seen = new Set()) {
  if (seen.has(startId)) return false;
  seen.add(startId);
  const node = nodeIndex.get(startId);
  if (!node) return false;
  if (node.status === "bedrock" && BEDROCK_TYPES.includes(node.bedrock?.type)) return true;
  return (supportedAdjacency.get(startId) || []).some((next) =>
    pathToBedrock(next, nodeIndex, supportedAdjacency, new Set(seen))
  );
}

function duplicateFindings(items, idField, code, label) {
  const findings = [];
  const seen = new Set();
  for (const item of items) {
    const id = item?.[idField];
    if (!String(id || "").trim()) {
      findings.push({ severity: "error", code, object_id: null, message: `${label} requires ${idField}.` });
    } else if (seen.has(id)) {
      findings.push({ severity: "error", code, object_id: id, message: `Duplicate ${label} ID.` });
    }
    seen.add(id);
  }
  return findings;
}

export function evaluateCausalDepth(state) {
  const causal = object(state.causal_depth);
  const nodes = array(causal.nodes);
  const links = array(causal.links);
  const targets = array(causal.targets);
  const findings = [
    ...duplicateFindings(nodes, "node_id", "QG_CAUSAL_NODE_ID", "causal node"),
    ...duplicateFindings(links, "link_id", "QG_CAUSAL_LINK_ID", "causal link"),
    ...duplicateFindings(targets, "target_id", "QG_CAUSAL_TARGET_ID", "causal target")
  ];
  const nodeIndex = new Map(nodes.map((node) => [node.node_id, node]));
  const supportedAdjacency = new Map(nodes.map((node) => [node.node_id, []]));
  const activeLinks = links.filter((link) => link.status !== "rejected");

  for (const link of links) {
    if (!nodeIndex.has(link.from_node) || !nodeIndex.has(link.to_node)) {
      findings.push({ severity: "error", code: "QG_WHY_LINK_ENDPOINT", object_id: link.link_id, message: "Why link references a missing node." });
      continue;
    }
    if (link.status === "supported") supportedAdjacency.get(link.from_node).push(link.to_node);
    if (!WHY_KINDS.includes(link.why_kind)) {
      findings.push({ severity: "error", code: "QG_WHY_KIND", object_id: link.link_id, message: "Why link must declare the kind of explanation requested." });
    }
    if (!isSubstantive(link.contrast, 8)) {
      findings.push({ severity: "error", code: "QG_WHY_CONTRAST", object_id: link.link_id, message: "Why traversal must state a substantive contrast: why P rather than Q." });
    }
    if (["cause", "mechanism", "enabling_condition", "constraint"].includes(link.why_kind)
      && !isSubstantive(link.counterfactual_test, 8)
      && !isSubstantive(link.intervention_test, 8)) {
      findings.push({ severity: "error", code: "QG_CAUSAL_TEST", object_id: link.link_id, message: "Causal-depth link requires a substantive counterfactual or intervention test." });
    }
    if (array(link.alternatives_considered).length === 0
      || !array(link.alternatives_considered).every((alternative) => isSubstantive(alternative, 3))) {
      findings.push({ severity: "warning", code: "QG_MONO_CAUSAL_RISK", object_id: link.link_id, message: "No substantive alternative contributing cause was considered; the chain may be falsely linear." });
    }
    if (link.status === "supported" && array(link.evidence_refs).length === 0) {
      findings.push({ severity: "error", code: "QG_CAUSAL_SUPPORT_EVIDENCE", object_id: link.link_id, message: "Supported causal-depth link requires evidence references." });
    }
    const from = nodeIndex.get(link.from_node);
    const to = nodeIndex.get(link.to_node);
    if (from && to && jaccard(from.proposition, to.proposition) >= 0.86) {
      findings.push({ severity: "error", code: "QG_TAUTOLOGICAL_WHY", object_id: link.link_id, message: "The purported explanation substantially restates the explanandum." });
    }
  }

  const cycle = graphCycle(nodes, activeLinks);
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
    if (!isSubstantive(bedrock.justification, 24)) {
      findings.push({ severity: "error", code: "QG_BEDROCK_JUSTIFICATION", object_id: node.node_id, message: "Bedrock requires a substantive justification for stopping causal descent in this frame." });
    }
    if (!isSubstantive(bedrock.reopen_condition, 12)) {
      findings.push({ severity: "error", code: "QG_BEDROCK_REOPEN", object_id: node.node_id, message: "Bedrock requires a substantive falsifier or condition that would reopen inquiry." });
    }
    if (array(node.evidence_refs).length === 0) {
      findings.push({ severity: "error", code: "QG_BEDROCK_EVIDENCE", object_id: node.node_id, message: "Bedrock requires evidence references or a formal basis represented as evidence." });
    }
  }

  let materialTargets = 0;
  let coveredTargets = 0;
  for (const target of targets) {
    if (target.material === false) continue;
    materialTargets += 1;
    if (!nodeIndex.has(target.start_node)) {
      findings.push({ severity: "error", code: "QG_CAUSAL_TARGET_START", object_id: target.target_id, message: "Material causal target references a missing start node." });
      continue;
    }
    if (pathToBedrock(target.start_node, nodeIndex, supportedAdjacency)) coveredTargets += 1;
    else findings.push({ severity: "blocker", code: "QG_CAUSAL_DEPTH_OPEN", object_id: target.target_id, message: "Material causal target has not reached justified frame-relative bedrock through supported explanatory links." });
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
