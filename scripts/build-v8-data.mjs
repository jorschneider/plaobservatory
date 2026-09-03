// Build the v8 canonical dataset from the checked-in documentary base and research files.
//
//   node scripts/build-v8-data.mjs
//
// Inputs (all checked in):
//   research/base/observatory-v7.json   documentary layer (officers, claims, sources, adverse, gaps, system/context/pipeline sources)
//   research/positions.json             the position archetype and officer/adverse mapping
//   research/adverse-timeline.json      disappearance-clock evidence for the adverse ledger
//   research/trackers/*.json            optional narrow trackers (NPC terminations, promotion ceremonies, 20th CC cohort,
//                                       event attendance, seat turnovers)
//   research/review-log.json            dated external-review entries
// Outputs:
//   app/data/observatory.json, public/data/pla-leadership-observatory-public.json, public/data/pla-leadership-observatory-public.csv
import { createHash } from "node:crypto";
import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rp = (...p) => path.join(root, ...p);
const readJson = async (p) => JSON.parse(await readFile(p, "utf8"));
const readOptional = async (p) => { try { await access(p); return readJson(p); } catch { return null; } };

const base = await readJson(rp("research/base/observatory-v7.json"));
const positionsSrc = await readJson(rp("research/positions.json"));
const timelineSrc = await readJson(rp("research/adverse-timeline.json"));
const adverseAdditions = (await readOptional(rp("research/adverse-additions.json"))) ?? { records: [] };
const reviewLog = (await readOptional(rp("research/review-log.json"))) ?? { entries: [] };
const trackerFiles = {
  npcTerminations: "npc-terminations.json",
  promotionCeremonies: "promotion-ceremonies.json",
  cc20Military: "cc20-military.json",
  eventAttendance: "event-attendance.json",
  seatTurnovers: "seat-turnovers.json",
};
const trackerSrc = {};
for (const [key, file] of Object.entries(trackerFiles)) trackerSrc[key] = await readOptional(rp("research/trackers", file));

const cutoff = positionsSrc.cutoff;
const data = structuredClone(base);

import { parseDate, daysBetween, median, COVERAGE_STATES, deriveCoverage } from "./lib/v8-rules.mjs";

// ---------- duplicate merge ----------
const duplicates = (positionsSrc.unmappedOfficers ?? []).filter((u) => u.reason === "duplicate_record");
for (const dup of duplicates) {
  const officer = data.officers.find((o) => o.id === dup.officerId);
  if (!officer) continue;
  data.officers = data.officers.filter((o) => o.id !== dup.officerId);
  data.identityHeldRecords.push({ id: officer.id, nameEn: officer.nameEn, nameZh: officer.nameZh, note: dup.note, gapIds: officer.gapIds ?? [], heldReason: "duplicate_record" });
}

const adverseById = new Map(data.adverse.map((a) => [a.id, a]));
// ---------- adverse additions (tracker-discovered removals) ----------
for (const add of adverseAdditions.records) {
  if (data.adverse.some((a) => a.id === add.id)) continue;
  if (data.officers.some((o) => o.id === add.id || o.nameZh === add.nameZh)) throw new Error(`adverse addition ${add.nameEn} collides with an active officer`);
  data.adverse.push({ id: add.id, nameEn: add.nameEn, nameZh: add.nameZh, formerBranch: add.formerBranch, formerRole: add.formerRole, status: add.status, controlledState: add.controlledState, date: add.date, summary: add.summary, evidenceConfidence: add.evidenceConfidence, sources: add.sources, discoveredBy: add.discoveredBy });
  if (!timelineSrc.records.some((r) => r.id === add.id)) timelineSrc.records.push({ id: add.id, nameEn: add.nameEn, nameZh: add.nameZh, lastPublicAppearance: null, firstConcreteSignal: null, formalAction: add.formalAction ?? null, intermediateActions: [], searchLane: add.searchLane ?? null, researchNotes: null });
}
adverseById.clear(); for (const a of data.adverse) adverseById.set(a.id, a);

// ---------- positions ----------
const officerById = new Map(data.officers.map((o) => [o.id, o]));
const holderView = (id) => { const o = officerById.get(id); if (!o) throw new Error(`position references unknown officer ${id}`); const pd = parseDate(o.lastReliableTitleDate); return { officerId: o.id, nameEn: o.nameEn, nameZh: o.nameZh, billet: o.billet, roleState: o.roleState, lastReliableTitleDate: o.lastReliableTitleDate, daysSinceTitle: pd ? daysBetween(pd.latest, cutoff) : null, titleDatePrecision: pd?.precision ?? null }; };
const adverseView = (id) => { const a = adverseById.get(id); if (!a) throw new Error(`position references unknown adverse record ${id}`); return { adverseId: a.id, nameEn: a.nameEn, nameZh: a.nameZh, status: a.status, controlledState: a.controlledState, date: a.date }; };
data.positions = positionsSrc.positions.map((p) => {
  const pos = { id: p.id, tier: p.tier, organization: p.organization, organizationZh: p.organizationZh, position: p.position, positionZh: p.positionZh, gradeBand: p.gradeBand, seats: p.seats, isBench: p.seats === 0,
    holders: p.holderIds.map(holderView), handlers: p.handlerIds.map(holderView), adverse: p.adverseIds.map(adverseView), externalHolder: p.externalHolder, note: p.note, searchLane: p.searchLane, lastChecked: cutoff };
  pos.coverage = deriveCoverage(pos);
  const dates = pos.holders.map((h) => h.daysSinceTitle).filter((d) => typeof d === "number");
  pos.freshestTitleDays = dates.length ? Math.min(...dates) : null;
  return pos;
});
data.positionTiers = positionsSrc.tiers;
const posByOfficer = new Map();
for (const pos of data.positions) {
  for (const h of pos.holders) posByOfficer.set(h.officerId, [...(posByOfficer.get(h.officerId) ?? []), { positionId: pos.id, role: "holder" }]);
  for (const h of pos.handlers) posByOfficer.set(h.officerId, [...(posByOfficer.get(h.officerId) ?? []), { positionId: pos.id, role: "handler" }]);
}
const unmappedById = new Map((positionsSrc.unmappedOfficers ?? []).map((u) => [u.officerId, u]));
for (const officer of data.officers) {
  const links = posByOfficer.get(officer.id) ?? [];
  officer.positionIds = links.map((l) => l.positionId);
  officer.positionRoles = links;
  const un = unmappedById.get(officer.id);
  officer.archetypeStatus = links.length ? "mapped" : "unmapped";
  officer.unmappedReason = links.length ? null : (un?.reason ?? "unclassified");
  officer.unmappedNote = links.length ? null : (un?.note ?? null);
  if (!links.length && !un) throw new Error(`officer ${officer.id} ${officer.nameEn} is neither mapped nor listed as unmapped`);
  const pd = parseDate(officer.lastReliableTitleDate);
  officer.daysSinceTitle = pd ? daysBetween(pd.latest, cutoff) : null;
}
data.unmappedReasons = positionsSrc.unmappedReasons;

// ---------- official NPC terminations join (before day counts) ----------
const tlById = new Map(timelineSrc.records.map((r) => [r.id, r]));
if (trackerSrc.npcTerminations) {
  const zhToAdverse = new Map(data.adverse.map((a) => [a.nameZh, a]));
  for (const session of trackerSrc.npcTerminations.sessions ?? []) {
    for (const term of session.terminated) {
      const adverse = zhToAdverse.get(term.nameZh);
      if (!adverse) continue;
      const rec = tlById.get(adverse.id);
      if (!rec) continue;
      const ev = { date: session.date, kind: "npc_seat_revoked", url: session.url, publisher: session.publisher, sourceClass: "A1", verification: session.verification, note: `NPC deputy status terminated by the ${term.electionUnitZh} military congress (${term.actionZh}); recorded in the NPC Standing Committee credentials report of ${session.date}.` };
      if (!rec.formalAction || rec.formalAction.kind === "secondary_classification") rec.formalAction = ev;
      else if (rec.formalAction.date !== session.date && !(rec.intermediateActions ?? []).some((x) => x.kind === "npc_seat_revoked" && x.date === session.date)) rec.intermediateActions = [...(rec.intermediateActions ?? []), ev];
      if (adverse.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(adverse.date))) adverse.date = session.date;
    }
  }
}
for (const record of data.adverse) {
  const t = tlById.get(record.id);
  if (!t) throw new Error(`adverse record ${record.id} has no timeline entry`);
  const officialFormal = t.formalAction && t.formalAction.kind !== "secondary_classification";
  const officialFirst = t.firstConcreteSignal && t.firstConcreteSignal.kind !== "secondary_classification";
  const silenceDays = t.lastPublicAppearance && officialFirst ? daysBetween(t.lastPublicAppearance.date, t.firstConcreteSignal.date) : null;
  const processDays = officialFirst && officialFormal ? daysBetween(t.firstConcreteSignal.date, t.formalAction.date) : null;
  const totalDays = t.lastPublicAppearance && officialFormal ? daysBetween(t.lastPublicAppearance.date, t.formalAction.date) : null;
  const collectionState = t.lastPublicAppearance && officialFirst && officialFormal ? "complete" : (t.lastPublicAppearance || officialFirst || officialFormal ? "partial" : "not_yet_collected");
  record.timeline = { lastPublicAppearance: t.lastPublicAppearance, firstConcreteSignal: t.firstConcreteSignal, formalAction: t.formalAction, intermediateActions: t.intermediateActions ?? [], silenceDays, processDays, totalDays, collectionState, searchLane: t.searchLane, researchNotes: t.researchNotes ?? null };
}
data.signalKinds = timelineSrc.signalKinds;
const complete = data.adverse.filter((a) => a.timeline.collectionState === "complete");
const withSilence = data.adverse.filter((a) => typeof a.timeline.silenceDays === "number");
const withProcess = data.adverse.filter((a) => typeof a.timeline.processDays === "number");
data.ledgerClock = {
  cutoff,
  counts: Object.fromEntries(["complete", "partial", "not_yet_collected"].map((s) => [s, data.adverse.filter((a) => a.timeline.collectionState === s).length])),
  withLastAppearance: data.adverse.filter((a) => a.timeline.lastPublicAppearance).length,
  silence: { n: withSilence.length, medianDays: median(withSilence.map((a) => a.timeline.silenceDays)), minDays: withSilence.length ? Math.min(...withSilence.map((a) => a.timeline.silenceDays)) : null, maxDays: withSilence.length ? Math.max(...withSilence.map((a) => a.timeline.silenceDays)) : null },
  process: { n: withProcess.length, medianDays: median(withProcess.map((a) => a.timeline.processDays)), minDays: withProcess.length ? Math.min(...withProcess.map((a) => a.timeline.processDays)) : null, maxDays: withProcess.length ? Math.max(...withProcess.map((a) => a.timeline.processDays)) : null },
  completeIds: complete.map((a) => a.id),
};

// ---------- trackers ----------
const byZh = new Map();
for (const o of data.officers) byZh.set(o.nameZh, { kind: "officer", id: o.id, nameEn: o.nameEn });
for (const a of data.adverse) byZh.set(a.nameZh, { kind: "adverse", id: a.id, nameEn: a.nameEn });
const matchZh = (nameZh) => byZh.get(nameZh) ?? null;
const trackers = {};
if (trackerSrc.npcTerminations) {
  const sessions = (trackerSrc.npcTerminations.sessions ?? []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const rows = sessions.flatMap((s) => s.terminated.map((t) => ({ ...t, date: s.date, sessionZh: s.sessionZh, url: s.url, publisher: s.publisher, verification: s.verification, match: matchZh(t.nameZh) })));
  trackers.npcTerminations = { sessions, rows, summary: { sessions: sessions.length, terminated: rows.length, matchedToLedger: rows.filter((r) => r.match?.kind === "adverse").length, matchedToActive: rows.filter((r) => r.match?.kind === "officer").length, unmatched: rows.filter((r) => !r.match).length, byYear: Object.fromEntries(Object.entries(rows.reduce((acc, r) => { const y = r.date.slice(0, 4); acc[y] = (acc[y] ?? 0) + 1; return acc; }, {})).sort()) }, gaps: trackerSrc.npcTerminations.gaps ?? [] };
}
if (trackerSrc.promotionCeremonies) {
  const ceremonies = (trackerSrc.promotionCeremonies.ceremonies ?? []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const rows = ceremonies.flatMap((c) => c.promoted.map((p) => {
    const match = matchZh(p.nameZh);
    const adverse = match?.kind === "adverse" ? adverseById.get(match.id) : null;
    const first = adverse?.timeline?.firstConcreteSignal?.date ?? null;
    const formal = adverse?.timeline?.formalAction?.date ?? null;
    return { ...p, date: c.date, url: c.url, publisher: c.publisher, verification: c.verification, match, laterRemoved: Boolean(adverse), daysToFirstSignal: first ? daysBetween(c.date, first) : null, daysToFormalAction: formal ? daysBetween(c.date, formal) : null };
  }));
  trackers.promotionCeremonies = { ceremonies, rows, summary: { ceremonies: ceremonies.length, promoted: rows.length, laterRemoved: rows.filter((r) => r.laterRemoved).length, sameDayBillet: rows.filter((r) => r.billetNewSameDay === "yes").length, medianDaysToFirstSignal: median(rows.map((r) => r.daysToFirstSignal)), byYear: Object.fromEntries(Object.entries(rows.reduce((acc, r) => { const y = r.date.slice(0, 4); acc[y] = (acc[y] ?? 0) + 1; return acc; }, {})).sort()) }, gaps: trackerSrc.promotionCeremonies.gaps ?? [] };
}
if (trackerSrc.cc20Military) {
  const members = (trackerSrc.cc20Military.members ?? []).map((m) => {
    const match = matchZh(m.nameZh);
    let statusToday = "not_in_dataset";
    if (match?.kind === "adverse") { const a = adverseById.get(match.id); statusToday = a.status === "promotion-bypass-unresolved" ? "bypassed" : a.status === "missing-potential" ? "missing" : "removed"; }
    else if (match?.kind === "officer") { const o = officerById.get(match.id); statusToday = o.archetypeStatus === "mapped" ? "active_mapped" : "active_unmapped"; }
    return { ...m, match, statusToday };
  });
  const summary = members.reduce((acc, m) => { acc[m.statusToday] = (acc[m.statusToday] ?? 0) + 1; return acc; }, {});
  trackers.cc20Military = { source: trackerSrc.cc20Military.source, members, laterChanges: trackerSrc.cc20Military.laterChanges ?? [], summary: { total: members.length, full: members.filter((m) => m.membership === "full").length, alternate: members.filter((m) => m.membership === "alternate").length, byStatus: summary }, gaps: trackerSrc.cc20Military.gaps ?? [] };
}
if (trackerSrc.eventAttendance) {
  const events = (trackerSrc.eventAttendance.events ?? []).slice().sort((a, b) => a.date.localeCompare(b.date));
  for (const e of events) for (const att of e.namedMilitaryAttendees) att.match = matchZh(att.nameZh);
  const families = [...new Set(events.map((e) => e.family))];
  const misses = [];
  for (const family of families) {
    const fam = events.filter((e) => e.family === family);
    for (let i = 1; i < fam.length; i++) {
      const prev = fam[i - 1], cur = fam[i];
      if (cur.rosterComplete !== "complete_enumeration") continue;
      const present = new Set(cur.namedMilitaryAttendees.map((a) => a.nameZh));
      for (const att of prev.namedMilitaryAttendees) {
        if (present.has(att.nameZh)) continue;
        const match = matchZh(att.nameZh);
        const adverse = match?.kind === "adverse" ? adverseById.get(match.id) : null;
        misses.push({ family, nameZh: att.nameZh, nameEn: att.nameEn, expectedFrom: prev.date, missedAt: cur.date, missedEventUrl: cur.url, match, laterResolution: adverse ? { status: adverse.status, formalActionDate: adverse.timeline?.formalAction?.date ?? null, firstSignalDate: adverse.timeline?.firstConcreteSignal?.date ?? null } : null });
      }
    }
  }
  trackers.eventAttendance = { events, families, misses, summary: { events: events.length, families: families.length, completeRosters: events.filter((e) => e.rosterComplete === "complete_enumeration").length, misses: misses.length, missesLaterConfirmedAdverse: misses.filter((m) => m.laterResolution).length }, gaps: trackerSrc.eventAttendance.gaps ?? [] };
}
if (trackerSrc.seatTurnovers) {
  const posById = new Map(data.positions.map((p) => [p.id, p]));
  const turnovers = (trackerSrc.seatTurnovers.turnovers ?? []).map((t) => {
    const pos = posById.get(t.positionId) ?? null;
    const closed = Boolean(t.successorAppointment);
    const daysOpen = t.predecessorExit?.date ? daysBetween(t.predecessorExit.date, closed ? t.successorAppointment.date : cutoff) : null;
    const handlerDays = t.handlerFirstSeen?.date ? daysBetween(t.handlerFirstSeen.date, closed ? t.successorAppointment.date : cutoff) : null;
    return { ...t, positionKnown: Boolean(pos), tier: pos?.tier ?? null, coverageNow: pos?.coverage ?? null, closed, daysOpen, handlerDays };
  });
  const open = turnovers.filter((t) => !t.closed), closedT = turnovers.filter((t) => t.closed);
  trackers.seatTurnovers = { turnovers, summary: { turnovers: turnovers.length, closed: closedT.length, open: open.length, medianDaysToFill: median(closedT.map((t) => t.daysOpen)), medianDaysOpenStillVacant: median(open.map((t) => t.daysOpen)), withHandler: turnovers.filter((t) => t.handlerNameZh).length }, gaps: trackerSrc.seatTurnovers.gaps ?? [] };
}
// title-freshness monitor (no research needed)
{
  const principal = data.positions.filter((p) => !p.isBench);
  const withHolder = principal.filter((p) => p.holders.length);
  const band = (d) => d == null ? "undated" : d <= 90 ? "within_90_days" : d <= 180 ? "within_180_days" : d <= 365 ? "within_365_days" : "over_365_days";
  const queue = data.officers.filter((o) => o.archetypeStatus === "mapped").map((o) => ({ officerId: o.id, nameEn: o.nameEn, nameZh: o.nameZh, positionIds: o.positionIds, roleState: o.roleState, lastReliableTitleDate: o.lastReliableTitleDate, daysSinceTitle: o.daysSinceTitle, band: band(o.daysSinceTitle) })).sort((a, b) => (b.daysSinceTitle ?? 1e9) - (a.daysSinceTitle ?? 1e9));
  trackers.titleFreshness = { cutoff, summary: { principalSeats: principal.length, principalSeatsWithHolder: withHolder.length, byBand: queue.reduce((acc, q) => { acc[q.band] = (acc[q.band] ?? 0) + 1; return acc; }, {}), principalSeatsFreshWithin180: withHolder.filter((p) => p.freshestTitleDays != null && p.freshestTitleDays <= 180).length }, queue };
}
data.trackers = trackers;

// ---------- review log ----------
data.reviewLog = reviewLog.entries ?? [];

// ---------- gaps: attach position ids where a gap names a billet pool matching a tier ----------
for (const gap of data.gaps) gap.positionIds = gap.positionIds ?? [];
const g13 = data.gaps.find((g) => g.id === "G13");
if (g13) { g13.status = "deprioritized"; g13.reviewNote = "External subject-matter review (September 2026) judged the senior-cadre course probably irrelevant to selection; the premise P-RECERT is retired. Kept for the record, not pursued."; }

// ---------- metadata ----------
const count = (arr, key) => Object.entries(arr.reduce((acc, x) => { acc[x[key]] = (acc[x[key]] ?? 0) + 1; return acc; }, {})).map(([k, v]) => ({ [key === "tier" ? "tier" : "state"]: k, count: v }));
const principalPositions = data.positions.filter((p) => !p.isBench);
const activeIds = new Set(data.officers.map((o) => o.id));
for (const gap of data.gaps) gap.people = (gap.people ?? []).filter((id) => activeIds.has(id));
for (const officer of data.officers) {
  officer.signals.openGapCount = (officer.gapIds ?? []).filter((id) => data.gaps.some((g) => g.id === id && g.status === "open")).length;
  officer.assessmentAsOf = cutoff;
}
const birthKnown = data.officers.filter((o) => o.birthYear).length;
const birthGap = data.gaps.find((g) => g.id === "G06");
if (birthGap) { birthGap.title = `Birth evidence lacks a usable numeric year for ${data.officers.length - birthKnown} of ${data.officers.length} active dossiers`; birthGap.lastChecked = cutoff; }
const titleFreshness = (date) => { const y = parseDate(date)?.iso?.slice(0, 4); if (!y) return "unknown"; return y >= "2026" ? "observed_2026" : y === "2025" ? "observed_2025" : "pre_2025"; };
const buildSeed = JSON.stringify({ v: 8, cutoff, positions: data.positions.map((p) => [p.id, p.coverage, p.holders.map((h) => h.officerId)]), adverse: data.adverse.map((a) => [a.id, a.controlledState, a.timeline.collectionState, a.timeline.lastPublicAppearance?.date ?? null]), officers: data.officers.map((o) => [o.id, o.roleState, o.lastReliableTitleDate]), trackers: Object.keys(trackers).sort(), gaps: data.gaps.map((g) => [g.id, g.status]) });
const buildId = `PLA26-V8-${createHash("sha256").update(buildSeed).digest("hex").slice(0, 12).toUpperCase()}`;
Object.assign(data.metadata, {
  asOf: cutoff, buildId, schemaVersion: 8,
  framework: { unit: "position", archetypeVersion: positionsSrc.archetypeVersion, tierCount: data.positionTiers.length, positionCount: data.positions.length, principalSeatCount: principalPositions.length, benchSlotCount: data.positions.length - principalPositions.length },
  officerCount: data.officers.length,
  identityHeldCount: data.identityHeldRecords.length,
  mappedOfficerCount: data.officers.filter((o) => o.archetypeStatus === "mapped").length,
  unmappedOfficerCount: data.officers.filter((o) => o.archetypeStatus === "unmapped").length,
  positionCoverageCounts: count(principalPositions, "coverage").sort((a, b) => b.count - a.count),
  positionTierCounts: data.positionTiers.map((t) => ({ tier: t.id, label: t.label, positions: data.positions.filter((p) => p.tier === t.id).length, principalSeats: principalPositions.filter((p) => p.tier === t.id).length, coverage: Object.fromEntries(COVERAGE_STATES.map((s) => [s, principalPositions.filter((p) => p.tier === t.id && p.coverage === s).length])) })),
  gapCount: data.gaps.length, adverseCount: data.adverse.length,
  ledgerClock: data.ledgerClock,
  trackerKeys: Object.keys(trackers).sort(),
  birthYearKnownCount: birthKnown,
  mappedPersonCount: data.officers.filter((o) => o.claims.length > 0).length,
  currentRoleMappedCount: data.officers.filter((o) => o.evidence.currentRoleMapped).length,
  undatedTitleCount: data.officers.filter((o) => !parseDate(o.lastReliableTitleDate)).length,
  olderTitleCount: data.officers.filter((o) => titleFreshness(o.lastReliableTitleDate) === "pre_2025").length,
  roleStateCounts: count(data.officers, "roleState"),
  branchCounts: Object.entries(data.officers.reduce((acc, o) => { acc[o.branch] = (acc[o.branch] ?? 0) + 1; return acc; }, {})).map(([branch, c]) => ({ branch, count: c })).sort((a, b) => b.count - a.count || a.branch.localeCompare(b.branch)),
  reviewCount: data.reviewLog.length,
  editorialNote: "A position-first leadership observatory. A fixed archetype of senior positions defines what is covered and what is a gap; the adverse ledger records last appearance, first signal and formal action for every removed officer; narrow trackers measure one question each from bounded official sources. No promotion probabilities are published.",
});

// ---------- write ----------
const csvEscape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
const csvRows = [
  ["stable_id", "name_en", "name_zh", "institution_family", "institution", "recorded_billet", "reported_military_rank", "appointment_record", "current_title_source", "title_freshness", "primary_mapped_claims", "birth_record", "open_gap_count", "last_corroborated", "days_since_title", "source_count", "linked_gap_ids", "archetype_status", "position_ids", "unmapped_reason"],
  ...data.officers.map((o) => [o.id, o.nameEn, o.nameZh, o.branch, o.institution, o.billet, o.rank, o.signals.appointmentRecord, o.signals.currentRoleSource, o.signals.titleFreshness, o.signals.primaryMappedClaims, o.signals.birthRecord, o.signals.openGapCount, o.lastReliableTitleDate, o.daysSinceTitle ?? "", o.sourceCount, (o.gapIds ?? []).join("|"), o.archetypeStatus, o.positionIds.join("|"), o.unmappedReason ?? ""]),
];
await Promise.all([
  writeFile(rp("app/data/observatory.json"), `${JSON.stringify(data)}\n`),
  writeFile(rp("public/data/pla-leadership-observatory-public.json"), `${JSON.stringify(data, null, 2)}\n`),
  writeFile(rp("public/data/pla-leadership-observatory-public.csv"), `${csvRows.map((r) => r.map(csvEscape).join(",")).join("\n")}\n`),
]);
console.log(JSON.stringify({ buildId, officers: data.officers.length, positions: data.positions.length, principalSeats: principalPositions.length, coverage: data.metadata.positionCoverageCounts, ledgerClock: data.ledgerClock.counts, trackers: Object.keys(trackers) }, null, 1));
