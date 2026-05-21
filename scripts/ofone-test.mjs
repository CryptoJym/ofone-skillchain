#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const fixturesPath = path.join(repoRoot, "tests", "invalid", "fixtures.json");
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"));
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ofone-invalid-"));
const spawnMaxBuffer = 20 * 1024 * 1024;
let failures = 0;

try {
  runValidExamples();
  runSchemaCompatibilityCheck();
  runRenderSmokeTests();
  runPatchWorkflowTests();
  runBenchmarkCheck();
  runBenchmarkNegativeChecks();
  runResearchLifecycleCheck();
  runReviewSidecarCheck();
  runToolingContractCheck();
  runInvalidReviewSidecarChecks();
  for (const fixture of fixtures) runInvalidFixture(fixture);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n${failures} validator regression test(s) failed`);
  process.exit(1);
}

console.log("\nAll validator regression tests passed");

function runValidExamples() {
  const examples = fs.readdirSync(path.join(repoRoot, "examples"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join("examples", file));
  const result = spawnSync(process.execPath, ["scripts/ofone-validate.mjs", ...examples], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    failures += 1;
    console.error("FAIL valid examples should pass");
    console.error(result.stdout);
    console.error(result.stderr);
    return;
  }
  console.log("PASS valid examples");
}

function runSchemaCompatibilityCheck() {
  const result = spawnSync(process.execPath, ["scripts/ofone-schema-check.mjs"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status === 0) {
    console.log("PASS schema compatibility");
    return;
  }
  failures += 1;
  console.error("FAIL schema compatibility");
  console.error(result.stdout);
  console.error(result.stderr);
}

function runRenderSmokeTests() {
  const checks = [
    {
      name: "executive decision brief",
      args: ["scripts/ofone-render.mjs", "examples/strategy-micro.json", "Executive"],
      includes: ["# OfOne Executive Decision Brief", "## Decision", "## What Would Change This"]
    },
    {
      name: "analyst semantic graph grouping",
      args: ["scripts/ofone-render.mjs", "examples/strategy-micro.json", "Analyst"],
      includes: ["# OfOne Analyst Map", "causal edges", "argumentative edges"]
    },
    {
      name: "audit report",
      args: ["scripts/ofone-render.mjs", "examples/hybrid-policy-audit.json", "Audit"],
      includes: ["# OfOne Audit Report", "## Audit Evidence Identity", "## Review Log"]
    },
    {
      name: "patch impact view",
      args: ["scripts/ofone-render.mjs", "examples/strategy-micro.json", "PatchImpact", "X1"],
      includes: ["# OfOne Patch Impact View", "## Affected Semantic Layers", "argumentative"]
    }
  ];

  for (const check of checks) {
    const result = spawnSync(process.execPath, check.args, {
      cwd: repoRoot,
      encoding: "utf8"
    });
    const output = `${result.stdout}\n${result.stderr}`;
    const passed = result.status === 0 && check.includes.every((needle) => output.includes(needle));
    if (passed) {
      console.log(`PASS render ${check.name}`);
      continue;
    }
    failures += 1;
    console.error(`FAIL render ${check.name}`);
    console.error(`expected output containing: ${check.includes.join(", ")}`);
    console.error(output);
  }
}

function runPatchWorkflowTests() {
  const checks = [
    {
      name: "evidence supersession",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "supersede_evidence", "E1"],
      expect: [
        ["operation.operation_id", "supersede_evidence"],
        ["rendering_regeneration_required", true],
        ["invalidated_claims", "C1"],
        ["affected_semantic_layers", "evidential"]
      ]
    },
    {
      name: "criterion invalidation",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "invalidate_criterion", "CR1"],
      expect: [
        ["operation.operation_id", "invalidate_criterion"],
        ["required_revalidation", "decision_surface_check"],
        ["rendering_regeneration_required", true]
      ]
    },
    {
      name: "actor reassignment",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "actor_reassignment", "A1"],
      expect: [
        ["operation.operation_id", "actor_reassignment"],
        ["suggested_transition", "human_review"],
        ["required_approvals.0.gate_id", "G1"]
      ]
    },
    {
      name: "trigger activation",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "trigger_activation", "T1"],
      expect: [
        ["operation.operation_id", "trigger_activation"],
        ["trigger_expansion.0.affected_objects", "E1"],
        ["affected_by_type.evidence", "E1"],
        ["invalidated_claims", "C1"],
        ["required_revalidation", "trigger_transition_check"],
        ["rendering_regeneration_required", true]
      ]
    },
    {
      name: "trigger scoped rerun",
      args: ["scripts/ofone-patch.mjs", "examples/source-backed-wastewater-map.json", "--operation", "trigger_activation", "T2"],
      expect: [
        ["operation.operation_id", "trigger_activation"],
        ["trigger_expansion.0.transition", "scoped_rerun"],
        ["suggested_transition", "scoped_rerun"],
        ["rendering_regeneration_required", true]
      ]
    },
    {
      name: "trigger deactivation",
      args: ["scripts/ofone-patch.mjs", "examples/strategy-micro.json", "--operation", "trigger_deactivation", "T1"],
      expect: [
        ["operation.operation_id", "trigger_deactivation"],
        ["semantic_patch_operations.0.op", "trigger_deactivation"],
        ["rendering_regeneration_required", true]
      ]
    }
  ];

  for (const check of checks) {
    const result = spawnSync(process.execPath, check.args, {
      cwd: repoRoot,
      encoding: "utf8"
    });
    const output = `${result.stdout}\n${result.stderr}`;
    const parsed = parseJson(result.stdout);
    const passed = result.status === 0 && check.expect.every(([path, expected]) => valueMatches(getPath(parsed, path), expected));
    if (passed) {
      console.log(`PASS patch ${check.name}`);
      continue;
    }
    failures += 1;
    console.error(`FAIL patch ${check.name}`);
    console.error(`expected JSON paths: ${check.expect.map(([path, expected]) => `${path}=${expected}`).join(", ")}`);
    console.error(output);
  }
}

function runBenchmarkCheck() {
  const result = spawnSync(process.execPath, ["scripts/ofone-benchmark.mjs"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status === 0) {
    console.log("PASS benchmark suite manifest");
    return;
  }
  failures += 1;
  console.error("FAIL benchmark suite manifest");
  console.error(result.stdout);
  console.error(result.stderr);
}

function runBenchmarkNegativeChecks() {
  const checks = [
    {
      name: "missing rerun policy",
      mutate: (root) => {
        const matrix = readBenchmarkMatrix(root);
        delete matrix.rerun_policy;
        writeBenchmarkMatrix(root, matrix);
      },
      expect: "BENCH_BATCH_RERUN_POLICY"
    },
    {
      name: "missing excluded-run rerun plan",
      mutate: (root) => {
        const matrix = readBenchmarkMatrix(root);
        delete matrix.excluded_runs[0].rerun_plan;
        writeBenchmarkMatrix(root, matrix);
      },
      expect: "BENCH_BATCH_RUN_RERUN_PLAN"
    },
    {
      name: "mismatched benchmark trace",
      mutate: (root) => {
        const matrix = readBenchmarkMatrix(root);
        const run = matrix.completed_runs.find((item) => item.arm_id === "full_ofone");
        run.benchmark_trace.case_file_sha256 = "sha256:bad";
        writeBenchmarkMatrix(root, matrix);
      },
      expect: "BENCH_BATCH_RUN_BENCHMARK_TRACE"
    },
    {
      name: "remedial run without excluded original",
      mutate: (root) => {
        const matrix = readBenchmarkMatrix(root);
        matrix.remedial_runs[0].rerun_of = "missing-original-run";
        writeBenchmarkMatrix(root, matrix);
      },
      expect: "BENCH_BATCH_REMEDIAL_RUN_RERUN_OF"
    },
    {
      name: "forged artifact binding",
      mutate: (root) => {
        const matrix = readBenchmarkMatrix(root);
        for (const key of ["completed_runs", "reviewed_runs"]) {
          const run = matrix[key].find((item) => item.arm_id === "full_ofone");
          run.aggregate_eligible = true;
          run.pre_score_compliance.case_fidelity = "pass";
          run.pre_score_compliance.independence = "pass";
          run.pre_score_compliance.auto_reject = false;
          delete run.pre_score_compliance.reject_reason;
        }
        matrix.excluded_runs = [];
        matrix.completion.excluded = 0;
        matrix.completion.aggregate_eligible = 3;
        writeBenchmarkMatrix(root, matrix);

        const artifactPath = path.join(root, "benchmarks", "runs", "2026-05-17-batch-01", "outputs", "2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.artifact.json");
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        artifact.artifact_identity.case_id = "case-strategic-gated-diligence-001";
        artifact.benchmark_trace = {
          case_id: "case-strategic-gated-diligence-001",
          run_id: "2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1",
          case_file: "benchmarks/cases/strategic-gated-diligence.md",
          case_file_sha256: "sha256:bad",
          prompt_file: "benchmarks/runs/2026-05-17-batch-01/prompts/full_ofone.md",
          prompt_file_sha256: "sha256:bad",
          input_bundle_sha256: "sha256:bad"
        };
        fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`);
      },
      expect: "BENCH_BATCH_RUN_CASE_BINDING"
    }
  ];

  for (const check of checks) {
    const root = copyBenchmarkFixtureRoot(check.name);
    check.mutate(root);
    const result = spawnSync(process.execPath, ["scripts/ofone-benchmark.mjs", "--json"], {
      cwd: repoRoot,
      env: { ...process.env, OFONE_BENCHMARK_REPO_ROOT: root },
      encoding: "utf8",
      maxBuffer: spawnMaxBuffer
    });
    const parsed = parseJson(result.stdout || "{}");
    const codes = new Set((parsed.diagnostics || []).map((diagnostic) => diagnostic.code));
    if (result.status !== 0 && codes.has(check.expect)) {
      console.log(`PASS benchmark invalid ${check.name}`);
      continue;
    }
    failures += 1;
    console.error(`FAIL benchmark invalid ${check.name}`);
    console.error(`expected non-zero exit and diagnostic code: ${check.expect}`);
    console.error(`actual diagnostic codes: ${[...codes].join(", ") || "(none)"}`);
    console.error(result.stdout);
    console.error(result.stderr);
  }
}

function copyBenchmarkFixtureRoot(name) {
  const root = fs.mkdtempSync(path.join(tempDir, `benchmark-${name.replaceAll(" ", "-")}-`));
  for (const dir of ["benchmarks", "examples", "research"]) {
    fs.cpSync(path.join(repoRoot, dir), path.join(root, dir), { recursive: true });
  }
  return root;
}

function readBenchmarkMatrix(root) {
  return JSON.parse(fs.readFileSync(benchmarkMatrixPath(root), "utf8"));
}

function writeBenchmarkMatrix(root, matrix) {
  fs.writeFileSync(benchmarkMatrixPath(root), `${JSON.stringify(matrix, null, 2)}\n`);
}

function benchmarkMatrixPath(root) {
  return path.join(root, "benchmarks", "runs", "2026-05-17-batch-01", "execution-matrix.json");
}

function runResearchLifecycleCheck() {
  const result = spawnSync(process.execPath, ["scripts/ofone-research-check.mjs"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status === 0) {
    console.log("PASS research lifecycle");
    return;
  }
  failures += 1;
  console.error("FAIL research lifecycle");
  console.error(result.stdout);
  console.error(result.stderr);
}

function runReviewSidecarCheck() {
  const result = spawnSync(process.execPath, ["scripts/ofone-review-check.mjs", "research/review-sidecars/2026-05-17-03-ofone-v06-recursive-review-sidecar.json"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status === 0) {
    console.log("PASS recursive review sidecar");
    return;
  }
  failures += 1;
  console.error("FAIL recursive review sidecar");
  console.error(result.stdout);
  console.error(result.stderr);
}

function runToolingContractCheck() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  const readme = fs.readFileSync(path.join(repoRoot, "README.md"), "utf8");
  const index = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "benchmarks", "runs", "2026-05-17-batch-01", "manifest.json"), "utf8"));
  const benchmarkScript = fs.readFileSync(path.join(repoRoot, "scripts", "ofone-benchmark.mjs"), "utf8");
  const pagesScript = fs.readFileSync(path.join(repoRoot, "scripts", "ofone-pages-check.mjs"), "utf8");
  const loop = fs.readFileSync(path.join(repoRoot, "research", "recursive-improvement-loop.md"), "utf8");
  const protocol = fs.readFileSync(path.join(repoRoot, "research", "frontier-full-ofone-repair-protocol.md"), "utf8");
  const controlledContract = fs.readFileSync(path.join(repoRoot, "benchmarks", "runs", "2026-05-17-batch-01", "frontier-run-packets", "2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md"), "utf8");
  const regulatedControlledContract = fs.readFileSync(path.join(repoRoot, "benchmarks", "runs", "2026-05-17-batch-01", "frontier-run-packets", "2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md"), "utf8");
  const frontierPacketCheck = spawnSync(process.execPath, [
    "scripts/ofone-frontier-packet-check.mjs",
    "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-rerun4.md"
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const frontierProtocolCheck = spawnSync(process.execPath, ["scripts/ofone-frontier-repair-protocol-check.mjs"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const frontierControlledCheck = spawnSync(process.execPath, ["scripts/ofone-frontier-controlled-contract-check.mjs"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const required = [
    ["package pages script", packageJson.scripts?.["pages:check"] === "node scripts/ofone-pages-check.mjs"],
    ["package frontier packet preflight script", packageJson.scripts?.["frontier:check"] === "node scripts/ofone-frontier-packet-check.mjs"],
    ["package frontier repair protocol script", packageJson.scripts?.["frontier:protocol:check"] === "node scripts/ofone-frontier-repair-protocol-check.mjs"],
    ["package frontier controlled contract script", packageJson.scripts?.["frontier:controlled:check"] === "node scripts/ofone-frontier-controlled-contract-check.mjs"],
    ["frontier packet preflight passes", frontierPacketCheck.status === 0],
    ["frontier repair protocol check passes", frontierProtocolCheck.status === 0],
    ["frontier controlled contract check passes", frontierControlledCheck.status === 0],
    ["frontier packet preflight file", fs.existsSync(path.join(repoRoot, "scripts", "ofone-frontier-packet-check.mjs"))],
    ["frontier repair protocol checker file", fs.existsSync(path.join(repoRoot, "scripts", "ofone-frontier-repair-protocol-check.mjs"))],
    ["frontier controlled contract checker file", fs.existsSync(path.join(repoRoot, "scripts", "ofone-frontier-controlled-contract-check.mjs"))],
    ["frontier repair protocol file", fs.existsSync(path.join(repoRoot, "research", "frontier-full-ofone-repair-protocol.md"))],
    ["frontier controlled contract file", fs.existsSync(path.join(repoRoot, "benchmarks", "runs", "2026-05-17-batch-01", "frontier-run-packets", "2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md"))],
    ["frontier regulated controlled contract file", fs.existsSync(path.join(repoRoot, "benchmarks", "runs", "2026-05-17-batch-01", "frontier-run-packets", "2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md"))],
    ["pages checker file", fs.existsSync(path.join(repoRoot, "scripts", "ofone-pages-check.mjs"))],
    ["pages checker attestation target", pagesScript.includes("benchmarks/results/2026-05-17-batch-01-checker-attestation.json")],
    ["pages checker Run 07 result target", pagesScript.includes("research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md")],
    ["pages checker Run 07 synthesis target", pagesScript.includes("research/results/2026-05-17-07-ofone-post-run06-hardening-review-synthesis.md")],
    ["pages checker remedial artifact target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.artifact.json")],
    ["pages checker remedial review target", pagesScript.includes("batch 01 remedial full review")],
    ["pages checker strategic r2 artifact target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["pages checker strategic r2 review target", pagesScript.includes("batch 01 strategic r2 full review")],
    ["pages checker strategic r3 artifact target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["pages checker strategic r3 review target", pagesScript.includes("batch 01 strategic r3 full review")],
    ["pages checker scientific artifact target", pagesScript.includes("2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["pages checker scientific review target", pagesScript.includes("batch 01 scientific full review")],
    ["pages checker scientific r2 artifact target", pagesScript.includes("2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["pages checker scientific r2 review target", pagesScript.includes("batch 01 scientific r2 full review")],
    ["pages checker scientific r3 artifact target", pagesScript.includes("2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["pages checker scientific r3 review target", pagesScript.includes("batch 01 scientific r3 full review")],
    ["pages checker wastewater artifact target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["pages checker wastewater review target", pagesScript.includes("batch 01 wastewater full review")],
    ["pages checker wastewater r2 artifact target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["pages checker wastewater r2 review target", pagesScript.includes("batch 01 wastewater r2 full review")],
    ["pages checker wastewater r3 artifact target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["pages checker wastewater r3 review target", pagesScript.includes("batch 01 wastewater r3 full review")],
    ["pages checker formal artifact target", pagesScript.includes("2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["pages checker formal review target", pagesScript.includes("batch 01 formal full review")],
    ["pages checker formal r2 artifact target", pagesScript.includes("2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["pages checker formal r2 review target", pagesScript.includes("batch 01 formal r2 full review")],
    ["pages checker formal r3 artifact target", pagesScript.includes("2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["pages checker formal r3 review target", pagesScript.includes("batch 01 formal r3 full review")],
    ["pages checker policy artifact target", pagesScript.includes("2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["pages checker policy review target", pagesScript.includes("batch 01 policy full review")],
    ["pages checker policy r2 artifact target", pagesScript.includes("2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["pages checker policy r2 review target", pagesScript.includes("batch 01 policy r2 full review")],
    ["pages checker policy r3 artifact target", pagesScript.includes("2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["pages checker policy r3 review target", pagesScript.includes("batch 01 policy r3 full review")],
    ["pages checker frontier packet target", pagesScript.includes("2026-05-18-strategic-gated-diligence-frontier-r1.md")],
    ["pages checker frontier direct output target", pagesScript.includes("batch 01 frontier strategic r1 direct output")],
    ["pages checker frontier direct review target", pagesScript.includes("batch 01 frontier strategic r1 direct review")],
    ["pages checker frontier wastewater direct output target", pagesScript.includes("batch 01 frontier wastewater r1 direct output")],
    ["pages checker frontier wastewater direct review target", pagesScript.includes("batch 01 frontier wastewater r1 direct review")],
    ["pages checker object schemas guide target", pagesScript.includes("docs/object-schemas.md")],
    ["pages checker frontier packet checker target", pagesScript.includes("scripts/ofone-frontier-packet-check.mjs")],
    ["pages checker frontier repair protocol checker target", pagesScript.includes("scripts/ofone-frontier-repair-protocol-check.mjs")],
    ["pages checker frontier controlled contract checker target", pagesScript.includes("scripts/ofone-frontier-controlled-contract-check.mjs")],
    ["pages checker frontier repair protocol target", pagesScript.includes("research/frontier-full-ofone-repair-protocol.md")],
    ["pages checker frontier controlled contract target", pagesScript.includes("2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md")],
    ["pages checker frontier regulated controlled contract target", pagesScript.includes("2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md")],
    ["README pages command", readme.includes("npm run pages:check")],
    ["README research command", readme.includes("npm run research:check")],
    ["README review-round version note", readme.includes("Review-round labels such as `v0.7` and `v0.8`")],
    ["README launch-proof boundary", readme.includes("A prepared packet is not a launched run")],
    ["README Chrome extension launch boundary", readme.includes("Deep Research launch and observation must use the Chrome extension/plugin")],
    ["README frontier repair protocol", readme.includes("research/frontier-full-ofone-repair-protocol.md")],
    ["README frontier protocol command", readme.includes("npm run frontier:protocol:check")],
    ["README frontier controlled contract", readme.includes("2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md")],
    ["README frontier regulated controlled contract", readme.includes("2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md")],
    ["README frontier controlled command", readme.includes("npm run frontier:controlled:check")],
    ["README batch 01 plan", readme.includes("benchmarks/runs/2026-05-17-batch-01/manifest.json")],
    ["README batch 01 matrix", readme.includes("benchmarks/runs/2026-05-17-batch-01/execution-matrix.json")],
    ["README remedial rerun artifact", readme.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.artifact.json")],
    ["README strategic r2 artifact", readme.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["README strategic r3 artifact", readme.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["README scientific artifact", readme.includes("2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["README scientific r2 artifact", readme.includes("2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["README scientific r3 artifact", readme.includes("2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["README wastewater artifact", readme.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["README wastewater r2 artifact", readme.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["README wastewater r3 artifact", readme.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["README formal artifact", readme.includes("2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["README formal r2 artifact", readme.includes("2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["README formal r3 artifact", readme.includes("2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["README policy artifact", readme.includes("2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["README policy r2 artifact", readme.includes("2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["README policy r3 artifact", readme.includes("2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["README frontier packet", readme.includes("2026-05-18-strategic-gated-diligence-frontier-r1.md")],
    ["README frontier direct output", readme.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__frontier_reasoning__r1.md")],
    ["README frontier wastewater direct output", readme.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__frontier_reasoning__r1.md")],
    ["README frontier wastewater light output", readme.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__frontier_reasoning__r1.md")],
    ["README frontier wastewater controlled rerun1 artifact", readme.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.artifact.json")],
    ["README frontier remedial rerun3 packet", readme.includes("2026-05-21-strategic-gated-diligence-frontier-full-r1-rerun3.md")],
    ["README frontier remedial rerun4 packet", readme.includes("2026-05-21-strategic-gated-diligence-frontier-full-r1-rerun4.md")],
    ["README frontier remedial rerun4 output", readme.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun4.md")],
    ["README frontier remedial rerun4 review", readme.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun4.md")],
    ["index batch 01 link", index.includes("./benchmarks/runs/2026-05-17-batch-01/manifest.json")],
    ["index batch 01 matrix link", index.includes("./benchmarks/runs/2026-05-17-batch-01/execution-matrix.json")],
    ["index first raw output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md")],
    ["index first review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md")],
    ["index remedial artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.artifact.json")],
    ["index remedial review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.md")],
    ["index strategic r2 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["index strategic r2 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.md")],
    ["index strategic r3 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["index strategic r3 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.md")],
    ["index scientific artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["index scientific review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.md")],
    ["index scientific r2 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["index scientific r2 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.md")],
    ["index scientific r3 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["index scientific r3 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.md")],
    ["index wastewater artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["index wastewater review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.md")],
    ["index wastewater r2 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["index wastewater r2 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.md")],
    ["index wastewater r3 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["index wastewater r3 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.md")],
    ["index formal artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["index formal review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.md")],
    ["index formal r2 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["index formal r2 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.md")],
    ["index formal r3 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["index formal r3 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.md")],
    ["index policy artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.artifact.json")],
    ["index policy review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.md")],
    ["index policy r2 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.artifact.json")],
    ["index policy r2 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.md")],
    ["index policy r3 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.artifact.json")],
    ["index policy r3 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.md")],
    ["index frontier packet link", index.includes("./benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-18-strategic-gated-diligence-frontier-r1.md")],
    ["index frontier wastewater direct output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__frontier_reasoning__r1.md")],
    ["index frontier wastewater direct review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__frontier_reasoning__r1.md")],
    ["index frontier wastewater light output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__frontier_reasoning__r1.md")],
    ["index frontier wastewater light review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__frontier_reasoning__r1.md")],
    ["pages checker frontier remedial packet target", pagesScript.includes("2026-05-20-strategic-gated-diligence-frontier-full-r1-rerun1.md")],
    ["pages checker frontier wastewater light output target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__frontier_reasoning__r1.md")],
    ["pages checker frontier wastewater light review target", pagesScript.includes("2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__frontier_reasoning__r1.md")],
    ["pages checker frontier remedial rerun2 output target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun2.md")],
    ["pages checker frontier remedial rerun2 validator target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun2.validator.json")],
    ["pages checker frontier remedial rerun3 packet target", pagesScript.includes("2026-05-21-strategic-gated-diligence-frontier-full-r1-rerun3.md")],
    ["pages checker frontier remedial rerun4 packet target", pagesScript.includes("2026-05-21-strategic-gated-diligence-frontier-full-r1-rerun4.md")],
    ["pages checker frontier remedial rerun4 output target", pagesScript.includes("benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun4.md")],
    ["pages checker frontier remedial rerun4 review target", pagesScript.includes("benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun4.md")],
    ["pages checker frontier controlled rerun5 output target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.md")],
    ["pages checker frontier controlled rerun5 artifact target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.artifact.json")],
    ["pages checker frontier controlled rerun5 validator target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.validator.json")],
    ["pages checker frontier controlled rerun5 review target", pagesScript.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.md")],
    ["pages checker frontier wastewater controlled rerun1 output target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.md")],
    ["pages checker frontier wastewater controlled rerun1 artifact target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.artifact.json")],
    ["pages checker frontier wastewater controlled rerun1 validator target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.validator.json")],
    ["pages checker frontier wastewater controlled rerun1 review target", pagesScript.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.md")],
    ["index frontier direct output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__frontier_reasoning__r1.md")],
    ["index frontier direct review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__frontier_reasoning__r1.md")],
    ["index frontier remedial rerun2 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun2.artifact.json")],
    ["index frontier remedial rerun2 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun2.md")],
    ["index frontier remedial rerun3 packet link", index.includes("./benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-rerun3.md")],
    ["index frontier remedial rerun4 packet link", index.includes("./benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-rerun4.md")],
    ["index frontier remedial rerun4 output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun4.md")],
    ["index frontier remedial rerun4 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun4.md")],
    ["index frontier controlled rerun5 output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.md")],
    ["index frontier controlled rerun5 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.artifact.json")],
    ["index frontier controlled rerun5 validator link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.validator.json")],
    ["index frontier controlled rerun5 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5.md")],
    ["index frontier wastewater controlled rerun1 output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.md")],
    ["index frontier wastewater controlled rerun1 artifact link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.artifact.json")],
    ["index frontier wastewater controlled rerun1 validator link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.validator.json")],
    ["index frontier wastewater controlled rerun1 review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1.md")],
    ["index frontier repair protocol link", index.includes("./research/frontier-full-ofone-repair-protocol.md")],
    ["index frontier controlled contract link", index.includes("./benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md")],
    ["index frontier regulated controlled contract link", index.includes("./benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md")],
    ["recursive loop frontier repair protocol link", loop.includes("research/frontier-full-ofone-repair-protocol.md")],
    ["recursive loop Chrome extension launch boundary", loop.includes("Chrome extension/plugin") && loop.includes("not automatic fallbacks")],
    ["frontier repair protocol bars same-shape reruns", protocol.includes("Same-shape Deep Research remedial reruns are barred")],
    ["frontier repair protocol controlled execution mode", protocol.includes("Mode A: Controlled Non-Deep-Research Execution")],
    ["frontier repair protocol inline launch mode", protocol.includes("Mode B: Inline Deep Research Launch Contract")],
    ["frontier repair protocol active contract", protocol.includes("2026-05-21-strategic-gated-diligence-frontier-full-r1-mode-a-contract.md")],
    ["frontier repair protocol regulated active contract", protocol.includes("2026-05-21-regulated-wastewater-frontier-full-r1-mode-a-contract.md")],
    ["frontier controlled contract executed reviewed", controlledContract.includes("Status: `executed_reviewed`")],
    ["frontier controlled contract pre-execution state", controlledContract.includes("Status before execution: `prepared_not_executed`")],
    ["frontier controlled contract rerun5", controlledContract.includes("2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__frontier_reasoning__r1__rerun5")],
    ["frontier controlled contract required heading", controlledContract.includes("# Benchmark Raw Output")],
    ["frontier regulated controlled contract executed reviewed", regulatedControlledContract.includes("Status: `executed_reviewed`")],
    ["frontier regulated controlled contract pre-execution state", regulatedControlledContract.includes("Status before execution: `prepared_not_executed`")],
    ["frontier regulated controlled contract rerun1", regulatedControlledContract.includes("2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__frontier_reasoning__r1__rerun1")],
    ["frontier regulated controlled contract required heading", regulatedControlledContract.includes("# Benchmark Raw Output")],
    ["index object schemas guide link", index.includes("./docs/object-schemas.md")],
    ["index independent review handoff link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/frontier-independent-review-handoff.md")],
    ["index launch proof item", index.includes("Launch Proof")],
    ["index status ledger link", index.includes("./research/status/2026-05-17-06-ofone-batch01-independent-review.md")],
    ["index research tracker link", index.includes("./research/TRACKER.md")],
    ["package research script", packageJson.scripts?.["research:check"] === "node scripts/ofone-research-check.mjs"],
    ["manifest independent review integrated state", manifest.review_plan?.independent_review_status === "integrated"],
    ["manifest independent review launch proof", Array.isArray(manifest.review_plan?.independent_review_launch?.launch_proof)],
    ["manifest independent review result", manifest.review_plan?.independent_review_result === "research/results/2026-05-17-06-ofone-batch01-independent-review-result.md"],
    ["manifest excluded-run log", manifest.results_plan?.excluded_run_log === "benchmarks/results/2026-05-17-batch-01-excluded-runs.md"],
    ["manifest checker attestation", manifest.results_plan?.checker_attestation_file === "benchmarks/results/2026-05-17-batch-01-checker-attestation.json"],
    ["benchmark launch metadata validator", benchmarkScript.includes("BENCH_BATCH_INDEPENDENT_REVIEW_LAUNCH")],
    ["benchmark case-binding validator", benchmarkScript.includes("BENCH_BATCH_RUN_CASE_BINDING")],
    ["benchmark trace validator", benchmarkScript.includes("BENCH_BATCH_RUN_BENCHMARK_TRACE")],
    ["benchmark rerun-policy validator", benchmarkScript.includes("BENCH_BATCH_RERUN_POLICY")],
    ["benchmark remedial run validator", benchmarkScript.includes("BENCH_BATCH_REMEDIAL_RUN")],
    ["benchmark attestation validator", benchmarkScript.includes("BENCH_BATCH_CHECKER_ATTESTATION")],
    ["benchmark released-evidence readiness", benchmarkScript.includes("releasedAggregateEvidence")],
    ["benchmark pre-score validator", benchmarkScript.includes("BENCH_BATCH_RUN_PRE_SCORE")],
    ["index Run 06 result link", index.includes("./research/results/2026-05-17-06-ofone-batch01-independent-review-result.md")],
    ["index excluded runs link", index.includes("./benchmarks/results/2026-05-17-batch-01-excluded-runs.md")],
    ["index checker attestation link", index.includes("./benchmarks/results/2026-05-17-batch-01-checker-attestation.json")],
    ["index Run 07 prompt link", index.includes("./research/prompts/2026-05-17-07-ofone-post-run06-hardening-review.md")],
    ["index Run 07 context link", index.includes("./research/ofone-post-run06-hardening-context.md")],
    ["index Run 07 status ledger link", index.includes("./research/status/2026-05-17-07-ofone-post-run06-hardening-review.md")],
    ["index Run 07 result link", index.includes("./research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md")],
    ["index Run 07 synthesis link", index.includes("./research/results/2026-05-17-07-ofone-post-run06-hardening-review-synthesis.md")],
    ["index recursive loop link", index.includes("./research/recursive-improvement-loop.md")],
    ["index research watchdog item", index.includes("Research Watchdog")],
    ["README Run 07 status ledger link", readme.includes("research/status/2026-05-17-07-ofone-post-run06-hardening-review.md")],
    ["README Run 07 result link", readme.includes("research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md")],
    ["README checker attestation link", readme.includes("benchmarks/results/2026-05-17-batch-01-checker-attestation.json")],
    ["README recursive loop link", readme.includes("research/recursive-improvement-loop.md")],
    ["README active research watchdog note", readme.includes("The Active Research Watchdog keeps live external research")],
    ["Pages v08 context link", index.includes("./research/ofone-v08-convergence-context-brief.md")]
  ];
  const missing = required.filter(([, passed]) => !passed).map(([name]) => name);
  if (missing.length === 0) {
    console.log("PASS tooling contract");
    return;
  }
  failures += 1;
  console.error(`FAIL tooling contract: ${missing.join(", ")}`);
}

function runInvalidReviewSidecarChecks() {
  const sourcePath = path.join(repoRoot, "research", "review-sidecars", "2026-05-17-03-ofone-v06-recursive-review-sidecar.json");
  const base = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const checks = [
    {
      name: "source boundary",
      mutate: (data) => {
        data.source_policy.no_follow_discovered_links = false;
      },
      expect: "OFONE_REVIEW_SOURCE_BOUNDARY"
    },
    {
      name: "source allowlist host",
      mutate: (data) => {
        data.source_policy.allowlisted_hosts = [
          ...data.source_policy.allowlisted_hosts,
          "https://example.com/ofone-shadow"
        ];
      },
      expect: "OFONE_REVIEW_SOURCE_BOUNDARY"
    },
    {
      name: "execution boundary",
      mutate: (data) => {
        data.execution_policy.execute_repo_code = true;
      },
      expect: "OFONE_REVIEW_EXECUTION"
    },
    {
      name: "convergence handoff",
      mutate: (data) => {
        data.convergence_gate.recommended_next_mode = "architecture_iteration";
      },
      expect: "OFONE_REVIEW_CONVERGENCE"
    },
    {
      name: "benchmark uninspected surface",
      mutate: (data) => {
        data.inspected_surfaces.pages.inspected = false;
        data.release_blockers = [];
        data.convergence_gate.release_blockers = 0;
        data.convergence_gate.benchmark_handoff_ready = true;
        data.convergence_gate.recommended_next_mode = "benchmark";
        data.benchmark_handoff.ready_after_current_batch = true;
        data.final_decision = "benchmark";
      },
      expect: "OFONE_REVIEW_INSPECTION"
    }
  ];

  for (const check of checks) {
    const data = JSON.parse(JSON.stringify(base));
    check.mutate(data);
    const outputPath = path.join(tempDir, `invalid-review-${check.name.replaceAll(" ", "-")}.json`);
    fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);
    const result = spawnSync(process.execPath, ["scripts/ofone-review-check.mjs", "--json", outputPath], {
      cwd: repoRoot,
      encoding: "utf8"
    });
    const diagnostics = parseDiagnostics(result.stdout);
    const codes = new Set(diagnostics.map((diagnostic) => diagnostic.code));
    if (result.status !== 0 && codes.has(check.expect)) {
      console.log(`PASS invalid review ${check.name}`);
      continue;
    }
    failures += 1;
    console.error(`FAIL invalid review ${check.name}`);
    console.error(`expected non-zero exit and diagnostic code: ${check.expect}`);
    console.error(`actual diagnostic codes: ${[...codes].join(", ") || "(none)"}`);
    console.error(result.stdout);
    console.error(result.stderr);
  }
}

function runInvalidFixture(fixture) {
  const sourcePath = path.join(repoRoot, fixture.base);
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

  for (const mutation of fixture.mutations) applyMutation(data, mutation);

  const outputPath = path.join(tempDir, `${fixture.name}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);

  const result = spawnSync(process.execPath, ["scripts/ofone-validate.mjs", "--json", outputPath], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const output = `${result.stdout}\n${result.stderr}`;
  const diagnostics = parseDiagnostics(result.stdout);
  const codes = new Set(diagnostics.map((diagnostic) => diagnostic.code));
  const expected = fixture.expect.every((code) => codes.has(code));

  if (result.status !== 0 && expected) {
    console.log(`PASS invalid ${fixture.name}`);
    return;
  }

  failures += 1;
  console.error(`FAIL invalid ${fixture.name}`);
  console.error(`expected non-zero exit and diagnostic codes: ${fixture.expect.join(", ")}`);
  console.error(`actual diagnostic codes: ${[...codes].join(", ") || "(none)"}`);
  console.error(output);
}

function parseDiagnostics(stdout) {
  try {
    const parsed = parseJson(stdout);
    return parsed.results?.flatMap((result) => result.diagnostics || []) || [];
  } catch {
    return [];
  }
}

function parseJson(stdout) {
  return JSON.parse(stdout);
}

function getPath(object, pathExpression) {
  return pathExpression.split(".").reduce((current, key) => {
    if (current === undefined || current === null) return undefined;
    return current[key];
  }, object);
}

function valueMatches(actual, expected) {
  if (Array.isArray(actual)) return actual.includes(expected);
  return actual === expected;
}

function applyMutation(data, mutation) {
  const parent = mutation.path.slice(0, -1).reduce((current, key) => current[key], data);
  const key = mutation.path[mutation.path.length - 1];

  if (mutation.op === "set") {
    parent[key] = mutation.value;
    return;
  }

  if (mutation.op === "delete") {
    delete parent[key];
    return;
  }

  throw new Error(`Unsupported mutation op ${mutation.op}`);
}
