import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true } });
after(async () => vite.close());
const assessment = await vite.ssrLoadModule("/app/data/assessment.ts");

// Every plain statement on the site, tagged with where it lives so a failure names the offender.
const strings = [];
const add = (where, text) => strings.push({ where, text });

add("framework.plain", assessment.framework.plain);
assessment.framework.steps.forEach((step, i) => add(`framework.steps[${i}] "${step.step}".plain`, step.plain));
for (const judgment of assessment.judgments) {
  add(`judgments[${judgment.id}].title`, judgment.title);
  add(`judgments[${judgment.id}].plain`, judgment.plain);
}
for (const premise of assessment.premises) add(`premises[${premise.id}].plain`, premise.plain);
for (const question of assessment.researchQuestions) {
  add(`researchQuestions[${question.id}].question`, question.question);
  add(`researchQuestions[${question.id}].plain`, question.plain);
}
for (const entry of assessment.glossary) add(`glossary["${entry.term}"].plain`, entry.plain);
for (const clock of assessment.observationClocks) add(`observationClocks["${clock.clock}"].plain`, clock.plain);
for (const rule of assessment.titleParsingRules) add(`titleParsingRules["${rule.cls}"].plain`, rule.plain);
for (const item of assessment.calibrationCases) add(`calibrationCases["${item.case}"].plain`, item.plain);
for (const rule of assessment.releaseRules) add(`releaseRules[${rule.id}].plain`, rule.plain);
add("routeEvidence.plain", assessment.routeEvidence.plain);
add("routeEvidence.caveat", assessment.routeEvidence.caveat);
for (const group of ["cohorts", "entrantRoutes", "conversionMatrix", "routes", "partySynchronization", "verdicts"]) {
  assessment.routeEvidence[group].forEach((row, i) => add(`routeEvidence.${group}[${i}].plain`, row.plain));
}
for (const entry of assessment.forecastLedger) add(`forecastLedger[${entry.id}].plain`, entry.plain);
assessment.limits.forEach((limit, i) => add(`limits[${i}]`, limit));

const FORBIDDEN_NOTATION = [
  ["≠", "the not-equal sign"],
  ["P(", "probability notation"],
  [" | ", "a conditional-probability bar"],
  ["—", "an em dash"],
];
const JARGON = [
  "ex-ante",
  "ex-post",
  "reverse conditional",
  "reverse-conditional",
  "risk set",
  "altitude",
  "dyad",
  "denominator",
  "conversion gate",
  "feeder",
  "non-additive",
];
const ALLOWED_TOKENS = new Set([
  "principalSeats", "formalOrDated", "vacantOrHandled", "noRecord", "acting", "stale", "conflicting",
  "adverseCount", "confirmedExits", "unresolvedWatches", "adverseVacancy", "turnoverSentence", "handled", "handlerLinks",
  "clockN", "medianSilence", "medianProcess", "minSilence", "maxSilence", "withLastAppearance",
  "mapped", "officers", "noClaims", "staleHolders", "noRecordByTier", "promoted", "promotedRemoved", "promoCeremonies", "promoMedianDays", "promoMedianYears", "promoSameDay",
]);
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wholeWord = (term) => new RegExp(`(?:^|[^\\p{L}\\p{N}_])${escapeRegExp(term)}(?=$|[^\\p{L}\\p{N}_])`, "iu");
const tokensIn = (text) => [...text.matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]);

test("collects a non-empty plain statement from every record", () => {
  assert.ok(strings.length >= 100, `expected at least 100 plain strings, collected ${strings.length}`);
  for (const { where, text } of strings) {
    assert.ok(typeof text === "string" && text.trim().length > 0, `${where} is not a non-empty string`);
  }
});

test("plain strings avoid probability notation, the not-equal sign and em dashes", () => {
  for (const { where, text } of strings) {
    for (const [needle, label] of FORBIDDEN_NOTATION) {
      assert.ok(!text.includes(needle), `${where} contains ${label} (${JSON.stringify(needle)}): ${text}`);
    }
  }
});

test("plain strings use no term of art the glossary does not define", () => {
  const defined = new Set(assessment.glossary.map((entry) => entry.term.toLowerCase()));
  const undefinedJargon = JARGON.filter((term) => !defined.has(term.toLowerCase()));
  for (const { where, text } of strings) {
    for (const term of undefinedJargon) {
      assert.ok(!wholeWord(term).test(text), `${where} uses the undefined term "${term}": ${text}`);
    }
  }
});

test("plain strings average at most 60 words per sentence", () => {
  for (const { where, text } of strings) {
    const sentences = text.split(/[.!?]/).map((sentence) => sentence.trim()).filter(Boolean);
    const words = sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).filter(Boolean).length, 0);
    const average = words / Math.max(sentences.length, 1);
    assert.ok(average <= 60, `${where} averages ${average.toFixed(1)} words per sentence: ${text}`);
  }
});

test("judgments are templated on build counts using only known tokens", () => {
  for (const judgment of assessment.judgments) {
    assert.ok(tokensIn(judgment.plain).length > 0, `judgment ${judgment.id} plain has no {token} placeholder`);
    const fields = { title: judgment.title, plain: judgment.plain, precise: judgment.precise, "example.text": judgment.example?.text ?? "", whatWouldChangeIt: judgment.whatWouldChangeIt ?? "" };
    for (const [field, text] of Object.entries(fields)) {
      for (const token of tokensIn(text)) assert.ok(ALLOWED_TOKENS.has(token), `judgment ${judgment.id} ${field} uses unknown token {${token}}`);
    }
  }
});
