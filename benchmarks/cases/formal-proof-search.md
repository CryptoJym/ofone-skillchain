# Case: Formal Proof Search

## Case ID

`case-formal-proof-search-001`

## Domain Mix

- formal

## Prompt

A formal reasoning task has an incomplete proof path, a candidate lemma, and possible countermodel pressure. Produce a map that separates axioms, claims, proof obligations, countermodel tests, unknowns, and update triggers.

## Expected OfOne Pressure Points

- formal adapter fit
- proof claim versus evidence separation
- countermodel or contradiction handling
- kill tests for failed proof paths
- update behavior when a lemma is disproven

## Baselines

- direct proof-search answer
- light structured proof plan
- full OfOne artifact and rendering
