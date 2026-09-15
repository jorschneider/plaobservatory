import { createHash } from "node:crypto";

export const contentDigest = (...inputs) => `IB26-R2-${createHash("sha256").update(JSON.stringify(inputs)).digest("hex").slice(0, 12).toUpperCase()}`;

export function validateScarcity(scorecards, evidence, reviews) {
  const ledger = new Map(evidence.map((e) => [e.evidence_id, e]));
  for (const r of reviews) {
    if (!ledger.has(r.evidenceId)) throw new Error(`Unknown scarcity evidence ${r.evidenceId}`);
    if (!["affirmative", "negated", "proposed"].includes(r.state)) throw new Error(`Invalid scarcity state ${r.state}`);
    if (r.state === "affirmative" && (!r.excerpt || !r.locator || !r.url)) throw new Error("Affirmative scarcity requires a located excerpt");
  }
  for (const c of scorecards.filter((c) => Number(c.criticality) >= 4)) {
    if (!reviews.some((r) => r.state === "affirmative" && ledger.get(r.evidenceId).assessment_id === c.id)) throw new Error(`C4 without affirmative source: ${c.id}`);
  }
}

export function validateEcosystem(d, nodeIds, assessmentIds) {
  const ids = {};
  for (const kind of ["entities", "products", "sources", "claims", "relationships", "cases", "metrics"]) {
    ids[kind] = new Set(d[kind].map((r) => r.id));
    if (ids[kind].size !== d[kind].length) throw new Error(`Duplicate ${kind} ID`);
  }
  const ref = (kind, id) => { if (!ids[kind].has(id)) throw new Error(`Unknown ${kind}: ${id}`); };
  for (const e of d.entities) e.sourceIds.forEach((id) => ref("sources", id));
  for (const p of d.products) {
    if (p.manufacturerId) ref("entities", p.manufacturerId);
    p.claimIds.forEach((id) => ref("claims", id));
    for (const id of p.nodeIds) if (!nodeIds.includes(id)) throw new Error(`Unknown node: ${id}`);
  }
  for (const c of d.claims) { ref("cases", c.caseId); ref("sources", c.sourceId); }
  for (const r of d.relationships) {
    ref("cases", r.caseId); ref("entities", r.subjectId);
    if (r.objectId) ref("entities", r.objectId);
    r.productIds.forEach((id) => ref("products", id));
    if (!r.claimIds.length) throw new Error(`Unsourced relationship ${r.id}`);
    r.claimIds.forEach((id) => ref("claims", id));
    if (r.effectiveStart && r.effectiveEnd && r.effectiveStart >= r.effectiveEnd) throw new Error(`Invalid interval ${r.id}`);
  }
  for (const c of d.cases) {
    c.entityIds.forEach((id) => ref("entities", id)); c.productIds.forEach((id) => ref("products", id)); c.claimIds.forEach((id) => ref("claims", id));
    for (const id of c.legacyAssessmentIds) if (!assessmentIds.includes(id)) throw new Error(`Unknown assessment: ${id}`);
  }
  for (const m of d.metrics) { ref("cases", m.caseId); ref("claims", m.claimId); }
}
