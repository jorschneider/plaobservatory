# China’s civilian and military robotics ecosystem: analyst review

Assessment date: 4 September 2026. Repository baseline: `e5841bf`, on `claude/robotics-industrial-base`. This is a research assessment and proposed next release, not a replacement dataset or a claim that the recommended changes have been implemented.

**Recommendation.** Keep the evidence ledger and capability chart, but make dated product and customer relationships the center of the robotics lane. The current package is useful for discovering some defense suppliers. It is too narrow on civilian robotics, and too compressed at the company level, to explain the civilian–military ecosystem reliably.

The question to organize around is: **Which commercially demonstrated robotics capabilities reach defense manufacturers or military users, through which organizations, at what maturity and scale, and with what evidence?** Track the reverse direction too: defense technology entering civilian products.

## 1. What is worth retaining

The existing branch already improves on a spreadsheet leaderboard: 28 capability nodes in nine tiers make missing coverage visible; the site exposes claims and caveats; generated JSON and CSV share a source; and production automation, provisional suppliers, and historical foreign relationships are explicitly distinguished. The next release should extend that structure.

The workbook’s reluctance to infer scarcity from missing information is also sound. Its one explicit fragility case is a narrow finding, not evidence that the other suppliers are easy to replace. Likewise, keeping intended procurement separate from final awards is essential.

The provided workbook and the repository’s archived workbook are byte-identical: SHA-256 `54f51ad9b9712d7ff56fd5e36072691181382c140f2cc771e4912aca1585ceec`. Workbook references below refer to [the archived package](supplier-scorecards-v1.2/China_Defense_Industrial_Atlas_Supplier_Scorecards_v1.2.xlsx). All ten worksheets were inspected. Original research files have been preserved.

## 2. What the current evidence can support

| Observation | Verified location | Analytical consequence |
|---|---|---|
| 52 supplier–capability assessments represent 50 distinct Chinese-name strings; 25 are rankable and 27 are bounded/provisional. | `Capability Assessments!A5:R56` | Assessment count is not company count or ecosystem coverage. |
| 41 of 52 assessments have one evidence row. There are 66 ledger rows and 64 distinct ledger URLs. | `Capability Assessments!Q5:Q56`; `Evidence Ledger!A5:X70` | Most dossiers lack a developed chain of corroborating observations. One annual report may support several facts, but one row is not independent corroboration. |
| The robotics-specific worksheet contains 20 assessments, only four ranked. | `Robots AI Drones!A5:P24` | The robotics title overstates the depth available for comparing robot makers, adoption, or scale. |
| Unitree, DEEP Robotics, Estun, Siasun, Inovance, Leaderdrive, UBTECH, AgiBot, and DJI are absent from the assessed Chinese-name roster. | `Capability Assessments!B5:B56`, checked against their familiar Chinese names | Major civilian reference points are missing. This is an exact-name/substrings coverage check, not a completed legal-entity or affiliate resolution. Inclusion in a future civilian roster would not imply military supply. |
| The summary reports 11 robotics signals, but only five signal records exist. | `Read Me!B12`; `Signals & Gaps!A5:A17` | The count also includes a heading and closure tasks. |
| The summary’s 1,841 “Primary/source-linked sources” is the literal formula `=1841`. | `Read Me!A10:B10` | This count is not reproducible from this workbook. It may refer to the broader Atlas; its scope needs labeling and a traceable source. |
| All five displayed audit results are literal `PASS` strings. | `Scoring Method!D13:D17` | These record a prior assertion of review; they are not executable validations. |
| Xirui’s assessment has maturity U3, while its linked ledger rows have normalized maturity U1, U2 and U2. | `Capability Assessments!K29`; `Evidence Ledger!K10`, `K45:K46` | The assessment promotion has no explanation in the supplied ledger. An award must not silently become delivery or acceptance. |

The audit memo’s database-integrity and site/database-agreement assertions were not independently reproduced: the accompanying SQLite database and original Atlas site were not supplied as part of this review. Repository export consistency is a separate, narrower check.

**The scores need less authority.** The “lower bound” is a weighted judgment multiplied by a fixed evidence factor: 0.50, 0.70, 0.85 or 1.00 (`Scoring Method!E5:H8`; `Scorecard Ranking!S5:T56`). No calibration establishes a statistical interval or guaranteed minimum. All 17 E4 records therefore have identical initial importance and “lower bound.” Rename this an evidence-discounted triage score if retained, and display its assumptions.

The E3 rule calls for repeated direct evidence/corroboration and entity resolution, yet 15 of 17 E3 assessments have one ledger row. This requires a claim-level explanation or a revised rule. It is not proof that every underlying report is inadequate. Criticality, technical differentiation, scale, substitutability, and confidence should remain separately inspectable; stronger documentation does not mechanically mean greater industrial importance.

## 3. A more useful way to understand the ecosystem

Use a commercial robotics baseline, then document the particular connections to military organizations and defense production. Selecting firms only after finding a defense link makes it impossible to compare successful transfers with capable civilian firms for which no transfer is documented.

| Pathway | What the analyst should establish | Common false positive |
|---|---|---|
| Commercial platform adapted by another organization | Original manufacturer, product/version, integrator, buyer, observed application | A recognizable robot in an exercise becomes an OEM military contract. |
| Dedicated military robot development | Developer, distinct products, purchasing evidence, maturity of each product | Mature complete robots confer the same maturity on experimental components. |
| Industrial robots used in defense production | Exact plant, process, contractor, commissioning/acceptance, measured production effect | A defense-conglomerate award establishes a naval or weapons application. |
| Shared components and software | Product-level supply or integration relationship; commercial and defense applications separately | General-purpose technical suitability becomes a confirmed supply-chain edge. |
| Research, testing, data and integration services | Institutions, projects, interfaces, licensing, validation and follow-on adoption | A rental, demonstration, paper or memorandum becomes deployment. |
| Military technology entering civilian markets | Original technology, receiving product/business, transfer mechanism, commercial outcome | Any civilian business owned by a defense supplier becomes evidence of technology transfer. |

Across these pathways, distinguish articulated industrial arms and cobots; warehouse/mobile robots; quadrupeds and humanoids; special-purpose robots; aerial systems; and maritime systems. Counter-UAS is a related customer and integration market, not a proxy for robotics as a whole. Model sensing, actuation, compute, power, software and testing across those product classes without implying that every platform needs every component.

Commercial scale needs its own evidence. IFR reports **295,000 industrial robot installations in China in 2024**, 54% of the global total, with domestic manufacturers taking 57% of the Chinese market. These are industrial-robot installation measures, not humanoid sales, autonomous-system performance or military capacity. They establish the size of the civilian base against which to study transfer. [IFR, 25 September 2025](https://ifr.org/downloads/press_docs/2025-09-25-IFR_press_release_China_in_English.pdf).

Policy belongs in a separate layer of intended mechanisms. MIIT and SASAC’s June 2026 initiative links users, robot makers, component/software suppliers and research institutions through real-world validation. It calls for assessing task success, efficiency, reliability and economics. That suggests useful collection targets—named consortia and validation reports—but does not prove its deployment targets were achieved or that participating firms supply the PLA. [Official notice, published 8 June 2026](https://www.miit.gov.cn/zwgk/zcwj/wjfb/tz/art/2026/art_f291ccd3da4c47ce95741de63cc088e6.html).

## 4. Worked examples that change an analyst’s judgment

**Jingpin: separate whole robots, component development and civilian manufacturing.** Its 2024 report describes complete military robots and upstream products under development; prospective external component sales depend on adaptation. It also describes military-to-civilian technology expansion. The production/sales table converts output into G001 equivalents using standard labor hours: the reported 3,197 sales figure is explicitly not an actual robot count. Split the current combined capability rather than treating every activity as a mature motion-module supplier. [Annual report, printed pp12, 14, 21 and 37](https://static.cninfo.com.cn/finalpage/2025-04-29/1223380866.PDF).

**Xirui: an awarded industrial relationship.** Two final notices name Guangdong Xirui and Shanghai Waigaoqiao Shipbuilding, with award values of RMB7.92m and RMB2.45m on 25 August 2025. The combined RMB10.37m is awarded workstation value. Neither notice proves installation, acceptance, productivity gains or naval end use. The record should lead with “robotic-grinding workstations awarded,” followed by the missing next stage. [Small-parts notice](https://www.csscbidding.com/jyxx/003001/003001004/20250825/5a186f89-8939-4634-9bdc-bb09d21cbcbb.html), [very-small-parts notice](https://csscbidding.com/jyxx/003001/003001004/20250825/fc564718-4800-43a3-b82a-02c5058139fe.html).

**DEEP Robotics: a civilian chain with distinct organizations.** DEEP identifies its X30, integrator Eastern Green Power, and SP Group’s SPock tunnel-inspection application. SP Group independently describes the inspection use, although its account does not identify the OEM. This provides a useful manufacturer–integrator–customer case with different evidence supporting different links. It provides no PLA procurement evidence. [Supplier account, 17 December 2024](https://deeprobotics.cn/robot/wap/article/id/266.html), [customer account, 27 November 2024](https://www.spgroup.com.sg/about-us/media-resources/energy-hub/reliability/How-this-technical-officer-and-robot-SPock-hunt-hazards-to-protect-Singapore-power-tunnels). Its [May 2026 prospectus](https://dataclouds.cninfo.com.cn/sjother2/documents/2026/2026-05-18/3ef52e260c1cc31a8c57ab5e0abf2c14.pdf) also offers a substantial source for financial, product and channel research.

**Estun: a real historical defense connection whose ownership ended.** Estun’s 2017 filing documented acquisition of 68% of military servo supplier Yangzhou Shuguang through Nanjing Dingkong. Later audited statements establish that disposal of the remaining 48% stake completed on 3 November 2025. A current ownership chart must reflect that exit and the buyer, Wuxi Xinhongye. Historical technical or supply relationships need separate reassessment; divestiture alone does not prove that they all ended. [2017 filing, announcement 2017-116](https://www.estun.com/static/upload/file/20220517/1652753469816426.pdf), [HKEX-hosted statements, Note 35, printed p101](https://www.hkexnews.hk/listedco/listconews/sehk/2026/0227/12031239/2026022700113_c.pdf).

**Military quadrupeds: observation and attribution are separate claims.** CCTV’s Golden Dragon report establishes that robot dogs appeared in the 2024 exercise. The article does not name Unitree, establish the contracting seller or integrator, or demonstrate fleetwide adoption. Unitree’s commercial product and developer ecosystem are a separate subject. Keep a platform-identification claim separate from direct-supplier attribution. [CCTV, 27 May 2024](https://military.cctv.com/2024/05/27/ARTIMW8UKPoPPY8VrtLwVd5P240527.shtml), [Unitree product](https://www.unitree.com/go2/), [developer documentation](https://support.unitree.com/home/en/developer/).

**Siasun: a deliberate negative control.** Its account of cooperation with AVIC Shenyang Civil Aircraft explicitly concerns C919 and other civil aircraft. Coding “AVIC counterparty” as “military application” would be wrong for this example. Keep the exact subsidiary and project. [Siasun’s 2015 announcement](https://www.siasun.com/news-detail650.html).

The PLA robot-dog rental notice is retained as a collection lead only. A substantial official search extraction was available, but a direct page open failed. Under the repository’s contribution rule, do not promote it to newly verified evidence until the actual page or an adequate preserved copy is available. [Original notice](https://www.plap.mil.cn/freecms/site/juncai/ggxx/info/2025/8a1d01cb96b9416a01975252956a0bf1.html).

## 5. Changes specific to this repository

| Existing feature | Problem | Smallest useful change |
|---|---|---|
| Capability-node chart | It organizes categories, but does not record who supplies whom. A scorecard maps to exactly one node even when its capability bundles several products. The six empty nodes have no capability-family assignments, so their emptiness also reflects the mapping design. | Keep nodes; introduce product/relationship records with claim-specific links to one or more relevant nodes. Distinguish unreviewed mapping from a documented collection gap. |
| Workbook-only input rule | It freezes every future addition behind a full workbook package update. | Preserve v1.2 as an immutable import and introduce reviewed additions/corrections as a separate research input with stable IDs and provenance. Generate exports from both. |
| Finding R2 | “Weapons robotics is not [evidenced]” reaches beyond the shipyard award evidence and obscures Jingpin’s military-robot business. | Describe exactly what the awards prove, and assess complete military robots separately. |
| Findings R3/R4 | A selected C-UAS test cohort is generalized to absence of bottlenecks; one tender becomes a broad trend in demand. | Limit each finding to its observed population and period. Request comparative procurement, qualification and time-series evidence. |
| “Counts, not opinions” heading | Findings include interpretation and uncertainty judgments. | Separate measured coverage, sourced facts and analyst interpretations visibly. |
| Scorecard navigation | `openCard` puts an assessment ID into search, but the search text omits the ID. | Match the stable ID or open a dedicated selected record; then link directly to its evidence. |
| Default scorecard sorting | All lanes and evidence tiers are sorted together by raw importance. | Start from product/use-case comparison; retain optional within-group sorting with explicit meaning. |
| Limited-source tracker | Keyword matching includes caveats. Tianjin 712’s “no sole-source inference” and AVIC Optoelectronics’ “no platform-specific sole-source claim” enter the tracker. The C4 test checks membership in another list selected by C4, not supporting evidence. | Use explicit positive, negative and proposed relationship states with a supporting excerpt. Validate the actual supporting claim. |
| Identity queue | Eleven provisional company names stand in for the audit’s 19 unresolved identities, without a verified correspondence. | Give each entity an identity status and reason; describe the current list as a suggested review queue. |
| Build identifier | It hashes selected score/node summaries and evidence count, not all claim/source content. | Include canonical research content so a corrected claim or URL changes the release identifier. |

Relevant files: [assessment text](../../app/data/industrial-base-assessment.ts), [robotics page](../../app/robotics/page.tsx), [builder](../../scripts/build-industrial-base.mjs), [node chart](robotics-nodes.json), [current integrity tests](../../tests/industrial-base.test.mjs).

These are findings and proposed changes. This review does not modify the application, generated data, original workbook or its imported JSON.

## 6. Minimum research structure for the next release

Use a few linked collections, not a new universal company score. JSON is adequate for a first release; no new database is necessary.

| Collection | Minimum content |
|---|---|
| Entities | Stable ID, exact Chinese legal name, English aliases/brand, legal identifier when verified, entity type; unresolved identity explicitly marked. |
| Products | Model/version, product class, manufacturer, role, relevant capability nodes, demonstrated versus claimed properties. |
| Relationships/events | Subject, relation type, object, relevant product/project, event date, effective start/end if known, transaction stage, evidence claim IDs. Ownership and commercial supply are different relations. |
| Claims | One proposition, source ID and page/section, short original Chinese excerpt and translation where applicable, supported scope, interpretation, conflicting/disconfirming evidence, confidence rationale. |
| Sources | Original publisher and URL, publication date, retrieval date, full-page access state, preserved reference/hash where available, and common-origin/republication links. |

Give each relationship a military connection type: direct military customer; defense manufacturer with end use identified; defense manufacturer with end use unknown; observed military use with seller unknown; civilian application; or unresolved. Police, emergency services and industrial security should remain distinguishable from the PLA.

Track technical maturity separately from the commercial transaction. “Awarded” is a transaction stage; “demonstrated” describes capability evidence. A mature commercial robot can be in an early military trial. A development contract can be awarded before a usable product exists. For transactions use intended, tendered, candidate, awarded, delivered, accepted, in-service, cancelled or unknown as applicable, without assuming every procurement exposes every stage.

For scale, preserve the unit and denominator: ordered versus delivered robots; installed versus operating workcells; announced capacity versus output; model revenue versus total company revenue; observed demonstration versus tested task success. Unknown values should say whether the information was not sought, not found, inaccessible, undisclosed or conflicting.

## 7. Analyst views and collection priorities

The first screen should let an analyst choose a product class and see the known civilian producers, documented military/industrial relationships, maturity, dates and unresolved links. A company dossier should answer “what do they actually make, who buys it, and how do we know?” before displaying any score.

Add three useful views once the research model works: a dated relationship table, a timeline of awards/deliveries/ownership changes, and a collection queue explaining which missing observation would change which judgment. A network picture can come later; an unsourced connecting line is not an improvement over an unsourced company label.

**First collection tranche: six short case dossiers.** Develop Jingpin’s military-to-civilian and product distinctions; Xirui’s award-to-acceptance history; DEEP’s civilian integration chain; Unitree’s commercial platform versus specific military-attribution claims; Estun/Shuguang’s ownership timeline; and the Siasun civil-aircraft counterexample. Each should include a commercial baseline, strongest supported relationship, strongest limitation/disconfirmer and next decisive source. These cases test the method before expanding the roster.

**Then broaden coverage deliberately.** Add comparable producers and component suppliers within each selected product class. Research civilian commercial scale without requiring a military claim for admission. Investigate integrators, research institutions, testing bodies, procurement intermediaries, policy consortia and ownership alongside manufacturers. Track evidence of shared technology or personnel explicitly rather than relying on affiliation or geography.

**Release acceptance criteria:** a reader can trace every displayed connection to a dated claim; archived and current ownership differ; no award becomes acceptance without evidence; the Jingpin equivalent-unit figure cannot become a robot count; civilian AVIC activity remains civilian; a company can supply several products with different maturity; repeated stories with one origin do not become independent corroboration; and every headline identifies whether it describes the collection or the Chinese ecosystem.

The result should let an analyst explain a transfer mechanism and test an alternative explanation. Adding names or raising the source count is useful only when it improves that ability.
