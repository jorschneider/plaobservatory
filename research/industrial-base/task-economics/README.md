# What does a completed robot task actually cost?

Research pilot • 5 September 2026 • Three China-linked cases and one US disclosure benchmark

**The reviewed public record establishes real deployment activity, but does not support an all-in cost per accepted task for any of these four cases.** The useful next step is a matched operating log and customer cost ledger for one workcell. This package identifies which published numbers can guide that collection, which cannot enter an economics model, and what evidence would change the conclusion.

This develops the task-economics research proposed for ChinaTalk's SemiAnalysis guests and complements the [relationship dossiers](../relationship-method.md). These civilian cases establish no military transfer or military operating performance. SPock is a Chinese robot deployed in Singapore; Figure/BMW is an external benchmark, not part of China's supplier population.

## Four cases, four different denominators

| Case and task | What the primary source gives us | What remains unmeasured |
|---|---|---|
| **DEEP X30 / SPock, SP Group:** tunnel inspection | Buyer confirms use. Supplier describes a two-person, 6 km manual route taking 2–3 hours and forecasts over 480 inspection hours saved annually with wider deployment. | Robot route time, fleet scope, report review and rescue burden. [Buyer](https://www.spgroup.com.sg/about-us/media-resources/energy-hub/reliability/How-this-technical-officer-and-robot-SPock-hunt-hazards-to-protect-Singapore-power-tunnels), [supplier](https://deeprobotics.cn/robot/wap/article/id/266.html). |
| **UBTECH Walker S1, BYD:** material handling | Issuer says first-stage trial efficiency doubled and stability improved 30%. | Metric definitions, baseline and interval. A human-versus-robot comparison is not established. [FY2024 report, printed p118](https://www.hkexnews.hk/listedco/listconews/sehk/2025/0430/2025043002531_c.pdf). |
| **UBTECH Walker S Lite, Zeekr:** CTU box loading | Supplier describes three consecutive calendar weeks of trials. | Productive hours and accepted placements. A generic SPS rate elsewhere on the page has no matching site/version. [Supplier case page, 吉利 subsection](https://www.ubtrobot.com/cn/humanoid/solutions/industry). |
| **Figure 02, BMW Spartanburg:** sheet-metal loading | Customer reports over 90,000 components and approximately 1,250 operating hours. | Accepted cycles, scheduled hours, pool count, support and complete costs. [BMW account, Spartanburg section](https://www.press.bmwgroup.com/portugal/article/detail/T0455909PT/bmw-group-to-deploy-humanoid-robots-in-production-in-germany-for-the-first-time). |

These are selected disclosures, not comparable performance observations. Missing economics is a limit of this review, not proof that a deployment is uneconomic.

## Three findings worth taking to an analyst

**The newest success figure is explicitly a laboratory result.** UBTECH's August 28, 2026 release reports 75% end-to-end loading/unloading success in the laboratory. It supplies no named customer, version, sample size or intervention denominator. Applying it to BYD's S1 or Zeekr's S Lite would turn an unrelated test into a field-performance estimate. Ask how that definition changes under shift conditions. [2026 interim release, p11; control approaches on p13](https://owebsite-cdn.ubtrobot.com/resources/file/2026/09/02/844628127543365.pdf).

**Commercial evidence and unit economics need separate records.** UBTECH discloses RMB20.898m in FY2025 goods sales to BYD and subsidiaries, a related party, and the same year-end receivable balance. Without a model, quantity or workcell split, this cannot supply a robot price or establish cash collection. [FY2025 report, printed pp282–283 and 287](https://www.hkexnews.hk/listedco/listconews/sehk/2026/0414/2026041401169_c.pdf).

**Better disclosure still requires reconciliation.** Figure defines a three-part placement cycle and success/reset targets, rather than achieved rates. Its account uses eleven deployment months; BMW uses ten. Roughly 90,000 ÷ 1,250 ≈ 72 components per reported operating hour is only a scale check using rounded aggregates. It is not accepted-cycle throughput or a per-robot measurement. Ask for the underlying cohort before comparing results. [Figure's report](https://www.figure.ai/news/production-at-bmw), [BMW's account](https://www.press.bmwgroup.com/portugal/article/detail/T0455909PT/bmw-group-to-deploy-humanoid-robots-in-production-in-germany-for-the-first-time).

## The next useful piece of original reporting

**Start with Zeekr's CTU loading station, if workcell access is available.** It offers a narrow output—an accepted box placement—and concrete alternatives: staffed loading or an AMR-plus-arm cell. This is an analyst collection choice, not a claim that Zeekr has the best economics. Establish the exact site, version and current operating status first. SP Group offers a second route through a buyer-confirmed inspection workflow.

Request two consecutive representative operating weeks, including unsuccessful runs, plus commissioning records and longer repair history. Two weeks can establish a bounded result; it cannot establish annual reliability. Apply the same acceptance standard and demand boundary to the robot workflow and its alternative. Include setup, monitoring, teleoperation, resets, repair, report review and manual fallback. Released labor hours do not automatically remove payroll.

The deliverable for Niko and Reyk would be a one-page workcell comparison: accepted output, all human person-hours, scheduled/active robot-hours, allocated equipment/service and integration cost, failures/unresolved tasks, and cost per accepted task with exact scope. Show each changed assumption in any scenario range. The [request sheet](collection-request.md) is ready to adapt for a customer or integrator interview; no outreach has been sent.

## Use the package

- [Evidence dataset](evidence.json): stable IDs, qualifiers, located excerpts, observation-window limits and collection priorities.
- [Calculation method](method.md): formulas, missing-data rules and ownership/service treatment.
- [Collection request](collection-request.md): operating conditions and records required to close a case.
- [Synthetic example](example-ledger.json): round-number arithmetic only; no company estimates.

From the repository root:

```bash
# Validate evidence and show the gaps in each field estimate.
node scripts/task-economics.mjs

# Prepare a case-specific ledger; fill only with scoped evidence.
node scripts/task-economics.mjs --template TE-ZEEKR-SLITE > /tmp/zeekr-ledger.json

# Evaluate a ledger or the explicitly synthetic example.
node scripts/task-economics.mjs --ledger research/industrial-base/task-economics/example-ledger.json
node --test tests/task-economics.test.mjs
```

No cost value is automatically imported from the evidence claims. Every reviewed numerical claim fails at least one requirement for a matched cost/output input. A completed ledger needs documented allocation, provenance and scope. The calculator checks arithmetic and completeness; it cannot authenticate invoices or establish that task IDs were deduplicated.

Scope of review: the passages located in the JSON; UBTECH FY2024/FY2025 and August 2026 interim release; DEEP/SP customer and supplier accounts; BMW/Figure accounts. PDFs were checked at the cited pages. Mutable pages are retrieval-dated, not asserted to describe current operations. Underlying logs, invoices and acceptance reports were not obtained.
