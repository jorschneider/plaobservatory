# Collection method

This document explains how the PLA Leadership Observatory collects its data and how it labels what it finds. It is written for a reader who is not a China specialist. Every number comes from the checked-in data. The file a number comes from is named in parentheses the first time it appears.

The release described here has a data cutoff of 2 September 2026 and the build ID `PLA26-V8-0715C59FF314` (app/data/observatory.json, `metadata`). Rerunning the build on the same inputs gives the same ID.

## 1. The unit of collection is a position, not a name

A position is a job on a chart, such as "Eastern Theater commander". The site collects positions first and people second.

Here is why. If you start from names, you find only the people who appear in the news. You cannot tell whether a missing person is unimportant or simply unreported. If you start from a fixed list of jobs, every job you cannot fill is visible as a gap. The number of gaps is then a result, not an accident of what happened to be published.

So a name enters the site only through a position. A seat we cannot fill is shown as empty, never hidden. The one-paragraph statement of this method is the `framework` text in app/data/assessment.ts, and it is repeated on the Method tab of the site.

## 2. The archetype: nine tiers

The archetype is our chart of the PLA's senior positions. It is a model, not an official table. The PLA does not publish such a table. The chart follows the structure in place since the 2016 reforms and the April 2024 reorganization of the arms. It is revised when a source shows a position we missed. The current chart is version `v8.0` (research/positions.json, `archetypeVersion`).

The chart has 179 positions in nine tiers (app/data/observatory.json, `metadata.framework`). A tier is one layer of the command structure, from the Central Military Commission at the top down to the academies.

Positions come in two kinds.

- A principal seat has one occupant. It heads an organization or is a fixed seat on a commission: commander, political commissar, chief of staff, department director, commission member. There are 156 principal seats.
- A bench slot holds several deputies at once, for example the deputy commanders of a theater. There are 23 bench slots. A bench slot has `seats: 0` in the data because we do not fix how many deputies it holds.

| Tier id | Tier | Positions | Principal seats | Bench slots |
|---|---|---:|---:|---:|
| `cmc` | Central Military Commission and Ministry of National Defense | 10 | 8 | 2 |
| `cmc_organs` | CMC organs | 27 | 22 | 5 |
| `theaters` | Theater commands | 38 | 33 | 5 |
| `services` | Services | 28 | 22 | 6 |
| `rocket_bases` | Rocket Force bases | 18 | 18 | 0 |
| `arms` | Arms | 10 | 9 | 1 |
| `pap` | People's Armed Police, Coast Guard and key garrisons | 14 | 12 | 2 |
| `group_armies` | Group armies | 26 | 26 | 0 |
| `academies` | Academies and research | 8 | 6 | 2 |
| Total | | 179 | 156 | 23 |

Counts are from app/data/observatory.json, `metadata.positionTierCounts`. Bench slots are positions minus principal seats.

What each tier holds, in plain words (research/positions.json, `tiers[].plain`):

- Central Military Commission and Ministry of National Defense. The top of the system: the chairman, vice chairmen and ordinary members of the Party's military commission, plus the defense minister, who is a state official rather than a commander.
- CMC organs. The fifteen departments, commissions and offices that work directly for the commission, plus the joint operations command centre and the central guard bureau.
- Theater commands. The five joint theater commands. Each has a commander, a political commissar, a chief of staff and a political-work director, and a service component for the Army, Navy and Air Force where one exists.
- Services. The Army, Navy, Air Force and Rocket Force headquarters: commander, political commissar, chief of staff, political-work director, discipline secretary, and the deputies bench.
- Rocket Force bases. The nine numbered Rocket Force bases (61 to 69). These are the missile force's operational and support formations and are almost entirely invisible in public sources after the purge.
- Arms. The four arms created or reorganized in 2024: Aerospace Force, Cyberspace Force, Information Support Force and Joint Logistic Support Force.
- People's Armed Police, Coast Guard and key garrisons. The paramilitary police and coast guard headquarters, and the three ground-force districts that matter most for the capital and the western frontier.
- Group armies. The thirteen numbered group armies (71st to 83rd), the corps-level commands that feed theater and Army leadership.
- Academies and research. The three central academies and the service universities. Leadership here is well documented on institution websites but is a training ecosystem, not a command ladder.

Each position record carries an English and a Chinese name for the organization and the job, a grade band, the lists of holders, handlers and linked adverse records, an optional external holder, a note, and a search lane. A grade band is the rank of the job rather than of the person, for example "Theater-leader grade". A search lane says where we would look next for that seat, for example "Provincial and municipal civil-military reports; 81.cn unit coverage".

One seat, the CMC chairman, has an external holder. Xi Jinping is a civilian Party leader, not an officer, so he is named on the seat but has no officer dossier.

## 3. How a name enters a seat, and how it leaves

### Entering a seat

A name goes into a seat only when a dated source names that person with the exact Chinese title. "Dated" means the source has a publication date or an event date. "Exact Chinese title" means the printed Chinese words, for example 参谋长 (chief of staff), not a translation or a paraphrase. Translation can erase the difference between a principal, a deputy, an acting officer and someone merely running the work, so the Chinese text controls.

Every officer dossier carries a role state. A role state says how good the source for the officer's displayed title is. There are seven, from best to worst:

| Role state | Plain meaning |
|---|---|
| `formal_current` | A formal appointment or promotion decision, or repeated official naming with a matching rank, supports the title now. |
| `official_title_with_scope_caveat` | An official source gave the title on a date, but continuity or exact authority after that date is not established. |
| `acting_role_mixture` | The source uses acting language, or the evidence mixes acting and principal authority. |
| `inferred_current` | Several observations point to the role, but no clean appointment act was found. |
| `conflicting_current` | Credible sources disagree about who holds the role or whether it continues. |
| `legacy_unverified` | An older record gives the title and has not been refreshed. |
| `stale_or_unknown` | The evidence is too old or too thin to say what the officer does now. |

The full definitions are in docs/DATA_DICTIONARY.md.

Holders and handlers are different things. A holder is an officer whom a dated source names with the exact title of a position. A handler is an officer seen doing a position's work, such as presiding over its meetings, without ever being named with the title. Handlers are recorded in a separate list on the position and are never counted as holders. Chairing a meeting or standing in a protocol position is not authority.

An acting label is allowed only when the source uses literal acting words: 代, 代理, 主持工作, 主持日常工作 or 履行职责. Without those words, an officer seen running things is a handler.

The mapping from officers to positions lives in research/positions.json. Each position lists `holderIds` and `handlerIds`, which are stable officer IDs. The build script copies these links onto each officer as `positionIds`, `positionRoles` and `archetypeStatus`. At this release the chart records 134 holder links and 17 handler links (research/positions.json, sums of `holderIds` and `handlerIds` over all positions). An officer can be linked to more than one position, for example a department director who also appears on the deputies bench.

### Leaving a seat

A name leaves a seat in one of three ways.

1. Removal. When an officer is investigated, suspended, removed, expelled, reported missing or passed over, the record moves to the adverse ledger. The adverse ledger is a separate list of removed and troubled officers. No stable ID may appear in both the active directory and the ledger; this is release rule R-01 in app/data/assessment.ts. The position keeps a link to the ledger record in `adverseIds`, so the seat shows who was removed and when. The ledger holds 63 records: 54 confirmed exits and 9 unresolved adverse watches (app/data/observatory.json, `metadata.adverseCount` and `adverse[].controlledState`). Sixty-two come from the checked-in base and research/adverse-timeline.json; one was discovered by a tracker and comes from research/adverse-additions.json. An unresolved adverse watch is a record where trouble is reported but no official action has been published, for example an officer missing from view or passed over in a Party vote.
2. Identity hold. A record is moved out of the active directory when the person cannot be securely identified, or when two records turn out to be one person. Three records are held this way (app/data/observatory.json, `metadata.identityHeldCount`). One of the three is a duplicate found during the v8 rebuild and merged at build time (research/review-log.json, entry REV-2026-09-E).
3. Transfer without a known destination. An officer known to have moved, whose new post has not been published, stays in the directory but is listed as outside the archetype with the reason `transfer_destination_undisclosed`.

Nothing is deleted. Held and adverse records keep their stable IDs so that corrections can be traced across releases.

## 4. How coverage states are derived

A coverage state is what the public record supports for a seat. It is computed by one function, `deriveCoverage` in scripts/lib/v8-rules.mjs, from the seat's holders, handlers, adverse links and external holder. Nobody types a coverage state by hand. The rule, in words and in the order it is applied:

1. If the seat has at least one recorded holder:
   - If any holder's role state is `conflicting_current`, or the position is a one-seat principal seat with more than one holder, the state is **conflicting**.
   - Otherwise, if any holder is `formal_current`, the state is **formal_current**.
   - Otherwise, if any holder is `official_title_with_scope_caveat`, the state is **dated_official**.
   - Otherwise, if any holder is `acting_role_mixture` or `inferred_current`, the state is **acting_or_inferred**.
   - Otherwise every holder is `legacy_unverified` or `stale_or_unknown`, and the state is **stale**.
2. If there are no holders but at least one handler, the state is **handled_without_title**.
3. If there are no holders and no handlers but at least one linked adverse record, the state is **adverse_vacancy** when any linked record is a confirmed exit, and **held_in_adverse_watch** otherwise.
4. If none of the above applies but the seat has an external holder, the state is **external**.
5. Otherwise the state is **no_record**.

Two consequences follow. A holder always outranks a handler or an adverse link, so a seat that has been refilled shows its new holder's state rather than the old vacancy. And the best holder wins within a seat: one formal appointment outranks several stale records.

The build also stores `freshestTitleDays` on each seat: the smallest number of days between the cutoff and any holder's last titled appearance, or null when no holder has a usable date.

## 5. What was actually swept for v8

### The research passes

Six passes were defined for v8. Each answers one question from a source set you could re-read yourself.

1. Last public appearance for confirmed exits. For each confirmed exit, find the last dated report naming the officer with the exact title before the first sign of trouble. The place to look is recorded on each ledger record as `searchLane` in research/adverse-timeline.json, for example "Xinhua / 81.cn / CCTV naming the officer with exact title in 2024 to 2025; Xinhua leadership event rosters". The result goes into `lastPublicAppearance` on that record.
2. NPC credential reports. Every National People's Congress Standing Committee credentials report that terminated a military deputy. Result file: research/trackers/npc-terminations.json.
3. Promotion ceremonies. Every Xinhua report of a full-general promotion ceremony (中央军委晋升上将军衔仪式) since December 2019. Result file: research/trackers/promotion-ceremonies.json.
4. The 20th Central Committee list. The military full members and alternates named in the 2022 First Plenum communiqué, each marked with their status today. Result file: research/trackers/cc20-military.json.
5. Five recurring event families. CMC tree-planting, the 1 August reception, the NPC military delegation, plenums and promotion ceremonies, from 2023 to 2026, with a flag on each report saying whether it lists everyone who attended. Result file: research/trackers/event-attendance.json.
6. Seat turnovers. Every principal seat that turned over since 2023, with the predecessor's exit date, the successor's appointment date, and what happened to any handler in between. Result file: research/trackers/seat-turnovers.json.

The build script reads the five tracker files if they exist and skips them if they do not (scripts/build-v8-data.mjs, `readOptional`). It also reads research/adverse-additions.json if it exists. That file holds removals discovered by a tracker that were not in the earlier ledger. Each such record must carry the official notice that established the removal, and the build refuses it if the ID or the Chinese name matches an active officer.

One join runs before the day counts are computed. For every military deputy in the NPC-terminations tracker whose exact Chinese name matches a ledger record, the build writes an `npc_seat_revoked` event with the report's date and URL. It becomes the record's formal action when the record has none, or has only a secondary classification. A secondary classification is a specialist research label without a dated official notice in this repository. If the record already has an official formal action on a different date, the event goes into `intermediateActions` instead. This is why the built ledger shows more `npc_seat_revoked` formal actions than the research file does: 38 against 26 (app/data/observatory.json, `adverse[].timeline.formalAction.kind`; research/adverse-timeline.json, `records[].formalAction.kind`).

### Fetch limits

From the build environment used for the v8 research pass, these hosts were reachable: news.cn, xinhuanet.com, 81.cn and zh.wikipedia.org. Two official hosts were not reachable: the Ministry of National Defense site (mod.gov.cn) and the Party discipline commission site (ccdi.gov.cn). Their releases are therefore cited through Xinhua or 81.cn reprints where possible (app/data/assessment.ts, `limits`). Older mod.gov.cn URLs already in the documentary layer are kept as recorded.

### What is in this build

This should be read plainly.

- The disappearance clock. Of the 63 ledger records, 18 are complete, 36 are partial and 9 are not yet collected (app/data/observatory.json, `metadata.ledgerClock.counts`). Complete means all three dates are present and official. Partial means at least one of the three is present and official; most partial records have only the formal action, because the NPC join supplied it. Twenty-one records have a verified last public appearance with the exact Chinese title, the event, the URL and a verification level (research/adverse-timeline.json, `records[].lastPublicAppearance`). Over the 18 complete records the median gap from last appearance to first concrete signal is 292 days (range 14 to 825), and over the 22 records with an official first signal and an official formal action the median gap from first signal to formal action is 194 days (range 0 to 861) (`metadata.ledgerClock.silence` and `.process`). The last-appearance research pass reached 22 of the 53 confirmed exits before the session budget ran out; the 31 unresearched records are listed in their `searchLane` notes and are the first item of follow-up work.
- Trackers. Two of the five research trackers are in this build, plus the title-freshness monitor: `metadata.trackerKeys` is `npcTerminations`, `promotionCeremonies` and `titleFreshness`. The NPC-terminations tracker covers 19 NPC Standing Committee sessions and 46 terminated military deputies. All 46 match a ledger record by exact Chinese name; 0 match an active officer and 0 are unmatched. By year: 9 in 2023, 5 in 2024, 13 in 2025 and 19 in 2026 (app/data/observatory.json, `trackers.npcTerminations.summary`). The promotion-ceremonies tracker covers 16 ceremonies since December 2019 and 44 promoted officers. Of those, 24 are now on the adverse ledger and 34 took a new job on the day of the ceremony. Among the removed, the median gap from the ceremony to the first concrete signal is 1,472 days (`trackers.promotionCeremonies.summary`). The three other tracker files, for the 20th Central Committee list, event attendance and seat turnovers, are not yet in research/trackers, so their counts are not yet computed. When the files are added, the build picks them up without any code change.
- Discovered removals. The NPC sweep found one removed officer who was not in the earlier ledger: Sun Bin, former auditor general of the CMC Audit Office. He is recorded in research/adverse-additions.json with the credentials report that established the removal (1 record, `discoveredBy` set to `tracker:npcTerminations`). The build merges him into the ledger and links him to the auditor-general seat (POS-ORG-AUD-DIR), which is now an adverse vacancy. This is why the built ledger has 63 records while research/adverse-timeline.json has 62.
- What each tracker file records about its own sweep. Every session or ceremony carries a `verification` field saying whether the page was fetched and read. Each file also carries `gaps`, which say what could not be found and why, and a `searchLog`, which says what was tried. The gaps are candid. For example, the credentials-committee report for the 28 August 2026 NPC session, which covers four senior removals, could not be located, so the stated reasons for those four are blank (research/trackers/npc-terminations.json, `gaps`).

## 6. What is not reproducible from this repository

The original officer list came from an upstream extraction called research_v2. That package is not in this repository. The build starts from research/base/observatory-v7.json, which is the checked-in result of that stage. Everything after that point can be rerun from the files in this repository. The research_v2 stage is described, not reproduced (app/data/assessment.ts, `limits`).

## 7. Coverage at the cutoff

### By coverage state

These counts cover the 156 principal seats only. Bench slots are not counted (app/data/observatory.json, `metadata.positionCoverageCounts`).

| Coverage state | Seats | Plain meaning |
|---|---:|---|
| `no_record` | 55 | We found no dated source naming anyone in the seat. It does not mean the seat is empty. |
| `acting_or_inferred` | 22 | The holder's title rests on acting language or on inference, with no clean appointment act. |
| `stale` | 22 | The only holders on record have an old or unrefreshed title, so we do not treat the seat as currently filled by them. |
| `adverse_vacancy` | 19 | The last known holder was removed and no successor has been publicly named. |
| `handled_without_title` | 14 | Nobody is recorded with the title, but an officer is seen doing the work. |
| `formal_current` | 10 | A formal appointment, or repeated official naming with a matching rank, supports the holder now. |
| `dated_official` | 9 | An official source gave the holder's title on a date; continuity after that date is not established. |
| `conflicting` | 3 | Credible sources disagree about who holds the seat, or a one-seat position has more than one recorded holder. |
| `external` | 1 | The seat is held by someone outside the officer dossiers (the CMC chairman). |
| `held_in_adverse_watch` | 1 | The last known holder is under an unresolved adverse watch and no formal action has been published. |
| Total | 156 | |

### By tier

Principal seats only (app/data/observatory.json, `metadata.positionTierCounts[].coverage`). Column headings are shortened: Formal is `formal_current`, Dated is `dated_official`, Acting is `acting_or_inferred`, Handled is `handled_without_title`, Vacancy is `adverse_vacancy`, Watch is `held_in_adverse_watch`.

| Tier | Seats | Formal | Dated | Acting | Stale | Conflicting | Handled | Vacancy | Watch | External | No record |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CMC and MND | 8 | 2 | 0 | 0 | 0 | 0 | 0 | 4 | 0 | 1 | 1 |
| CMC organs | 22 | 2 | 0 | 2 | 2 | 0 | 2 | 6 | 0 | 0 | 8 |
| Theater commands | 33 | 3 | 4 | 4 | 5 | 0 | 3 | 2 | 1 | 0 | 11 |
| Services | 22 | 1 | 1 | 7 | 1 | 0 | 7 | 1 | 0 | 0 | 4 |
| Rocket Force bases | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 17 |
| Arms | 9 | 1 | 0 | 1 | 0 | 3 | 0 | 4 | 0 | 0 | 0 |
| PAP, Coast Guard, garrisons | 12 | 0 | 2 | 5 | 0 | 0 | 2 | 0 | 0 | 0 | 3 |
| Group armies | 26 | 0 | 0 | 3 | 14 | 0 | 0 | 1 | 0 | 0 | 8 |
| Academies and research | 6 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Total | 156 | 10 | 9 | 22 | 22 | 3 | 14 | 19 | 1 | 1 | 55 |

Two things stand out. The Rocket Force bases are almost entirely blank: 17 of 18 seats have no record. And the group armies are mostly stale: 14 of 26 seats rest on records that have not been refreshed.

A title-freshness monitor is also computed at build. It counts, for the 131 mapped officers, how many days have passed since each was last named with the title. At this build 47 have no usable date, 25 were last named more than 365 days before the cutoff, 26 within 365 days, 6 within 180 days and 27 within 90 days. Of the 66 principal seats with at least one holder, 14 have a holder named within the last 180 days (app/data/observatory.json, `trackers.titleFreshness.summary`).

## 8. Officers outside the archetype

The dataset has 150 active officer dossiers. Of these, 131 map to at least one position and 19 do not (app/data/observatory.json, `metadata.mappedOfficerCount` and `metadata.unmappedOfficerCount`). Every unmapped officer must carry a reason, or the build fails.

The reasons and their counts (research/positions.json, `unmappedReasons` and `unmappedOfficers`):

| Reason | Officers | Plain meaning |
|---|---:|---|
| `billet_unknown` | 8 | No defensible current job could be found in public sources. |
| `academic_or_research` | 6 | A technical, research or teaching post, not a command or political-work ladder. |
| `platform_or_unit_level` | 4 | A ship, formation or base post, below the level of the archetype. |
| `transfer_destination_undisclosed` | 1 | Known to have moved; the destination was not published. |
| `duplicate_record` | 1 | Two stable IDs for one person. Merged into an identity hold at build, so this record is not among the 19 unmapped active officers. |

The 20 entries in `unmappedOfficers` therefore account for the 19 unmapped active officers plus the one merged duplicate.

## 9. How to rerun

```bash
node scripts/build-v8-data.mjs
npm test
```

The first command reads research/base/observatory-v7.json, research/positions.json, research/adverse-timeline.json, research/review-log.json, research/adverse-additions.json if present, and any tracker files in research/trackers, then writes app/data/observatory.json, public/data/pla-leadership-observatory-public.json and public/data/pla-leadership-observatory-public.csv. It prints the build ID, the coverage counts and the ledger-clock counts.

The second command builds the site and then runs every file matching tests/*.test.mjs (package.json, `scripts.test`). The build ID is the first twelve characters, in upper case, of a SHA-256 hash over the cutoff, every position's coverage and holders, every adverse record's state and last-appearance date, every officer's role state and title date, the tracker keys, and the gap statuses. Any change to those inputs changes the ID.

## 10. How to extend the archetype

Edit research/positions.json. Do not edit app/data/observatory.json or the files under public/data; they are generated.

- To add a position, add an object to `positions` with an `id`, a `tier` from the nine tier ids, `organization`, `organizationZh`, `position`, `positionZh`, `gradeBand`, `seats` (1 for a principal seat, 0 for a bench slot), `holderIds`, `handlerIds`, `adverseIds`, `externalHolder` (or null), `note` and `searchLane`.
- To put an officer in a seat, add the officer's stable ID to `holderIds` or `handlerIds`. The officer's role state comes from the dossier, not from the position.
- To link a removed officer to a seat, add the adverse record's stable ID to `adverseIds`.
- To list an officer as outside the archetype, add an entry to `unmappedOfficers` with `officerId`, `nameEn`, a `reason` from `unmappedReasons` and a `note`.
- To add a removal that a tracker discovered and that is not in the earlier ledger, add a record to research/adverse-additions.json with the fields of an adverse record, a `discoveredBy` label, and a `formalAction` carrying the official notice.
- To add tracker rows, edit the relevant file under research/trackers. Names are matched to the dataset by exact Chinese name, so use the name as printed.

The build refuses to run in four cases. A position that names an officer ID that does not exist. A position that names an adverse ID that does not exist. An active officer who is neither linked to a position nor listed in `unmappedOfficers`. An adverse addition whose ID or Chinese name matches an active officer. Every adverse record must also have an entry in research/adverse-timeline.json, or the build stops; an addition without one gets an empty entry with its formal action and search lane. These checks are how the site keeps the promise that every officer is either on the chart or explained.
