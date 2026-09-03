"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Database,
  Download,
  FileSearch,
  Filter,
  GitBranch,
  Network,
  Scale,
  Search,
  Target,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import observatoryJson from "./data/observatory.json";
import {
  analyticalSources,
  authorityRecoveryCases,
  behaviorEvidenceCases,
  careerSequences,
  changesSinceCut,
  cmcArchitectureBacktest,
  collectionPortfolio,
  commandDyads,
  competingHypotheses,
  decisionGates,
  evidenceCalibrationCases,
  evidenceStopShipTests,
  effectivenessCausalChains,
  forecastLedger,
  hiddenFeederLanes,
  historicalBacktest,
  indicatorEngine,
  leadJudgments,
  networkMotifs,
  observationClocks,
  promotionMarket,
  researchFrontiers,
  roleStateFramework,
  scenarios,
  scoreModel,
  seatArchitecture,
  selectorFunnel,
  selectionRegimes,
  surfacedLeads,
  successionBoards,
  systemFitness,
  taskLeaderFit,
  technicalAuthorityCases,
  titleParsingRules,
  type BoardCandidate,
} from "./data/net-assessment";

type Source = {
  id?: string | null;
  url: string;
  class?: string | null;
  date?: string | null;
  publisher?: string | null;
  scope?: string | null;
  scopes?: string[];
  people?: { id: string; nameEn: string; nameZh: string }[];
  mode?: string | null;
  family?: string | null;
};

type Claim = {
  id: string;
  field: string;
  value: string;
  type: string;
  support?: string | null;
  observedAt?: string | null;
  sourceId?: string | null;
  sourceUrl?: string | null;
  sourceClass?: string | null;
  sourceMode?: string | null;
  sourceDate?: string | null;
  publisher?: string | null;
  temporalScope?: string | null;
  doesNotSupport?: string | null;
};

type Officer = {
  id: string;
  nameEn: string;
  nameZh: string;
  identityNote?: string | null;
  branch: string;
  institution: string;
  serviceOrigin?: string | null;
  serviceOriginDetail?: string | null;
  billet: string;
  rank?: string | null;
  roleState: string;
  roleStateDetail?: string | null;
  lastReliableTitleDate?: string | null;
  assessmentAsOf?: string | null;
  birthYear?: number | null;
  birthPrecision?: string | null;
  birthEvidence?: string | null;
  partyStatus?: string | null;
  stateCmcStatus?: string | null;
  npcStatus?: string | null;
  disciplineState?: string | null;
  disciplineNote?: string | null;
  evidence: {
    grade: string;
    label: string;
    caveat?: string | null;
    mappedClaims: number;
    primaryMappedClaims: number;
    currentRoleMapped: boolean;
  };
  signals: {
    appointmentRecord: string;
    titleFreshness: string;
    currentRoleSource: string;
    rankRecord: string;
    partyRecord: string;
    stateCmcRecord: string;
    npcRecord: string;
    birthRecord: string;
    primaryMappedClaims: number;
    openGapCount: number;
  };
  sourceCount: number;
  sources: Source[];
  claims: Claim[];
  gapIds: string[];
};

type Gap = {
  id: string;
  title: string;
  status: string;
  whyItMatters: string;
  evidenceNeeded: string;
  searchLane?: string | null;
  doNotAssume?: string | null;
  lastChecked?: string | null;
  people: string[];
  billetPools: string[];
  horizons: number[];
};

type AdverseRecord = {
  id: string;
  nameEn: string;
  nameZh: string;
  formerBranch?: string | null;
  formerRole?: string | null;
  status: string;
  controlledState: string;
  date?: string | null;
  summary?: string | null;
  evidenceConfidence?: string | null;
  sources: string[];
};

type SystemSource = {
  id: string;
  title: string;
  publisher?: string | null;
  url: string;
  alternateUrl?: string | null;
  date?: string | null;
  effective?: string | null;
  class?: string | null;
  textLevel?: string | null;
  supports: string[];
  doesNotSupport: string[];
};

type ContextSource = {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  note: string;
};

type PipelineSource = {
  id: string;
  family: string;
  title: string;
  publisher?: string | null;
  url: string;
  date?: string | null;
  class?: string | null;
  supports: string[];
  doesNotSupport?: string | null;
};

type ObservatoryData = {
  metadata: {
    title: string;
    asOf: string;
    buildId: string;
    officerCount: number;
    canonicalOfficerCount: number;
    identityHeldCount: number;
    adverseHeldCount: number;
    confirmedClaimCount: number;
    sourceCount: number;
    primaryOfficialSourceCount: number;
    supplementalClaimCount: number;
    supplementalPersonCount: number;
    supplementalNewEntityCount: number;
    pipelineSourceCount: number;
    sourceFamilyCounts: { family: string; count: number }[];
    gapCount: number;
    adverseCount: number;
    birthYearKnownCount: number;
    mappedPersonCount: number;
    currentRoleMappedCount: number;
    undatedTitleCount: number;
    olderTitleCount: number;
    discoveryOnlySourceCount: number;
    unscopedSourceCount: number;
    editorialNote: string;
    roleStateCounts: { state: string; count: number }[];
    branchCounts: { branch: string; count: number }[];
  };
  officers: Officer[];
  gaps: Gap[];
  adverse: AdverseRecord[];
  sources: Source[];
  systemSources: SystemSource[];
  pipelineSources: PipelineSource[];
  contextSources: ContextSource[];
  identityHeldRecords: { id: string; nameEn: string; nameZh: string; note: string; gapIds: string[] }[];
  adverseHeldRecords: { id: string; nameEn: string; nameZh: string; note: string; gapIds: string[] }[];
};

const importedData = observatoryJson as ObservatoryData;
const data: ObservatoryData = importedData;
const scoredOfficerIds = new Set(successionBoards.flatMap((board) => board.candidates.map((candidate) => candidate.officerId)));
const scoredOfficers = data.officers.filter((officer) => scoredOfficerIds.has(officer.id));
const collectionSensitivity = [
  { metric: `${scoredOfficers.filter((officer) => officer.birthYear).length} / ${scoredOfficers.length}`, label: "boarded officers with a known birth year", consequence: "Unknown runway receives a zero lower bound and widens the interval." },
  { metric: `${scoredOfficers.filter((officer) => officer.signals.currentRoleSource === "official_mapped").length} / ${scoredOfficers.length}`, label: "with an official mapped current-role source", consequence: "Acting, inferred, and stale roles remain conditional instead of receiving full incumbency credit." },
  { metric: `${scoredOfficers.filter((officer) => ["E3", "E4"].includes(officer.evidence.grade)).length} / ${scoredOfficers.length}`, label: "with E3 or E4 evidence", consequence: "Collection quality stays outside the structural score and is displayed as a separate forecast sensitivity." },
  { metric: `${successionBoards.flatMap((board) => board.candidates).filter((candidate) => candidate.conditions?.length).length}`, label: "conditional candidate placements", consequence: "Formalization and non-conversion branches are preserved rather than averaged into one deceptive number." },
] as const;

const roleStateLabel: Record<string, string> = {
  formal_current: "Formally documented",
  official_title_with_scope_caveat: "Official title, limited scope",
  acting_role_mixture: "Unresolved authority mixture",
  inferred_current: "Reported or observed",
  conflicting_current: "Conflicting reports",
  stale_or_unknown: "Stale or unknown",
  legacy_unverified: "Legacy record; not current",
  identity_unresolved: "Identity unresolved",
};

const evidenceLabel: Record<string, string> = {
  E1: "Official current-role claim mapped",
  E2: "Reported current-role claim mapped",
  E3: "Partial claim mapping",
  E4: "Current role not claim-mapped",
};

const sourceFamilyLabel: Record<string, string> = {
  formal_decision: "Formal decision",
  official_primary: "Official / institutional",
  specialist_research: "Specialist research",
  discovery_or_other: "Discovery / other",
};

const signalLabel: Record<string, string> = {
  observed_2026: "Observed 2026",
  observed_2025: "Observed 2025",
  pre_2025: "Pre-2025",
  not_established: "Not established",
  official_mapped: "Official mapped",
  mapped_nonprimary: "Mapped, non-primary",
  not_mapped: "Not mapped",
  recorded: "Recorded",
  not_public: "Not public",
};

const branchShortLabel: Record<string, string> = {
  "PLA Army / military district": "Army",
  "CMC / central joint": "CMC / joint",
  "PLA Navy / Marines": "Navy / Marines",
  "Joint theater command": "Theater commands",
  "PLA Air Force": "Air Force",
  "Aerospace / cyberspace / information": "Space / cyber / information",
  "Institution unresolved": "Institution unresolved",
  "PLA Rocket Force": "Rocket Force",
  "People's Armed Police": "PAP",
  "Joint Logistics": "Joint logistics",
  "Military education / research": "Education / research",
};

const pathways = [
  {
    title: "Theater command route",
    steps: ["Formation command", "Theater deputy", "Theater principal", "Central selection"],
    note: "Operational breadth and Party status are separate evidence questions.",
  },
  {
    title: "Service headquarters route",
    steps: ["Service staff", "Service deputy", "Service principal", "Central selection"],
    note: "Service representation is not automatic and titles may lag actual duties.",
  },
  {
    title: "Central-joint route",
    steps: ["Joint staff or organ", "CMC department deputy", "Department principal", "Central selection"],
    note: "Protocol position and formal appointment must be kept distinct.",
  },
  {
    title: "Political-control route",
    steps: ["Political work", "Discipline or personnel role", "CMC organ principal", "Central selection"],
    note: "Party, state, operational, and discipline ledgers require separate sourcing.",
  },
  {
    title: "Technical-to-command route",
    steps: ["Platform or technical authority", "Formation / base role", "Joint authority", "Central selection"],
    note: "Visibility in a technical program does not itself establish command conversion.",
  },
];

const currentApexLedgers = [
  {
    ledger: "Party Central Military Commission",
    chair: "Xi Jinping",
    viceChair: "Zhang Shengmin",
    members: "No members listed on the current Xinhua leadership roster at the cutoff",
    sources: [
      { label: "Current Party leadership roster", url: "https://www.news.cn/politics/leaders/" },
      { label: "October 2025 Party appointment", url: "https://www.news.cn/politics/leaders/20251023/d2e8ed117ef3475b8e7bde1916f0f536/c.html" },
    ],
  },
  {
    ledger: "PRC / state Central Military Commission",
    chair: "Xi Jinping",
    viceChair: "Zhang Shengmin",
    members: "No other continuing members established after the 28 August 2026 removals",
    sources: [
      { label: "Zhang Shengmin state appointment", url: "https://www.news.cn/20251029/0d11cf61359e43afafc96ee5c3521b72/c.html" },
      { label: "August 2026 state-CMC removals", url: "https://www.news.cn/politics/20260828/9f7a67c5059e4e7b8a45a8353c5688c8/c.html" },
    ],
  },
  {
    ledger: "Ministry of National Defense",
    chair: "Not a CMC ledger",
    viceChair: "Dong Jun — minister",
    members: "Ministerial office is kept separate from Party- and state-CMC membership",
    sources: [
      { label: "August 2026 current-title observation", url: "https://www.mod.gov.cn/gfbw/qwfb/16480644.html" },
      { label: "December 2023 appointment", url: "https://www.news.cn/politics/20231229/8077204cf8184c13be269a4bbe291084/c.html" },
    ],
  },
];

const coverageRows = [
  {
    area: "CMC and central-joint organs",
    families: ["CMC / central joint"],
    coverage: "Partial principal/deputy coverage",
    holes: "Equipment Development, International Military Cooperation, Audit, Reform and Organizational Structure, Strategic Planning, and Agency for Offices Administration lack explicit current-billet records.",
  },
  {
    area: "Army and theater commands",
    families: ["PLA Army / military district", "Joint theater command"],
    coverage: "Broadest named coverage; incomplete denominator",
    holes: "Several group armies, the refreshed Tibet system, and parts of Central Theater and Army leadership remain unresolved.",
  },
  {
    area: "Navy and Marines",
    families: ["PLA Navy / Marines"],
    coverage: "Partial middle-bench visibility",
    holes: "Southern Theater Navy, submarine bases and staff, Marine principals, surface flotillas, and multiple Party Standing Committee posts remain thin.",
  },
  {
    area: "Air, space, cyber, and information",
    families: ["PLA Air Force", "Aerospace / cyberspace / information"],
    coverage: "Senior anchors plus a thin younger bench",
    holes: "Younger air-base commanders, political-work pipelines, and formal principals/deputies of the reorganized strategic forces are incompletely observed.",
  },
  {
    area: "Rocket Force",
    families: ["PLA Rocket Force"],
    coverage: "Severe post-purge command-chain gap",
    holes: "Bases 61–69, brigade leadership, and the refreshed staff and political-work bench are largely absent from the public registry.",
  },
  {
    area: "Joint Logistics",
    families: ["Joint Logistics"],
    coverage: "Identity and principal-billet gap",
    holes: "Military and political principals, Wuhan headquarters, and the five support-center pipelines remain unresolved; one identity is withheld from public profiles.",
  },
  {
    area: "People's Armed Police",
    families: ["People's Armed Police"],
    coverage: "Thin below top headquarters",
    holes: "Mobile corps, staff, priority regional contingents, Coast Guard, and training leadership are not systematically covered.",
  },
  {
    area: "Military education and research",
    families: ["Military education / research"],
    coverage: "Expanded official institutional coverage",
    holes: "School titles illuminate training ecosystems, not promotion pathways. Faculty, department, and operational-unit denominators remain incomplete.",
  },
];

function humanDate(value?: string | null) {
  if (!value || value === "unknown") return "Not established";
  const exact = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (!exact) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function sourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

function roleStateTone(state: string) {
  if (state === "formal_current") return "status-confirmed";
  if (state === "official_title_with_scope_caveat") return "status-observed";
  if (state === "acting_role_mixture" || state === "inferred_current") return "status-observed";
  if (state === "conflicting_current" || state === "identity_unresolved") return "status-conflict";
  return "status-unknown";
}

function MetricCard({
  value,
  label,
  detail,
  icon: Icon,
}: {
  value: string | number;
  label: string;
  detail: string;
  icon: typeof Users;
}) {
  return (
    <article className="metric-card">
      <div className="metric-icon"><Icon aria-hidden="true" /></div>
      <div>
        <p className="metric-value">{value}</p>
        <p className="metric-label">{label}</p>
        <p className="metric-detail">{detail}</p>
      </div>
    </article>
  );
}

function scoreTone(score: number) {
  if (score >= 70) return "score-high";
  if (score >= 50) return "score-medium";
  return "score-watch";
}

function trendSymbol(trend: string) {
  if (trend === "Strengthening" || trend === "Improving") return "↑";
  if (trend === "Deteriorating" || trend === "Under pressure") return "↓";
  return "→";
}

function CandidateCard({
  candidate,
  officer,
  onOpen,
}: {
  candidate: BoardCandidate;
  officer: Officer;
  onOpen: () => void;
}) {
  const componentRows = scoreModel.map((item) => ({
    ...item,
    value: candidate.components[item.key],
  }));
  const midpoint = Math.round((candidate.scoreRange.low + candidate.scoreRange.high) / 2);
  const relevantRegimes = Object.values(candidate.regimeFit).filter((fit) => fit !== "Low").length;
  const evidenceGateCount = [
    officer.signals.currentRoleSource !== "not_mapped",
    officer.signals.rankRecord === "recorded",
    officer.signals.birthRecord === "recorded",
    officer.signals.partyRecord === "recorded",
    officer.claims.length > 0,
  ].filter(Boolean).length;

  return (
    <article className="candidate-card">
      <div className="candidate-rank"><strong>{candidate.tier}</strong><span className="mono">{candidate.rankBand}</span></div>
      <div className="candidate-main">
        <div className="candidate-head">
          <button className="candidate-name" onClick={onOpen}>
            <strong>{officer.nameEn} <span lang="zh-Hans">{officer.nameZh}</span></strong>
            <small>{officer.billet || "Current billet not established"}</small>
          </button>
          <div className={`candidate-score ${scoreTone(midpoint)}`}>
            <strong className="mono">{candidate.scoreRange.low}–{candidate.scoreRange.high}</strong>
            <span>structural<br />promotability</span>
          </div>
        </div>
        <div className="candidate-score-track range-track" aria-label={`Structural Promotability Index range ${candidate.scoreRange.low} to ${candidate.scoreRange.high} out of 100`}>
          <span style={{ marginLeft: `${candidate.scoreRange.low}%`, width: `${candidate.scoreRange.high - candidate.scoreRange.low}%` }} />
        </div>
        <div className="candidate-meta">
          <span>{branchShortLabel[officer.branch] || officer.branch}</span>
          <span>{officer.evidence.grade} evidence</span>
          <span>{roleStateLabel[officer.roleState] || officer.roleState}</span>
          <span>scenario coverage {relevantRegimes}/4</span>
          <span>last titled {humanDate(officer.lastReliableTitleDate)}</span>
        </div>
        <div className={`documentary-gate ${evidenceGateCount === 5 ? "gate-complete" : "gate-incomplete"}`}>
          <strong>{evidenceGateCount}/5 core records</strong>
          <span>{evidenceGateCount === 5 ? "Role, rank, runway, Party record and a claim-scoped entry are present." : "Incomplete documentary gate: treat the range as a conditional research judgment, not a fully observed ranking."}</span>
        </div>
        {candidate.conditions?.length ? <div className="conditional-ranges">{candidate.conditions.map((item) => <span key={item.label}><b>{item.label}</b><strong className="mono">{item.scoreRange.low}–{item.scoreRange.high}</strong></span>)}</div> : null}
        <dl className="candidate-route">
          <div><dt>Route</dt><dd>{candidate.path}</dd></div>
          <div><dt>Next gate</dt><dd>{candidate.nextGate}</dd></div>
          <div><dt>Kill switch</dt><dd>{candidate.disconfirmer}</dd></div>
        </dl>
        <details className="score-breakdown">
          <summary>Show range construction and regime sensitivity</summary>
          <div className="score-components">
            {componentRows.map((item) => (
              <div key={item.key}>
                <span>{item.label}</span>
                <strong className="mono">{item.value.low}–{item.value.high}<small>/{item.max}</small></strong>
              </div>
            ))}
          </div>
          <div className="regime-vector">{selectionRegimes.map((regime) => <span key={regime.id} data-fit={candidate.regimeFit[regime.id].toLowerCase()}><small>{regime.title}</small><strong>{candidate.regimeFit[regime.id]}</strong></span>)}</div>
        </details>
      </div>
    </article>
  );
}

function SourceLink({ source }: { source: Source }) {
  return (
    <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
      <span>
        <strong>{source.publisher || sourceHost(source.url)}</strong>
        <small>{source.date ? humanDate(source.date) : "Date not recorded"} · {source.class || "Unclassified"}</small>
      </span>
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function OfficerSheet({ officer, onClose }: { officer: Officer | null; onClose: () => void }) {
  const relatedGaps = officer ? data.gaps.filter((gap) => officer.gapIds.includes(gap.id)) : [];
  const boardPlacements = officer
    ? successionBoards.flatMap((board) => board.candidates
      .map((candidate) => ({ board, candidate }))
      .filter((placement) => placement.candidate.officerId === officer.id))
    : [];

  return (
    <Sheet open={Boolean(officer)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="officer-sheet sm:max-w-2xl">
        {officer ? (
          <div className="sheet-scroll">
            <SheetHeader className="sheet-heading">
              <div className="eyebrow-row"><span>{officer.branch}</span><span className="mono">{officer.id}</span></div>
              <SheetTitle className="officer-title">{officer.nameEn} <span lang="zh-Hans">{officer.nameZh}</span></SheetTitle>
              <SheetDescription className="officer-role">{officer.billet || "Current billet not established"}</SheetDescription>
              <div className="status-row">
                <span className={`status-pill ${roleStateTone(officer.roleState)}`}><CircleDot aria-hidden="true" />{roleStateLabel[officer.roleState] || officer.roleState}</span>
                <span className="evidence-description">{evidenceLabel[officer.evidence.grade] || officer.evidence.label}</span>
              </div>
            </SheetHeader>

            <section className="sheet-section">
              <h3>Recorded snapshot</h3>
              <dl className="fact-grid">
                <div><dt>Institution</dt><dd>{officer.institution || "Not established"}</dd></div>
                <div><dt>Rank</dt><dd>{officer.rank || "Not established"}</dd></div>
                <div><dt>Birth year</dt><dd>{officer.birthYear ? `${officer.birthYear} (${officer.birthPrecision})` : "Unknown"}</dd></div>
                <div><dt>Last corroborated</dt><dd>{humanDate(officer.lastReliableTitleDate)}</dd></div>
                <div><dt>Service origin</dt><dd>{officer.serviceOriginDetail || officer.serviceOrigin || "Unresolved"}</dd></div>
                <div><dt>Party status</dt><dd>{officer.partyStatus || "Not established"}</dd></div>
                <div><dt>State CMC ledger</dt><dd>{officer.stateCmcStatus || "Not established"}</dd></div>
                <div><dt>NPC mandate ledger</dt><dd>{officer.npcStatus || "Not established"}</dd></div>
              </dl>
              {officer.evidence.caveat ? <div className="evidence-note"><FileSearch aria-hidden="true" /><p>{officer.evidence.caveat}</p></div> : null}
            </section>

            {boardPlacements.length ? (
              <section className="sheet-section">
                <div className="section-heading-row"><div><p className="section-kicker">Analytic placement</p><h3>Position-specific boards</h3></div><Badge variant="outline">Judgment, not fact</Badge></div>
                <p className="signal-method-note">Ranges compare public pathways for one defined event. They are neither promotion probabilities nor assessments of personal merit.</p>
                <div className="sheet-board-list">
                  {boardPlacements.map(({ board, candidate }) => (
                    <article key={board.id}>
                      <div><span className="mono">{candidate.rankBand}</span><strong>{board.horizon} · {board.title}</strong><b className="mono">{candidate.scoreRange.low}–{candidate.scoreRange.high}</b></div>
                      <p>{candidate.path}</p>
                      <small>Next gate: {candidate.nextGate}</small>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="sheet-section signal-provenance">
              <div className="section-heading-row"><div><p className="section-kicker">Documentary signals</p><h3>What the public record contains</h3></div><Badge variant="outline">Not a score</Badge></div>
              <p className="signal-method-note">These fields describe observed records, their date boundaries, and explicit gaps. They are not indicators of merit, access, or future advancement.</p>
              <dl className="signal-detail-grid">
                <div><dt>Appointment record</dt><dd>{roleStateLabel[officer.signals.appointmentRecord] || officer.signals.appointmentRecord}</dd></div>
                <div><dt>Title freshness</dt><dd>{signalLabel[officer.signals.titleFreshness] || officer.signals.titleFreshness}</dd></div>
                <div><dt>Current-title source</dt><dd>{signalLabel[officer.signals.currentRoleSource] || officer.signals.currentRoleSource}</dd></div>
                <div><dt>Rank record</dt><dd>{signalLabel[officer.signals.rankRecord] || officer.signals.rankRecord}</dd></div>
                <div><dt>Party record</dt><dd>{signalLabel[officer.signals.partyRecord] || officer.signals.partyRecord}</dd></div>
                <div><dt>State / NPC records</dt><dd>{signalLabel[officer.signals.stateCmcRecord] || officer.signals.stateCmcRecord} / {signalLabel[officer.signals.npcRecord] || officer.signals.npcRecord}</dd></div>
                <div><dt>Primary mapped claims</dt><dd>{officer.signals.primaryMappedClaims}</dd></div>
                <div><dt>Birth record</dt><dd>{signalLabel[officer.signals.birthRecord] || officer.signals.birthRecord}</dd></div>
                <div><dt>Linked open gaps</dt><dd>{officer.signals.openGapCount}</dd></div>
              </dl>
            </section>

            <section className="sheet-section">
              <div className="section-heading-row"><div><p className="section-kicker">Claim-level record</p><h3>Source-mapped claims</h3></div><Badge variant="outline">{officer.claims.length} mapped</Badge></div>
              {officer.claims.length ? (
                <div className="claim-list">
                  {officer.claims.map((claim) => (
                    <article key={claim.id} className="claim-card">
                      <div className="claim-meta"><Badge variant="secondary">{claim.field.replaceAll("_", " ")}</Badge><span>{humanDate(claim.observedAt)}</span></div>
                      <p>{claim.value}</p>
                      {claim.temporalScope ? <small>{claim.temporalScope}</small> : null}
                      {claim.doesNotSupport ? <div className="scope-warning"><AlertTriangle aria-hidden="true" />Does not establish: {claim.doesNotSupport}</div> : null}
                      {claim.sourceUrl ? <a href={claim.sourceUrl} target="_blank" rel="noreferrer">Open supporting source <ArrowUpRight aria-hidden="true" /></a> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state compact"><FileSearch aria-hidden="true" /><p>No claim-scoped entries are mapped to this dossier yet. General discovery sources are listed below.</p></div>
              )}
            </section>

            {relatedGaps.length ? (
              <section className="sheet-section">
                <div className="section-heading-row"><div><p className="section-kicker">Collection needs</p><h3>Linked research gaps</h3></div></div>
                <div className="mini-gap-list">
                  {relatedGaps.map((gap) => <article key={gap.id}><span className="mono">{gap.id}</span><strong>{gap.title}</strong><p>{gap.evidenceNeeded}</p></article>)}
                </div>
              </section>
            ) : null}

            <section className="sheet-section">
              <div className="section-heading-row"><div><p className="section-kicker">Bibliography</p><h3>Dossier sources</h3></div><Badge variant="outline">{officer.sourceCount} links</Badge></div>
              <div className="source-list">{officer.sources.map((source, index) => <SourceLink key={`${source.url}-${index}`} source={source} />)}</div>
            </section>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("assessment");
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("all");
  const [roleState, setRoleState] = useState("all");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [visibleCount, setVisibleCount] = useState(36);
  const [sourceQuery, setSourceQuery] = useState("");
  const [sourceFamily, setSourceFamily] = useState("all");
  const [signalBranch, setSignalBranch] = useState("all");
  const [signalMode, setSignalMode] = useState("all");
  const [timelineMode, setTimelineMode] = useState("all");

  const branches = useMemo(() => [...new Set(data.officers.map((officer) => officer.branch))].sort(), []);

  const filteredOfficers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.officers.filter((officer) => {
      const matchesBranch = branch === "all" || officer.branch === branch;
      const matchesRole = roleState === "all" || officer.roleState === roleState;
      const haystack = [officer.nameEn, officer.nameZh, officer.id, officer.branch, officer.institution, officer.billet, officer.rank, officer.serviceOriginDetail].filter(Boolean).join(" ").toLowerCase();
      return matchesBranch && matchesRole && (!needle || haystack.includes(needle));
    });
  }, [branch, query, roleState]);

  const filteredSources = useMemo(() => {
    const needle = sourceQuery.trim().toLowerCase();
    return data.sources.filter((source) => {
      const matchesFamily = sourceFamily === "all" || source.family === sourceFamily;
      const haystack = [source.publisher, source.url, source.class, source.family, ...(source.scopes ?? [])].filter(Boolean).join(" ").toLowerCase();
      return matchesFamily && (!needle || haystack.includes(needle));
    });
  }, [sourceFamily, sourceQuery]);

  const filteredSignals = useMemo(() => data.officers.filter((officer) => {
    const matchesBranch = signalBranch === "all" || officer.branch === signalBranch;
    const matchesMode = signalMode === "all"
      || (signalMode === "official" && officer.signals.currentRoleSource === "official_mapped")
      || (signalMode === "fresh" && officer.signals.titleFreshness === "observed_2026")
      || (signalMode === "party" && officer.signals.partyRecord === "recorded")
      || (signalMode === "birth" && officer.signals.birthRecord === "recorded")
      || (signalMode === "gaps" && officer.signals.openGapCount > 0);
    return matchesBranch && matchesMode;
  }), [signalBranch, signalMode]);

  const pipelineGroups = useMemo(() => data.pipelineSources.reduce<Record<string, PipelineSource[]>>((groups, source) => {
    (groups[source.family] ??= []).push(source);
    return groups;
  }, {}), []);

  const timelineRecords = useMemo(() => {
    if (timelineMode === "confirmed") return data.adverse.filter((record) => record.controlledState === "confirmed_exit");
    if (timelineMode === "unresolved") return data.adverse.filter((record) => record.controlledState === "unresolved_adverse_watch");
    return data.adverse;
  }, [timelineMode]);

  const publicationHoldCount = data.metadata.canonicalOfficerCount - data.metadata.officerCount;
  const bypassWatchCount = data.adverse.filter((record) => record.status === "promotion-bypass-unresolved").length;

  const maxBranchCount = Math.max(...data.metadata.branchCounts.map((item) => item.count));

  function openOfficer(id: string) {
    setSelectedOfficer(data.officers.find((item) => item.id === id) ?? null);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PLA Leadership Observatory home">
          <span className="brand-mark" aria-hidden="true"><Network /></span>
          <span><strong>PLA Leadership</strong><small>Observatory</small></span>
        </a>
        <div className="topbar-meta"><span className="data-cutoff"><span className="live-dot" />Data cutoff {humanDate(data.metadata.asOf)}</span><span className="build-id mono">{data.metadata.buildId}</span></div>
      </header>

      <div id="top" className="workspace">
        <section className="briefing-header">
          <div className="briefing-copy">
            <p className="eyebrow">Current estimate · 2 September 2026</p>
            <h1>What kind of military leadership system is China building?</h1>
            <p>An evidence-bounded assessment of succession, command authority, political control, and the PLA’s capacity to coordinate under pressure.</p>
          </div>
          <aside className="editorial-note"><Scale aria-hidden="true" /><div><strong>Estimative discipline</strong><p>Formal role, promotion potential, evidentiary confidence, and operational consequence remain separate. Scores order pathways; they are not probabilities.</p></div></aside>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="main-tabs">
          <div className="tabs-bar">
            <TabsList variant="line" className="tabs-list">
              <TabsTrigger value="assessment">Estimate</TabsTrigger>
              <TabsTrigger value="directory">Officers</TabsTrigger>
              <TabsTrigger value="succession">Succession</TabsTrigger>
              <TabsTrigger value="institutions">Command system</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="signals">Evidence lab</TabsTrigger>
              <TabsTrigger value="timeline">Churn</TabsTrigger>
              <TabsTrigger value="evidence">Sources</TabsTrigger>
              <TabsTrigger value="gaps">Gaps</TabsTrigger>
              <TabsTrigger value="backtest">Backtest</TabsTrigger>
              <TabsTrigger value="method">Method</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="assessment" className="tab-panel">
            <section className="assessment-lead">
              <div>
                <p className="section-kicker">Key judgment</p>
                <h2>The next high command is being politically re-certified, not merely promoted.</h2>
                <p>The 2026 senior-cadre course, new supervision measures, and repeated purge actions put a largely hidden clearance gate in front of ordinary career conversion. The result is a system restoring political control faster than command integration. The next CMC architecture—not a one-name horse race—will reveal which cost Xi is prepared to accept.</p>
              </div>
              <aside>
                <span className="mono">ASSESSMENT CONFIDENCE</span>
                <strong>Moderate</strong>
                <p>High confidence in documented churn and authority gaps. Lower confidence in how internal vetting, staff continuity, and operational performance interact.</p>
              </aside>
            </section>

            <section className="decision-brief" aria-label="Action brief">
              <article><span className="mono">CORE MECHANISM</span><strong>Vetting is now a selection stage, not merely an after-the-fact punishment system.</strong><p>The center is refilling a damaged command structure while auditing the political reliability of the eligible bench.</p></article>
              <article><span className="mono">RIVAL EXPLANATION</span><strong>Visible vacancies may overstate operational disruption.</strong><p>Standing staffs and delegated authority could preserve routine output even while senior appointments remain opaque.</p></article>
              <article><span className="mono">DISCRIMINATING EVIDENCE</span><strong>Watch formalization and cross-organizational command behavior.</strong><p>Exact appointment acts, Party-slate inclusion, repeated title-bearing performance, and difficult joint exercises would separate repair from façade.</p></article>
            </section>

            <section className="judgment-stack judgment-stack-priority">
              <div className="section-heading-row"><div><p className="section-kicker">Five estimative judgments</p><h3>The argument in one page</h3></div><Badge variant="outline">Confidence stated per judgment</Badge></div>
              {leadJudgments.map((judgment, index) => (
                <article key={judgment.title}>
                  <span className="judgment-number mono">0{index + 1}</span>
                  <div><div className="judgment-title"><h4>{judgment.title}</h4><Badge variant="secondary">{judgment.confidence}</Badge></div><p>{judgment.text}</p></div>
                </article>
              ))}
            </section>

            <section className="research-frontier">
              <div className="section-heading-row"><div><p className="section-kicker">Research frontier</p><h3>Six questions the current model still cannot answer</h3><p>These are not generic caveats. Each one changes a ranking, a scenario judgment, or the unit of analysis.</p></div><Badge variant="outline">Collection before confidence</Badge></div>
              <div className="frontier-grid">{researchFrontiers.map((item) => <article key={item.id}><header><span className="mono">{item.id}</span><Badge variant="outline">{item.confidence}</Badge></header><h4>{item.question}</h4><p>{item.why}</p><dl><div><dt>Known</dt><dd>{item.known}</dd></div><div><dt>Unknown</dt><dd>{item.unknown}</dd></div><div><dt>Next collection</dt><dd>{item.next}</dd></div></dl><a href={item.url} target="_blank" rel="noreferrer">Open anchor source <ArrowUpRight /></a></article>)}</div>
            </section>

            <section className="selector-funnel">
              <div className="section-heading-row"><div><p className="section-kicker">Selector funnel</p><h3>The score orders visible pathways; it cannot observe the hidden veto</h3><p>Selection is modeled as sequential gates. A later failure cannot be offset by adding more résumé points upstream.</p></div><Badge variant="outline">Non-additive logic</Badge></div>
              <div>{selectorFunnel.map((item) => <article key={item.step}><span className="mono">{item.step}</span><div><small>{item.kind} · {item.status}</small><strong>{item.label}</strong><p>{item.test}</p><em>{item.boundary}</em></div></article>)}</div>
            </section>

            <section className="change-ledger">
              <div className="section-heading-row"><div><p className="section-kicker">Changes since the prior cut</p><h3>The model now preserves analytical movement</h3></div><Badge variant="outline">{changesSinceCut.length} consequential changes</Badge></div>
              <div>{changesSinceCut.map((item) => <article key={item.subject}><span className="mono">{item.type}</span><strong>{item.subject}</strong><p>{item.change}</p><small>{item.reason}</small></article>)}</div>
            </section>

            <section className="metric-grid" aria-label="Dataset summary">
              <MetricCard value={successionBoards.length} label="Event-specific boards" detail="Party-CMC, principal conversion, 2036 bench, and 2041 feeders" icon={Target} />
              <MetricCard value={data.metadata.officerCount} label="Officer dossiers beneath them" detail={`${data.metadata.canonicalOfficerCount} canonical records; identity and adverse holds enforced`} icon={Users} />
              <MetricCard value={data.metadata.primaryOfficialSourceCount} label="Official / institutional sources" detail={`${data.metadata.sourceCount} unique links plus specialist reconstruction`} icon={Database} />
              <MetricCard value="Extreme" label="2041 identity uncertainty" detail="No false probability mass is assigned to unnamed officers" icon={GitBranch} />
              <MetricCard value={data.metadata.gapCount} label="Decisive collection gaps" detail="Each has a closure test and prohibited inference" icon={FileSearch} />
            </section>

            <section className="promotion-market">
              <div className="section-heading-row"><div><p className="section-kicker">Observed promotion market</p><h3>What recent cohorts actually reward</h3><p>Reverse-conditional route evidence is used to discipline judgment. It is not a prediction rate.</p></div><Badge variant="outline">Beyond biography scoring</Badge></div>
              <div>{promotionMarket.map((item) => <a key={item.period} href={item.url} target="_blank" rel="noreferrer"><span className="mono">{item.period}</span><strong>{item.signal}</strong><p>{item.implication}</p><small>{item.source} <ArrowUpRight /></small></a>)}</div>
            </section>

            <section className="fitness-section">
              <div className="section-heading-row"><div><p className="section-kicker">Leadership-system fitness</p><h3>Where the emerging system looks strong—and brittle</h3><p>These are institutional assessments, not officer grades. Ratings summarize the direction of the public evidence and name the central tradeoff.</p></div></div>
              <div className="fitness-grid">
                {systemFitness.map((item) => (
                  <article key={item.dimension}>
                    <div className="fitness-head"><strong>{item.dimension}</strong><span className={`trend trend-${trendSymbol(item.trend) === "↑" ? "up" : trendSymbol(item.trend) === "↓" ? "down" : "flat"}`}><b>{trendSymbol(item.trend)}</b>{item.trend}</span></div>
                    <p className="fitness-rating">{item.rating}</p>
                    <dl><div><dt>Capacity</dt><dd>{item.implication}</dd></div><div><dt>Tension</dt><dd>{item.tension}</dd></div></dl>
                  </article>
                ))}
              </div>
            </section>

            <section className="decision-gates">
              <div className="section-heading-row"><div><p className="section-kicker">What changes the assessment</p><h3>Four decisive gates</h3></div></div>
              <div>{decisionGates.map((item, index) => <article key={item.gate}><span className="mono">G{index + 1}</span><div><small>{item.window}</small><strong>{item.gate}</strong><p>{item.consequence}</p></div></article>)}</div>
            </section>

            <section className="career-sequence-section">
              <div className="section-heading-row"><div><p className="section-kicker">Career-sequence reconstruction</p><h3>Why a route matters more than a famous title</h3></div><Badge variant="outline">Fact sequence → analytic gate</Badge></div>
              <div className="career-sequence-grid">{careerSequences.map((item) => <article key={item.officerId}><button onClick={() => openOfficer(item.officerId)}>{item.title}<ChevronRight /></button><ol>{item.sequence.map((step, index) => <li key={step}><span className="mono">{index + 1}</span>{step}</li>)}</ol><p>{item.analytic}</p><a href={item.url} target="_blank" rel="noreferrer">Open route source <ArrowUpRight /></a></article>)}</div>
            </section>

            <section className="collection-sensitivity">
              <div className="section-heading-row"><div><p className="section-kicker">Forecast sensitivity</p><h3>Where one new fact would move the board</h3></div><Badge variant="outline">Live unique pool: {scoredOfficers.length} officers</Badge></div>
              <div>{collectionSensitivity.map((item) => <article key={item.label}><strong className="mono">{item.metric}</strong><span>{item.label}</span><p>{item.consequence}</p></article>)}</div>
            </section>

            <section className="assessment-method">
              <div><p className="section-kicker">Confirmed record</p><strong>{data.metadata.currentRoleMappedCount} current-role dossiers have a mapped source.</strong><p>Formal decisions, dated official title observations, Party/state ledgers, and adverse actions remain claim-scoped.</p></div>
              <div><p className="section-kicker">Reasonable inference</p><strong>Boards compare pathways, not personalities.</strong><p>Ranges synthesize target access, cleared gates, route precedent, mission fit, Party standing, and verified runway.</p></div>
              <div><p className="section-kicker">Speculation boundary</p><strong>Identity uncertainty is categorical, not pseudo-probabilistic.</strong><p>2041 is a feeder portfolio. Evidence and role truth sit outside the promotability range.</p></div>
            </section>

            <section className="context-strip" aria-labelledby="context-title">
              <div className="context-intro"><p className="section-kicker">Current context</p><h2 id="context-title">A command system in exceptional churn</h2><p>Formal decisions, official institutional reporting, and specialist reconstruction are shown as separate source families. Each card links directly to the underlying publication.</p></div>
              <div className="context-cards">
                {data.contextSources.map((source, index) => (
                  <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className={`context-card context-${index + 1}`}>
                    <div><span>{source.publisher}</span><time>{humanDate(source.date)}</time></div><strong>{source.title}</strong><p>{source.note}</p><small>Open source <ArrowUpRight aria-hidden="true" /></small>
                  </a>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="succession" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Position-specific succession</p><h2>Rank the route to an exact seat—not the officer in the abstract</h2><p>Every board defines a different event and decision window. The Structural Promotability Index is a bounded ordinal range, not a percentage; overlapping intervals share rank bands.</p></div></section>
            <section className="score-key">
              <div><BarChart3 /><p><strong>Gate tier before score</strong><span>Formal grade and exact role cannot be offset by résumé breadth.</span></p></div>
              <div><FileSearch /><p><strong>Evidence outside the index</strong><span>E1–E4 and role state describe what we know, not underlying promise.</span></p></div>
              <div><GitBranch /><p><strong>Ranges and regime stability</strong><span>Unknown age or Party data widen intervals; rival selection logics remain visible.</span></p></div>
            </section>
            <div className="board-stack">
              {successionBoards.map((board) => (
                <section key={board.id} className="succession-board">
                  <header>
                    <div><p className="section-kicker">{board.horizon} outcome · {board.decisionWindow}</p><h3>{board.title}</h3><p>{board.event}</p></div>
                    <aside><span>Identity uncertainty</span><strong>{board.identityUncertainty}</strong><small>No probability mass implied</small></aside>
                  </header>
                  <div className="board-reading"><BookOpen /><p>{board.reading}</p></div>
                  <div className="candidate-list">
                    {board.candidates.map((candidate) => {
                      const officer = data.officers.find((item) => item.id === candidate.officerId);
                      return officer ? <CandidateCard key={candidate.officerId} candidate={candidate} officer={officer} onOpen={() => setSelectedOfficer(officer)} /> : null;
                    })}
                  </div>
                </section>
              ))}
            </div>
            <section className="technical-lanes">
              <div className="section-heading-row"><div><p className="section-kicker">Separate target family</p><h3>Technical authority is not operational succession</h3><p>These cases are ranked for the specific institution they could lead. The ranges are not comparable with a theater, service, or Party-CMC board.</p></div><Badge variant="outline">No command shortcut</Badge></div>
              <div>{technicalAuthorityCases.map((item) => <article key={item.name}><header><div><strong>{item.name} <span lang="zh-Hans">{item.nameZh}</span></strong><small>{item.lane}</small></div><b className="mono">{item.range}</b></header><p>{item.secure}</p><dl><div><dt>Current boundary</dt><dd>{item.current}</dd></div><div><dt>Next conversion</dt><dd>{item.gate}</dd></div><div><dt>Do not infer</dt><dd>{item.wrongInference}</dd></div></dl><div>{item.officerId ? <button onClick={() => openOfficer(item.officerId)}>Open dossier <ChevronRight /></button> : null}<a href={item.url} target="_blank" rel="noreferrer">Primary / institutional source <ArrowUpRight /></a></div></article>)}</div>
            </section>
            <section className="behavior-evidence">
              <div className="section-heading-row"><div><p className="section-kicker">Selection × observable behavior</p><h3>Promotability and demonstrated command behavior are separate axes</h3><p>A high behavior grade means identity-secure, dated evidence across actions, doctrine, learning, or institution-building. It does not add points to the succession score.</p></div><Badge variant="outline">B0–B4 · not merit</Badge></div>
              <div>{behaviorEvidenceCases.map((item) => <article key={item.officerId}><header><button onClick={() => openOfficer(item.officerId)}>{item.name}<ChevronRight /></button><Badge variant="secondary">{item.grade}</Badge></header><small>{item.lane}</small><p>{item.observation}</p><dl><div><dt>Permitted inference</dt><dd>{item.permits}</dd></div><div><dt>Do not infer</dt><dd>{item.forbids}</dd></div><div><dt>Counterevidence</dt><dd>{item.counter}</dd></div></dl><a href={item.url} target="_blank" rel="noreferrer">Open behavior source <ArrowUpRight /></a></article>)}</div>
            </section>
            <section className="score-model">
              <div className="section-heading-row"><div><p className="section-kicker">Structural Promotability Index</p><h3>What the range actually contains</h3></div><Badge variant="outline">Six substantive dimensions · 100 maximum</Badge></div>
              <div>{scoreModel.map((item) => <article key={item.key}><div><strong>{item.label}</strong><span className="mono">{item.max}</span></div><p>{item.question}</p></article>)}</div>
              <p className="model-warning"><AlertTriangle />Evidence quality, behavior evidence, role truth, hidden vetting, and unresolved adverse concerns are not points. The six components contain correlated career gates and are an ordinal pathway construction—not independent causal effects. Unknown birth data never earns favorable runway.</p>
            </section>

            <section className="forecast-ledger">
              <div className="section-heading-row"><div><p className="section-kicker">Dated forecast ledger</p><h3>Claims designed to be scored later</h3><p>Each entry states the event, resolution window, and evidence that would confirm or break the forecast. “Open” means unadjudicated—not correct.</p></div><Badge variant="outline">As of 1 Sep. 2026</Badge></div>
              <div className="forecast-list">{forecastLedger.map((item) => <article key={item.id}><header><span className="mono">{item.id}</span><Badge variant="outline">{item.status}</Badge></header><small>{item.window} · {item.confidence} confidence</small><h4>{item.forecast}</h4><dl><div><dt>Confirm</dt><dd>{item.confirms}</dd></div><div><dt>Break</dt><dd>{item.disconfirms}</dd></div><div><dt>Why it matters</dt><dd>{item.implication}</dd></div></dl></article>)}</div>
            </section>
          </TabsContent>

          <TabsContent value="backtest" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Historical promotion backtest</p><h2>Which routes actually produced senior winners?</h2><p>The backtest checks the scoring logic against observed promotion cohorts. It disciplines route judgments; it cannot supply direct individual probabilities because the eligible-loser denominator is missing.</p></div><Badge variant="outline">Reverse conditional</Badge></section>
            <section className="backtest-warning"><AlertTriangle /><div><strong>Read the denominator before the percentage.</strong><p>{historicalBacktest.warning}</p></div></section>
            <section className="cohort-comparison">
              {historicalBacktest.cohorts.map((cohort) => <article key={cohort.year}><span className="mono">{cohort.year}</span><strong>{cohort.seniorOfficers}</strong><p>{cohort.measure}</p><small>{cohort.finding}</small></article>)}
              <article className="cohort-limit"><span className="mono">MISSING</span><strong>Eligible losers</strong><p>Theater-command deputy-grade population at each appointment decision</p><small>Without this denominator, route prevalence cannot become a promotion rate.</small></article>
            </section>
            <section className="architecture-backtest">
              <div className="section-heading-row"><div><p className="section-kicker">Architecture before names</p><h3>The target institution changed before the candidate pool did</h3><p>The 2012 commission is a pre-reform baseline; 2017 is the development case and 2022 the holdout outcome.</p></div></div>
              <div>{cmcArchitectureBacktest.map((cycle, index) => <a key={cycle.cycle} href={cycle.url} target="_blank" rel="noreferrer"><span className="mono">{cycle.cycle}</span><div className="seat-count"><strong>{cycle.seats}</strong><small>total seats including chair</small></div><b>{cycle.role}</b><p>{cycle.reading}</p>{index < cmcArchitectureBacktest.length - 1 ? <i>→</i> : null}</a>)}</div>
            </section>
            <section className="turnover-backtest">
              <div className="section-heading-row"><div><p className="section-kicker">Direct roster comparison</p><h3>Party-CMC turnover and feeder routes</h3><p>New entrants are defined by first-plenum roster differences; feeder roles are frozen before the final Congress run-in.</p></div></div>
              <div className="turnover-grid">{historicalBacktest.cmcTurnover.map((cycle) => <article key={cycle.cycle}><span className="mono">{cycle.cycle}</span><strong>{cycle.entrants}<small> / {cycle.uniformedSeats}</small></strong><p>new entrants · {cycle.share}</p><small>{cycle.retained} retained</small></article>)}</div>
              <div className="entrant-route-grid">{historicalBacktest.entrantRoutes.map((route) => <article key={route.route}><div><strong className="mono">{route.count}/{route.denominator}</strong><span>{route.share}</span></div><h4>{route.route}</h4><p>{route.definition}</p></article>)}</div>
            </section>
            <section className="conversion-matrix">
              <div className="section-heading-row"><div><p className="section-kicker">Post-2019 conversion matrix</p><h3>Six empirical constraints on the scoring model</h3></div><Badge variant="outline">31-case core sample</Badge></div>
              <div>{historicalBacktest.conversionMatrix.map((item) => <article key={item.metric}><strong className="mono">{item.metric}</strong><h4>{item.label}</h4><p>{item.implication}</p></article>)}</div>
            </section>
            <section className="route-backtest">
              <div className="section-heading-row"><div><p className="section-kicker">Winner-side route prevalence</p><h3>Strong route anchors, not selection odds</h3></div></div>
              <div>{historicalBacktest.routes.map((route) => <article key={`${route.target}-${route.route}`}><div className="route-stat"><strong className="mono">{route.numerator}/{route.denominator}</strong><span>{route.target}</span></div><div><h4>{route.route}</h4><p>{route.interval}</p><small>{route.use}</small></div></article>)}</div>
            </section>
            <section className="party-sync-section">
              <div className="section-heading-row"><div><p className="section-kicker">Party synchronization</p><h3>Party status arrives late in the normal sequence</h3><p>The cross-section supports a Congress-window variable, not a generic lifetime Party bonus.</p></div></div>
              <div>{historicalBacktest.partySynchronization.map((item) => <article key={`${item.group}-${item.value}`}><strong className="mono">{item.value}</strong><span>{item.share}</span><h4>{item.group}</h4><p>{item.reading}</p></article>)}</div>
            </section>
            <section className="model-verdicts">
              <div className="section-heading-row"><div><p className="section-kicker">Model audit</p><h3>What survived the backtest—and what did not</h3></div></div>
              <div>{historicalBacktest.modelVerdicts.map((item) => <article key={item.factor}><header><strong>{item.factor}</strong><Badge variant={item.verdict === "Survives" ? "secondary" : "outline"}>{item.verdict}</Badge></header><small>{item.confidence} confidence</small><p>{item.reason}</p></article>)}</div>
            </section>
            <section className="role-state-section">
              <div className="section-heading-row"><div><p className="section-kicker">Role-state ladder</p><h3>Authority is not a binary field</h3><p>Functional control, formal appointment, rank, and position level remain separately observable.</p></div></div>
              <div>{roleStateFramework.map((state) => <article key={state.code}><span className="mono">{state.code}</span><div><strong>{state.label}</strong><p>{state.minimum}</p><small>{state.permits}</small></div></article>)}</div>
            </section>
            <section className="backtest-sources"><div><p className="section-kicker">Core empirical sources</p><h3>Independent of roster aggregators</h3></div>{historicalBacktest.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.publisher}</span><strong>{source.title}</strong><ArrowUpRight /></a>)}</section>
          </TabsContent>

          <TabsContent value="scenarios" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Rival selection regimes</p><h2>What kind of CMC is Xi rebuilding?</h2><p>Each regime rewards a different pool. No regime probability is assigned; scenario coverage shows analyst-assigned relevance under four alternative logics, not empirical robustness.</p></div></section>
            <section className="seat-architecture">
              <div className="section-heading-row"><div><p className="section-kicker">Seat architecture × regime</p><h3>Candidate pools change when the institution changes</h3></div></div>
              <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Seat archetype</TableHead><TableHead>Institutional equilibrium</TableHead><TableHead>Control-led</TableHead><TableHead>Readiness repair</TableHead><TableHead>Technical turn</TableHead></TableRow></TableHeader><TableBody>{seatArchitecture.map((row) => <TableRow key={row.seat}><TableCell><strong>{row.seat}</strong></TableCell><TableCell>{row.equilibrium}</TableCell><TableCell>{row.control}</TableCell><TableCell>{row.readiness}</TableCell><TableCell>{row.technical}</TableCell></TableRow>)}</TableBody></Table></div>
            </section>
            <div className="scenario-grid">
              {scenarios.map((scenario) => (
                <article key={scenario.id}>
                  <div className="scenario-label"><span>{scenario.label}</span><GitBranch /></div>
                  <h3>{scenario.title}</h3><p className="scenario-thesis">{scenario.thesis}</p>
                  <dl><div><dt>Who gains</dt><dd>{scenario.beneficiaries}</dd></div><div><dt>Effectiveness implication</dt><dd>{scenario.effectiveness}</dd></div></dl>
                  <div className="signpost-list"><strong>Observable signposts</strong>{scenario.signposts.map((signpost) => <p key={signpost}><CheckCircle2 />{signpost}</p>)}</div>
                </article>
              ))}
            </div>
            <section className="indicator-engine">
              <div className="section-heading-row"><div><p className="section-kicker">Indications and warning</p><h3>Observable thresholds that move the forecast</h3><p>Each trigger specifies a threshold, deadline, rival hypotheses, and affected judgment. This is more demanding than a generic “watch this space.”</p></div><Badge variant="outline">6 active indicators</Badge></div>
              <div>{indicatorEngine.map((item) => <article key={item.id}><header><span className="mono">{item.id}</span><strong>{item.observation}</strong><small>{item.deadline}</small></header><div className="indicator-threshold"><b>Trigger</b><p>{item.threshold}</p></div><dl><div><dt>Supports</dt><dd>{item.supports}</dd></div><div><dt>Weakens</dt><dd>{item.weakens}</dd></div><div><dt>Moves</dt><dd>{item.affects}</dd></div><div><dt>Preferred source</dt><dd>{item.sourcePath}</dd></div></dl></article>)}</div>
            </section>
            <section className="hypothesis-section">
              <div className="section-heading-row"><div><p className="section-kicker">Competing interpretations</p><h3>Do not let one story monopolize ambiguous evidence</h3></div></div>
              {competingHypotheses.map((hypothesis) => (
                <article key={hypothesis.question} className="hypothesis-card"><h4>{hypothesis.question}</h4><div>{hypothesis.readings.map((reading) => <section key={reading.label}><strong>{reading.label}</strong><p>{reading.case}</p><small><b>Discriminating test:</b> {reading.test}</small></section>)}</div></article>
              ))}
            </section>
            <section className="task-fit-section">
              <div className="section-heading-row"><div><p className="section-kicker">Task–leader fit</p><h3>The leadership requirement changes by mission and time phase</h3><p>Public career proxies are matched to task demands. A rehearsed opening operation and a thirty-day adaptation problem can stress entirely different leaders and staff systems.</p></div><Badge variant="outline">7 scenario teams</Badge></div>
              <div className="attribution-wall"><AlertTriangle /><div><strong>Output-attribution wall</strong><p>The Southern Theater conducted naval-air patrols on 2 September while its public principal identities remained opaque. That is evidence of institutional output and staff continuity—not a performance credit for any named officer.</p><a href="https://www.news.cn/politics/20260902/2cee82c5c39342ec8de53145bcc2b62d/c.html" target="_blank" rel="noreferrer">Open official patrol report <ArrowUpRight /></a></div></div>
              <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Strategic task</TableHead><TableHead>Decisive phase</TableHead><TableHead>Leadership requirement</TableHead><TableHead>Public proxy</TableHead><TableHead>Visible / hidden lanes</TableHead><TableHead>Confidence</TableHead><TableHead>Failure mode</TableHead></TableRow></TableHeader><TableBody>{taskLeaderFit.map((row) => <TableRow key={row.task}><TableCell><strong>{row.task}</strong></TableCell><TableCell>{row.phase}</TableCell><TableCell>{row.requirement}</TableCell><TableCell>{row.proxy}</TableCell><TableCell>{row.bench}</TableCell><TableCell><Badge variant="outline">{row.confidence}</Badge></TableCell><TableCell>{row.failure}</TableCell></TableRow>)}</TableBody></Table></div>
            </section>
            <section className="causal-chain-section">
              <div className="section-heading-row"><div><p className="section-kicker">Leadership → effectiveness</p><h3>Testable causal chains, not personality claims</h3><p>The site does not infer battlefield behavior from a biography. It traces how a selection pattern could alter incentives and observable organizational behavior.</p></div></div>
              <div>{effectivenessCausalChains.map((item) => <article key={item.selection}><div className="causal-flow"><span><small>Selection</small><strong>{item.selection}</strong></span><ChevronRight /><span><small>Incentive</small><strong>{item.incentive}</strong></span><ChevronRight /><span><small>Behavior</small><strong>{item.behavior}</strong></span><ChevronRight /><span><small>Consequence</small><strong>{item.consequence}</strong></span></div><dl><div><dt>Alternative explanation</dt><dd>{item.alternative}</dd></div><div><dt>Discriminating observation</dt><dd>{item.observable}</dd></div></dl></article>)}</div>
            </section>
            <section className="pathways-section">
              <div className="section-heading-row"><div><p className="section-kicker">Promotion architecture</p><h3>Five routes, each with a conversion problem</h3></div></div>
              <div className="method-grid">{pathways.map((pathway) => <article key={pathway.title} className="pathway-card"><h3>{pathway.title}</h3><ol>{pathway.steps.map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong>{index < pathway.steps.length - 1 ? <ChevronRight /> : null}</li>)}</ol><p>{pathway.note}</p></article>)}</div>
            </section>
            <section className="analytical-source-section">
              <div className="section-heading-row"><div><p className="section-kicker">Analytic foundation beyond roster sites</p><h3>Rules, empirical cohorts, and diagnostic method</h3></div><Badge variant="outline">Claim-bounded use</Badge></div>
              <div>{analyticalSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.publisher}</span><strong>{source.title}</strong><p>{source.use}</p><small>Open source <ArrowUpRight /></small></a>)}</div>
            </section>
          </TabsContent>

          <TabsContent value="directory" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">People directory</p><h2>Search the full officer universe</h2><p>Default order is alphabetical. Role-state labels describe the public appointment record, not seniority or merit.</p></div><div className="panel-actions"><Badge variant="outline">{filteredOfficers.length} records</Badge><Button asChild variant="outline" size="sm"><a href="/data/pla-leadership-observatory-public.csv" download><Download />CSV</a></Button><Button asChild variant="outline" size="sm"><a href="/data/pla-leadership-observatory-public.json" download><Download />JSON</a></Button></div></section>
            <div className="filter-bar">
              <div className="search-field"><Search aria-hidden="true" /><Input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(36); }} placeholder="Search English, 汉字, billet, institution, or stable ID" aria-label="Search officer records" /></div>
              <Select value={branch} onValueChange={(value) => { setBranch(value); setVisibleCount(36); }}>
                <SelectTrigger aria-label="Filter by institution family" className="filter-select"><Filter /><SelectValue placeholder="All institutions" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All institution families</SelectItem>{branches.map((item) => <SelectItem key={item} value={item}>{branchShortLabel[item] || item}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={roleState} onValueChange={(value) => { setRoleState(value); setVisibleCount(36); }}>
                <SelectTrigger aria-label="Filter by appointment record" className="filter-select"><SelectValue placeholder="All role states" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All appointment states</SelectItem>{Object.entries(roleStateLabel).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
              </Select>
              {(query || branch !== "all" || roleState !== "all") ? <Button variant="ghost" onClick={() => { setQuery(""); setBranch("all"); setRoleState("all"); setVisibleCount(36); }}>Clear</Button> : null}
            </div>

            {filteredOfficers.length ? (
              <>
                <div className="directory-table desktop-only">
                  <Table>
                    <TableHeader><TableRow><TableHead>Officer</TableHead><TableHead>Recorded billet</TableHead><TableHead>Institution family</TableHead><TableHead>Appointment record</TableHead><TableHead>Last corroborated</TableHead><TableHead className="text-right">Sources</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredOfficers.slice(0, visibleCount).map((officer) => (
                        <TableRow key={officer.id}>
                          <TableCell><button className="person-link" onClick={() => setSelectedOfficer(officer)}><span>{officer.nameEn}</span><small lang="zh-Hans">{officer.nameZh}</small></button></TableCell>
                          <TableCell className="billet-cell">{officer.billet || "Not established"}</TableCell>
                          <TableCell>{branchShortLabel[officer.branch] || officer.branch}</TableCell>
                          <TableCell><span className={`status-pill ${roleStateTone(officer.roleState)}`}>{roleStateLabel[officer.roleState] || officer.roleState}</span></TableCell>
                          <TableCell>{humanDate(officer.lastReliableTitleDate)}</TableCell>
                          <TableCell className="text-right mono">{officer.sourceCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mobile-directory mobile-only">
                  {filteredOfficers.slice(0, visibleCount).map((officer) => <button key={officer.id} className="mobile-person-card" onClick={() => setSelectedOfficer(officer)}><div><strong>{officer.nameEn} <span lang="zh-Hans">{officer.nameZh}</span></strong><small>{branchShortLabel[officer.branch] || officer.branch}</small></div><p>{officer.billet || "Current billet not established"}</p><span className={`status-pill ${roleStateTone(officer.roleState)}`}>{roleStateLabel[officer.roleState] || officer.roleState}</span></button>)}
                </div>
                {visibleCount < filteredOfficers.length ? <div className="load-more"><Button variant="outline" onClick={() => setVisibleCount((count) => count + 36)}>Show 36 more</Button></div> : null}
              </>
            ) : <div className="empty-state"><Search aria-hidden="true" /><h3>No matching records</h3><p>Try a different transliteration, Chinese name, institution, or role-state filter.</p></div>}
          </TabsContent>

          <TabsContent value="signals" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Evidence lab</p><h2>What an observation proves—and what it cannot</h2><p>Evidence is calibrated against true positives, false positives, formal-process lags, mutable pages, and exact Chinese title language before it touches an officer judgment.</p></div><Badge variant="outline">Four clocks · 12 release tests</Badge></section>
            <section className="calibration-section">
              <div className="section-heading-row"><div><p className="section-kicker">Calibration cases</p><h3>Reappearance, investigation, and formal status do not share one clock</h3></div></div>
              <div>{evidenceCalibrationCases.map((item) => <article key={item.case}><h4>{item.case}</h4><div><span>First observation</span><p>{item.first}</p></div><div><span>Later resolution</span><p>{item.later}</p></div><strong>{item.lesson}</strong><a href={item.url} target="_blank" rel="noreferrer">Open primary anchor <ArrowUpRight /></a></article>)}</div>
            </section>
            <section className="observation-clock-section">
              <div className="section-heading-row"><div><p className="section-kicker">Four-clock dossier</p><h3>A public appearance is not a current-role confirmation</h3></div></div>
              <div>{observationClocks.map((item) => <article key={item.clock}><strong>{item.clock}</strong><dl><div><dt>Can prove</dt><dd>{item.proves}</dd></div><div><dt>Cannot prove</dt><dd>{item.doesNot}</dd></div></dl></article>)}</div>
            </section>
            <section className="title-parser-section">
              <div className="section-heading-row"><div><p className="section-kicker">Chinese title parser</p><h3>One word can change the authority state</h3><p>Acting status is blocked unless the source literally supports it. Chairing a meeting is an event role, not control of the organization.</p></div></div>
              <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Source language</TableHead><TableHead>Evidence class</TableHead><TableHead>Permitted use</TableHead></TableRow></TableHeader><TableBody>{titleParsingRules.map((row) => <TableRow key={row.words}><TableCell lang="zh-Hans"><strong>{row.words}</strong></TableCell><TableCell>{row.class}</TableCell><TableCell>{row.use}</TableCell></TableRow>)}</TableBody></Table></div>
            </section>
            <section className="release-tests">
              <div className="section-heading-row"><div><p className="section-kicker">Release blockers</p><h3>Evidence tests the publication must pass</h3></div><Badge variant="outline">Integrity ≠ validity</Badge></div>
              <div>{evidenceStopShipTests.map((item) => <article key={item.id}><span className="mono">{item.id}</span><strong>{item.title}</strong><p>{item.rule}</p></article>)}</div>
            </section>
            <section className="panel-heading signal-ledger-heading"><div><p className="section-kicker">Record-completeness view</p><h2>Documentary signals—not a ranking</h2><p>Each column describes the presence, scope, or freshness of public documentation. It does not measure ability, influence, trust, or prospects.</p></div><Badge variant="outline">{filteredSignals.length} records</Badge></section>
            <div className="filter-bar signal-filter-bar">
              <Select value={signalBranch} onValueChange={setSignalBranch}>
                <SelectTrigger aria-label="Filter documentary signals by institution family" className="filter-select"><Filter /><SelectValue placeholder="All institution families" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All institution families</SelectItem>{branches.map((item) => <SelectItem key={item} value={item}>{branchShortLabel[item] || item}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={signalMode} onValueChange={setSignalMode}>
                <SelectTrigger aria-label="Filter documentary signals" className="filter-select"><SelectValue placeholder="All documentary states" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All documentary states</SelectItem>
                  <SelectItem value="official">Official current-title mapped</SelectItem>
                  <SelectItem value="fresh">Title observed in 2026</SelectItem>
                  <SelectItem value="party">Party record present</SelectItem>
                  <SelectItem value="birth">Birth record present</SelectItem>
                  <SelectItem value="gaps">Linked research gaps</SelectItem>
                </SelectContent>
              </Select>
              {(signalBranch !== "all" || signalMode !== "all") ? <Button variant="ghost" onClick={() => { setSignalBranch("all"); setSignalMode("all"); }}>Clear</Button> : null}
            </div>
            <p className="signal-method-note">“Official mapped” means a direct A1/A2/A3 source is linked to the displayed current billet. Freshness is claim-specific; the exact last-corroborated date is shown alongside the coarse band.</p>
            <div className="signal-matrix desktop-only">
              <Table>
                <TableHeader><TableRow><TableHead>Officer</TableHead><TableHead>Appointment record</TableHead><TableHead>Current-title source</TableHead><TableHead>Last titled</TableHead><TableHead>Freshness</TableHead><TableHead>Rank</TableHead><TableHead>Party / state / NPC</TableHead><TableHead>Primary claims</TableHead><TableHead>Birth</TableHead><TableHead>Gaps</TableHead></TableRow></TableHeader>
                <TableBody>{filteredSignals.map((officer) => <TableRow key={officer.id}>
                  <TableCell><button className="person-link" onClick={() => openOfficer(officer.id)}><span>{officer.nameEn}</span><small lang="zh-Hans">{officer.nameZh}</small></button></TableCell>
                  <TableCell><span className={`status-pill ${roleStateTone(officer.signals.appointmentRecord)}`}>{roleStateLabel[officer.signals.appointmentRecord] || officer.signals.appointmentRecord}</span></TableCell>
                  <TableCell><span className={`signal-chip ${officer.signals.currentRoleSource === "official_mapped" ? "signal-present" : "signal-missing"}`}>{signalLabel[officer.signals.currentRoleSource] || officer.signals.currentRoleSource}</span></TableCell>
                  <TableCell>{humanDate(officer.lastReliableTitleDate)}</TableCell>
                  <TableCell><span className={`signal-chip ${officer.signals.titleFreshness === "observed_2026" ? "signal-recent" : officer.signals.titleFreshness === "pre_2025" ? "signal-stale" : "signal-missing"}`}>{signalLabel[officer.signals.titleFreshness] || officer.signals.titleFreshness}</span></TableCell>
                  <TableCell>{signalLabel[officer.signals.rankRecord] || officer.signals.rankRecord}</TableCell>
                  <TableCell><div className="ledger-mini"><span title="Party record">P {signalLabel[officer.signals.partyRecord] || officer.signals.partyRecord}</span><span title="State-CMC record">S {signalLabel[officer.signals.stateCmcRecord] || officer.signals.stateCmcRecord}</span><span title="NPC record">N {signalLabel[officer.signals.npcRecord] || officer.signals.npcRecord}</span></div></TableCell>
                  <TableCell className="mono">{officer.signals.primaryMappedClaims}</TableCell>
                  <TableCell>{signalLabel[officer.signals.birthRecord] || officer.signals.birthRecord}</TableCell>
                  <TableCell className="mono">{officer.signals.openGapCount}</TableCell>
                </TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="signal-mobile mobile-only">{filteredSignals.map((officer) => <button key={officer.id} className="mobile-person-card" onClick={() => openOfficer(officer.id)}><div><strong>{officer.nameEn} <span lang="zh-Hans">{officer.nameZh}</span></strong><small>{branchShortLabel[officer.branch] || officer.branch}</small></div><p>{roleStateLabel[officer.signals.appointmentRecord] || officer.signals.appointmentRecord} · {signalLabel[officer.signals.currentRoleSource] || officer.signals.currentRoleSource} · {signalLabel[officer.signals.titleFreshness] || officer.signals.titleFreshness}</p><span className="mono">{officer.signals.primaryMappedClaims} primary claims · {officer.signals.openGapCount} gaps</span></button>)}</div>
          </TabsContent>

          <TabsContent value="institutions" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Institutional map</p><h2>Where the public record is concentrated</h2><p>Counts describe this dataset’s coverage, not the size or quality of each service’s promotion pool.</p></div></section>
            <section className="command-board">
              <div className="section-heading-row"><div><p className="section-kicker">Apex snapshot</p><h3>Party, state, and ministerial ledgers</h3></div><Badge variant="outline">Cutoff {humanDate(data.metadata.asOf)}</Badge></div>
              <div className="command-ledgers">
                {currentApexLedgers.map((item) => (
                  <article key={item.ledger}>
                    <h4>{item.ledger}</h4>
                    <dl><div><dt>Chair / frame</dt><dd>{item.chair}</dd></div><div><dt>Vice chair / officeholder</dt><dd>{item.viceChair}</dd></div><div><dt>Other members</dt><dd>{item.members}</dd></div></dl>
                    <div>{item.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} <ArrowUpRight /></a>)}</div>
                  </article>
                ))}
              </div>
            </section>
            <section className="dyad-map">
              <div className="section-heading-row"><div><p className="section-kicker">Public-source authority topology</p><h3>Commander–political principal state across 14 major organizations</h3><p>No fresh, exact source set establishes both principals in any row at the cutoff. This maps what public sources can establish—not actual vacancy, operational paralysis, or the absence of classified internal orders.</p></div><Badge variant="outline">0 complete fresh pairs · 3 one-sided</Badge></div>
              <div className="dyad-summary"><span><b className="mono">6</b> both principals unresolved</span><span><b className="mono">5</b> publicly unresolved / contested</span><span><b className="mono">3</b> one principal formalized</span></div>
              <div className="dyad-list">{commandDyads.map((item) => <article key={item.unit} data-state={item.state.toLowerCase().replaceAll(" ", "-")}><header><span>{item.group}</span><strong>{item.unit}</strong><Badge variant="outline">{item.state}</Badge></header><div className="dyad-nodes"><div><small>Military side</small><strong>{item.military}</strong><p>{item.militaryState}</p></div><i>PARTY COMMITTEE</i><div><small>Political side</small><strong>{item.political}</strong><p>{item.politicalState}</p></div></div><p className="dyad-reading">{item.reading}</p></article>)}</div>
            </section>
            <section className="recovery-clock">
              <div className="section-heading-row"><div><p className="section-kicker">Authority-resolution chronology</p><h3>Formal status can lag effective disruption</h3><p>The chronology separates administrative continuity, public visibility, and durable reconstitution.</p></div></div>
              <div>{authorityRecoveryCases.map((item) => <article key={item.unit}><strong>{item.unit}</strong><div>{item.sequence.map((step, index) => <span key={step}><b className="mono">{index + 1}</b>{step}{index < item.sequence.length - 1 ? <ChevronRight /> : null}</span>)}</div><p>{item.reading}</p></article>)}</div>
            </section>
            <section className="network-motif-section">
              <div className="section-heading-row"><div><p className="section-kicker">Career networks without faction folklore</p><h3>Observed proximity and patronage inference are different fields</h3><p>None of the positive living candidates examined has public evidence warranting a strong patronage judgment. The defensible objects are dated working relationships and scarce program cohorts.</p></div><Badge variant="outline">O0–O5 proximity · P0–P3 patronage</Badge></div>
              <div>{networkMotifs.map((item) => <article key={item.title}><header><div><strong>{item.title}</strong><span>{item.people}</span></div><div><Badge variant="secondary">{item.proximity}</Badge><Badge variant="outline">{item.patronage}</Badge></div></header><p>{item.observed}</p><dl><div><dt>Competing explanation</dt><dd>{item.alternative}</dd></div></dl><a href={item.url} target="_blank" rel="noreferrer">Open source <ArrowUpRight /></a></article>)}</div>
            </section>
            <div className="structure-grid">
              <article className="structure-panel branch-distribution">
                <div className="section-heading-row"><div><p className="section-kicker">Universe distribution</p><h3>Profiles by institution family</h3></div><Badge variant="outline">n = {data.metadata.officerCount}</Badge></div>
                <div className="bar-list">{data.metadata.branchCounts.map((item) => <button key={item.branch} onClick={() => { setBranch(item.branch); setActiveTab("directory"); }}><span>{branchShortLabel[item.branch] || item.branch}</span><span className="bar-track"><span style={{ width: `${(item.count / maxBranchCount) * 100}%` }} /></span><strong className="mono">{item.count}</strong></button>)}</div>
              </article>
              <article className="structure-panel role-distribution">
                <div className="section-heading-row"><div><p className="section-kicker">Role truth</p><h3>Appointment-record states</h3></div></div>
                <div className="role-grid">{[...data.metadata.roleStateCounts].sort((a, b) => b.count - a.count).map((item) => <button key={item.state} onClick={() => { setRoleState(item.state); setActiveTab("directory"); }}><strong className="mono">{item.count}</strong><span>{roleStateLabel[item.state] || item.state}</span><ChevronRight aria-hidden="true" /></button>)}</div>
              </article>
            </div>
            <section className="ledger-separation"><div className="section-heading-row"><div><p className="section-kicker">Four-ledger rule</p><h3>Do not collapse unlike offices</h3></div></div><div className="ledger-grid">{[{title:"Party office",text:"Central Committee and Party-CMC status require Party decisions."},{title:"State office",text:"State-CMC membership is a separate constitutional appointment and removal record."},{title:"Military billet",text:"Operational command, acting work, and formal titles may diverge."},{title:"Discipline / legal",text:"Investigation, Party discipline, NPC action, and billet exit can occur on different dates."}].map((item, index) => <article key={item.title}><span className="mono">0{index + 1}</span><strong>{item.title}</strong><p>{item.text}</p></article>)}</div></section>
            <section className="coverage-map">
              <div className="section-heading-row"><div><p className="section-kicker">Coverage denominator</p><h3>Named records and explicit blind spots</h3><p>Omission from this registry is not evidence that an officer or billet is unimportant.</p></div></div>
              <div className="coverage-table">
                {coverageRows.map((row) => {
                  const profiles = data.metadata.branchCounts.filter((item) => row.families.includes(item.branch)).reduce((sum, item) => sum + item.count, 0);
                  return <article key={row.area}><div><strong>{row.area}</strong><span className="mono">{profiles} public profiles</span></div><p>{row.coverage}</p><small>{row.holes}</small></article>;
                })}
              </div>
            </section>
            <section className="pipeline-map">
              <div className="section-heading-row"><div><p className="section-kicker">Feeder systems</p><h3>Official institutional pathways</h3><p>These sources describe training, organizational, or intake systems. They do not establish an individual’s appointment, promotion, merit, or future role.</p></div><Badge variant="outline">{data.metadata.pipelineSourceCount} source records</Badge></div>
              <div className="pipeline-groups">{Object.entries(pipelineGroups).sort(([a], [b]) => a.localeCompare(b)).map(([family, sources]) => <article key={family}><div className="pipeline-group-head"><strong>{branchShortLabel[family] || family}</strong><span className="mono">{sources.length} sources</span></div><div>{sources.map((source) => <a className="pipeline-source-line" key={source.id} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.title}</strong><small>{source.supports[0]} {source.doesNotSupport ? `Does not establish: ${source.doesNotSupport}` : ""}</small></span><span>{source.publisher} · {humanDate(source.date)} <ArrowUpRight aria-hidden="true" /></span></a>)}</div></article>)}</div>
            </section>
          </TabsContent>

          <TabsContent value="timeline" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Personnel-change ledger</p><h2>Confirmed exits and unresolved watches</h2><p>The active officer directory and adverse ledger are separate. “Missing” is never treated as proof of removal.</p></div><Select value={timelineMode} onValueChange={setTimelineMode}><SelectTrigger className="filter-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All ledger entries</SelectItem><SelectItem value="confirmed">Confirmed exit</SelectItem><SelectItem value="unresolved">Unresolved watch</SelectItem></SelectContent></Select></section>
            <div className="timeline-list">{timelineRecords.map((record) => <article key={record.id} className="timeline-record"><time>{humanDate(record.date)}</time><div className={`timeline-marker ${record.controlledState === "confirmed_exit" ? "marker-confirmed" : "marker-unresolved"}`} /><div className="timeline-content"><div className="timeline-title"><div><strong>{record.nameEn} <span lang="zh-Hans">{record.nameZh}</span></strong><small>{record.formerRole || record.formerBranch}</small></div><Badge variant={record.controlledState === "confirmed_exit" ? "secondary" : "outline"}>{record.status}</Badge></div><p>{record.summary}</p><div className="timeline-sources">{record.sources.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer">{sourceHost(url)} <ArrowUpRight /></a>)}</div></div></article>)}</div>
          </TabsContent>

          <TabsContent value="evidence" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Evidence explorer</p><h2>Follow claims back to sources</h2><p>Source classes describe publication type and claim scope. A high-quality source for one title does not validate an entire biography.</p></div><Badge variant="outline">{data.metadata.sourceCount} unique links</Badge></section>
            <section className="evidence-audit-strip">
              <article><strong className="mono">{data.metadata.mappedPersonCount}</strong><span>people with at least one claim-scoped factual record</span></article>
              <article><strong className="mono">{data.metadata.currentRoleMappedCount}</strong><span>public profiles with a mapped current-role source</span></article>
              <article><strong className="mono">{data.metadata.undatedTitleCount}</strong><span>profiles without a usable last-title date</span></article>
              <article><strong className="mono">{data.metadata.olderTitleCount}</strong><span>profiles last directly observed before 2025</span></article>
              <article><strong className="mono">{data.metadata.discoveryOnlySourceCount}</strong><span>unique sources retained as discovery-only</span></article>
            </section>
            <section className="source-family-grid" aria-label="Source-family distribution">
              {data.metadata.sourceFamilyCounts.map((item) => <button key={item.family} onClick={() => { setSourceFamily(item.family); setActiveTab("evidence"); }}><strong className="mono">{item.count}</strong><span>{sourceFamilyLabel[item.family] || item.family}</span><small>Filter sources <ChevronRight aria-hidden="true" /></small></button>)}
            </section>
            <div className="evidence-layout">
              <aside className="source-key"><h3>Source vocabulary</h3><dl><div><dt>A1</dt><dd>Formal legal or Party decision</dd></div><div><dt>A2</dt><dd>Central official or PLA source</dd></div><div><dt>A3</dt><dd>Other official institutional source</dd></div><div><dt>B1</dt><dd>High-quality specialist analysis</dd></div><div><dt>B2</dt><dd>Credible secondary reconstruction</dd></div><div><dt>C / D</dt><dd>Discovery lead or weak corroboration</dd></div></dl></aside>
              <div className="source-explorer"><div className="source-controls"><div className="search-field"><Search /><Input value={sourceQuery} onChange={(event) => setSourceQuery(event.target.value)} placeholder="Search publisher, domain, scope, or class" aria-label="Search sources" /></div><Select value={sourceFamily} onValueChange={setSourceFamily}><SelectTrigger className="filter-select" aria-label="Filter source family"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All source families</SelectItem>{data.metadata.sourceFamilyCounts.map((item) => <SelectItem key={item.family} value={item.family}>{sourceFamilyLabel[item.family] || item.family}</SelectItem>)}</SelectContent></Select></div><div className="source-table">{filteredSources.slice(0, 120).map((source, index) => <article key={`${source.url}-${index}`}><div className="source-class mono">{source.class || "—"}</div><div><strong>{source.publisher || sourceHost(source.url)}</strong><p>{source.scopes?.slice(0, 2).join(" · ") || "Candidate corroboration; exact claim scope not recorded"}</p><small>{source.date ? humanDate(source.date) : "Date not recorded"} · {sourceFamilyLabel[source.family || ""] || "Unclassified family"} · linked to {source.people?.length || 0} dossier(s)</small></div><a href={source.url} target="_blank" rel="noreferrer" aria-label={`Open ${source.publisher || sourceHost(source.url)}`}><ArrowUpRight /></a></article>)}</div>{filteredSources.length > 120 ? <p className="table-note">Showing the first 120 matching sources. Refine the search to narrow the list.</p> : null}</div>
            </div>
            <section className="system-sources"><div className="section-heading-row"><div><p className="section-kicker">Selection-system foundation</p><h3>Official rules and institutional sources</h3></div><Badge variant="outline">{data.systemSources.length} records</Badge></div><div className="system-source-grid">{data.systemSources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><div><span className="mono">{source.id}</span><Badge variant="outline">{source.class}</Badge></div><strong>{source.title}</strong><p>{source.supports[0]}</p><small>{source.publisher} · {humanDate(source.date)} <ArrowUpRight /></small></a>)}</div></section>
          </TabsContent>

          <TabsContent value="gaps" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Research-gap register</p><h2>What the public record still cannot establish</h2><p>Each gap states why it matters, the evidence needed to close it, and the assumptions analysts should avoid.</p></div><Badge variant="outline">{data.gaps.filter((gap) => gap.status === "open").length} open · {data.gaps.filter((gap) => gap.status !== "open").length} partly closed</Badge></section>
            <section className="collection-portfolio">
              <div className="section-heading-row"><div><p className="section-kicker">Collection portfolio</p><h3>Research the fact that would move a decision—not the most obscure biography</h3><p>The ordinal priority index multiplies decision impact, present uncertainty, and tractability. It orders collection effort; it is not a probability.</p></div><Badge variant="outline">Impact × uncertainty × tractability</Badge></div>
              <div>{collectionPortfolio.map((item) => <article key={item.item}><header><Badge variant={item.priority === "P0" ? "secondary" : "outline"}>{item.priority}</Badge><strong className="mono">{item.score}</strong></header><h4>{item.item}</h4><div className="voi-vector"><span>Impact {item.impact}/5</span><span>Uncertainty {item.uncertainty}/5</span><span>Tractability {item.tractability}/5</span></div><dl><div><dt>Closes</dt><dd>{item.closes}</dd></div><div><dt>Method</dt><dd>{item.method}</dd></div></dl></article>)}</div>
            </section>
            <section className="hidden-feeder-section">
              <div className="section-heading-row"><div><p className="section-kicker">Position-first watchlist</p><h3>The strongest 2036/2041 object is often an unknown billet</h3><p>Absence of a public name is not absence of a candidate. These slots stay on the board without fabricating an incumbent.</p></div><Badge variant="outline">13 feeder systems</Badge></div>
              <div className="architecture-table"><Table><TableHeader><TableRow><TableHead>Feeder system</TableHead><TableHead>Slots to instantiate</TableHead><TableHead>Coverage</TableHead><TableHead>Priority unknowns</TableHead><TableHead>Why it matters</TableHead><TableHead>What weakens the lane</TableHead></TableRow></TableHeader><TableBody>{hiddenFeederLanes.map((row) => <TableRow key={row.lane}><TableCell><strong>{row.lane}</strong></TableCell><TableCell>{row.slots}</TableCell><TableCell><Badge variant="outline">{row.coverage}</Badge></TableCell><TableCell>{row.priority}</TableCell><TableCell>{row.why}</TableCell><TableCell>{row.weakens}</TableCell></TableRow>)}</TableBody></Table></div>
            </section>
            <section className="surfaced-leads-section">
              <div className="section-heading-row"><div><p className="section-kicker">Newly surfaced, not yet ranked</p><h3>Identity-secure leads held below the active leaderboard</h3><p>These cases add branch depth without pretending that a dated title or promising feeder lane clears the succession publication gate.</p></div><Badge variant="outline">5 claim-bounded leads</Badge></div>
              <div>{surfacedLeads.map((item) => <article key={item.name}><header><strong>{item.name} <span lang="zh-Hans">{item.nameZh}</span></strong><Badge variant="secondary">{item.grade}</Badge></header><small>{item.lane}</small><p>{item.evidence}</p><div><b>Boundary</b><span>{item.boundary}</span></div><a href={item.url} target="_blank" rel="noreferrer">Open source <ArrowUpRight /></a></article>)}</div>
            </section>
            <div className="gap-grid">{data.gaps.map((gap) => <article key={gap.id} className="gap-card"><div className="gap-header"><span className="mono">{gap.id}</span><Badge variant={gap.status === "open" ? "outline" : "secondary"}>{gap.status.replace("_", " ")}</Badge></div><h3>{gap.title}</h3><p>{gap.whyItMatters}</p><dl><div><dt>Evidence needed</dt><dd>{gap.evidenceNeeded}</dd></div><div><dt>Do not assume</dt><dd>{gap.doNotAssume || "No additional assumption note"}</dd></div><div><dt>Last checked</dt><dd>{humanDate(gap.lastChecked)}</dd></div></dl>{gap.people.length ? <div className="linked-people"><span>Affected records</span>{gap.people.map((id) => { const person = data.officers.find((officer) => officer.id === id); return person ? <button key={id} onClick={() => openOfficer(id)}>{person.nameEn} <ChevronRight /></button> : null; })}</div> : null}</article>)}</div>
          </TabsContent>

          <TabsContent value="method" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Analytic method</p><h2>Pathways, gates, and uncertainty—without false precision</h2><p>The pathway view explains institutional sequences. Event-specific boards use ranges and gate tiers; completing one step never guarantees advancement.</p></div></section>
            <section className="selection-tree-card">
              <div><p className="section-kicker">Conditional forecast tree</p><h3>Seat existence → survival → qualification → finalist selection</h3><p className="selection-equation mono">P(apex by horizon | scenario) = P(seat exists) × P(active and eligible) × P(clears the next gate) × P(selected among finalists)</p></div>
              <dl><div><dt>Pathway strength</dt><dd>How structurally favorable is the observed route, conditional on the officer remaining active?</dd></div><div><dt>Unconditional forecast</dt><dd>Must include adverse, runway, seat, and unidentified-candidate risk; it is not yet published as a calibrated probability.</dd></div><div><dt>Seat constraint</dt><dd>Named candidates and the unnamed reserve cannot imply more occupancy than the architecture supplies.</dd></div><div><dt>Regime break</dt><dd>Pre-purge route frequencies discipline the model but do not prove that the 2026–27 selector behaves the same way.</dd></div></dl>
            </section>
            <div className="method-grid">{pathways.map((pathway) => <article key={pathway.title} className="pathway-card"><h3>{pathway.title}</h3><ol>{pathway.steps.map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong>{index < pathway.steps.length - 1 ? <ChevronRight /> : null}</li>)}</ol><p>{pathway.note}</p></article>)}</div>
            <div className="method-notes"><article><h3>Confirmed fact</h3><p>An official source or mutually reinforcing high-quality sources directly establish the claim at the stated observation date.</p></article><article><h3>Observed or reported role</h3><p>Official imagery, repeated protocol position, or specialist reporting supports a role, but no formal appointment text was located.</p></article><article><h3>Unresolved</h3><p>Sources conflict, identity is uncertain, or the title is too stale to present as current. Absence alone is not evidence of removal.</p></article></div>
            <section className="identity-rules-card"><div><p className="section-kicker">Entity resolution</p><h3>Name-only matching is prohibited</h3><p>Two consequential officers named Wang Gang—the PLAAF commander and a younger PAP Xinjiang counterterrorism officer—are the regression case. An uncommon byline still requires institution, dates, rank, and career continuity before behavior or network evidence is attached.</p></div><dl><div><dt>Person edge</dt><dd>Requires dated overlap; the same unit in different decades is institutional lineage, not personal contact.</dd></div><div><dt>Patronage</dt><dd>Requires temporal direction and evidence beyond co-service. None of the current positive candidates clears the strong public threshold.</dd></div><div><dt>Adverse exposure</dt><dd>A link to a purged officer creates a collection question, never guilt or exclusion by association.</dd></div><div><dt>2041 reserve</dt><dd>Shown as uncalibrated and probably dominant until a historical identity-coverage backtest exists.</dd></div></dl></section>
            <section className="identity-hold-card"><FileSearch aria-hidden="true" /><div><p className="section-kicker">Publication gate</p><h3>{publicationHoldCount} records withheld from the active directory</h3><p>{data.metadata.identityHeldCount} records are identity-unsafe research leads; {data.metadata.adverseHeldCount} active-profile match is held because it appears in the adverse-state ledger; {bypassWatchCount} former positive cases now sit only in the unresolved promotion-bypass watch. The public directory does not turn a pseudonym, an unresolved identity, a Party-status discontinuity, or a ledger conflict into a present-tense dossier.</p></div></section>
            <section className="limits-card"><AlertTriangle aria-hidden="true" /><div><p className="section-kicker">Limits</p><h3>Opacity is part of the result</h3><p>The open record cannot reveal internal sponsor networks, classified evaluations, health, undisclosed investigations, or complete birth and appointment data. Official Chinese sources are authoritative for what they formally announce but can be selective and temporally incomplete. Specialist research is useful for reconstruction but remains secondary unless a claim is directly mapped.</p></div></section>
          </TabsContent>
        </Tabs>
      </div>

      <footer><div><strong>PLA Leadership Observatory</strong><p>Diagnostic net-assessment interface · Evidence cutoff {humanDate(data.metadata.asOf)}</p></div><p>Formal role, evidence confidence, Structural Promotability Index, and institutional consequence remain separate.</p></footer>
      <OfficerSheet officer={selectedOfficer} onClose={() => setSelectedOfficer(null)} />
    </main>
  );
}
