// Shared rules for the v8 build and its tests: date parsing, day arithmetic, coverage derivation.
// ---------- date helpers ----------
export function parseDate(value) {
  if (value == null) return null;
  const s = String(value).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return { iso: s, precision: "day", latest: s };
  m = s.match(/^(\d{4})-(\d{2})$/);
  if (m) { const last = new Date(Date.UTC(Number(m[1]), Number(m[2]), 0)).toISOString().slice(0, 10); return { iso: s, precision: "month", latest: last }; }
  m = s.match(/^(\d{4})$/);
  if (m) return { iso: s, precision: "year", latest: `${m[1]}-12-31` };
  m = s.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (m) return { iso: m[0], precision: "day", latest: m[0] };
  m = s.match(/\b(20\d{2})\b/);
  if (m) return { iso: m[1], precision: "year", latest: `${m[1]}-12-31` };
  return null;
}
export function daysBetween(a, b) {
  const pa = parseDate(a), pb = parseDate(b);
  if (!pa || !pb) return null;
  return Math.round((Date.parse(pb.latest) - Date.parse(pa.latest)) / 86400000);
}
export const median = (xs) => { const v = xs.filter((x) => typeof x === "number").sort((a, b) => a - b); if (!v.length) return null; const mid = Math.floor(v.length / 2); return v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2); };

export const COVERAGE_STATES = ["formal_current", "dated_official", "acting_or_inferred", "stale", "conflicting", "handled_without_title", "adverse_vacancy", "held_in_adverse_watch", "external", "no_record"];
export function deriveCoverage(pos) {
  const states = pos.holders.map((h) => h.roleState);
  if (states.length) {
    if (states.includes("conflicting_current") || (pos.seats === 1 && states.length > 1)) return "conflicting";
    if (states.includes("formal_current")) return "formal_current";
    if (states.includes("official_title_with_scope_caveat")) return "dated_official";
    if (states.some((s) => s === "acting_role_mixture" || s === "inferred_current")) return "acting_or_inferred";
    return "stale";
  }
  if (pos.handlers.length) return "handled_without_title";
  if (pos.adverse.length) return pos.adverse.some((a) => a.controlledState === "confirmed_exit") ? "adverse_vacancy" : "held_in_adverse_watch";
  if (pos.externalHolder) return "external";
  return "no_record";
}
