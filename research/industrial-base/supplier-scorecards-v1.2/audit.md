# Supplier Scorecards v1.2 — Final Audits

## 1. Coverage and missing-entity audit

- 52 supplier × capability scorecards: 25 evidence-qualified and 27 provisional/bounded.
- 66 atomic evidence rows from 64 source URLs; 19 new exact-name entities remain visibly flagged for identity follow-up.
- Lane coverage: component_or_subsystem_supplier=25, production_enabler=11, unmanned_systems_enabler=9, counter_UAS_integrator=7.
- Gap retained: only one explicit fragility case exists; no missing evidence is converted to apparent substitutability.

## 2. Source, contradiction, and factual-confidence audit

- SQLite integrity: `ok`. Bounds violations: 0; missing source URLs: 0; orphan evidence references: 0.
- Ranked records supported only by pre-award evidence: 0. Criticality-4 records without sole-source support: 0.
- Conservative normalization visibly capped raw criticality in 16 scorecards and raw cross-domain claims in 33 scorecards.
- Foreign-dependency cases are isolated from domestic supplier scoring; all imported cases preserve historical/currentness and inference limits.

## 3. Analytical and usability improvement audit

- v1.2 payload and database agree on 52 scorecards and 66 evidence rows. The payload exposes scorecards, evidence, dependency cases, and signals as separate queryable collections.
- Workbook archive is valid: True; worksheet XML count: 10. Formula scan reported zero error matches, and each sheet was rendered for visual inspection during build.
- The site’s Supplier scorecards tab mirrors the same scorecard/evidence tables and downloads the corresponding CSV, workbook, and compressed SQLite artifact.

## Remaining high-value gaps

1. Delivery/acceptance and sustainment evidence for high-scoring components.
2. Full-page resolution of PLA C-UAS result notices before promotion beyond monitoring status.
3. Source-backed qualification/requalification or dual-source evidence to assess substitution risk beyond the single explicit sole-supplier case.
4. USCC/parent/site resolution for new private robotics and C-UAS firms.
5. Post-2024 facility- or program-specific evidence for any historical foreign tool/consumable relationship.
