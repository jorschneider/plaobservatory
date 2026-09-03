# Data dictionary

The canonical dataset is `app/data/observatory.json`. The public JSON download is an indented copy of the same object. The CSV is a narrower table with one row per active officer, for people who want a flat file.

All three files come from one run of `node scripts/build-v8-data.mjs` and share one build ID. The inputs are the files under `research/`. Do not edit the generated files by hand.

This release: schema version 8, data cutoff 2 September 2026, build `PLA26-V8-14E18B4FCE64` (app/data/observatory.json, `metadata`). Counts quoted below are from that build and name the field they come from.

## Reading rules

- `null`, `unknown` and missing values are not evidence of absence.
- A dated title proves an observation on that date. It does not prove the person still holds the job.
- A source attached to an officer does not support every field in that officer's dossier. Use the claim record and its scope.
- English titles are aids. The exact Chinese title controls any dispute.
- A person's absence from one event is not adverse evidence on its own.

## Root collections

| Key | One record is | Meaning |
|---|---|---|
| `metadata` | the release | Cutoff, build ID, counts and coverage diagnostics. See "Metadata" below. |
| `officers` | a person | Active officer dossiers. 150 at this release (`metadata.officerCount`). Nobody on the adverse ledger or in a hold appears here. |
| `identityHeldRecords` | a person candidate | Records kept out of the active directory because the person cannot be securely identified, or because two records were one person. 3 at this release (`metadata.identityHeldCount`). |
| `adverseHeldRecords` | a person candidate | Records kept out because their adverse status is unresolved. 1 at this release (`metadata.adverseHeldCount`). |
| `claims` | a claim | One dated observation that supports or contradicts one field, linked to one source. |
| `sources` | a source | A person-level document with its quality and scope labels. 301 at this release (`metadata.sourceCount`). |
| `adverse` | a removed or troubled officer | The adverse ledger. 63 records (`metadata.adverseCount`). Each carries a `timeline`, the disappearance clock. A record discovered by a tracker also carries `discoveredBy`. |
| `gaps` | a collection question | Missing evidence, with a search lane and things not to assume. 18 at this release (`metadata.gapCount`). |
| `systemSources` | an institutional source | Rules and regulations about the selection system. |
| `contextSources` | a contextual source | Events that shape the reading but do not validate person-level fields. |
| `pipelineSources` | a pathway source | Evidence about feeder systems. Never a named appointment claim. |
| `positions` | a position | The archetype: 179 positions (`metadata.framework.positionCount`), each with holders, handlers, adverse links and a coverage state. |
| `positionTiers` | a tier | The nine tiers of the archetype, with labels in English and Chinese and a plain description. |
| `unmappedReasons` | a reason code | The allowed reasons an officer can be outside the archetype, with a one-line meaning each. |
| `signalKinds` | a signal kind | The allowed kinds of date on the disappearance clock, with a one-line meaning each. |
| `ledgerClock` | the ledger summary | Counts and medians for the disappearance clock. Also copied into `metadata.ledgerClock`. |
| `trackers` | a tracker | Narrow measurements, one question each. Keyed by tracker name. See "Trackers". |
| `reviewLog` | a review entry | Dated review entries, copied from research/review-log.json. Rendered in docs/REVIEW_LOG.md. |

## Metadata

Fields kept from earlier releases: `title`, `asOf` (the cutoff), `buildId`, `officerCount`, `canonicalOfficerCount` (active plus held), `identityHeldCount`, `adverseHeldCount`, `confirmedClaimCount`, `sourceCount`, `primaryOfficialSourceCount`, `supplementalClaimCount`, `supplementalPersonCount`, `supplementalNewEntityCount`, `pipelineSourceCount`, `sourceFamilyCounts`, `gapCount`, `adverseCount`, `birthYearKnownCount`, `mappedPersonCount`, `currentRoleMappedCount`, `undatedTitleCount`, `olderTitleCount`, `discoveryOnlySourceCount`, `unscopedSourceCount`, `roleStateCounts`, `branchCounts`, `editorialNote`.

One warning. `mappedPersonCount` is the number of officers with at least one claim (61 at this release). It is not the number of officers mapped to a position. That number is `mappedOfficerCount`.

Fields added in schema version 8:

| Field | Type | Meaning |
|---|---|---|
| `schemaVersion` | integer | 8 for this data model. |
| `framework` | object | `unit` ("position"), `archetypeVersion` ("v8.0"), `tierCount` (9), `positionCount` (179), `principalSeatCount` (156), `benchSlotCount` (23). |
| `mappedOfficerCount` | integer | Active officers linked to at least one position as holder or handler. 131 at this release. |
| `unmappedOfficerCount` | integer | Active officers with no position link and a stated reason. 19 at this release. |
| `positionCoverageCounts` | array of `{state, count}` | Coverage states over principal seats only, sorted by count. Bench slots are excluded. |
| `positionTierCounts` | array | One entry per tier: `tier`, `label`, `positions`, `principalSeats`, and `coverage`, an object with a count for every coverage state over that tier's principal seats. |
| `ledgerClock` | object | Same object as the root `ledgerClock`. See below. |
| `trackerKeys` | string[] | Names of the trackers present in this build, sorted. `["npcTerminations", "promotionCeremonies", "titleFreshness"]` at this release. |
| `reviewCount` | integer | Number of review-log entries. 5 at this release. |

## Officer fields

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable person ID. Use this, not the English spelling of the name. |
| `nameEn`, `nameZh` | string | Romanized and Chinese names as published. |
| `identityNote` | string or null | Identity caveat or disambiguation note. |
| `branch` | controlled string | Broad institutional family used for filtering. Can differ from service origin. |
| `institution` | string | The most relevant current or assessed organization. |
| `serviceOrigin`, `serviceOriginDetail` | string | Career-origin classification and supporting detail. |
| `billet` | string | Best current or recent job description. Always read with `roleState` and the date fields. |
| `rank` | string | Reported military rank. Not proof of grade or of a current job. |
| `roleState` | controlled string | How good the source for the displayed title is. See "Role states". |
| `roleStateDetail` | string | A sentence qualifying the role state. |
| `lastReliableTitleDate` | date string or "unknown" | Latest date on which a source reliably attached the displayed title to the person. May be a full date, a month, or a year. |
| `assessmentAsOf` | date | The cutoff at which the dossier was evaluated. |
| `birthYear` | integer or null | Set only when the evidence clears the publication threshold. |
| `birthPrecision`, `birthEvidence` | string | Precision and caveat for the birth record. |
| `partyStatus`, `stateCmcStatus`, `npcStatus` | string | Separate public political and state records. Unknown is not negative evidence. |
| `disciplineState`, `disciplineNote` | string | Relationship to the adverse ledger, and the caution required. |
| `evidence` | object | Grade and counts for the current-role evidence. See "Evidence object". |
| `signals` | object | Machine-readable flags used by the interface: `appointmentRecord`, `titleFreshness`, `currentRoleSource`, `rankRecord`, `partyRecord`, `stateCmcRecord`, `npcRecord`, `birthRecord`, `primaryMappedClaims`, `openGapCount`. |
| `sourceCount` | integer | Number of linked sources. Not a strength score. |
| `sources` | source[] | Sources linked to the dossier, each with a scope. |
| `claims` | claim[] | Claims mapped directly to the person. |
| `gapIds` | string[] | Collection questions connected to this person. |

Fields added in schema version 8:

| Field | Type | Meaning |
|---|---|---|
| `positionIds` | string[] | IDs of the positions this officer is linked to. Empty when unmapped. |
| `positionRoles` | array of `{positionId, role}` | The same links with the role: `holder` or `handler`. |
| `archetypeStatus` | `mapped` or `unmapped` | Whether the officer is linked to at least one position. |
| `unmappedReason` | string or null | A key from `unmappedReasons`. Set only when unmapped. The build fails if an unmapped officer has no reason. |
| `unmappedNote` | string or null | A sentence explaining the reason for this officer. |
| `daysSinceTitle` | integer or null | Days from `lastReliableTitleDate` to the cutoff. A month or year date is resolved to its last day before subtraction. Null when the date is unknown. |

## Role states

Counts are from `metadata.roleStateCounts` at this release.

| State | Officers | Meaning | Permitted reading |
|---|---:|---|---|
| `formal_current` | 22 | A formal or repeated current appointment is directly supported. | Treat the role as current at the cutoff, within the cited scope. |
| `official_title_with_scope_caveat` | 33 | An official source gives the title, but continuity or exact authority is bounded. | A dated official observation, not permanent incumbency. |
| `acting_role_mixture` | 12 | Evidence points to acting, work-handling or mixed authority. | Formalization is the next thing to watch for. |
| `inferred_current` | 28 | Several observations support the role, but no clean appointment act was found. | An inference, never a confirmed appointment. |
| `conflicting_current` | 4 | Credible evidence conflicts about who holds the role or whether it continues. | Keep the conflict. Do not resolve it by recency or prominence. |
| `legacy_unverified` | 38 | A historical role is reported and has not been refreshed. | Not current incumbency. |
| `stale_or_unknown` | 13 | Public evidence is too old or thin to establish the displayed status. | A collection target. |

## Evidence object

| Field | Meaning |
|---|---|
| `grade` | Editorial evidence band for the displayed current-role statement. |
| `label` | Short reason for the grade. |
| `caveat` | What the evidence does not establish. |
| `mappedClaims` | Number of claims mapped to the dossier. |
| `primaryMappedClaims` | Number of those claims that use a qualifying primary source. |
| `currentRoleMapped` | Whether at least one source is mapped specifically to the current-role field. |

An evidence grade is not a promotion score. A well-documented officer can have a weak career route, and an important officer can be poorly documented.

## Claim fields

| Field | Meaning |
|---|---|
| `id` | Stable claim ID. |
| `field` | The dossier field or statement being supported. |
| `value` | The value the source supports. |
| `type` | Fact, historical observation, inference-supporting observation, or another scoped class. |
| `support` | Whether the source supports or contradicts the statement. |
| `observedAt` | Date of the observation or event. |
| `sourceId`, `sourceUrl` | Link to the source record and the original page. |
| `sourceClass`, `sourceMode` | Quality and extraction labels. See "Source fields". |
| `sourceDate`, `publisher` | Source metadata. |
| `temporalScope` | The period for which the source can be read safely. |
| `doesNotSupport` | An inference the source cannot bear, stated explicitly. |

## Source fields

A source record has `id`, `url`, `class`, `family`, `date`, `publisher`, `scopes`, `people` and `mode`.

- `family` is one of: official primary, formal decision, specialist research, or discovery and other.
- `class` is the source-quality label: A1 formal Party or state decision; A2 central official or PLA source; A3 other official institutional source; B1 high-quality specialist analysis; B2 credible secondary reconstruction; C or D discovery lead.
- `mode` says how the information was taken from the source: direct title text, a formal list, a secondary reconstruction, a discovery-only link, or another form.
- `scopes` (or a dossier-level `scope`) names the exact statement the source supports.

A URL in `sources` is not global validation of a dossier. Use the claim record and its scope.

## Adverse records

The active directory and the adverse ledger are mutually exclusive by stable ID. Each record has `id`, `nameEn`, `nameZh`, `formerBranch`, `formerRole`, `status`, `controlledState`, `date`, `summary`, `evidenceConfidence`, `sources` and `timeline`. Records come from the v7 base, plus any in research/adverse-additions.json, which holds removals discovered by a tracker; those carry `discoveredBy` (for example `tracker:npcTerminations`) and the official notice that established the removal.

- `controlledState` is `confirmed_exit` (54 at this release) or `unresolved_adverse_watch` (9) (app/data/observatory.json, `adverse[].controlledState`).
- `status` is the public description, for example "confirmed removed", "investigated", "missing-potential" or "promotion-bypass-unresolved".
- `date` is the ledger date, the date the record was entered on the basis of a public act or report.

### The `timeline` object (disappearance clock)

Source: research/adverse-timeline.json. Day counts are computed by the build, never typed.

| Field | Type | Meaning |
|---|---|---|
| `lastPublicAppearance` | date entry or null | The last dated report naming the officer with the exact title before the first sign of trouble. |
| `firstConcreteSignal` | date entry or null | The earliest dated public sign that something was wrong. |
| `formalAction` | date entry or null | The formal disposition: NPC seat terminated, removed from a state office, expelled from the Party and the military. |
| `intermediateActions` | date entry[] | Formal steps between the first signal and the formal action, for example a state-CMC removal before an expulsion. |
| `silenceDays` | integer or null | Days from the last public appearance to the first concrete signal. Set only when both dates exist and the signal is not a secondary classification. |
| `processDays` | integer or null | Days from the first concrete signal to the formal action. Set only when both are official, not secondary classifications. |
| `totalDays` | integer or null | Days from the last public appearance to the formal action. |
| `collectionState` | `complete`, `partial` or `not_yet_collected` | See below. |
| `searchLane` | string | Where to look for the missing dates. |
| `researchNotes` | string or null | Free-text notes from the research pass. |

A first-signal, formal-action or intermediate-action entry has `date`, `kind` (a key from `signalKinds`), `url`, `sourceClass` and `note`, and may carry `publisher` and `verification`. A last-public-appearance entry has `date`, `datePrecision`, `event`, `titleZh` (the exact Chinese title as printed), `url`, `publisher`, `sourceClass`, `verification` and `note`. Dates may be a full day, a month or a year; the build resolves a month or year to its last day before counting.

One join runs before the counts. For every military deputy in the NPC-terminations tracker whose exact Chinese name matches a ledger record, the build writes an `npc_seat_revoked` event (source class A1) from the credentials report. It becomes the record's `formalAction` when the record has none or has only a secondary classification; if the record already has an official formal action on a different date, the event is appended to `intermediateActions`. The join also replaces a coarse ledger `date` with the report date.

`collectionState` is derived as follows. A signal or action whose `kind` is `secondary_classification` does not count as official. A record is `complete` when it has a last public appearance, an official first signal and an official formal action. It is `partial` when it has at least one of those three. Otherwise it is `not_yet_collected`. At this release: 8 complete, 45 partial, 10 not yet collected (`metadata.ledgerClock.counts`).

## `signalKinds`

A map from kind to plain meaning (research/adverse-timeline.json, `signalKinds`):

| Kind | Meaning |
|---|---|
| `absence_noted` | Omission from a high-expectancy event with a complete roster and peers present. |
| `press_report` | Credible press report of investigation or detention before any official act. |
| `replacement_named` | A successor formally named without explanation. |
| `investigation_announced` | Official announcement of investigation. |
| `suspension_announced` | Official announcement of suspension for investigation. |
| `npc_seat_revoked` | NPC deputy status revoked or terminated. |
| `state_office_removed` | Removed from a state office by the NPC Standing Committee. |
| `state_cmc_removed` | Removed from the state CMC by the NPC Standing Committee. |
| `expulsion_announced` | Expelled from the Party and the military. |
| `party_bypass` | Passed over in ordered Central Committee vacancy filling. |
| `npc_gazette_reported` | NPC gazette text reported by secondary press. |
| `secondary_classification` | Specialist research classification without a dated official notice in this repository. Does not count as official for the clock. |

At this release two first-signal entries use the kind `other`, which is not in `signalKinds`. Treat it as unclassified; it still counts as official for the clock because it is not `secondary_classification`.

## `ledgerClock`

| Field | Meaning |
|---|---|
| `cutoff` | The data cutoff. |
| `counts` | `{complete, partial, not_yet_collected}` over the adverse ledger. |
| `withLastAppearance` | Records that have a last public appearance. 10 at this release. |
| `silence` | `{n, medianDays, minDays, maxDays}` over records with a `silenceDays` value. n = 8, median 86, min 30, max 382 at this release. |
| `process` | `{n, medianDays, minDays, maxDays}` over records with a `processDays` value. n = 12, median 233, min 134, max 861 at this release. |
| `completeIds` | IDs of the complete records. |

A median over an even count is the rounded mean of the two middle values (scripts/lib/v8-rules.mjs, `median`).

## Held records

Held records are publication controls, not deleted observations. `identityHeldRecords` holds unresolved identity problems. Each has `id`, `nameEn`, `nameZh`, `note`, `gapIds` and, when it was produced by the build's duplicate merge, `heldReason: "duplicate_record"`. `adverseHeldRecords` holds unresolved state conflicts. The tests reconcile active and held records against the canonical population count.

## Positions

Source: research/positions.json, processed by the build.

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable position ID, for example `POS-TC-E-CDR`. |
| `tier` | string | One of the nine tier ids. |
| `organization`, `organizationZh` | string | The organization in English and Chinese. |
| `position`, `positionZh` | string | The job in English and Chinese. |
| `gradeBand` | string | The rank of the job, not of the person. |
| `seats` | integer | 1 for a principal seat, 0 for a bench slot. |
| `isBench` | boolean | True when `seats` is 0. |
| `holders` | holder view[] | Officers named with the exact title. |
| `handlers` | holder view[] | Officers seen doing the work without the title. |
| `adverse` | adverse view[] | Removed or troubled officers linked to the seat. |
| `externalHolder` | object or null | A named holder who is not an officer dossier, with `name`, `nameZh`, `note` and `url`. |
| `note` | string | Analyst note on the seat. |
| `searchLane` | string | Where to look next for this seat. |
| `lastChecked` | date | The cutoff. |
| `coverage` | controlled string | Derived by `deriveCoverage`. See "Coverage states". |
| `freshestTitleDays` | integer or null | The smallest `daysSinceTitle` among the holders. |

A holder view has `officerId`, `nameEn`, `nameZh`, `billet`, `roleState`, `lastReliableTitleDate`, `daysSinceTitle` and `titleDatePrecision` (`day`, `month`, `year` or null). An adverse view has `adverseId`, `nameEn`, `nameZh`, `status`, `controlledState` and `date`.

### Coverage states

Derived by one rule, described in words in docs/COLLECTION_METHOD.md section 4. Counts are principal seats only (`metadata.positionCoverageCounts`).

| State | Seats | Meaning |
|---|---:|---|
| `formal_current` | 10 | A holder has a formal appointment, or repeated official naming with a matching rank. |
| `dated_official` | 9 | A holder has an official title on a date; continuity after that date is not established. |
| `acting_or_inferred` | 22 | The best holder rests on acting language or inference. |
| `stale` | 22 | Every holder has a legacy or stale role state. |
| `conflicting` | 3 | A holder is in conflict, or a one-seat position has more than one holder. |
| `handled_without_title` | 14 | No holder, but at least one handler. |
| `adverse_vacancy` | 19 | No holder or handler; the linked adverse record is a confirmed exit. |
| `held_in_adverse_watch` | 1 | No holder or handler; the linked adverse record is an unresolved watch. |
| `external` | 1 | No holder, handler or adverse link; an external holder is named. |
| `no_record` | 55 | None of the above. No dated source names anyone. |

## `positionTiers`

Each entry has `id`, `label`, `labelZh` and `plain`. The nine ids are `cmc`, `cmc_organs`, `theaters`, `services`, `rocket_bases`, `arms`, `pap`, `group_armies` and `academies`.

## `unmappedReasons`

A map from reason key to plain meaning (research/positions.json). The five keys are `platform_or_unit_level`, `academic_or_research`, `billet_unknown`, `transfer_destination_undisclosed` and `duplicate_record`. The last one never appears on an active officer: the build merges such records into an identity hold.

## Trackers

`trackers` is an object keyed by tracker name. A tracker is present only when its input file exists under research/trackers; `metadata.trackerKeys` lists what is present. At this release `npcTerminations`, `promotionCeremonies` and `titleFreshness` are present. The shapes below are what the build produces (scripts/build-v8-data.mjs). Each input file also carries a `searchLog` describing the sweep; the build copies `gaps` but not `searchLog`.

Tracker rows are matched to the dataset by the exact Chinese name. A `match` is `{kind, id, nameEn}` where `kind` is `officer` or `adverse`, or null when the name is not in the dataset.

### `npcTerminations` (input: npc-terminations.json)

| Field | Meaning |
|---|---|
| `sessions[]` | One per NPC Standing Committee credentials report: `date`, `sessionZh`, `url`, `publisher`, `verification`, `note`, `terminated[]`. A session with no military termination has an empty `terminated` list. |
| `rows[]` | One per terminated military deputy: `nameZh`, `nameEn`, `electionUnitZh` (the military congress that acted), `actionZh` (the action word as printed), `statedReasonZh`, plus the session fields and `match`. |
| `summary` | `sessions`, `terminated`, `matchedToLedger`, `matchedToActive`, `unmatched`, `byYear`. |
| `gaps[]` | Known holes in the sweep. |

### `promotionCeremonies` (input: promotion-ceremonies.json)

| Field | Meaning |
|---|---|
| `ceremonies[]` | One per full-general ceremony: `date`, `url`, `publisher`, `verification`, `promoted[]`. |
| `rows[]` | One per promoted officer: `nameZh`, `nameEn`, `rankZh`, `billetZh`, `billetEn`, `billetNewSameDay` (`yes` or `no`), `note`, plus the ceremony fields, `match`, `laterRemoved`, `daysToFirstSignal` and `daysToFormalAction` (from the ceremony date to the officer's clock dates, when the officer is on the ledger). |
| `summary` | `ceremonies`, `promoted`, `laterRemoved`, `sameDayBillet`, `medianDaysToFirstSignal`, `byYear`. |
| `gaps[]` | Known holes in the sweep. |

### `cc20Military` (input: cc20-military.json)

| Field | Meaning |
|---|---|
| `source` | The communiqué used. |
| `members[]` | One per military member of the 20th Central Committee: name, `membership` (`full` or `alternate`), `match`, and `statusToday`, one of `removed`, `missing`, `bypassed`, `active_mapped`, `active_unmapped`, `not_in_dataset`. |
| `laterChanges[]` | Plenum-level changes since 2022. |
| `summary` | `total`, `full`, `alternate`, `byStatus`. |
| `gaps[]` | Known holes. |

### `eventAttendance` (input: event-attendance.json)

| Field | Meaning |
|---|---|
| `events[]` | One per report: `family`, `date`, `url`, `rosterComplete` (`complete_enumeration` or not), `namedMilitaryAttendees[]` each with `match`. |
| `families[]` | The distinct event families. |
| `misses[]` | One per officer named at the previous event of a family and not at the next one, computed only when the later report is a complete enumeration: `family`, name, `expectedFrom`, `missedAt`, `missedEventUrl`, `match`, and `laterResolution` (`status`, `formalActionDate`, `firstSignalDate`) when the officer is on the ledger. |
| `summary` | `events`, `families`, `completeRosters`, `misses`, `missesLaterConfirmedAdverse`. |
| `gaps[]` | Known holes. |

### `seatTurnovers` (input: seat-turnovers.json)

| Field | Meaning |
|---|---|
| `turnovers[]` | One per principal seat that turned over: `positionId`, `predecessorExit`, `successorAppointment` (or null), `handlerFirstSeen`, `handlerNameZh`, plus computed `positionKnown`, `tier`, `coverageNow`, `closed`, `daysOpen` (exit to appointment, or to the cutoff while open) and `handlerDays`. |
| `summary` | `turnovers`, `closed`, `open`, `medianDaysToFill`, `medianDaysOpenStillVacant`, `withHandler`. |
| `gaps[]` | Known holes. |

### `titleFreshness` (computed, no input file)

| Field | Meaning |
|---|---|
| `cutoff` | The data cutoff. |
| `summary` | `principalSeats`, `principalSeatsWithHolder`, `byBand` (`undated`, `within_90_days`, `within_180_days`, `within_365_days`, `over_365_days`), `principalSeatsFreshWithin180`. |
| `queue[]` | Every mapped officer with `positionIds`, `roleState`, `lastReliableTitleDate`, `daysSinceTitle` and `band`, ordered with undated first and then oldest first. This is the re-verification queue. |

## `reviewLog`

Each entry has `id`, `date`, `source`, `concern`, `response`, `changed[]` and `notChanged[]`. See docs/REVIEW_LOG.md.

## CSV columns

One row per active officer. Twenty columns, in order:

`stable_id`, `name_en`, `name_zh`, `institution_family`, `institution`, `recorded_billet`, `reported_military_rank`, `appointment_record`, `current_title_source`, `title_freshness`, `primary_mapped_claims`, `birth_record`, `open_gap_count`, `last_corroborated`, `days_since_title`, `source_count`, `linked_gap_ids`, `archetype_status`, `position_ids`, `unmapped_reason`.

The four columns added in schema version 8:

| Column | Meaning |
|---|---|
| `days_since_title` | The officer's `daysSinceTitle`. Empty when the title date is unknown. |
| `archetype_status` | `mapped` or `unmapped`. |
| `position_ids` | The officer's position IDs, separated by a vertical bar. Empty when unmapped. |
| `unmapped_reason` | The reason key when unmapped, otherwise empty. |

`linked_gap_ids` is also separated by a vertical bar. The CSV omits claims, source scopes, adverse records, positions and trackers. Use the JSON for anything that needs to be audited.

## Dates

A date field may hold a full date (`2026-08-28`), a month (`2026-08`), a year (`2026`) or the string `unknown`. When the build counts days it resolves a month to its last day and a year to 31 December, so a coarse date gives the latest possible day (scripts/lib/v8-rules.mjs, `parseDate`). Day counts are whole numbers.
