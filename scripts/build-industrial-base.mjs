// Build the robotics industrial-base dataset from the extracted scorecard package and the node chart.
//   python3 scripts/extract-industrial-base.py && node scripts/build-industrial-base.mjs
import { contentDigest, validateEcosystem, validateScarcity } from "./industrial-base-rules.mjs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rp = (...p) => path.join(root, ...p);
const pkg = JSON.parse(await readFile(rp("research/industrial-base/scorecards-v1.2.json"), "utf8"));
const chart = JSON.parse(await readFile(rp("research/industrial-base/robotics-nodes.json"), "utf8"));
const ecosystem = JSON.parse(await readFile(rp("research/industrial-base/ecosystem.json"), "utf8"));
const amendments = JSON.parse(await readFile(rp("research/industrial-base/reviewed-amendments.json"), "utf8"));
const editorial = await readFile(rp("app/data/industrial-base-assessment.ts"), "utf8");
const S = pkg.sheets;
const signals = S.signals.records.filter((r) => /^DRA-SIG-\d+$/.test(r.signal_id));
const legacyCollectionTasks = S.signals.records.filter((r) => !/^DRA-SIG-\d+$/.test(r.signal_id) && r.date).map((r) => ({ task: r.signal_id, request: r.date, closure: r.signal, sourceFamily: r.confirmed_fact }));
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
for (const amendment of amendments.scorecards) {
  const card = scorecards.find((c) => c.id === amendment.id);
  if (!card) throw new Error(`Unknown amended assessment ${amendment.id}`);
  const importedAssessment = { maturity: card.maturity, importance: card.importance, lowerBound: card.lowerBound, rankEligible: card.rankEligible, initialRank: card.initialRank, tier: card.tier };
  Object.assign(card, amendment, { importedAssessment });
}
validateEcosystem(ecosystem, chart.nodes.map((n) => n.id), scorecards.map((c) => c.id));
validateScarcity(scorecards, S.evidence.records, amendments.scarcity);
const nodes = chart.nodes.map((n) => {
  const cards = scorecards.filter((c) => c.nodeId === n.id).sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0));
  const coverage = cards.some((c) => c.tier === "evidence_qualified") ? "evidence_qualified" : cards.length ? "provisional_only" : "no_record";
  return { ...n, productIds: ecosystem.products.filter((p) => p.nodeIds.includes(n.id)).map((p) => p.id), scorecardIds: cards.map((c) => c.id), suppliers: cards.map((c) => ({ id: c.id, supplier: c.supplier, englishName: c.englishName, tier: c.tier, importance: c.importance, lane: c.lane })), coverage, evidenceQualifiedCount: cards.filter((c) => c.tier === "evidence_qualified").length, provisionalCount: cards.filter((c) => c.tier !== "evidence_qualified").length };
});
const count = (arr, f) => Object.entries(arr.reduce((acc, x) => { const k = f(x); acc[k] = (acc[k] ?? 0) + 1; return acc; }, {})).map(([key, n]) => ({ key, count: n })).sort((a, b) => b.count - a.count);
// trackers derived from the ledger: one question each, from the bounded source set the package already holds
const isProcurement = (e) => /plap\.mil\.cn|csscbidding|weain\.mil\.cn|招标|中标|tender|award|procurement|result notice/i.test(`${e.source_title ?? ""} ${e.source_url ?? ""} ${e.claim ?? ""}`);
const scarcityReviews = amendments.scarcity.map((review) => {
  const e = S.evidence.records.find((e) => e.evidence_id === review.evidenceId);
  return { assessmentId: e.assessment_id, supplier: e.supplier, capability: e.capability, date: e.date, claim: e.claim, url: e.source_url, ...review };
});
const trackers = {
  procurementNotices: { plain: "Every evidence row that rests on a PLA, CSSC or other procurement notice: what was bought, from whom, and whether the award is final.", rows: S.evidence.records.filter(isProcurement).map((e) => ({ evidenceId: e.evidence_id, assessmentId: e.assessment_id, supplier: e.supplier, capability: e.capability, date: e.date, state: e.state, evidenceStatus: e.evidence_status, claim: e.claim, caveat: e.caveat, sourceTitle: e.source_title, url: e.source_url })) },
  limitedSource: { plain: "Reviewed affirmative scarcity claims only. Negated caveats and proposed procurements are excluded; all four reviewed mentions and their reasons remain available in the export.", rows: scarcityReviews.filter((r) => r.state === "affirmative"), reviews: scarcityReviews, criticalityFour: scorecards.filter((c) => Number(c.criticality) >= 4).map((c) => ({ id: c.id, supplier: c.supplier, englishName: c.englishName, capabilityFamily: c.capabilityFamily, fragility: c.fragility, fragilityBasis: c.fragilityBasis })) },
  foreignDependencies: { plain: "Named foreign tool, consumable or test-equipment relationships with Chinese counterparties, from export-control records. Each is dated, marked historical or current, and kept out of domestic supplier scoring.", rows: S.foreignDependencies.records },
  identityQueue: { plain: "Suggested identity-review queue drawn from provisional watchlist assessments. It is not the workbook's untraceable aggregate of 19 new entities. Resolve legal name, registration, parent and site before merging identities.", rows: [...new Map(scorecards.filter((c) => c.status === "provisional_watchlist").map((c) => [c.supplier, { supplier: c.supplier, englishName: c.englishName, capabilityFamily: c.capabilityFamily, lane: c.lane, status: c.status, note: c.caveat }])).values()] },
  signals: { plain: "Five source-linked signals. The worksheet heading and five collection tasks are excluded from this count; those tasks remain separately available in the export.", rows: signals },
};
const buildId = contentDigest(pkg, chart, ecosystem, amendments, editorial);
const readMe = { ...S.readMe, metrics: [
  { metric: "Imported assessments", count: scorecards.length },
  { metric: "Current rank-eligible assessments", count: scorecards.filter((c) => c.rankEligible).length },
  { metric: "Imported evidence rows", count: S.evidence.records.length },
  { metric: "Distinct imported URLs", count: new Set(S.evidence.records.map((e) => e.source_url)).size },
  { metric: "Signals", count: signals.length },
  { metric: "Reviewed dossiers", count: ecosystem.cases.length },
], notes: amendments.notes.map((note) => ({ note })) };
const data = {
  metadata: { title: "Robotics industrial-base lane", buildId, cutoff: chart.cutoff, package: pkg.package, chartVersion: chart.chartVersion, scorecardCount: scorecards.length, evidenceQualifiedCount: scorecards.filter((c) => c.tier === "evidence_qualified").length, boundedCount: scorecards.filter((c) => c.tier === "bounded").length, provisionalCount: scorecards.filter((c) => c.tier === "provisional").length, evidenceRowCount: S.evidence.records.length, sourceUrlCount: new Set(S.evidence.records.map((e) => e.source_url)).size, nodeCount: nodes.length, nodeCoverageCounts: count(nodes, (n) => n.coverage), laneCounts: count(scorecards, (c) => c.lane), statusCounts: count(scorecards, (c) => c.status), tierCounts: chart.tiers.map((t) => ({ tier: t.id, label: t.label, nodes: nodes.filter((n) => n.tier === t.id).length, evidenceQualified: nodes.filter((n) => n.tier === t.id && n.coverage === "evidence_qualified").length, provisionalOnly: nodes.filter((n) => n.tier === t.id && n.coverage === "provisional_only").length, noRecord: nodes.filter((n) => n.tier === t.id && n.coverage === "no_record").length })), trackerCounts: Object.fromEntries(Object.entries(trackers).map(([k, v]) => [k, v.rows.length])), readMe, scoringMethod: S.scoringMethod },
  chart: { plain: chart.plain, tiers: chart.tiers, nodes },
  ecosystem, amendments, legacyCollectionTasks, scorecards, evidence: S.evidence.records, trackers, sources: S.sources.records, bibliography: S.bibliography.records,
};
const csvEscape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
const csv = [["assessment_id", "supplier", "english_name", "capability_family", "node_id", "lane", "status", "tier", "criticality", "frontier", "cross_domain", "evidence", "maturity", "importance", "lower_bound", "evidence_count", "initial_rank", "fragility", "source_urls"], ...scorecards.map((c) => [c.id, c.supplier, c.englishName, c.capabilityFamily, c.nodeId, c.lane, c.status, c.tier, c.criticality, c.frontier, c.crossDomain, c.evidence, c.maturity, c.importance, c.lowerBound, c.evidenceCount, c.initialRank, c.fragility, c.sourceUrls.join("|")])];
const relationshipCsv = [["relationship_id", "case_id", "subject", "object", "products", "connection", "transaction_stage", "technical_stage", "event_date", "date_basis", "effective_start", "effective_end", "currentness", "amount_cny", "claims", "sources", "limitation"],
  ...ecosystem.relationships.map((r) => [r.id, r.caseId, ecosystem.entities.find((e) => e.id === r.subjectId).name, ecosystem.entities.find((e) => e.id === r.objectId)?.name ?? "Unknown / unspecified", r.productIds.map((id) => ecosystem.products.find((p) => p.id === id).name).join(" | "), r.connection, r.transactionStage, r.technicalStage, r.eventDate, r.dateLabel, r.effectiveStart, r.effectiveEnd, r.currentness, r.amountCny, r.claimIds.join(" | "), [...new Set(r.claimIds.map((id) => ecosystem.sources.find((s) => s.id === ecosystem.claims.find((c) => c.id === id).sourceId).url))].join(" | "), r.limitation])];
await Promise.all([
  writeFile(rp("public/data/industrial-base-robotics-relationships.csv"), relationshipCsv.map((r) => r.map(csvEscape).join(",")).join("\n") + "\n"),
  writeFile(rp("app/data/industrial-base.json"), JSON.stringify(data) + "\n"),
  writeFile(rp("public/data/industrial-base-robotics.json"), JSON.stringify(data, null, 2) + "\n"),
  writeFile(rp("public/data/industrial-base-robotics-scorecards.csv"), csv.map((r) => r.map(csvEscape).join(",")).join("\n") + "\n"),
]);
console.log(JSON.stringify({ buildId, scorecards: scorecards.length, nodes: nodes.length, coverage: data.metadata.nodeCoverageCounts, trackers: data.metadata.trackerCounts }));
