import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Period amounts only: capital allocation and contract coverage must be documented
// before they enter this ledger. See research/industrial-base/task-economics/method.md.
export const costCategories = ["equipment_or_service", "integration", "labor", "maintenance", "energy", "software_connectivity", "other"];
export const outcomeCategories = ["demanded", "accepted_unassisted", "accepted_assisted", "accepted_manual", "failed", "unresolved"];
export const timeCategories = ["scheduled", "active", "idle", "charging", "planned_maintenance", "unplanned_downtime"];
const scopeFields = ["robotModel", "revision", "customer", "site", "robotPool", "task", "acceptanceRule", "periodStart", "periodEnd", "currency", "taxTreatment", "costBoundary"];
const unknown = () => ({ value: null, basis: "unknown", reference: null });
const check = (condition, message) => { if (!condition) throw new Error(message); };
const populated = (value) => typeof value === "string" && value.trim().length > 0;

export function createLedger(deployment) {
  return {
    id: deployment.id,
    kind: "reported",
    mode: null,
    scope: Object.fromEntries(scopeFields.map((key) => [key, deployment[key] ?? null])),
    scopeReference: null,
    robotCount: unknown(),
    outcomes: Object.fromEntries(outcomeCategories.map((key) => [key, unknown()])),
    time: Object.fromEntries(timeCategories.map((key) => [key, unknown()])),
    costs: costCategories.map((category) => ({ category, state: "unknown", ...unknown() })),
  };
}

export function evaluateLedger(ledger) {
  check(["reported", "scenario"].includes(ledger.kind), "kind must be reported or scenario");
  check([null, "owned", "service"].includes(ledger.mode), "Unknown acquisition mode");
  const missing = [];
  const cell = (input, name, integer = false) => {
    check(input && ["reported", "assumed", "unknown"].includes(input.basis), `Invalid evidence basis: ${name}`);
    if (input.value === null) {
      check(input.basis === "unknown", `Null value must have unknown basis: ${name}`);
      return null;
    }
    check(Number.isFinite(input.value) && input.value >= 0, `Nonnegative finite value required: ${name}`);
    check(!integer || Number.isInteger(input.value), `Unique task counts must be integers: ${name}`);
    check(input.basis !== "unknown" && populated(input.reference), `Known value needs evidence or assumption reference: ${name}`);
    check(input.basis !== "assumed" || ledger.kind === "scenario", `Assumptions require a scenario: ${name}`);
    return input.value;
  };
  for (const key of scopeFields) if (!populated(ledger.scope?.[key])) missing.push(`scope.${key}`);
  if (!populated(ledger.scopeReference)) missing.push("scopeReference");
  if (ledger.mode === null) missing.push("mode");
  for (const key of ["periodStart", "periodEnd"]) {
    const value = ledger.scope?.[key];
    if (value !== null && value !== undefined) {
      check(/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, `Invalid date: ${key}`);
    }
  }
  if (ledger.scope.periodStart && ledger.scope.periodEnd) check(ledger.scope.periodEnd > ledger.scope.periodStart, "Period must be start-inclusive, end-exclusive and positive");
  const robotCount = cell(ledger.robotCount, "robotCount", true);
  if (robotCount === null) missing.push("robotCount");
  else check(robotCount > 0, "Robot pool must contain at least one robot");

  const outcomes = Object.fromEntries(outcomeCategories.map((key) => [key, cell(ledger.outcomes?.[key], `outcomes.${key}`, true)]));
  for (const key of outcomeCategories) if (outcomes[key] === null) missing.push(`outcomes.${key}`);
  const resolved = outcomeCategories.filter((key) => key !== "demanded");
  const knownOutcomes = resolved.reduce((sum, key) => sum + (outcomes[key] ?? 0), 0);
  if (outcomes.demanded !== null) {
    check(knownOutcomes <= outcomes.demanded, "Outcome buckets exceed unique demanded tasks");
    if (resolved.every((key) => outcomes[key] !== null)) check(knownOutcomes === outcomes.demanded, "Outcome buckets must reconcile to the demand cohort");
  }
  const acceptedKeys = ["accepted_unassisted", "accepted_assisted", "accepted_manual"];
  const accepted = acceptedKeys.every((key) => outcomes[key] !== null) ? acceptedKeys.reduce((sum, key) => sum + outcomes[key], 0) : null;
  const robotAccepted = outcomes.accepted_unassisted !== null && outcomes.accepted_assisted !== null ? outcomes.accepted_unassisted + outcomes.accepted_assisted : null;

  check(Array.isArray(ledger.costs) && ledger.costs.length === costCategories.length, "Supply each required cost category exactly once");
  check(new Set(ledger.costs.map((cost) => cost.category)).size === costCategories.length && ledger.costs.every((cost) => costCategories.includes(cost.category)), "Duplicate or unknown cost category");
  let knownSubtotal = 0;
  for (const cost of ledger.costs) {
    check(["known", "unknown", "bundled", "not_applicable"].includes(cost.state), `Invalid cost state: ${cost.category}`);
    if (["bundled", "not_applicable"].includes(cost.state)) {
      check(cost.value === null && populated(cost.reference), `Excluded cost needs a reason and null value: ${cost.category}`);
      check(["reported", "assumed"].includes(cost.basis), `Excluded cost needs an evidence basis: ${cost.category}`);
      check(cost.basis !== "assumed" || ledger.kind === "scenario", "Assumptions require a scenario");
      if (cost.state === "bundled") {
        const covering = ledger.costs.find((line) => line.category === cost.includedIn);
        check(covering && covering !== cost && covering.state === "known", `Bundled cost needs a known covering line: ${cost.category}`);
      }
      continue;
    }
    const value = cell(cost, `costs.${cost.category}`);
    check((cost.state === "unknown") === (value === null), `Cost state/value mismatch: ${cost.category}`);
    if (value === null) missing.push(`costs.${cost.category}`);
    else knownSubtotal += value;
  }
  const time = Object.fromEntries(timeCategories.map((key) => [key, cell(ledger.time?.[key], `time.${key}`)]));
  const clockComplete = timeCategories.every((key) => time[key] !== null);
  const clockParts = timeCategories.filter((key) => key !== "scheduled");
  const knownTime = clockParts.reduce((sum, key) => sum + (time[key] ?? 0), 0);
  if (time.scheduled !== null) check(knownTime <= time.scheduled + 0.000001, "Clock buckets exceed scheduled robot-hours");
  if (clockComplete) check(Math.abs(knownTime - time.scheduled) < 0.000001, "Clock buckets must sum to scheduled robot-hours");
  if (time.active === 0 && robotAccepted !== null) check(robotAccepted === 0, "Positive robot output requires active robot-hours");
  if (robotCount !== null && ledger.scope.periodStart && ledger.scope.periodEnd) {
    const capacity = robotCount * (Date.parse(ledger.scope.periodEnd) - Date.parse(ledger.scope.periodStart)) / 3600000;
    check(knownTime <= capacity && (time.scheduled === null || time.scheduled <= capacity), "Robot-hours exceed pool capacity for the period");
  }
  const costComplete = !missing.some((key) => key.startsWith("costs."));
  const complete = missing.length === 0;
  return {
    id: ledger.id,
    kind: ledger.kind,
    scope: ledger.scope,
    robotCount,
    status: !complete ? "incomplete" : accepted === 0 ? "no_accepted_output" : "complete",
    knownPeriodCostSubtotal: knownSubtotal,
    periodCostTotal: costComplete ? knownSubtotal : null,
    acceptedUniqueTasks: accepted,
    costPerAcceptedTask: complete && accepted > 0 ? knownSubtotal / accepted : null,
    robotInvolvingShare: accepted > 0 && robotAccepted !== null ? robotAccepted / accepted : null,
    unassistedShare: accepted > 0 && outcomes.accepted_unassisted !== null ? outcomes.accepted_unassisted / accepted : null,
    activeShareOfScheduledRobotHours: clockComplete && time.scheduled > 0 ? time.active / time.scheduled : null,
    robotAcceptedTasksPerActiveRobotHour: clockComplete && time.active > 0 && robotAccepted !== null ? robotAccepted / time.active : null,
    missing,
    timeGaps: timeCategories.filter((key) => time[key] === null),
    limitation: "Reported inputs are attributed claims, not independent audits. Cost totals rely on declared scope, period allocation and coverage; aggregate ledgers cannot detect duplicate underlying task IDs or overlapping operator time."
  };
}

export function validateEvidence(data) {
  for (const table of ["sources", "claims", "deployments"]) check(new Set(data[table].map((row) => row.id)).size === data[table].length, `Duplicate ${table} IDs`);
  const sources = new Set(data.sources.map((source) => source.id));
  const claims = new Map(data.claims.map((claim) => [claim.id, claim]));
  for (const source of data.sources) check(/^https:\/\//.test(source.url) && populated(source.retrievedAt), `Invalid source: ${source.id}`);
  for (const claim of data.claims) check(sources.has(claim.sourceId) && populated(claim.locator) && populated(claim.limitation), `Unlocated or unsourced claim: ${claim.id}`);
  for (const deployment of data.deployments) {
    check(deployment.sourceIds.every((id) => sources.has(id)), `Unknown deployment source: ${deployment.id}`);
    check(deployment.claimIds.length > 0 && deployment.claimIds.every((id) => claims.has(id) && deployment.sourceIds.includes(claims.get(id).sourceId)), `Unknown or unlinked deployment claim: ${deployment.id}`);
    evaluateLedger(createLedger(deployment));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = JSON.parse(await readFile(new URL("../research/industrial-base/task-economics/evidence.json", import.meta.url), "utf8"));
  validateEvidence(data);
  const [option, input] = process.argv.slice(2);
  let output;
  if (option === "--ledger") output = evaluateLedger(JSON.parse(await readFile(input, "utf8")));
  else if (option === "--template") {
    const deployment = data.deployments.find((row) => row.id === input);
    check(deployment, `Unknown deployment: ${input}`);
    output = createLedger(deployment);
  } else {
    check(option === undefined, "Usage: node scripts/task-economics.mjs [--template DEPLOYMENT_ID | --ledger PATH]");
    output = data.deployments.map((deployment) => evaluateLedger(createLedger(deployment)));
  }
  console.log(JSON.stringify(output, null, 2));
}
