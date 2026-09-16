# Reading edition validation — 15 September 2026

The revised working reading edition contains the introduction, seven chapters, conclusion and three appendices. This report records the checks after the developmental rewrites of the introduction, Chapters 1–6 and conclusion. The [edition manifest](reading-edition-manifest.json) identifies each source version and the generated HTML. [Build script](build-reading-edition.py) uses local Pandoc; [stylesheet](reading-edition.css) is embedded in the result. No source captures are included in the reading edition.

## Structural checks

- All 58 research JSON files parse; 434 source-reference checks and 266 proposition-reference checks pass.
- 543 hash-reference checks cover 513 distinct files, including source captures, unchanged baselines and reading-edition inputs/output.
- 926 local Markdown links resolve in the integration check. The HTML contains 804 unique internal IDs and 1,409 links; no duplicate IDs, broken internal anchors or missing local link targets were found.
- The three protected baseline files remain byte-identical to the recorded checkpoint. The separate assessment also preserves all 59 baseline objects and matches its displayed counts.
- All 266 manuscript footnote definitions match their uses, and 17 source-register count checks pass. Repository whitespace checks pass. These are structural checks, not automated historical verification.

Eight legacy hash records without a recoverable single path were not rechecked. One additional unmatched hash describes three explicitly excluded error-page captures in the 2023 crisis register; it is not accepted source evidence. The validation therefore does not claim to hash-check every previously inventoried asset.

## Rendering and navigation

An isolated local browser loaded all twelve parts. Desktop and 390-pixel mobile views were rendered, and all twelve part headings were located. In this pass, screenshots of the introduction, Chapters 1, 3, 4 and 6, and conclusion were visually inspected, along with the mobile Chapter 3 and chronology transitions. Earlier checks inspected the proposition appendix and contained horizontal table scrolling. The browser now finds 293 rendered source-note entries (including repeated citations), generated from 266 distinct chapter note definitions. The complete page width still equals the 390-pixel mobile viewport.

The reading edition is a continuous HTML document, not a paginated PDF. Internal contents and source-note links work; local supporting links require the accompanying repository. Layout checking is selective visual inspection plus whole-document link/width checks, not a claim that every screenful received a separate image review.

The [chapter and framing reviews](README.md#review-record), [proposition review](proposition-assessment-review-2026-09-15.md) and [apparatus review](apparatus-review-2026-09-15.md) record the substantive checks and their limits. The result is a working manuscript with a readable edition and traceable evidence. Chapter 7 development and a continuous whole-book edit remain. Separate agent reviews within this project do not constitute external peer review or a declaration of publication readiness.
