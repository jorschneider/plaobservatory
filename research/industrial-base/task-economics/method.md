# Task-economics method, version 1.0

The unit is **robot version and bounded pool × customer workcell × accepted task × observation period**. Compare the complete customer workflow, including human assistance and manual fallback, with the actual alternative delivering equivalent output.

## Accepted output

Give every demanded task a unique ID. Retrying creates another attempt, not another task. The closed cohort has five disjoint outcomes: accepted without intervention, accepted with assistance, accepted wholly by manual fallback, failed, unresolved. Their sum equals demanded tasks. Include carried-in backlog explicitly.

Acceptance must specify quality and deadline. Inspection requires usable coverage and an accepted report; walking a route is insufficient. A transfer requires a correctly placed, undamaged load accepted by the next station. Record who applies the acceptance rule.

`accepted tasks = accepted unassisted + accepted assisted + accepted manual`

`cost per accepted task = complete period workflow cost / accepted tasks`

Expose numerator, denominator, robot-involving share and unassisted share. Manual fallback belongs in both output and cost. Zero accepted tasks makes unit cost undefined. Unknown required inputs keep the complete result unavailable; a known subtotal is not the total or an asserted lower bound.

## Period costs

Use one currency, consistent tax treatment, the same start-inclusive/end-exclusive period and documented workcell allocation. Categories are equipment or service, integration, labor, maintenance, energy, software/connectivity, and other. Review consumables, insurance, site costs and remaining attributable costs under other; do not insert a hidden overhead factor.

For owned equipment, capital allocation is an explicit **scenario**:

`period equipment allocation = (delivered cost − residual value) × period days / useful-life days × allocation share`

Apply the same approach to one-time integration over its assumed life. Residual must lie between zero and acquisition cost, life be positive, share between zero and one, and allocation remain within that life. Include required payloads, docks and attributable backup equipment. Integration covers commissioning, software work, training and workflow changes outside the equipment line. Expose upfront cash separately; do not add it again. Financing/discounting is outside this method unless included consistently for both alternatives.

For service, enter the period charge including commitments, usage fees and credits. Record bundled categories and the covering line; do not charge them twice. Include unbundled setup and customer labor. The calculator accepts nonnegative net charges; unusual negative-credit periods need a documented extension, not clipping to zero.

Labor is allocated **person-hours × fully burdened hourly cost**, by role: setup, supervision, teleoperation, recovery, maintenance, review and fallback. Two people working concurrently consume two person-hours. Do not charge one person's time twice. Keep the raw labor ledger and reference it in the aggregate line. Shared supervision needs measured allocation. Do not duplicate labor already covered in repair invoices. Energy must be metered or explicitly modeled; battery capacity is not energy per task.

## Time and conditions

Use mutually exclusive **aggregate robot-hours for the same pool**:

`scheduled = active + idle + charging + planned maintenance + unplanned downtime`

Assign cooldown and software recovery to a documented primary bucket. Overlapping repair/charging has one primary bucket plus tags. Charging outside scheduled time still costs energy. Human person-hours remain separate.

`active share = active robot-hours / scheduled robot-hours`

`robot-involving accepted throughput = (accepted unassisted + accepted assisted) / active robot-hours`

Missing clock buckets withhold these ratios; they do not block cost calculation if period costs and accepted output are complete. Never apply an uptime discount to throughput already measured across scheduled time. Collect mass, geometry, reach, posture, travel, temperature, battery conditions, control mode and surrounding constraints using the request sheet.

## Evidence and implementation boundaries

Numeric cells contain `value`, `basis` and `reference`. Units are fixed: counts are unique tasks, time is hours, cost is period currency; `robotCount` is integer pool size. `reported` means attributed evidence, not an independent audit. `assumed` requires a `scenario`; assumed scope fields also require that classification. `unknown` requires null. Zero requires a reference. Excluded costs need a reason and evidence or an explicit assumption. The synthetic example cannot update source evidence.

The calculator validates dates, nonnegative numbers, integer counts, cohort/clock reconciliation, calendar pool-hour capacity, cost coverage, missingness and numeric scenario separation. It does not deduplicate raw logs, infer labor allocation, compute depreciation, convert currencies, validate task-specific physical feasibility or authenticate sources. A complete arithmetic result remains conditional on reviewed scope and inputs. Evidence claims never fill numeric ledger cells automatically.

For sensitivity, copy the ledger, set `kind` to `scenario`, label changed cells `assumed` and explain them in `reference`. Vary support, integration, service charge, accepted output and equipment life separately before joint scenarios. Ranges are not confidence intervals. Compare identical task, site, acceptance, period, currency and workflow boundaries. Hours avoided become cash savings only when staffing or spend changes; exposure, coverage and resilience remain separate outcomes.
