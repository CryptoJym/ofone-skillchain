#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const schemasDir = path.join(repoRoot, "schemas");
const examplesDir = path.join(repoRoot, "examples");

const schemaNames = [
  "ofone.base.schema.json",
  "ofone.micro.schema.json",
  "ofone.map.schema.json",
  "ofone.audit.schema.json",
  "ofone.schema.json"
];

const profileIds = {
  Micro: "https://cryptojym.github.io/ofone-skillchain/schemas/ofone.micro.schema.json",
  Map: "https://cryptojym.github.io/ofone-skillchain/schemas/ofone.map.schema.json",
  Audit: "https://cryptojym.github.io/ofone-skillchain/schemas/ofone.audit.schema.json"
};

const closedDefinitions = [
  "charter",
  "artifactIdentity",
  "adapterProjection",
  "scene",
  "frame",
  "subscene",
  "token",
  "evidence",
  "claim",
  "claimConfidence",
  "unknown",
  "killTest",
  "criterion",
  "tradeoffSurface",
  "actor",
  "temporalModel",
  "evidenceValidityWindow",
  "informationValue",
  "lens",
  "councilResult",
  "reviewLogEntry",
  "edge",
  "loop",
  "optionMove",
  "trigger",
  "gate",
  "confidenceModel",
  "decisionRendering",
  "validatorResult",
  "validatorDiagnostic",
  "reviewCycle",
  "benchmarkTrace"
];

const diagnostics = [];
const fail = (code, message) => diagnostics.push({ severity: "error", code, message });
const pass = (code, message) => diagnostics.push({ severity: "info", code, message });

const schemas = new Map();
for (const schemaName of schemaNames) {
  const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, schemaName), "utf8"));
  schemas.set(schemaName, schema);
  if (!schema.$schema) fail("SCHEMA_IDENTITY", `${schemaName} missing $schema`);
  if (!schema.$id) fail("SCHEMA_IDENTITY", `${schemaName} missing $id`);
}
if (!diagnostics.some((diagnostic) => diagnostic.code === "SCHEMA_IDENTITY" && diagnostic.severity === "error")) {
  pass("SCHEMA_IDENTITY", "all schemas declare $schema and $id");
}

const dispatcher = schemas.get("ofone.schema.json");
const dispatcherRefs = new Set((dispatcher.oneOf || []).map((entry) => entry.$ref));
for (const profileId of Object.values(profileIds)) {
  if (!dispatcherRefs.has(profileId)) fail("SCHEMA_DISPATCHER", `dispatcher missing ${profileId}`);
}
if (!diagnostics.some((diagnostic) => diagnostic.code === "SCHEMA_DISPATCHER" && diagnostic.severity === "error")) {
  pass("SCHEMA_DISPATCHER", "dispatcher references Micro, Map, and Audit profiles");
}

const base = schemas.get("ofone.base.schema.json");
for (const definition of closedDefinitions) {
  if (base.$defs?.[definition]?.additionalProperties !== false) {
    fail("SCHEMA_CLOSED_DEFINITION", `$defs.${definition} must set additionalProperties=false`);
  }
}
if (!diagnostics.some((diagnostic) => diagnostic.code === "SCHEMA_CLOSED_DEFINITION" && diagnostic.severity === "error")) {
  pass("SCHEMA_CLOSED_DEFINITION", "compiler-state definitions are closed against accidental extra fields");
}

checkDependentFields("evidence", "content_hash", ["retrieved_at", "extract", "source_owner", "chain_of_custody"]);
checkDependentFields("tradeoffSurface", "dominant_option", ["options", "criteria", "why"]);
checkDependentFields("tradeoffSurface", "reversal_conditions", ["options", "criteria"]);
checkDependentFields("validatorResult", "diagnostics", ["checks"]);
for (const key of ["artifact_identity", "tradeoff_surface", "temporal_model", "review_log"]) {
  if (!Object.keys(base.dependentRequired || {}).includes(key)) fail("SCHEMA_DEPENDENT_FIELDS", `root missing dependentRequired for ${key}`);
}
if (!diagnostics.some((diagnostic) => diagnostic.code === "SCHEMA_DEPENDENT_FIELDS" && diagnostic.severity === "error")) {
  pass("SCHEMA_DEPENDENT_FIELDS", "dependent field rules cover lifecycle, evidence identity, tradeoff, and review state");
}

function checkDependentFields(definition, key, expected) {
  const actual = base.$defs?.[definition]?.dependentRequired?.[key] || [];
  for (const field of expected) {
    if (!actual.includes(field)) fail("SCHEMA_DEPENDENT_FIELDS", `$defs.${definition}.${key} must require ${field}`);
  }
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
for (const schemaName of schemaNames) ajv.addSchema(schemas.get(schemaName));
const dispatcherValidate = ajv.getSchema(schemas.get("ofone.schema.json").$id);

for (const exampleName of fs.readdirSync(examplesDir).filter((file) => file.endsWith(".json"))) {
  const examplePath = path.join(examplesDir, exampleName);
  const data = JSON.parse(fs.readFileSync(examplePath, "utf8"));
  const matchingProfiles = Object.entries(profileIds)
    .filter(([, schemaId]) => ajv.getSchema(schemaId)(data))
    .map(([mode]) => mode);

  if (!dispatcherValidate(data)) fail("SCHEMA_EXAMPLE_DISPATCH", `${exampleName} does not pass dispatcher`);
  if (matchingProfiles.length !== 1) fail("SCHEMA_PROFILE_COMPAT", `${exampleName} matched ${matchingProfiles.length} profiles: ${matchingProfiles.join(", ") || "(none)"}`);
  if (matchingProfiles[0] !== data.mode) fail("SCHEMA_PROFILE_MODE", `${exampleName} mode=${data.mode} matched ${matchingProfiles.join(", ") || "(none)"}`);
}
if (!diagnostics.some((diagnostic) => ["SCHEMA_EXAMPLE_DISPATCH", "SCHEMA_PROFILE_COMPAT", "SCHEMA_PROFILE_MODE"].includes(diagnostic.code) && diagnostic.severity === "error")) {
  pass("SCHEMA_PROFILE_COMPAT", "examples dispatch to exactly one profile matching their mode");
}

const passed = diagnostics.every((diagnostic) => diagnostic.severity !== "error");
if (jsonOutput) {
  console.log(JSON.stringify({ passed, diagnostics }, null, 2));
} else {
  console.log(`${passed ? "PASS" : "FAIL"} schema compatibility`);
  for (const diagnostic of diagnostics) {
    const prefix = diagnostic.severity === "error" ? "ERROR" : "OK";
    console.log(`- ${prefix} ${diagnostic.code}: ${diagnostic.message}`);
  }
}

process.exit(passed ? 0 : 1);
