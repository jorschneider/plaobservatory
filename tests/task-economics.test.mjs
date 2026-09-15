import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createLedger, evaluateLedger, validateEvidence } from "../scripts/task-economics.mjs";

const root = new URL("../research/industrial-base/task-economics/", import.meta.url);
const evidence = JSON.parse(await readFile(new URL("evidence.json", root), "utf8"));
const example = JSON.parse(await readFile(new URL("example-ledger.json", root), "utf8"));
const copy = () => structuredClone(example);

test("evidence references are located and valid; real cases do not acquire synthetic economics", () => {
  validateEvidence(evidence);
  for (const deployment of evidence.deployments) {
    const result = evaluateLedger(createLedger(deployment));
    assert.equal(result.status, "incomplete");
    assert.equal(result.costPerAcceptedTask, null);
    assert.equal(result.periodCostTotal, null);
    assert.ok(result.missing.includes("outcomes.accepted_assisted"));
  }
  const broken = structuredClone(evidence);
  broken.claims[0].sourceId = "missing";
  assert.throws(() => validateEvidence(broken), /unsourced claim/);
});

test("lab results, targets, forecasts and calendar duration cannot become field cost inputs", () => {
  const roles = ["laboratory_result", "performance_target", "forecast", "supplier_reported_trial_duration"];
  for (const role of roles) {
    const claims = evidence.claims.filter((claim) => claim.role === role);
    assert.ok(claims.length > 0);
    assert.ok(claims.every((claim) => claim.usableAsCostInput === false));
  }
  const lab = evidence.claims.find((claim) => claim.id === "C-UB26-LAB");
  assert.equal(lab.value, 75);
  assert.ok(!evidence.deployments.some((deployment) => deployment.claimIds.includes(lab.id)));
});

test("unit cost includes assisted and manual output while exposing both shares", () => {
  const result = evaluateLedger(example);
  assert.equal(result.status, "complete");
  assert.equal(result.kind, "scenario");
  assert.equal(result.periodCostTotal, 200);
  assert.equal(result.acceptedUniqueTasks, 90);
  assert.equal(result.costPerAcceptedTask, 200 / 90);
  assert.equal(result.robotInvolvingShare, 80 / 90);
  assert.equal(result.unassistedShare, 60 / 90);
  assert.equal(result.activeShareOfScheduledRobotHours, 0.6);
});

test("an unknown required cost withholds unit cost rather than becoming zero", () => {
  const ledger = copy();
  Object.assign(ledger.costs[2], { state: "unknown", value: null, basis: "unknown", reference: null });
  const result = evaluateLedger(ledger);
  assert.equal(result.knownPeriodCostSubtotal, 150);
  assert.equal(result.periodCostTotal, null);
  assert.equal(result.costPerAcceptedTask, null);
  assert.ok(result.missing.includes("costs.labor"));
});

test("bundling a cost into a fee preserves totals and prevents a second charge", () => {
  const ledger = copy();
  ledger.costs[0].value += 10;
  Object.assign(ledger.costs[3], { state: "bundled", value: null, includedIn: "equipment_or_service", reference: "Synthetic maintenance now included in increased fee" });
  assert.equal(evaluateLedger(ledger).periodCostTotal, 200);
  ledger.costs[3].value = 10;
  assert.throws(() => evaluateLedger(ledger), /null value/);
  ledger.costs[3].value = null;
  ledger.costs[3].includedIn = "missing";
  assert.throws(() => evaluateLedger(ledger), /covering line/);
});

test("zero accepted output yields no finite unit cost", () => {
  const ledger = copy();
  for (const key of ["accepted_unassisted", "accepted_assisted", "accepted_manual"]) ledger.outcomes[key].value = 0;
  ledger.outcomes.failed.value = 95;
  const result = evaluateLedger(ledger);
  assert.equal(result.status, "no_accepted_output");
  assert.equal(result.periodCostTotal, 200);
  assert.equal(result.costPerAcceptedTask, null);
});

test("known task and clock buckets must reconcile without double counting", () => {
  const tasks = copy(); tasks.outcomes.accepted_assisted.value += 1;
  assert.throws(() => evaluateLedger(tasks), /exceed unique/);
  const hours = copy(); hours.time.charging.value += 1;
  assert.throws(() => evaluateLedger(hours), /exceed scheduled/);
  const gap = copy(); gap.outcomes.unresolved.value = 0;
  assert.throws(() => evaluateLedger(gap), /reconcile/);
});

test("unknown time blocks time ratios but does not corrupt complete period cost", () => {
  const ledger = copy();
  ledger.time.active = { value: null, basis: "unknown", reference: null };
  const result = evaluateLedger(ledger);
  assert.equal(result.costPerAcceptedTask, 200 / 90);
  assert.equal(result.activeShareOfScheduledRobotHours, null);
  assert.equal(result.robotAcceptedTasksPerActiveRobotHour, null);
});

test("assumptions cannot silently become reported evidence and zero requires provenance", () => {
  const ledger = copy(); ledger.kind = "reported";
  assert.throws(() => evaluateLedger(ledger), /Assumptions require/);
  const zero = copy(); Object.assign(zero.costs[0], { value: 0, reference: null });
  assert.throws(() => evaluateLedger(zero), /reference/);
});

test("scaling a complete ledger preserves unit cost; added cost cannot lower it", () => {
  const ledger = copy();
  for (const item of [...Object.values(ledger.outcomes), ...Object.values(ledger.time), ...ledger.costs]) item.value *= 2;
  assert.equal(evaluateLedger(ledger).costPerAcceptedTask, evaluateLedger(example).costPerAcceptedTask);
  ledger.costs[0].value += 100;
  assert.ok(evaluateLedger(ledger).costPerAcceptedTask > evaluateLedger(example).costPerAcceptedTask);
});

test("invalid dates, negative costs and duplicate categories are rejected", () => {
  const dates = copy(); dates.scope.periodStart = "2026-02-30";
  assert.throws(() => evaluateLedger(dates), /Invalid date/);
  const negative = copy(); negative.costs[0].value = -1;
  assert.throws(() => evaluateLedger(negative), /Nonnegative/);
  const duplicate = copy(); duplicate.costs[1].category = duplicate.costs[0].category;
  assert.throws(() => evaluateLedger(duplicate), /Duplicate/);
});

test("robot output requires activity and clock hours cannot exceed calendar pool capacity", () => {
  const idle = copy(); idle.time.idle.value += idle.time.active.value; idle.time.active.value = 0;
  assert.throws(() => evaluateLedger(idle), /requires active/);
  const impossible = copy(); impossible.time.active.value += 20; impossible.time.scheduled.value += 20;
  assert.throws(() => evaluateLedger(impossible), /pool capacity/);
  const manual = copy();
  manual.outcomes.accepted_manual.value = 90;
  manual.outcomes.accepted_assisted.value = 0;
  manual.outcomes.accepted_unassisted.value = 0;
  manual.time.idle.value += manual.time.active.value;
  manual.time.active.value = 0;
  assert.equal(evaluateLedger(manual).costPerAcceptedTask, 200 / 90);
  assert.equal(evaluateLedger(manual).robotInvolvingShare, 0);
});
