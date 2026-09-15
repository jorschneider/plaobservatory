# What civilian robotics makes reusable

Reviewed 15 September 2026. This comparison extends the [autonomy stack](../autonomy/stack.md), [Unitree dependency case](../autonomy/cases/unitree-dependencies.md) and [military lineage study](lineage.md). Two additions examine Livox's automotive testing/manufacturing account and UniVLA's measured downstream-data comparison.

**The supported civilian advantage is a stock of components, development interfaces, research implementations and integration experience that other organizations can draw on. The evidence is strongest for access and research reuse; a narrower experiment also demonstrates improved adaptation efficiency.** The economic interpretation is that a downstream organization can buy or reuse some previously developed work. The amount of work saved, its military relevance and who captures the value require separate evidence.

“Documented” below means a named source reports the asset or use. “Supported inference” identifies a plausible benefit tied to that observation, without a measured counterfactual. “Unmeasured” means the reviewed record provides no defensible cost or capability estimate.

| Layer | Positive judgment now | What the evidence lets us infer |
|---|---|---|
| Components | A civilian sensor family actually enters a military-university experiment. | A research team can obtain an already developed component; avoided development expense is unmeasured. |
| Interfaces | Public interfaces and a reported military-associated software evaluation show practical routes to reuse. | Familiar tooling can connect organizations' work; production compatibility and maintenance costs remain configuration-specific. |
| Training software/data | Shared development recipes exist; one civilian experiment reports a measurable adaptation advantage. | Reusable representations can reduce demonstrations for a particular benchmark; military-task data requirements remain unknown. |
| Task integration | A supplier and customer document a functioning civilian inspection application with customization. | Application engineering is an existing commercial competence; repeatability across sites or military customers is unmeasured. |
| Assurance | Component evidence and system acceptance have different scopes. | Existing evidence can inform downstream assessment; acceptance of the integrated system remains a separate decision. |

## Components: the research organization need not originate every part

NUDT's RSS-LIWOM paper identifies **Livox HAP** in its experimental tracked robot. Livox's earlier release connects that family to XPeng P5 use and wider developer availability. This is documented commercial-component use in military-university research, with integration performed by the research team. The paper leaves the HAP variant and selling entity unidentified. See [SL02: the component relationship](lineage.md#sl02--an-automotive-sensor-family-in-a-nudt-robot-experiment), with RSS-LIWOM §3.1/§5 and the dated manufacturer release.

Livox's release describes a testing center, an automated assembly facility and completion of more than 70 automotive reliability test requirements for the offered HAP. These are **manufacturer-reported investments and test claims**; underlying reports were not inspected. They support an inference that civilian demand helped create a reusable manufacturing and testing asset. [Livox, 11 July 2022](https://www.livoxtech.com/cn/news/hap_order), “倾情投入 只为车规” and “面向量产 使命必达”; locator quote: “70余项车规级可靠性测试要求”. No production-volume inference is drawn from the release's capacity claim.

The unknown economic quantities are the research buyer's price, adaptation expense, supply continuity and avoided development time. Shared family identity supplies no evidence of identical automotive and research configurations or transferred XPeng software.

## Interfaces: reusable connection points are an organizational asset

The XTDrone paper reports evaluating **HKUST's VINS-Fusion** in a platform built on ROS, Gazebo and PX4, with NUDT among the author affiliations. This documents reuse across institutional boundaries. It strengthens the claim that a military-associated research team can integrate an external implementation without originating that algorithm itself. The experiment's software commit and any subsequent product relationship are unresolved. See [SL01: the research relationship](lineage.md#sl01--civilian-software-evaluated-in-military-university-associated-research); [XTDrone v1, 21 March 2020](https://arxiv.org/pdf/2003.09700v1), p.1 affiliations, p.3 §IV, pp.4–5 evaluation.

Unitree provides a separate civilian example: its pinned ROS2 documentation permits compatible messages without an SDK wrapper, while its C++ SDK imports prebuilt libraries. The reusable asset is a documented development boundary; the open repository does not disclose every implementation behind it. **Supported inference:** existing tooling and developer familiarity can reduce interface work. No measured labor saving, firmware parity or military use follows from these Unitree records. The [Unitree dependency case, UP03–UP04](../autonomy/cases/unitree-dependencies.md#up03--ros2-is-an-alternative-developer-interface-not-a-mandatory-layer-above-sdk2), supplies pinned files and locators.

## Training software and data: adaptation advantage can be tested

Unitree's published learning workflow separates training, replay, another-simulator check and physical deployment. It makes a development recipe inspectable and reusable while leaving the relationship to the shipping controller unresolved. See [UP05–UP07](../autonomy/cases/unitree-dependencies.md#up05--the-older-rl-gym-route-is-a-specific-development-recipe), including the separation between public examples and the shipping controller.

**UniVLA supplies a measured adaptation comparison.** In the **simulated LIBERO-Goal benchmark**, its authors report **86.3% success with 10% of downstream demonstrations**, compared with **79.2% for OpenVLA using the full dataset**. These percentages describe simulation, not physical field performance. Differences in models and pretraining mean it does not isolate the causal value of one dataset or establish a corresponding percentage reduction in project cost. The same paper's physical single-arm experiments still use 20–80 new trajectories per task; broader embodiments remain an explicit limitation. [UniVLA v1, 9 May 2025](https://arxiv.org/html/2505.06111v1), §IV-C “Data efficiency,” Fig.10; §IV-A3; §VI. Short quote: “only 10% of the demonstration data”.

AgiBot World's standardized collection operation adds another reusable resource: a documented body of trajectories and data-production experience. Its March 2025 paper's approximately one million trajectories arise from collection and review, with only approximately 1% identified as failure-recovery data. **Supported inference:** this can supply pretraining material and collection methods. Coverage of a particular military maintenance or logistics task, additional recovery data, adaptation compute and accepted-work improvement remain unmeasured. [AgiBot World v1, 9 March 2025](https://arxiv.org/html/2503.06669v1), §III-B–C; [AS06: data production](../autonomy/stack.md#as06--the-data-production-system-agibot-world-colosseo). Preserve this version's counts when comparing later releases.

## Task integration: the integrator has something valuable to reuse

SP Group reports SPock performing electricity-tunnel inspection. DEEP separately attributes the X30 solution to its work with Eastern Green Power and describes adapting sensors, recognition and inspection logic. These accounts establish a civilian application plus supplier-attributed integration work; the customer account alone does not identify that supply chain. The [AS09 field-integration case](../autonomy/stack.md#as09--field-integration-deepegpsp-group-spock) preserves the attribution boundaries. [SP Group, 27 November 2024](https://www.spgroup.com.sg/about-us/media-resources/energy-hub/reliability/How-this-technical-officer-and-robot-SPock-hunt-hazards-to-protect-Singapore-power-tunnels), body; [DEEP, 17 December 2024](https://deeprobotics.cn/robot/wap/article/id/266.html), “直面挑战，成功交付海外高新科技项目”.

The positive industrial inference is that a supplier can accumulate domain knowledge and delivery experience alongside a robot platform. Custom engineering can create that reusable knowledge; its presence alone does not establish an enduring barrier to scale. A repeat-site comparison would reveal whether engineering, customer training and support decline, and by how much, on the second and tenth installations. This record supplies neither those costs nor a military deployment bridge.

## Assurance: reuse the evidence that matches the configuration

The official record for **GB/T 45502-2025** establishes a current service-robot information-security standard, effective 1 October 2025. It reports no named product's compliance. The [assurance study](assurance.md) distinguishes requirements, qualification and operational evidence. [SAMR record](https://std.samr.gov.cn/gb/search/gbDetailed?id=31DA5F377BB58F08E06397BE0A0A4CFB), status/basic information, rechecked 15 September 2026.

**Supported inference:** experienced test teams and configuration-matched evidence can reduce duplicated assessment work. Portability depends on which requirements the existing evidence actually covers. No reviewed record measures military qualification savings. Request a requirements-to-test crosswalk and the accepted configuration before assigning such savings.

For analysts, the comparison therefore supports an **advantage over starting every layer internally**, without establishing an exclusive national advantage. Much of the named software is publicly distributed. The decisive next record is a matched project history: reused artifact/version, work omitted, new work performed, engineering and qualification cost, and accepted output. That would distinguish a broad civilian resource base from a demonstrated advantage in delivering a particular military system.

Access note: the historical paper locators above inherit the repository's prior primary-source review. This pass directly reread the live manufacturer, customer, maintainer and SAMR pages and the versioned UniVLA/AgiBot HTML. Unitree references remain the specified snapshots; no assertion is made that they are today's default branches. No binaries, datasets or robot programs were run.
