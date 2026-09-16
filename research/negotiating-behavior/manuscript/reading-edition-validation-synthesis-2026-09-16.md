# Reading edition validation — historical synthesis, September 16, 2026

This report covers the revision beginning at `b7eadd4`. The [integration checkpoint](development/historical-synthesis-integration-2026-09-16.md) identifies acquisitions, actual reading scopes, source limitations and applied editorial changes. The [manifest](reading-edition-manifest.json) identifies the twelve rendered parts and their exact hashes. The checks below concern integrity, navigation and selected visual presentation; they are not an automated historical fact check or a declaration of publication readiness.

## Integrity and navigation

All 84 research JSON files parse. Checks pass for 458 source references, 286 proposition references, 905 hash references covering 835 distinct files, and 1,310 local Markdown links. All 315 manuscript footnote definitions match their uses; 32 register counts match their entries. The generated HTML has 917 unique IDs and 1,707 links, with no duplicate IDs, broken internal anchors or missing local targets. Repository whitespace checks pass.

The three protected baseline files and all 59 assessment baseline objects remain unchanged. Verdicts remain 16 retained within tested scope, 38 unresolved and 5 untested. The chronology has 71 rows; the case ledgers have 198 observations. The scholarly ledger records 24 complete works, with the Roberts review separately classified. The EP-3 archive now contains 17 distinct cables, 107 physical pages. These totals measure recorded work, not independent corroboration or representative samples.

Nine legacy hash records lack a path recognized by the checker and were not rechecked. One additional unmatched hash identifies explicitly excluded error-page captures. No failed retrieval is accepted as source evidence. Raw captures remain outside Git. These exclusions are preserved from the preceding validation.

## Rendering and review

The browser located all twelve part headings and 351 rendered note entries, including repeated citations. The edition retains the introduction, seven chapters, conclusion and three appendices. The nine narrative bodies total 34,196 whitespace-delimited words before their Notes sections, including headings and inline note markers. The final HTML is 696,599 bytes.

The editor visually inspected the November 28 claims exchange, the reordered WTO procedure and the May aircraft passage on desktop, and the conclusion's ending at a 390-pixel mobile width. After rebuilding for the final translation correction, the editor also inspected the Chinese briefing passage. The inspected views have legible text and hierarchy, without clipping or overlapping elements. The mobile document width equals the viewport. Additional checks locate the July 1975 and residual-risk paragraphs. Visual inspection is selective; it does not cover every screenful. Supporting local links require the repository.

The continuous review at the starting commit read all nine narrative bodies. Independent bounded checks then examined the archival inserts and revised framing. A [second full reading](development/continuous-reading-integrated-2026-09-16.md) covers the integrated narrative; the checkpoint records its coverage and the final translation correction. The reviewer checked that correction and verified it was the only subsequent body change. Structural checks cannot fill missing documentary evidence, and internal review does not establish external editorial acceptance.
