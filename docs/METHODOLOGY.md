# Methodology

This document explains how the PLA Leadership Observatory turns public records into the statements on the site. It is written for a reader who is not a specialist. Terms are defined the first time they are used. The one-line definitions come from the glossary in app/data/assessment.ts, which the site also shows.

## The problem this method is built to avoid

Analysis of Chinese military personnel goes wrong in three familiar ways. It treats a dated title as if the person still holds the job. It treats being visible as being about to be promoted. And it treats a plausible career story as if it were a probability. This site is structured to make each of those errors harder.

## The framework in one paragraph

We start from a fixed chart of the PLA's senior positions and ask, for each one, who holds it and how we know. Names enter the site only through a position. A seat we cannot fill is shown as empty, never hidden. Removed officers go to a separate ledger where we record when they were last seen with their title, the first public sign of trouble, and the formal action, and we measure the gaps. Everything else on the site is a narrow tracker that answers one question from a bounded set of official sources.

## The seven steps

These are the `framework.steps` in app/data/assessment.ts.

1. **Fix the chart first.** A working chart of the PLA's senior positions across nine tiers: the Central Military Commission, its organs, the five theaters, the four services, the Rocket Force bases, the four arms, the armed police and key districts, the thirteen group armies, and the central academies. It is a model, not an official table, and it is revised when a source shows a position we missed. This chart is called the archetype.
2. **Fill each seat only from a dated source.** A name goes into a seat only when a source names that person with the exact Chinese title on a date. The role-state label says how good that source is, from a formal appointment down to a legacy record that has not been refreshed.
3. **Record handlers separately from holders.** A holder is an officer whom a dated source names with the exact title. A handler is an officer who is seen doing a job without ever being given the title in public. Chairing a meeting or standing in a protocol position is not authority.
4. **Show every empty seat.** A seat with no public record is displayed as "no record". A seat emptied by a removal says who was removed and when. The count of empty seats is a result, not an embarrassment.
5. **Clock the removals.** For every officer in the adverse ledger we look for three dates: the last public appearance with a title, the first concrete public sign of trouble, and the formal action. The day counts between them are computed, never typed, and a missing date stays missing.
6. **Measure narrow things from bounded sources.** Each tracker answers one question from a source set you could re-read yourself: every NPC credentials report, every promotion ceremony, one Central Committee list, five recurring events, every seat that turned over.
7. **Say what each judgment rests on.** Every judgment on the Overview is computed from counts in the position board or the ledger, and lists the premises it depends on. Premises can be contested or retired, and the review log records who said what and what changed.

The mechanics of steps 1 to 5, with the counts at the current cutoff, are in docs/COLLECTION_METHOD.md.

## Evidence hierarchy

Source quality and claim scope are two different things. A claim-scoped source is a source linked to one specific field and date, with a note on what it does not establish. A URL attached to a dossier is not evidence for every field in it.

The order of preference for sources:

1. Formal Party or state decisions, appointment lists and authoritative regulations.
2. Official Chinese military, central, provincial and institutional reporting that names the person and the exact title.
3. Specialist research with transparent sourcing and reproducible reconstruction.
4. Reputable reporting, archival discovery and lower-confidence biographical aggregations, used as leads.

The source classes in the data follow this order: A1 formal Party or state decision; A2 central official or PLA source; A3 other official institutional source; B1 high-quality specialist analysis; B2 credible secondary reconstruction; C or D discovery lead.

An official source can still be insufficient. Ceremony coverage may establish a title on one date but not continuity, grade, authority or birth year. Every mapped claim records the period it can be read for and, where useful, what it does not support.

## What an observation proves

Four kinds of observation, from app/data/assessment.ts `observationClocks`:

| Observation | Proves | Does not prove |
|---|---|---|
| Formal appointment | The person held the office on the date of the act. | Current control, Party status, or freedom from inquiry. |
| Title-bearing performance | The officer did a dated duty under the exact printed title. | The original appointment date or authority beyond that observation. |
| Named appearance | Presence at a dated event, if identity is secure. | A current job, trust, exoneration or promotion. |
| High-expectancy miss | A shift in the odds, when the officer always attends, the roster is complete, peers are present and no explanation is known. | Removal, detention or guilt from one omission. |

## Reading the Chinese words

The exact Chinese wording decides what a report can be used for (app/data/assessment.ts `titleParsingRules`):

| Words | Class | Plain meaning |
|---|---|---|
| 任命 / 决定任命 / 免去 / 授予 / 晋升 | Formal act | Appointed, removed, conferred, promoted: a formal status change for the exact office or rank. |
| 主持工作 / 主持日常工作 / 代 / 代理 / 履行职责 | Acting authority | Running the work, acting, performing the duties: functional authority without the principal title. Never upgraded to the title. |
| 主持会议 / 主持仪式 | Event role only | Chaired that meeting or ceremony. Says nothing about running the organization. |
| 出席并讲话 / 参加 | Attendance | Attended, or attended and spoke: a dated appearance, not an appointment. |
| 受习主席委托 / 代表习主席和中央军委 | Delegated mission | Sent on the chairman's behalf for that mission. Not a general promotion signal. |
| 原 / 曾任 / 时任 / 负责人 / 有关领导 | Historical or anonymous | Former, once held, then serving, "the responsible official", "relevant leaders": never creates a current named record. |

## Fact, inference, speculation

- A **confirmed fact** needs a claim-scoped source that directly supports the statement at a stated date.
- A **reasonable inference** needs several observations that point the same way, plus a stated alternative explanation.
- **Speculation** must be framed as a collection target with a stated observation that would confirm it and one that would disconfirm it.

Protocol order, a photograph, chairing one event, or reappearing after an absence can narrow the possibilities. None of them alone proves an appointment, a patron, political clearance or effectiveness.

## Identity controls

A name gets a stable ID only when the English and Chinese names, institution, title, career sequence and dates are consistent enough. Pseudonyms and unresolved homonyms are held rather than entered into the directory. Two records are not merged only because the Romanized names match. Three records are held for identity reasons at this release (app/data/observatory.json, `metadata.identityHeldCount`); one of them is a duplicate found in the v8 rebuild and merged at build time.

## The adverse-event firewall

Confirmed removals, investigations and unresolved adverse watches are kept in the adverse ledger, outside the active directory. No stable ID may appear in both. Public silence is not evidence that an officer is clean. Unexplained absence is not automatically coded as a purge either.

## When an absence counts

An absence is informative only when three conditions hold: the event is one the officer's peers reliably attend, the report lists everyone who came, and the officer's peers are present. That is premise P-ABSENCE. Two calibration cases anchor the rule (app/data/assessment.ts `calibrationCases`):

- He Weidong was named at the 2024 CMC tree-planting and omitted from the complete peer enumeration at the same event on 2 April 2025. He was formally expelled among nine officers on 17 October 2025. The miss counted because the event template was identical year to year, the report listed everyone, and his peers were all there. Even so, it was a signal, not proof.
- Zhao Leji missed a high-expectancy NPC session on 11 March 2025. An official illness explanation was given and he reappeared in a titled activity the next day. An explanation plus a quick titled reappearance zeroes out an absence.

Four further cases record other lessons: Dong Jun (a press report followed by reappearance in official duties, which weakens but does not disprove an inquiry); Miao Hua (suspension, state-CMC removal and expulsion on separate dates, 211 and 323 days after the suspension); Zhang Youxia and Liu Zhenli (investigations announced 24 January 2026, state-CMC removal 216 days later, showing that the state clock lags); and a Xinhua leadership page that showed different rosters in cached and live states, which is why live pages are dated rather than cited as timeless.

## Premises

A premise is an assumption a judgment depends on. Every premise is listed with a status: held, contested or retired. A held judgment may not depend on a retired premise; this is release rule R-09 and a test enforces it. The register is `premises` in app/data/assessment.ts.

| Id | Status | Plain meaning |
|---|---|---|
| P-ARCHETYPE | held | We assume the chart of positions we drew is the set of jobs that matter. It follows the post-2016 structure and the 2024 reorganization of the arms, but it is our model. |
| P-SILENCE | held | Chinese official reporting is selective. "No record" means we could not find a dated source, not that nobody holds the job. |
| P-TITLE | held | We label someone acting only when the source uses words like 代, 代理, 主持工作, 主持日常工作 or 履行职责. Presiding over a meeting tells us they were there, not that they hold the job. |
| P-ABSENCE | held | Missing one event proves nothing. Missing an event you always attend, when the report lists everyone and your peers are all there, is a signal. |
| P-CLOCKS | held | A removed officer passes through several separate formal steps on different dates. We record each and never let one substitute for another. |
| P-DENOMINATOR | held | Knowing that most past CMC members had commanded a theater does not tell you how likely a theater commander is to reach the CMC, because we do not know how many were eligible and did not. That is why this site publishes no promotion probabilities. |
| P-SYNC | held | In the recent pattern an officer becomes a full general on the day they get a top job, so a promotion ceremony usually also tells you about an appointment. |
| P-AUDITION | contested | It is tempting to read a handler as the successor-in-waiting. The evidence so far cuts both ways, so we treat this as contested and measure it rather than assume it. Contested by the seat-turnover record: rotating bridges in the PAP sequence, and Zhang Shuguang promoted upward without converting the Army political-commissar vacancy he had covered. |
| P-RECERT | retired | The previous version of this site led with the idea that a 2026 training course for senior cadres was a secret loyalty test deciding who gets promoted. An external expert judged the course probably irrelevant, and nothing in the public record ties any appointment or removal to it. The idea is retired and is used nowhere in v8. |
| P-SPI | retired | The previous version scored named officers on a 0 to 100 index built from analyst-assigned ranges. There was no way to calibrate it, and it invited readers to see probabilities where there were none. It is dropped; the empirical route facts it drew on are kept without scores. |

Each register entry also records where the premise is used, the test that would settle it, and what would be wrong on the site if the premise were false.

## How judgments are built

The Overview carries a small number of judgments (six at this release, `judgments` in app/data/assessment.ts). Each has a plain sentence, a precise line, one dated and sourced example, a basis (counted, documented, inferred or assumed), a confidence, the premises it depends on, and a statement of what would change it. The numbers inside a judgment are tokens that the interface fills from `metadata` at render time, so a judgment cannot drift from the data it rests on. Two judgments render only when their data exists: the one on the median gaps in the disappearance clock needs complete ledger records, and the one on removals after promotion needs the promotion-ceremonies tracker. Both conditions are met at this release.

## Research questions

Six measurable questions replace the open-ended ones of earlier versions (`researchQuestions` in app/data/assessment.ts). Each names the artifact that answers it.

1. RQ-1. Which routes beat the eligible losers, not merely which routes past winners used? Artifact: a frozen list of every eligible officer at the 2012, 2017, 2022 and 2027 selection points, marked selected or not. Endorsed by the September 2026 review.
2. RQ-2. How long are senior officers publicly visible after trouble starts, and what is the first visible sign? Artifact: the disappearance clock with all three dates for every confirmed exit. Proposed by the review.
3. RQ-3. How long do vacated seats stay open, and are the officers who cover them formalized or displaced? Artifact: the seat-turnover table. Tests P-AUDITION.
4. RQ-4. Which absences are informative? Artifact: an attendance matrix for five recurring event families, 2023 to 2026, with every miss scored against what happened afterwards.
5. RQ-5. Who holds the senior seats that have no public record? Artifact: one dated source, or a dated "searched, not found" note, for every "no record" seat.
6. RQ-6. What share of officers promoted to full general since 2019 have since been removed, and after how long? Artifact: the promotion ledger joined to the adverse ledger.

## Route evidence without odds

The site keeps the facts about what past winners looked like: cohort sizes, CMC turnover by congress, the routes new CMC entrants took, and the common gates among post-2019 full-general promotions (`routeEvidence` in app/data/assessment.ts). These frequencies are the share of past winners who used a route. They are not selection odds and cannot be read as any individual's promotion probability, because the eligible losers, the officers who were eligible and not chosen, are unknown. The current purge cycle may also break the pattern. No scores are attached.

## Release rules

Ten rules are enforced by tests before a release (`releaseRules` in app/data/assessment.ts):

| Rule | Plain statement |
|---|---|
| R-01 Ledger separation | No stable ID may appear in both the active directory and the adverse ledger. |
| R-02 Position mapping | Every active officer is either mapped to a position or listed as outside the archetype with a reason. |
| R-03 Acting-language firewall | An acting label requires literal acting language in the source. |
| R-04 Clock validity | For every ledger record, the last appearance is no later than the first signal, which is no later than the formal action, and day counts equal the date differences. |
| R-05 No typed numbers | Every count and day figure on the site is computed at build from the data; none is typed into prose. |
| R-06 Absence admissibility | An absence becomes a first signal only with a complete roster, a high-expectancy event and peers present. |
| R-07 Mutable-source discipline | A live roster page is dated, not cited as timeless. |
| R-08 Plain language | Every judgment, question and rule carries a plain statement; headlines contain no probability notation, no not-equal sign, and no undefined term of art. |
| R-09 Premise accounting | Every judgment lists premises that exist in the register, and no held judgment depends on a retired premise. |
| R-10 One canonical build | The interface data, the public JSON and the CSV come from one build with one ID. |

## Update protocol

For each release:

1. Freeze a cutoff. Archive pages that can change, where lawful and practical.
2. Resolve identity before merging any record.
3. Add claim-scoped observations with dates, source modes and non-support boundaries.
4. Update research/positions.json for any new seat, holder, handler or adverse link, and research/adverse-timeline.json for any new clock date, each with a URL and the exact Chinese title.
5. Move adverse or unresolved cases through the ledger and the holds. Do not delete history.
6. Change a judgment, premise or research question in app/data/assessment.ts only after the data changed, and give it a plain sentence and a dated example.
7. Run `node scripts/build-v8-data.mjs` to regenerate the canonical JSON, the public JSON and the CSV under one build ID.
8. Run `npm test` and `npm run lint`.

## What v8 dropped and why

From the review log (research/review-log.json, entries A to D).

- The Structural Promotion Index, its score model and its succession boards. They rested on analyst-assigned ranges with no way to calibrate them, and the eligible-pool problem makes any such index unverifiable. The empirical route evidence they drew on is kept, without scores.
- The re-certification premise: the idea that the 2026 senior-cadre course and the supervision measures form a hidden gate before promotion. An external expert judged the course probably irrelevant to selection, and nothing in the public record ties any appointment or removal to it. Retired, with the test that would revive it recorded in the premise register. Gap G13 is deprioritized. The course and measure sources stay in the system-source list as context.
- Selection regimes, scenarios and seat architecture, task-leader fit, causal chains, the indicator engine, behavior-evidence grades, network motifs, technical-authority cases, system fitness, lead judgments, research frontiers, the selector funnel and the collection portfolio. All were judgments layered on top of the data rather than counts derived from it, and none survived the requirement that every statement trace to a position or a ledger record.
- Hidden feeder lanes and command dyads. Superseded by the positions table, which records the same relationships as holder and handler links on seats.
- The course-roster research question. Replaced by the disappearance-clock question, RQ-2.

## Known limits

From `limits` in app/data/assessment.ts.

- The public record does not reveal political vetting, internal evaluations, health, full promotion slates, or the eligible pool at any selection point.
- Many birth years, grade conversions and current principal appointments remain unresolved. "No record" is a statement about our sources, not about the seat.
- Chinese official reporting is selective and pages can be revised or removed. The Ministry of National Defense and CCDI sites were not reachable from the build environment used for the v8 research pass, so their releases are cited through Xinhua or 81.cn reprints where possible.
- Translation can erase the difference between principal, deputy, acting and handling authority. The exact Chinese title controls.
- The checked-in repository does not contain the upstream research_v2 extraction that produced the original officer list. That stage is described, not reproduced.

These limits are part of the result. The site is meant to show them rather than paper over them.
