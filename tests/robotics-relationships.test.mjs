import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { contentDigest, validateEcosystem, validateScarcity } from "../scripts/industrial-base-rules.mjs";
import { filterScorecards } from "../app/robotics/filters.mjs";
const data = JSON.parse(await readFile(new URL("../app/data/industrial-base.json", import.meta.url), "utf8"));
const d = data.ecosystem;
const validate = (value) => validateEcosystem(value, data.chart.nodes.map((n) => n.id), data.scorecards.map((c) => c.id));

test("dossiers and relationships have valid source, identity, product and node references", () => {
  validate(d);
  const broken = structuredClone(d); broken.relationships[0].claimIds = ["MISSING"];
  assert.throws(() => validate(broken), /Unknown claims/);
  broken.relationships[0].claimIds = [];
  assert.throws(() => validate(broken), /Unsourced relationship/);
});
test("opening any scorecard by ID survives filters and finds precisely that assessment", () => {
  for (const c of data.scorecards) assert.deepEqual(filterScorecards(data.scorecards, c.id).map((x) => x.id), [c.id]);
  assert.equal(filterScorecards(data.scorecards, "熙瑞")[0].id, "CNSCA-C250E60D20");
});
test("C4 requires an affirmative located source for the same assessment", () => {
  validateScarcity(data.scorecards, data.evidence, data.amendments.scarcity);
  const withoutPositive = data.amendments.scarcity.filter((r) => r.state !== "affirmative");
  assert.throws(() => validateScarcity(data.scorecards, data.evidence, withoutPositive), /C4 without affirmative/);
  assert.deepEqual(data.trackers.limitedSource.rows.map((r) => r.evidenceId), ["CNSCE-F79AF16D26"]);
  assert.equal(data.trackers.limitedSource.reviews.filter((r) => r.state === "negated").length, 2);
  assert.equal(data.trackers.limitedSource.reviews.filter((r) => r.state === "proposed").length, 1);
});
test("content identifiers change with claim or source changes even when row counts do not", () => {
  const copy = structuredClone(d); const before = contentDigest(copy);
  copy.claims[0].text += " revised";
  assert.notEqual(contentDigest(copy), before);
  const urlCopy = structuredClone(d); urlCopy.sources[0].url += "#revised";
  assert.notEqual(contentDigest(urlCopy), before);
  assert.equal(contentDigest(d), contentDigest(structuredClone(d)));
});
test("military exercise observation is not converted into a Unitree supply relationship", () => {
  assert.equal(d.products.find((p) => p.id === "P-EXERCISE-ROBOTS").manufacturerId, null);
  const exercise = d.relationships.find((r) => r.id === "R-EXERCISE");
  assert.equal(exercise.subjectId, "E-EXERCISE");
  assert.ok(!exercise.productIds.includes("P-GO2"));
  assert.ok(!d.relationships.some((r) => r.subjectId === "E-UNITREE" && r.objectId === "E-EXERCISE"));
});
test("Xirui awards preserve amounts and unresolved delivery and maturity", () => {
  const awards = d.relationships.filter((r) => r.caseId === "xirui");
  assert.equal(awards.length, 2);
  assert.equal(awards.reduce((sum, r) => sum + r.amountCny, 0), 10370000);
  for (const r of awards) { assert.match(r.transactionStage, /Award/i); assert.equal(r.eventDate, null); assert.match(r.dateLabel, /notice published/); }
  const c = data.scorecards.find((c) => c.id === "CNSCA-C250E60D20");
  assert.equal(c.importance, null); assert.equal(c.rankEligible, false); assert.equal(c.importedAssessment.maturity, "U3");
});
test("Estun ownership ends in two documented stages", () => {
  const control = d.relationships.find((r) => r.id === "R-ESTUN-CONTROL");
  const associate = d.relationships.find((r) => r.id === "R-ESTUN-ASSOCIATE");
  assert.equal(control.effectiveEnd, "2025-06-25");
  assert.equal(associate.effectiveStart, control.effectiveEnd);
  assert.equal(associate.effectiveEnd, "2025-11-03");
});
test("buyer accounting control does not overwrite seller disposal or imply perpetual currentness", () => {
  const exit = d.relationships.find((r) => r.id === "R-ESTUN-EXIT");
  const buyer = d.relationships.find((r) => r.id === "R-XINHONGYE-CONTROL");
  assert.equal(exit.eventDate, "2025-11-03");
  assert.equal(buyer.effectiveStart, "2025-11-04");
  assert.equal(buyer.effectiveEnd, null);
  assert.match(buyer.currentness, /30 June 2026/);
  assert.match(buyer.relation, /62% direct/);
  const revenue = d.metrics.find((m) => m.id === "M-SHUGUANG-POSTACQUISITION-REVENUE");
  assert.equal(revenue.value, 33496772.42);
  assert.match(revenue.scope, /4 November–31 December 2025/);
  assert.match(revenue.scope, /not full-year, military-only or software revenue/);
});
test("post-sale cooperation and software ownership do not establish implemented autonomy", () => {
  const cooperation = d.relationships.find((r) => r.id === "R-ESTUN-COOPERATION");
  assert.equal(cooperation.eventDate, "2025-10-20");
  assert.deepEqual(cooperation.productIds, []);
  assert.match(cooperation.transactionStage, /separate detailed agreement required/);
  assert.equal(cooperation.technicalStage, "Implementation unverified");
  for (const id of ["R-XINHONGYE-SHUGUANG-SOFTWARE", "R-XINHONGYE-HUANYU-SOFTWARE"]) {
    const ownership = d.relationships.find((r) => r.id === id);
    assert.match(ownership.relation, /62% indirect/);
    assert.deepEqual(ownership.productIds, []);
    assert.equal(ownership.technicalStage, "Autonomy functionality unestablished");
  }
});
test("Jingpin completed software work remains separate from tender objectives and unnamed simulation", () => {
  const software = d.relationships.find((r) => r.id === "R-JINGPIN-WMS");
  assert.equal(d.products.find((p) => p.id === "P-JINGPIN-WMS").manufacturerId, null);
  assert.equal(software.transactionStage, "Customer acceptance not established");
  assert.equal(software.eventDate, "2026-06-30");
  assert.ok(!software.claimIds.includes("C-JINGPIN-WCS-SIMULATION"));
  const progress = d.claims.find((c) => c.id === "C-JINGPIN-WMS-2026");
  assert.match(progress.text, /completed software testing and updates/);
  assert.match(progress.text, /tender statements remain intended objectives/);
  assert.match(progress.locator, /header and row 10/);
  const simulation = d.claims.find((c) => c.id === "C-JINGPIN-WCS-SIMULATION");
  assert.match(simulation.text, /5,000 simulated orders/);
  assert.match(simulation.limitation, /Not customer-site throughput/);
  assert.ok(!d.metrics.some((m) => m.claimId === simulation.id));
  const equivalents = d.metrics.find((m) => m.id === "M-JINGPIN-EQUIVALENTS-2025");
  assert.equal(equivalents.value, 12248);
  assert.equal(equivalents.unit, "G001 labor equivalents");
  assert.match(equivalents.scope, /not actual robots/);
});
test("metrics preserve units and business scope; manufacturing research stays distinct", () => {
  const equivalents = d.metrics.find((m) => m.id === "M-JINGPIN-EQUIVALENTS");
  assert.equal(equivalents.value, 3197); assert.equal(equivalents.unit, "G001 labor equivalents");
  assert.match(d.metrics.find((m) => m.id === "M-DEEP-REVENUE").scope, /Company-wide/);
  assert.deepEqual(d.products.find((p) => p.id === "P-SIASUN-SLM").nodeIds, []);
});
test("signals exclude worksheet headings and retain collection tasks separately", () => {
  assert.equal(data.trackers.signals.rows.length, 5);
  assert.equal(data.legacyCollectionTasks.length, 5);
  assert.ok(data.trackers.signals.rows.every((r) => /^DRA-SIG-\d+$/.test(r.signal_id)));
  assert.ok(!data.metadata.readMe.metrics.some((r) => r.count === 1841));
});
