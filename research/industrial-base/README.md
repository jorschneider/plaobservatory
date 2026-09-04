# Industrial base lane: civil-military robotics

This folder starts a second lane for the Observatory. The first lane asks who holds the PLA's senior positions. This lane asks which firms supply the robotics, autonomy and enabling components that the defense system depends on, and how much of that supply is civilian, dual-use or single-source.

## What is here

`supplier-scorecards-v1.2/` is the China Defense-Industrial Atlas supplier scorecard package, version 1.2 (2026), added as received:

- `China_Defense_Industrial_Atlas_Supplier_Scorecards_v1.2.xlsx`: ten sheets. Read Me; Scorecard Ranking (evidence-gated supplier scores); Capability Assessments; Evidence Ledger (66 atomic evidence rows from 64 source URLs); Robots AI Drones (robotics, AI, drone and counter-drone entities); Foreign Dependencies; Signals & Gaps; Scoring Method; Source Register; Bibliographic Essay.
- `analysis.md`: the v1.2 narrative. 52 supplier-by-capability scorecards, 25 evidence-qualified and 27 provisional. Lanes: component or subsystem supplier (25), production enabler (11), unmanned-systems enabler (9), counter-UAS integrator (7).
- `audit.md`: the coverage, source and usability audit for v1.2, with the remaining high-value gaps.

The package is a source, not yet part of the built site. Nothing in it is merged into `app/data/observatory.json`.

## Why the refocus

The position framework showed that narrow, source-bounded questions produce defensible answers and that broad estimative questions do not. The same discipline applies to the industrial base. The scorecards already follow it: systemic importance is a bounded triage score, only evidence-qualified records enter a ranking, production automation sits in its own lane, and a single explicit sole-supplier case is the only fragility claim made.

The refocus narrows the question to robotics: production robotics (the CSSC robotic-grinding awards), unmanned platforms and their enablers (motion and electro-optical modules, inertial navigation, MEMS sensors, datalinks), the robot-dog and autonomy tenders, and the counter-UAS integrator layer.

## Next steps

1. Extract the workbook into checked-in JSON (`research/industrial-base/*.json`): scorecards, evidence ledger, robots-AI-drones entities, foreign dependencies, signals and gaps. One script, no hand edits, so the workbook stays the source of truth.
2. Define the unit of collection for this lane the way positions were for the first: a chart of robotics capability nodes (sensing, actuation, navigation, compute, autonomy software, integration, test and production tooling), each with the firms evidenced against it, the evidence level, and a "no record" state when the node is empty.
3. Add trackers that answer one question each from bounded official sources: PLA and CSSC procurement notices naming robotics or autonomy scope; listed-company filings that disclose defense customers or sole-source language; export-control orders naming Chinese counterparties; unified social-credit-code and parent resolution for the private robotics firms flagged for identity follow-up.
4. Carry over the same rules: evidence-qualified before ranked, provisional shown as provisional, criticality capped without sole-source language, foreign dependency isolated from domestic scoring, and every number computed from the ledger.
5. Site: a Robotics tab on the same page skeleton (framework statement, node chart, scorecards, evidence explorer, gaps), reusing the coverage-state and plain-language conventions.
