# Robotics analyst pilot, 4 September 2026

The first extension contains six dossiers, 16 dated or explicitly undated relationships, 20 claims, 13 source records, 15 actor records and 12 products or product families. It is a selected research pilot. It does not measure the size, concentration or completeness of China's robotics ecosystem.

## Analyst workflow

1. Start with **Relationships**. Filter by company, Chinese name, product class or case. Read transaction stage alongside technical stage.
2. Open the claims to inspect their source wording, location, publication date, retrieval date and limits. Distinct source records are not automatically independent corroboration.
3. Open a **Dossier** for actor identity, product scope, properly defined metrics, unknowns and disconfirming evidence.
4. Use **Timeline** to distinguish event dates from publication dates. Dates known only to a year or month retain that precision. Null dates are unresolved, not zero or the retrieval date.
5. Use **Collection priorities** to identify the next document and the judgment it would change. Download the relationship CSV or the complete JSON for further analysis.

## Case lessons

| Case | What it establishes | What it does not establish |
| --- | --- | --- |
| DEEP Robotics / EGP / SP Group | Supplier-attributed integration chain, customer-reported civilian inspection use, issuer-reported follow-on deliveries | Independent customer identification of the OEM, unit count or full rollout |
| Unitree / exercise observation | Public commercial product and developer resources; separately reported military quadruped appearance | A verified Unitree–PLA sale or model identification |
| Jingpin | Military-robot business revenue, upstream development and management-described civilian transfer | A common maturity for every product or 3,197 actual robots |
| Xirui / Waigaoqiao | Two final workstation awards totaling CNY10.37m | Installation, acceptance, naval application or company revenue |
| Estun / Shuguang | Historical military-servo business and dated ownership changes | Current Estun control after June 2025 or ownership after November 2025 |
| Siasun / Shenfei civil aircraft | Reported cooperation and planned metal-printing research involving C919 | Delivered robotics, a military application or the identity of the other two aircraft types |

## Data dictionary

`research/industrial-base/ecosystem.json` is the reviewed extension. Stable IDs connect:

- `entities`: actor names, original Chinese names, role, identity boundary and source IDs. A brand is not silently resolved into a legal contracting entity.
- `products`: model or bounded family, product class, known manufacturer, capability node IDs, supporting claims and technical stage. Several nodes may be supported; an empty array asserts no node mapping.
- `sources`: URL, publisher, publication date, retrieval date, access state and origin record. Origin IDs identify records, not independent organizations. Repeated issuer reports remain related evidence.
- `claims`: one bounded assertion, source, page/paragraph locator, short original excerpt and translation where available, basis and limitation.
- `relationships`: subject and counterparty, products, relation type, civilian/military connection, transaction stage, technical stage, event date, date basis, optional effective interval, currentness, claims and any scoped award value.
- `cases`: synthesis, actors/products/claims, links to legacy assessments, unknowns, next evidence, decision affected and counterevidence.
- `metrics`: value, unit, business scope and supporting claim. Award values, consolidated revenue and labor-equivalent output are not interchangeable.

Effective ownership intervals are start-inclusive and end-exclusive. A single documented historical observation does not establish a continuing present relationship. The interface does not compute probabilities or treat source counts as confidence.

## Repairs to the legacy views

The original workbook and `scorecards-v1.2.json` remain unchanged. `reviewed-amendments.json` records overlays and reasons. Xirui's U3 conflicts with linked U1/U2 ledger rows; maturity and numeric triage are withheld, while its original values remain in `importedAssessment` and its awards remain documented. This produces 24 currently rank-eligible assessments from 25 originally ranked records.

The scarcity tracker uses reviewed affirmative evidence. Two negated caveats and one proposed procurement are excluded from the affirmative view and retained with their dispositions. C4 validation requires an affirmative located excerpt linked to the same assessment.

Signals are the five `DRA-SIG` records. The heading is excluded; five worksheet collection tasks are retained separately. The workbook's claims of 1,841 sources and 19 new exact-name entities cannot be reconstructed and are excluded from current metrics. The 11-name identity queue is a suggested set.

Scorecard search includes stable IDs; links can open the exact assessment and its evidence. Default ordering is alphabetical. Original ranks and evidence discounts are explicitly legacy triage heuristics, not statistical bounds. Empty nodes describe the imported mapping, not missing Chinese capabilities.

## Updating and verification

Add a source and bounded claim before adding or changing a relationship. Preserve historical states and attach the evidence for a changed state. Update counterevidence and collection priorities when a question closes.

Run `node scripts/build-industrial-base.mjs`, then `npm test` and `npm run lint`. The build validates references and scarcity support and writes the app JSON, full public JSON, scorecard CSV and relationship CSV. Its content identifier includes the imported package, capability chart, reviewed extension, amendments and editorial text. Tests cover source integrity and the specific attribution, stage, date, unit and count errors found in the audit.

The [original analyst review](analyst-review-2026-09-04.md) remains the pre-implementation assessment. This document describes the implemented pilot. A next release should expand civilian coverage and systematically search customer, acceptance and ownership records; these six cases do not substitute for that collection.
