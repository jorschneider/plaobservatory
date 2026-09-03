# PLA Leadership Observatory

We start from a fixed chart of the PLA's senior positions and ask, for each one, who holds it and how we know. Names enter the site only through a position. A seat we cannot fill is shown as empty, never hidden. Removed officers go to a separate ledger where we record when they were last seen with their title, the first public sign of trouble, and the formal action, and we measure the gaps. Everything else on the site is a narrow tracker that answers one question from a bounded set of official sources.

**Live site:** [pla-leadership-observatory.jordanschneider.chatgpt.site](https://pla-leadership-observatory.jordanschneider.chatgpt.site)

## Current release

All values are from `metadata` in app/data/observatory.json.

| Field | Value |
|---|---|
| Data cutoff | 2 September 2026 |
| Build ID | `PLA26-V8-14E18B4FCE64` |
| Active officer dossiers | 150 (131 mapped to a position, 19 outside the archetype with a reason) |
| Positions | 179 in nine tiers: 156 principal seats and 23 bench slots |
| Adverse-ledger records | 63 |
| Ledger clock | 8 complete, 45 partial, 10 not yet collected |
| Trackers included | `npcTerminations`, `promotionCeremonies`, `titleFreshness` |
| Review-log entries | 5 |

Three further trackers (the 20th Central Committee cohort, event attendance, seat turnovers) are defined in the build but their input files are not yet in `research/trackers`, so they are absent from this build. See docs/COLLECTION_METHOD.md, section 5.

## What the site shows

- **Overview.** The framework, coverage tiles for the 156 principal seats, the judgments with what each rests on, and the research questions.
- **Positions.** The coverage board: every seat by tier with its coverage state, holders, handlers, linked removals and search lane.
- **Officers.** The directory of active dossiers, each with its position links and the claim-scoped sources behind its title.
- **Ledger.** The adverse ledger with the disappearance clock for each record: last titled appearance, first concrete signal, formal action, and the day counts between them.
- **Trackers.** Narrow measurements, one question each from a bounded set of official sources: NPC deputy terminations, full-general promotion ceremonies, and the title-freshness monitor.
- **Routes.** What past winners looked like, kept as frequencies without scores, and a succession watch of seats that are vacant, acting or handled.
- **Evidence.** The sources explorer and the evidence rules: what an observation proves, how Chinese titles are read, calibration cases, release rules.
- **Method.** How the site was built, the glossary, the premise register, the review log, known limits and downloads.

## Get the data

- [Public JSON](https://pla-leadership-observatory.jordanschneider.chatgpt.site/data/pla-leadership-observatory-public.json): the full dataset, including positions, officers, claims, sources, the adverse ledger with its clock, trackers and the review log.
- [Public CSV](https://pla-leadership-observatory.jordanschneider.chatgpt.site/data/pla-leadership-observatory-public.csv): one row per active officer.
- [`app/data/observatory.json`](app/data/observatory.json): the same data as read by the interface.

The CSV has twenty columns. Four are new in this release: `days_since_title`, `archetype_status`, `position_ids` and `unmapped_reason`. The CSV omits claims, sources, adverse records, positions and trackers; use the JSON for anything that needs to be checked. Read [the data dictionary](docs/DATA_DICTIONARY.md) before using any field quantitatively. Missing values are not favorable evidence.

## How it was built

The unit of collection is a position, not a name: a fixed chart of 179 senior positions defines what is covered and what is a gap, and every officer is either linked to a seat or listed as outside the chart with a reason. Each seat's coverage state is computed by one rule from the quality of the sources naming its holder, and each removed officer's clock is computed from dated records that carry a URL and the exact Chinese title. The full account, including which sources were swept, which hosts were reachable, and what is not reproducible from this repository, is in [docs/COLLECTION_METHOD.md](docs/COLLECTION_METHOD.md); the reasoning rules are in [docs/METHODOLOGY.md](docs/METHODOLOGY.md).

## Reproduce

Requirements: Node.js 22.13 or later, npm, and a Linux-compatible environment with GNU `timeout`.

```bash
npm ci
node scripts/build-v8-data.mjs
npm test
npm run lint
npm run dev
```

The build script reads the files under `research/` and writes `app/data/observatory.json`, `public/data/pla-leadership-observatory-public.json` and `public/data/pla-leadership-observatory-public.csv` under one build ID. `npm test` builds the site and runs the test suite. The development server is normally at `http://localhost:5173`.

One boundary is deliberate. The original officer list came from an upstream extraction called research_v2, which is not in this repository. The build starts from the checked-in result of that stage, `research/base/observatory-v7.json`. Everything after that point is reproducible here; the research_v2 stage is described, not reproduced.

## Review log

What the September 2026 external review said and what changed in response is in [docs/REVIEW_LOG.md](docs/REVIEW_LOG.md).

## Repository map

| Path | Purpose |
|---|---|
| `app/page.tsx` | The interface |
| `app/data/observatory.json` | Canonical dataset (generated) |
| `app/data/assessment.ts` | Framework text, judgments, premise register, research questions, glossary, evidence rules, route evidence, limits |
| `research/positions.json` | The position archetype and the officer-to-seat mapping |
| `research/adverse-timeline.json` | The disappearance clock for the adverse ledger |
| `research/trackers/` | Tracker input files (optional) |
| `research/review-log.json` | Dated review entries |
| `scripts/build-v8-data.mjs`, `scripts/lib/v8-rules.mjs` | The build and its shared rules |
| `public/data/` | Downloadable JSON and CSV (generated) |
| `tests/` | Data-integrity and rendered-output checks |
| `docs/` | Collection method, data dictionary, methodology, review log |

## Contributing corrections

Personnel data goes stale quickly, and Chinese official pages can move or change. A useful correction names the exact field, the observation date, the source URL, the exact Chinese title as printed, and what the source does not establish. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## Citation

Include the project title, the build ID, the data cutoff, and either the relevant stable ID (officer, position, claim or adverse record) or the download URL.

> PLA Leadership Observatory, build PLA26-V8-14E18B4FCE64, data cutoff 2 September 2026, [stable ID or dataset URL].

## License

No reuse license has yet been granted. The repository can be viewed and audited publicly, but public visibility alone does not place the code, analysis, or data in the public domain. Source materials retain their original rights. A code/data license can be added once the project owner selects the intended reuse terms.
