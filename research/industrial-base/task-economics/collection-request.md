# Workcell evidence request

Working interview/data request; not sent. Seek two consecutive representative operating weeks, including failures, plus commissioning records and longer repair history. Explain holidays, changing demand and other reasons the period may be atypical. Agree the task definition before requesting ROI.

## Identify the workcell / 明确测量对象

- Customer legal entity, factory, workcell, integrator, dates and time zone.
- Model, pool count, hardware/software revision, payload/end effector and version changes.
- Source/destination, path, acceptance tolerance, takt/deadline and downstream acceptance signal.
- Load mass distribution, geometry, lift/reach, posture, repeated-load duty cycle, ambient temperature and floor/space constraints.
- Autonomous, remote-operation, recovery and demonstration/training intervals; actual operator minutes.
- Actual alternative: staffed operation or scoped fixed-arm/conveyor/AMR design with equivalent acceptance and integration boundaries.

**这是同一工位、同一版本、同一任务和同一验收标准下的比较吗？**

## Raw records / 原始记录

| Record | Minimum fields | Purpose |
|---|---|---|
| Demand/attempts | Unique task ID; attempt ID; arrival/start/end; load or route; robot/version; mode; acceptance result/time; rejection reason | Retries must not inflate output. |
| Outcome reconciliation | Task ID; accepted unassisted / assisted / manual fallback / failed / unresolved; acceptance authority | Distinguish human completion. |
| Robot states | Start/end; serial; active / idle / charging / planned maintenance / downtime; reason; overlap tags | Count each robot-hour once. |
| Human support | Pseudonymous operator ID; role; start/end; task/event; activity; workcell allocation | Reset events alone do not measure labor. |
| Repair history | Failure mode/time; recovery; replacement; service visit; invoice; warranty coverage; exposure hours | Separate short resets from long failures. |

Retain interrupted attempts and explain missing logs. Measure charging and maintenance throughout the cost period, including outside production hours. Two weeks may miss rare failures; preserve the longest available incident history. Personal identifiers are unnecessary.

**请保留失败、重试、人工接管和人工补做的记录；不要只提供成功视频或平均节拍。**

## Costs / 成本与合同范围

Obtain delivered robot/payload/dock/backup cost or actual service contract and period fee. Itemize integration, qualification, software, commissioning, training and workflow modification. Record who pays for energy, spares, labor, shipping, insurance and remote support. Mark bundles with the covering contract line.

Record fully burdened labor cost and person-hours by role. Distinguish removed labor from reassigned labor or required coverage. Missing acquisition cost/life may be modeled as a labeled scenario after the measured operating record is fixed. An unrelated product's list price is not deployment cost.

**哪些费用包含在合同内？人工时间减少后，实际减少了多少支出，还是仅调整了工作内容？**

## Case-specific requests

| Case | First evidence to obtain | Judgment it changes |
|---|---|---|
| BYD / S1 | Define efficiency/stability; identify cell and comparator; obtain accepted transfers, intervention minutes and version-specific invoices. | Whether improvement translates into sustainable throughput and customer cost. |
| Zeekr / S Lite | Site/version/serial list; CTU acceptance log; actual working hours in the trial; box mass and geometry. | Whether work progressed beyond trials and needs a humanoid rather than simpler automation. |
| SP Group / SPock | Matched route/coverage; two-person safety rule; setup/review/rescue time; fleet basis for the >480-hour forecast. | Net labor reduction versus improved coverage or lower hazardous exposure. |
| BMW / Figure 02 | Reconcile ten/eleven-month windows and pool count; achieved acceptance/reset rate; incidents and repair costs. | Whether public aggregates support a comparable field benchmark. |

Before calculation, reconcile outcomes to demand, robot states to scheduled hours, human allocations to actual work and costs to the same period. Ask the customer to review the scope/exclusions. Keep contradictions. Publish total cost divided by accepted output, alongside human support, failed/unresolved tasks, time coverage, alternative, assumptions and missing inputs. A completed ledger is not an independent validation unless that validation occurred.
