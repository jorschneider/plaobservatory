"use client";

import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import caseIndex from "../../research/military-robotics/case-index.json";
import collection from "../../research/autonomy/questions.json";

// Sourcebooks are pinned to the reviewed research edition.
const repository = "https://github.com/jorschneider/plaobservatory/blob/f7432a0523e0745cda965a01d2ad432c4b713f6d/research/";
const sourcebook = (path: string, directory = "") => new URL(path, `${repository}${directory}`).href;
const titleCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const domains = [...new Set(caseIndex.cases.map((item) => item.domain))];
const readings = [
  { title: "Civilian industrial base", path: "military-robotics/civilian-base.md", question: "What do production, installations and supplier sourcing actually measure?" },
  { title: "What civilian robotics makes reusable", path: "military-robotics/civilian-reuse.md", question: "Which components, software and engineering experience can another organization draw on?" },
  { title: "Adoption and business models", path: "military-robotics/adoption-routes.md", question: "How do different buying and development routes shape who creates and captures value?" },
  { title: "Doctrine", path: "autonomy/doctrine.md", question: "What do the different sources say about human and machine authority?" },
  { title: "Institutions", path: "military-robotics/institutions.md", question: "Which organizations research, coordinate, finance and develop systems?" },
  { title: "Autonomy stack", path: "autonomy/stack.md", question: "Which functions and dependencies make a useful system?" },
  { title: "Software and component lineage", path: "military-robotics/lineage.md", question: "Which identifiable artifacts enter research or supply relationships?" },
  { title: "Assurance", path: "military-robotics/assurance.md", question: "What was required, qualified or actually tested?" },
  { title: "Procurement", path: "military-robotics/procurement.md", question: "What was requested, selected, supplied or left unresolved?" },
  { title: "Defense production", path: "military-robotics/defense-production.md", question: "How do commercial automation suppliers enter military aircraft production?" },
  { title: "Scale and revenue", path: "military-robotics/scale.md", question: "How do orders, accepted business and operating scale differ?" },
  { title: "Test the thesis", path: "military-robotics/thesis-tests.md", question: "What evidence challenges the emphasis on integration and retained labor?" },
];
const caseTitles: Record<string, string> = {
  "human-authority.md": "Human authority",
  "ehang-operations.md": "EHang operations",
  "unitree-dependencies.md": "Unitree dependencies",
  "ownership-and-software.md": "Ownership and software",
  "ground.md": "Ground systems",
  "air.md": "Air systems",
  "maritime.md": "Maritime systems",
};
const readingTitle = (path: string) => {
  const file = path.split("#")[0].split("/").at(-1)!;
  return readings.find((item) => item.path.endsWith(`/${file}`))?.title
    ?? caseTitles[file] ?? titleCase(file.replace(/\.md$/, "").replaceAll("-", " "));
};
const states = collection.questions.reduce<Record<string, number>>((counts, item) => {
  counts[item.progress.state] = (counts[item.progress.state] ?? 0) + 1;
  return counts;
}, {});

export default function Research() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const q = query.trim().toLowerCase();
  const cases = caseIndex.cases.filter((item) =>
    (domain === "all" || item.domain === domain)
    && (!q || [item.id, item.nameEn, item.nameZh, item.domain, item.role, item.strongestEvidence, item.autonomyEvidence, item.unresolved].join(" ").toLowerCase().includes(q)));

  return <section className="robotics-ecosystem robotics-research" aria-labelledby="research-title">
    <div className="panel-heading">
      <div><p className="section-kicker">Analyst research brief · {caseIndex.date}</p>
        <h2 id="research-title">Connect doctrine, institutions and documented systems</h2>
        <p>Compare {caseIndex.cases.length} selected cases, follow their sourcebooks, and review {collection.questions.length} collection questions.</p>
      </div>
      <Button asChild variant="outline"><a href={sourcebook("military-robotics/README.md")} target="_blank" rel="noreferrer">Read the full brief <ArrowUpRight aria-hidden="true" /></a></Button>
    </div>
    <p className="eco-meta">Selected military, development and civilian comparison cases. This is not a fleet inventory or a common maturity ranking.</p>

    <section aria-labelledby="research-judgments-title">
      <h3 id="research-judgments-title">Three working judgments</h3>
      <div className="eco-collection">
        <article><h4>Human responsibility leaves several choices open</h4><p>Track who is accountable, which people can decide, what machines may do and when supervision occurs. Organizational proposals, unit training and system requirements provide different evidence about those choices.</p><a href={sourcebook("military-robotics/README.md#what-the-cases-show")} target="_blank" rel="noreferrer">Read the doctrine interpretation <ArrowUpRight aria-hidden="true" /></a></article>
        <article><h4>Civilian capabilities enter through several routes</h4><p>Existing components, tools and integration experience give downstream organizations resources to draw on. Research reuse, commercial purchasing and factory integration establish different relationships; their cost advantages require separate measurement.</p><a href={sourcebook("military-robotics/adoption-routes.md")} target="_blank" rel="noreferrer">Compare adoption routes <ArrowUpRight aria-hidden="true" /></a></article>
        <article><h4>Product growth can diverge from defense demand</h4><p>Deepinfar&apos;s underwater-system product revenue rose from 2023 to 2025 while its disclosed defense-customer revenue fell. Product categories and customer mix change the meaning of growth.</p><a href={sourcebook("military-robotics/scale.md")} target="_blank" rel="noreferrer">Examine the revenue evidence <ArrowUpRight aria-hidden="true" /></a></article>
      </div>
    </section>

    <nav aria-labelledby="research-readings-title">
      <h3 id="research-readings-title">Reading paths</h3>
      <div className="eco-collection">{readings.map((item) => <article key={item.path} className="min-w-0">
        <h4><a href={sourcebook(item.path)} target="_blank" rel="noreferrer">{item.title} <ArrowUpRight aria-hidden="true" /></a></h4>
        <p>{item.question}</p>
      </article>)}</div>
    </nav>

    <section aria-labelledby="research-cases-title">
      <h3 id="research-cases-title">Compare documented cases</h3>
      <div className="filter-bar eco-filters">
        <div className="search-field"><Search aria-hidden="true" /><Input id="research-case-search" aria-label="Search research cases" placeholder="System, 汉字, institution or evidence" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger aria-label="Filter research cases by domain"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All domains ({caseIndex.cases.length})</SelectItem>{domains.map((item) => <SelectItem key={item} value={item}>{titleCase(item)} ({caseIndex.cases.filter((entry) => entry.domain === item).length})</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="ghost" onClick={() => { setQuery(""); setDomain("all"); }}>Reset filters</Button>
      </div>
      <p className="eco-meta" role="status" aria-live="polite">{cases.length} of {caseIndex.cases.length} cases shown.</p>
      <div className="grid gap-6">{cases.map((item) => <article key={item.id} className="eco-dossier min-w-0" aria-labelledby={`research-case-${item.id}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0"><Badge variant="outline">{titleCase(item.domain)} · {item.id}</Badge>
            <h4 id={`research-case-${item.id}`}>{item.nameEn}</h4><p lang="zh-Hans">{item.nameZh}</p>
          </div>
          <a href={sourcebook(item.dossierPath, "military-robotics/")} target="_blank" rel="noreferrer" aria-label={`Read sourcebook for ${item.nameEn}`}>Read sourcebook <ArrowUpRight aria-hidden="true" /></a>
        </div>
        <p>{item.role}</p>
        <dl className="grid gap-4 md:grid-cols-3">
          <div className="min-w-0"><dt className="font-semibold">Strongest evidence</dt><dd>{item.strongestEvidence}</dd></div>
          <div className="min-w-0"><dt className="font-semibold">Evidence of autonomy</dt><dd>{item.autonomyEvidence}</dd></div>
          <div className="min-w-0"><dt className="font-semibold">Still unresolved</dt><dd>{item.unresolved}</dd></div>
        </dl>
        <p className="eco-meta">Reviewed <time dateTime={item.reviewedAt}>{item.reviewedAt}</time></p>
      </article>)}</div>
      {!cases.length && <p>No cases match these filters. Reset filters to see the full comparison.</p>}
    </section>

    <section className="mt-10" aria-labelledby="research-questions-title">
      <h3 id="research-questions-title">What to collect next</h3>
      <p className="eco-meta">Reviewed {collection.reviewedAt} · {Object.entries(states).map(([state, count]) => `${count} ${state.toLowerCase()}`).join(" · ")}</p>
      <Accordion type="multiple" className="eco-evidence">{collection.questions.map((item) => <AccordionItem key={item.id} value={item.id}>
        <AccordionTrigger><span className="min-w-0"><Badge variant="outline">{item.progress.state}</Badge> {item.question}</span></AccordionTrigger>
        <AccordionContent>
          <p><strong>What the research has established.</strong> {item.progress.finding}</p>
          <p className="eco-meta">{item.id} · Progress reviewed {item.progress.reviewedAt}</p>
          <p><strong>Evidence to collect.</strong> {item.request}</p>
          <p><strong>Decision it would change.</strong> {item.wouldChange}</p>
          <p><strong>Alternative explanation.</strong> {item.alternativeExplanation}</p>
          <nav aria-label={`Supporting reading for ${item.id}`}><ul className="flex flex-wrap gap-x-5 gap-y-2">{item.progress.casePaths.map((path) => <li key={path}>
            <a href={sourcebook(path, "autonomy/")} target="_blank" rel="noreferrer">{readingTitle(path)} <ArrowUpRight aria-hidden="true" /></a>
          </li>)}</ul></nav>
        </AccordionContent>
      </AccordionItem>)}</Accordion>
    </section>
  </section>;
}
