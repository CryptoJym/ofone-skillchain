import { array, isIsoDate, object } from "./util.mjs";

function actorFindings(actor, objectId, prefix) {
  const value = object(actor);
  const findings = [];
  const add = (code, message) => findings.push({ severity: "error", code, message, object_id: objectId });
  if (!String(value.actor_id || "").trim()) add(`${prefix}_ACTOR`, "A named human actor_id is required.");
  if (!String(value.role || "").trim()) add(`${prefix}_ROLE`, "The human actor role is required.");
  if (!String(value.authority_basis || "").trim()) add(`${prefix}_AUTHORITY`, "The actor's authority basis is required.");
  return findings;
}

function activeAt(record, asOf) {
  if (!isIsoDate(record.accepted_at || record.approved_at) || !isIsoDate(record.expires_at)) return false;
  const startsAt = Date.parse(record.accepted_at || record.approved_at);
  return startsAt <= asOf && Date.parse(record.expires_at) > asOf;
}

export function governanceAsOf(state) {
  const supplied = state?.temporal_context?.as_of;
  return isIsoDate(supplied) ? Date.parse(supplied) : Date.now();
}

export function validateAcceptedRiskRecord(recordInput, state, objectId = null) {
  const record = object(recordInput);
  const findings = [];
  const add = (code, message) => findings.push({ severity: "error", code, message, object_id: objectId || record.acceptance_id || null });
  const unknown = array(state.unknowns).find((candidate) => candidate.unknown_id === record.unknown_id);

  if (!String(record.acceptance_id || "").trim()) add("QG_RISK_ACCEPTANCE_ID", "Accepted risk requires acceptance_id.");
  if (!unknown) add("QG_RISK_ACCEPTANCE_UNKNOWN", "Accepted risk references a missing unknown.");
  findings.push(...actorFindings(record.accepted_by, objectId || record.acceptance_id, "QG_RISK_ACCEPTANCE"));
  if (!isIsoDate(record.accepted_at)) add("QG_RISK_ACCEPTANCE_TIME", "Accepted risk requires accepted_at.");
  if (!isIsoDate(record.expires_at)) add("QG_RISK_ACCEPTANCE_EXPIRY", "Accepted risk requires expires_at.");
  if (isIsoDate(record.accepted_at) && isIsoDate(record.expires_at)
    && Date.parse(record.expires_at) <= Date.parse(record.accepted_at)) {
    add("QG_RISK_ACCEPTANCE_EXPIRY", "Accepted-risk expiry must be after acceptance.");
  }
  if (!String(record.rationale || "").trim()) add("QG_RISK_ACCEPTANCE_RATIONALE", "Accepted risk requires rationale.");
  if (!String(record.scope || "").trim()) add("QG_RISK_ACCEPTANCE_SCOPE", "Accepted risk requires a bounded scope.");
  if (array(record.reopen_conditions).length === 0) add("QG_RISK_ACCEPTANCE_REOPEN", "Accepted risk requires reopening conditions.");
  if (array(record.evidence_refs).length === 0) add("QG_RISK_ACCEPTANCE_EVIDENCE", "Accepted risk requires evidence references.");

  const passed = findings.length === 0;
  const active = passed && activeAt(record, governanceAsOf(state));
  return { passed, active, findings, unknown };
}

export function validAcceptedRiskRecords(state) {
  const asOf = governanceAsOf(state);
  return array(state.convergence?.accepted_risks).filter((record) =>
    validateAcceptedRiskRecord(record, state).passed && activeAt(record, asOf)
  );
}

export function acceptedResidualIds(state) {
  return new Set(validAcceptedRiskRecords(state).map((record) => record.unknown_id));
}

export function validateRobustnessWaiver(waiverInput, state, metrics = null) {
  const waiver = object(waiverInput);
  const findings = [];
  const objectId = waiver.waiver_id || null;
  const add = (code, message) => findings.push({ severity: "error", code, message, object_id: objectId });
  if (Object.keys(waiver).length === 0) return { passed: false, active: false, findings: [], applies: false };

  if (!String(waiver.waiver_id || "").trim()) add("QG_WAIVER_ID", "Robustness waiver requires waiver_id.");
  findings.push(...actorFindings(waiver.approved_by, objectId, "QG_WAIVER"));
  if (!isIsoDate(waiver.approved_at)) add("QG_WAIVER_TIME", "Robustness waiver requires approved_at.");
  if (!isIsoDate(waiver.expires_at)) add("QG_WAIVER_EXPIRY", "Robustness waiver requires expires_at.");
  if (isIsoDate(waiver.approved_at) && isIsoDate(waiver.expires_at)
    && Date.parse(waiver.expires_at) <= Date.parse(waiver.approved_at)) {
    add("QG_WAIVER_EXPIRY", "Waiver expiry must be after approval.");
  }
  if (!String(waiver.rationale || "").trim()) add("QG_WAIVER_RATIONALE", "Robustness waiver requires rationale.");
  if (!String(waiver.scope || "").trim()) add("QG_WAIVER_SCOPE", "Robustness waiver requires bounded scope.");
  if (array(waiver.reopen_conditions).length === 0) add("QG_WAIVER_REOPEN", "Robustness waiver requires reopening conditions.");
  if (array(waiver.evidence_refs).length === 0) add("QG_WAIVER_EVIDENCE", "Robustness waiver requires evidence references.");

  const floor = Number(waiver.minimum_decision_robustness);
  const ceiling = Number(waiver.maximum_residual_evpi);
  if (!Number.isFinite(floor) || floor < 0 || floor > 1) add("QG_WAIVER_ROBUSTNESS_BOUND", "minimum_decision_robustness must be within [0,1].");
  if (!Number.isFinite(ceiling) || ceiling < 0 || ceiling > 1) add("QG_WAIVER_EVPI_BOUND", "maximum_residual_evpi must be within [0,1].");

  const passed = findings.length === 0;
  const active = passed && activeAt(waiver, governanceAsOf(state));
  const applies = active && metrics != null
    && Number(metrics.decision_robustness) >= floor
    && Number(metrics.residual_evpi) <= ceiling;
  return { passed, active, applies, findings };
}

export function governanceFindings(state, metrics = null) {
  const findings = [];
  const records = array(state.convergence?.accepted_risks);
  const ids = new Set();
  for (const record of records) {
    if (ids.has(record.acceptance_id)) {
      findings.push({ severity: "error", code: "QG_RISK_ACCEPTANCE_DUPLICATE", message: "Duplicate accepted-risk acceptance_id.", object_id: record.acceptance_id });
    }
    ids.add(record.acceptance_id);
    findings.push(...validateAcceptedRiskRecord(record, state).findings);
  }

  const acceptedIds = acceptedResidualIds(state);
  for (const unknown of array(state.unknowns)) {
    if (unknown.status === "accepted_risk" && !acceptedIds.has(unknown.unknown_id)) {
      findings.push({ severity: "error", code: "QG_ACCEPTED_RISK_UNGOVERNED", message: "Unknown is marked accepted_risk without an active, valid human acceptance record.", object_id: unknown.unknown_id });
    }
  }
  if (array(state.convergence?.accepted_residual_unknowns).length > 0 || state.convergence?.accepted_by) {
    findings.push({ severity: "error", code: "QG_LEGACY_RISK_ACCEPTANCE", message: "Legacy bare accepted_residual_unknowns/accepted_by fields are not accepted; use typed accepted_risks records." });
  }

  if (state.convergence?.robustness_waiver != null) {
    findings.push(...validateRobustnessWaiver(state.convergence.robustness_waiver, state, metrics).findings);
  }
  return findings;
}
