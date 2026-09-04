# Industrial base lane: civil-military robotics

This folder holds the second lane of the Observatory. The first lane asks who holds the PLA's senior positions. This lane asks which firms supply the robotics, autonomy and enabling components that the defense system depends on, and how much of that supply is civilian, dual-use or single-source.

The lane is published at `/robotics` on the site and rebuilt with one command:

```
python3 scripts/extract-industrial-base.py   # workbook -> scorecards-v1.2.json (deterministic, no hand edits)
node scripts/build-industrial-base.mjs       # scorecards + node chart -> app/data + public/data exports
node --test tests/industrial-base.test.mjs   # integrity checks (also run by npm test)
```

## What is here

`supplier-scorecards-v1.2/` is the China Defense-Industrial Atlas supplier scorecard package, version 1.2 (2026), added as received:

- `China_Defense_Industrial_Atlas_Supplier_Scorecards_v1.2.xlsx`: ten sheets. Read Me; Scorecard Ranking (evidence-gated supplier scores); Capability Assessments; Evidence Ledger (66 atomic evidence rows from 64 source URLs); Robots AI Drones (robotics, AI, drone and counter-drone entities); Foreign Dependencies; Signals & Gaps; Scoring Method; Source Register; Bibliographic Essay.
- `analysis.md`: the v1.2 narrative. 52 supplier-by-capability scorecards, 25 evidence-qualified and 27 provisional. Lanes: component or subsystem supplier (25), production enabler (11), unmanned-systems enabler (9), counter-UAS integrator (7).
- `audit.md`: the coverage, source and usability audit for v1.2, with the remaining high-value gaps.

`scorecards-v1.2.json` is the workbook extracted sheet by sheet by `scripts/extract-industrial-base.py`. The workbook stays the source of truth; the JSON is regenerated, never edited. Column headers become snake_case keys; the single-letter score columns become `criticality`, `frontier`, `cross_domain` and `evidence`.

`robotics-nodes.json` is the unit of collection for this lane, the way `research/positions.json` is for the leadership lane. It defines 28 capability nodes in nine tiers (sensing, navigation, actuation, compute, communications, autonomy, counter-UAS, production, test) and maps all 43 capability families in the workbook onto them. Six nodes are deliberately defined with no supplier yet (manipulation, edge AI, autonomy software, humanoid platforms, industrial robot arms on defense lines, simulation and digital twins). An empty node is a collection target and is shown as "no record", not omitted.

## What the build derives

`scripts/build-industrial-base.mjs` writes `app/data/industrial-base.json` (what the page reads) and two public exports, `public/data/industrial-base-robotics.json` and `public/data/industrial-base-robotics-scorecards.csv`. Everything on the page is computed from the ledger at build time:

- Scorecard tier: `evidence_qualified` (ranked, E3 or E4 evidence), `bounded` (evidence-qualified but not ranked) or `provisional` (self-description, pre-award or comparative test only).
- Node coverage: `evidence_qualified`, `provisional_only` or `no_record`, with the suppliers evidenced against each node.
- Trackers, one question each: procurement notices that name robotics or autonomy scope; sole-source and limited-source language, with the criticality-4 cases separated; foreign dependencies, dated and marked historical or current; the identity queue of provisional watchlist entities; the signals and gaps register.
- Findings R1 to R6 and research questions RQ-R1 to RQ-R5 live in `app/data/industrial-base-assessment.ts`. Counts inside a finding are tokens filled from the built data, so the text cannot drift from the numbers.

The rules carried over from the leadership lane: evidence-qualified before ranked, provisional shown as provisional, criticality capped at 3 unless the source itself uses sole-supplier language, foreign dependency kept out of domestic scoring, and every number on the page computed from the ledger.

## Why the refocus

The position framework showed that narrow, source-bounded questions produce defensible answers and that broad estimative questions do not. The same discipline applies to the industrial base. The scorecards already follow it: systemic importance is a bounded triage score, only evidence-qualified records enter a ranking, production automation sits in its own lane, and a single explicit sole-supplier case is the only fragility claim made.

The refocus narrows the question to robotics: production robotics (the CSSC robotic-grinding awards), unmanned platforms and their enablers (motion and electro-optical modules, inertial navigation, MEMS sensors, datalinks), the robot-dog and autonomy tenders, and the counter-UAS integrator layer.

## Next steps

1. Fill the six empty nodes: one evidence row per node from listed-company filings, procurement notices or export-control records, or a dated note that the sweep found nothing.
2. Resolve the identity queue: unified social-credit code, parent and production site for each provisional watchlist entity.
3. Chase final awards for the unmanned-platform and autonomy integrators; a completed contract with a military end user is what moves a provisional scorecard into the ranking.
4. Keep the workbook as the only input. A new package version means re-running the extraction, not editing the JSON; the tests fail if the extracted counts and the built counts disagree.
