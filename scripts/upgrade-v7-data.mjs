import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "app/data/observatory.json");
const publicPath = path.join(root, "public/data/pla-leadership-observatory-public.json");
const csvPath = path.join(root, "public/data/pla-leadership-observatory-public.csv");
const frontierPath = path.join(root, "research/v7-research-frontier.json");

const [rawData, rawFrontier] = await Promise.all([
  readFile(appPath, "utf8"),
  readFile(frontierPath, "utf8"),
]);
const data = JSON.parse(rawData);
const frontier = JSON.parse(rawFrontier);

const mergeById = (existing, additions) => {
  const merged = new Map(existing.map((item) => [item.id, item]));
  for (const item of additions) merged.set(item.id, item);
  return [...merged.values()];
};

for (const move of frontier.adverseMoves) {
  const officer = data.officers.find((item) => item.nameEn === move.nameEn);
  const priorAdverse = data.adverse.find((item) => item.nameEn === move.nameEn);
  data.officers = data.officers.filter((item) => item.nameEn !== move.nameEn);
  const record = {
    id: officer?.id ?? priorAdverse?.id ?? `V7-${move.nameEn.toUpperCase().replaceAll(" ", "-")}`,
    nameEn: move.nameEn,
    nameZh: move.nameZh,
    formerBranch: officer?.branch ?? priorAdverse?.formerBranch ?? "Institution unresolved",
    formerRole: officer?.billet ?? priorAdverse?.formerRole ?? "Former role not established",
    status: move.status,
    controlledState: "unresolved_adverse_watch",
    date: move.date,
    summary: move.summary,
    evidenceConfidence: "high for the Party-selection bypass; unresolved for cause",
    sources: move.sources,
  };
  const index = data.adverse.findIndex((item) => item.nameEn === move.nameEn);
  if (index >= 0) data.adverse[index] = record;
  else data.adverse.push(record);
}

data.systemSources = mergeById(data.systemSources, frontier.systemSources);
data.contextSources = mergeById(data.contextSources, frontier.contextSources);
data.gaps = mergeById(data.gaps, frontier.gaps).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const activeIds = new Set(data.officers.map((officer) => officer.id));
for (const gap of data.gaps) gap.people = (gap.people ?? []).filter((id) => activeIds.has(id));
for (const officer of data.officers) {
  const linked = data.gaps.filter((gap) => gap.people.includes(officer.id)).map((gap) => gap.id);
  officer.gapIds = [...new Set([...(officer.gapIds ?? []), ...linked])].sort();
  officer.signals.openGapCount = officer.gapIds.filter((id) => data.gaps.some((gap) => gap.id === id && gap.status === "open")).length;
  officer.assessmentAsOf = frontier.cutoff;
}
const birthKnown = data.officers.filter((officer) => officer.birthYear).length;
const birthGap = data.gaps.find((gap) => gap.id === "G06");
if (birthGap) {
  birthGap.title = `Birth evidence lacks a usable numeric year for ${data.officers.length - birthKnown} of ${data.officers.length} active dossiers`;
  birthGap.lastChecked = frontier.cutoff;
}

const roleStateCounts = Object.entries(data.officers.reduce((acc, officer) => {
  acc[officer.roleState] = (acc[officer.roleState] ?? 0) + 1;
  return acc;
}, {})).map(([state, count]) => ({ state, count }));
const branchCounts = Object.entries(data.officers.reduce((acc, officer) => {
  acc[officer.branch] = (acc[officer.branch] ?? 0) + 1;
  return acc;
}, {})).map(([branch, count]) => ({ branch, count })).sort((a, b) => b.count - a.count || a.branch.localeCompare(b.branch));

const titleFreshness = (date) => {
  if (!date || date === "unknown") return "unknown";
  const year = Number(String(date).match(/\b(20\d{2})\b/)?.[1]);
  if (!Number.isFinite(year)) return "unknown";
  if (year >= 2026) return "observed_2026";
  if (year === 2025) return "observed_2025";
  return "pre_2025";
};

const buildSeed = JSON.stringify({
  frontier,
  officers: data.officers.map((officer) => [officer.id, officer.roleState, officer.lastReliableTitleDate]),
  adverse: data.adverse.map((record) => [record.id, record.controlledState, record.date]),
  gaps: data.gaps,
});
const buildId = `PLA26-V7-${createHash("sha256").update(buildSeed).digest("hex").slice(0, 12).toUpperCase()}`;

Object.assign(data.metadata, {
  asOf: frontier.cutoff,
  buildId,
  officerCount: data.officers.length,
  gapCount: data.gaps.length,
  adverseCount: data.adverse.length,
  birthYearKnownCount: birthKnown,
  mappedPersonCount: data.officers.filter((officer) => officer.claims.length > 0).length,
  currentRoleMappedCount: data.officers.filter((officer) => officer.evidence.currentRoleMapped).length,
  undatedTitleCount: data.officers.filter((officer) => !officer.lastReliableTitleDate || officer.lastReliableTitleDate === "unknown").length,
  olderTitleCount: data.officers.filter((officer) => titleFreshness(officer.lastReliableTitleDate) === "pre_2025").length,
  roleStateCounts,
  branchCounts,
  editorialNote: "A source-first leadership observatory. Event-specific ranges assess conditional structural promotability; documentary completeness, hidden political clearance, observable command behavior, adverse state, and institutional consequence remain separate.",
});

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvRows = [
  ["stable_id", "name_en", "name_zh", "institution_family", "institution", "recorded_billet", "reported_military_rank", "appointment_record", "current_title_source", "title_freshness", "primary_mapped_claims", "birth_record", "open_gap_count", "last_corroborated", "source_count", "linked_gap_ids"],
  ...data.officers.map((officer) => [officer.id, officer.nameEn, officer.nameZh, officer.branch, officer.institution, officer.billet, officer.rank, officer.signals.appointmentRecord, officer.signals.currentRoleSource, officer.signals.titleFreshness, officer.signals.primaryMappedClaims, officer.signals.birthRecord, officer.signals.openGapCount, officer.lastReliableTitleDate, officer.sourceCount, officer.gapIds.join("|")]),
];

await Promise.all([
  writeFile(appPath, `${JSON.stringify(data)}\n`),
  writeFile(publicPath, `${JSON.stringify(data, null, 2)}\n`),
  writeFile(csvPath, `${csvRows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`),
]);

console.log(JSON.stringify({
  buildId,
  officers: data.officers.length,
  adverse: data.adverse.length,
  gaps: data.gaps.length,
  systemSources: data.systemSources.length,
  contextSources: data.contextSources.length,
}));
