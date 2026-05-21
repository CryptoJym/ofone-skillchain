#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(repoRoot, "SKILL.md");
const defaultTarget = path.join(os.homedir(), ".codex", "skills", "ofone", "SKILL.md");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const writeMode = args.includes("--write") || !checkOnly;
const targetArg = args.find((arg) => arg === "--target" || arg.startsWith("--target="));
const targetPath = resolveTarget(targetArg);

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  const nextIsTargetValue = index > 0 && args[index - 1] === "--target";
  const known = arg === "--check" || arg === "--write" || arg === "--target" || arg.startsWith("--target=");
  if (!known && !nextIsTargetValue) {
    fail(`unknown argument: ${arg}`);
  }
}

const sourceText = fs.readFileSync(sourcePath, "utf8");
assertSkillSource(sourceText);
const sourceHash = sha256(sourceText);

if (checkOnly && !fs.existsSync(targetPath)) {
  fail(`installed skill missing at ${targetPath}`);
}

if (writeMode) {
  ensureWritableTarget(targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, sourceText);
}

const targetText = fs.readFileSync(targetPath, "utf8");
const targetHash = sha256(targetText);
if (targetHash !== sourceHash) {
  fail(`installed skill is stale: source ${sourceHash}, target ${targetHash}`);
}

console.log(`${writeMode ? "Installed" : "Verified"} OfOne skill`);
console.log(`source: ${sourcePath}`);
console.log(`target: ${targetPath}`);
console.log(`sha256:${sourceHash}`);

function resolveTarget(targetArgValue) {
  if (!targetArgValue) return defaultTarget;
  if (targetArgValue === "--target") {
    const targetIndex = args.indexOf("--target");
    const value = args[targetIndex + 1];
    if (!value || value.startsWith("--")) fail("--target requires a path");
    return path.resolve(value);
  }
  return path.resolve(targetArgValue.split("=").slice(1).join("="));
}

function assertSkillSource(text) {
  const required = [
    "name: ofone",
    "use the Chrome extension/plugin as the launch and observation surface",
    "stop normal workflow and troubleshoot extension availability first",
    "before doing any benchmark, harvest, launch, or repo-promotion work",
    "browser.tabs.list()",
    "Do not treat a missing `browser.tabs.query()` helper as extension failure",
    "research/deep-research-extension-payloads.json",
    "research/deep-research-extension-report.json",
    "research/deep-research-manual-recovery.json",
    "do not mark it launched, harvested, reviewed, complete, or aggregate-eligible"
  ];

  const missing = required.filter((needle) => !text.includes(needle));
  if (missing.length > 0) {
    fail(`source SKILL.md is missing required OfOne install invariant(s): ${missing.join(", ")}`);
  }

  const forbidden = [
    "one-off manual assist",
    "unless the user explicitly authorizes a one-off"
  ];
  const presentForbidden = forbidden.filter((needle) => text.includes(needle));
  if (presentForbidden.length > 0) {
    fail(`source SKILL.md contains forbidden Chrome-fallback language: ${presentForbidden.join(", ")}`);
  }
}

function ensureWritableTarget(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) {
    fail(`refusing to overwrite symlink target: ${target}`);
  }
  if (stat.isDirectory()) {
    fail(`target is a directory: ${target}`);
  }
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(1);
}
