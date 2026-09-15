import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const data = JSON.parse(await readFile(new URL("../app/data/industrial-base.json", import.meta.url), "utf8"));
const pkg = JSON.parse(await readFile(new URL("../research/industrial-base/scorecards-v1.2.json", import.meta.url), "utf8"));
const pub = JSON.parse(await readFile(new URL("../public/data/industrial-base-robotics.json", import.meta.url), "utf8"));
test("lane data is one canonical build", () => { assert.deepEqual(pub, data); assert.match(data.metadata.buildId, /^IB26-R2-/); });
test("scorecards and evidence match the extracted package", () => {
  assert.equal(data.scorecards.length, pkg.sheets.assessments.records.length);
  assert.equal(data.evidence.length, pkg.sheets.evidence.records.length);
  assert.equal(data.metadata.evidenceQualifiedCount, 24);
  assert.equal(pkg.sheets.assessments.records.filter((r) => r.rank_eligible === "Yes").length, 25);
  const ids = new Set(data.scorecards.map((c) => c.id));
  for (const e of data.evidence) assert.ok(ids.has(e.assessment_id), `evidence ${e.evidence_id} points at unknown assessment`);
  for (const c of data.scorecards) assert.ok(c.evidenceCount >= 1, `${c.id} has no evidence row`);
});
test("every scorecard maps to exactly one node and coverage is derived from tiers", () => {
  const nodeIds = new Set(data.chart.nodes.map((n) => n.id));
  for (const c of data.scorecards) assert.ok(nodeIds.has(c.nodeId), `${c.id} maps to unknown node ${c.nodeId}`);
  for (const n of data.chart.nodes) {
    const cards = data.scorecards.filter((c) => c.nodeId === n.id);
    const expected = cards.some((c) => c.tier === "evidence_qualified") ? "evidence_qualified" : cards.length ? "provisional_only" : "no_record";
    assert.equal(n.coverage, expected, `${n.id} coverage`);
  }
  assert.equal(data.metadata.nodeCoverageCounts.reduce((s, c) => s + c.count, 0), data.chart.nodes.length);
});
test("criticality 4 requires limited-source support and trackers are views over the ledger", () => {
  for (const c of data.scorecards) if (Number(c.criticality) >= 4) assert.ok(data.trackers.limitedSource.criticalityFour.some((x) => x.id === c.id), `${c.id} is C4 without a limited-source record`);
  const evidenceIds = new Set(data.evidence.map((e) => e.evidence_id));
  for (const r of data.trackers.procurementNotices.rows) assert.ok(evidenceIds.has(r.evidenceId));
  assert.equal(data.trackers.foreignDependencies.rows.length, pkg.sheets.foreignDependencies.records.length);
  assert.equal(data.trackers.signals.rows.length, pkg.sheets.signals.records.filter((r) => /^DRA-SIG-\d+$/.test(r.signal_id)).length);
});
