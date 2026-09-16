# What the DS379 victory bought: research and development memo

15 September 2026. Bounded extension of the DS379 work for Chapter 3. The current Chapter 3 and its notes, the development priorities and original DS379 register were read before rewriting. The [proposed trade sequence](chapter-03-trade-replacement.md) is approximately 1,665 words before notes, compared with 1,727 in the existing trade opening. The chapter and shared indexes have not been edited. The [supplementary register](chapter-03-trade-register.json) records five newly acquired substantive documents/publications and one additional section of the previously acquired panel report. It leaves the original inventory intact.

The important discovery is the actual July 31, 2012 Commerce memorandum on laminated woven sacks. It shows the Chinese government, American producers and Commerce disputing what compliance required and which evidence could justify a commercial adjustment. This permits a narrative about a result being contested and partially obtained, rather than a catalogue of legal holdings. The exact explanation of Aifudi's larger countervailing rate remains only partly recoverable: the memorandum identifies the separate calculation, but does not reproduce its decisive attachment.

## Acquisition and reading

The live Commerce URL returned an unrelated scientific-instrument duty-free application. A successful HTTP response and a PDF extension therefore did not establish recovery. An archived copy from September 11, 2023 supplied the correct 46-page memorandum, including Commerce header, July 31, 2012 date, case numbers A-570-916/C-570-917, barcode 3089955-01, filing information, recommendation and approval page. The complete document, all notes and its reference attachment were read; truncated output around page 30 was reread. The rate table on page 38 was visually checked.

All originals remain outside Git in:

`/Users/jorsc/.codex/.chatgpt-projects/g-p-6a94dd290a988191911d85ae8fe94a6c/tmp/pdfs/research-2026-09-15/chapter-03-development/`

| Source | Decisive location | Capture |
|---|---|---|
| DEV-DS01, Commerce final memorandum | Entire 46 pages; locators below | `sacks-section129-final-2012.pdf` |
| DEV-DS02, WTO September 28 minutes | Item 7, paragraphs 90–92, printed/PDF 19 | `dsb-minutes-322.pdf` |
| DEV-DS03, Chen Weidong analysis | Sections III and V, corresponding notes, title and author identification | `chen-weidong.html` |
| DEV-DS04, 2016 implementation notice | 81 FR 23457–23459, target notice complete, PDF 1–3 | `fr-lws-2016.pdf` |
| DEV-DS05, CIT judgment | Complete one-page March 30, 2016 order | `cit-16-30.pdf` |
| DEV-DS06, expanded panel reading | Paragraphs 9.149–9.164, printed 103–107/PDF 123–127 | Existing `../ds379/panel.pdf` |

The register contains byte counts and SHA-256 hashes. The WTO minutes' cover gives November 23, 2012 as circulation date; September 28 is the meeting. The three-page 2016 notice was first read from the daily issue, then preserved separately. The original court judgment independently resolves the March 23/March 30 date ambiguity in later summaries: the remand was March 23 and the judgment March 30.

## The larger countervailing rate: what is now known

The final memorandum's page 38 reports 29.54 percent as Aifudi's investigation countervailing rate and 83.34 percent as its revised rate. The increase is 53.80 percentage points. The same arithmetic increment appears for the other rows, including all others; that pattern is a fact about the table, not proof that every exporter had an identical newly calculated subsidy or received the same treatment in practice.

Page 37, note 103, and page 38, note 105 direct the reader to **Attachment 3 of the Sacks Section 129 Preliminary CVD Calculation Memorandum**. Page 44 identifies that memorandum as the May 18, 2012 public-body redetermination calculation concerning the **provision of petrochemicals at less than adequate remuneration**. Page 2 adopts the preliminary findings, including supplier categories in proprietary attachments, without changes. These references locate the computation in the petrochemical-input/public-body work. They do not disclose its full calculation.

The standalone calculation and Attachment 3 were not recovered. Consequently, the narrative cannot establish how much of the increase came from changed supplier classifications, additional covered purchases, benefit valuation, denominators or treatment of missing information. It must not label the increase punishment for winning, attribute it to the land decision, or convert it into a cash burden borne by Aifudi on a known quantity of exports. An indexed Chinese secondary passage attributes the increase to facts available, but that source was not fully acquired and its assertion is not used. The final memorandum says on page 2 that the WTO facts-available issue concerned the two pipe proceedings; that alone neither establishes nor excludes use of particular substitutes for information elsewhere in the sacks calculation.

The narrower commercial claim is secure: the legal result did not require Commerce to erase countervailing duties or to reproduce the old rates while improving its explanation. The memorandum and implementation notice record a new determination with a higher CVD rate. The source gap is now a particular calculation attachment, rather than the entire agency reasoning.

## A concrete example of a finding made again

The newly read panel paragraphs 9.149–9.164 explain the land issue behind Commerce's pages 2–6. The panel distinguished a finding of specificity from the separate valuation of the benefit. It rejected reasoning under which provision of land became regionally specific simply because it lay in a designated area. It expressly allowed that evidence of distinctive pricing, special rules or another distinct regime could support a different determination; it did not itself find that such a regime existed or did not exist.

Commerce reopened the record. China supplied a 1992 Huantai County land-price circular absent from the original investigation. The government argued that the county had used the circular and neighboring transactions in accordance with applicable law. The agency regarded the circular as evidence of district-specific pricing and discussed the long period of fixed prices, favorable treatment of foreign-invested enterprises and investment-linked preferences. It rejected China's explanations and maintained the specificity finding. These are Commerce's findings and its account of China's responses, not a new independent determination that the land was subsidized on the claimed terms.

This exchange gives the general practical warning substance. A party can win an objection to the investigation and then face a renewed finding built partly from information it supplies. The land discussion illustrates that mechanism; it is deliberately separated from the unexplained magnitude of the CVD increase.

## The anti-dumping adjustment was a contested result

Pages 17–20 record American producers arguing that the respondents had not demonstrated entitlement to a double-remedy adjustment. Commerce rejected that argument. Its account identifies Chinese government descriptions of industry conditions, respondent accounting treatment of inputs, and supplementary manufacturing data as the basis for finding a link sufficient to justify an adjustment in these proceedings. Pages 25–26 acknowledge the limitations of an aggregate proxy and the compressed schedule. This is stronger evidence of usable technical participation than merely observing China's presence in a tribunal.

China nevertheless contested the method. Pages 21–24 record objections to limiting the analysis to input subsidies and to using ratios of percentage changes in costs and prices. Pages 26–29 discuss China's competition/pass-through argument. Pages 31–37 address its broader claim that the non-market-economy normal-value calculation itself offset subsidies and warranted a fuller adjustment. Commerce rejected the demand for assumed full pass-through, explaining that cost and price effects need not coincide dollar for dollar. The agency was not simply adopting the American petitioners' preferred result: it also rejected their demand for no adjustment and several narrower alternatives.

The page 39 table compares **original weighted-average dumping margins** with **revised AD cash-deposit rates**. For Aifudi the figures are 64.28 and 20.19 percent. They must retain those distinct labels. The original implementation notice, 77 FR 52688, specifies prospective application to entries from August 21, 2012 and preserves superseding administrative-review rates. Neither table proves deposits actually paid immediately before/after implementation, eventual assessments or restored sales. The memorandum's page 38 pass-through paragraph contains a copied reference to the OTR tyres industry; the rewritten passage relies on the full substantive discussion and correctly labeled sacks table, not that sentence.

## China's response and the later limit on relief

The September 28 WTO minutes, paragraphs 90–92, directly record China's opposition to the American full-compliance claim. China also welcomed the offer of further discussion, recalled the May sequencing agreement and reserved its rights. This supports a combination of dialogue and a reserved legal option; it does not show a completed follow-up negotiation or explain why China did not obtain a later DS379 compliance judgment in the examined record.

Chen Weidong's contemporary analysis adds a Chinese scholarly warning about litigation's return: interpretation gains and commercial relief differ, and further proceedings consume time and require strategic choices. The draft uses that argument briefly. His proposed explanations of official decisions are not adopted. The online reproduction's July 13 date and several compressed legal descriptions are checked against the originals, which control.

The 2016 notice supplies a necessary short coda to any positive account of the AD adjustment. After domestic litigation, Commerce took a voluntary remand and withdrew the adjustment. Judge Leo Gordon's March 30 order sustained the remand results with all parties' agreement that they followed the court's instructions. The notice lists Aifudi's AD deposit rate at 64.28 percent for relevant entries from April 11, unless an intervening review had superseded it. This is evidence of the adjustment's withdrawal in that domestic proceeding. It is not a WTO compliance ruling or a reconstruction of all entries affected. The underlying remand memorandum remains unacquired, so the draft does not purport to adjudicate the economic reasoning that led to the withdrawal.

## Integration and argument

The revised opening begins with the rate increase, then asks what decision the WTO victory actually changed. It compresses the public-body and double-remedy holdings to the distinctions needed to understand renewed investigation. The land circular supplies a particular piece of evidence being argued over. The AD adjustment supplies an identifiable favorable decision opposed by domestic producers and contested by China as insufficient. The final movement uses the signed May procedure and September statements to show how the governments could preserve a channel for discussion and a route to further challenge at once.

The practical conclusion concerns litigation and negotiation design: anticipate what the counterpart can decide again, what evidence a second proceeding will require and whether a procedural gain is likely to translate into usable relief. It is an inference from the documented choices, not a claim that Chinese officials followed one unified strategy or that expertise displaced political authority. The benchmark adjustment in the tyre record remains a separate, earlier example; it is not blended into the sacks implementation.

Prior notes 4, 9, 10 and 13 are unused by the replacement; the essential consultation-scope limit from 4 is retained in revised note 3, and the actual minutes replace the summary-level evidence in 13. Other original notes retain their subjects. New `DS-new1`–`DS-new5` notes correspond to DEV-DS01–06, with the 2016 notice and judgment sharing one note. Root should update the chapter endpoint for the narrow 2016 coda and integrate the climate transition and final synthesis. No further acquisition is necessary to use this fragment at the current checkpoint; the missing attachment remains explicitly bounded.
