# Reading edition validation — 15 September 2026

The revised complete reading edition contains the introduction, seven chapters, conclusion and three appendices. The [edition manifest](reading-edition-manifest.json) identifies each source version and the generated HTML. [Build script](build-reading-edition.py) uses local Pandoc; [stylesheet](reading-edition.css) is embedded in the result. No source captures are included in the reading edition.

## Structural checks

- All 50 research JSON files parse; 434 source-reference checks and 266 proposition-reference checks pass.
- 455 hash-reference checks cover 430 distinct files, including source captures, unchanged baselines and reading-edition inputs/output.
- 808 local Markdown links resolve in the final integration check. The HTML contains 696 unique internal IDs and 1190 links; no duplicate IDs, broken internal anchors or missing local link targets were found.
- The three protected baseline files remain byte-identical to the recorded checkpoint. The separate assessment also preserves all 59 baseline objects and matches its displayed counts.
- Manuscript footnote and source-register count checks pass. Repository whitespace checks pass. These are structural checks, not automated historical verification.

Eight legacy hash records without a recoverable single path were not rechecked. One additional unmatched hash describes three explicitly excluded error-page captures in the 2023 crisis register; it is not accepted source evidence. The validation therefore does not claim to hash-check every previously inventoried asset.

## Rendering and navigation

An isolated local browser loaded all twelve parts. Desktop and 390-pixel mobile views were rendered. The title, chapter transitions, proposition appendix and chronology were visually inspected across the initial and revised render checks; all twelve part headings were located. The browser found 236 rendered source-note entries (including repeated citations), generated from 227 distinct chapter note definitions. A mobile table-width problem was fixed by containing horizontal table scrolling; the corrected page width equals the 390-pixel viewport.

The reading edition is a continuous HTML document, not a paginated PDF. Internal contents and source-note links work; local supporting links require the accompanying repository. Layout checking is selective visual inspection plus whole-document link/width checks, not a claim that every screenful received a separate image review.

The [chapter and framing reviews](README.md#review-record), [proposition review](proposition-assessment-review-2026-09-15.md) and [apparatus review](apparatus-review-2026-09-15.md) record the substantive checks and their limits. The result is a complete research manuscript with a readable edition and traceable evidence. Separate agent reviews within this project do not constitute external peer review or a declaration of publication readiness.
