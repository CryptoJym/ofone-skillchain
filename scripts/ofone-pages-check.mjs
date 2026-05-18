#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const baseArg = args.find((arg) => arg.startsWith("--base-url="));
const baseUrl = (baseArg ? baseArg.split("=").slice(1).join("=") : "https://cryptojym.github.io/ofone-skillchain").replace(/\/+$/, "");
const cacheBust = `ofone_pages_check=${Date.now()}`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const targets = [
  { label: "homepage", local: "index.html", remote: "/" },
  { label: "base schema", local: "schemas/ofone.base.schema.json", remote: "/schemas/ofone.base.schema.json", kind: "json" },
  { label: "review sidecar schema", local: "schemas/ofone.review.schema.json", remote: "/schemas/ofone.review.schema.json", kind: "json" },
  { label: "review checker script", local: "scripts/ofone-review-check.mjs", remote: "/scripts/ofone-review-check.mjs" },
  { label: "strategy example", local: "examples/strategy-micro.json", remote: "/examples/strategy-micro.json", kind: "json" },
  { label: "benchmark suite", local: "benchmarks/suite.json", remote: "/benchmarks/suite.json", kind: "json" },
  { label: "batch 01 manifest", local: "benchmarks/runs/2026-05-17-batch-01/manifest.json", remote: "/benchmarks/runs/2026-05-17-batch-01/manifest.json", kind: "json" },
  { label: "batch 01 execution matrix", local: "benchmarks/runs/2026-05-17-batch-01/execution-matrix.json", remote: "/benchmarks/runs/2026-05-17-batch-01/execution-matrix.json", kind: "json" },
  { label: "batch 01 raw full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 raw full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.artifact.json", kind: "json" },
  { label: "batch 01 raw full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.validator.json", kind: "json" },
  { label: "batch 01 raw full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.patch.json", kind: "json" },
  { label: "batch 01 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 remedial full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.md" },
  { label: "batch 01 remedial full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.artifact.json", kind: "json" },
  { label: "batch 01 remedial full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.validator.json", kind: "json" },
  { label: "batch 01 remedial full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.rendering.md" },
  { label: "batch 01 remedial full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.patch.json", kind: "json" },
  { label: "batch 01 remedial full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r1__rerun1.md" },
  { label: "batch 01 strategic r2 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__agentic_coding__r2.md" },
  { label: "batch 01 strategic r2 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__light_structured__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__light_structured__agentic_coding__r2.md" },
  { label: "batch 01 strategic r2 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 strategic r2 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.artifact.json", kind: "json" },
  { label: "batch 01 strategic r2 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.validator.json", kind: "json" },
  { label: "batch 01 strategic r2 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.rendering.md" },
  { label: "batch 01 strategic r2 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.patch.json", kind: "json" },
  { label: "batch 01 strategic r2 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 strategic r3 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__agentic_coding__r3.md" },
  { label: "batch 01 strategic r3 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__light_structured__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__light_structured__agentic_coding__r3.md" },
  { label: "batch 01 strategic r3 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 strategic r3 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.artifact.json", kind: "json" },
  { label: "batch 01 strategic r3 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.validator.json", kind: "json" },
  { label: "batch 01 strategic r3 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.rendering.md" },
  { label: "batch 01 strategic r3 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.patch.json", kind: "json" },
  { label: "batch 01 strategic r3 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 scientific direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__direct_answer__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__direct_answer__agentic_coding__r1.md" },
  { label: "batch 01 scientific light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__light_structured__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__light_structured__agentic_coding__r1.md" },
  { label: "batch 01 scientific full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 scientific full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.artifact.json", kind: "json" },
  { label: "batch 01 scientific full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.validator.json", kind: "json" },
  { label: "batch 01 scientific full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.rendering.md" },
  { label: "batch 01 scientific full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.patch.json", kind: "json" },
  { label: "batch 01 scientific full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 scientific r2 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__direct_answer__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__direct_answer__agentic_coding__r2.md" },
  { label: "batch 01 scientific r2 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__light_structured__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__light_structured__agentic_coding__r2.md" },
  { label: "batch 01 scientific r2 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 scientific r2 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.artifact.json", kind: "json" },
  { label: "batch 01 scientific r2 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.validator.json", kind: "json" },
  { label: "batch 01 scientific r2 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.rendering.md" },
  { label: "batch 01 scientific r2 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.patch.json", kind: "json" },
  { label: "batch 01 scientific r2 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 scientific r3 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__direct_answer__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__direct_answer__agentic_coding__r3.md" },
  { label: "batch 01 scientific r3 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__light_structured__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__light_structured__agentic_coding__r3.md" },
  { label: "batch 01 scientific r3 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 scientific r3 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.artifact.json", kind: "json" },
  { label: "batch 01 scientific r3 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.validator.json", kind: "json" },
  { label: "batch 01 scientific r3 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.rendering.md" },
  { label: "batch 01 scientific r3 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.patch.json", kind: "json" },
  { label: "batch 01 scientific r3 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-scientific-mechanism-check-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 wastewater direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__agentic_coding__r1.md" },
  { label: "batch 01 wastewater light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__agentic_coding__r1.md" },
  { label: "batch 01 wastewater full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 wastewater full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.artifact.json", kind: "json" },
  { label: "batch 01 wastewater full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.validator.json", kind: "json" },
  { label: "batch 01 wastewater full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.rendering.md" },
  { label: "batch 01 wastewater full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.patch.json", kind: "json" },
  { label: "batch 01 wastewater full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 wastewater r2 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__agentic_coding__r2.md" },
  { label: "batch 01 wastewater r2 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__agentic_coding__r2.md" },
  { label: "batch 01 wastewater r2 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 wastewater r2 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.artifact.json", kind: "json" },
  { label: "batch 01 wastewater r2 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.validator.json", kind: "json" },
  { label: "batch 01 wastewater r2 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.rendering.md" },
  { label: "batch 01 wastewater r2 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.patch.json", kind: "json" },
  { label: "batch 01 wastewater r2 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 wastewater r3 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__direct_answer__agentic_coding__r3.md" },
  { label: "batch 01 wastewater r3 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__light_structured__agentic_coding__r3.md" },
  { label: "batch 01 wastewater r3 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 wastewater r3 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.artifact.json", kind: "json" },
  { label: "batch 01 wastewater r3 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.validator.json", kind: "json" },
  { label: "batch 01 wastewater r3 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.rendering.md" },
  { label: "batch 01 wastewater r3 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.patch.json", kind: "json" },
  { label: "batch 01 wastewater r3 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-regulated-wastewater-market-entry-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 formal direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r1.md" },
  { label: "batch 01 formal light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r1.md" },
  { label: "batch 01 formal full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 formal full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.artifact.json", kind: "json" },
  { label: "batch 01 formal full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.validator.json", kind: "json" },
  { label: "batch 01 formal full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.rendering.md" },
  { label: "batch 01 formal full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.patch.json", kind: "json" },
  { label: "batch 01 formal full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 formal r2 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r2.md" },
  { label: "batch 01 formal r2 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r2.md" },
  { label: "batch 01 formal r2 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 formal r2 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.artifact.json", kind: "json" },
  { label: "batch 01 formal r2 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.validator.json", kind: "json" },
  { label: "batch 01 formal r2 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.rendering.md" },
  { label: "batch 01 formal r2 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.patch.json", kind: "json" },
  { label: "batch 01 formal r2 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 formal r3 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__direct_answer__agentic_coding__r3.md" },
  { label: "batch 01 formal r3 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__light_structured__agentic_coding__r3.md" },
  { label: "batch 01 formal r3 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 formal r3 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.artifact.json", kind: "json" },
  { label: "batch 01 formal r3 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.validator.json", kind: "json" },
  { label: "batch 01 formal r3 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.rendering.md" },
  { label: "batch 01 formal r3 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.patch.json", kind: "json" },
  { label: "batch 01 formal r3 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-formal-proof-search-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 policy direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__direct_answer__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__direct_answer__agentic_coding__r1.md" },
  { label: "batch 01 policy light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r1.md" },
  { label: "batch 01 policy full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 policy full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.artifact.json", kind: "json" },
  { label: "batch 01 policy full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.validator.json", kind: "json" },
  { label: "batch 01 policy full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.rendering.md" },
  { label: "batch 01 policy full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.patch.json", kind: "json" },
  { label: "batch 01 policy full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r1.md" },
  { label: "batch 01 policy r2 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__direct_answer__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__direct_answer__agentic_coding__r2.md" },
  { label: "batch 01 policy r2 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r2.md" },
  { label: "batch 01 policy r2 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 policy r2 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.artifact.json", kind: "json" },
  { label: "batch 01 policy r2 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.validator.json", kind: "json" },
  { label: "batch 01 policy r2 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.rendering.md" },
  { label: "batch 01 policy r2 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.patch.json", kind: "json" },
  { label: "batch 01 policy r2 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r2.md" },
  { label: "batch 01 policy r3 direct output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__direct_answer__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__direct_answer__agentic_coding__r3.md" },
  { label: "batch 01 policy r3 light output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__light_structured__agentic_coding__r3.md" },
  { label: "batch 01 policy r3 full output", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 policy r3 full artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.artifact.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.artifact.json", kind: "json" },
  { label: "batch 01 policy r3 full validator artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.validator.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.validator.json", kind: "json" },
  { label: "batch 01 policy r3 full rendering", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.rendering.md", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.rendering.md" },
  { label: "batch 01 policy r3 full patch artifact", local: "benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.patch.json", remote: "/benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.patch.json", kind: "json" },
  { label: "batch 01 policy r3 full review", local: "benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-public-sector-ai-policy-audit-001__full_ofone__agentic_coding__r3.md" },
  { label: "batch 01 excluded-run log", local: "benchmarks/results/2026-05-17-batch-01-excluded-runs.md", remote: "/benchmarks/results/2026-05-17-batch-01-excluded-runs.md" },
  { label: "batch 01 checker attestation", local: "benchmarks/results/2026-05-17-batch-01-checker-attestation.json", remote: "/benchmarks/results/2026-05-17-batch-01-checker-attestation.json", kind: "json" },
  { label: "batch 01 frontier strategic r1 packet", local: "benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-18-strategic-gated-diligence-frontier-r1.md", remote: "/benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-18-strategic-gated-diligence-frontier-r1.md" },
  { label: "batch 01 independent review handoff", local: "benchmarks/reviews/2026-05-17-batch-01/frontier-independent-review-handoff.md", remote: "/benchmarks/reviews/2026-05-17-batch-01/frontier-independent-review-handoff.md" },
  { label: "batch 01 independent review result", local: "research/results/2026-05-17-06-ofone-batch01-independent-review-result.md", remote: "/research/results/2026-05-17-06-ofone-batch01-independent-review-result.md" },
  { label: "batch 01 independent review context", local: "research/ofone-batch01-independent-review-context.md", remote: "/research/ofone-batch01-independent-review-context.md" },
  { label: "research tracker", local: "research/TRACKER.md", remote: "/research/TRACKER.md" },
  { label: "run 06 status ledger", local: "research/status/2026-05-17-06-ofone-batch01-independent-review.md", remote: "/research/status/2026-05-17-06-ofone-batch01-independent-review.md" },
  { label: "run 07 prompt", local: "research/prompts/2026-05-17-07-ofone-post-run06-hardening-review.md", remote: "/research/prompts/2026-05-17-07-ofone-post-run06-hardening-review.md" },
  { label: "run 07 context", local: "research/ofone-post-run06-hardening-context.md", remote: "/research/ofone-post-run06-hardening-context.md" },
  { label: "run 07 status ledger", local: "research/status/2026-05-17-07-ofone-post-run06-hardening-review.md", remote: "/research/status/2026-05-17-07-ofone-post-run06-hardening-review.md" },
  { label: "run 07 result", local: "research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md", remote: "/research/results/2026-05-17-07-ofone-post-run06-hardening-review-result.md" },
  { label: "run 07 synthesis", local: "research/results/2026-05-17-07-ofone-post-run06-hardening-review-synthesis.md", remote: "/research/results/2026-05-17-07-ofone-post-run06-hardening-review-synthesis.md" },
  { label: "review protocol", local: "research/review-protocol.md", remote: "/research/review-protocol.md" },
  { label: "recursive improvement loop", local: "research/recursive-improvement-loop.md", remote: "/research/recursive-improvement-loop.md" },
  { label: "batch 01 review template", local: "benchmarks/reviews/2026-05-17-batch-01-review-template.md", remote: "/benchmarks/reviews/2026-05-17-batch-01-review-template.md" },
  { label: "v08 context brief", local: "research/ofone-v08-convergence-context-brief.md", remote: "/research/ofone-v08-convergence-context-brief.md" }
];

const diagnostics = [];

for (const target of targets) {
  const localPath = path.join(repoRoot, target.local);
  if (!fs.existsSync(localPath)) {
    diagnostics.push({
      severity: "error",
      code: "OFONE_PAGES_LOCAL_MISSING",
      label: target.label,
      local: target.local,
      message: `local file not found: ${target.local}`
    });
    continue;
  }

  const remoteUrl = withCacheBust(`${baseUrl}${target.remote}`);
  try {
    const response = await fetch(remoteUrl, { cache: "no-store" });
    if (!response.ok) {
      diagnostics.push({
        severity: "error",
        code: "OFONE_PAGES_HTTP",
        label: target.label,
        local: target.local,
        remote: remoteUrl,
        status: response.status,
        message: `${target.label} returned HTTP ${response.status}`
      });
      continue;
    }

    const localText = fs.readFileSync(localPath, "utf8");
    const remoteText = await response.text();
    const localNormalized = normalize(localText, target.kind);
    const remoteNormalized = normalize(remoteText, target.kind);
    const localHash = sha256(localNormalized);
    const remoteHash = sha256(remoteNormalized);

    if (localHash !== remoteHash) {
      diagnostics.push({
        severity: "error",
        code: "OFONE_PAGES_MISMATCH",
        label: target.label,
        local: target.local,
        remote: remoteUrl,
        local_hash: localHash,
        remote_hash: remoteHash,
        message: `${target.label} differs between local repo and GitHub Pages`
      });
      continue;
    }

    diagnostics.push({
      severity: "info",
      code: "OFONE_PAGES_MATCH",
      label: target.label,
      local: target.local,
      remote: remoteUrl,
      hash: localHash,
      message: `${target.label} matches GitHub Pages`
    });
  } catch (error) {
    diagnostics.push({
      severity: "error",
      code: "OFONE_PAGES_FETCH",
      label: target.label,
      local: target.local,
      remote: remoteUrl,
      message: `${target.label} fetch failed: ${error.message}`
    });
  }
}

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");

if (jsonOutput) {
  console.log(JSON.stringify({ passed, base_url: baseUrl, diagnostics }, null, 2));
} else {
  console.log(`${passed ? "PASS" : "FAIL"} GitHub Pages parity`);
  for (const diagnostic of diagnostics) {
    const prefix = diagnostic.severity === "error" ? "ERROR" : "OK";
    console.log(`- ${prefix} ${diagnostic.code}: ${diagnostic.message}`);
    if (diagnostic.severity === "error" && diagnostic.local_hash && diagnostic.remote_hash) {
      console.log(`  local ${diagnostic.local_hash}`);
      console.log(`  remote ${diagnostic.remote_hash}`);
    }
  }
}

process.exit(passed ? 0 : 1);

function withCacheBust(url) {
  return `${url}${url.includes("?") ? "&" : "?"}${cacheBust}`;
}

function normalize(text, kind) {
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
  if (kind !== "json") return `${normalizedText}\n`;
  try {
    return `${JSON.stringify(sortJson(JSON.parse(normalizedText)), null, 2)}\n`;
  } catch {
    return `${normalizedText}\n`;
  }
}

function sortJson(value) {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortJson(value[key])]));
}

function sha256(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}
