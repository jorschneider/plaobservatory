import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { COVERAGE_STATES, daysBetween, deriveCoverage, parseDate } from "../scripts/lib/v8-rules.mjs";

const data = JSON.parse(
  await readFile(new URL("../app/data/observatory.json", import.meta.url), "utf8"),
);
const publicData = JSON.parse(
  await readFile(new URL("../public/data/pla-leadership-observatory-public.json", import.meta.url), "utf8"),
);

const officerIds = new Set(data.officers.map((officer) => officer.id));
const adverseIds = new Set(data.adverse.map((record) => record.id));
const positionIds = new Set(data.positions.map((position) => position.id));
const tierIds = new Set(data.positionTiers.map((tier) => tier.id));
const principalSeats = data.positions.filter((position) => !position.isBench);

const COLLECTION_STATES = ["complete", "partial", "not_yet_collected"];
const FRESHNESS_BANDS = ["undated", "within_90_days", "within_180_days", "within_365_days", "over_365_days"];
const OPTIONAL_TRACKERS = ["npcTerminations", "promotionCeremonies", "cc20Military", "eventAttendance", "seatTurnovers"];
const SECONDARY = "secondary_classification";
const hasHttpUrl = (event) => typeof event?.url === "string" && event.url.startsWith("http");

test("keeps the interface and downloadable JSON on one canonical v8 build", () => {
  assert.deepEqual(publicData, data);
  assert.equal(data.metadata.schemaVersion, 8);
  assert.match(data.metadata.buildId, /^PLA26-V8-/);
  assert.equal(data.metadata.officerCount, data.officers.length);
  assert.equal(data.metadata.sourceCount, data.sources.length);
  assert.equal(
    data.metadata.mappedPersonCount,
    data.officers.filter((officer) => officer.claims.length > 0).length,
  );
});

test("keeps the active directory and the adverse ledger disjoint", () => {
  for (const officer of data.officers) {
    assert.ok(!adverseIds.has(officer.id), `${officer.id} ${officer.nameEn} appears in both the active directory and the adverse ledger`);
  }
});

test("maps every active officer to a position or to a declared unmapped reason", () => {
  const reasons = new Set(Object.keys(data.unmappedReasons));
  let mapped = 0;
  let unmapped = 0;
  for (const officer of data.officers) {
    const label = `${officer.id} ${officer.nameEn}`;
    assert.ok(["mapped", "unmapped"].includes(officer.archetypeStatus), `${label} has archetypeStatus ${officer.archetypeStatus}`);
    if (officer.archetypeStatus === "mapped") {
      mapped += 1;
      assert.ok(Array.isArray(officer.positionIds) && officer.positionIds.length > 0, `${label} is mapped but lists no positionIds`);
      for (const id of officer.positionIds) assert.ok(positionIds.has(id), `${label} maps to unknown position ${id}`);
    } else {
      unmapped += 1;
      assert.ok(reasons.has(officer.unmappedReason), `${label} has unmappedReason ${officer.unmappedReason}, which is not a key of unmappedReasons`);
    }
  }
  assert.equal(data.metadata.mappedOfficerCount, mapped);
  assert.equal(data.metadata.unmappedOfficerCount, unmapped);
  assert.equal(data.metadata.mappedOfficerCount + data.metadata.unmappedOfficerCount, data.officers.length);
});

test("derives every position's coverage from the shared rules and links only known records", () => {
  const seen = new Set();
  for (const position of data.positions) {
    assert.ok(!seen.has(position.id), `position id ${position.id} is duplicated`);
    seen.add(position.id);
    assert.ok(COVERAGE_STATES.includes(position.coverage), `${position.id} has coverage ${position.coverage}`);
    assert.equal(position.coverage, deriveCoverage(position), `${position.id} coverage does not match deriveCoverage`);
    for (const holder of position.holders) {
      assert.ok(officerIds.has(holder.officerId), `${position.id} holder ${holder.officerId} is not an active officer`);
    }
    for (const handler of position.handlers) {
      assert.ok(officerIds.has(handler.officerId), `${position.id} handler ${handler.officerId} is not an active officer`);
    }
    for (const entry of position.adverse) {
      assert.ok(adverseIds.has(entry.adverseId), `${position.id} adverse entry ${entry.adverseId} is not in the ledger`);
    }
  }
});

test("uses every tier in the archetype and only those tiers", () => {
  const used = new Set(data.positions.map((position) => position.tier));
  for (const tier of data.positionTiers) assert.ok(used.has(tier.id), `tier ${tier.id} has no positions`);
  for (const position of data.positions) assert.ok(tierIds.has(position.tier), `${position.id} uses unknown tier ${position.tier}`);
});

test("framework and coverage counts describe the position board exactly", () => {
  assert.equal(data.metadata.framework.positionCount, data.positions.length);
  assert.equal(data.metadata.framework.principalSeatCount, principalSeats.length);
  assert.equal(
    data.metadata.positionCoverageCounts.reduce((sum, row) => sum + row.count, 0),
    data.metadata.framework.principalSeatCount,
  );
});

test("merges the duplicate Zhu Xiaoqian record into an identity hold", () => {
  assert.equal(data.officers.filter((officer) => officer.nameEn === "Zhu Xiaoqian").length, 1);
  const held = data.identityHeldRecords.find((record) => record.id === "PLA-C5F8B032573F");
  assert.ok(held, "PLA-C5F8B032573F is missing from identityHeldRecords");
  assert.equal(held.heldReason, "duplicate_record");
});

test("every adverse record carries a valid disappearance clock", () => {
  for (const record of data.adverse) {
    const label = `${record.id} ${record.nameEn}`;
    const timeline = record.timeline;
    assert.ok(timeline && typeof timeline === "object", `${label} has no timeline`);
    assert.ok(COLLECTION_STATES.includes(timeline.collectionState), `${label} has collectionState ${timeline.collectionState}`);

    const { lastPublicAppearance: last, firstConcreteSignal: first, formalAction: formal } = timeline;
    const pairs = [
      [last, first, "lastPublicAppearance -> firstConcreteSignal"],
      [first, formal, "firstConcreteSignal -> formalAction"],
    ];
    for (const [earlier, later, name] of pairs) {
      if (!earlier || !later || !parseDate(earlier.date) || !parseDate(later.date)) continue;
      assert.ok(daysBetween(earlier.date, later.date) >= 0, `${label} ${name} runs backwards (${earlier.date} -> ${later.date})`);
    }

    const officialFirst = Boolean(first) && first.kind !== SECONDARY;
    const officialFormal = Boolean(formal) && formal.kind !== SECONDARY;
    assert.equal(
      timeline.silenceDays,
      last && officialFirst ? daysBetween(last.date, first.date) : null,
      `${label} silenceDays is not the computed gap`,
    );
    assert.equal(
      timeline.processDays,
      officialFirst && officialFormal ? daysBetween(first.date, formal.date) : null,
      `${label} processDays is not the computed gap`,
    );

    if (timeline.collectionState === "complete") {
      for (const [event, name] of [[last, "lastPublicAppearance"], [first, "firstConcreteSignal"], [formal, "formalAction"]]) {
        assert.ok(event, `${label} is complete but has no ${name}`);
        assert.ok(hasHttpUrl(event), `${label} ${name} lacks an http url`);
      }
      assert.ok(officialFirst && officialFormal, `${label} is complete but rests on a secondary classification`);
    }
    if (last) {
      for (const field of ["date", "titleZh", "url", "verification"]) {
        assert.ok(last[field], `${label} lastPublicAppearance lacks ${field}`);
      }
    }
  }
  assert.equal(
    COLLECTION_STATES.reduce((sum, state) => sum + data.ledgerClock.counts[state], 0),
    data.adverse.length,
  );
});

test("title-freshness queue covers every mapped officer with a known band", () => {
  const tracker = data.trackers.titleFreshness;
  assert.ok(tracker, "titleFreshness tracker is missing");
  assert.equal(tracker.queue.length, data.metadata.mappedOfficerCount);
  for (const entry of tracker.queue) {
    assert.ok(FRESHNESS_BANDS.includes(entry.band), `${entry.officerId} ${entry.nameEn} has band ${entry.band}`);
  }
});

test("dynamic coverage language uses the live officer count", () => {
  const birthGap = data.gaps.find((gap) => gap.id === "G06");
  assert.ok(birthGap, "gap G06 is missing");
  assert.ok(
    birthGap.title.includes(`${data.metadata.officerCount} active dossiers`),
    `G06 title does not name ${data.metadata.officerCount} active dossiers: ${birthGap.title}`,
  );
});

test("keeps the Party-bypass cases in the adverse watch, not the active directory", () => {
  for (const name of ["Ding Xingnong", "Fang Yongxiang"]) {
    assert.ok(!data.officers.some((officer) => officer.nameEn === name), `${name} leaked into the active directory`);
    const record = data.adverse.find((entry) => entry.nameEn === name);
    assert.ok(record, `${name} has no adverse record`);
    assert.equal(record.controlledState, "unresolved_adverse_watch", `${name} controlledState`);
    assert.equal(record.status, "promotion-bypass-unresolved", `${name} status`);
  }
});

test("publishes the dated review log", () => {
  assert.equal(data.metadata.reviewCount, data.reviewLog.length);
  assert.ok(data.reviewLog.length >= 4, `expected at least 4 review entries, found ${data.reviewLog.length}`);
});

test("optional trackers, when present, carry a summary and valid derived numbers", (t) => {
  assert.deepEqual(data.metadata.trackerKeys, Object.keys(data.trackers).sort());
  const present = OPTIONAL_TRACKERS.filter((key) => data.trackers[key]);
  t.diagnostic(`optional trackers present: ${present.length ? present.join(", ") : "none"}`);
  for (const key of present) {
    const tracker = data.trackers[key];
    assert.ok(tracker.summary && typeof tracker.summary === "object", `${key} tracker has no summary`);
    if (key === "seatTurnovers") {
      for (const turnover of tracker.turnovers) {
        assert.ok(
          turnover.daysOpen === null || (typeof turnover.daysOpen === "number" && turnover.daysOpen >= 0),
          `seatTurnovers ${turnover.positionId} has daysOpen ${turnover.daysOpen}`,
        );
      }
    }
    if (key === "eventAttendance") {
      assert.equal(tracker.summary.misses, tracker.misses.length, "eventAttendance summary.misses does not match misses.length");
    }
  }
});
