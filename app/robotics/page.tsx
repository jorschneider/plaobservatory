"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Cpu, Database, Download, FileSearch, Filter, LayoutGrid, Network, Scale, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Ecosystem from "./ecosystem";
import { filterScorecards } from "./filters.mjs";
import industrialJson from "../data/industrial-base.json";
import { findings, framework, limits, researchQuestions } from "../data/industrial-base-assessment";

type Rec = Record<string, string | number | null | undefined>;
type Scorecard = { id: string; supplier: string; englishName: string | null; capabilityFamily: string; nodeId: string; lane: string; status: string; rankEligible: boolean; tier: string; criticality: number | string; frontier: number | string; crossDomain: number | string; evidence: string; maturity: string; importance: number | null; lowerBound: number | null; reviewNote?: string; evidenceCount: number; caveat: string | null; initialRank: number | null; fragility: string | null; fragilityBasis: string | null; sourceUrls: string[] };
type Node = { id: string; tier: string; label: string; plain: string; capabilityFamilies: string[]; coverage: string; suppliers: { id: string; supplier: string; englishName: string | null; tier: string; importance: number; lane: string }[]; evidenceQualifiedCount: number; provisionalCount: number; productIds: string[] };
type Data = {
  metadata: { title: string; buildId: string; cutoff: string; package: string; chartVersion: string; scorecardCount: number; evidenceQualifiedCount: number; boundedCount: number; provisionalCount: number; evidenceRowCount: number; sourceUrlCount: number; nodeCount: number; nodeCoverageCounts: { key: string; count: number }[]; laneCounts: { key: string; count: number }[]; statusCounts: { key: string; count: number }[]; tierCounts: { tier: string; label: string; nodes: number; evidenceQualified: number; provisionalOnly: number; noRecord: number }[]; trackerCounts: Record<string, number>; readMe: { title: string; blurb: string; metrics: { metric: string; count: number | string }[]; notes: { note: string }[] }; scoringMethod: { weights: { component: string; weight: number; interpretation: string }[]; evidenceFactors: { evidenceLevel: string; lowerBoundMultiplier: number; rankTreatment: string; hardBoundary: string }[] } };
  chart: { plain: string; tiers: { id: string; label: string; plain: string }[]; nodes: Node[] };
  scorecards: Scorecard[]; evidence: Rec[];
  trackers: { procurementNotices: { plain: string; rows: Rec[] }; limitedSource: { plain: string; rows: Rec[]; criticalityFour: Rec[] }; foreignDependencies: { plain: string; rows: Rec[] }; identityQueue: { plain: string; rows: Rec[] }; signals: { plain: string; rows: Rec[] } };
  sources: Rec[]; bibliography: Rec[];
};
const data = industrialJson as unknown as Data;
const m = data.metadata;

const laneLabel: Record<string, string> = { component_or_subsystem_supplier: "Component or subsystem supplier", production_enabler: "Production enabler", unmanned_systems_enabler: "Unmanned-systems enabler", counter_UAS_integrator: "Counter-UAS integrator" };
const tierLabel: Record<string, string> = { evidence_qualified: "Evidence-qualified", bounded: "Bounded assessment", provisional: "Provisional watchlist" };
const coverageLabel: Record<string, string> = { evidence_qualified: "Evidence-qualified supplier", provisional_only: "Provisional records only", no_record: "No imported mapping" };
const coveragePlain: Record<string, string> = { evidence_qualified: "At least one scorecard on this node has E3 or E4 evidence and is rank-eligible.", provisional_only: "Imported assessments on this node are bounded or provisional; review each source and stage.", no_record: "No legacy assessment is mapped here. This is a collection or taxonomy gap, not evidence that China lacks the capability." };
const coverageTone: Record<string, string> = { evidence_qualified: "status-confirmed", provisional_only: "status-observed", no_record: "status-unknown" };
const tierTone: Record<string, string> = { evidence_qualified: "status-confirmed", bounded: "status-observed", provisional: "status-unknown" };
const fam = (f: string) => f.replaceAll("_", " ");
const host = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "source"; } };
const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
function fill(t: string, vars: Record<string, string | number>) { return t.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? "n/a")); }
function Metric({ value, label, detail, icon: Icon }: { value: string | number; label: string; detail: string; icon: typeof Cpu }) { return <article className="metric-card"><div className="metric-icon"><Icon aria-hidden="true" /></div><div><p className="metric-value">{value}</p><p className="metric-label">{label}</p><p className="metric-detail">{detail}</p></div></article>; }

const vars = { scorecards: m.scorecardCount, evidenceQualified: m.evidenceQualifiedCount, cuasCards: m.laneCounts.find((l) => l.key === "counter_UAS_integrator")?.count ?? 0, foreignRows: m.trackerCounts.foreignDependencies, noRecordNodes: m.nodeCoverageCounts.find((c) => c.key === "no_record")?.count ?? 0 };
const progress: Record<string, string> = { procurementNotices: `${m.trackerCounts.procurementNotices} evidence rows rest on a procurement notice.`, limitedSource: `${m.trackerCounts.limitedSource} rows use limited-source language; ${data.trackers.limitedSource.criticalityFour.length} scorecard reaches criticality 4.`, identityQueue: `${m.trackerCounts.identityQueue} watchlist entities await identity resolution.`, foreignDependencies: `${m.trackerCounts.foreignDependencies} named relationships, all marked historical or bounded.`, noRecord: `${vars.noRecordNodes} of ${m.nodeCount} nodes have no imported assessment mapping.` };

export default function RoboticsLane() {
  const [tab, setTab] = useState("ecosystem");
  const [lane, setLane] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [evidenceQuery, setEvidenceQuery] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);
  const cards = useMemo(() => filterScorecards(data.scorecards, query, lane, tierFilter), [lane, tierFilter, query]);
  const evidence = useMemo(() => { const q = evidenceQuery.trim().toLowerCase(); return data.evidence.filter((e) => !q || Object.values(e).join(" ").toLowerCase().includes(q)); }, [evidenceQuery]);
  const openNode = (id: string) => { setHighlight(id); setTab("nodes"); };
  const openCard = (id: string) => { setQuery(id); setLane("all"); setTierFilter("all"); setTab("scorecards"); };
  const cardById = new Map(data.scorecards.map((c) => [c.id, c]));

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Back to the leadership observatory"><span className="brand-mark" aria-hidden="true"><Network /></span><span><strong>PLA Leadership</strong><small>Observatory · Robotics lane</small></span></Link>
        <div className="topbar-meta"><Link className="lane-link" href="/">Leadership lane <ArrowUpRight aria-hidden="true" /></Link><span className="data-cutoff"><span className="live-dot" />Cutoff {m.cutoff}</span><span className="build-id mono">{m.buildId}</span></div>
      </header>
      <div id="top" className="workspace">
        <section className="briefing-header">
          <div className="briefing-copy"><p className="eyebrow">Civil-military industrial base · robotics and unmanned systems</p><h1>Who supplies the robots, and how do we know?</h1><p>{framework.plain}</p></div>
          <aside className="editorial-note"><Scale aria-hidden="true" /><div><strong>Start with the evidence boundary</strong><p>Award, delivery, use and ownership are separate claims. Revenue keeps its reported business scope. Unknown links remain unknown.</p></div></aside>
        </section>
        <Tabs value={tab} onValueChange={setTab} className="main-tabs">
          <div className="tabs-bar"><TabsList variant="line" className="tabs-list"><TabsTrigger value="ecosystem">Ecosystem</TabsTrigger><TabsTrigger value="overview">Corpus review</TabsTrigger><TabsTrigger value="nodes">Nodes</TabsTrigger><TabsTrigger value="scorecards">Legacy scorecards</TabsTrigger><TabsTrigger value="evidence">Evidence</TabsTrigger><TabsTrigger value="trackers">Trackers</TabsTrigger><TabsTrigger value="method">Method</TabsTrigger></TabsList></div>

          <TabsContent value="ecosystem" className="tab-panel"><Ecosystem openCard={openCard} /></TabsContent>
          <TabsContent value="overview" className="tab-panel">
            <section className="metric-grid" aria-label="Lane summary">
              <Metric value={m.nodeCount} label="Capability nodes on the chart" detail={`${m.nodeCoverageCounts.find((c) => c.key === "evidence_qualified")?.count ?? 0} evidence-qualified · ${m.nodeCoverageCounts.find((c) => c.key === "provisional_only")?.count ?? 0} provisional only · ${vars.noRecordNodes} empty`} icon={LayoutGrid} />
              <Metric value={m.scorecardCount} label="Supplier scorecards" detail={`${m.evidenceQualifiedCount} evidence-qualified · ${m.boundedCount} bounded · ${m.provisionalCount} provisional`} icon={Cpu} />
              <Metric value={m.evidenceRowCount} label="Atomic evidence rows" detail={`${m.sourceUrlCount} distinct source URLs, each with a claim and a caveat`} icon={FileSearch} />
              <Metric value={data.trackers.limitedSource.criticalityFour.length} label="Sole-source scorecards" detail="Criticality 4 requires the source itself to say sole or limited supply" icon={AlertTriangle} />
              <Metric value={m.trackerCounts.foreignDependencies} label="Foreign dependency records" detail="Dated, marked historical or current, kept out of domestic scoring" icon={Database} />
            </section>
            <section className="judgment-stack judgment-stack-priority">
              <div className="section-heading-row"><div><p className="section-kicker">What the chart shows</p><h3>What this research collection supports</h3></div><Badge variant="outline">Counts and bounded judgments</Badge></div>
              {findings.map((f, i) => <article key={f.id}><span className="judgment-number mono">0{i + 1}</span><div><div className="judgment-title"><h4>{f.title}</h4><Badge variant="secondary">{f.confidence} · {f.basis}</Badge></div><p>{fill(f.plain, vars)}</p><div className="finding-example"><strong>Example. </strong>{f.example.text} {f.example.scorecardId ? <button className="person-link" onClick={() => openCard(f.example.scorecardId!)}>Open scorecard</button> : null} <a href={f.example.url} target="_blank" rel="noreferrer">{host(f.example.url)} <ArrowUpRight /></a></div><small className="judgment-premises">Would change if: {f.whatWouldChangeIt}</small></div></article>)}
            </section>
            <section className="research-frontier">
              <div className="section-heading-row"><div><p className="section-kicker">Research questions</p><h3>Five questions, each with the artifact that answers it</h3></div><Badge variant="outline">Measurable</Badge></div>
              <div className="frontier-grid">{researchQuestions.map((q) => <article key={q.id}><header><span className="mono">{q.id}</span><Badge variant="outline">{q.status.replaceAll("_", " ")}</Badge></header><h4>{q.question}</h4><dl><div><dt>Artifact</dt><dd>{q.artifact}</dd></div><div><dt>Progress</dt><dd>{progress[q.progress] ?? "Not started."}</dd></div></dl></article>)}</div>
            </section>
            <section className="coverage-map">
              <div className="section-heading-row"><div><p className="section-kicker">Coverage by tier</p><h3>Where the evidence is and where the chart is blank</h3></div></div>
              <div className="coverage-table">{m.tierCounts.map((t) => <article key={t.tier}><div><button className="person-link" onClick={() => setTab("nodes")}><strong>{t.label}</strong></button><span className="mono">{t.nodes} nodes</span></div><p>evidence-qualified {t.evidenceQualified} · provisional only {t.provisionalOnly} · empty {t.noRecord}</p><small>{data.chart.tiers.find((x) => x.id === t.tier)?.plain}</small></article>)}</div>
            </section>
          </TabsContent>

          <TabsContent value="nodes" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Capability chart</p><h2>Legacy capability chart and sourced product mappings</h2><p>{data.chart.plain}</p></div><Badge variant="outline">{m.nodeCount} nodes · chart {m.chartVersion}</Badge></section>
            <section className="coverage-key" aria-label="Coverage states">{["evidence_qualified", "provisional_only", "no_record"].map((k) => <div key={k} className="coverage-chip"><span className={`status-pill ${coverageTone[k]}`}>{coverageLabel[k]}</span><strong className="mono">{m.nodeCoverageCounts.find((c) => c.key === k)?.count ?? 0}</strong><small>{coveragePlain[k]}</small></div>)}</section>
            {data.chart.tiers.map((t) => <section key={t.id} className="position-tier"><div className="section-heading-row"><div><p className="section-kicker">{t.id.replaceAll("_", " ")}</p><h3>{t.label}</h3><p>{t.plain}</p></div></div><div className="node-board">{data.chart.nodes.filter((n) => n.tier === t.id).map((n) => <article key={n.id} id={n.id} className={`node-row ${n.coverage === "no_record" ? "no-record" : ""} ${highlight === n.id ? "highlight" : ""}`}><div className="node-name"><strong>{n.label}</strong><small>{n.plain}</small></div><div className="node-suppliers">{n.suppliers.length ? n.suppliers.map((sp) => <button key={sp.id} className={`supplier-chip ${sp.tier === "evidence_qualified" ? "qualified" : ""}`} onClick={() => openCard(sp.id)}><b>{sp.englishName || sp.supplier}</b><small lang="zh-Hans">{sp.supplier}</small><small>{tierLabel[sp.tier]} · importance {sp.importance} · {laneLabel[sp.lane]}</small></button>) : <span className="supplier-chip empty">No legacy assessment mapped here</span>}</div><div className="node-state"><p>{n.productIds.length} sourced product mappings in the Ecosystem dossiers</p><span className={`status-pill ${coverageTone[n.coverage]}`}>{coverageLabel[n.coverage]}</span><p>{n.capabilityFamilies.length ? `Capability families: ${n.capabilityFamilies.map(fam).join("; ")}` : "Where to look: listed-company filings naming a defense customer, procurement notices with this scope, or export-control records naming a counterparty."}</p></div></article>)}</div></section>)}
          </TabsContent>

          <TabsContent value="scorecards" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Supplier scorecards</p><h2>Fifty-two supplier-by-capability assessments</h2><p>These imported assessments are historical research triage. Default order is alphabetical; ranks are inherited from v1.2 and should not be compared across lanes. Fixed evidence discounts are not statistical confidence intervals. Reviewed corrections appear per row.</p></div><div className="panel-actions"><Badge variant="outline">{cards.length} of {m.scorecardCount}</Badge><Button asChild variant="outline" size="sm"><a href="/data/industrial-base-robotics-scorecards.csv" download><Download />CSV</a></Button><Button asChild variant="outline" size="sm"><a href="/data/industrial-base-robotics.json" download><Download />JSON</a></Button></div></section>
            <div className="filter-bar">
              <div className="search-field"><Search aria-hidden="true" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ID, supplier, 汉字, capability or node" aria-label="Search scorecards" /></div>
              <Select value={lane} onValueChange={setLane}><SelectTrigger aria-label="Filter by lane" className="filter-select"><Filter /><SelectValue placeholder="All lanes" /></SelectTrigger><SelectContent><SelectItem value="all">All lanes</SelectItem>{m.laneCounts.map((l) => <SelectItem key={l.key} value={l.key}>{laneLabel[l.key] ?? l.key} ({l.count})</SelectItem>)}</SelectContent></Select>
              <Select value={tierFilter} onValueChange={setTierFilter}><SelectTrigger aria-label="Filter by evidence tier" className="filter-select"><SelectValue placeholder="All tiers" /></SelectTrigger><SelectContent><SelectItem value="all">All evidence tiers</SelectItem>{Object.entries(tierLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select>
              {(query || lane !== "all" || tierFilter !== "all") ? <Button variant="ghost" onClick={() => { setQuery(""); setLane("all"); setTierFilter("all"); }}>Clear</Button> : null}
            </div>
            <div className="architecture-table scorecard-table"><Table><TableHeader><TableRow><TableHead>Original rank</TableHead><TableHead>Supplier</TableHead><TableHead>Capability · node</TableHead><TableHead>Lane</TableHead><TableHead>Tier</TableHead><TableHead>C / I / X / E</TableHead><TableHead>Maturity</TableHead><TableHead className="text-right">Legacy triage</TableHead><TableHead>Caveat</TableHead><TableHead>Sources</TableHead></TableRow></TableHeader><TableBody>{cards.map((c) => <TableRow key={c.id}><TableCell className="mono">{c.tier === "evidence_qualified" && c.initialRank ? `#${c.initialRank}` : "—"}</TableCell><TableCell><strong>{c.englishName || c.supplier}</strong><br /><small lang="zh-Hans">{c.supplier}</small></TableCell><TableCell>{fam(c.capabilityFamily)}<br /><button className="position-link" onClick={() => openNode(c.nodeId)}>{data.chart.nodes.find((n) => n.id === c.nodeId)?.label}</button></TableCell><TableCell>{laneLabel[c.lane] ?? c.lane}</TableCell><TableCell><span className={`status-pill ${tierTone[c.tier]}`}>{tierLabel[c.tier]}</span></TableCell><TableCell className="mono">{c.criticality} / {c.frontier} / {c.crossDomain} / {c.evidence}</TableCell><TableCell className="mono">{c.maturity}</TableCell><TableCell className="text-right mono">{c.importance ?? "Withheld"}<br /><small>{c.lowerBound == null ? "Pending reconciliation" : `Evidence-discounted ${c.lowerBound}`}</small></TableCell><TableCell><small>{c.reviewNote && <strong>{c.reviewNote}<br /></strong>}{c.caveat}{c.fragility ? ` Fragility: ${c.fragility}.` : ""}</small></TableCell><TableCell><button className="position-link" onClick={() => { setEvidenceQuery(c.id); setTab("evidence"); }}>Open linked evidence</button>{c.sourceUrls.slice(0, 3).map((u) => <a key={u} href={u} target="_blank" rel="noreferrer" className="position-link">{host(u)} <ArrowUpRight /></a>)}</TableCell></TableRow>)}</TableBody></Table></div>
          </TabsContent>

          <TabsContent value="evidence" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Evidence ledger</p><h2>Every scorecard links here</h2><p>Imported evidence rows retain their original wording. The Ecosystem dossiers carry newly reviewed claims, source locations and corrections.</p></div><Badge variant="outline">{evidence.length} of {m.evidenceRowCount}</Badge></section>
            <div className="filter-bar"><div className="search-field"><Search aria-hidden="true" /><Input value={evidenceQuery} onChange={(e) => setEvidenceQuery(e.target.value)} placeholder="Search claim, supplier, source or status" aria-label="Search evidence" /></div></div>
            <div className="architecture-table scorecard-table"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Supplier · capability</TableHead><TableHead>Status</TableHead><TableHead>Claim</TableHead><TableHead>Does not establish</TableHead><TableHead>Source</TableHead></TableRow></TableHeader><TableBody>{evidence.map((e) => <TableRow key={s(e.evidence_id)}><TableCell className="mono">{s(e.date)}</TableCell><TableCell><strong lang="zh-Hans">{s(e.supplier)}</strong><br /><small>{fam(s(e.capability))}</small>{cardById.get(s(e.assessment_id)) ? <><br /><button className="position-link" onClick={() => openCard(s(e.assessment_id))}>scorecard</button></> : null}</TableCell><TableCell><small>{s(e.evidence_status).replaceAll("_", " ")}<br />{s(e.state).replaceAll("_", " ")} · {s(e.confidence)}</small></TableCell><TableCell><small>{s(e.claim)}</small></TableCell><TableCell><small>{s(e.caveat)}</small></TableCell><TableCell>{e.source_url ? <a href={s(e.source_url)} target="_blank" rel="noreferrer" className="position-link">{s(e.source_title) || host(s(e.source_url))} <ArrowUpRight /></a> : "—"}</TableCell></TableRow>)}</TableBody></Table></div>
          </TabsContent>

          <TabsContent value="trackers" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Narrow trackers</p><h2>One question each, from the sources the package already holds</h2><p>These are views over the evidence ledger and the dependency register, not new claims.</p></div></section>
            {([["procurementNotices", "Procurement notices"], ["limitedSource", "Sole and limited-source language"], ["foreignDependencies", "Foreign dependencies"], ["identityQueue", "Suggested identity follow-up queue"], ["signals", "Source-linked signals"]] as const).map(([key, label], i) => { const t = data.trackers[key]; return <section key={key} className="tracker-section"><div className="section-heading-row"><div><p className="section-kicker">Tracker {i + 1}</p><h3>{label}</h3><p>{t.plain}</p></div><Badge variant="outline">{t.rows.length} rows</Badge></div>
              {key === "limitedSource" && data.trackers.limitedSource.criticalityFour.length ? <div className="tracker-summary">{data.trackers.limitedSource.criticalityFour.map((c) => <span key={s(c.id)}><strong className="mono">C4</strong>{s(c.englishName) || s(c.supplier)} · {fam(s(c.capabilityFamily))}{c.fragility ? ` · fragility ${s(c.fragility)}` : ""}</span>)}</div> : null}
              <div className="architecture-table scorecard-table"><Table><TableHeader><TableRow>{Object.keys(t.rows[0] ?? {}).filter((k) => !/url|evidenceId|assessmentId|record_id|signal_id/i.test(k)).map((k) => <TableHead key={k}>{k.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ")}</TableHead>)}<TableHead>Source</TableHead></TableRow></TableHeader><TableBody>{t.rows.map((r, j) => <TableRow key={j}>{Object.entries(r).filter(([k]) => !/url|evidenceId|assessmentId|record_id|signal_id/i.test(k)).map(([k, v]) => <TableCell key={k}><small>{s(v)}</small></TableCell>)}<TableCell>{(r.url ?? r.source_url) ? <a href={s(r.url ?? r.source_url)} target="_blank" rel="noreferrer" className="position-link">{host(s(r.url ?? r.source_url))} <ArrowUpRight /></a> : "—"}</TableCell></TableRow>)}</TableBody></Table></div></section>; })}
          </TabsContent>

          <TabsContent value="method" className="tab-panel">
            <section className="panel-heading"><div><p className="section-kicker">Method</p><h2>{framework.title}</h2><p>{framework.plain}</p></div><Badge variant="outline">{m.package}</Badge></section>
            <div className="method-grid">{framework.steps.map((st, i) => <article key={st.step} className="pathway-card"><h3><span className="mono">{i + 1}</span> {st.step}</h3><p>{st.plain}</p></article>)}</div>
            <section className="conversion-matrix"><div className="section-heading-row"><div><p className="section-kicker">Scoring weights</p><h3>How the legacy triage heuristic is composed</h3></div></div><div>{m.scoringMethod.weights.map((w) => <article key={w.component}><strong className="mono">{w.weight}</strong><h4>{w.component}</h4><p>{w.interpretation}</p></article>)}</div></section>
            <section className="release-tests"><div className="section-heading-row"><div><p className="section-kicker">Evidence gates</p><h3>What each evidence level is allowed to do</h3></div></div><div>{m.scoringMethod.evidenceFactors.map((f) => <article key={f.evidenceLevel}><span className="mono">{f.evidenceLevel}</span><strong>{f.rankTreatment} · fixed evidence multiplier {f.lowerBoundMultiplier}</strong><p>{f.hardBoundary}</p></article>)}</div></section>
            <section className="release-tests"><div className="section-heading-row"><div><p className="section-kicker">Reading notes from the package</p><h3>What the scorecards do and do not say</h3></div></div><div>{m.readMe.notes.map((n, i) => <article key={i}><span className="mono">{i + 1}</span><p>{n.note}</p></article>)}</div></section>
            <section className="architecture-table"><Table><TableHeader><TableRow><TableHead>Source family</TableHead><TableHead>Good for</TableHead><TableHead>Cannot prove alone</TableHead></TableRow></TableHeader><TableBody>{data.bibliography.map((b, i) => <TableRow key={i}><TableCell><strong>{s(b.section)}</strong><br /><small>{s(b.source_family)}</small></TableCell><TableCell><small>{s(b.what_it_is_good_for)}</small></TableCell><TableCell><small>{s(b.what_it_cannot_prove_alone)}</small></TableCell></TableRow>)}</TableBody></Table></section>
            <section className="limits-card"><AlertTriangle aria-hidden="true" /><div><p className="section-kicker">Limits</p><h3>What this lane cannot know</h3><ul>{limits.map((l) => <li key={l}>{l}</li>)}</ul></div></section>
            <section className="panel-actions downloads"><Button asChild variant="outline" size="sm"><a href="/data/industrial-base-robotics.json" download><Download />Lane JSON</a></Button><Button asChild variant="outline" size="sm"><a href="/data/industrial-base-robotics-scorecards.csv" download><Download />Scorecard CSV</a></Button><span className="mono">{m.buildId}</span><Database aria-hidden="true" /></section>
          </TabsContent>
        </Tabs>
      </div>
      <footer><div><strong>PLA Leadership Observatory · Robotics lane</strong><p>{m.package} · cutoff {m.cutoff}</p></div><p>Scorecards, evidence rows, dependency records and signals are separate collections. No ranking without qualifying evidence.</p></footer>
    </main>
  );
}
