# Unitree G1: public developer dependencies

Reviewed 2026-09-10. Addresses AQ02 with a reproducible inspection of public source files, not a tested robot build or a complete shipping-system software bill of materials. No code was installed or executed. Repository dates below are Git commit metadata, not product release dates. Pinned commits make the evidence revisitable; they do not pin every transitive package, binary or robot asset used by a developer.

## Finding

The public G1 developer ecosystem provides multiple routes through a common problem: learn a locomotion policy, represent the robot and environment, exchange messages with robot-side software, and validate the result. It exposes international middleware and learning tools, but also Unitree-specific interfaces and binary libraries. It does not expose enough evidence to reconstruct the customer's complete shipping controller.

The useful dependency distinction is **a particular implementation's required package versus a function that has another documented implementation**. Unitree publishes ROS2 messaging alongside SDK interfaces, and multiple learning environments alongside the older Isaac Gym implementation. That is evidence of alternatives. It supplies no matched measurement of engineering time, training expense, performance loss, qualification cost or commercial support when switching between them.

## Pinned source inventory

All repositories belong to the official `unitreerobotics` organization. Commit metadata was fetched through GitHub's public API; files were fetched at the corresponding SHA.

| ID | Repository | Inspected commit | Committer timestamp, UTC |
|---|---|---|---|
| UR1 | unitree_sdk2_python | [65691c8a8bc53b98d3976dba4dbf9d5d20b2e7f5](https://github.com/unitreerobotics/unitree_sdk2_python/commit/65691c8a8bc53b98d3976dba4dbf9d5d20b2e7f5) | 2026-07-21 09:07:41 |
| UR2 | unitree_ros2 | [668d1ec5a05d1c38d3306bdca7d59f2ba3581a88](https://github.com/unitreerobotics/unitree_ros2/commit/668d1ec5a05d1c38d3306bdca7d59f2ba3581a88) | 2026-07-02 12:45:43 |
| UR3 | unitree_sdk2 | [9754cd153af3da471b0fe5f3aa535e426fb11db3](https://github.com/unitreerobotics/unitree_sdk2/commit/9754cd153af3da471b0fe5f3aa535e426fb11db3) | 2026-08-20 09:52:47 |
| UR4 | unitree_rl_gym | [276801e46c5d433564f24658bac64f254b7d2d4b](https://github.com/unitreerobotics/unitree_rl_gym/commit/276801e46c5d433564f24658bac64f254b7d2d4b) | 2025-07-25 10:20:21 |
| UR5 | unitree_rl_lab | [4960b84732b0c2ec593dccbfe963fda1bcd7b1e3](https://github.com/unitreerobotics/unitree_rl_lab/commit/4960b84732b0c2ec593dccbfe963fda1bcd7b1e3) | 2025-11-19 04:08:01 |
| UR6 | unitree_rl_mjlab | [1425b15f73bd4095f0df53709d7c389c3eb9e790](https://github.com/unitreerobotics/unitree_rl_mjlab/commit/1425b15f73bd4095f0df53709d7c389c3eb9e790) | 2026-04-13 13:44:03 |

These are inspected snapshots, not an assertion that all six repositories form one compatible installation.

## Claim records

### UP01 — Commercial configuration gates the developer claim

**Evidence:** Unitree's live comparison gives both G1 and G1 EDU an eight-core CPU. It marks secondary development for EDU and leaves that entry blank for base G1. EDU's additional compute entry offers multiple brands/models and gives Orin as an example; base G1 has no listed additional module. This establishes an advertised configuration distinction, not a purchased machine's actual processor or software permissions.

**Function:** Customer development and optional additional compute.

**Replacement/unknown:** Obtain the sales configuration, installed module, firmware and developer-access entitlement before mapping a benchmark or dependency to a unit. The page does not establish which policy runs on which chip, that every EDU includes Orin, or that all G1 robots require Orin.

**Source:** [Unitree G1 comparison](https://www.unitree.com/g1/), “Basic Computing Power,” “High Computing Power Module,” “Secondary Development,” footnotes 3, 5 and 8. Undated mutable page checked 2026-09-10.

### UP02 — The Python interface has an actual pinned middleware dependency

**Evidence:** UR1's package identifies itself as `unitree_sdk2py` 1.0.1, requires Python >=3.8, pins `cyclonedds==0.10.2`, and lists unpinned NumPy/OpenCV. The communications module imports CycloneDDS directly. This is a manifest plus implementation evidence, stronger than a README acknowledgment.

**Function:** Developer-side robot message transport.

**What needs replacing:** Removing CycloneDDS prevents this Python implementation from importing/operating unchanged. A substitute needs compatible transport, message representation and behavior; the cost and validated performance of such a substitution are not disclosed. This observation does not establish the dependence of every internal robot process.

**Locators:** UR1 [setup.py, lines 3–20](https://github.com/unitreerobotics/unitree_sdk2_python/blob/65691c8a8bc53b98d3976dba4dbf9d5d20b2e7f5/setup.py#L3-L20); [core/channel.py, lines 6–14](https://github.com/unitreerobotics/unitree_sdk2_python/blob/65691c8a8bc53b98d3976dba4dbf9d5d20b2e7f5/unitree_sdk2py/core/channel.py#L6-L14).

### UP03 — ROS2 is an alternative developer interface, not a mandatory layer above SDK2

**Evidence:** UR2 says compatible ROS2 messages can be used without wrapping the SDK interface; its documented environments are Ubuntu 20.04/Foxy and 22.04/Humble. The opening model list still says Go2/B2/H1, so it alone cannot prove G1 coverage. G1 support is evidenced separately by G1 entries in the example list and build targets, linked to the `unitree_hg` message package and ROS2 dependencies.

**Function:** External applications, messages and developer integration.

**Replacement/unknown:** A developer need not necessarily use both ROS2 and the SDK wrapper. This does not prove arbitrary middleware interchangeability, full feature parity between interfaces, or compatibility with each purchased firmware/configuration. The repository gives no migration labor or support-service measurement.

**Locators:** UR2 [README introduction/system requirements](https://github.com/unitreerobotics/unitree_ros2/blob/668d1ec5a05d1c38d3306bdca7d59f2ba3581a88/README.md#L5-L16), [G1 example inventory](https://github.com/unitreerobotics/unitree_ros2/blob/668d1ec5a05d1c38d3306bdca7d59f2ba3581a88/README.md#L137-L146); [example/src/CMakeLists.txt, lines 22–44](https://github.com/unitreerobotics/unitree_ros2/blob/668d1ec5a05d1c38d3306bdca7d59f2ba3581a88/example/src/CMakeLists.txt#L22-L44); [unitree_hg/package.xml](https://github.com/unitreerobotics/unitree_ros2/blob/668d1ec5a05d1c38d3306bdca7d59f2ba3581a88/cyclonedds_ws/src/unitree/unitree_hg/package.xml).

### UP04 — Public SDK distribution includes an opaque binary boundary

**Evidence:** UR3's main CMake file imports the Unitree SDK as a prebuilt static library from an architecture-specific directory and links DDS libraries. Its tree contains `lib/aarch64/libunitree_sdk2.a` and `lib/x86_64/libunitree_sdk2.a`. Third-party CMake imports prebuilt `libddsc.so` and `libddscxx.so`.

**Function:** Packaged developer runtime and communication support.

**Replacement/unknown:** The build definition requires a compatible library for its chosen architecture. A public repository therefore does not imply source-rebuildability of every SDK component. This is not proof that the prebuilt SDK is the robot's shipping locomotion controller, nor proof that the binary is the only possible interface. Source availability elsewhere, reproducible binary provenance and the customer's onboard firmware were not established.

**Locators:** UR3 [CMakeLists.txt, lines 37–58](https://github.com/unitreerobotics/unitree_sdk2/blob/9754cd153af3da471b0fe5f3aa535e426fb11db3/CMakeLists.txt#L37-L58); [thirdparty/CMakeLists.txt](https://github.com/unitreerobotics/unitree_sdk2/blob/9754cd153af3da471b0fe5f3aa535e426fb11db3/thirdparty/CMakeLists.txt); [binary library tree](https://github.com/unitreerobotics/unitree_sdk2/tree/9754cd153af3da471b0fe5f3aa535e426fb11db3/lib).

### UP05 — The older RL Gym route is a specific development recipe

**Evidence:** UR4's manifest lists Isaac Gym, RSL-RL, NumPy 1.20 and MuJoCo 3.2.3, among other packages. The setup document specifies PyTorch 2.3.1/CUDA 12.1 and RSL-RL v1.0.2, recommends an NVIDIA GPU, and makes SDK2 Python conditional on physical deployment. Its README distinguishes learning, replay, a second-simulator check and physical demonstration.

**Function:** Locomotion-policy development and evaluation.

**Replacement/unknown:** The recipe is not a complete lockfile: some dependencies and assets remain unpinned. Changing the simulator or learning framework requires rechecking the resulting policy and environment assumptions; no quantified migration or qualification cost was supplied. Development GPU requirements cannot be assigned automatically to onboard inference.

**Locators:** UR4 [setup.py](https://github.com/unitreerobotics/unitree_rl_gym/blob/276801e46c5d433564f24658bac64f254b7d2d4b/setup.py); [doc/setup_en.md](https://github.com/unitreerobotics/unitree_rl_gym/blob/276801e46c5d433564f24658bac64f254b7d2d4b/doc/setup_en.md), system requirements and §§2.1, 2.3, 2.5; [README](https://github.com/unitreerobotics/unitree_rl_gym/blob/276801e46c5d433564f24658bac64f254b7d2d4b/README.md), process overview.

### UP06 — Documented simulator alternatives change the dependency assessment

**Evidence:** UR5 publishes G1-29dof environments based on Isaac Lab. UR6 publishes G1 environments using a MuJoCo backend; its manifest pins `mjlab==1.2.0` and `mujoco-warp==3.5.0`. The latter setup still specifies an NVIDIA GPU. Separately, NVIDIA now labels Isaac Gym unsupported legacy software and recommends Isaac Lab.

**Function:** Alternative training environments, including replacement of the older simulation engine.

**Replacement/unknown:** Unitree has documented more than one development route. Moving from Isaac Gym to MuJoCo is not evidence of independence from NVIDIA hardware. Published alternatives are not evidence of equal performance, common validation coverage, easy conversion of existing policies, or a commercial customer migration. The NVIDIA notice is a current support-status observation, not evidence that a particular existing developer installation ceased to work.

**Locators:** UR5 [README overview](https://github.com/unitreerobotics/unitree_rl_lab/blob/4960b84732b0c2ec593dccbfe963fda1bcd7b1e3/README.md#L9-L13); UR6 [README overview](https://github.com/unitreerobotics/unitree_rl_mjlab/blob/1425b15f73bd4095f0df53709d7c389c3eb9e790/README.md); [setup.py, lines 5–9](https://github.com/unitreerobotics/unitree_rl_mjlab/blob/1425b15f73bd4095f0df53709d7c389c3eb9e790/setup.py#L5-L9); [doc/setup_en.md, lines 3–7](https://github.com/unitreerobotics/unitree_rl_mjlab/blob/1425b15f73bd4095f0df53709d7c389c3eb9e790/doc/setup_en.md#L3-L7); [NVIDIA Isaac Gym status](https://developer.nvidia.com/isaac-gym), checked 2026-09-10.

### UP07 — Public example control and the shipping controller remain separate evidence objects

**Evidence:** UR5's physical-deployment section treats its public program and an existing onboard control program as distinct. UR4 separately labels its workflow a route to physical deployment. These documents establish public development examples; they do not identify them as the commercial shipping controller, list the complete production firmware dependencies, or report a customer's accepted work.

**Function:** Boundary between research/developer control and production software.

**Unknown:** The relation between these public policies and stock firmware; firmware versions; approved developer interfaces; update authority; safety supervision; operational qualification; and purchased customer configuration. Do not label the entire shipping controller “open source” or claim a complete proprietary implementation has been audited from this material.

**Locators:** UR5 [README, physical-deployment section](https://github.com/unitreerobotics/unitree_rl_lab/blob/4960b84732b0c2ec593dccbfe963fda1bcd7b1e3/README.md#L135-L137); UR4 [README](https://github.com/unitreerobotics/unitree_rl_gym/blob/276801e46c5d433564f24658bac64f254b7d2d4b/README.md), process overview and physical deployment.

These findings are reflected in [technical-map entries AS02–AS04](../stack.md#as02--onboard-compute-and-physical-limits-unitree-g1g1-edu): purchased configuration, developer interfaces and training environments are recorded separately.

## What AQ02 can now answer—and the next evidence to request

**Answered:** which named packages this particular public developer route declares; where Unitree-specific interfaces/binaries enter; which alternative routes Unitree publishes; and why product configuration, development compute and onboard runtime must be recorded separately.

**Still open:** engineering and commercial switching costs, equivalent task performance, full transitive and binary provenance, and the actual shipping implementation. No military procurement, fielding or transfer is established by these records.

For a civilian developer/customer, request a redacted purchased configuration plus firmware/software inventory, a locked environment for one published result, and a migration record identifying staff time, retraining runs, regressions and acceptance tests. Ask whether the customer kept the stock controller or used an approved developer controller. Those records would turn a dependency map into a switching-cost assessment; this source inspection alone cannot.
