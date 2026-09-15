# Where the military autonomy stack becomes traceable

Reviewed 15 September 2026. This study follows named software and components into research or supply relationships. It extends the [civilian technical map](../autonomy/stack.md), whose examples alone establish no military transfer.

**The useful distinction is between access to a technology, its integration into a research system, and delivery into an operating military system.** A software project can draw on openly distributed tools without a bilateral transfer agreement. A commercial part can appear in a military university experiment without identifying the seller. A supplier can deliver ground-station computers without disclosing an aircraft's onboard autonomy stack.

## SL01 — Civilian software evaluated in military-university-associated research

The **XTDrone** paper includes authors affiliated with NUDT, Beihang, Tongji and two aerospace institutions. It describes a simulation platform built on ROS, Gazebo and PX4, and reports evaluating **VINS-Fusion** from HKUST's Aerial Robotics Group. This is reported execution of an identifiable package, beyond a literature citation. [Original paper v1](https://arxiv.org/pdf/2003.09700v1), submitted 21 March 2020: PDF p.1 affiliations, p.3 §IV and footnotes 9–10, pp.4–5 evaluation. These locators refer to v1; the [version record](https://arxiv.org/abs/2003.09700) also lists later revisions.

The [upstream maintainer README](https://github.com/HKUST-Aerial-Robotics/VINS-Fusion) identifies HKUST and public distribution. It was read on 15 September; the experiment's exact software commit remains unidentified. Code was not executed in this review.

**Record the relationship as software evaluated in research.** Author affiliation establishes participation, not institution-wide adoption, a direct HKUST supply agreement or a shipping military controller. The research team performs integration; ownership of the downstream product and qualification for military equipment remain separate questions.

## SL02 — An automotive sensor family in a NUDT robot experiment

NUDT researchers explicitly identify **Livox HAP** on their experimental tracked robot in the published **RSS-LIWOM** paper. The reported campus and stairway tests evaluate localization and mapping. [Published article, 15 August 2023](https://www.mdpi.com/2072-4292/15/16/4040); [publisher PDF](https://mdpi-res.com/d_attachment/remotesensing/remotesensing-15-04040/article_deploy/remotesensing-15-04040.pdf), p.1 affiliations/date, p.4 §3.1, p.12 §5. The sensor is named in text; its identity is not inferred from a photograph.

Livox's [11 July 2022 release](https://www.livoxtech.com/cn/news/hap_order) describes HAP's XPeng P5 use and wider developer availability. This supplies a civilian product-family history. The paper does not identify T1/TX variant, firmware, distributor or selling legal entity; identical configuration with the car installation is unproven.

**Record commercial-component use in military-university research.** The university supplied the experimental integration. This does not establish transfer of XPeng software, a direct manufacturer military sale, or an accepted operational military robot. It does show that the research boundary is permeable to an identifiable commercial component.

## SL03 — Consys: a military ground-computing supplier with an undisclosed aircraft

**深圳市科思科技股份有限公司 / Shenzhen Consys Science & Technology** identifies its customer as **AS公司**, an anonymized UAV system integrator. Historical disclosures describe two distinct products for military UAV ground stations:

| Product | Dated relationship | Commercial snapshot at 25 June 2020 |
|---|---|---|
| 无人机地面站多单元信息处理设备 — multi-unit computing equipment | Sole winning supplier in a 2016 competition. | CNY10.2772m in orders **plus production-preparation agreements**. |
| 无人机地面站多模块计算机 — multi-module computer | Separate 2018 commission; the draft prospectus reports military design finalization. | CNY4.3780m on the same combined basis. |

[IPO inquiry response](https://pdf.dfcfw.com/pdf/H2_AN202007081390316847_1.pdf), printed pp.8-1-14–15 / physical PDF15–16, subsection ③; cover June 2020, public-copy filename 8 July. [SSE-hosted draft prospectus](https://static.sse.com.cn/stock/disclosure/announcement/c/202009/000443_20200915_KG63.pdf), snapshot 15 September 2020, printed pp.1-1-99, 110 and 167; physical pages are one higher.

The inquiry says there was no sales revenue during its reporting period. That period statement must not be extended to the later 25 June order snapshot. The amounts are neither recognized revenue nor exclusively completed contracts. AS's legal identity, aircraft model, end-user unit and onboard processor remain undisclosed.

Later reports add positive evidence at a broader level:

- **FY2023:** continued bid wins and supply of UAV ground-station computing equipment. The wording uses 多单位, compared with the earlier 多单元. [Annual report, p.18](https://stockn.xueqiu.com/SH688788/20240425550132.pdf), published 26 April 2024.
- **FY2024:** multi-unit information-processing equipment completed qualification testing. [Annual report, p.14](https://static.cninfo.com.cn/finalpage/2025-04-25/1223284788.PDF), published 25 April 2025; [reviewed mirror](https://pdf.dfcfw.com/pdf/H2_AN202504241661757131_1.pdf).
- **FY2025 and H1 2026:** product sections retain broader ground-station categories without a project-specific delivery bridge. [FY2025, p.14](https://file.finance.sina.com.cn/211.154.219.97:9494/MRGG/CNSESH_STOCK/2026/2026-4/2026-04-10/12073806.PDF), published 10 April 2026; [H1 2026, p.14](https://file.finance.sina.com.cn/211.154.219.97:9494/MRGG/CNSESH_STOCK/2026/2026-8/2026-08-20/12505594.PDF), published 20 August, unaudited.

These disclosures establish a supplier relationship and later category-level supply/testing. They do not identify which historical order was fulfilled or connect a particular configuration across all dates. Ground computing supports human-facing work as well as software; it does not identify onboard autonomy or a civilian off-the-shelf implementation.

**Keep the original scorecard's product scope.** Imported assessment `CNSCA-4C8F5E8482` / evidence `CNSCE-5DC97FB69C` concerns a swarm/mesh computing family in engineering development. Historical ground-station supply does not upgrade that different product family's maturity or substantiate its autonomous-function claims. No imported score is changed here.

## What these relationships change

The industrial hypothesis becomes more specific: some military-associated research can build on a common pool of software and commercially available parts, while separately contracted ground equipment exposes a defense integration business. These are different routes into the ecosystem. Reuse can reduce the need to originate every layer internally, but the records do not measure saved development time, substitution costs or the burden of qualification. Those require matched project histories.

A positive research link should therefore sit beside, rather than be converted into, a procurement or deployment claim. Conversely, missing supplier paperwork should not erase an explicitly documented research use. The next decisive record is a versioned component or software release tied to a named integrated product and its acceptance history.

## Search and access boundaries

The targeted search covered military procurement, NUDT releases, named robotics middleware, research papers, manufacturer material and issuer filings. It did not produce a complete public chain from a named civilian software version through an identified transaction to accepted operational PLA equipment. That is a bounded collection result, not evidence of absence.

The XTDrone v1 and final RSS-LIWOM PDFs were downloaded; relevant affiliation and artifact-identification pages were visually inspected. MDPI's normal page retrieval failed, while its publisher PDF endpoint succeeded. The VINS-Fusion README and Livox release were read directly. Consys's historical procurement, draft-prospectus, FY2023 and FY2024 passages were visually checked in downloaded PDFs; the later product sections were reviewed as extracted text. Financial mirrors carry issuer evidence, not independent customer confirmation. Source documents are linked, not redistributed. Institutional association, component use, direct supply and force deployment retain separate meanings throughout.
