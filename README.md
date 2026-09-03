# PLA Leadership Observatory

A source-first, public research site for analyzing Chinese military leadership, promotion pathways, institutional power, and unresolved personnel questions.

**Live site:** [pla-leadership-observatory.jordanschneider.chatgpt.site](https://pla-leadership-observatory.jordanschneider.chatgpt.site)

The project is designed to make uncertain personnel analysis inspectable. It separates what a source directly supports from what analysts infer, keeps adverse cases outside the active candidate universe, and treats promotion estimates as conditional structural judgments rather than biographical destiny.

## Current release

| Field | Value |
|---|---:|
| Data cutoff | 2 September 2026 |
| Active officer dossiers | 151 |
| Adverse-ledger records | 62 |
| Person-level source records | 301 |
| Official-primary/formal-decision sources | 179 |
| Research gaps | 16 open; 2 partly closed |
| Canonical build | `PLA26-V7-1090219E4E6A` |

These counts describe the checked-in release. The application reads the same canonical JSON that is published for download, and the test suite checks that they remain identical.

## Get the data

- [Public JSON](https://pla-leadership-observatory.jordanschneider.chatgpt.site/data/pla-leadership-observatory-public.json) — complete published research model, including officers, claims, sources, adverse records, held identities, system evidence, and collection gaps.
- [Public CSV](https://pla-leadership-observatory.jordanschneider.chatgpt.site/data/pla-leadership-observatory-public.csv) — one row per active officer for quick filtering and analysis.
- [`app/data/observatory.json`](app/data/observatory.json) — canonical data used by the interface.
- [`app/data/net-assessment.ts`](app/data/net-assessment.ts) — estimative layer: score ranges, candidate boards, scenarios, gates, backtests, task-leader fit, and collection priorities.

See [the data dictionary](docs/DATA_DICTIONARY.md) before using the fields quantitatively. Missing or contested values are not favorable evidence, and a source attached to an officer does not automatically support every field in that officer's dossier.

## What the site does

- Shows an evidence-scoped directory rather than a flat list of names.
- Distinguishes formal, acting, inferred, conflicting, stale, and unresolved role states.
- Scores candidates against a specified selection event using ranges across six structural components.
- Separates current-role evidence quality from promotion promise.
- Compares candidates under alternative selection regimes: institutional equilibrium, political control, operational readiness, and technical integration.
- Tracks disconfirmers and next observable gates, not only reasons a candidate might rise.
- Preserves an adverse-event firewall so removals and unresolved discipline cases do not leak into the positive universe.
- Publishes a prioritized collection plan for the highest-value unanswered questions.

## Analytical discipline

Every published personnel judgment should fit one of three categories:

1. **Documented fact:** a claim-scoped source directly supports the statement at a stated date.
2. **Reasonable inference:** multiple observations support an interpretation, but no formal act settles it.
3. **Speculation or collection hypothesis:** a proposition worth testing that is not presented as fact.

The headline score is a **Structural Promotion Index**, not an empirical probability. It measures the strength of a candidate's observable route to a defined future seat. Documentary completeness, hidden political clearance, operational effectiveness, and purge risk remain separate. Full definitions and known limitations are in [the methodology](docs/METHODOLOGY.md).

## Repository map

| Path | Purpose |
|---|---|
| `app/page.tsx` | Main analyst interface |
| `app/globals.css` | Editorial design system and responsive layout |
| `app/data/observatory.json` | Canonical documentary dataset |
| `app/data/net-assessment.ts` | Estimative judgments and structured scoring |
| `public/data/` | Downloadable JSON and CSV exports |
| `research/` | Checked-in primary-source additions, institutional pipelines, and current frontier ledger |
| `scripts/` | Import, update, build, and environment helpers |
| `tests/` | Data-integrity, model, component, and rendered-output checks |
| `docs/` | Data dictionary, methodology, and contribution protocol |

## Run locally

Requirements: Node.js 22.13 or later, npm, Linux or a compatible environment with GNU `timeout`.

```bash
npm ci
npm test
npm run dev
```

The development server is normally available at `http://localhost:5173`. Other useful commands:

```bash
npm run lint
npm run build
```

## Reproduce the checked-in public release

The current canonical release and its current research-frontier additions are checked in. To reapply the latest frontier, recompute the deterministic build ID, and regenerate both public exports:

```bash
node scripts/upgrade-v7-data.mjs
npm test
```

The earlier raw consolidation stage can also be rerun with:

```bash
node scripts/import-research-data.mjs /path/to/research_v2 app/data/observatory.json public/data
```

That command requires the archived `research_v2` source package, which is not yet part of this repository. The public repo therefore reproduces and verifies the checked-in canonical release and subsequent frontier transforms, but it does **not** yet reproduce every upstream extraction from raw source captures. This boundary is deliberate and should not be obscured.

## Contributing corrections

Personnel data becomes stale quickly, while Chinese official pages can move or silently change. Corrections are most useful when they identify the exact field, observation date, source URL, quoted title in Chinese, and what the source does **not** establish. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

## Citation

When citing the data, include the project title, canonical build ID, assessment cutoff, and either the relevant stable officer/claim IDs or the download URL. Stable IDs are intended to make corrections and comparisons traceable across releases.

Suggested form:

> PLA Leadership Observatory, build PLA26-V7-1090219E4E6A, data cutoff 2 September 2026, [stable ID or dataset URL].

## License

No reuse license has yet been granted. The repository can be viewed and audited publicly, but public visibility alone does not place the code, analysis, or data in the public domain. Source materials retain their original rights. A code/data license can be added once the project owner selects the intended reuse terms.
