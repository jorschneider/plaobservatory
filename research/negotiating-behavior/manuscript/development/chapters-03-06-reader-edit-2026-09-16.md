# Chapters 3 and 6: implemented reader edits

September 16, 2026. Implemented the specifically authorized opening/chronology and sequence recommendations from [the continuous reading](continuous-reading-66ffce8.md). Only the two chapter files and this note were edited. No source acquisition, reading-count change, shared index, export, build or commit.

**Chapter 3** now opens with the recovered Huantai land-price argument: material China supplied in defense became part of Commerce's renewed case. The text attributes the administrative exchange to Commerce's account and preserves the distinction between the panel's rejection of the earlier reasoning and the agency's subsequent finding. The detailed later retelling was shortened. The 29.54/83.34 percent comparison remains in the body, with its determination-rate qualification and the unrecovered-calculation limit. It is expressly not attributed to the land finding. Note 12 was revised to describe the relocated comparison; all other supporting note definitions are unchanged.

The climate narrative now begins at Copenhagen, moves through the intervening preparation and institutions, and introduces the January 2014 proposal at “National choice and reciprocal acceptance.” Stern's 2009 standing paragraph moved into the Copenhagen section. The redundant “Making two different promises together” heading and second introduction of the 2014 proposal were removed. First appearances now identify Obama, Hillary Clinton, Stern and Xie, so the move does not leave unexplained names or confuse the two Clintons. The divergent Froman/Saran accounts and all qualifications on authority, targets, domestic priorities and Paris obligations remain.

**Chapter 6** now moves from the purchase shortfall to “Permissions in exchange for permissions,” then returns to “The cost of enforcing an agreement.” The licensing and enforcement sections moved intact. Their distinction between a separate licensing transaction, the Phase One shortfall and the domestic Section 301 investigation remains explicit. The 2026 mechanism paragraph is unchanged. A new closing paragraph returns to Gackle and Cooper's different exposure to further pressure, without attributing policy decisions to either witness or treating preliminary mechanisms as operating agreements. Every source-note definition in Chapter 6 is unchanged.

## Verification

Reread the changed Chapter 3 opening, the shortened land/rate passage, the complete reordered Copenhagen-to-2014 sequence, and all Chapter 6 section joins and the new ending. Reviewed the Chapter 3 diff. No in-repository link targets the removed heading's anchor. `git diff --check` passed for both chapters.

All **41** Chapter 3 note definitions and all **49** Chapter 6 definitions remain used in their respective narrative bodies. No missing definitions, unused definitions, duplicate definitions, newly introduced note IDs or removed note IDs. These are local document checks, not changes to the book's scholarly-reading count.

| File | Before SHA-256 | After SHA-256 | Body words, before → after |
|---|---|---|---:|
| `chapters/03-usable-expertise.md` | `709ff80a0eee87b71b863ddbcf3505327ce338e8135a44c3ea6e453ba4737c53` | `8a615c65a7af180481629e20a355902c58999db0b76392d0ef53f8c57609a5e7` | 4,792 → 4,639 |
| `chapters/06-after-the-signature.md` | `99bf0bd06872cd45bb5ded67a400cc111b1bf1dda6fd9fbdb49627a0695d6e69` | `8e27f96dfca46781c9518a27316eccd298b1903d89dce68b19a46d5d029604f9` | 4,608 → 4,593 |

Starting versions are the exact `66ffce8` snapshots recorded in the continuous-reading memo. Chapter 4 and the proposed wider coda cuts remain with the parent; they were not implemented here.
