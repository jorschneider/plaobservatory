import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(
  await readFile(new URL("../app/data/observatory.json", import.meta.url), "utf8"),
);
const publicData = JSON.parse(
  await readFile(new URL("../public/data/pla-leadership-observatory-public.json", import.meta.url), "utf8"),
);

test("keeps documentary signals, source families, and adverse controls distinct", () => {
  assert.ok(data.metadata.primaryOfficialSourceCount > 0);
  assert.ok(data.metadata.pipelineSourceCount >= 12);
  assert.ok(data.metadata.supplementalNewEntityCount >= 20);
  assert.equal(
    data.officers.filter((officer) => data.adverse.some((record) => record.id === officer.id)).length,
    0,
  );
  assert.ok(data.officers.every((officer) => typeof officer.signals?.primaryMappedClaims === "number"));
  assert.ok(data.officers.some((officer) => officer.nameEn === "Zhang Jianming"));
  assert.ok(data.sources.some((source) => source.family === "official_primary"));
});

test("publishes the Wei Wenhui Party correction from the canonical dataset", () => {
  const wei = data.officers.find((officer) => officer.nameEn === "Wei Wenhui");
  assert.equal(wei.partyStatus, "Alternate member, 20th CCP Central Committee");
  assert.equal(wei.signals.partyRecord, "recorded");
  assert.ok(wei.claims.some((claim) => claim.id === "PSX-CLM-WEI-WH-PARTY-20221022"));
  assert.ok(wei.sources.some((source) => source.id === "PSX-XH-20CC-ALT-20221022"));
});

test("metadata describes both documentary and estimative layers accurately", () => {
  assert.match(data.metadata.editorialNote, /event-specific ranges/i);
  assert.doesNotMatch(data.metadata.editorialNote, /does not rank, score/);
});

test("scopes Tian Xiaowei's transfer without inventing a JLSF destination", () => {
  const tian = data.officers.find((officer) => officer.nameEn === "Tian Xiaowei");
  assert.match(tian.billet, /destination not disclosed/);
  assert.match(tian.rank, /later lieutenant-general reporting unconfirmed/);
  assert.ok(tian.claims.some((claim) => claim.id === "V6-CLM-TIAN-TRANSFER-20260114"));
  assert.doesNotMatch(tian.claims.find((claim) => claim.id === "V6-CLM-TIAN-TRANSFER-20260114").value, /JLSF/);
});

test("keeps the interface and downloadable JSON on one canonical build", () => {
  assert.deepEqual(publicData, data);
  assert.equal(data.metadata.officerCount, data.officers.length);
  assert.equal(data.metadata.sourceCount, data.sources.length);
  assert.equal(data.metadata.mappedPersonCount, data.officers.filter((officer) => officer.claims.length > 0).length);
});

test("publishes the v7 frontier and removes Party-bypass cases from the positive universe", () => {
  assert.equal(data.metadata.asOf, "2026-09-02");
  assert.match(data.metadata.buildId, /^PLA26-V7-/);
  assert.equal(data.gaps.length, 18);
  assert.equal(data.systemSources.length, 32);
  assert.ok(data.contextSources.some((source) => source.id === "CTX-SENIOR-CADRE-COURSE-20260616"));
  assert.ok(data.contextSources.some((source) => source.id === "CTX-STC-PATROL-20260902"));
  for (const name of ["Ding Xingnong", "Fang Yongxiang"]) {
    assert.ok(!data.officers.some((officer) => officer.nameEn === name), `${name} leaked into the positive universe`);
    const adverse = data.adverse.find((record) => record.nameEn === name);
    assert.equal(adverse?.controlledState, "unresolved_adverse_watch");
    assert.equal(adverse?.status, "promotion-bypass-unresolved");
  }
  const bypassWatches = data.adverse.filter((record) => record.status === "promotion-bypass-unresolved").length;
  assert.equal(
    data.metadata.canonicalOfficerCount - data.metadata.officerCount,
    data.metadata.identityHeldCount + data.metadata.adverseHeldCount + bypassWatches,
  );
});

test("dynamic coverage language cannot regress to the stale 127-officer denominator", () => {
  const birthGap = data.gaps.find((gap) => gap.id === "G06");
  assert.match(birthGap.title, new RegExp(`${data.metadata.officerCount} active dossiers`));
  assert.doesNotMatch(birthGap.title, /127 officers/);
});
