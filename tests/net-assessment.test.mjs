import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const officers = JSON.parse(await readFile(new URL("../app/data/observatory.json", import.meta.url), "utf8")).officers;
const officerIds = new Set(officers.map((officer) => officer.id));
const officerById = new Map(officers.map((officer) => [officer.id, officer]));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true } });
after(async () => vite.close());
const assessment = await vite.ssrLoadModule("/app/data/net-assessment.ts");

test("keeps every candidate tied to a canonical dossier", () => {
  for (const board of assessment.successionBoards) {
    for (const candidate of board.candidates) assert.ok(officerIds.has(candidate.officerId), `${candidate.officerId} is missing`);
  }
});

test("SPI bounds equal substantive component bounds", () => {
  const allowed = ["access", "conversions", "pathway", "missionFit", "party", "runway"];
  for (const board of assessment.successionBoards) {
    for (const candidate of board.candidates) {
      assert.deepEqual(Object.keys(candidate.components), allowed);
      const ranges = Object.values(candidate.components);
      assert.equal(candidate.scoreRange.low, ranges.reduce((sum, value) => sum + value.low, 0));
      assert.equal(candidate.scoreRange.high, ranges.reduce((sum, value) => sum + value.high, 0));
      assert.ok(candidate.scoreRange.low <= candidate.scoreRange.high);
      assert.ok(candidate.scoreRange.high <= 100);
    }
  }
});

test("evidence, role truth, and risk are excluded from the substantive index", () => {
  const keys = assessment.scoreModel.map((item) => item.key);
  for (const forbidden of ["evidence", "roleTruth", "risk"]) assert.ok(!keys.includes(forbidden));
});

test("acting-role cases expose conditional outcomes", () => {
  const actingIds = new Set(["PLA-1493DE64544D", "PLA-B526BB58D0B3", "PLA-0EC1B8872EAF", "PLA-3CC5E7908CB4"]);
  const candidates = assessment.successionBoards.flatMap((board) => board.candidates).filter((candidate) => actingIds.has(candidate.officerId));
  assert.ok(candidates.length >= 4);
  assert.ok(candidates.every((candidate) => candidate.conditions?.length === 2));
});

test("long-horizon board uses categorical identity uncertainty and feeder gates", () => {
  const board = assessment.successionBoards.find((item) => item.id === "portfolio-2041");
  assert.equal(board.identityUncertainty, "Extreme");
  assert.doesNotMatch(board.reading, /\d+\s*[–-]\s*\d+%/);
  assert.ok(board.candidates.every((candidate) => candidate.tier === "Feeder watch"));
});

test("decision windows are tied to selection cycles", () => {
  assert.match(assessment.successionBoards[0].decisionWindow, /2027/);
  assert.match(assessment.successionBoards.find((item) => item.id === "central-2036").decisionWindow, /2032/);
  assert.match(assessment.successionBoards.find((item) => item.id === "portfolio-2041").decisionWindow, /2042/);
});

test("regime sensitivity is complete for every candidate", () => {
  const regimeIds = assessment.selectionRegimes.map((item) => item.id).sort();
  for (const board of assessment.successionBoards) for (const candidate of board.candidates) {
    assert.deepEqual(Object.keys(candidate.regimeFit).sort(), regimeIds);
    assert.ok(candidate.stableRegimes >= 0 && candidate.stableRegimes <= 4);
    assert.equal(candidate.stableRegimes, Object.values(candidate.regimeFit).filter((fit) => fit !== "Low").length);
  }
});

test("Wei Wenhui reflects the corrected Party credential in the 2036 board", () => {
  const board = assessment.successionBoards.find((item) => item.id === "central-2036");
  const wei = board.candidates.find((candidate) => candidate.officerId === "PLA-E3B1477CCE9D");
  assert.ok(wei);
  assert.ok(wei.components.party.low >= 8);
  assert.match(wei.path, /CC alternate/);
});

test("unknown birth data never earns a favorable minimum runway", () => {
  for (const board of assessment.successionBoards) for (const candidate of board.candidates) {
    const officer = officerById.get(candidate.officerId);
    if (!officer.birthYear) assert.equal(candidate.components.runway.low, 0, `${officer.nameEn} has unknown birth data`);
  }
});

test("forecast ledger is falsifiable and dated", () => {
  assert.ok(assessment.forecastLedger.length >= 7);
  for (const item of assessment.forecastLedger) {
    assert.match(item.id, /^F-/);
    assert.ok(item.window && item.confirms && item.disconfirms && item.implication);
    assert.equal(item.status, "Open");
  }
});

test("backtest labels reverse-conditionals and preserves architecture breaks", () => {
  assert.match(assessment.historicalBacktest.warning, /P\(route \| selected officer\)/);
  assert.deepEqual(assessment.cmcArchitectureBacktest.map((item) => item.seats), [11, 7, 7]);
  assert.equal(assessment.historicalBacktest.entrantRoutes.reduce((sum, item) => sum + item.count, 0), 13);
  assert.equal(assessment.historicalBacktest.entrantRoutes.find((item) => item.route === "Operational principal").count, 9);
});

test("dyad map covers the full 14-unit public-authority topology", () => {
  assert.equal(assessment.commandDyads.length, 14);
  assert.equal(assessment.commandDyads.filter((item) => item.state === "One principal formalized").length, 3);
  assert.equal(assessment.commandDyads.filter((item) => item.state === "Both principals unresolved").length, 6);
  assert.equal(assessment.commandDyads.filter((item) => ["Publicly unresolved", "Contested"].includes(item.state)).length, 5);
  assert.ok(!assessment.commandDyads.some((item) => /Dual interim|likely handler/i.test(`${item.state} ${item.militaryState} ${item.politicalState}`)));
});

test("v7 models the hidden selector and evidence boundaries explicitly", () => {
  assert.equal(assessment.researchFrontiers.length, 6);
  assert.equal(assessment.selectorFunnel.length, 5);
  assert.equal(assessment.evidenceStopShipTests.length, 12);
  assert.ok(assessment.titleParsingRules.some((item) => /主持工作/.test(item.words) && item.class === "Interim authority"));
  assert.ok(assessment.titleParsingRules.some((item) => /主持会议/.test(item.words) && item.class === "Event role only"));
});

test("behavior evidence is separate and tied to canonical identities", () => {
  assert.equal(assessment.behaviorEvidenceCases.length, 6);
  for (const item of assessment.behaviorEvidenceCases) assert.ok(officerIds.has(item.officerId), `${item.name} behavior case lacks a canonical dossier`);
  assert.ok(assessment.behaviorEvidenceCases.every((item) => item.permits && item.forbids && item.counter));
});

test("scenario coverage spans seven distinct military and political tasks", () => {
  assert.equal(assessment.taskLeaderFit.length, 7);
  assert.ok(assessment.taskLeaderFit.every((item) => item.phase && item.failure && item.confidence));
  assert.ok(assessment.taskLeaderFit.some((item) => /Nuclear/.test(item.task)));
  assert.ok(assessment.taskLeaderFit.some((item) => /Prolonged/.test(item.task)));
});

test("stale Zhou Yongkun is not displayed as a 2036 headline candidate", () => {
  const board = assessment.successionBoards.find((item) => item.id === "central-2036");
  assert.ok(!board.candidates.some((candidate) => candidate.officerId === "PLA-877762113D8E"));
});
