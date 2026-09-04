// Merge research results into the checked-in research files.
//   node scripts/merge-research-results.mjs <file.json> [...]
// Each file is either {results:[...]} (ledger-clock research, one entry per adverse id),
// {checks:[...]} (a verification pass), or a tracker lane object (sessions|ceremonies|members|events|turnovers).
// Idempotent: re-running with the same inputs produces the same files.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rp = (...p) => path.join(root, ...p);
const files = process.argv.slice(2);
if (!files.length) { console.error("usage: node scripts/merge-research-results.mjs <results.json>..."); process.exit(1); }
const timeline = JSON.parse(await readFile(rp("research/adverse-timeline.json"), "utf8"));
const byId = new Map(timeline.records.map((r) => [r.id, r]));
const keep = ["date", "datePrecision", "kind", "event", "titleZh", "url", "publisher", "sourceClass", "verification", "note"];
const pick = (x) => Object.fromEntries(keep.filter((k) => k in x).map((k) => [k, x[k]]));
const ok = (e) => e && typeof e.url === "string" && e.url.startsWith("http") && e.date;
let ledgerMerged = 0; const eventLanes = [];
await mkdir(rp("research/trackers"), { recursive: true });
for (const file of files) {
  const r = JSON.parse(await readFile(file, "utf8"));
  if (Array.isArray(r.results)) {
    for (const x of r.results) {
      const rec = byId.get(x.id); if (!rec) { console.warn("unknown id", x.id); continue; }
      if (ok(x.lastPublicAppearance)) rec.lastPublicAppearance = pick(x.lastPublicAppearance);
      const seed = rec.firstConcreteSignal;
      if (ok(x.firstConcreteSignal) && (!seed || seed.kind === "secondary_classification" || x.firstConcreteSignal.date < seed.date)) rec.firstConcreteSignal = pick(x.firstConcreteSignal);
      if (ok(x.formalAction) && (!rec.formalAction || rec.formalAction.kind === "secondary_classification")) rec.formalAction = pick(x.formalAction);
      rec.researchNotes = x.researchNotes ?? rec.researchNotes; rec.researchConfidence = x.confidence ?? rec.researchConfidence;
      rec.seededUrlChecks = x.seededUrlChecks ?? rec.seededUrlChecks ?? []; rec.searchLog = x.searchLog ?? rec.searchLog ?? [];
      ledgerMerged++;
    }
    if (r.sampleVerification?.checks?.length) timeline.verification = [...(timeline.verification ?? []), ...r.sampleVerification.checks];
  } else if (Array.isArray(r.checks)) timeline.verification = [...(timeline.verification ?? []), ...r.checks];
  else if (r.sessions) await writeFile(rp("research/trackers/npc-terminations.json"), JSON.stringify(r, null, 2) + "\n");
  else if (r.ceremonies) await writeFile(rp("research/trackers/promotion-ceremonies.json"), JSON.stringify(r, null, 2) + "\n");
  else if (r.members) await writeFile(rp("research/trackers/cc20-military.json"), JSON.stringify(r, null, 2) + "\n");
  else if (r.turnovers) await writeFile(rp("research/trackers/seat-turnovers.json"), JSON.stringify(r, null, 2) + "\n");
  else if (r.events) eventLanes.push(r);
  else console.warn("unrecognized result shape in", file);
}
if (eventLanes.length) {
  const seen = new Set(); const events = []; const gaps = []; const searchLog = [];
  for (const lane of eventLanes) { for (const e of lane.events) { const k = `${e.family}|${e.date}|${e.url}`; if (!seen.has(k)) { seen.add(k); events.push(e); } } gaps.push(...(lane.gaps ?? [])); searchLog.push(...(lane.searchLog ?? [])); }
  await writeFile(rp("research/trackers/event-attendance.json"), JSON.stringify({ events, gaps, searchLog }, null, 2) + "\n");
}
await writeFile(rp("research/adverse-timeline.json"), JSON.stringify(timeline, null, 2) + "\n");
console.log(JSON.stringify({ ledgerMerged, withLastAppearance: timeline.records.filter((r) => r.lastPublicAppearance).length, eventLanes: eventLanes.length }));
