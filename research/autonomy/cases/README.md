# What the worked cases tell an analyst

Research edition: 10 September 2026. This brief connects the [doctrine sourcebook](../doctrine.md), [technical map](../stack.md) and [deployment economics](../../industrial-base/task-economics/README.md) to specific records. It is a selected sample, not a census of Chinese autonomy.

**The strongest working thesis is that useful autonomy is a property of an organized workflow.** The machine may execute movement, a person may define the task, and another organization may supply the integration, training and recovery. Chinese policy encourages this broader system of capabilities. The cases below show several of its parts in practice; they do not establish a single integrated national stack.

For an industrial analyst, the next useful question is who can make that workflow repeatable at another site, and at what cost. Chassis output, model benchmarks and demonstration videos each leave much of that question unanswered.

## Seven observations that change the map

| Case | Concrete evidence gained | What the analyst can now say | Evidence still needed |
|---|---|---|---|
| Logistics UAV | An official report explicitly describes a human using a handset during landing. | Unmanned transport can retain live piloting. | Automated functions, staffing and operating logs. [Case A](human-authority.md#case-a--logistics-uav-unmanned-vehicle-explicit-remote-operator). |
| Medical transport vehicle | A requirement specifies several modes and an operator interface; a later notice names a provisional supplier. | The buyer sought both automated functions and human control. | Final specification, executed agreement and acceptance. [Case B](human-authority.md#case-b--casualty-transfer-vehicle-requirements-then-provisional-supplier). |
| Naval warehouse | A report describes software-directed handling after human requests and collaboration with a civilian team. | There is a reported civil–military integration relationship at team level. | Team identity, artifact/version and independently assessable performance. [Case C](human-authority.md#case-c--naval-aviation-warehouse-human-requests-automated-bounded-replanning). |
| Unitree developer tools | Six official repositories inspected at pinned commits expose packages, interfaces, binaries and alternative simulators. | Some dependencies are implementation-specific; replacing a simulator does not necessarily replace the GPU vendor. | Purchased configuration, shipping firmware and measured migration cost. [Dependency study](unitree-dependencies.md). |
| EHang passenger aviation | Certifications, internal trials, human training and public ticketed launch have different evidence states. | Aircraft autonomy and service readiness must be measured separately. | Operator/route-specific paid-flight and ground-support records. [Operations study](ehang-operations.md). |
| Shuguang ownership | Buyer filings extend ownership evidence through June 2026; signed terms contemplate further Estun cooperation. | Equity exit does not establish that every technical relationship ended. | The separate cooperation agreement and delivered work. [Ownership study](ownership-and-software.md). |
| Jingpin warehouse software | The same project has dated development progress across two reports; its tender objective remains a goal. | Commercial coordination software is being developed inside a defense-related robotics group. | Named customer acceptance and any actual shared military/civil software lineage. [Software study](ownership-and-software.md#additional-concrete-autonomy-case-jingpins-warehouse-software-has-dated-progress-but-its-tender-language-is-a-target). |

The linked records provide original URLs, locators, dates and access limits. A newspaper reproduction is one underlying report; several company releases remain one corporate account. These are different evidence types, not seven independent measurements of sector performance.

## How this changes the doctrine question

There are three questions to keep alongside each other:

1. **What does the state direct?** The national plan puts unmanned/intelligent development alongside information systems and technology transfer. That establishes institutional intent. [Authorized plan, chapters 55–56](https://www.news.cn/politics/20260313/085af5de5a4b4268aa7d87d90817df2f/c.html).
2. **How do military authors think work should be divided?** Signed articles discuss human judgment, machine computation and task-dependent delegation. These are useful concepts, with less authority than an adopted operating rule. [D07 and D08, with publication status](../doctrine.md#d07--task-dependent-allocation-of-human-and-machine-functions).
3. **How does a particular organization divide work?** The support cases show remote operation, requested automated modes and reported software-directed handling. They make the conceptual question concrete without turning a few examples into universal doctrine. [Three cases](human-authority.md).

My reading is that these sources are compatible with **central authority over objectives and selective delegation of execution**. The warehouse example fits that interpretation: humans determine the material need while software organizes handling. It does not prove that an adopted rule caused the workflow, or that the same authority arrangement applies elsewhere.

The public human-control commitments concerning weapon systems require a separate inquiry. Unarmed support cases cannot establish compliance with those commitments, and none supplies a tested override or acceptance record. The full 2020 Joint Operations Outline also remains unavailable in this review. [Policy and regulation boundaries, D02–D04](../doctrine.md#d02--cmc-joint-operations-outline-promulgation).

## Where the industrial research should concentrate

**First, investigate integration as a product.** The warehouse case makes civilian technical assistance visible; Jingpin identifies a commercial scheduling/software effort. These support a research hypothesis that dispatch, enterprise interfaces and deployment know-how can be transferable assets. They do not establish that the two systems share a vendor or code. Trace one named installation from software release to acceptance and support costs. Repeated deployment with falling engineering hours would support a scalable product; repeated bespoke work would point toward a services business. [Warehouse report](https://military.people.com.cn/n1/2026/0410/c1011-40698784.html), [Jingpin H1 2026, R&D table pp16–17](https://static.cninfo.com.cn/finalpage/2026-08-25/1225497124.PDF).

**Second, measure dependence at the layer where it occurs.** A middleware package, training GPU, optional onboard module and proprietary binary create different replacement problems. The Unitree inspection gives concrete starting points and documented alternatives. The missing quantity is the burden of maintaining equivalent results after a change: staff time, compute, retraining, regressions and qualification. A list of foreign package names cannot answer that. [Pinned dependencies and alternatives](unitree-dependencies.md).

**Third, evaluate operating support as part of the product.** EHang's disclosures make training and ground infrastructure visible alongside pilotless flight. Its cooling-support claim is especially useful as a question about the system boundary, although the public figure lacks a matched service ledger. A product can improve while its service remains difficult to scale. Compare accepted output and all support work over the same period. [EHang operations study](ehang-operations.md), [Q2 2026 readiness discussion](https://ir.ehang.com/news-releases/news-release-details/ehang-reports-second-quarter-2026-unaudited-financial-results/).

**Fourth, map transfer as a chain of artifacts and organizations.** The Shuguang transaction provides unusually concrete ownership evidence and prospective cooperation terms. The warehouse report provides a collaboration without naming the civilian party. Jingpin provides a common corporate boundary without proving common code. These establish different organizational connections and possible transfer routes, each with missing links. Preserve them separately. [Ownership and software evidence](ownership-and-software.md).

## A useful next conversation with robotics analysts

The objective is to explain where capability compounds across deployments. These are suggested interview questions, not outreach already sent:

| Question | The artifact that would make the answer persuasive |
|---|---|
| Which part of a successful deployment was reusable at the next customer? | Two matched scopes of work, engineering hours and acceptance records. |
| When you say the robot is autonomous, which functions and human jobs do you mean? | One shift's task, intervention, recovery and staffing records. |
| Which dependency would be expensive to replace, and why? | A versioned configuration plus a real migration record. |
| Is a research policy related to the shipping controller? | Release/configuration evidence that connects them, or an explicit statement that they are separate. |
| What crossed the civil–military boundary? | A named component, software version, team or service tied to a dated relationship. |
| What would make you revise your assessment? | A pre-specified result: accepted work, failure/recovery burden or repeat-deployment cost, measured over a stated period. |

The highest-value deliverable remains one end-to-end civilian workflow with matched technical and economic records, alongside one documented transfer or authority case. The [collection queue](../questions.json) now records what these studies answered and what remains open. No system here has enough evidence for a defensible cost-per-accepted-task estimate.
