# Data dictionary

The canonical documentary dataset is `app/data/observatory.json`. The public JSON export is an indented copy of that same object. The CSV is a deliberately narrower officer-level projection for analysts who want a flat table.

## Root collections

| Key | Unit | Meaning |
|---|---|---|
| `metadata` | object | Release cutoff, build ID, counts, and coverage diagnostics |
| `officers` | person | Active, identity-secure officer dossiers that are not held by the adverse firewall |
| `claims` | claim | Claim-scoped observations linked to a source, field, date, and temporal boundary |
| `sources` | source | Person-level documentary sources and their quality/scope metadata |
| `adverse` | person/event | Confirmed removals and unresolved adverse watches, maintained separately from active officers |
| `identityHeldRecords` | person candidate | Names withheld from the active universe because public identity resolution is inadequate |
| `adverseHeldRecords` | person candidate | Records withheld because adverse-state resolution is incomplete |
| `gaps` | collection question | Prioritized missing evidence with search lanes and explicit non-assumptions |
| `systemSources` | institutional source | Rules and institutional evidence relevant to the selection system |
| `contextSources` | contextual source | Events and observations that shape the assessment but do not validate person-level fields |
| `pipelineSources` | pathway source | Feeder-system evidence that must not be mistaken for a named appointment claim |

## Officer fields

| Field | Type | Interpretation |
|---|---|---|
| `id` | string | Stable person identifier. Use this key rather than English-name spelling. |
| `nameEn`, `nameZh` | string | Published Romanized and Chinese names. |
| `identityNote` | string/null | Identity caveat or disambiguation note. |
| `branch` | controlled string | Broad institutional family used for filtering. It can differ from service origin. |
| `institution` | string | Most relevant current or assessed organization. |
| `serviceOrigin`, `serviceOriginDetail` | string | Career-origin classification and supporting detail. |
| `billet` | string | Best current or recent role description, always interpreted with `roleState` and date fields. |
| `rank` | string | Reported military rank. This is not automatically proof of grade or current billet. |
| `roleState` | controlled string | Formality and freshness state for the displayed billet. |
| `roleStateDetail` | string | Human-readable qualification of the role state. |
| `lastReliableTitleDate` | date/string | Latest date on which a source reliably attached the displayed or relevant title to the person. |
| `assessmentAsOf` | date | Cutoff at which the dossier was evaluated. |
| `birthYear` | integer/null | Usable year only when the evidence clears the publication threshold. |
| `birthPrecision`, `birthEvidence` | string | Precision and caveat for age/runway analysis. |
| `partyStatus`, `stateCmcStatus`, `npcStatus` | string | Separate public political/state records. Unknown is not negative evidence. |
| `disciplineState`, `disciplineNote` | string | Relationship to the public adverse ledger and required caution. |
| `evidence` | object | Current-role mapping grade and counts. |
| `signals` | object | Machine-readable documentary signals used by the interface. |
| `sourceCount` | integer | Number of linked sources, not an evidence-strength score. |
| `sources` | source[] | Sources linked to the dossier, each with an explicit scope. |
| `claims` | claim[] | Claims directly mapped to the person. |
| `gapIds` | string[] | Open or resolved collection questions connected to this person. |

## Role states

| State | Meaning | Permitted reading |
|---|---|---|
| `formal_current` | A formal or repeated current appointment is directly supported. | Treat the role as current at the assessment cutoff, subject to the cited scope. |
| `official_title_with_scope_caveat` | An official source provides a title, but continuity or exact authority is bounded. | Treat as a dated official observation, not perpetual incumbency. |
| `acting_role_mixture` | Evidence points to acting, work-handler, or mixed authority. | Treat formalization as the next gate. |
| `inferred_current` | Multiple observations support current-role inference without a clean appointment act. | Present as inference, never as confirmed appointment. |
| `conflicting_current` | Credible evidence conflicts about who holds the role or whether continuity persists. | Preserve the conflict; do not resolve by publicity or recency alone. |
| `legacy_unverified` | A historical role is reported but has not been refreshed sufficiently. | Do not use as current incumbency. |
| `stale_or_unknown` | Public evidence is too old or incomplete to establish the displayed status. | Treat as a collection target. |

## Evidence object

| Field | Meaning |
|---|---|
| `grade` | Editorial evidence band for the displayed current-role proposition |
| `label` | Short description of why the grade was assigned |
| `caveat` | Mandatory boundary on what the evidence establishes |
| `mappedClaims` | Number of claim-scoped observations mapped to the dossier |
| `primaryMappedClaims` | Number of mapped claims using qualifying primary sources |
| `currentRoleMapped` | Whether at least one source is mapped specifically to the current-role field |

Evidence grades are not promotion scores. A richly sourced officer can have a weak promotion path; a structurally important officer can remain poorly documented.

## Claim fields

| Field | Meaning |
|---|---|
| `id` | Stable claim identifier |
| `field` | Dossier field or proposition being supported |
| `value` | Source-bounded claim value |
| `type` | Fact, historical observation, inference-supporting observation, or another scoped class |
| `support` | Whether the source supports or contradicts the proposition |
| `observedAt` | Date of the observation or event |
| `sourceId`, `sourceUrl` | Link to the source record and original page |
| `sourceClass`, `sourceMode` | Evidence-quality and extraction-mode labels |
| `sourceDate`, `publisher` | Source metadata |
| `temporalScope` | The period for which the source can be read safely |
| `doesNotSupport` | Explicit inference the source cannot bear |

## Source fields

`family` distinguishes official primary, formal decision, specialist research, and discovery/other sources. `class` records the project's source-quality taxonomy. `mode` distinguishes direct title text, formal lists, secondary reconstruction, discovery-only links, and other collection forms. `scopes` or dossier-level `scope` identifies the exact proposition supported.

The presence of a URL in `sources` is not global validation of the dossier. Use the corresponding claim record and scope.

## Adverse and held records

The positive officer universe and the adverse ledger are mutually exclusive by stable ID. `controlledState` distinguishes resolved and unresolved conditions. `status`, `date`, `summary`, `evidenceConfidence`, and `sources` describe the public basis for the ledger entry.

Held records are publication controls, not deleted observations. `identityHeldRecords` captures unresolved identity problems. `adverseHeldRecords` captures unresolved state conflicts. The canonical-officer reconciliation in the tests ensures that these buckets and active records account for the modeled universe.

## CSV columns

The CSV includes:

`stable_id`, `name_en`, `name_zh`, `institution_family`, `institution`, `recorded_billet`, `reported_military_rank`, `appointment_record`, `current_title_source`, `title_freshness`, `primary_mapped_claims`, `birth_record`, `open_gap_count`, `last_corroborated`, `source_count`, and `linked_gap_ids`.

The CSV omits claim text, detailed source scopes, adverse records, and estimative model fields. Use the JSON for auditable research or model replication.

## Nulls, unknowns, and dates

- `null`, `unknown`, and missing values are not evidence of absence.
- An unknown birth year receives no favorable runway assumption.
- A dated title proves an observation at that date; it does not automatically prove continuity.
- A person's absence from a single event is not coded as adverse evidence without an established attendance baseline and peer controls.
- English title translations are analytical aids. Exact Chinese titles and source text should control disputed interpretations.

