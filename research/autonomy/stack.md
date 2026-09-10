# The Chinese autonomy stack: an analyst's evidence map

Research cut-off and source check: 2026-09-10. This is a selected foundation of ten cases, not a claim to cover every model or supplier released by that date. Only original papers, maintainers' repositories, manufacturers, a customer and government standards records support the factual claims below. Product pages and default GitHub branches are mutable; these are dated observations unless a commit is pinned. The [Unitree dependency case](cases/unitree-dependencies.md) records six inspected commits and file-level evidence. arXiv version links identify the reviewed text.

## The organizing idea

Treat autonomy as a property of a **function performed by a specified system in a specified environment under a specified allocation of human responsibility**. A robot may balance itself while a person chooses its route; it may follow a route while a person diagnoses defects; it may recognize a defect while a person authorizes maintenance. A capable subsystem is not evidence of the remaining functions.

Three interacting processes are a better organizing device than a league table of robot companies:

1. **Physical feedback:** sensing and state estimation → task/motion decisions → control and actuation → new observations. Compute, power and thermal limits constrain the entire process.
2. **Work organization:** a customer order or inspection plan → task assignment and fleet scheduling → infrastructure interfaces → exception handling and accepted output. This is where a useful movement becomes useful work.
3. **Improvement and assurance:** demonstrations and logs → training/simulation → evaluation → a controlled software release → monitored operation and subsequent revision.

These processes are an analytical decomposition. The examples below are not a claim that the named products use one another. Command authority and human accountability should be separate fields that cut across every process, rather than another software component.

## Ten concrete examples

### AS01 — Sensing and state estimation: HKU MaRS FAST-LIVO2

**Evidence:** The HKU team's released package combines LiDAR, inertial and visual inputs for localization and mapping. Its documentation separately exposes synchronized sensor hardware, calibration tools and evaluation data. A follow-on original paper reports a memory/computation trade-off on x86 and ARM platforms: on Hilti data, 33% lower per-frame runtime and 47% less memory, with 3 cm greater RMSE relative to FAST-LIVO2.

**Stage:** Research implementation and author-run experiments, not a named customer's accepted production system.

**Dependency/boundary:** Calibration, synchronization, scene characteristics and compute budget remain part of the result. Localization is neither semantic task understanding nor proof of safe autonomous operation. The recorded benchmark trade-off cannot be applied to every robot or environment.

**Analyst question:** Which sensor configuration, calibration procedure, compute device and environmental test support a vendor's navigation claim?

**Sources/locators:** [Maintainer README](https://github.com/hku-mars/FAST-LIVO2), §§1.3–1.5 and prerequisites; code release stated as 2025-01-23. [Follow-on original paper](https://arxiv.org/abs/2501.13876), abstract; first submitted 2025-01-23. [Original FAST-LIVO2 paper](https://arxiv.org/abs/2408.14035), abstract and version record. The numerical comparison here comes from the follow-on paper, not the original.

### AS02 — Onboard compute and physical limits: Unitree G1/G1 EDU

**Evidence:** The official comparison lists an eight-core CPU for both G1 and G1 EDU, with additional compute options including Orin for EDU. It marks secondary development for EDU, with no corresponding entry for base G1. The page also specifies depth camera plus 3D LiDAR, local air cooling, configuration-dependent maximum joint torque/load, and approximately two hours of battery life. Its footnote says arm load changes substantially with extension posture.

**Stage:** Manufacturer specification; not measured sustained performance.

**Dependency/boundary:** Match developer access and compute to the purchased configuration. Neither an optional Orin nor a development workstation's GPU establishes the onboard inference hardware. Do not infer a fixed TOPS figure or turn maximum torque into continuous torque. Task-level latency, thermal derating, accepted output and sustained utilization remain unmeasured here. Some displayed functions remain under development/testing.

**Analyst question:** For the actual purchased configuration, what runs on which processor, at what power/latency, and under what posture/load/temperature envelope?

**Source/locator:** [Unitree G1](https://www.unitree.com/g1/), “Unitree G1 Parameter,” electrical characteristics, accessories, secondary development and footnotes [1], [2], [3], [5], [8]; undated live page checked 2026-09-10. See [dependency case UP01](cases/unitree-dependencies.md#up01--commercial-configuration-gates-the-developer-claim).

### AS03 — Runtime and communications: Unitree SDK2 and ROS2

**Evidence:** The pinned Python SDK manifest requires CycloneDDS 0.10.2, and its communications code imports that package directly. Unitree also documents a ROS2 message interface that can operate without an SDK wrapper; G1 examples and build targets establish G1 coverage beyond the README's incomplete opening model list. The C++ SDK build imports an architecture-specific prebuilt Unitree library and DDS libraries.

**Stage:** Public developer interfaces, manifests and build definitions; source inspection, not an executed compatibility test.

**Dependency/boundary:** These are documented interface options, not a mandatory ROS2-plus-SDK chain. A public repository does not establish source-rebuildability of every binary or disclose the complete shipping controller. Interface parity, purchased-firmware compatibility and switching costs remain unverified. Message compatibility is neither fleet decision-making nor a cybersecurity or functional-safety certification.

**Analyst question:** Which runtime versions, update authority, interface permissions and support commitments apply to the customer's configuration?

**Sources/locators:** Pinned [Python manifest](https://github.com/unitreerobotics/unitree_sdk2_python/blob/65691c8a8bc53b98d3976dba4dbf9d5d20b2e7f5/setup.py#L15-L20), [ROS2 README](https://github.com/unitreerobotics/unitree_ros2/blob/668d1ec5a05d1c38d3306bdca7d59f2ba3581a88/README.md), introduction/system requirements and G1 example inventory; [C++ SDK build definition](https://github.com/unitreerobotics/unitree_sdk2/blob/9754cd153af3da471b0fe5f3aa535e426fb11db3/CMakeLists.txt#L37-L58). [Dependency case UP02–UP04](cases/unitree-dependencies.md) supplies commit dates and further file locators.

### AS04 — Training, simulation and locomotion: Unitree learning environments

**Evidence:** Unitree RL Gym separates training, replay, a second-simulator check and physical deployment; its setup specifies PyTorch/CUDA, Isaac Gym and RSL-RL. Unitree also publishes G1 environments using Isaac Lab and a MuJoCo-based route, RL Mjlab. The latter pins `mjlab==1.2.0` and `mujoco-warp==3.5.0` but still specifies an NVIDIA GPU. NVIDIA now describes Isaac Gym as unsupported legacy software and recommends Isaac Lab.

**Stage:** Vendor research/development workflow with physical demonstrations; no customer uptime evidence.

**Dependency/boundary:** Alternative simulators are documented; equivalent performance, conversion effort and qualification costs are not. Changing the simulator does not establish independence from NVIDIA hardware, and development GPU requirements do not identify onboard compute. These repositories are not a complete dependency lock or evidence of the shipping controller. Locomotion demonstrations do not establish perception, manipulation, work orchestration or customer reliability; a simulator check is not production qualification.

**Analyst question:** Which parts of the pipeline are replaceable, who maintains them, and what independent evidence shows performance surviving a new task, environment or hardware revision?

**Sources/locators:** Pinned [RL Gym setup](https://github.com/unitreerobotics/unitree_rl_gym/blob/276801e46c5d433564f24658bac64f254b7d2d4b/doc/setup_en.md), §§2.1–2.5; [RL Lab overview](https://github.com/unitreerobotics/unitree_rl_lab/blob/4960b84732b0c2ec593dccbfe963fda1bcd7b1e3/README.md#L9-L13); [RL Mjlab manifest](https://github.com/unitreerobotics/unitree_rl_mjlab/blob/1425b15f73bd4095f0df53709d7c389c3eb9e790/setup.py#L5-L9) and [GPU requirement](https://github.com/unitreerobotics/unitree_rl_mjlab/blob/1425b15f73bd4095f0df53709d7c389c3eb9e790/doc/setup_en.md#L3-L7); [NVIDIA support-status notice](https://developer.nvidia.com/isaac-gym), checked 2026-09-10. See [dependency case UP05–UP07](cases/unitree-dependencies.md) for the snapshots' dates and limits.

### AS05 — Learned task policies: UniVLA from HKU/OpenDriveLab/AgiBot

**Evidence:** The May 2025 paper learns task-related latent actions from video, then adapts a decoder to a robot. Its real-robot evaluation uses an AgileX Piper arm and an Orbbec camera, with 20–80 demonstrations per task. The authors report 10 Hz inference on an NVIDIA RTX 4090. They explicitly identify primarily single-arm evaluation and more complex action spaces for dual-arm humanoids/dexterous hands as limitations.

**Stage:** Author-run benchmark and laboratory robot experiments.

**Dependency/boundary:** The result depends on training data, task-specific adaptation, embodiment and GPU. It is not evidence that a complete humanoid autonomously performs customer work, or that the same latency holds on an embedded processor. A benchmark improvement does not provide a field intervention rate.

**Analyst question:** Which new environments, objects, tasks and robot bodies were genuinely held out, and what adaptation was still required?

**Source/locator:** [UniVLA, arXiv v1, 2025-05-09](https://arxiv.org/html/2505.06111v1), affiliations; §IV-A3 “Real-world Robot Deployment”; §VI limitations. This is arXiv 2505.06111, not the different paper also titled UniVLA (2506.19850).

### AS06 — The data-production system: AgiBot World Colosseo

**Evidence:** The March 2025 paper from Shanghai AI Lab, AgiBot and Shanghai Innovation Institute records 1,001,552 trajectories, 2,976.4 hours, 217 tasks and 106 scenes. Data came from a standardized robot collection operation with teleoperators and human review. Approximately 1% is identified as failure-recovery data. The authors describe reconstructed industrial/retail settings and a collection facility, not a million independent productive customer jobs.

**Stage:** Dataset and model research platform.

**Dependency/boundary:** Trajectory count is not autonomous output, and teleoperation used to collect training data is not proof of teleoperation during every later deployment. Diversity, failure coverage, annotation quality and evaluation separation are distinct from scale. The current code README also documents LeRobot and CUDA dependencies; versioning matters.

**Analyst question:** How much new customer data is needed, how is recovery represented, and are evaluation scenes independent of collection scenes?

**Sources/locators:** [Original paper v1, 2025-03-09](https://arxiv.org/html/2503.06669v1), §III and §III-B; [official code README](https://github.com/OpenDriveLab/AgiBot-World), installation and model requirements, checked 2026-09-10. Counts are from v1; do not mix them with later AgiBot World 2026 releases.

### AS07 — Power and fleet infrastructure: UBTECH Walker S2

**Evidence:** The manufacturer describes a dual-battery autonomous swap system, a three-minute swap, a dedicated station and cloud-based energy monitoring/decisions. These are distinct components of the proposed continuous-work system.

**Stage:** Product claims on an undated live page, checked 2026-09-10.

**Dependency/boundary:** Battery autonomy depends on station access, charged spares, docking success and support infrastructure. The “24/7” claim does not establish 24 hours of accepted output, zero maintenance, zero supervision or a measured customer's availability. Thermal constraints, hand wear and task failure can remain after charging is automated.

**Analyst question:** Across a measured period, what share of scheduled time goes to productive work, energy replenishment, faults, maintenance and waiting for the surrounding process?

**Source/locator:** [Walker S2 official page](https://www.ubtrobot.com/cn/humanoid/products/walker-s2), sections “自主换电 24/7连续作业” and “云端管理 智慧补能.” Translation: autonomous battery swapping/continuous operation claim; cloud energy management. No inference about an installed customer's achieved uptime.

### AS08 — Fleet coordination and enterprise integration: Hikrobot RCS-2000/iWMS

**Evidence:** Hikrobot describes RCS-2000 as centralized allocation, vehicle dispatch and route planning for internal logistics. It interfaces with orders and building equipment such as access controls/elevators, monitors exceptions and records execution statistics. Its warehouse layer and material-management layer connect robot tasks to enterprise workflows.

**Stage:** Commercial software product documentation; the page alone does not verify a named installation's performance.

**Dependency/boundary:** Multiple robots working together need not imply an emergent swarm or a general-purpose foundation model. This software is designed to manage fleets integrated with facility workflows; the page does not document a named installation. Vendor claims about scale or percentage efficiency gains lack enough customer-specific denominators on this page for a comparative economic claim.

**Analyst question:** How much output depends on the robot policy versus order preparation, traffic scheduling, equipment interfaces and exception staff?

**Source/locator:** [Hikrobot official system software](https://www.hikrobotics.com/cn/mobilerobot/software/), “系统平台架构,” RCS-2000 description and “AMR混合调度/集群作业”; undated page checked 2026-09-10.

### AS09 — Field integration: DEEP/EGP/SP Group SPock

**Evidence:** SP Group's 2024-11-27 customer article reports a robot navigating electricity tunnels, using video/thermal cameras and flagging defects. DEEP's 2024-12-17 supplier account attributes the X30 solution to its work with Eastern Green Power. It describes customization of added sensors, recognition algorithms and inspection logic, engineers passing preliminary site-safety assessment before deployment, and engineering assistance for localization. The personnel assessment is not a robot/system safety certification.

**Stage:** Buyer-reported operational use; model/integrator attribution and integration detail are supplier-reported.

**Dependency/boundary:** The buyer article does not itself name X30, DEEP or EGP. DEEP reuses SP imagery/material, so the two pages are not wholly independent corroboration. Neither provides sufficient logs to calculate false-negative rates, unsupervised hours or successful inspections per paid labor hour. A useful deployment includes customer training, domain-specific perception, local infrastructure and a report/action workflow.

**Analyst question:** Who owns each integration layer, who responds to ambiguous observations, and what acceptance criteria define a completed inspection?

**Sources/locators:** [SP Group customer account](https://www.spgroup.com.sg/about-us/media-resources/energy-hub/reliability/How-this-technical-officer-and-robot-SPock-hunt-hazards-to-protect-Singapore-power-tunnels), body/date; [DEEP supplier account](https://deeprobotics.cn/robot/wap/article/id/266.html), “直面挑战，成功交付海外高新科技项目” and opening attribution. Both checked 2026-09-10.

### AS10 — Assurance is a separate layer: published standards versus drafts

**Evidence:** SAMR's official record lists GB/T 45502-2025, general information-security requirements for service robots, as a current recommended national standard, published 2025-03-28 and implemented 2025-10-01. A different official record lists humanoid general-safety project 20261658-T-604 as being drafted, with a plan date of 2026-03-31.

**Stage:** Standards institution evidence; not a product test or deployment result.

**Dependency/boundary:** A drafting participant is not automatically a certified supplier. A draft is not an effective standard. Listing a standard does not establish that a robot, software version or integrated workcell passed it. Information security, mechanical safety, task correctness and customer acceptance should have separate evidence fields. This is not a legal determination of which standard applies to a particular deployment.

**Analyst question:** Is there a test report with a named configuration, date, scope and assessor, and does it cover the integrated system or only a component?

**Sources/locators:** [GB/T 45502-2025 official record](https://std.samr.gov.cn/gb/search/gbDetailed?id=31DA5F377BB58F08E06397BE0A0A4CFB), status/basic information; [20261658-T-604 official plan](https://std.samr.gov.cn/gb/search/gbDetailed?id=4E645DFFD63A7395E06397BE0A0AE96A), project progress/basic information. Checked 2026-09-10; technical clauses were not evaluated.

## What this changes for the analyst

**Use a dependency ledger, not a national label.** These cases directly document overseas-origin processors, middleware and simulation tools inside some Chinese research/development interfaces. They do not quantify sector-wide dependence, prove irreplaceability, or establish that an alternative can be substituted without cost. Track the particular product/version, the evidence for its dependency, available alternatives and the cost of switching separately. Distinguish a required package in one implementation from a required function across all implementations, and keep development compute separate from the customer's onboard runtime. The [Unitree case](cases/unitree-dependencies.md) shows why these distinctions change the assessment.

**Separate a demonstrated skill from a deployed process.** A lab robot's task success rate, a manufacturer's payload limit, an AMR scheduler's capacity and a utility's inspection deployment answer different questions. Rank evidence within a common task and operating envelope before comparing vendors.

**Make hidden human work visible.** Distinguish training-data teleoperation, commissioning, routine supervision, exception recovery, approval of consequential decisions and maintenance. A source using “autonomous” does not fill in these fields. This connects the stack directly to the task-economics ledger: human work may move upstream or into exception handling rather than disappear.

**Follow interfaces where value is lost.** Sensor calibration, embodiment adaptation, fleet scheduling, customer-system integration, recharging, acceptance criteria and software updates are plausible bottlenecks suggested by the evidence. The research does not establish that any one is the binding constraint throughout China. Each is a testable collection question.

## Civil–military interpretation boundary

The reviewed records establish civilian products, research capability, developer dependencies and one civilian field integration. They establish **no military procurement, deployment or transfer for these specific examples**. Their general technological relevance can generate hypotheses, but should not be entered as confirmed military relationships.

An analyst can ask whether localization expertise, robust hardware, data-production infrastructure, integration teams or assurance processes might be reusable across sectors. Confirming such a relationship requires separate dated evidence identifying the organizations, product/version, transaction or collaboration, and actual role. A paper's potential relevance, a shared institution, a demonstration or a recognizable chassis is insufficient. Doctrine describing an aspiration also does not establish the maturity of this technical stack.

## Minimal record additions

For each case, record: `system_and_version`, `function`, `environment`, `authority_retained_by_human`, `human_support_roles`, `onboard_vs_remote_compute`, `external_dependencies`, `integration_owner`, `evaluation_stage`, `measured_conditions`, `metric_denominator`, `test_or_acceptance_scope`, `source_date`, `retrieved_date`, `unsupported_inferences`.

Use `unknown` when the source does not disclose a value. Keep author-run experiments, manufacturer specifications, buyer-reported operations, independent evaluation and formal acceptance as separate evidence categories. They are not rungs that every source can be silently promoted through.
