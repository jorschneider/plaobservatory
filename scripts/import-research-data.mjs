import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [researchRoot, outputPath, exportsDirectory] = process.argv.slice(2);

if (!researchRoot || !outputPath) {
  throw new Error("Usage: node scripts/import-research-data.mjs <research_v2_dir> <output_json>");
}

const readJson = async (directory, name) =>
  JSON.parse(await readFile(path.join(directory, name), "utf8"));

const readOptionalJson = async (filePath, fallback) => {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") return fallback;
    throw error;
  }
};

const officersSource = await readJson(researchRoot, "officers_v2.json");
const claimsSource = await readJson(researchRoot, "claim_provenance_ledger_v2.json");
const gapsSource = await readJson(researchRoot, "gap_register_v2.json");
const adverseSource = await readJson(researchRoot, "adverse_state_ledger_v2.json");
const systemSourcesSource = await readJson(researchRoot, "system_model_sources.json");
const expansionSource = await readOptionalJson(
  path.resolve("research/primary-source-expansion.json"),
  { newOfficers: [], supplementalClaims: [] },
);
const pipelineSource = await readOptionalJson(
  path.resolve("research/institutional-pipelines.json"),
  { sources: [] },
);

const confirmedClaimTypes = new Set([
  "confirmed_fact",
  "confirmed_historical_fact",
  "confirmed_reported_biography",
  "reported_fact_with_conflict",
]);
const primaryClasses = new Set(["A1", "A2", "A3"]);

function sourceFamily(sourceClass) {
  if (sourceClass === "A1") return "formal_decision";
  if (sourceClass === "A2" || sourceClass === "A3") return "official_primary";
  if (sourceClass === "B1" || sourceClass === "B2") return "specialist_research";
  return "discovery_or_other";
}

function normalizeSource(source = {}) {
  const sourceClass = source.source_class ?? source.class ?? source.tier ?? "Unclassified";
  return {
    id: source.source_id ?? source.id ?? null,
    url: source.url,
    class: sourceClass,
    family: source.family ?? sourceFamily(sourceClass),
    date: source.date ?? source.source_date ?? null,
    publisher: source.publisher ?? null,
    scope: source.claim_scope ?? source.scope ?? source.supports ?? null,
    mode: source.evidence_mode ?? source.mode ?? null,
  };
}

function addMapValue(map, key, value) {
  const list = map.get(key) ?? [];
  list.push(value);
  map.set(key, list);
}

function hasRecordedValue(value) {
  if (value == null || value === "") return false;
  return !/unknown|not applicable|not publicly established|not established|no .* established|unstructured/i.test(String(value));
}

function titleFreshness(value) {
  const year = String(value ?? "").match(/\b(20\d{2})\b/)?.[1];
  if (year === "2026") return "observed_2026";
  if (year === "2025") return "observed_2025";
  if (year) return "pre_2025";
  return "not_established";
}

const officialCorrections = new Map([
  [
    "PLA-C486000672BB",
    {
      billet: "Vice Chairman, CCP Central Military Commission; Vice Chairman, PRC Central Military Commission",
      roleState: "formal_current",
      lastReliableTitleDate: "2025-10-29",
      stateCmcStatus: "Vice Chairman, PRC Central Military Commission; formally appointed 28 October 2025",
      source: {
        id: "SITE-SRC-ZHANG-SHENGMIN-STATE-20251029",
        url: "https://www.news.cn/20251029/0d11cf61359e43afafc96ee5c3521b72/c.html",
        class: "A1",
        date: "2025-10-29",
        publisher: "Xinhua",
        scope: "formal state-CMC vice-chair appointment",
        mode: "formal-decision",
      },
      claim: {
        id: "SITE-CLM-ZHANG-SHENGMIN-STATE-20251029",
        field: "state_cmc_status",
        value: "Vice Chairman, PRC Central Military Commission",
        type: "confirmed_fact",
        support: "supports",
        observedAt: "2025-10-29",
        sourceId: "SITE-SRC-ZHANG-SHENGMIN-STATE-20251029",
        sourceUrl: "https://www.news.cn/20251029/0d11cf61359e43afafc96ee5c3521b72/c.html",
        sourceClass: "A1",
        sourceMode: "formal-decision",
        sourceDate: "2025-10-29",
        publisher: "Xinhua",
        temporalScope: "Formal state appointment effective 28 October 2025.",
        doesNotSupport: "Any different timing for the parallel Party-CMC office.",
      },
    },
  ],
  [
    "PLA-101D2479A53D",
    {
      billet: "Minister of National Defense",
      roleState: "formal_current",
      lastReliableTitleDate: "2026-08-21",
      source: {
        id: "SITE-SRC-DONG-JUN-20260821",
        url: "https://www.mod.gov.cn/gfbw/qwfb/16480644.html",
        class: "A2",
        date: "2026-08-21",
        publisher: "PRC Ministry of National Defense",
        scope: "direct current ministerial title observation",
        mode: "text-title",
      },
      claim: {
        id: "SITE-CLM-DONG-JUN-20260821",
        field: "current_billet",
        value: "Minister of National Defense",
        type: "confirmed_fact",
        support: "supports",
        observedAt: "2026-08-21",
        sourceId: "SITE-SRC-DONG-JUN-20260821",
        sourceUrl: "https://www.mod.gov.cn/gfbw/qwfb/16480644.html",
        sourceClass: "A2",
        sourceMode: "text-title",
        sourceDate: "2026-08-21",
        publisher: "PRC Ministry of National Defense",
        temporalScope: "Direct title observation on 21 August 2026.",
        doesNotSupport: "Party-CMC or state-CMC membership.",
      },
    },
  ],
  [
    "PLA-716E32CF49E2",
    {
      billet: "Confirmed transferred out of the Sichuan Military District by 9 January 2026; destination not disclosed. JLSF political-commissar reporting competes with a Wang Jingtian handler hypothesis and remains unconfirmed.",
      rank: "Major general (last official rank found, January 2025); later lieutenant-general reporting unconfirmed",
      roleState: "conflicting_current",
      lastReliableTitleDate: "2026-01-09",
      source: {
        id: "V6-SC-TIAN-TRANSFER-20260114",
        url: "https://epaper.scdaily.cn/shtml/scrb/20260114/1068624.html",
        class: "A3",
        date: "2026-01-14",
        publisher: "Sichuan Daily",
        scope: "official provincial decision records transfer out of Sichuan; destination not stated",
        mode: "formal-list",
      },
    },
  ],
]);

const supplementalOfficers = (expansionSource.newOfficers ?? []).map((entry) => ({
  person_id: entry.id,
  name_en: entry.nameEn,
  name_zh: entry.nameZh,
  identity_disambiguator: entry.identityNote ?? null,
  branch_bucket: entry.branch,
  current_institution: entry.institution,
  service_origin: null,
  service_origin_detail: null,
  current_billet: entry.billet,
  rank: entry.rank ?? null,
  role_state: entry.roleState ?? "official_title_with_scope_caveat",
  military_billet_status: { state: "official title observation; formal appointment decision not located" },
  last_reliable_title_date: entry.lastReliableTitleDate ?? null,
  assessment_as_of: officersSource.metadata?.as_of ?? "2026-08-31",
  birth_year_numeric: null,
  birth_precision: "not public",
  birth_evidence_status: "no public birth record mapped for this dossier",
  party_status: null,
  state_cmc_status: { state: "unknown/not applicable/not publicly established" },
  npc_mandate_status: { state: "unknown/not applicable/not publicly established" },
  discipline_status: { state: "no public adverse entry in the imported ledger", note: "No adverse-ledger entry is not affirmative evidence of institutional status." },
  publication_evidence_status: {
    grade: "E1",
    label: "official current-role source mapped during primary-source expansion",
    publication_caveat: "The source supports the displayed title at its observation date; it is not necessarily a formal appointment decision and continuity remains date-bounded.",
    structured_claim_mapping_count: 1,
    primary_claim_scoped_count: 1,
    current_role_claim_supported: true,
  },
  sources: (entry.sources ?? []).map((source) => ({
    source_id: source.id,
    url: source.url,
    source_class: source.class,
    date: source.date,
    publisher: source.publisher,
    claim_scope: source.scope,
    evidence_mode: source.mode,
  })),
}));

const allOfficerRows = [...(officersSource.officers ?? []), ...supplementalOfficers];
const stableIds = new Set();
for (const officer of allOfficerRows) {
  if (stableIds.has(officer.person_id)) throw new Error(`Duplicate stable ID in source merge: ${officer.person_id}`);
  stableIds.add(officer.person_id);
}
const officerById = new Map(allOfficerRows.map((officer) => [officer.person_id, officer]));

const supplementalClaims = [
  ...(expansionSource.supplementalClaims ?? []).map((claim) => ({
    id: claim.id,
    personId: claim.personId,
    field: claim.field,
    value: claim.value,
    type: "source_bound_observation",
    support: "supports",
    observedAt: claim.observedAt,
    sourceId: claim.source?.id ?? null,
    sourceUrl: claim.source?.url ?? null,
    sourceClass: claim.source?.class ?? "Unclassified",
    sourceMode: claim.source?.mode ?? null,
    sourceDate: claim.source?.date ?? null,
    publisher: claim.source?.publisher ?? null,
    temporalScope: claim.temporalScope ?? null,
    doesNotSupport: claim.doesNotSupport ?? null,
    source: claim.source ?? null,
  })),
  ...supplementalOfficers.flatMap((officer) => {
    const source = normalizeSource(officer.sources?.[0] ?? {});
    const claims = [{
      id: `PSX-CLM-${officer.person_id}-BILLET`,
      personId: officer.person_id,
      field: "current_billet",
      value: officer.current_billet,
      type: "source_bound_observation",
      support: "supports",
      observedAt: officer.last_reliable_title_date,
      sourceId: source.id,
      sourceUrl: source.url,
      sourceClass: source.class,
      sourceMode: source.mode,
      sourceDate: source.date,
      publisher: source.publisher,
      temporalScope: "Direct institutional title observation at the stated date.",
      doesNotSupport: "A separate appointment decision, rank unless stated, or an advancement conclusion.",
      source,
    }];
    if (officer.rank) {
      claims.push({
        id: `PSX-CLM-${officer.person_id}-RANK`,
        personId: officer.person_id,
        field: "military_rank",
        value: officer.rank,
        type: "source_bound_observation",
        support: "supports",
        observedAt: officer.last_reliable_title_date,
        sourceId: source.id,
        sourceUrl: source.url,
        sourceClass: source.class,
        sourceMode: source.mode,
        sourceDate: source.date,
        publisher: source.publisher,
        temporalScope: "Rank wording as recorded by the cited source.",
        doesNotSupport: "A promotion date or seniority relative to other officers.",
        source,
      });
    }
    return claims;
  }),
];

const claimsByPerson = new Map();
function addClaim(personId, claim) {
  if (!personId || !officerById.has(personId)) return;
  addMapValue(claimsByPerson, personId, claim);
}

for (const claim of claimsSource.claims ?? []) {
  if (!confirmedClaimTypes.has(claim.claim_type)) continue;
  addClaim(claim.person_id, {
    id: claim.claim_id,
    field: claim.field,
    value: claim.value,
    type: claim.claim_type,
    support: claim.support,
    observedAt: claim.observed_at,
    sourceId: claim.source_id,
    sourceUrl: claim.source_url,
    sourceClass: claim.source_class,
    sourceMode: claim.source_evidence_mode,
    sourceDate: claim.source_date,
    publisher: claim.publisher,
    temporalScope: claim.temporal_scope,
    doesNotSupport: claim.does_not_support,
  });
}
for (const [personId, correction] of officialCorrections) if (correction.claim) addClaim(personId, correction.claim);
for (const claim of supplementalClaims) addClaim(claim.personId, claim);

const supplementalClaimSourcesByPerson = new Map();
for (const claim of supplementalClaims) {
  if (claim.source?.url) addMapValue(supplementalClaimSourcesByPerson, claim.personId, normalizeSource(claim.source));
}

const gapIdsByPerson = new Map();
for (const gap of gapsSource.gaps ?? []) {
  for (const personId of gap.affected_person_ids ?? []) addMapValue(gapIdsByPerson, personId, gap.id);
}

const officerSources = new Map();
function indexSource(source, officer) {
  const normalized = normalizeSource(source);
  if (!normalized.url) return;
  const existing = officerSources.get(normalized.url) ?? {
    id: normalized.id,
    url: normalized.url,
    class: normalized.class,
    family: normalized.family,
    date: normalized.date,
    publisher: normalized.publisher,
    scopes: [],
    people: [],
    mode: normalized.mode,
  };
  if (normalized.scope && !existing.scopes.includes(normalized.scope)) existing.scopes.push(normalized.scope);
  if (officer && !existing.people.some((person) => person.id === officer.person_id)) {
    existing.people.push({ id: officer.person_id, nameEn: officer.name_en, nameZh: officer.name_zh });
  }
  officerSources.set(normalized.url, existing);
}
for (const officer of allOfficerRows) for (const source of officer.sources ?? []) indexSource(source, officer);
for (const [personId, correction] of officialCorrections) if (correction.source) indexSource(correction.source, officerById.get(personId));
for (const claim of supplementalClaims) if (claim.source) indexSource(claim.source, officerById.get(claim.personId));
for (const claim of claimsSource.claims ?? []) {
  if (!confirmedClaimTypes.has(claim.claim_type) || !claim.source_url) continue;
  indexSource({
    source_id: claim.source_id,
    url: claim.source_url,
    source_class: claim.source_class,
    source_date: claim.source_date,
    publisher: claim.publisher,
    claim_scope: claim.field,
    evidence_mode: claim.source_evidence_mode,
  }, officerById.get(claim.person_id));
}

function uniqueSources(sources) {
  const byUrl = new Map();
  for (const source of sources) if (source?.url && !byUrl.has(source.url)) byUrl.set(source.url, normalizeSource(source));
  return [...byUrl.values()];
}

const officers = allOfficerRows
  .map((officer) => {
    const correction = officialCorrections.get(officer.person_id);
    const claims = claimsByPerson.get(officer.person_id) ?? [];
    const profileSources = uniqueSources([
      ...(officer.sources ?? []),
      ...(supplementalClaimSourcesByPerson.get(officer.person_id) ?? []),
      ...(correction?.source ? [correction.source] : []),
    ]);
    const officialCurrentClaim = claims.some((claim) => claim.field === "current_billet" && primaryClasses.has(claim.sourceClass));
    const baseEvidence = officer.publication_evidence_status ?? {};
    const currentRoleMapped = Boolean(baseEvidence.current_role_claim_supported || officialCurrentClaim);
    const primaryMappedClaims = Math.max(baseEvidence.primary_claim_scoped_count ?? 0, claims.filter((claim) => primaryClasses.has(claim.sourceClass)).length);
    const mappedClaims = Math.max(baseEvidence.structured_claim_mapping_count ?? 0, claims.length);
    const stateCmcStatus = correction?.stateCmcStatus ?? officer.state_cmc_status?.state ?? null;
    const npcStatus = officer.npc_mandate_status?.state ?? null;
    const partyClaim = claims.find((claim) => claim.field === "party_status" && primaryClasses.has(claim.sourceClass));
    const partyStatus = correction?.partyStatus ?? partyClaim?.value ?? officer.party_status;
    const roleState = correction?.roleState ?? officer.role_state;
    const rank = correction?.rank ?? officer.rank;
    const lastReliableTitleDate = correction?.lastReliableTitleDate ?? officer.last_reliable_title_date;
    const signals = {
      appointmentRecord: roleState ?? "not_established",
      titleFreshness: titleFreshness(lastReliableTitleDate),
      currentRoleSource: officialCurrentClaim ? "official_mapped" : (currentRoleMapped ? "mapped_nonprimary" : "not_mapped"),
      rankRecord: rank ? "recorded" : "not_public",
      partyRecord: hasRecordedValue(partyStatus) ? "recorded" : "not_established",
      stateCmcRecord: hasRecordedValue(stateCmcStatus) ? "recorded" : "not_established",
      npcRecord: hasRecordedValue(npcStatus) ? "recorded" : "not_established",
      birthRecord: officer.birth_year_numeric ? "recorded" : "not_public",
      primaryMappedClaims,
      openGapCount: (gapIdsByPerson.get(officer.person_id) ?? []).length,
    };
    return {
      id: officer.person_id,
      nameEn: officer.name_en,
      nameZh: officer.name_zh,
      identityNote: officer.identity_disambiguator,
      branch: officer.branch_bucket,
      institution: officer.current_institution,
      serviceOrigin: officer.service_origin,
      serviceOriginDetail: officer.service_origin_detail,
      billet: correction?.billet ?? officer.current_billet,
      rank,
      roleState,
      roleStateDetail: officer.military_billet_status?.state ?? null,
      lastReliableTitleDate,
      assessmentAsOf: officer.assessment_as_of,
      birthYear: officer.birth_year_numeric,
      birthPrecision: officer.birth_precision,
      birthEvidence: officer.birth_evidence_status,
      partyStatus,
      stateCmcStatus,
      npcStatus,
      disciplineState: officer.discipline_status?.state ?? null,
      disciplineNote: officer.discipline_status?.note ?? null,
      evidence: {
        grade: officialCurrentClaim ? "E1" : (baseEvidence.grade ?? "E4"),
        label: officialCurrentClaim ? "official current-role source mapped" : (baseEvidence.label ?? "evidence not claim-mapped"),
        caveat: officialCurrentClaim ? "The official source supports the displayed title at its observation date; continuity remains date-bounded." : (baseEvidence.publication_caveat ?? null),
        mappedClaims,
        primaryMappedClaims,
        currentRoleMapped,
      },
      signals,
      sourceCount: profileSources.length,
      sources: profileSources,
      claims,
      gapIds: gapIdsByPerson.get(officer.person_id) ?? [],
    };
  })
  .sort((a, b) => a.nameEn.localeCompare(b.nameEn));

const adverseIds = new Set((adverseSource.ledger ?? []).map((entry) => entry.person_id));
const identityHeldRecords = officers.filter((officer) => officer.roleState === "identity_unresolved").map((officer) => ({ id: officer.id, nameEn: officer.nameEn, nameZh: officer.nameZh, note: officer.billet, gapIds: officer.gapIds }));
const adverseHeldRecords = officers.filter((officer) => adverseIds.has(officer.id)).map((officer) => ({ id: officer.id, nameEn: officer.nameEn, nameZh: officer.nameZh, note: "Withheld from active directory because this identity appears in the adverse-state ledger.", gapIds: officer.gapIds }));
const publicOfficers = officers.filter((officer) => officer.roleState !== "identity_unresolved" && !adverseIds.has(officer.id));

const gaps = (gapsSource.gaps ?? []).map((gap) => ({
  id: gap.id,
  title: gap.gap,
  status: gap.status,
  whyItMatters: gap.why_it_matters,
  evidenceNeeded: gap.closure,
  searchLane: gap.search_lane,
  doNotAssume: gap.do_not_assume,
  lastChecked: gap.last_checked,
  people: gap.affected_person_ids ?? [],
  billetPools: gap.affected_billet_pools ?? [],
  horizons: gap.affected_horizons ?? [],
}));
const adverse = (adverseSource.ledger ?? []).map((entry) => ({
  id: entry.person_id,
  nameEn: entry.name_en,
  nameZh: entry.name_zh,
  formerBranch: entry.former_branch,
  formerRole: entry.former_role,
  status: entry.status,
  controlledState: entry.controlled_discipline_state,
  date: entry.last_action_date,
  summary: entry.reason_for_exclusion,
  evidenceConfidence: entry.evidence_confidence,
  sources: entry.person_id === "PLA-66692D7E85C2" || entry.person_id === "PLA-C469DFD848FA" ? ["https://www.news.cn/20260124/d0526e74a7004ca6b29f7431c3b7c623/c.html", "https://www.news.cn/politics/20260828/9f7a67c5059e4e7b8a45a8353c5688c8/c.html"] : [entry.source1, entry.source2].filter(Boolean),
})).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

const systemSources = (systemSourcesSource.sources ?? []).map((source) => ({
  id: source.id,
  title: source.title_zh ?? source.instrument ?? source.claim_class,
  publisher: source.publisher,
  url: source.url,
  alternateUrl: source.alternate_url ?? null,
  date: source.date,
  effective: source.effective ?? null,
  class: source.tier,
  textLevel: source.public_text_level,
  supports: source.supports ?? [],
  doesNotSupport: source.does_not_support ?? [],
}));
const pipelineSources = (pipelineSource.sources ?? []).map((source) => ({
  id: source.id,
  family: source.family,
  title: source.title,
  publisher: source.publisher,
  url: source.url,
  date: source.date,
  class: source.class,
  supports: source.supports ?? [],
  doesNotSupport: source.doesNotSupport ?? null,
}));

const roleStateCounts = Object.entries(publicOfficers.reduce((acc, officer) => {
  acc[officer.roleState] = (acc[officer.roleState] ?? 0) + 1;
  return acc;
}, {})).map(([state, count]) => ({ state, count }));
const branchCounts = Object.entries(publicOfficers.reduce((acc, officer) => {
  acc[officer.branch] = (acc[officer.branch] ?? 0) + 1;
  return acc;
}, {})).map(([branch, count]) => ({ branch, count })).sort((a, b) => b.count - a.count || a.branch.localeCompare(b.branch));
const sourceFamilyCounts = Object.entries([...officerSources.values()].reduce((acc, source) => {
  acc[source.family] = (acc[source.family] ?? 0) + 1;
  return acc;
}, {})).map(([family, count]) => ({ family, count })).sort((a, b) => b.count - a.count || a.family.localeCompare(b.family));

const contextSources = [
  { id: "CTX-XINHUA-PROMOTIONS-20260703", title: "CMC promotion ceremony for Zhang Shuguang and Wang Gang", publisher: "Xinhua", date: "2026-07-03", url: "https://www.news.cn/politics/leaders/20260703/e7a831d5766e4c9e89ca8b4c599e0625/c.html", note: "Official title-and-rank observation at the CMC promotion ceremony." },
  { id: "CTX-XINHUA-CMC-REMOVALS-20260828", title: "NPC Standing Committee personnel decision", publisher: "Xinhua", date: "2026-08-28", url: "https://www.news.cn/politics/20260828/9f7a67c5059e4e7b8a45a8353c5688c8/c.html", note: "Official state-CMC and NPC action; Party-CMC status is a separate ledger." },
  { id: "CTX-NUDT-ROSTER-20260830", title: "National University of Defense Technology leadership record", publisher: "National University of Defense Technology", date: "2026-08-30", url: "https://www.nudt.edu.cn/xwgg/kdyw/e651e9c8906e457d91ecb00b6fb5272a.htm", note: "Institution-owned current-title observations for education and discipline leadership." },
  { id: "CTX-CCG-ROSTER-20260130", title: "China Coast Guard official press conference record", publisher: "China Coast Guard", date: "2026-01-30", url: "https://www.ccg.gov.cn/xwfbh/202601/t20260130_2985.html", note: "Official, time-bounded Coast Guard title observations without ranking or succession inference." },
];

const dataset = {
  metadata: {
    title: "PLA Leadership Observatory",
    asOf: officersSource.metadata?.as_of ?? "2026-08-31",
    buildId: officersSource.metadata?.build_id ?? "unknown",
    officerCount: publicOfficers.length,
    canonicalOfficerCount: officers.length,
    identityHeldCount: identityHeldRecords.length,
    adverseHeldCount: adverseHeldRecords.length,
    confirmedClaimCount: [...claimsByPerson.values()].reduce((sum, claims) => sum + claims.length, 0),
    sourceCount: officerSources.size,
    primaryOfficialSourceCount: [...officerSources.values()].filter((source) => source.family === "formal_decision" || source.family === "official_primary").length,
    supplementalClaimCount: supplementalClaims.length,
    supplementalPersonCount: new Set(supplementalClaims.map((claim) => claim.personId)).size,
    supplementalNewEntityCount: supplementalOfficers.length,
    pipelineSourceCount: pipelineSources.length,
    sourceFamilyCounts,
    gapCount: gaps.length,
    adverseCount: adverse.length,
    birthYearKnownCount: publicOfficers.filter((officer) => officer.birthYear).length,
    mappedPersonCount: publicOfficers.filter((officer) => officer.claims.length > 0).length,
    currentRoleMappedCount: publicOfficers.filter((officer) => officer.evidence.currentRoleMapped).length,
    undatedTitleCount: publicOfficers.filter((officer) => !officer.lastReliableTitleDate || officer.lastReliableTitleDate === "unknown").length,
    olderTitleCount: publicOfficers.filter((officer) => titleFreshness(officer.lastReliableTitleDate) === "pre_2025").length,
    discoveryOnlySourceCount: [...officerSources.values()].filter((source) => source.mode === "discovery-only").length,
    unscopedSourceCount: [...officerSources.values()].filter((source) => source.scopes.length === 0 || source.scopes.every((scope) => scope.includes("exact claim scope unavailable"))).length,
    roleStateCounts,
    branchCounts,
    editorialNote: "A source-first leadership observatory. Documentary signals describe public records; separate event-specific ranges assess structural promotability without claiming probability, merit, or endorsement.",
  },
  officers: publicOfficers,
  identityHeldRecords,
  adverseHeldRecords,
  claims: [...claimsByPerson.values()].flat(),
  gaps,
  adverse,
  sources: [...officerSources.values()].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
  systemSources,
  pipelineSources,
  contextSources,
};

await writeFile(outputPath, `${JSON.stringify(dataset)}\n`);

if (exportsDirectory) {
  await mkdir(exportsDirectory, { recursive: true });
  await writeFile(path.join(exportsDirectory, "pla-leadership-observatory-public.json"), `${JSON.stringify(dataset, null, 2)}\n`);
  const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csvRows = [
    ["stable_id", "name_en", "name_zh", "institution_family", "institution", "recorded_billet", "reported_military_rank", "appointment_record", "current_title_source", "title_freshness", "primary_mapped_claims", "birth_record", "open_gap_count", "last_corroborated", "source_count", "linked_gap_ids"],
    ...publicOfficers.map((officer) => [officer.id, officer.nameEn, officer.nameZh, officer.branch, officer.institution, officer.billet, officer.rank, officer.signals.appointmentRecord, officer.signals.currentRoleSource, officer.signals.titleFreshness, officer.signals.primaryMappedClaims, officer.signals.birthRecord, officer.signals.openGapCount, officer.lastReliableTitleDate, officer.sourceCount, officer.gapIds.join("|")]),
  ];
  await writeFile(path.join(exportsDirectory, "pla-leadership-observatory-public.csv"), `${csvRows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`);
}

console.log(JSON.stringify({ outputPath, officers: publicOfficers.length, canonicalOfficers: officers.length, identityHeld: identityHeldRecords.length, adverseHeld: adverseHeldRecords.length, claims: dataset.claims.length, sources: dataset.sources.length, pipelineSources: pipelineSources.length, gaps: gaps.length, adverse: adverse.length }));
