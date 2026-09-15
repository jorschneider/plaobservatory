# Industrial base lane: civil-military robotics

The implemented [relationship-based analyst pilot](relationship-method.md) supplies six sourced dossiers, product/customer relationships, a timeline and collection priorities at `/robotics`. Read that document for the current workflow, schema, corrections and limitations. The [military ecosystem guide](../military-robotics/README.md) and [adoption-route synthesis](../military-robotics/adoption-routes.md) extend the analysis through 15 September 2026. The original v1.2 package is preserved below as an archival input.

This folder holds the second lane of the Observatory. The first lane asks who holds the PLA's senior positions. This lane asks which firms supply the robotics, autonomy and enabling components that the defense system depends on, and how much of that supply is civilian, dual-use or single-source.

The lane is published at `/robotics`. The import, current build and integrity check are separate steps:

```
python3 scripts/extract-industrial-base.py   # workbook -> scorecards-v1.2.json (deterministic, no hand edits)
node scripts/build-industrial-base.mjs       # import + reviewed claims/amendments -> app/data + public exports
node --test tests/industrial-base.test.mjs   # integrity checks (also run by npm test)
```

## What is here

`supplier-scorecards-v1.2/` is the China Defense-Industrial Atlas supplier scorecard package, version 1.2 (2026), added as received:

- `China_Defense_Industrial_Atlas_Supplier_Scorecards_v1.2.xlsx`: ten sheets. Read Me; Scorecard Ranking (evidence-gated supplier scores); Capability Assessments; Evidence Ledger (66 atomic evidence rows from 64 source URLs); Robots AI Drones (robotics, AI, drone and counter-drone entities); Foreign Dependencies; Signals & Gaps; Scoring Method; Source Register; Bibliographic Essay.
- `analysis.md`: the v1.2 narrative. 52 supplier-by-capability scorecards, 25 evidence-qualified and 27 provisional. Lanes: component or subsystem supplier (25), production enabler (11), unmanned-systems enabler (9), counter-UAS integrator (7).
- `audit.md`: the supplied v1.2 audit, preserved as received. Its original database/site-check assertions were not independently reproduced; use the [later analyst review](analyst-review-2026-09-04.md) and [implemented corrections](relationship-method.md#repairs-to-the-legacy-views) for the current assessment.

`scorecards-v1.2.json` is the workbook extracted sheet by sheet by `scripts/extract-industrial-base.py`. The workbook remains the source for that immutable import; its JSON is regenerated, never edited. The pilot's reviewed relationships live in `ecosystem.json`, with corrections in `reviewed-amendments.json`. Column headers in the import become snake_case keys; the single-letter score columns become `criticality`, `frontier`, `cross_domain` and `evidence`.

`robotics-nodes.json` defines 28 capability nodes in nine tiers (sensing, navigation, actuation, compute, communications, autonomy, counter-UAS, production, test) and maps the workbook's 43 capability families onto them. Six nodes have no supplier in that imported mapping. Their emptiness describes the import, not an absence of Chinese capability or a requirement to add one company per node. Reviewed products can relate to multiple nodes.

## What the build derives

`scripts/build-industrial-base.mjs` combines the imported package, capability chart, reviewed relationships and amendments. It writes `app/data/industrial-base.json`, the full public JSON, scorecard CSV and relationship CSV. The legacy views retain:

- Scorecard tier: `evidence_qualified` (ranked, E3 or E4 evidence), `bounded` (evidence-qualified but not ranked) or `provisional` (self-description, pre-award or comparative test only).
- Node coverage: `evidence_qualified`, `provisional_only` or `no_record`, with the suppliers evidenced against each node.
- Trackers, one question each: procurement notices that name robotics or autonomy scope; sole-source and limited-source language, with the criticality-4 cases separated; foreign dependencies, dated and marked historical or current; the identity queue of provisional watchlist entities; the signals and gaps register.
- Findings R1 to R6 and research questions RQ-R1 to RQ-R5 live in `app/data/industrial-base-assessment.ts`. Counts are filled from built data; interpretation still requires source review.

The original package gated rankings by evidence tier and capped criticality without explicit scarcity language. The reviewed extension preserves those imported values but withholds unsupported promotions, defaults to alphabetical ordering and treats scores as legacy triage heuristics, not statistical bounds. The [relationship method](relationship-method.md) records the corrections, including 24 currently eligible assessments from 25 originally ranked records.

## Why the refocus

The original refocus selected robotics and related suppliers from a broader defense-industrial package. The subsequent review found that company scores compressed product maturity, transaction stage and industrial importance too heavily. Current work therefore starts with dated products, organizations and relationships, preserving production automation and particular scarcity claims at their supported scope.

The refocus narrows the question to robotics: production robotics (the CSSC robotic-grinding awards), unmanned platforms and their enablers (motion and electro-optical modules, inertial navigation, MEMS sensors, datalinks), the robot-dog and autonomy tenders, and the counter-UAS integrator layer.

## Next steps

The [4 September 2026 analyst review](analyst-review-2026-09-04.md) is the historical pre-implementation assessment. The [relationship method](relationship-method.md) describes the implemented pilot; the [current research queue](../autonomy/questions.json) records subsequent progress.

1. Explain the [adoption routes](../military-robotics/adoption-routes.md): who specifies the need, supplies equipment or services, integrates the system and accepts the result. Follow existing projects into acceptance or actual service settlement.
2. Trace a named reusable component or software artifact through integration, qualification and support. Measure replacement or repeat-deployment work before assigning a bottleneck or scalable-platform thesis.
3. Use the [updated economics priority](task-economics/README.md#current-research-priority-and-workcell-options) to distinguish supplier revenue, customer responsibilities and all-party operating cost. Resolve legal identity and end use where they change those relationships.
4. Preserve the workbook and extracted import. Add reviewed claims in `ecosystem.json` and corrections in `reviewed-amendments.json`; rebuild the derived exports. A contract does not automatically establish technical maturity, acceptance or a higher score.
