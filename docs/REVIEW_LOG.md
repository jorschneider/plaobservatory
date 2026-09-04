# Review log

This file is a readable copy of research/review-log.json. That file is the input; the build script copies it into app/data/observatory.json as `reviewLog`, and `metadata.reviewCount` records how many entries it holds. At this release there are 5 entries (app/data/observatory.json, `metadata.reviewCount`).

Each entry records who raised a concern, what the concern was, what the project did about it, which files changed, and what deliberately did not change. The site shows the same entries on its Method tab.

## REV-2026-09-A (3 September 2026)

**Source.** External subject-matter review (September 2026).

**Concern.** Analysis prose was gnomic: individually correct statements phrased so that only a specialist could follow them.

**Response.** Every judgment, research question, rule and heading now leads with a plain-English statement and, where a claim is made, one dated example from the dataset. The precise formulation is kept as a second line. A glossary defines every term of art, and a release test fails the build if a headline uses an undefined term, probability notation or a slogan contrast.

**Changed.**

- app/data/assessment.ts (plain and example fields on every headline record)
- Glossary section and inline term definitions
- tests/plain-language.test.mjs

**Not changed.**

- The documentary layer (officers, claims, sources) and its role-state vocabulary, which are already defined in the data dictionary

## REV-2026-09-B (3 September 2026)

**Source.** External subject-matter review (September 2026).

**Concern.** The site did not state how the data was collected or categorized, so a reader could not tell what was important from what was a gap.

**Response.** The collection unit is now a position. A fixed archetype of 156 principal seats and 23 bench slots across nine tiers defines the universe; every officer is mapped to a seat as holder or handler, or listed as outside the archetype with a stated reason; every seat shows its coverage state, including "no record". The method, the sources actually swept, and the parts that are not reproducible from this repository are written down in docs/COLLECTION_METHOD.md and on the Method tab.

**Changed.**

- research/positions.json
- Positions tab and coverage tiles
- docs/COLLECTION_METHOD.md
- scripts/build-v8-data.mjs

**Not changed.**

- The upstream research_v2 extraction remains outside the repository; the boundary is stated, not hidden

## REV-2026-09-C (3 September 2026)

**Source.** External subject-matter review (September 2026).

**Concern.** The research questions needed expert honing, and the headline judgment rested on a premise the reviewer judged irrelevant: that the 2026 senior-cadre training course is a hidden political re-certification gate. Products built by language models recover badly from a flawed premise.

**Response.** The re-certification premise is retired and recorded in a premise register with its status, where it was used, and the test that would revive it. The headline judgment is now derived from counts in the position board. The numeric Structural Promotion Index and its succession boards, which rested on analyst-assigned ranges with no calibration, are dropped; the empirical route evidence is kept without scores. Research questions are rewritten so each names the artifact that answers it; the eligible-loser question leads and the course-roster question is gone.

**Changed.**

- Premise register (assessment.ts)
- Research questions (assessment.ts)
- Overview headline
- Gap G13 deprioritized
- Dropped: succession boards, score model, selection regimes and scenarios, task-leader fit, causal chains, indicator engine, behavior grades, network motifs, technical-authority cases, system fitness, collection portfolio

**Not changed.**

- The course and supervision-measure sources stay in the system-source list as context; the documentary claims about them were accurate

## REV-2026-09-D (3 September 2026)

**Source.** External subject-matter review (September 2026).

**Concern.** Narrower, measurable goals would work better; for the corruption ledger, identify the last publicized appearance before a target disappears and measure the time to the first concrete sign of trouble.

**Response.** The adverse ledger now carries a disappearance clock for every record: last titled public appearance, first concrete public signal, formal action, and the day counts between them, with a collection state and a search lane where a date is still missing. Five further trackers were added on the same principle, each answering one question from a bounded set of official sources: NPC military-delegate terminations, full-general promotion ceremonies, the 20th Central Committee military cohort, high-expectancy event attendance, and principal-seat turnovers, plus a title-freshness monitor computed from the existing data.

**Changed.**

- research/adverse-timeline.json
- research/trackers/
- Ledger tab and Trackers tab

**Not changed.**

- Records without a verified date stay null; nothing is inferred to fill a cell

Note on the state of this build. At build `PLA26-V8-0715C59FF314` the clock has 8 complete, 45 partial and 10 not-yet-collected records, and three trackers are present: NPC terminations, promotion ceremonies and the title-freshness monitor (app/data/observatory.json, `metadata.ledgerClock.counts` and `metadata.trackerKeys`). The 20th Central Committee, event-attendance and seat-turnover trackers are not yet in the repository. See docs/COLLECTION_METHOD.md, section 5.

## REV-2026-09-E (3 September 2026)

**Source.** Internal data-quality check during the v8 rebuild.

**Concern.** The officer universe contained two stable IDs for one person (Zhu Xiaoqian, president of Army Engineering University).

**Response.** The duplicate record is merged into an identity hold at build time; the canonical population count is unchanged and the hold is visible in the Method tab.

**Changed.**

- research/positions.json (unmappedOfficers, duplicate_record)
- identityHeldRecords

**Not changed.**

- Nothing recorded.
