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
      encoding: "utf8"
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
  const required = [
    ["package pages script", packageJson.scripts?.["pages:check"] === "node scripts/ofone-pages-check.mjs"],
    ["pages checker file", fs.existsSync(path.join(repoRoot, "scripts", "ofone-pages-check.mjs"))],
    ["README pages command", readme.includes("npm run pages:check")],
    ["README research command", readme.includes("npm run research:check")],
    ["README review-round version note", readme.includes("Review-round labels such as `v0.7` and `v0.8`")],
    ["README launch-proof boundary", readme.includes("A prepared packet is not a launched run")],
    ["README batch 01 plan", readme.includes("benchmarks/runs/2026-05-17-batch-01/manifest.json")],
    ["README batch 01 matrix", readme.includes("benchmarks/runs/2026-05-17-batch-01/execution-matrix.json")],
    ["index batch 01 link", index.includes("./benchmarks/runs/2026-05-17-batch-01/manifest.json")],
    ["index batch 01 matrix link", index.includes("./benchmarks/runs/2026-05-17-batch-01/execution-matrix.json")],
    ["index first raw output link", index.includes("./benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md")],
    ["index first review link", index.includes("./benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md")],
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
