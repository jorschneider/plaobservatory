"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  CircleDot,
  Clock,
  Database,
  Download,
  FileSearch,
  Filter,
  LayoutGrid,
  Network,
  Scale,
  Search,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import observatoryJson from "./data/observatory.json";
import {
  calibrationCases,
  forecastLedger,
  framework,
  glossary,
  judgments,
  limits,
  observationClocks,
  premises,
  releaseRules,
  researchQuestions,
  routeEvidence,
  titleParsingRules,
} from "./data/assessment";

// ---------- types ----------
type Source = { id?: string | null; url: string; class?: string | null; date?: string | null; publisher?: string | null; scope?: string | null; scopes?: string[]; people?: { id: string; nameEn: string; nameZh: string }[]; mode?: string | null; family?: string | null };
type Claim = { id: string; field: string; value: string; type: string; observedAt?: string | null; sourceUrl?: string | null; temporalScope?: string | null; doesNotSupport?: string | null };
type Officer = {
  id: string; nameEn: string; nameZh: string; identityNote?: string | null; branch: string; institution: string; serviceOrigin?: string | null; serviceOriginDetail?: string | null; billet: string; rank?: string | null; roleState: string; roleStateDetail?: string | null; lastReliableTitleDate?: string | null; birthYear?: number | null; birthPrecision?: string | null; partyStatus?: string | null; stateCmcStatus?: string | null; npcStatus?: string | null; disciplineNote?: string | null;
  evidence: { grade: string; label: string; caveat?: string | null; mappedClaims: number; primaryMappedClaims: number; currentRoleMapped: boolean };
  signals: { appointmentRecord: string; titleFreshness: string; currentRoleSource: string; rankRecord: string; partyRecord: string; stateCmcRecord: string; npcRecord: string; birthRecord: string; primaryMappedClaims: number; openGapCount: number };
  sourceCount: number; sources: Source[]; claims: Claim[]; gapIds: string[];
  positionIds: string[]; positionRoles: { positionId: string; role: string }[]; archetypeStatus: string; unmappedReason?: string | null; unmappedNote?: string | null; daysSinceTitle?: number | null;
};
type Gap = { id: string; title: string; status: string; whyItMatters: string; evidenceNeeded: string; searchLane?: string | null; doNotAssume?: string | null; lastChecked?: string | null; people: string[]; reviewNote?: string | null };
type TimelineEvent = { date: string; kind?: string; event?: string; titleZh?: string; url: string; publisher?: string; sourceClass?: string; verification?: string; note?: string; datePrecision?: string };
type AdverseRecord = {
  id: string; nameEn: string; nameZh: string; formerBranch?: string | null; formerRole?: string | null; status: string; controlledState: string; date?: string | null; summary?: string | null; evidenceConfidence?: string | null; sources: string[];
  timeline: { lastPublicAppearance: TimelineEvent | null; firstConcreteSignal: TimelineEvent | null; formalAction: TimelineEvent | null; intermediateActions: TimelineEvent[]; silenceDays: number | null; processDays: number | null; totalDays: number | null; collectionState: string; searchLane?: string | null; researchNotes?: string | null };
};
type Holder = { officerId: string; nameEn: string; nameZh: string; billet: string; roleState: string; lastReliableTitleDate?: string | null; daysSinceTitle: number | null };
type Position = { id: string; tier: string; organization: string; organizationZh: string; position: string; positionZh: string; gradeBand: string; seats: number; isBench: boolean; holders: Holder[]; handlers: Holder[]; adverse: { adverseId: string; nameEn: string; nameZh: string; status: string; controlledState: string; date?: string | null }[]; externalHolder: { name: string; nameZh: string; note: string; url: string } | null; note: string; searchLane: string; coverage: string; freshestTitleDays: number | null };
type Tier = { id: string; label: string; labelZh: string; plain: string };
type SystemSource = { id: string; title: string; publisher?: string | null; url: string; date?: string | null; class?: string | null; supports: string[]; doesNotSupport: string[] };
type ReviewEntry = { id: string; date: string; source: string; concern: string; response: string; changed: string[]; notChanged: string[] };
type Trackers = {
  titleFreshness?: { cutoff: string; summary: { principalSeats: number; principalSeatsWithHolder: number; byBand: Record<string, number>; principalSeatsFreshWithin180: number }; queue: { officerId: string; nameEn: string; nameZh: string; positionIds: string[]; roleState: string; lastReliableTitleDate?: string | null; daysSinceTitle: number | null; band: string }[] };
  npcTerminations?: { sessions: { date: string; sessionZh: string; url: string; publisher: string; verification: string; note: string; terminated: { nameZh: string; nameEn: string; electionUnitZh: string; actionZh: string; statedReasonZh: string }[] }[]; rows: { nameZh: string; nameEn: string; electionUnitZh: string; actionZh: string; date: string; url: string; match: { kind: string; id: string } | null }[]; summary: { sessions: number; terminated: number; matchedToLedger: number; matchedToActive: number; unmatched: number; byYear: Record<string, number> }; gaps: string[] };
  promotionCeremonies?: { ceremonies: { date: string; url: string; verification: string; note: string; promoted: { nameZh: string; nameEn: string; billetZh: string; billetEn: string; billetNewSameDay: string }[] }[]; rows: { nameZh: string; nameEn: string; billetEn: string; billetZh: string; billetNewSameDay: string; date: string; url: string; match: { kind: string; id: string } | null; laterRemoved: boolean; daysToFirstSignal: number | null; daysToFormalAction: number | null }[]; summary: { ceremonies: number; promoted: number; laterRemoved: number; sameDayBillet: number; medianDaysToFirstSignal: number | null; byYear: Record<string, number> }; gaps: string[] };
  cc20Military?: { source: { url: string; date: string; publisher: string }; members: { nameZh: string; nameEn: string; membership: string; alternateRank: number; positionAtElectionEn: string; statusToday: string; match: { kind: string; id: string } | null }[]; laterChanges: { date: string; event: string; url: string; namesZh: string[] }[]; summary: { total: number; full: number; alternate: number; byStatus: Record<string, number> }; gaps: string[] };
  eventAttendance?: { events: { family: string; date: string; titleZh: string; url: string; rosterComplete: string; namedMilitaryAttendees: { nameZh: string; nameEn: string; titleZh: string }[] }[]; families: string[]; misses: { family: string; nameZh: string; nameEn: string; expectedFrom: string; missedAt: string; missedEventUrl: string; match: { kind: string; id: string } | null; laterResolution: { status: string; formalActionDate: string | null; firstSignalDate: string | null } | null }[]; summary: { events: number; families: number; completeRosters: number; misses: number; missesLaterConfirmedAdverse: number }; gaps: string[] };
  seatTurnovers?: { turnovers: { positionId: string; positionLabel: string; predecessorNameEn: string; predecessorNameZh: string; predecessorExit: { date: string; kind: string; url: string }; successorNameEn: string; successorNameZh: string; successorAppointment: { date: string; kind: string; url: string; titleZh: string } | null; handlerNameZh: string; handlerFirstSeen: { date: string; url: string; evidence: string } | null; positionKnown: boolean; closed: boolean; daysOpen: number | null; handlerDays: number | null; coverageNow: string | null }[]; summary: { turnovers: number; closed: number; open: number; medianDaysToFill: number | null; medianDaysOpenStillVacant: number | null; withHandler: number }; gaps: string[] };
};
type ObservatoryData = {
  metadata: {
    title: string; asOf: string; buildId: string; schemaVersion: number; officerCount: number; canonicalOfficerCount: number; identityHeldCount: number; adverseHeldCount: number; sourceCount: number; primaryOfficialSourceCount: number; sourceFamilyCounts: { family: string; count: number }[]; gapCount: number; adverseCount: number; mappedPersonCount: number; currentRoleMappedCount: number; undatedTitleCount: number; olderTitleCount: number; discoveryOnlySourceCount: number; roleStateCounts: { state: string; count: number }[]; branchCounts: { branch: string; count: number }[];
    framework: { unit: string; archetypeVersion: string; tierCount: number; positionCount: number; principalSeatCount: number; benchSlotCount: number };
    mappedOfficerCount: number; unmappedOfficerCount: number; positionCoverageCounts: { state: string; count: number }[]; positionTierCounts: { tier: string; label: string; positions: number; principalSeats: number; coverage: Record<string, number> }[];
    ledgerClock: { counts: Record<string, number>; withLastAppearance: number; silence: { n: number; medianDays: number | null; minDays: number | null; maxDays: number | null }; process: { n: number; medianDays: number | null; minDays: number | null; maxDays: number | null } };
    trackerKeys: string[]; reviewCount: number; editorialNote: string;
  };
  officers: Officer[]; gaps: Gap[]; adverse: AdverseRecord[]; sources: Source[]; systemSources: SystemSource[]; positions: Position[]; positionTiers: Tier[]; unmappedReasons: Record<string, string>; signalKinds: Record<string, string>; trackers: Trackers; reviewLog: ReviewEntry[];
  identityHeldRecords: { id: string; nameEn: string; nameZh: string; note: string; heldReason?: string }[]; adverseHeldRecords: { id: string; nameEn: string; nameZh: string; note: string }[];
};

const data = observatoryJson as unknown as ObservatoryData;

// ---------- labels ----------
const roleStateLabel: Record<string, string> = {
  formal_current: "Formally documented",
  official_title_with_scope_caveat: "Official title, limited scope",
  acting_role_mixture: "Unresolved acting mixture",
  inferred_current: "Reported or observed",
  conflicting_current: "Conflicting reports",
  stale_or_unknown: "Stale or unknown",
  legacy_unverified: "Legacy record, not current",
  identity_unresolved: "Identity unresolved",
};
const coverageLabel: Record<string, string> = {
  formal_current: "Formal holder",
  dated_official: "Dated official title",
  acting_or_inferred: "Acting or inferred holder",
  stale: "Stale record only",
  conflicting: "Conflicting record",
  handled_without_title: "Run without the title",
  adverse_vacancy: "Vacant after removal",
  held_in_adverse_watch: "Holder in adverse watch",
  external: "Held by the chairman",
  no_record: "No public record",
};
const coveragePlain: Record<string, string> = {
  formal_current: "A formal appointment or repeated official naming supports the holder now.",
  dated_official: "An official source gave the title on a date; continuity after it is not established.",
  acting_or_inferred: "The holder rests on acting language or on repeated reports, not on an appointment.",
  stale: "The only record is old enough that we do not treat it as current.",
  conflicting: "Credible sources disagree about who holds the seat.",
  handled_without_title: "Someone is seen doing the job, but no source has ever given them the title.",
  adverse_vacancy: "The last known holder was removed and nobody has been named since.",
  held_in_adverse_watch: "The only reported holder is missing or was passed over, so no holder is published.",
  external: "The chairman's own seat.",
  no_record: "We found no dated source naming anyone. This does not mean the seat is empty.",
};
const coverageOrder = ["formal_current", "dated_official", "acting_or_inferred", "handled_without_title", "conflicting", "stale", "adverse_vacancy", "held_in_adverse_watch", "no_record", "external"];
const sourceFamilyLabel: Record<string, string> = { formal_decision: "Formal decision", official_primary: "Official / institutional", specialist_research: "Specialist research", discovery_or_other: "Discovery / other" };
const branchShortLabel: Record<string, string> = { "PLA Army / military district": "Army", "CMC / central joint": "CMC / joint", "PLA Navy / Marines": "Navy / Marines", "Joint theater command": "Theater commands", "PLA Air Force": "Air Force", "Aerospace / cyberspace / information": "Space / cyber / information", "Institution unresolved": "Institution unresolved", "PLA Rocket Force": "Rocket Force", "People's Armed Police": "PAP", "Joint Logistics": "Joint logistics", "Military education / research": "Education / research" };
const kindLabel: Record<string, string> = { absence_noted: "Absence at a high-expectancy event", press_report: "Press report", replacement_named: "Successor named", investigation_announced: "Investigation announced", suspension_announced: "Suspension announced", npc_seat_revoked: "NPC seat terminated", state_office_removed: "Removed from state office", state_cmc_removed: "Removed from state CMC", expulsion_announced: "Expelled from Party and military", party_bypass: "Passed over at a plenum", npc_gazette_reported: "NPC gazette reported", secondary_classification: "Specialist classification only", other: "Other" };
const collectionLabel: Record<string, string> = { complete: "Complete", partial: "Partial", not_yet_collected: "Not yet collected" };
const bandLabel: Record<string, string> = { within_90_days: "Titled within 90 days", within_180_days: "Within 180 days", within_365_days: "Within a year", over_365_days: "Over a year", undated: "No usable date" };
const statusTodayLabel: Record<string, string> = { active_mapped: "Active, mapped to a seat", active_unmapped: "Active, outside the archetype", removed: "Removed", missing: "Missing", bypassed: "Passed over", not_in_dataset: "Not in this dataset" };
const familyLabel: Record<string, string> = { cmc_tree_planting: "CMC tree-planting", august_first_reception: "1 August reception", npc_military_delegation: "NPC military delegation", cc_plenum: "Central Committee plenum", promotion_ceremony: "Promotion ceremony", political_work_conference: "Political-work conference" };

// ---------- helpers ----------
function humanDate(value?: string | null) {
  if (!value || value === "unknown") return "Not established";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00Z`));
}
function sourceHost(url: string) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "source"; } }
function roleStateTone(state: string) {
  if (state === "formal_current") return "status-confirmed";
  if (state === "official_title_with_scope_caveat" || state === "acting_role_mixture" || state === "inferred_current") return "status-observed";
  if (state === "conflicting_current" || state === "identity_unresolved") return "status-conflict";
  return "status-unknown";
}
function coverageTone(state: string) {
  if (state === "formal_current" || state === "external") return "status-confirmed";
  if (state === "dated_official" || state === "acting_or_inferred") return "status-observed";
  if (state === "conflicting" || state === "adverse_vacancy" || state === "held_in_adverse_watch" || state === "handled_without_title") return "status-conflict";
  return "status-unknown";
}
function fill(template: string, vars: Record<string, string | number | null | undefined>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => { const v = vars[key]; return v === null || v === undefined ? "n/a" : String(v); });
}
function days(n: number | null | undefined) { return n === null || n === undefined ? "—" : `${n} d`; }
function Term({ term, children }: { term: string; children?: React.ReactNode }) {
  const entry = glossary.find((g) => g.term.toLowerCase() === term.toLowerCase());
  return <span className="term" title={entry?.plain ?? term}>{children ?? term}</span>;
}
function MetricCard({ value, label, detail, icon: Icon }: { value: string | number; label: string; detail: string; icon: typeof Users }) {
  return <article className="metric-card"><div className="metric-icon"><Icon aria-hidden="true" /></div><div><p className="metric-value">{value}</p><p className="metric-label">{label}</p><p className="metric-detail">{detail}</p></div></article>;
}
function SourceLink({ source }: { source: Source }) {
  return <a className="source-link" href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.publisher || sourceHost(source.url)}</strong><small>{source.date ? humanDate(source.date) : "Date not recorded"} · {source.class || "Unclassified"}</small></span><ArrowUpRight aria-hidden="true" /></a>;
}
function EventCell({ event, showTitle }: { event: TimelineEvent | null; showTitle?: boolean }) {
  if (!event) return <span className="clock-missing">not found</span>;
  return <span className="clock-event"><strong>{humanDate(event.date)}</strong><small>{event.kind ? kindLabel[event.kind] || event.kind : event.event}{showTitle && event.titleZh ? <span lang="zh-Hans"> · {event.titleZh}</span> : null}</small>{event.url ? <a href={event.url} target="_blank" rel="noreferrer" aria-label="Open source">{sourceHost(event.url)} <ArrowUpRight aria-hidden="true" /></a> : null}{event.verification && event.verification !== "page_fetched_and_confirmed" ? <em className="clock-verification">{event.verification.replaceAll("_", " ")}</em> : null}</span>;
}

// ---------- derived data ----------
const positionById = new Map(data.positions.map((p) => [p.id, p]));
const coverageCount = (state: string) => data.metadata.positionCoverageCounts.find((c) => c.state === state)?.count ?? 0;
const judgmentVars = (() => {
  const m = data.metadata;
  const lc = m.ledgerClock;
  const st = data.trackers.seatTurnovers;
  const noRecordByTier = m.positionTierCounts.filter((t) => t.coverage.no_record > 0).sort((a, b) => b.coverage.no_record - a.coverage.no_record).map((t) => `${t.label.toLowerCase()} ${t.coverage.no_record}`).join(", ");
  const mappedOfficers = data.officers.filter((o) => o.archetypeStatus === "mapped");
  return {
    principalSeats: m.framework.principalSeatCount,
    formalOrDated: coverageCount("formal_current") + coverageCount("dated_official"),
    vacantOrHandled: coverageCount("adverse_vacancy") + coverageCount("held_in_adverse_watch") + coverageCount("handled_without_title"),
    noRecord: coverageCount("no_record"), acting: coverageCount("acting_or_inferred"), stale: coverageCount("stale"), conflicting: coverageCount("conflicting"),
    adverseCount: m.adverseCount, confirmedExits: data.adverse.filter((a) => a.controlledState === "confirmed_exit").length, unresolvedWatches: data.adverse.filter((a) => a.controlledState !== "confirmed_exit").length,
    adverseVacancy: coverageCount("adverse_vacancy"),
    turnoverSentence: st ? `Of the ${st.summary.turnovers} senior seats that turned over since 2023, ${st.summary.closed} have a formally named successor${st.summary.medianDaysToFill !== null ? ` (median ${st.summary.medianDaysToFill} days to fill)` : ""}, and ${st.summary.open} are still open.` : "The seat-turnover tracker is still being collected.",
    handled: coverageCount("handled_without_title"), handlerLinks: data.positions.reduce((n, p) => n + p.handlers.length, 0),
    clockN: lc.counts.complete, medianSilence: lc.silence.medianDays, medianProcess: lc.process.medianDays, minSilence: lc.silence.minDays, maxSilence: lc.silence.maxDays, withLastAppearance: lc.withLastAppearance,
    promoted: data.trackers.promotionCeremonies?.summary.promoted ?? null, promotedRemoved: data.trackers.promotionCeremonies?.summary.laterRemoved ?? null, promoCeremonies: data.trackers.promotionCeremonies?.summary.ceremonies ?? null, promoMedianDays: data.trackers.promotionCeremonies?.summary.medianDaysToFirstSignal ?? null, promoMedianYears: data.trackers.promotionCeremonies?.summary.medianDaysToFirstSignal != null ? (data.trackers.promotionCeremonies.summary.medianDaysToFirstSignal / 365).toFixed(1) : null, promoSameDay: data.trackers.promotionCeremonies?.summary.sameDayBillet ?? null,
    mapped: m.mappedOfficerCount, officers: m.officerCount, noClaims: data.officers.filter((o) => o.claims.length === 0).length, staleHolders: mappedOfficers.filter((o) => o.signals.titleFreshness === "pre_2025").length, noRecordByTier,
  };
})();
const questionProgress: Record<string, string> = (() => {
  const t = data.trackers; const lc = data.metadata.ledgerClock;
  return {
    cc20: t.cc20Military ? `${t.cc20Military.summary.total} military members of the 20th Central Committee listed; ${t.cc20Military.summary.byStatus.removed ?? 0} removed, ${t.cc20Military.summary.byStatus.missing ?? 0} missing, ${t.cc20Military.summary.byStatus.bypassed ?? 0} passed over.` : "The 20th Central Committee cohort tracker is not yet collected.",
    ledgerClock: `${lc.counts.complete} of ${data.metadata.adverseCount} ledger records complete; ${lc.withLastAppearance} have a last public appearance.`,
    seatTurnovers: t.seatTurnovers ? `${t.seatTurnovers.summary.turnovers} turnovers recorded; ${t.seatTurnovers.summary.closed} closed, ${t.seatTurnovers.summary.open} open.` : "Not yet collected.",
    eventAttendance: t.eventAttendance ? `${t.eventAttendance.summary.events} events across ${t.eventAttendance.summary.families} families; ${t.eventAttendance.summary.misses} scored misses, ${t.eventAttendance.summary.missesLaterConfirmedAdverse} later confirmed adverse.` : "Not yet collected.",
    noRecord: `${coverageCount("no_record")} principal seats have no public record.`,
    promotionCeremonies: t.promotionCeremonies ? `${t.promotionCeremonies.summary.ceremonies} ceremonies, ${t.promotionCeremonies.summary.promoted} promotions; ${t.promotionCeremonies.summary.laterRemoved} of those officers later entered the adverse ledger.` : "Not yet collected.",
  };
})();
function getPath(obj: unknown, path: string): unknown { return path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), obj); }

const TAB_IDS = ["overview", "positions", "directory", "ledger", "trackers", "routes", "evidence", "method"];
function subscribeToUrl(callback: () => void) { window.addEventListener("popstate", callback); return () => window.removeEventListener("popstate", callback); }
function readUrlTab() { return new URLSearchParams(window.location.search).get("tab") ?? ""; }

// ---------- dossier ----------
function OfficerSheet({ officer, onClose, onOpenPosition }: { officer: Officer | null; onClose: () => void; onOpenPosition: (id: string) => void }) {
  const relatedGaps = officer ? data.gaps.filter((gap) => officer.gapIds.includes(gap.id)) : [];
  const positions = officer ? officer.positionRoles.map((r) => ({ ...r, position: positionById.get(r.positionId) })).filter((r) => r.position) : [];
  return (
    <Sheet open={Boolean(officer)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="officer-sheet sm:max-w-2xl">
        {officer ? (
          <div className="sheet-scroll">
            <SheetHeader className="sheet-heading">
              <div className="eyebrow-row"><span>{officer.branch}</span><span className="mono">{officer.id}</span></div>
              <SheetTitle className="officer-title">{officer.nameEn} <span lang="zh-Hans">{officer.nameZh}</span></SheetTitle>
              <SheetDescription className="officer-role">{officer.billet || "Current billet not established"}</SheetDescription>
              <div className="status-row"><span className={`status-pill ${roleStateTone(officer.roleState)}`}><CircleDot aria-hidden="true" />{roleStateLabel[officer.roleState] || officer.roleState}</span><span className="evidence-description">{officer.evidence.label}</span></div>
            </SheetHeader>
            <section className="sheet-section">
              <div className="section-heading-row"><div><p className="section-kicker">Position on the chart</p><h3>{positions.length ? "Mapped positions" : "Outside the archetype"}</h3></div></div>
              {positions.length ? <div className="mini-gap-list">{positions.map((r) => <article key={r.positionId}><span className="mono">{r.role}</span><button className="person-link" onClick={() => onOpenPosition(r.positionId)}><strong>{r.position!.organization} · {r.position!.position}</strong></button><p>{coveragePlain[r.position!.coverage]}</p></article>)}</div> : <p className="signal-method-note">{data.unmappedReasons[officer.unmappedReason ?? ""] ?? "Not mapped."} {officer.unmappedNote}</p>}
            </section>
            <section className="sheet-section">
              <h3>Recorded snapshot</h3>
              <dl className="fact-grid">
                <div><dt>Institution</dt><dd>{officer.institution || "Not established"}</dd></div>
                <div><dt>Rank</dt><dd>{officer.rank || "Not established"}</dd></div>
                <div><dt>Birth year</dt><dd>{officer.birthYear ? `${officer.birthYear} (${officer.birthPrecision})` : "Unknown"}</dd></div>
                <div><dt>Last titled</dt><dd>{humanDate(officer.lastReliableTitleDate)}{officer.daysSinceTitle !== null && officer.daysSinceTitle !== undefined ? ` · ${officer.daysSinceTitle} days before cutoff` : ""}</dd></div>
                <div><dt>Service origin</dt><dd>{officer.serviceOriginDetail || officer.serviceOrigin || "Unresolved"}</dd></div>
                <div><dt>Party status</dt><dd>{officer.partyStatus || "Not established"}</dd></div>
                <div><dt>State CMC ledger</dt><dd>{officer.stateCmcStatus || "Not established"}</dd></div>
                <div><dt>NPC mandate ledger</dt><dd>{officer.npcStatus || "Not established"}</dd></div>
              </dl>
              {officer.evidence.caveat ? <div className="evidence-note"><FileSearch aria-hidden="true" /><p>{officer.evidence.caveat}</p></div> : null}
            </section>
            <section className="sheet-section">
              <div className="section-heading-row"><div><p className="section-kicker">Claim-level record</p><h3>Source-mapped claims</h3></div><Badge variant="outline">{officer.claims.length} mapped</Badge></div>
              {officer.claims.length ? <div className="claim-list">{officer.claims.map((claim) => <article key={claim.id} className="claim-card"><div className="claim-meta"><Badge variant="secondary">{claim.field.replaceAll("_", " ")}</Badge><span>{humanDate(claim.observedAt)}</span></div><p>{claim.value}</p>{claim.temporalScope ? <small>{claim.temporalScope}</small> : null}{claim.doesNotSupport ? <div className="scope-warning"><AlertTriangle aria-hidden="true" />Does not establish: {claim.doesNotSupport}</div> : null}{claim.sourceUrl ? <a href={claim.sourceUrl} target="_blank" rel="noreferrer">Open supporting source <ArrowUpRight aria-hidden="true" /></a> : null}</article>)}</div> : <div className="empty-state compact"><FileSearch aria-hidden="true" /><p>No claim-scoped entries are mapped to this dossier yet. Discovery sources are listed below.</p></div>}
            </section>
            {relatedGaps.length ? <section className="sheet-section"><div className="section-heading-row"><div><p className="section-kicker">Collection needs</p><h3>Linked research gaps</h3></div></div><div className="mini-gap-list">{relatedGaps.map((gap) => <article key={gap.id}><span className="mono">{gap.id}</span><strong>{gap.title}</strong><p>{gap.evidenceNeeded}</p></article>)}</div></section> : null}
            <section className="sheet-section"><div className="section-heading-row"><div><p className="section-kicker">Bibliography</p><h3>Dossier sources</h3></div><Badge variant="outline">{officer.sourceCount} links</Badge></div><div className="source-list">{officer.sources.map((source, index) => <SourceLink key={`${source.url}-${index}`} source={source} />)}</div></section>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

// ---------- page ----------
export default function Home() {
  const [chosenTab, setActiveTab] = useState<string | null>(null);
  const urlTab = useSyncExternalStore(subscribeToUrl, readUrlTab, () => "");
  const activeTab = chosenTab ?? (TAB_IDS.includes(urlTab) ? urlTab : "overview");
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("all");
  const [archetypeFilter, setArchetypeFilter] = useState("all");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [visibleCount, setVisibleCount] = useState(36);
  const [sourceQuery, setSourceQuery] = useState("");
  const [sourceFamily, setSourceFamily] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [coverageFilter, setCoverageFilter] = useState("all");
  const [positionQuery, setPositionQuery] = useState("");
  const [ledgerMode, setLedgerMode] = useState("all");
  const [highlightPosition, setHighlightPosition] = useState<string | null>(null);

  const branches = useMemo(() => [...new Set(data.officers.map((o) => o.branch))].sort(), []);
  const filteredOfficers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.officers.filter((o) => (branch === "all" || o.branch === branch) && (archetypeFilter === "all" || o.archetypeStatus === archetypeFilter) && (!needle || [o.nameEn, o.nameZh, o.id, o.branch, o.institution, o.billet, o.rank].filter(Boolean).join(" ").toLowerCase().includes(needle)));
  }, [branch, query, archetypeFilter]);
  const filteredSources = useMemo(() => {
    const needle = sourceQuery.trim().toLowerCase();
    return data.sources.filter((s) => (sourceFamily === "all" || s.family === sourceFamily) && (!needle || [s.publisher, s.url, s.class, s.family, ...(s.scopes ?? [])].filter(Boolean).join(" ").toLowerCase().includes(needle)));
  }, [sourceFamily, sourceQuery]);
  const filteredPositions = useMemo(() => {
    const needle = positionQuery.trim().toLowerCase();
    return data.positions.filter((p) => (tierFilter === "all" || p.tier === tierFilter) && (coverageFilter === "all" || p.coverage === coverageFilter) && (!needle || [p.organization, p.organizationZh, p.position, p.positionZh, ...p.holders.map((h) => `${h.nameEn} ${h.nameZh}`), ...p.handlers.map((h) => `${h.nameEn} ${h.nameZh}`), ...p.adverse.map((a) => `${a.nameEn} ${a.nameZh}`)].join(" ").toLowerCase().includes(needle)));
  }, [tierFilter, coverageFilter, positionQuery]);
  const ledgerRecords = useMemo(() => {
    const rows = data.adverse.filter((r) => ledgerMode === "all" || (ledgerMode === "confirmed" && r.controlledState === "confirmed_exit") || (ledgerMode === "unresolved" && r.controlledState !== "confirmed_exit") || (ledgerMode === "complete" && r.timeline.collectionState === "complete"));
    return rows;
  }, [ledgerMode]);

  function openOfficer(id: string) { setSelectedOfficer(data.officers.find((o) => o.id === id) ?? null); }
  function openPosition(id: string) { setSelectedOfficer(null); setTierFilter("all"); setCoverageFilter("all"); setPositionQuery(""); setHighlightPosition(id); setActiveTab("positions"); }
  const t = data.trackers;
  const m = data.metadata;
  const lc = m.ledgerClock;

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PLA Leadership Observatory home"><span className="brand-mark" aria-hidden="true"><Network /></span><span><strong>PLA Leadership</strong><small>Observatory</small></span></a>
        <div className="topbar-meta"><span className="data-cutoff"><span className="live-dot" />Data cutoff {humanDate(m.asOf)}</span><span className="build-id mono">{m.buildId}</span></div>
      </header>

      <div id="top" className="workspace">
        <section className="briefing-header">
          <div className="briefing-copy">
            <p className="eyebrow">Position-first edition · cutoff {humanDate(m.asOf)}</p>
            <h1>Who holds the PLA’s senior positions, and how do we know?</h1>
            <p>{framework.plain}</p>
          </div>
          <aside className="editorial-note"><Scale aria-hidden="true" /><div><strong>What this site does not do</strong><p>It publishes no promotion probabilities and no ranking of officers. Every number is computed from the position board, the adverse ledger or a tracker, and every judgment lists the premises it rests on.</p></div></aside>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="main-tabs">
          <div className="tabs-bar">
            <TabsList variant="line" className="tabs-list">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="directory">Officers</TabsTrigger>
              <TabsTrigger value="ledger">Ledger</TabsTrigger>
              <TabsTrigger value="trackers">Trackers</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="method">Method</TabsTrigger>
            </TabsList>
          </div>

          {/* ---------------- OVERVIEW ---------------- */}
          <TabsContent value="overview" className="tab-panel">
            <section className="metric-grid" aria-label="Coverage summary">
              <MetricCard value={m.framework.principalSeatCount} label="Senior seats on the chart" detail={`${m.framework.positionCount} positions across ${m.framework.tierCount} tiers, including ${m.framework.benchSlotCount} bench slots for deputies`} icon={LayoutGrid} />
              <MetricCard value={judgmentVars.formalOrDated} label="Seats with a formal or dated official holder" detail={`${judgmentVars.acting} more rest on acting or inferred titles; ${judgmentVars.stale} on stale records`} icon={Users} />
              <MetricCard value={judgmentVars.vacantOrHandled} label="Seats vacant after removal or run without the title" detail={`${judgmentVars.adverseVacancy} vacant after a removal; ${judgmentVars.handled} run by a handler`} icon={AlertTriangle} />
              <MetricCard value={judgmentVars.noRecord} label="Seats with no public record" detail="A statement about our sources, not about the seat" icon={FileSearch} />
              <MetricCard value={`${lc.counts.complete}/${m.adverseCount}`} label="Ledger records fully clocked" detail={`${lc.withLastAppearance} have a verified last public appearance`} icon={Clock} />
            </section>

            <section className="judgment-stack judgment-stack-priority">
              <div className="section-heading-row"><div><p className="section-kicker">What the board shows</p><h3>Judgments computed from the data</h3></div><Badge variant="outline">Counts, not opinions</Badge></div>
              {judgments.filter((j) => !j.requires || Boolean(getPath(data, j.requires))).map((judgment, index) => (
                <article key={judgment.id}>
                  <span className="judgment-number mono">0{index + 1}</span>
                  <div>
                    <div className="judgment-title"><h4>{judgment.title}</h4><Badge variant="secondary">{judgment.confidence} · {judgment.basis}</Badge></div>
                    <p>{fill(judgment.plain, judgmentVars)}</p>
                    <p className="precise">{fill(judgment.precise, judgmentVars)}</p>
                    <div className="judgment-example"><strong>Example</strong><span>{judgment.example.text}</span><span className="judgment-links">{judgment.example.positionId ? <button onClick={() => openPosition(judgment.example.positionId!)}>Open seat <ChevronRight /></button> : null}{judgment.example.officerId ? <button onClick={() => openOfficer(judgment.example.officerId!)}>Open dossier <ChevronRight /></button> : null}<a href={judgment.example.url} target="_blank" rel="noreferrer">Source <ArrowUpRight /></a></span></div>
                    <small className="judgment-premises">Rests on {judgment.premiseIds.map((id) => <span key={id} className="mono">{id}</span>)} · Would change if: {judgment.whatWouldChangeIt}</small>
                  </div>
                </article>
              ))}
              {judgments.some((j) => j.requires && !getPath(data, j.requires)) ? <p className="signal-method-note">{judgments.filter((j) => j.requires && !getPath(data, j.requires)).map((j) => `“${j.title}” is withheld until its data exists (${j.requires}).`).join(" ")}</p> : null}
            </section>

            <section className="research-frontier">
              <div className="section-heading-row"><div><p className="section-kicker">Research questions</p><h3>Six questions, each with the artifact that answers it</h3><p>A question stays on this list only if a table you could check would settle it.</p></div><Badge variant="outline">Measurable</Badge></div>
              <div className="frontier-grid">{researchQuestions.map((q) => <article key={q.id}><header><span className="mono">{q.id}</span><Badge variant="outline">{q.status.replaceAll("_", " ")}</Badge></header><h4>{q.question}</h4><p>{q.plain}</p><dl><div><dt>Artifact</dt><dd>{q.artifact}</dd></div><div><dt>Progress</dt><dd>{q.progress ? questionProgress[q.progress] ?? q.progress : "Not started."}</dd></div><div><dt>Where to look</dt><dd>{q.searchLane}</dd></div><div><dt>Review</dt><dd>{q.reviewStatus}</dd></div></dl>{q.url ? <a href={q.url} target="_blank" rel="noreferrer">Anchor source <ArrowUpRight /></a> : null}</article>)}</div>
            </section>

            <section className="coverage-map">
              <div className="section-heading-row"><div><p className="section-kicker">Coverage by tier</p><h3>Where the record is strong and where it is blank</h3><p>Counts are principal seats. Click a tier to open it on the Positions tab.</p></div></div>
              <div className="coverage-table">{m.positionTierCounts.map((row) => <article key={row.tier}><div><button className="person-link" onClick={() => { setTierFilter(row.tier); setCoverageFilter("all"); setActiveTab("positions"); }}><strong>{row.label}</strong></button><span className="mono">{row.principalSeats} seats</span></div><p>{coverageOrder.filter((s) => row.coverage[s]).map((s) => `${coverageLabel[s].toLowerCase()} ${row.coverage[s]}`).join(" · ")}</p><small>{data.positionTiers.find((tier) => tier.id === row.tier)?.plain}</small></article>)}</div>
            </section>
          </TabsContent>

          {/* ---------------- POSITIONS ---------------- */}
          <TabsContent value="positions" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Position coverage</p><h2>Every senior seat on the chart, and what the public record supports</h2><p><Term term="holder">Holders</Term> are named with a title by a dated source. <Term term="handler">Handlers</Term> are seen doing the job without the title. Removed officers are shown against the seat they vacated.</p></div><Badge variant="outline">{filteredPositions.length} of {data.positions.length}</Badge></section>
            <section className="coverage-key" aria-label="Coverage states">{coverageOrder.map((s) => <button key={s} className={`coverage-chip ${coverageFilter === s ? "active" : ""}`} onClick={() => setCoverageFilter(coverageFilter === s ? "all" : s)}><span className={`status-pill ${coverageTone(s)}`}>{coverageLabel[s]}</span><strong className="mono">{coverageCount(s)}</strong><small>{coveragePlain[s]}</small></button>)}</section>
            <div className="filter-bar">
              <div className="search-field"><Search aria-hidden="true" /><Input value={positionQuery} onChange={(e) => setPositionQuery(e.target.value)} placeholder="Search organization, position, 汉字, or a name" aria-label="Search positions" /></div>
              <Select value={tierFilter} onValueChange={setTierFilter}><SelectTrigger aria-label="Filter by tier" className="filter-select"><Filter /><SelectValue placeholder="All tiers" /></SelectTrigger><SelectContent><SelectItem value="all">All tiers</SelectItem>{data.positionTiers.map((tier) => <SelectItem key={tier.id} value={tier.id}>{tier.label}</SelectItem>)}</SelectContent></Select>
              {(positionQuery || tierFilter !== "all" || coverageFilter !== "all") ? <Button variant="ghost" onClick={() => { setPositionQuery(""); setTierFilter("all"); setCoverageFilter("all"); }}>Clear</Button> : null}
            </div>
            {data.positionTiers.filter((tier) => filteredPositions.some((p) => p.tier === tier.id)).map((tier) => (
              <section key={tier.id} className="position-tier">
                <div className="section-heading-row"><div><p className="section-kicker">{tier.labelZh}</p><h3>{tier.label}</h3><p>{tier.plain}</p></div></div>
                <div className="position-board">
                  {filteredPositions.filter((p) => p.tier === tier.id).map((p) => (
                    <article key={p.id} id={p.id} className={`position-row ${highlightPosition === p.id ? "highlight" : ""} ${p.isBench ? "bench" : ""}`}>
                      <div className="position-name"><strong>{p.organization}</strong><span>{p.position}{p.isBench ? " · bench" : ""}</span><small lang="zh-Hans">{p.organizationZh} · {p.positionZh}</small></div>
                      <div className="position-people">
                        {p.externalHolder ? <span className="person-chip"><b>{p.externalHolder.name}</b> <span lang="zh-Hans">{p.externalHolder.nameZh}</span><small>{p.externalHolder.note}</small></span> : null}
                        {p.holders.map((h) => <button key={h.officerId} className="person-chip" onClick={() => openOfficer(h.officerId)}><b>{h.nameEn}</b> <span lang="zh-Hans">{h.nameZh}</span><small><span className={`status-pill ${roleStateTone(h.roleState)}`}>{roleStateLabel[h.roleState] || h.roleState}</span> last titled {humanDate(h.lastReliableTitleDate)}</small></button>)}
                        {p.handlers.map((h) => <button key={`h-${h.officerId}`} className="person-chip handler" onClick={() => openOfficer(h.officerId)}><b>{h.nameEn}</b> <span lang="zh-Hans">{h.nameZh}</span><small>handles the work without the title</small></button>)}
                        {p.adverse.map((a) => <span key={a.adverseId} className="person-chip adverse"><b>{a.nameEn}</b> <span lang="zh-Hans">{a.nameZh}</span><small>{a.status} · {humanDate(a.date)}</small></span>)}
                        {!p.externalHolder && !p.holders.length && !p.handlers.length && !p.adverse.length ? <span className="person-chip empty">No dated source names a holder</span> : null}
                      </div>
                      <div className="position-state"><span className={`status-pill ${coverageTone(p.coverage)}`}>{coverageLabel[p.coverage]}</span>{p.note ? <p>{p.note}</p> : null}{p.coverage === "no_record" && p.searchLane ? <small>Where to look: {p.searchLane}</small> : null}</div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
            {!filteredPositions.length ? <div className="empty-state"><Search aria-hidden="true" /><h3>No matching positions</h3><p>Try a different organization, name or filter.</p></div> : null}
          </TabsContent>

          {/* ---------------- OFFICERS ---------------- */}
          <TabsContent value="directory" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">People directory</p><h2>Every officer in the dataset</h2><p>Names enter through a position. Officers outside the chart are listed with the reason.</p></div><div className="panel-actions"><Badge variant="outline">{filteredOfficers.length} records</Badge><Button asChild variant="outline" size="sm"><a href="/data/pla-leadership-observatory-public.csv" download><Download />CSV</a></Button><Button asChild variant="outline" size="sm"><a href="/data/pla-leadership-observatory-public.json" download><Download />JSON</a></Button></div></section>
            <div className="filter-bar">
              <div className="search-field"><Search aria-hidden="true" /><Input value={query} onChange={(e) => { setQuery(e.target.value); setVisibleCount(36); }} placeholder="Search English, 汉字, billet, institution, or stable ID" aria-label="Search officer records" /></div>
              <Select value={branch} onValueChange={(v) => { setBranch(v); setVisibleCount(36); }}><SelectTrigger aria-label="Filter by institution family" className="filter-select"><Filter /><SelectValue placeholder="All institutions" /></SelectTrigger><SelectContent><SelectItem value="all">All institution families</SelectItem>{branches.map((item) => <SelectItem key={item} value={item}>{branchShortLabel[item] || item}</SelectItem>)}</SelectContent></Select>
              <Select value={archetypeFilter} onValueChange={(v) => { setArchetypeFilter(v); setVisibleCount(36); }}><SelectTrigger aria-label="Filter by archetype status" className="filter-select"><SelectValue placeholder="Mapped and unmapped" /></SelectTrigger><SelectContent><SelectItem value="all">Mapped and unmapped</SelectItem><SelectItem value="mapped">Mapped to a position</SelectItem><SelectItem value="unmapped">Outside the archetype</SelectItem></SelectContent></Select>
              {(query || branch !== "all" || archetypeFilter !== "all") ? <Button variant="ghost" onClick={() => { setQuery(""); setBranch("all"); setArchetypeFilter("all"); setVisibleCount(36); }}>Clear</Button> : null}
            </div>
            {filteredOfficers.length ? (
              <>
                <div className="directory-table desktop-only">
                  <Table>
                    <TableHeader><TableRow><TableHead>Officer</TableHead><TableHead>Recorded billet</TableHead><TableHead>Position on the chart</TableHead><TableHead>Appointment record</TableHead><TableHead>Last titled</TableHead><TableHead className="text-right">Sources</TableHead></TableRow></TableHeader>
                    <TableBody>{filteredOfficers.slice(0, visibleCount).map((o) => <TableRow key={o.id}><TableCell><button className="person-link" onClick={() => setSelectedOfficer(o)}><span>{o.nameEn}</span><small lang="zh-Hans">{o.nameZh}</small></button></TableCell><TableCell className="billet-cell">{o.billet || "Not established"}</TableCell><TableCell>{o.positionIds.length ? o.positionRoles.map((r) => { const p = positionById.get(r.positionId); return p ? <button key={r.positionId} className="position-link" onClick={() => openPosition(r.positionId)}>{p.organization} · {p.position}{r.role === "handler" ? " (handler)" : ""}</button> : null; }) : <span className="muted">{data.unmappedReasons[o.unmappedReason ?? ""] ?? "Outside the archetype"}</span>}</TableCell><TableCell><span className={`status-pill ${roleStateTone(o.roleState)}`}>{roleStateLabel[o.roleState] || o.roleState}</span></TableCell><TableCell>{humanDate(o.lastReliableTitleDate)}</TableCell><TableCell className="text-right mono">{o.sourceCount}</TableCell></TableRow>)}</TableBody>
                  </Table>
                </div>
                <div className="mobile-directory mobile-only">{filteredOfficers.slice(0, visibleCount).map((o) => <button key={o.id} className="mobile-person-card" onClick={() => setSelectedOfficer(o)}><div><strong>{o.nameEn} <span lang="zh-Hans">{o.nameZh}</span></strong><small>{branchShortLabel[o.branch] || o.branch}</small></div><p>{o.billet || "Current billet not established"}</p><span className={`status-pill ${roleStateTone(o.roleState)}`}>{roleStateLabel[o.roleState] || o.roleState}</span></button>)}</div>
                {visibleCount < filteredOfficers.length ? <div className="load-more"><Button variant="outline" onClick={() => setVisibleCount((c) => c + 36)}>Show 36 more</Button></div> : null}
              </>
            ) : <div className="empty-state"><Search aria-hidden="true" /><h3>No matching records</h3><p>Try a different transliteration, Chinese name, institution, or filter.</p></div>}
          </TabsContent>

          {/* ---------------- LEDGER ---------------- */}
          <TabsContent value="ledger" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Adverse ledger</p><h2>Disappearance clock</h2><p>For each removed officer: the last public appearance with a title, the first concrete public sign of trouble, and the formal action. Day counts are computed, never typed. A missing date stays missing.</p></div><Select value={ledgerMode} onValueChange={setLedgerMode}><SelectTrigger className="filter-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All {m.adverseCount} records</SelectItem><SelectItem value="confirmed">Confirmed exits</SelectItem><SelectItem value="unresolved">Unresolved watches</SelectItem><SelectItem value="complete">Fully clocked only</SelectItem></SelectContent></Select></section>
            <section className="metric-grid" aria-label="Ledger clock summary">
              <MetricCard value={lc.counts.complete} label="Records with all three dates" detail={`${lc.counts.partial} partial · ${lc.counts.not_yet_collected} not yet collected`} icon={Clock} />
              <MetricCard value={lc.silence.medianDays ?? "—"} label="Median silence days" detail={lc.silence.n ? `last appearance to first signal, n = ${lc.silence.n}, range ${lc.silence.minDays}–${lc.silence.maxDays}` : "Not yet measurable"} icon={Clock} />
              <MetricCard value={lc.process.medianDays ?? "—"} label="Median process days" detail={lc.process.n ? `first signal to formal action, n = ${lc.process.n}, range ${lc.process.minDays}–${lc.process.maxDays}` : "Not yet measurable"} icon={Clock} />
              <MetricCard value={lc.withLastAppearance} label="Verified last appearances" detail="each with date, exact Chinese title and source" icon={FileSearch} />
            </section>
            <div className="clock-table desktop-only">
              <Table>
                <TableHeader><TableRow><TableHead>Officer</TableHead><TableHead>Last public appearance</TableHead><TableHead>First concrete signal</TableHead><TableHead>Formal action</TableHead><TableHead className="text-right">Silence</TableHead><TableHead className="text-right">Process</TableHead><TableHead>State</TableHead></TableRow></TableHeader>
                <TableBody>{ledgerRecords.map((r) => <TableRow key={r.id} className={`clock-${r.timeline.collectionState}`}><TableCell><div className="clock-name"><strong>{r.nameEn} <span lang="zh-Hans">{r.nameZh}</span></strong><small>{r.formerRole}</small><Badge variant={r.controlledState === "confirmed_exit" ? "secondary" : "outline"}>{r.status}</Badge></div></TableCell><TableCell><EventCell event={r.timeline.lastPublicAppearance} showTitle /></TableCell><TableCell><EventCell event={r.timeline.firstConcreteSignal} /></TableCell><TableCell><EventCell event={r.timeline.formalAction} /></TableCell><TableCell className="text-right mono">{days(r.timeline.silenceDays)}</TableCell><TableCell className="text-right mono">{days(r.timeline.processDays)}</TableCell><TableCell><span className={`signal-chip ${r.timeline.collectionState === "complete" ? "signal-present" : r.timeline.collectionState === "partial" ? "signal-recent" : "signal-missing"}`}>{collectionLabel[r.timeline.collectionState]}</span></TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="timeline-list">{ledgerRecords.map((r) => <article key={r.id} className="timeline-record"><time>{humanDate(r.date)}</time><div className={`timeline-marker ${r.controlledState === "confirmed_exit" ? "marker-confirmed" : "marker-unresolved"}`} /><div className="timeline-content"><div className="timeline-title"><div><strong>{r.nameEn} <span lang="zh-Hans">{r.nameZh}</span></strong><small>{r.formerRole || r.formerBranch}</small></div><Badge variant={r.controlledState === "confirmed_exit" ? "secondary" : "outline"}>{r.status}</Badge></div><p>{r.summary}</p><div className="clock-strip mobile-only"><span>Last seen {r.timeline.lastPublicAppearance ? humanDate(r.timeline.lastPublicAppearance.date) : "not found"}</span><span>First signal {r.timeline.firstConcreteSignal ? humanDate(r.timeline.firstConcreteSignal.date) : "not found"}</span><span>Formal action {r.timeline.formalAction ? humanDate(r.timeline.formalAction.date) : "not found"}</span></div>{r.timeline.collectionState !== "complete" && r.timeline.searchLane ? <small className="clock-lane">Still to collect: {r.timeline.searchLane}</small> : null}<div className="timeline-sources">{r.sources.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer">{sourceHost(url)} <ArrowUpRight /></a>)}</div></div></article>)}</div>
          </TabsContent>

          {/* ---------------- TRACKERS ---------------- */}
          <TabsContent value="trackers" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Narrow trackers</p><h2>One question each, from a bounded set of official sources</h2><p>Each tracker names its sources so the list can be re-read and extended. A tracker that has not been collected says so.</p></div><Badge variant="outline">{m.trackerKeys.length} collected</Badge></section>

            <section className="tracker-section">
              <div className="section-heading-row"><div><p className="section-kicker">Tracker 1</p><h3>Title freshness: how old is our knowledge of each holder?</h3><p>Days since the last source naming each mapped officer with their title. The queue orders re-verification work.</p></div><Badge variant="outline">Computed from existing data</Badge></div>
              {t.titleFreshness ? <>
                <div className="tracker-summary">{Object.entries(t.titleFreshness.summary.byBand).sort((a, b) => Object.keys(bandLabel).indexOf(a[0]) - Object.keys(bandLabel).indexOf(b[0])).map(([band, n]) => <span key={band}><strong className="mono">{n}</strong>{bandLabel[band] || band}</span>)}<span><strong className="mono">{t.titleFreshness.summary.principalSeatsFreshWithin180}/{t.titleFreshness.summary.principalSeatsWithHolder}</strong>held seats with a title seen in the last 180 days</span></div>
                <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Officer</TableHead><TableHead>Position</TableHead><TableHead>Record</TableHead><TableHead>Last titled</TableHead><TableHead className="text-right">Days</TableHead></TableRow></TableHeader><TableBody>{t.titleFreshness.queue.slice(0, 40).map((q) => <TableRow key={q.officerId}><TableCell><button className="person-link" onClick={() => openOfficer(q.officerId)}><span>{q.nameEn}</span><small lang="zh-Hans">{q.nameZh}</small></button></TableCell><TableCell>{q.positionIds.map((id) => positionById.get(id)).filter(Boolean).map((p) => `${p!.organization} · ${p!.position}`).join("; ")}</TableCell><TableCell><span className={`status-pill ${roleStateTone(q.roleState)}`}>{roleStateLabel[q.roleState] || q.roleState}</span></TableCell><TableCell>{humanDate(q.lastReliableTitleDate)}</TableCell><TableCell className="text-right mono">{q.daysSinceTitle ?? "—"}</TableCell></TableRow>)}</TableBody></Table></div>
                <p className="table-note">Showing the 40 stalest of {t.titleFreshness.queue.length} mapped officers. Undated records sort first.</p>
              </> : null}
            </section>

            <section className="tracker-section">
              <div className="section-heading-row"><div><p className="section-kicker">Tracker 2</p><h3>NPC military-delegate terminations</h3><p>Every NPC Standing Committee credentials report since 2023 that ended a military deputy’s seat. Often the first formal, dated sign of a removal.</p></div><Badge variant="outline">{t.npcTerminations ? `${t.npcTerminations.summary.sessions} sessions · ${t.npcTerminations.summary.terminated} deputies` : "Not yet collected"}</Badge></div>
              {t.npcTerminations ? <>
                <div className="tracker-summary">{Object.entries(t.npcTerminations.summary.byYear).map(([y, n]) => <span key={y}><strong className="mono">{n}</strong>{y}</span>)}<span><strong className="mono">{t.npcTerminations.summary.matchedToLedger}</strong>already in the ledger</span><span><strong className="mono">{t.npcTerminations.summary.unmatched}</strong>not yet in this dataset</span></div>
                <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Deputy</TableHead><TableHead>Election unit</TableHead><TableHead>Action</TableHead><TableHead>In dataset</TableHead><TableHead>Source</TableHead></TableRow></TableHeader><TableBody>{t.npcTerminations.rows.map((r, i) => <TableRow key={`${r.nameZh}-${r.date}-${i}`}><TableCell className="mono">{r.date}</TableCell><TableCell><strong>{r.nameEn}</strong> <span lang="zh-Hans">{r.nameZh}</span></TableCell><TableCell lang="zh-Hans">{r.electionUnitZh}</TableCell><TableCell lang="zh-Hans">{r.actionZh}</TableCell><TableCell>{r.match ? <span className={`signal-chip ${r.match.kind === "adverse" ? "signal-present" : "signal-recent"}`}>{r.match.kind === "adverse" ? "Ledger" : "Active directory"}</span> : <span className="signal-chip signal-missing">Not yet</span>}</TableCell><TableCell><a href={r.url} target="_blank" rel="noreferrer">{sourceHost(r.url)} <ArrowUpRight /></a></TableCell></TableRow>)}</TableBody></Table></div>
                {t.npcTerminations.gaps.length ? <p className="table-note">Not found: {t.npcTerminations.gaps.join("; ")}</p> : null}
              </> : <p className="signal-method-note">Artifact: a table of every session, deputy, election unit and action, 2023 to the cutoff.</p>}
            </section>

            <section className="tracker-section">
              <div className="section-heading-row"><div><p className="section-kicker">Tracker 3</p><h3>Full-general promotions since December 2019</h3><p>Every CMC promotion ceremony, who was promoted, the billet printed, and whether that officer later entered the adverse ledger.</p></div><Badge variant="outline">{t.promotionCeremonies ? `${t.promotionCeremonies.summary.ceremonies} ceremonies · ${t.promotionCeremonies.summary.promoted} promotions` : "Not yet collected"}</Badge></div>
              {t.promotionCeremonies ? <>
                <div className="tracker-summary"><span><strong className="mono">{t.promotionCeremonies.summary.laterRemoved}/{t.promotionCeremonies.summary.promoted}</strong>later entered the adverse ledger</span><span><strong className="mono">{t.promotionCeremonies.summary.sameDayBillet}</strong>billet changed the same day</span>{t.promotionCeremonies.summary.medianDaysToFirstSignal !== null ? <span><strong className="mono">{t.promotionCeremonies.summary.medianDaysToFirstSignal}</strong>median days from promotion to first signal, for those removed</span> : null}</div>
                <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Officer</TableHead><TableHead>Billet at promotion</TableHead><TableHead>New billet same day</TableHead><TableHead>Later removed</TableHead><TableHead className="text-right">Days to first signal</TableHead><TableHead>Source</TableHead></TableRow></TableHeader><TableBody>{t.promotionCeremonies.rows.map((r, i) => <TableRow key={`${r.nameZh}-${r.date}-${i}`}><TableCell className="mono">{r.date}</TableCell><TableCell><strong>{r.nameEn}</strong> <span lang="zh-Hans">{r.nameZh}</span></TableCell><TableCell>{r.billetEn}<br /><small lang="zh-Hans">{r.billetZh}</small></TableCell><TableCell>{r.billetNewSameDay}</TableCell><TableCell>{r.laterRemoved ? <span className="signal-chip signal-stale">Yes</span> : <span className="signal-chip signal-present">No</span>}</TableCell><TableCell className="text-right mono">{r.daysToFirstSignal ?? "—"}</TableCell><TableCell><a href={r.url} target="_blank" rel="noreferrer">{sourceHost(r.url)} <ArrowUpRight /></a></TableCell></TableRow>)}</TableBody></Table></div>
                {t.promotionCeremonies.gaps.length ? <p className="table-note">Not found: {t.promotionCeremonies.gaps.join("; ")}</p> : null}
              </> : <p className="signal-method-note">Artifact: every ceremony from 2019-12 to the cutoff, joined to the ledger.</p>}
            </section>

            <section className="tracker-section">
              <div className="section-heading-row"><div><p className="section-kicker">Tracker 4</p><h3>20th Central Committee military cohort</h3><p>The military full and alternate members elected in October 2022, and where each stands today. This is the closest public list to the eligible pool for the 2027 commission.</p></div><Badge variant="outline">{t.cc20Military ? `${t.cc20Military.summary.total} members` : "Not yet collected"}</Badge></div>
              {t.cc20Military ? <>
                <div className="tracker-summary">{Object.entries(t.cc20Military.summary.byStatus).map(([s, n]) => <span key={s}><strong className="mono">{n}</strong>{statusTodayLabel[s] || s}</span>)}<span><strong className="mono">{t.cc20Military.summary.full}/{t.cc20Military.summary.alternate}</strong>full / alternate</span></div>
                <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Membership</TableHead><TableHead>Position at election</TableHead><TableHead>Status today</TableHead></TableRow></TableHeader><TableBody>{t.cc20Military.members.map((mm, i) => <TableRow key={`${mm.nameZh}-${i}`}><TableCell>{mm.match?.kind === "officer" ? <button className="person-link" onClick={() => openOfficer(mm.match!.id)}><span>{mm.nameEn}</span><small lang="zh-Hans">{mm.nameZh}</small></button> : <><strong>{mm.nameEn}</strong> <span lang="zh-Hans">{mm.nameZh}</span></>}</TableCell><TableCell>{mm.membership}{mm.membership === "alternate" ? ` (#${mm.alternateRank})` : ""}</TableCell><TableCell>{mm.positionAtElectionEn}</TableCell><TableCell><span className={`signal-chip ${mm.statusToday === "active_mapped" ? "signal-present" : mm.statusToday.startsWith("active") ? "signal-recent" : mm.statusToday === "not_in_dataset" ? "signal-missing" : "signal-stale"}`}>{statusTodayLabel[mm.statusToday] || mm.statusToday}</span></TableCell></TableRow>)}</TableBody></Table></div>
                {t.cc20Military.laterChanges.length ? <div className="mini-gap-list">{t.cc20Military.laterChanges.map((c) => <article key={`${c.date}-${c.event}`}><span className="mono">{c.date}</span><strong>{c.event}</strong><p lang="zh-Hans">{c.namesZh.join("、")}</p><a href={c.url} target="_blank" rel="noreferrer">{sourceHost(c.url)} <ArrowUpRight /></a></article>)}</div> : null}
              </> : <p className="signal-method-note">Artifact: the October 2022 list with today’s status for each military member.</p>}
            </section>

            <section className="tracker-section">
              <div className="section-heading-row"><div><p className="section-kicker">Tracker 5</p><h3>High-expectancy event attendance</h3><p>Named military rosters from recurring events, 2023 to 2026. A miss is scored only when the previous year’s roster was complete and the officer appeared on it.</p></div><Badge variant="outline">{t.eventAttendance ? `${t.eventAttendance.summary.events} events · ${t.eventAttendance.summary.misses} scored misses` : "Not yet collected"}</Badge></div>
              {t.eventAttendance ? <>
                <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Date</TableHead><TableHead>Roster</TableHead><TableHead>Named military leaders</TableHead></TableRow></TableHeader><TableBody>{t.eventAttendance.events.map((e) => <TableRow key={`${e.family}-${e.date}`}><TableCell><strong>{familyLabel[e.family] || e.family}</strong><br /><small lang="zh-Hans">{e.titleZh}</small></TableCell><TableCell className="mono">{e.date}</TableCell><TableCell><span className={`signal-chip ${e.rosterComplete === "complete_enumeration" ? "signal-present" : "signal-missing"}`}>{e.rosterComplete === "complete_enumeration" ? "Complete" : "Partial"}</span></TableCell><TableCell><span lang="zh-Hans">{e.namedMilitaryAttendees.map((a) => a.nameZh).join("、")}</span> <a href={e.url} target="_blank" rel="noreferrer"><ArrowUpRight /></a></TableCell></TableRow>)}</TableBody></Table></div>
                {t.eventAttendance.misses.length ? <><h4 className="tracker-subhead">Scored misses</h4><div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Officer</TableHead><TableHead>Event</TableHead><TableHead>Present</TableHead><TableHead>Missed</TableHead><TableHead>What happened next</TableHead></TableRow></TableHeader><TableBody>{t.eventAttendance.misses.map((x, i) => <TableRow key={`${x.nameZh}-${x.missedAt}-${i}`}><TableCell><strong>{x.nameEn}</strong> <span lang="zh-Hans">{x.nameZh}</span></TableCell><TableCell>{familyLabel[x.family] || x.family}</TableCell><TableCell className="mono">{x.expectedFrom}</TableCell><TableCell className="mono">{x.missedAt}</TableCell><TableCell>{x.laterResolution ? <span className="signal-chip signal-stale">{x.laterResolution.status}{x.laterResolution.formalActionDate ? ` · formal action ${x.laterResolution.formalActionDate}` : ""}</span> : <span className="signal-chip signal-missing">No adverse record</span>}</TableCell></TableRow>)}</TableBody></Table></div></> : null}
              </> : <p className="signal-method-note">Artifact: an attendance matrix for five event families with complete-roster flags and every scored miss.</p>}
            </section>

            <section className="tracker-section">
              <div className="section-heading-row"><div><p className="section-kicker">Tracker 6</p><h3>Vacancy and formalization clock</h3><p>For every principal seat that turned over since 2023: when the predecessor’s incumbency ended, when a successor was formally named, how many days the seat was open, and whether a handler covered it.</p></div><Badge variant="outline">{t.seatTurnovers ? `${t.seatTurnovers.summary.turnovers} turnovers · ${t.seatTurnovers.summary.open} open` : "Not yet collected"}</Badge></div>
              {t.seatTurnovers ? <>
                <div className="tracker-summary"><span><strong className="mono">{t.seatTurnovers.summary.closed}</strong>filled</span><span><strong className="mono">{t.seatTurnovers.summary.open}</strong>still open at the cutoff</span>{t.seatTurnovers.summary.medianDaysToFill !== null ? <span><strong className="mono">{t.seatTurnovers.summary.medianDaysToFill}</strong>median days to fill</span> : null}{t.seatTurnovers.summary.medianDaysOpenStillVacant !== null ? <span><strong className="mono">{t.seatTurnovers.summary.medianDaysOpenStillVacant}</strong>median days open, still vacant</span> : null}<span><strong className="mono">{t.seatTurnovers.summary.withHandler}</strong>covered by a handler</span></div>
                <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Seat</TableHead><TableHead>Predecessor</TableHead><TableHead>Exit</TableHead><TableHead>Successor</TableHead><TableHead>Appointed</TableHead><TableHead className="text-right">Days open</TableHead><TableHead>Handler</TableHead></TableRow></TableHeader><TableBody>{t.seatTurnovers.turnovers.map((x, i) => <TableRow key={`${x.positionId}-${i}`}><TableCell>{x.positionKnown ? <button className="position-link" onClick={() => openPosition(x.positionId)}>{x.positionLabel}</button> : x.positionLabel}</TableCell><TableCell><strong>{x.predecessorNameEn}</strong> <span lang="zh-Hans">{x.predecessorNameZh}</span></TableCell><TableCell><span className="clock-event"><strong>{x.predecessorExit.date}</strong><small>{kindLabel[x.predecessorExit.kind] || x.predecessorExit.kind}</small><a href={x.predecessorExit.url} target="_blank" rel="noreferrer">{sourceHost(x.predecessorExit.url)} <ArrowUpRight /></a></span></TableCell><TableCell>{x.successorNameEn ? <><strong>{x.successorNameEn}</strong> <span lang="zh-Hans">{x.successorNameZh}</span></> : <span className="muted">none named</span>}</TableCell><TableCell>{x.successorAppointment ? <span className="clock-event"><strong>{x.successorAppointment.date}</strong><small lang="zh-Hans">{x.successorAppointment.titleZh}</small><a href={x.successorAppointment.url} target="_blank" rel="noreferrer">{sourceHost(x.successorAppointment.url)} <ArrowUpRight /></a></span> : <span className="muted">open</span>}</TableCell><TableCell className="text-right mono">{x.daysOpen ?? "—"}</TableCell><TableCell>{x.handlerNameZh ? <span lang="zh-Hans">{x.handlerNameZh}{x.handlerDays !== null ? ` · ${x.handlerDays} d` : ""}</span> : "—"}</TableCell></TableRow>)}</TableBody></Table></div>
                {t.seatTurnovers.gaps.length ? <p className="table-note">Not found: {t.seatTurnovers.gaps.join("; ")}</p> : null}
              </> : <p className="signal-method-note">Artifact: the seat-turnover table for every principal seat that changed hands since 2023.</p>}
            </section>
          </TabsContent>

          {/* ---------------- ROUTES ---------------- */}
          <TabsContent value="routes" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Route evidence</p><h2>{routeEvidence.title}</h2><p>{routeEvidence.plain}</p></div><Badge variant="outline">No probabilities</Badge></section>
            <section className="backtest-warning"><AlertTriangle /><div><strong>Read this before the numbers.</strong><p>{routeEvidence.caveat}</p></div></section>
            <section className="cohort-comparison">{routeEvidence.cohorts.map((c) => <article key={c.year}><span className="mono">{c.year}</span><strong>{c.seniorOfficers}</strong><p>{c.measure}</p><small>{c.plain}</small></article>)}<article className="cohort-limit"><span className="mono">MISSING</span><strong>Eligible losers</strong><p>Who else was eligible at each selection and was not chosen</p><small>Research question RQ-1. Without it, route prevalence cannot become a rate.</small></article></section>
            <section className="turnover-backtest"><div className="section-heading-row"><div><p className="section-kicker">Commission turnover</p><h3>How many new military members each congress brought in</h3></div></div><div className="turnover-grid">{routeEvidence.cmcTurnover.map((c) => <article key={c.cycle}><span className="mono">{c.cycle}</span><strong>{c.entrants}<small> / {c.uniformedSeats}</small></strong><p>new entrants · {c.share}</p><small>{c.retained} retained</small></article>)}</div><div className="entrant-route-grid">{routeEvidence.entrantRoutes.map((r) => <article key={r.route}><div><strong className="mono">{r.count}/{r.denominator}</strong><span>{r.share}</span></div><h4>{r.route}</h4><p>{r.plain}</p></article>)}</div></section>
            <section className="conversion-matrix"><div className="section-heading-row"><div><p className="section-kicker">Post-2019 promotions</p><h3>What the 31 three-star promotions since 2019 have in common</h3></div></div><div>{routeEvidence.conversionMatrix.map((c) => <article key={c.metric}><strong className="mono">{c.metric}</strong><h4>{c.label}</h4><p>{c.plain}</p></article>)}</div></section>
            <section className="route-backtest"><div className="section-heading-row"><div><p className="section-kicker">Route prevalence among winners</p><h3>Common routes, stated as shares of winners</h3></div></div><div>{routeEvidence.routes.map((r) => <article key={`${r.target}-${r.route}`}><div className="route-stat"><strong className="mono">{r.numerator}/{r.denominator}</strong><span>{r.target}</span></div><div><h4>{r.route}</h4><p>{r.plain}</p></div></article>)}</div></section>
            <section className="party-sync-section"><div className="section-heading-row"><div><p className="section-kicker">Party status</p><h3>Party membership arrives with the job, not before it</h3></div></div><div>{routeEvidence.partySynchronization.map((p) => <article key={`${p.group}-${p.value}`}><strong className="mono">{p.value}</strong><span>{p.share}</span><h4>{p.group}</h4><p>{p.plain}</p></article>)}</div></section>
            <section className="model-verdicts"><div className="section-heading-row"><div><p className="section-kicker">Verdicts</p><h3>Which common beliefs the evidence supports</h3></div></div><div>{routeEvidence.verdicts.map((v) => <article key={v.factor}><header><strong>{v.factor}</strong><Badge variant={v.verdict === "Survives" ? "secondary" : "outline"}>{v.verdict}</Badge></header><p>{v.plain}</p></article>)}</div></section>
            <section className="succession-watch">
              <div className="section-heading-row"><div><p className="section-kicker">Succession watch</p><h3>Seats that are vacant, acting or run without the title</h3><p>Derived from the position board. For each seat: who is seen doing the work, and what would settle it. No ranking and no probability.</p></div><Badge variant="outline">{data.positions.filter((p) => !p.isBench && ["adverse_vacancy", "held_in_adverse_watch", "handled_without_title", "acting_or_inferred", "conflicting"].includes(p.coverage)).length} seats</Badge></div>
              <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Seat</TableHead><TableHead>State</TableHead><TableHead>Seen doing the work</TableHead><TableHead>Removed holder</TableHead><TableHead>What would settle it</TableHead></TableRow></TableHeader><TableBody>{data.positions.filter((p) => !p.isBench && ["adverse_vacancy", "held_in_adverse_watch", "handled_without_title", "acting_or_inferred", "conflicting"].includes(p.coverage)).map((p) => <TableRow key={p.id}><TableCell><button className="position-link" onClick={() => openPosition(p.id)}>{p.organization} · {p.position}</button></TableCell><TableCell><span className={`status-pill ${coverageTone(p.coverage)}`}>{coverageLabel[p.coverage]}</span></TableCell><TableCell>{[...p.handlers, ...p.holders].length ? [...p.handlers.map((h) => ({ ...h, how: "handler" })), ...p.holders.map((h) => ({ ...h, how: roleStateLabel[h.roleState] || h.roleState }))].map((h) => <button key={`${p.id}-${h.officerId}`} className="position-link" onClick={() => openOfficer(h.officerId)}>{h.nameEn} <span lang="zh-Hans">{h.nameZh}</span> <small className="muted">({h.how})</small></button>) : <span className="muted">nobody named</span>}</TableCell><TableCell>{p.adverse.length ? p.adverse.map((a) => `${a.nameEn} (${a.status}, ${humanDate(a.date)})`).join("; ") : "—"}</TableCell><TableCell>An appointment notice or promotion ceremony naming the exact title{p.coverage === "conflicting" ? ", or a source that resolves which record is current" : ""}.</TableCell></TableRow>)}</TableBody></Table></div>
            </section>
            <section className="forecast-ledger"><div className="section-heading-row"><div><p className="section-kicker">Dated forecasts</p><h3>Claims written down so they can be scored later</h3><p>Each says what would confirm or break it. “Open” means not yet decided.</p></div><Badge variant="outline">{forecastLedger.length} open</Badge></div><div className="forecast-list">{forecastLedger.map((f) => <article key={f.id}><header><span className="mono">{f.id}</span><Badge variant="outline">{f.status}</Badge></header><small>{f.window} · {f.confidence} confidence</small><h4>{f.plain}</h4><dl><div><dt>Confirms</dt><dd>{f.confirms}</dd></div><div><dt>Breaks</dt><dd>{f.disconfirms}</dd></div></dl>{"officerId" in f && f.officerId ? <button className="person-link" onClick={() => openOfficer(f.officerId as string)}>Open dossier <ChevronRight /></button> : null}</article>)}</div></section>
            <section className="backtest-sources"><div><p className="section-kicker">Sources for the route evidence</p><h3>Independent of roster aggregators</h3></div>{routeEvidence.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer"><span>{s.publisher}</span><strong>{s.title}</strong><ArrowUpRight /></a>)}</section>
          </TabsContent>

          {/* ---------------- EVIDENCE ---------------- */}
          <TabsContent value="evidence" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Evidence explorer</p><h2>Follow claims back to sources</h2><p>A source is linked to a specific field and date, with a note on what it does not establish. A URL on a dossier is not evidence for every field in it.</p></div><Badge variant="outline">{m.sourceCount} unique links</Badge></section>
            <section className="evidence-audit-strip"><article><strong className="mono">{m.mappedPersonCount}</strong><span>officers with at least one claim-scoped record</span></article><article><strong className="mono">{m.currentRoleMappedCount}</strong><span>with a mapped current-role source</span></article><article><strong className="mono">{m.undatedTitleCount}</strong><span>without a usable last-title date</span></article><article><strong className="mono">{m.olderTitleCount}</strong><span>last directly observed before 2025</span></article><article><strong className="mono">{m.discoveryOnlySourceCount}</strong><span>sources kept as discovery leads only</span></article></section>
            <section className="source-family-grid" aria-label="Source-family distribution">{m.sourceFamilyCounts.map((f) => <button key={f.family} onClick={() => setSourceFamily(f.family)}><strong className="mono">{f.count}</strong><span>{sourceFamilyLabel[f.family] || f.family}</span><small>Filter sources <ChevronRight aria-hidden="true" /></small></button>)}</section>
            <div className="evidence-layout">
              <aside className="source-key"><h3>Source classes</h3><dl><div><dt>A1</dt><dd>Formal legal or Party decision</dd></div><div><dt>A2</dt><dd>Central official or PLA source</dd></div><div><dt>A3</dt><dd>Other official institutional source</dd></div><div><dt>B1</dt><dd>High-quality specialist analysis</dd></div><div><dt>B2</dt><dd>Credible secondary reconstruction</dd></div><div><dt>C / D</dt><dd>Discovery lead or weak corroboration</dd></div></dl></aside>
              <div className="source-explorer"><div className="source-controls"><div className="search-field"><Search /><Input value={sourceQuery} onChange={(e) => setSourceQuery(e.target.value)} placeholder="Search publisher, domain, scope, or class" aria-label="Search sources" /></div><Select value={sourceFamily} onValueChange={setSourceFamily}><SelectTrigger className="filter-select" aria-label="Filter source family"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All source families</SelectItem>{m.sourceFamilyCounts.map((f) => <SelectItem key={f.family} value={f.family}>{sourceFamilyLabel[f.family] || f.family}</SelectItem>)}</SelectContent></Select></div><div className="source-table">{filteredSources.slice(0, 120).map((s, i) => <article key={`${s.url}-${i}`}><div className="source-class mono">{s.class || "—"}</div><div><strong>{s.publisher || sourceHost(s.url)}</strong><p>{s.scopes?.slice(0, 2).join(" · ") || "Candidate corroboration; exact claim scope not recorded"}</p><small>{s.date ? humanDate(s.date) : "Date not recorded"} · {sourceFamilyLabel[s.family || ""] || "Unclassified family"} · linked to {s.people?.length || 0} dossier(s)</small></div><a href={s.url} target="_blank" rel="noreferrer" aria-label={`Open ${s.publisher || sourceHost(s.url)}`}><ArrowUpRight /></a></article>)}</div>{filteredSources.length > 120 ? <p className="table-note">Showing the first 120 matching sources. Refine the search to narrow the list.</p> : null}</div>
            </div>
            <section className="calibration-section"><div className="section-heading-row"><div><p className="section-kicker">Evidence rules</p><h3>What an observation proves, and what it cannot</h3><p>Six cases that set the rules for reading appearances, absences and formal acts.</p></div></div><div>{calibrationCases.map((c) => <article key={c.case}><h4>{c.case}</h4><div><span>First observation</span><p>{c.first}</p></div><div><span>Later</span><p>{c.later}</p></div><strong>{c.plain}</strong><a href={c.url} target="_blank" rel="noreferrer">Open anchor source <ArrowUpRight /></a></article>)}</div></section>
            <section className="observation-clock-section"><div className="section-heading-row"><div><p className="section-kicker">Four clocks</p><h3>A public appearance is not a current-role confirmation</h3></div></div><div>{observationClocks.map((c) => <article key={c.clock}><strong>{c.clock}</strong><p className="plain-lead">{c.plain}</p><dl><div><dt>Can prove</dt><dd>{c.proves}</dd></div><div><dt>Cannot prove</dt><dd>{c.doesNot}</dd></div></dl></article>)}</div></section>
            <section className="title-parser-section"><div className="section-heading-row"><div><p className="section-kicker">Chinese title parser</p><h3>One word can change the authority state</h3><p>The site labels someone acting only when the source uses acting language.</p></div></div><div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Source language</TableHead><TableHead>Class</TableHead><TableHead>What it means</TableHead></TableRow></TableHeader><TableBody>{titleParsingRules.map((r) => <TableRow key={r.words}><TableCell lang="zh-Hans"><strong>{r.words}</strong></TableCell><TableCell>{r.cls}</TableCell><TableCell>{r.plain}</TableCell></TableRow>)}</TableBody></Table></div></section>
            <section className="release-tests"><div className="section-heading-row"><div><p className="section-kicker">Release rules</p><h3>Tests the publication must pass</h3></div><Badge variant="outline">Consistency, not truth</Badge></div><div>{releaseRules.map((r) => <article key={r.id}><span className="mono">{r.id}</span><strong>{r.title}</strong><p>{r.plain}</p></article>)}</div></section>
            <section className="system-sources"><div className="section-heading-row"><div><p className="section-kicker">Selection-system foundation</p><h3>Official rules and institutional sources</h3></div><Badge variant="outline">{data.systemSources.length} records</Badge></div><div className="system-source-grid">{data.systemSources.map((s) => <a key={s.id} href={s.url} target="_blank" rel="noreferrer"><div><span className="mono">{s.id}</span><Badge variant="outline">{s.class}</Badge></div><strong>{s.title}</strong><p>{s.supports[0]}</p><small>{s.publisher} · {humanDate(s.date)} <ArrowUpRight /></small></a>)}</div></section>
          </TabsContent>

          {/* ---------------- METHOD ---------------- */}
          <TabsContent value="method" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Method</p><h2>{framework.title}</h2><p>{framework.plain}</p></div><Badge variant="outline">Archetype {m.framework.archetypeVersion}</Badge></section>
            <div className="method-grid">{framework.steps.map((s, i) => <article key={s.step} className="pathway-card"><h3><span className="mono">{i + 1}</span> {s.step}</h3><p>{s.plain}</p></article>)}</div>

            <section className="premise-register"><div className="section-heading-row"><div><p className="section-kicker">Premise register</p><h3>What the judgments depend on, and which ideas have been retired</h3><p>A premise can be held, contested or retired. Retired premises stay listed so the record shows what was once believed and why it was dropped.</p></div><Badge variant="outline">{premises.filter((p) => p.status === "held").length} held · {premises.filter((p) => p.status === "contested").length} contested · {premises.filter((p) => p.status === "retired").length} retired</Badge></div><div className="premise-list">{premises.map((p) => <article key={p.id} className={`premise premise-${p.status}`}><header><span className="mono">{p.id}</span><Badge variant={p.status === "held" ? "secondary" : "outline"}>{p.status}</Badge><small>{p.basis}</small></header><h4>{p.premise}</h4><p>{p.plain}</p><dl>{p.contestedBy ? <div><dt>Contested by</dt><dd>{p.contestedBy}</dd></div> : null}<div><dt>Used in</dt><dd>{p.whereUsed.join("; ")}</dd></div><div><dt>Test</dt><dd>{p.discriminatingTest}</dd></div><div><dt>If wrong</dt><dd>{p.ifWrong}</dd></div></dl></article>)}</div></section>

            <section className="review-log"><div className="section-heading-row"><div><p className="section-kicker">Review log</p><h3>What outside review said, and what changed</h3></div><Badge variant="outline">{data.reviewLog.length} entries</Badge></div><div className="review-list">{data.reviewLog.map((e) => <article key={e.id}><header><span className="mono">{e.date}</span><strong>{e.source}</strong></header><dl><div><dt>Concern</dt><dd>{e.concern}</dd></div><div><dt>Response</dt><dd>{e.response}</dd></div>{e.changed.length ? <div><dt>Changed</dt><dd>{e.changed.join("; ")}</dd></div> : null}{e.notChanged.length ? <div><dt>Deliberately not changed</dt><dd>{e.notChanged.join("; ")}</dd></div> : null}</dl></article>)}</div></section>

            <section className="glossary-section"><div className="section-heading-row"><div><p className="section-kicker">Glossary</p><h3>Every term of art used on this site, in plain words</h3></div><Badge variant="outline">{glossary.length} terms</Badge></div><dl className="glossary-list">{glossary.map((g) => <div key={g.term}><dt>{g.term}{g.zh ? <span lang="zh-Hans"> {g.zh}</span> : null}</dt><dd>{g.plain}</dd></div>)}</dl></section>

            <section className="gap-register"><div className="section-heading-row"><div><p className="section-kicker">Research-gap register</p><h3>Open collection questions carried over from earlier releases</h3></div><Badge variant="outline">{data.gaps.filter((g) => g.status === "open").length} open</Badge></div><div className="gap-grid">{data.gaps.map((g) => <article key={g.id} className="gap-card"><div className="gap-header"><span className="mono">{g.id}</span><Badge variant={g.status === "open" ? "outline" : "secondary"}>{g.status.replaceAll("_", " ")}</Badge></div><h3>{g.title}</h3><p>{g.whyItMatters}</p><dl><div><dt>Evidence needed</dt><dd>{g.evidenceNeeded}</dd></div>{g.reviewNote ? <div><dt>Review note</dt><dd>{g.reviewNote}</dd></div> : null}<div><dt>Do not assume</dt><dd>{g.doNotAssume || "No additional assumption note"}</dd></div></dl>{g.people.length ? <div className="linked-people"><span>Affected records</span>{g.people.map((id) => { const person = data.officers.find((o) => o.id === id); return person ? <button key={id} onClick={() => openOfficer(id)}>{person.nameEn} <ChevronRight /></button> : null; })}</div> : null}</article>)}</div></section>

            <section className="identity-hold-card"><FileSearch aria-hidden="true" /><div><p className="section-kicker">Publication gate</p><h3>{m.canonicalOfficerCount - m.officerCount} records withheld from the active directory</h3><p>{data.identityHeldRecords.map((r) => `${r.nameEn} (${r.heldReason ? r.heldReason.replaceAll("_", " ") : "identity"}: ${r.note})`).join(" · ")}{data.adverseHeldRecords.length ? ` · ${data.adverseHeldRecords.length} active-profile match held because it appears in the adverse ledger` : ""}. Two former positive cases sit only in the unresolved promotion-bypass watch.</p></div></section>
            <section className="limits-card"><AlertTriangle aria-hidden="true" /><div><p className="section-kicker">Limits</p><h3>What this site cannot know</h3><ul>{limits.map((l) => <li key={l}>{l}</li>)}</ul></div></section>
            <section className="panel-actions downloads"><Button asChild variant="outline" size="sm"><a href="/data/pla-leadership-observatory-public.json" download><Download />Public JSON</a></Button><Button asChild variant="outline" size="sm"><a href="/data/pla-leadership-observatory-public.csv" download><Download />Officer CSV</a></Button><span className="mono">{m.buildId}</span><Database aria-hidden="true" /></section>
          </TabsContent>
        </Tabs>
      </div>

      <footer><div><strong>PLA Leadership Observatory</strong><p>Position-first edition · Evidence cutoff {humanDate(m.asOf)}</p></div><p>Positions, holders, handlers and removals are separate records. No promotion probabilities are published.</p></footer>
      <OfficerSheet officer={selectedOfficer} onClose={() => setSelectedOfficer(null)} onOpenPosition={openPosition} />
    </main>
  );
}
