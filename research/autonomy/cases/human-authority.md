# Three public cases of human authority and machine execution

Research checked: 10 September 2026. Prepared for the PLA Observatory autonomy extension. These are selected public examples, not a representative sample or evidence of combat effectiveness. No OEM is inferred from photographs. They describe unarmed transport, medical transport and warehouse handling.

**Finding:** The evidence supports distinguishing remote operation, human task authorization and bounded automated execution. These are different allocations of work. It does not support collapsing every machine into a single autonomy score.

## Case A — Logistics UAV: unmanned vehicle, explicit remote operator

**Evidence:** Xinhua reporter Huang Yichen, reproduced by the Ministry of National Defense, 30 August 2022, “来自联勤保障部队某汽车团的报告：万里驱驰走神州.” [Official MOD text](https://www.mod.gov.cn/gfbw/wzll/4919826.html); [China Military Online reproduction](https://www.81.cn/tp_207717/jdt_207718/10181570.html). Same underlying report; not two independent witnesses.

**Locator:** opening paragraph; section “着眼未来”; caption dated 7 April 2022. Event: unit transport exploration/training in 2022; exact date of opening scene unstated. Customer/unit: unnamed Joint Logistics Support Force automobile regiment. Airframe/version/OEM: unstated.

**Function and authority:** A company commander operates a handheld controller while the cargo UAV lands. A separate exercise vignette says the regiment command post decided to dispatch a UAV with a repair part. The report describes pilot training, simulators and training records. It establishes human task assignment and live remote control in those reported scenes. It does not identify which onboard stabilization/navigation functions were automated.

**Short excerpt:** “操作遥控手柄” — “operates the remote-control handset.”

**Limits:** Exercise/reportage, not acceptance or longitudinal operating logs. No operator-to-aircraft ratio, intervention frequency, autonomous-mode usage or recovery process. The article’s successful delivery anecdote is not a throughput or reliability denominator.

**Analyst implication (inference):** Organizational modernization can involve replacing driving with piloting while retaining substantial human control. Do not count “无人” as labor-free or autonomous task execution.

## Case B — Casualty-transfer vehicle: requirements, then provisional supplier

**Requirement source:** Military Procurement Network, 12 May 2025, “采购无人车系统意向公开,” project **2024-JL13（02）-W1040**, package 1. [Official notice](https://www.plap.mil.cn/freecms/site/juncai/ggxx/info/2025/8a1d03b395320c2f0196b30bbeaa22d4.html).

**Locator:** section II, requirements table, “无人车系统（1）”; function requirements items (3)–(5); technical requirements (17)–(19), (25)–(26). The intent table lists two systems. Each includes a casualty-transfer platform and support module; it is not simply a bare chassis.

**Function and authority:** Intended modes include remote control, following and path planning, with automatic obstacle avoidance. The operator interface must control modes and return video/status. Requirements include geofencing, emergency stopping, return behavior after link loss, and operator–occupant voice communication. These are requested interface and safety behaviors, not verified test results or a general PLA control regulation.

**Short excerpt:** “远程遥控、跟随控制、路径规划工作模式” — “remote-control, following-control and path-planning operating modes.”

**Unknown:** Mode-selection authority, takeover priority, actual intervention/recovery practice, qualification evidence and acceptance results. No assertion that a purchased machine implemented the intent specification; final tender terms may differ.

**Procurement follow-through:** The [28 July 2025 official results notice](https://www.plap.mil.cn/freecms/site/juncai/ggxx/info/2025/8a1d02cc984a739701984faf1ff3132c.html), same project number, names **南京华格信息技术有限公司** (English rendering: Nanjing Huage Information Technology Co., Ltd.; registered English name not verified) as the provisional winning supplier, with a **RMB 1,200,000 package quotation**. Locator: sections III–V; objection period 29–31 July. The notice explicitly says “预中标,” so record **provisional result**, not executed contract, delivery or acceptance. It identifies the supplier, not necessarily the manufacturer. Do not divide the package quote by two to imply robot unit price. Bounded follow-up searches for this exact project number plus contract, acceptance, amendment and final-result terms found no later primary notice; this is not proof that none exists.

**Analyst implication (inference):** This is a concrete bridge between desired function, a human-facing interface and a procurement candidate. The bridge still ends before qualification and use. It is stronger evidence about buyer requirements than an exhibition or generic company capability statement.

## Case C — Naval Aviation warehouse: human requests, automated bounded replanning

**Evidence:** PLA Daily / China Military Online, Qiao Jingfeng, **10 April 2026**, “海军航空兵某部利用科技手段赋能仓库管理,” subheading “物资调拨有了‘智慧助手’.” [Official source](https://www.81.mil.cn/hj_208557/16454705.html); [People’s Daily reproduction](https://military.people.com.cn/n1/2026/0410/c1011-40698784.html). One report, not independent corroboration.

**Locator:** first paragraph (initial request); third body paragraph (revised request); second paragraph (civilian cooperation). Event: recent aviation-material emergency-support training, exact date unstated. Unit/site/version/OEM: unnamed.

**Function and authority:** A storekeeper enters the superior’s material request. Software locates stock and plans forklift movement. When the superior changes the request, the storekeeper enters revised parameters; the system generates a new handling plan and directs re-sorting of stock not yet dispatched. The article attributes development to military specialists working with an unnamed civilian technical team.

**Short excerpt:** “根据上级要求” — “according to the superior’s requirements.”

**Limits:** Reported exercise and in-use system, not audited acceptance data. Human monitoring, exception handling and physical recovery are unstated. The claimed reduction from dozens of workers to two or three lacks matched task, duration and throughput definitions; do not use it in cost/task calculations. Broader traceability/prediction appears as a future aim.

**Analyst implication (inference):** Bounded automated replanning can coexist with human control of task objectives. The report documents a civilian collaboration at team level, but cannot attribute a vendor, contract or particular software stack.

## Comparison without an autonomy score

| Case | Human contribution evidenced | Machine contribution evidenced/requested | Evidence ceiling |
|---|---|---|---|
| A: UAV cargo | Dispatch decision; live handset operation; operator training | Transport scene reported; onboard automated functions unspecified | Official exercise/reportage |
| B: medical transport | Mode-control interface, video/status supervision and voice link requested | Following/path planning and safety behaviors requested | Procurement intent plus provisional supplier |
| C: warehouse | Superior chooses/revises need; storekeeper enters parameters | Stock location, bounded route/handling replanning and forklift direction reported | Reported training/in-use workflow |

**Interpretation:** None establishes a universal command doctrine. A and C reveal different human roles in observed/reportorial contexts; B reveals what one buyer sought. They support function-level questions and preserve the gap between a rule, a requested feature and a tested implementation.

## Access and evidence notes

- Access was checked on **10 September 2026**. Case A uses the complete indexed official report; direct retrieval failed. Case B's intent and provisional-result notices were subsequently downloaded from the original PLAP URLs over verified HTTPS, and their full bodies were checked. Case C's complete indexed original was checked against a full download from the [official People’s Daily HTTP mirror](http://military.people.com.cn/n1/2026/0410/c1011-40698784.html); HTTPS retrieval failed certificate validation. No certificate checks were disabled. The mirror reproduces the same report and supplies no independent corroboration.
- Download hashes below identify the verification copies. Full source copies are not published in this repository; these are retrieval records, not permanent archive links.

| Retrieved page | SHA-256 of downloaded HTML |
|---|---|
| Case B: procurement intent | `f96d8202a32bec82e155ef9870324694d1b9aab9555a5588bdc7f3dd1d457235` |
| Case B: provisional result | `03724c1054a953f085484434b6cc08904994b92de63e2523094531e63d276d3d` |
| Case C: People’s Daily HTTP mirror | `7777733636167490b24cc9ec3e59a1af46e85e910f0540355f9d8eb0c812f6e3` |

- Primary publication does not mean independent measurement. The newspaper reports are institutional reportage; the procurement records establish the issuer’s stated requirements/results only.
- Excluded candidate: 2015 Armed Police transport-force rescue-equipment report with remote operators. It is historical and organizationally distinct; the three cases above give a cleaner current research sample.
