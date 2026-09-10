"use client";

import { useState } from "react";
import { ArrowUpRight, Download, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import data from "../data/industrial-base.json";

const d = data.ecosystem;
type Relation = (typeof d.relationships)[number] & { amountCny?: number };
const entities = new Map(d.entities.map((e) => [e.id, e]));
const products = new Map(d.products.map((p) => [p.id, p]));
const claims = new Map(d.claims.map((c) => [c.id, c]));
const sources = new Map(d.sources.map((s) => [s.id, s]));
const classes = [...new Set(d.products.map((p) => p.productClass))].sort();
const money = (n: number) => `CNY ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const label = (id: string | null) => id ? entities.get(id)?.name ?? id : "Customer / counterparty unspecified";

function Evidence({ ids, expanded = false }: { ids: string[]; expanded?: boolean }) {
  return <Accordion type="multiple" defaultValue={expanded ? ids : []} className="eco-evidence">{ids.map((id) => {
    const c = claims.get(id)!;
    const source = sources.get(c.sourceId)!;
    return <AccordionItem key={id} value={id} id={id}>
      <AccordionTrigger><span><Badge variant="outline">{c.basis}</Badge> {c.text}</span></AccordionTrigger>
      <AccordionContent>
        <p><strong>Evidence boundary.</strong> {c.limitation}</p>
        {c.excerpt && <blockquote><p>{c.excerpt}</p>{c.translation && <p>{c.translation}</p>}</blockquote>}
        <p><strong>Location:</strong> {c.locator}</p>
        <a href={source.url} target="_blank" rel="noreferrer">{source.title} <ArrowUpRight aria-hidden="true" /></a>
        <p className="eco-meta">{source.publisher} · Published {source.publicationDate ?? "date unknown"} · Retrieved {source.retrievedAt}</p>
        <p className="eco-meta">{source.accessState}. {source.note}</p>
        <p className="eco-meta">Claim {c.id} · Source {source.id} · Origin record {source.originId}. Distinct records do not imply independent publishers.</p>
      </AccordionContent>
    </AccordionItem>;
  })}</Accordion>;
}

export default function Ecosystem({ openCard }: { openCard: (id: string) => void }) {
  const [view, setView] = useState("relationships");
  const [query, setQuery] = useState("");
  const [productClass, setProductClass] = useState("all");
  const [caseId, setCaseId] = useState("all");
  const [selected, setSelected] = useState("deep");
  const [claimOpen, setClaimOpen] = useState<string[]>([]);
  const q = query.trim().toLowerCase();
  const rows = (d.relationships as Relation[]).filter((r) =>
    (caseId === "all" || r.caseId === caseId) &&
    (productClass === "all" || r.productIds.some((id) => products.get(id)?.productClass === productClass)) &&
    (!q || [r.id, label(r.subjectId), label(r.objectId), entities.get(r.subjectId)?.nameZh, r.objectId && entities.get(r.objectId)?.nameZh, r.relation, r.connection, r.transactionStage, ...r.productIds.map((id) => products.get(id)?.name), ...r.claimIds.map((id) => claims.get(id)?.text)].join(" ").toLowerCase().includes(q)));
  const dossier = d.cases.find((c) => c.id === selected)!;
  const openDossier = (id: string) => { setSelected(id); setView("dossiers"); };
  const dated = rows.filter((r) => r.eventDate).sort((a, b) => a.eventDate!.localeCompare(b.eventDate!));
  const undated = rows.filter((r) => !r.eventDate);
  const collection = d.cases.filter((c) => rows.some((r) => r.caseId === c.id));

  return <section className="robotics-ecosystem">
    <div className="panel-heading"><div><p className="section-kicker">Evidence through individual cases</p><h2>Follow the product, buyer and date</h2><p>{d.scope}</p></div><Button asChild variant="outline"><a href="/data/industrial-base-robotics-relationships.csv" download><Download />Relationships CSV</a></Button></div>
    <div className="eco-principles"><p><strong>{d.cases.length} dossiers · {d.relationships.length} relationships · {d.claims.length} claims</strong><br />Reviewed {d.reviewedAt}; sources span 2015–2026.</p><p><strong>Read across two kinds of maturity</strong><br />A procurement award, an operational pilot and an available product answer different questions.</p><p><strong>Keep the civilian baseline visible</strong><br />Commercial capability and military connection are assessed separately.</p></div>
    <Tabs value={view} onValueChange={setView}>
      <TabsList variant="line"><TabsTrigger value="relationships">Relationships</TabsTrigger><TabsTrigger value="dossiers">Dossiers</TabsTrigger><TabsTrigger value="timeline">Timeline</TabsTrigger><TabsTrigger value="collection">Collection priorities</TabsTrigger></TabsList>
      {view !== "dossiers" && <div className="filter-bar eco-filters">
        <div className="search-field"><Search aria-hidden="true" /><Input aria-label="Search relationships" placeholder="Company, 汉字, product or claim" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <Select value={productClass} onValueChange={setProductClass}><SelectTrigger aria-label="Filter product class"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All product classes</SelectItem>{classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        <Select value={caseId} onValueChange={setCaseId}><SelectTrigger aria-label="Filter case"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All six cases</SelectItem>{d.cases.map((c) => <SelectItem key={c.id} value={c.id}>{c.title.split(":")[0]}</SelectItem>)}</SelectContent></Select>
        <Button variant="ghost" onClick={() => { setQuery(""); setProductClass("all"); setCaseId("all"); }}>Reset filters</Button>
      </div>}
      <TabsContent value="relationships">
        <p className="eco-meta">{rows.length} of {d.relationships.length} relationships. Each row describes the evidence available at its date; absence of a connection means unknown.</p>
        <div className="eco-table"><Table><TableHeader><TableRow><TableHead>Actors and product</TableHead><TableHead>Connection</TableHead><TableHead>Transaction / technical stage</TableHead><TableHead>Date and currentness</TableHead><TableHead>Evidence and limits</TableHead></TableRow></TableHeader><TableBody>{rows.map((r) => <TableRow key={r.id}>
          <TableCell><strong>{label(r.subjectId)}</strong><p>→ {label(r.objectId)}</p><small>{r.productIds.map((id) => products.get(id)?.name).join("; ")}</small></TableCell>
          <TableCell><Badge variant="outline">{r.connection}</Badge><p>{r.relation}</p>{r.amountCny != null && <strong>{money(r.amountCny)} award value</strong>}</TableCell>
          <TableCell><p><strong>Transaction:</strong> {r.transactionStage}</p><p><strong>Technical:</strong> {r.technicalStage}</p></TableCell>
          <TableCell><p>{r.dateLabel}</p><small>{r.currentness}</small>{r.effectiveStart && <p>Effective {r.effectiveStart} → {r.effectiveEnd ?? "end unknown"}</p>}</TableCell>
          <TableCell><p>{r.limitation}</p><Button variant="link" onClick={() => { setClaimOpen(r.claimIds); }}>Read {r.claimIds.length} claim{r.claimIds.length === 1 ? "" : "s"}</Button><br /><Button variant="link" onClick={() => openDossier(r.caseId)}>Open dossier</Button></TableCell>
        </TableRow>)}</TableBody></Table></div>
        {!rows.length && <p role="status">No relationships match these filters. Reset filters to see all six cases.</p>}
        <Dialog open={claimOpen.length > 0} onOpenChange={(open) => { if (!open) setClaimOpen([]); }}><DialogContent className="robotics-ecosystem max-h-[85vh] overflow-y-auto sm:max-w-3xl"><DialogTitle>Selected relationship evidence</DialogTitle><DialogDescription>Located claims and their source boundaries.</DialogDescription><Evidence key={claimOpen.join("|")} ids={claimOpen} expanded /></DialogContent></Dialog>
      </TabsContent>
      <TabsContent value="dossiers">
        <div className="eco-dossier-selector"><label htmlFor="dossier-select">Choose a dossier</label><Select value={selected} onValueChange={setSelected}><SelectTrigger id="dossier-select"><SelectValue /></SelectTrigger><SelectContent>{d.cases.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent></Select></div>
        <article className="eco-dossier"><p className="section-kicker">Case study · {dossier.id}</p><h3>{dossier.title}</h3><p className="eco-lead">{dossier.summary}</p>
          <div className="eco-two-col"><div><h4>Why this matters</h4><p>{dossier.whatMatters}</p></div><div><h4>What remains unknown</h4><p>{dossier.unknown}</p></div></div>
          <h4>Actors and identity boundaries</h4><div className="eco-actors">{dossier.entityIds.map((id) => { const e = entities.get(id)!; return <article key={id}><strong>{e.name}</strong><p lang="zh-Hans">{e.nameZh}</p><small>{e.role}</small><p>{e.identityScope}</p></article>; })}</div>
          <h4>Products and capabilities</h4><div className="eco-actors">{dossier.productIds.map((id) => { const p = products.get(id)!; return <article key={id}><strong>{p.name}</strong><p>{p.productClass}</p><p>{p.technicalStage}</p><small>{p.scope}</small><p className="eco-meta">{p.nodeIds.length ? `Mapped capability: ${p.nodeIds.map((node) => data.chart.nodes.find((n) => n.id === node)?.label).join("; ")}` : "No capability-node mapping asserted"}</p></article>; })}</div>
          {d.metrics.filter((m) => m.caseId === selected).map((m) => <div className="eco-measure" key={m.id}><strong>{m.label}: {m.unit === "CNY" ? money(m.value) : `${m.value.toLocaleString("en-US")} ${m.unit}`}</strong><p>{m.scope}</p><small>Supported by {m.claimId}; expand the matching claim below.</small></div>)}
          <div className="eco-two-col"><div><h4>Next evidence to collect</h4><p>{dossier.nextEvidence}</p><p>{dossier.decision}</p></div><div><h4>What could change the assessment</h4><p>{dossier.counterEvidence}</p></div></div>
          <h4>Claims and sources</h4><p className="eco-meta">Open a claim for its exact location, source wording, translation and access record. Related issuer documents do not count as independent corroboration.</p><Evidence ids={dossier.claimIds} />
          {dossier.legacyAssessmentIds.map((id) => <Button key={id} variant="outline" onClick={() => openCard(id)}>Open legacy assessment {id}</Button>)}
        </article>
      </TabsContent>
      <TabsContent value="timeline">
        <p>Events are ordered only where the event date is supported. Year-only and month-only dates retain that precision. Ownership intervals end when the next documented state begins.</p>
        <ol className="eco-timeline">{dated.map((r) => <li key={r.id}><time>{r.eventDate}</time><div><h3>{r.relation}</h3><p>{label(r.subjectId)} → {label(r.objectId)}</p><p>{r.dateLabel} · {r.currentness}</p><p>{r.limitation}</p><Button variant="link" onClick={() => openDossier(r.caseId)}>Read supporting dossier</Button></div></li>)}</ol>
        <h3>Reported or observed; exact event date unresolved</h3><div className="eco-actors">{undated.map((r) => <article key={r.id}><strong>{r.relation}</strong><p>{label(r.subjectId)} → {label(r.objectId)}</p><p>{r.dateLabel}</p><Button variant="link" onClick={() => openDossier(r.caseId)}>Read supporting dossier</Button></article>)}</div>
        {!rows.length && <p role="status">No events match these filters.</p>}
      </TabsContent>
      <TabsContent value="collection">
        <p>These are proposed collection tasks, ordered by case rather than a confidence score. Each specifies the evidence that would change an analytical judgment.</p>
        <div className="eco-collection">{collection.map((c) => <article key={c.id}><Badge variant="outline">Open research question</Badge><h3>{c.title}</h3><h4>Collect</h4><p>{c.nextEvidence}</p><h4>Decision it would change</h4><p>{c.decision}</p><h4>Disconfirming evidence</h4><p>{c.counterEvidence}</p><Button variant="link" onClick={() => openDossier(c.id)}>Open dossier</Button></article>)}</div>
        {!collection.length && <p role="status">No collection tasks match these filters.</p>}
      </TabsContent>
    </Tabs>
  </section>;
}
