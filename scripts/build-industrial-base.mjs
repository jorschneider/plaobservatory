// Build the robotics industrial-base dataset from the extracted scorecard package and the node chart.
//   python3 scripts/extract-industrial-base.py && node scripts/build-industrial-base.mjs
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rp = (...p) => path.join(root, ...p);
const pkg = JSON.parse(await readFile(rp("research/industrial-base/scorecards-v1.2.json"), "utf8"));
const chart = JSON.parse(await readFile(rp("research/industrial-base/robotics-nodes.json"), "utf8"));
const S = pkg.sheets;
const rankingByAssessmentKey = new Map(S.ranking.records.map((r) => [`${r.supplier}|${r.capability_family}`, r]));
const evidenceByAssessment = new Map();
for (const e of S.evidence.records) evidenceByAssessment.set(e.assessment_id, [...(evidenceByAssessment.get(e.assessment_id) ?? []), e]);
const familyToNode = new Map(chart.nodes.flatMap((n) => n.capabilityFamilies.map((f) => [f, n.id])));
export function evidenceTier(status, rankEligible, evidence) {
  if (rankEligible === "Yes" && /^E[34]$/.test(String(evidence))) return "evidence_qualified";
  if (/verified|bounded/.test(String(status))) return "bounded";
  return "provisional";
}
const scorecards = S.assessments.records.map((a) => {
  const rank = rankingByAssessmentKey.get(`${a.supplier}|${a.capability_family}`) ?? {};
  const ev = evidenceByAssessment.get(a.assessment_id) ?? [];
  const nodeId = familyToNode.get(a.capability_family);
  if (!nodeId) throw new Error(`no node for capability family ${a.capability_family}`);
  return { id: a.assessment_id, supplier: a.supplier, englishName: rank.english_name ?? null, capabilityFamily: a.capability_family, nodeId, lane: a.lane, status: a.status, rankEligible: a.rank_eligible === "Yes", tier: evidenceTier(a.status, a.rank_eligible, a.evidence),
    criticality: a.criticality, frontier: a.frontier, crossDomain: a.cross_domain, evidence: a.evidence, maturity: a.maturity, importance: a.importance, lowerBound: a.lower_bound, rawCMax: a.raw_c_max, evidenceCount: ev.length, caveat: a.caveat ?? null,
    initialRank: rank.initial_rank ?? null, laneRank: rank.lane_rank ?? null, fragility: rank.fragility_substitution_risk ?? null, fragilityBasis: rank.fragility_basis ?? null, primarySources: rank.primary_sources ?? null,
    evidenceIds: ev.map((e) => e.evidence_id), sourceUrls: [...new Set(ev.map((e) => e.source_url).filter(Boolean))] };
});
const nodes = chart.nodes.map((n) => {
  const cards = scorecards.filter((c) => c.nodeId === n.id).sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0));
  const coverage = cards.some((c) => c.tier === "evidence_qualified") ? "evidence_qualified" : cards.length ? "provisional_only" : "no_record";
  return { ...n, scorecardIds: cards.map((c) => c.id), suppliers: cards.map((c) => ({ id: c.id, supplier: c.supplier, englishName: c.englishName, tier: c.tier, importance: c.importance, lane: c.lane })), coverage, evidenceQualifiedCount: cards.filter((c) => c.tier === "evidence_qualified").length, provisionalCount: cards.filter((c) => c.tier !== "evidence_qualified").length };
});
const count = (arr, f) => Object.entries(arr.reduce((acc, x) => { const k = f(x); acc[k] = (acc[k] ?? 0) + 1; return acc; }, {})).map(([key, n]) => ({ key, count: n })).sort((a, b) => b.count - a.count);
// trackers derived from the ledger: one question each, from the bounded source set the package already holds
const isProcurement = (e) => /plap\.mil\.cn|csscbidding|weain\.mil\.cn|招标|中标|tender|award|procurement|result notice/i.test(`${e.source_title ?? ""} ${e.source_url ?? ""} ${e.claim ?? ""}`);
const isLimitedSource = (text) => /sole[- ]?supplier|sole[- ]?source|limited[- ]source|single[- ]source|唯一|独家/i.test(text ?? "");
const trackers = {
  procurementNotices: { plain: "Every evidence row that rests on a PLA, CSSC or other procurement notice: what was bought, from whom, and whether the award is final.", rows: S.evidence.records.filter(isProcurement).map((e) => ({ evidenceId: e.evidence_id, assessmentId: e.assessment_id, supplier: e.supplier, capability: e.capability, date: e.date, state: e.state, evidenceStatus: e.evidence_status, claim: e.claim, caveat: e.caveat, sourceTitle: e.source_title, url: e.source_url })) },
  limitedSource: { plain: "Every row where the source itself uses sole-supplier or limited-source language, and every scorecard whose criticality reached 4 on that basis. Without such language the package caps criticality at 3.", rows: S.evidence.records.filter((e) => isLimitedSource(`${e.claim} ${e.context} ${e.caveat}`)).map((e) => ({ evidenceId: e.evidence_id, supplier: e.supplier, capability: e.capability, date: e.date, claim: e.claim, url: e.source_url })), criticalityFour: scorecards.filter((c) => Number(c.criticality) >= 4).map((c) => ({ id: c.id, supplier: c.supplier, englishName: c.englishName, capabilityFamily: c.capabilityFamily, fragility: c.fragility, fragilityBasis: c.fragilityBasis })) },
  foreignDependencies: { plain: "Named foreign tool, consumable or test-equipment relationships with Chinese counterparties, from export-control records. Each is dated, marked historical or current, and kept out of domestic supplier scoring.", rows: S.foreignDependencies.records },
  identityQueue: { plain: "The package's audit flags 19 new exact-name entities for identity follow-up (unified social-credit code, corporate parent, production site) but the workbook does not carry that flag per row. This queue therefore lists the provisional watchlist scorecards, which are the new private robotics and counter-UAS firms the audit names as the follow-up set.", rows: [...new Map(scorecards.filter((c) => c.status === "provisional_watchlist").map((c) => [c.supplier, { supplier: c.supplier, englishName: c.englishName, capabilityFamily: c.capabilityFamily, lane: c.lane, status: c.status, note: c.caveat }])).values()] },
  signals: { plain: "Demand, experimentation and R&D-integration signals from procurement and test notices. Each states what it confirms and what it does not establish.", rows: S.signals.records },
};
const buildSeed = JSON.stringify({ scorecards: scorecards.map((c) => [c.id, c.tier, c.importance]), nodes: nodes.map((n) => [n.id, n.coverage]), evidence: S.evidence.records.length });
const buildId = `IB26-R1-${createHash("sha256").update(buildSeed).digest("hex").slice(0, 12).toUpperCase()}`;
const data = {
  metadata: { title: "Robotics industrial-base lane", buildId, cutoff: chart.cutoff, package: pkg.package, chartVersion: chart.chartVersion, scorecardCount: scorecards.length, evidenceQualifiedCount: scorecards.filter((c) => c.tier === "evidence_qualified").length, boundedCount: scorecards.filter((c) => c.tier === "bounded").length, provisionalCount: scorecards.filter((c) => c.tier === "provisional").length, evidenceRowCount: S.evidence.records.length, sourceUrlCount: new Set(S.evidence.records.map((e) => e.source_url)).size, nodeCount: nodes.length, nodeCoverageCounts: count(nodes, (n) => n.coverage), laneCounts: count(scorecards, (c) => c.lane), statusCounts: count(scorecards, (c) => c.status), tierCounts: chart.tiers.map((t) => ({ tier: t.id, label: t.label, nodes: nodes.filter((n) => n.tier === t.id).length, evidenceQualified: nodes.filter((n) => n.tier === t.id && n.coverage === "evidence_qualified").length, provisionalOnly: nodes.filter((n) => n.tier === t.id && n.coverage === "provisional_only").length, noRecord: nodes.filter((n) => n.tier === t.id && n.coverage === "no_record").length })), trackerCounts: Object.fromEntries(Object.entries(trackers).map(([k, v]) => [k, v.rows.length])), readMe: S.readMe, scoringMethod: S.scoringMethod },
  chart: { plain: chart.plain, tiers: chart.tiers, nodes },
  scorecards, evidence: S.evidence.records, trackers, sources: S.sources.records, bibliography: S.bibliography.records,
};
const csvEscape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
const csv = [["assessment_id", "supplier", "english_name", "capability_family", "node_id", "lane", "status", "tier", "criticality", "frontier", "cross_domain", "evidence", "maturity", "importance", "lower_bound", "evidence_count", "initial_rank", "fragility", "source_urls"], ...scorecards.map((c) => [c.id, c.supplier, c.englishName, c.capabilityFamily, c.nodeId, c.lane, c.status, c.tier, c.criticality, c.frontier, c.crossDomain, c.evidence, c.maturity, c.importance, c.lowerBound, c.evidenceCount, c.initialRank, c.fragility, c.sourceUrls.join("|")])];
await Promise.all([
  writeFile(rp("app/data/industrial-base.json"), JSON.stringify(data) + "\n"),
  writeFile(rp("public/data/industrial-base-robotics.json"), JSON.stringify(data, null, 2) + "\n"),
  writeFile(rp("public/data/industrial-base-robotics-scorecards.csv"), csv.map((r) => r.map(csvEscape).join(",")).join("\n") + "\n"),
]);
console.log(JSON.stringify({ buildId, scorecards: scorecards.length, nodes: nodes.length, coverage: data.metadata.nodeCoverageCounts, trackers: data.metadata.trackerCounts }));
