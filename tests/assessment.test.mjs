import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true } });
after(async () => vite.close());
const assessment = await vite.ssrLoadModule("/app/data/assessment.ts");

const BASES = ["counted", "documented", "inferred", "assumed"];
const CONFIDENCES = ["High", "Moderate", "Low"];
const PREMISE_STATUSES = ["held", "contested", "retired"];
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const premiseById = new Map(assessment.premises.map((premise) => [premise.id, premise]));

test("every judgment is plain, exampled, sourced and tied to premises", () => {
  assert.ok(assessment.judgments.length >= 4, `expected at least 4 judgments, found ${assessment.judgments.length}`);
  for (const judgment of assessment.judgments) {
    const label = `judgment ${judgment.id}`;
    for (const field of ["title", "plain", "precise"]) assert.ok(nonEmpty(judgment[field]), `${label} has an empty ${field}`);
    assert.ok(nonEmpty(judgment.example?.text), `${label} has no example text`);
    assert.ok(typeof judgment.example?.url === "string" && judgment.example.url.startsWith("https"), `${label} example url is not https: ${judgment.example?.url}`);
    assert.ok(BASES.includes(judgment.basis), `${label} has basis ${judgment.basis}`);
    assert.ok(CONFIDENCES.includes(judgment.confidence), `${label} has confidence ${judgment.confidence}`);
    assert.ok(Array.isArray(judgment.premiseIds) && judgment.premiseIds.length > 0, `${label} lists no premises`);
  }
});

test("judgment premises exist in the register and none rests on a retired premise", () => {
  const retired = assessment.premises.filter((premise) => premise.status === "retired").map((premise) => premise.id);
  for (const id of ["P-RECERT", "P-SPI"]) assert.ok(retired.includes(id), `${id} is not recorded as retired`);
  for (const judgment of assessment.judgments) {
    for (const id of judgment.premiseIds) {
      assert.ok(premiseById.has(id), `judgment ${judgment.id} cites unknown premise ${id}`);
      assert.ok(!retired.includes(id), `judgment ${judgment.id} rests on retired premise ${id}`);
    }
  }
});

test("every premise says what would test it and what breaks if it is wrong", () => {
  for (const premise of assessment.premises) {
    const label = `premise ${premise.id}`;
    for (const field of ["plain", "discriminatingTest", "ifWrong"]) assert.ok(nonEmpty(premise[field]), `${label} has an empty ${field}`);
    assert.ok(PREMISE_STATUSES.includes(premise.status), `${label} has status ${premise.status}`);
  }
});

test("research questions lead with RQ-1 and have dropped the re-certification frame", () => {
  assert.equal(assessment.researchQuestions[0]?.id, "RQ-1");
  for (const question of assessment.researchQuestions) {
    const label = `research question ${question.id}`;
    for (const field of ["plain", "artifact", "searchLane"]) assert.ok(nonEmpty(question[field]), `${label} has an empty ${field}`);
    for (const field of ["question", "plain", "artifact"]) {
      assert.doesNotMatch(question[field], /senior-cadre|re-certif/i, `${label} ${field} still carries the re-certification frame`);
    }
  }
});

test("glossary defines at least 30 unique terms in plain language", () => {
  assert.ok(assessment.glossary.length >= 30, `expected at least 30 glossary terms, found ${assessment.glossary.length}`);
  const seen = new Set();
  for (const entry of assessment.glossary) {
    assert.ok(nonEmpty(entry.term), "glossary entry has an empty term");
    const key = entry.term.toLowerCase();
    assert.ok(!seen.has(key), `glossary term "${entry.term}" is duplicated`);
    seen.add(key);
    assert.ok(nonEmpty(entry.plain), `glossary term "${entry.term}" has no plain definition`);
  }
});

test("framework steps and release rules are complete", () => {
  assert.ok(nonEmpty(assessment.framework.plain), "framework has no plain statement");
  assert.ok(assessment.framework.steps.length >= 6, `expected at least 6 framework steps, found ${assessment.framework.steps.length}`);
  for (const step of assessment.framework.steps) assert.ok(nonEmpty(step.plain), `framework step "${step.step}" has no plain statement`);
  assert.ok(assessment.releaseRules.length >= 8, `expected at least 8 release rules, found ${assessment.releaseRules.length}`);
  for (const rule of assessment.releaseRules) assert.ok(nonEmpty(rule.plain), `release rule ${rule.id} has no plain statement`);
});

test("forecast ledger entries are plain, falsifiable and open", () => {
  for (const entry of assessment.forecastLedger) {
    const label = `forecast ${entry.id}`;
    for (const field of ["plain", "confirms", "disconfirms"]) assert.ok(nonEmpty(entry[field]), `${label} has an empty ${field}`);
    assert.equal(entry.status, "Open", `${label} status`);
  }
});

test("calibration cases are plain and sourced", () => {
  for (const item of assessment.calibrationCases) {
    assert.ok(nonEmpty(item.plain), `calibration case "${item.case}" has no plain statement`);
    assert.ok(nonEmpty(item.url), `calibration case "${item.case}" has no url`);
  }
});

test("route evidence is labeled as winner shares and sums to the thirteen entrants", () => {
  assert.match(assessment.routeEvidence.caveat, /share of past winners/i);
  assert.equal(assessment.routeEvidence.entrantRoutes.reduce((sum, item) => sum + item.count, 0), 13);
});
