# Contributing

Corrections, stronger primary sources, identity resolutions, and disconfirming evidence are welcome. The project values claim precision over biography length.

## A useful correction includes

- Stable officer ID, claim ID, or research-gap ID when one exists.
- Exact field or sentence that should change.
- Original source URL and publisher.
- Publication date and event/observation date if different.
- Exact Chinese name and title as printed.
- A short explanation of what the source supports.
- A short explanation of what the source does not support.
- Archived copy or content hash when a mutable page can be preserved lawfully.

## Evidence rules

- Prefer formal Party/state decisions and official Chinese military or institutional sources.
- Do not treat a search-result snippet as evidence.
- Do not infer current incumbency from an undated roster or old biography.
- Do not infer patronage from shared geography, school, or unit service without a dated working relationship.
- Do not infer operational effectiveness from presence at an exercise or from unit performance without attribution.
- Flag conflicting sources instead of silently choosing the preferred one.
- State uncertainty directly; unknown values do not count as favorable evidence.

## Data changes

Edit the canonical `app/data/observatory.json` only when the claim and source records can be kept consistent. Public JSON and CSV exports are generated outputs. Changes to estimative judgments belong in `app/data/net-assessment.ts` and should identify the affected target event, score component, next gate, and disconfirmer.

Before submitting a pull request, run:

```bash
npm ci
npm test
npm run lint
```

The tests enforce canonical/public data equality, adverse-ledger separation, stable population accounting, known factual corrections, and key model constraints.

## Security and privacy

Use only lawfully available public information. Do not submit personal contact information, private credentials, hacked material, or non-public personal data. The project concerns public professional roles and institutional analysis.
