# Understanding Chinese autonomy: authority, capability and deployment

Research edition: 10 September 2026. Read this synthesis and the [worked-case analyst brief](cases/README.md), then the [doctrine sourcebook](doctrine.md), [technical evidence map](stack.md) and [deployment economics](../industrial-base/task-economics/README.md). The [research queue](questions.json) records progress and the evidence that would change the analysis.

**The productive unit of analysis is a function, performed under stated conditions, with a stated division of human and machine responsibility.** A company or a chassis is too broad. A robot can balance autonomously, receive its destination from a person, flag an anomaly with uncertain accuracy, and require a technician to recover after a fault. Calling the whole system autonomous conceals the questions an analyst needs to answer.

China's public policy clearly favors unmanned and intelligent systems. The harder research problem is connecting that direction to a specific allocation of authority, a working technical system and a repeatable operational result. Keep those three claims separate.

## What “doctrine” can mean in this evidence base

| Kind of source | What it tells us | How to use it |
|---|---|---|
| Promulgated military regulation | Rules or institutional requirements, where its actual text is available | The 2020 Joint Operations Outline announcement establishes that a regulation exists. Its autonomy provisions were not reviewed. Do not reconstruct them from commentary. |
| National plan or policy white paper | Development priorities and declared policy | Use for direction, authority and industrial priorities, not proof of a deployed capability. |
| Signed military newspaper/research article | An author's proposed concepts and arguments | Track authors, institutions and repetition. Publication on a military website does not make every proposal binding doctrine. |
| Exercise or demonstration report | A reported event under particular conditions | Identify the exact function and remaining human work; an appearance is not routine operational effectiveness. |
| Acceptance or operating record | Tested performance for a defined system and task | Most valuable for closing the gap between aspiration and capability; scope and provenance still matter. |

The formal anchor for modernization is the approved 2026–2030 national plan: chapter 55 links unmanned/intelligent forces to wider military information-system development; chapter 56 addresses civilian technology transfer and standards compatibility. This is an industrial and institutional agenda, not a supplier list. [Authorized plan text, chapters 55–56](https://www.news.cn/politics/20260313/085af5de5a4b4268aa7d87d90817df2f/c.html).

The declared human-control anchor is the 2025 arms-control white paper. It retains human primacy and ultimate responsibility and calls for preventing unauthorized actions. That does not tell us which decisions a particular operator must approve, how supervision works, or whether interruption is reliable in a deployed system. [White paper, Part IV, military AI subsection](https://www.mfa.gov.cn/web/wjb_673085/zzjg_673183/jks_674633/jksxwlb_674635/202511/t20251127_11761606.shtml).

My analytical reading is that **central human authority and delegated machine execution can coexist**. We should not infer either complete automation or continuous manual control from the policy language. The important questions concern the function delegated, the conditions attached to it, and what happens when those conditions fail. The sourcebook records where signed PLA Daily authors discuss these questions without treating their arguments as adopted rules.

## Three interacting parts of autonomy

This is an analytical diagram, not a claimed Chinese system architecture. Arrows show functions and feedback, not supplier contracts.

```mermaid
flowchart TD
    H["Human authority: authorize, monitor, intervene, review"] --> W["Work organization: assign task, schedule, integrate"]
    W --> P["Task and motion decisions"]
    S["Sensors and state estimation"] --> P
    P --> C["Control, actuation and physical work"]
    C --> S
    C --> O["Accepted output and exceptions"]
    O --> H
    O --> D["Logs, demonstrations and failure data"]
    D --> T["Training, simulation and evaluation"]
    T --> R["Qualified release and change control"]
    R --> P
    E["Compute, communications, power and thermal limits"] -.-> W
    E -.-> P
    E -.-> C
```

**Physical execution** converts observations into actions. Localization asks where the machine is; perception asks what is present; task planning asks what to do; control produces physical motion. A better language model cannot be assumed to repair calibration errors, hardware wear or inadequate continuous power.

**Work organization** makes movement useful. Someone defines the task, supplies material, manages other machines, handles blocked access, accepts output and resolves exceptions. A fleet dispatcher, enterprise interface or experienced integrator may be economically decisive even when the robot manufacturer attracts the attention.

**Improvement and assurance** determines whether a demonstrated skill survives a new site or software release. Training trajectories, evaluation separation, failure cases, release management and acceptance tests belong in the ecosystem map. A large dataset is an input; it is not a count of autonomous customer jobs.

Human responsibility spans all three. Record authorization, training-data teleoperation, live remote operation, monitoring, exception intervention, recovery and maintenance independently. They differ in both doctrinal meaning and labor cost.

## What the stack evidence already changes

| Layer | Concrete evidence to examine | Analyst implication |
|---|---|---|
| Sensing and localization | HKU's FAST-LIVO2 release, including calibration/synchronization requirements | A navigation claim needs its sensors, environment and evaluation conditions. |
| Onboard compute and physical envelope | Unitree G1 configuration table and posture-dependent load footnotes | Do not assign one processor or sustained payload to every configuration. |
| Runtime and interfaces | Unitree's CycloneDDS/ROS2 documentation | Chinese hardware can expose internationally maintained software dependencies; a public interface is not the full internal stack. |
| Learning and simulation | Unitree's RL workflow; UniVLA's arm experiments | Separate development tools, laboratory policies and shipping controllers. |
| Data production | AgiBot World collection operation | Training teleoperation is distinct from deployment teleoperation; dataset volume is distinct from successful work. |
| Energy and actuation | G1 physical specifications; Walker S2 battery-swap claims | Continuous work depends on load, heat, station access, spares and repair, not just battery autonomy. |
| Fleet and customer integration | Hikrobot scheduling software; DEEP/EGP/SPock integration | Many apparent autonomy gains depend on surrounding infrastructure and engineering services. |
| Assurance | Published and draft standards, with separate configuration-specific test evidence | A draft or standards participant is not proof that an integrated system passed a test. |

Each row links conceptually to records AS01–AS10 in the [technical map](stack.md), which provides primary URLs, locators, evidence stages and limitations. The map does not claim that all the named products interoperate or that these dependencies are irreplaceable. Replacement cost, available substitutes and qualification effort remain research questions.

## Broader than humanoids

Use the same function-based questions for industrial arms, warehouse vehicles, quadrupeds, aerial or maritime platforms, and software used for command support. The operating environment and physical constraints differ substantially; sharing a term such as perception or planning does not make implementations interchangeable. This is a comparison framework, not evidence that any named product has crossed domains.

Humanoids are one embodiment. They are a useful test of manipulation and physical integration, but cannot stand in for all Chinese autonomy. A conventional warehouse system may deliver valuable bounded autonomy with specialized software. A software decision-support system can change organizational work without moving a robot. Conversely, a sophisticated body can remain dependent on extensive human direction.

The doctrine question is therefore broader than “does the PLA want robot soldiers?” Ask how institutions expect people, software and unmanned platforms to divide work, what information and organizational infrastructure they require, and how those ideas are evaluated. Public aspirations are clearer than the system-specific answers.

## How civilian capability could matter militarily

Maintain three separate claims:

1. **Technical relevance:** a capability might be reusable across sectors. This is a hypothesis.
2. **Documented transfer:** a dated record identifies the organizations, artifact or team, and the actual relationship.
3. **Demonstrated military result:** evidence establishes what the transferred capability does under stated conditions.

The national plan supports a policy preference for transfer. The civilian stack cases establish particular research, product and integration capabilities. Neither establishes the missing transaction or military result. Similar vocabulary, a recognizable quadruped or a shared institution cannot close those gaps. The existing [relationship dossiers](../industrial-base/relationship-method.md) provide the model for preserving attribution and transaction stage.

## Worked cases advance the evidence

The [analyst brief](cases/README.md) brings seven observations together: three public military support cases, Unitree's pinned developer dependencies, EHang's passenger operations, Shuguang ownership/cooperation and Jingpin's warehouse software. The strongest new transfer evidence is an explicit report of a civilian team collaborating on a military warehouse system, although the team is unnamed. Buyer filings close an ownership gap; a software-development table exposes the difference between progress and intended goals. These findings are integrated into the relationship dossiers and collection queue.

The cases make different human roles visible without yielding a universal doctrine or a common autonomy score. They also show why software alternatives, ownership and operating readiness require separate records. See the brief for industrial hypotheses, their remaining evidence gaps and questions suitable for a robotics analyst interview.

## Turn understanding into original reporting

**Follow one complete civilian workflow and one bounded authority question.** For the workflow, seek the Zeekr CTU workcell or SP Group inspection records described in the economics package. Map the robot, sensors, compute, software interfaces, integrator, human roles and accepted output. That connects supply-chain questions to evidence of useful work.

For the authority question, collect publicly available rules, standards or acceptance documents describing authorization, intervention and auditability for a named system. A formal requirement and a tested implementation are different evidence. Adding more essays about intelligent warfare will not substitute for either.

The resulting analyst brief should show where a claim is strongest and where the chain breaks: policy → proposed role → technical artifact → integration → acceptance → operation. These are evidence categories, not an automatic maturity ladder. A system can have strong locomotion evidence and no measured task success. The [research queue](questions.json) gives eight specific questions, disconfirming explanations and evidence requests.

This release is a selected public-source foundation. It does not establish classified doctrine, sector-wide dependence, representative vendor rankings or combat effectiveness. Economics sources retain their 5 September review date; this autonomy extension is checked through 10 September. Source-level access and version limits are retained in the sourcebooks and worked cases.
