# Methodology

## The analytical problem

Chinese military personnel analysis faces three recurring errors: treating a dated title as permanent incumbency, treating visibility as promotability, and treating a plausible career story as a probability. The Observatory is structured to make those errors harder.

The workflow has two linked but distinct layers:

1. **Documentary layer:** identities, dated roles, ranks, Party/state records, claims, sources, adverse states, and gaps.
2. **Estimative layer:** target-seat access, completed conversion gates, pathway strength, mission fit, Party qualification, career runway, alternative regimes, and disconfirmers.

No amount of estimative confidence can repair a broken identity chain or convert a historical title into a current appointment.

## Unit of assessment

Every board defines an event before it scores a person. Examples include holding an apex Party-military seat in a specific decision window, reaching a service-principal position, or converting from a feeder billet into formation authority.

This matters because “likely to remain senior,” “likely to be promoted,” and “likely to enter the Central Military Commission” are different events with different denominators. Long-horizon feeder watches are not presented as apex forecasts.

## Structural Promotion Index

The displayed 0–100 range is a structured comparative index, not a frequentist or Bayesian probability.

| Component | Maximum | Question |
|---|---:|---|
| Target-seat access | 25 | How far is the supported current role from the exact target seat? |
| Completed gates | 20 | Which mandatory grade, command, organizational, and Party conversions are already cleared? |
| Observed route strength | 20 | How often has the institutional route produced the target type of leader? |
| Mission/portfolio fit | 15 | Does the record fit the institutional purpose of the target seat? |
| Party qualification | 10 | What public Party standing is relevant to the selection event? |
| Career runway | 10 | Is there verified time to clear the remaining gates in the decision window? |

Each component is expressed as a range. The bounds widen when roles, ages, identities, or institutional routes are unresolved. Correlated facts are not double-counted: rank and a synchronized leader-grade appointment, for example, may be one conversion event rather than two independent merits.

Scores should be read as **relative route strength under stated assumptions**. They do not include a hidden political-clearance probability, and they do not imply that the expected number of winners equals the sum of scores.

## Selector funnel

An officer reaches a target seat through five gates:

1. **Formal eligibility:** rank, grade, time in billet, career runway, and exact appointment qualifications.
2. **Professional qualification:** command conversion, professional ability, responsibility, and observable work performance.
3. **Political and discipline clearance:** mostly hidden; public silence cannot establish it.
4. **Finite-seat portfolio fit:** the selected CMC or service architecture may not contain a seat for every strong pathway.
5. **Formalization:** a Party decision, appointment text, rank regularization, or repeated exact-title performance.

An “acting” or “work-handler” role is therefore a live proposition with a formalization gate, not an appointment fact.

## Selection regimes

Candidate robustness is tested under four alternative regimes:

| Regime | Central logic | Paths favored |
|---|---|---|
| Institutional equilibrium | Restore regular leadership and bureaucratic balance | Service headquarters, theater components, conventional ladders |
| Control-led reconstitution | Political assurance and supervision dominate | Discipline, political work, personnel, trusted central deputies |
| Operational-readiness repair | The center privileges warfighting and training competence | Theater command, formations, training management, Joint Staff |
| Technical-integration turn | Cross-domain integration becomes the scarce leadership attribute | Technical expertise converted into force or formation authority |

A fifth state—purge-driven improvisation—is treated as governance failure rather than a coherent selection strategy. Under it, acting arrangements persist, rank-billet mismatches remain, and adverse cases accumulate faster than principals are formalized.

## Historical evidence and denominators

Historical biographies usually reveal `P(route | selected)`: the share of past winners who used a route. Forecasting requires `P(selected | route, eligible risk set, available seats)`. The latter denominator is largely unavailable in public data.

The model therefore uses historical routes as gates or priors, not as direct selection probabilities. It explicitly tracks the missing eligible-loser population as a foundational research gap. Small cohorts, institutional reforms, and the current purge/re-certification cycle limit out-of-sample confidence.

## Evidence hierarchy

Source quality and claim scope are separate dimensions. The working preference is:

1. Formal Party/state decisions, appointment lists, and authoritative regulations.
2. Official Chinese military, central, provincial, and institutional reporting that names the person and exact title.
3. Specialist research with transparent sourcing and reproducible personnel reconstruction.
4. Reputable reporting, archival discovery, and lower-confidence biographical aggregations used as leads.

An official source can still be insufficient: ceremony coverage may establish a title on one date but not current continuity, grade, authority, or birth year. Every mapped claim records a temporal scope and, where useful, a `doesNotSupport` boundary.

## Fact, inference, speculation

- **Confirmed fact** requires a claim-scoped source that directly supports the proposition.
- **Reasonable inference** requires convergent observations and an explicit alternative explanation.
- **Speculation or hypothesis** must be framed as a collection target with observable confirmation and disconfirmation conditions.

Protocol order, a photograph, chairing one event, or reappearance after an absence can narrow hypotheses. None alone proves a formal appointment, patronage relationship, political clearance, or operational effectiveness.

## Identity controls

Names are normalized to stable IDs only after the available English/Chinese name, institution, title, career sequence, and temporal record are sufficiently consistent. Pseudonyms and unresolved homonyms remain held rather than entering a named ranking. The model does not merge people solely because Romanized names match.

## Adverse-event firewall

Confirmed removals, investigations, and unresolved adverse watches are maintained outside the positive candidate universe. Public silence is not affirmative evidence of cleanliness. Conversely, unexplained absence is not automatically coded as a purge: the assessment looks for event expectancy, complete enumeration, peer controls, repeated misses, formal action, and later resolution.

Automated tests reject stable-ID overlap between the active and adverse universes and reconcile the canonical population across active and held buckets.

## Behavior and performance evidence

Official profiles, exercises, writings, rescues, patrols, and reforms can illuminate how an officer thinks or acts. They are coded narrowly:

- A signed article may show a coherent professional worldview, not implementation.
- Exercise participation may show exposure, not command responsibility.
- Unit performance may show organizational output, not individual causation.
- A promotional profile may generate a hypothesis, not an effectiveness grade.

The preferred evidence is repeated across roles and sources and includes a failure, adaptation, after-action judgment, or independently observable institutional result.

## Network analysis

Shared hometowns, academies, military regions, or broad career labels produce dense but weak graphs. The Observatory privileges scarce, dated institutional overlap: direct command dyads, succession chains, small operational cohorts, and demonstrable pre-promotion relationships.

Every network edge should identify duration, hierarchy, direction, temporal ordering, independent support, and a competing non-patronage explanation. Without those elements, it is a proximity observation, not a faction claim.

## Long-horizon treatment

Publicly visible ship captains, pilots, scientists, and technical officers are drawn from much larger feeder populations. Naming them can create a denominator illusion. The 2041 treatment therefore emphasizes pathway portfolios and observable conversion gates. Most eventual identities are expected to remain unnamed until they reach formation, base, fleet, academy, test/training, Party-committee, or senior-staff authority.

## Update protocol

For each release:

1. Freeze an assessment cutoff and archive mutable source pages when lawful and practical.
2. Resolve identity before merging records.
3. Add claim-scoped observations with dates, source modes, and non-support boundaries.
4. Reassess role state and title freshness independently of promotion scoring.
5. Move adverse or unresolved cases through controlled buckets rather than deleting history.
6. Update candidate ranges, next gates, and disconfirmers only after the documentary layer changes.
7. Regenerate the public JSON/CSV and deterministic build ID.
8. Run integrity, model, rendered-output, and lint checks.

## Known limitations

- The public record does not reveal political vetting, internal evaluations, health, full promotion slates, or the eligible-loser denominator.
- Many birth years, grade conversions, and current principal appointments remain unresolved.
- Chinese official reporting is selective and can be revised or removed.
- Translation can erase distinctions among principal, deputy, acting, and work-handler authority.
- The model is an estimative framework with analyst-assigned ranges, not a trained statistical predictor.
- The checked-in repository does not yet contain the complete archived `research_v2` extraction package used in the earliest consolidation stage.

These limitations are part of the result. The site should make them visible rather than compensate with false precision.

