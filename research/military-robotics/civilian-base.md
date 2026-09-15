# China's civilian robotics base: industrial depth and the work it can supply

Reviewed and accessed 2026-09-15. The [ChinaTalk conversation with Niko Ciminelli and Reyk Knuhtsen](https://www.chinatalk.media/p/the-robots-are-here) frames iteration, manufacturing and supplier depth as central explanations for Chinese robotics progress. Here that interview thesis becomes a set of testable industrial questions.

**The evidence supports substantial manufacturing and adoption, with an illustrative supplier combining internal production and outside purchasing. The military implication is a resource base to draw on; a measured advantage in delivering an accepted military system remains a separate question.** Read the [five-layer reuse comparison](civilian-reuse.md) for concrete components, interfaces, training resources and integration experience, and [adoption routes](adoption-routes.md) for the receiving organizations.

These industrial-robot statistics establish context for the civilian ecosystem; they do not isolate civilian from military end users. They are not a military-market estimate or a census of humanoids, autonomous vehicles, or all robotics businesses.

| ID | Indicator and reporting period | Published observation | Measurement boundary |
| --- | --- | --- | --- |
| CB01 | NBS industrial-robot production, 2024–2026 | 2024: **556,369 sets**, +14.2% (published 2025-01-17). 2025: **773,074 sets**, +28.0% (2026-01-19). January–August 2026: **729,352 sets**, +29.0% (2026-09-15). [S7, S1, S2] | Output of industrial enterprises with annual principal-business revenue of at least RMB20m. Growth uses NBS's comparable reporting population; output is neither sales nor capacity. The 2026 figure is eight months, not an annual forecast. |
| CB02 | IFR new industrial-robot installations in China, 2024 | **295,000 units**, +7%; **54%** of worldwide installations (2025-09-25). [S3] | Location of market demand. IFR's headline installations can include shipment proxies; this is not a count of robots manufactured by Chinese suppliers. |
| CB03 | IFR Chinese suppliers' share of domestic installations, 2024 | **57%**, versus 47% in 2023. Electronics: **59%** of 83,000 installations; automotive: **31%** of 57,200. [S3] | Unit shares within each Chinese customer-industry market. “Chinese suppliers” is IFR's classification; these percentages do not measure domestic component content, ultimate ownership, revenue share, or global share. |
| CB04 | IFR manufacturing robot density, 2024, updated publication | **166 robots per 10,000 manufacturing employees**, +17% year over year; 22nd worldwide (2026-04-08). [S5] | Estimated operational stock divided by manufacturing employment, using updated NBS labor data. An economy-size normalization, not an autonomy or productivity score. |

The 2026-02-28 [NBS annual communiqué](https://www.stats.gov.cn/sj/zxfb/202602/t20260228_1962662.html), table 3, corroborates 2025 industrial output at rounded **77.3万套**, +28.0%.

## Reconcile before interpreting

**Production and installations are different flows.** Even for 2024, subtracting IFR's 295,000 installations from NBS's 556,369 output would not establish exports, inventory accumulation or overcapacity. The product populations and coverage have not been reconciled; imports, exports and timing also intervene. A plant in China and an IFR-classified Chinese supplier are different attributes. Neither series supplies robot-industry revenue. [S7, S3, S4]

**Do not recalculate growth from mismatched vintages.** The raw 2025/2024 published NBS levels imply roughly 39%, whereas NBS reports +28.0%. Its notes explicitly explain that prior-period comparisons are adjusted toward the current enterprise population and remove identified cross-regional duplication within groups. Use the published comparable-base rate; this discrepancy alone does not demonstrate an error. [S1, S7]

**IFR is also a constructed statistical series.** It consolidates supplier and national-association reporting; CRIA contributes Chinese-supplier data and is restricted to member statistics. IFR accepts shipments where actual installation data are unavailable, creating potential location and timing differences. China's operational stock is estimated by accumulating installations over 12 years, rather than observing every surviving robot. Industrial statistics cover multipurpose manipulators, generally with at least three axes; mobile platforms are treated separately. [S4, §§1.2, 1.5–1.8]

**The density revision changes the comparison.** The September 2025 foreword reported **567** for China in the same reporting year, 2024. The April 2026 release gives **166** and expressly identifies updated NBS employment data. This is not evidence that robots disappeared or capabilities deteriorated. The April release supplies +17% growth but no revised historical China panel, exact employment headcount or named labor-series identifier. Do not splice earlier density vintages into a trend or infer how every prior year changed. [S8, S5]

## What is newer, and what remains pending

IFR's **2026-06-24** presentation reports **621,000 global 2025 installations**, +15%, explicitly preliminary as of April 2026. It schedules World Robotics 2026 for **2026-09-24**, after this memo's cutoff. This published preliminary estimate can be cited as such; the future report cannot. The deck does not provide an exact China 2025 installation count. [S6, slides 4–7]

The [2026-06-18 IFR US release](https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth), “United States vs. China,” expressly says China's preliminary results were unpublished and gives only an approximate comparison with the US. Do not manufacture an exact China count from that comparison. The latest exact China annual count located here remains 2024.

## Unitree: specify the production boundary behind “vertical integration”

Unitree's July 2026 filing describes internal final-robot/core-module production and assembly alongside customized purchased parts and external processing; most mechanical parts are custom purchased. Assembly is primarily manual and uses substantial outsourced labor. In FY2025 its five largest raw-material suppliers represented **22.54% of raw-material purchases**; external-processing procurement was **RMB23.55m, 3.50% of cost of sales (营业成本)**. The latter excludes separately discussed outsourced labor and is not a total outsourcing ratio. During the 2023–2025 reporting period, imported materials bought through domestic agents were approximately **20% of raw-material purchases**; no annual split is supplied in that passage. [S9, printed pp23, 106–107, 148–149, 232]

**Analytical implication:** internal engineering and assembly can coexist with extensive supplier use. Domestic purchasing intermediaries do not establish domestic component origin. Spend concentration alone does not measure substitutability, while external purchases alone do not measure design dependence. The case does not measure comparative iteration speed or military qualification cost.

## Analytical use

**Inference:** substantial production and domestic adoption make repeated work on actuation, controls, integration, commissioning and maintenance plausible sources of reusable engineering experience. They do not measure how quickly that experience transfers to a different application. The electronics/automotive supplier-share contrast argues for tracing particular suppliers and customer requirements, rather than assuming a uniform national advantage. These data establish neither domestic independence at every component layer nor military adoption, ruggedness, autonomous performance, or value capture.

One source inconsistency is intentionally excluded from the panel: S3 gives Chinese suppliers 90% of China's metal/machinery installations, while IFR's [2026-05-05 release](https://ifr.org/ifr-press-releases/news/china-makes-ai-powered-robots-core-of-national-strategy), “China's Domestic Market Potential,” says 85% without reconciling the change. Do not silently choose one as a new reporting year.

## Primary-source ledger and verification

All artifacts accessed 2026-09-15. HTML tables were checked against downloaded originals. Relevant PDF pages were rendered and visually checked: S3 p1; S4 printed p27/PDF12; S6 slides 4, 5 and 7; S8 printed p3/PDF4. Other cited method sections were text-checked. SHA-256 identifies retrieved bytes, not a guarantee against later publisher revision.

| Source | Title, date and locator | SHA-256 |
| --- | --- | --- |
| [S1](https://www.stats.gov.cn/sj/zxfb/202601/t20260119_1962329.html) | NBS, 2025年12月份规模以上工业增加值增长5.2%, 2026-01-19 10:00; main table 工业机器人 row, January–December columns; notes 2–3. | `26b1c5458d483c9be7ef53b7dacd1a97a3c26c0d73448312cb9ad6b24eb8d41f` |
| [S2](https://www.stats.gov.cn/sj/zxfb/202609/t20260915_1965308.html) | NBS, 2026年8月份规模以上工业增加值增长5.2%, 2026-09-15 10:00; main table 工业机器人 row, January–August columns; notes 2–3. | `ea8ea06141f0163ac0db50c50b2bf12c8ad602b18bcb1dbfaa96b59ff0950439` |
| [S3](https://ifr.org/downloads/press_docs/2025-09-25-IFR_press_release_China_in_English.pdf) | IFR, China Tops World Record of 2 Million Factory Robots, 2025-09-25; PDF p1, opening and supplier/customer-industry paragraphs. | `ef6ce7ef7c2439e66de21ca19997f988e3369efb84f32135617cb56069054e7f` |
| [S4](https://ifr.org/img/worldrobotics/Sources___Methods_WR_2025_Industrial_Robots.pdf) | World Robotics 2025, Sources and Methods; released with report 2025-09-25; printed pp22–23, 27–31/PDF7–8,12–16. | `624f60b985175b41e2b1875b289da43f79b338fdb4653f70dc23cfe3238958a6` |
| [S5](https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas) | IFR, Robot Density Surges in Europe, Asia, and Americas, 2026-04-08; “Robot density by region,” China paragraph; “About Robot density.” | `cdb4047bcfeabedb2ad0445ecae024cb97dbbcf3d7bf2d47586384f4b7f8f84a` |
| [S6](https://ifr.org/downloads/press_docs/2026_06_24_IFR_Executive_Roundtable_market_presentation.pdf) | IFR Robotics Executive Roundtable, 2026-06-24; slides/PDF pages 4–7. | `2f92808aa4d875dd9e2ee4187aeba81cdb988d7c66572e911b5186c30b64185d` |
| [S7](https://www.stats.gov.cn/sj/zxfb/202501/t20250117_1958331.html) | NBS, 2024年12月份规模以上工业增加值增长6.2%, 2025-01-17 10:00; main table 工业机器人 row, January–December; notes 2–3. | `55c5f36a459e8400be0fe96dc4708b5cb0067c08dd461b5c4cc0fb9269a397de` |
| [S8](https://ifr.org/img/worldrobotics/Foreword_WR_2025_Industrial_Robots.pdf) | World Robotics 2025, Foreword, released 2025-09-25; printed p3/PDF4, density bullet. | `fcfdaf24c0e39a41ddaf96025b179d8718f22c8c61e273cf330b4e30be709fd2` |
| [S9](https://file.finance.sina.com.cn/211.154.219.97%3A9494/MRGG/CNSESH_STOCK/2026/2026-7/2026-07-31/12470775.PDF) | 宇树科技股份有限公司首次公开发行股票并在科创板上市招股意向书; filing listing dated 2026-07-31; printed pp1-1-23, 106–107, 148–149, 232. [Listing](https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12470775). | `e4853787132a0030649ffe4ca6608b281e59aed0d6e3d0fe8667cfb1cdcff01f` |

S9 is the issuer's original filing hosted by a financial-information mirror, not an original exchange-host verification. The complete PDF was downloaded and text-checked; printed pp23, 106, 148, 149 and 232 (physical PDF pages 24, 107, 149, 150 and 233) were rendered and visually checked. Page107 was text-checked. No inference uses an issuer forecast as an actual result.

The three supplementary HTML releases linked inline were verified through official-site web text, without separate saved-artifact hashes. The September NBS page was verified from its downloaded official HTML when the browser retrieval failed. Original source artifacts were retained for verification and are not redistributed here.
