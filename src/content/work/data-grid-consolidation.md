---
title: "Consolidating 95+ data grids onto one implementation"
company: Zinier
period: "2025"
summary: "An architecture decision record moving 95+ hand-rolled data grids onto a single @tanstack/react-table implementation, sequenced in three risk-ordered phases with rollback triggers."
metrics:
  - { label: "grids consolidated", value: "95+" }
  - { label: "target implementations", value: "1" }
  - { label: "phases", value: "3" }
tags: [Architecture, ADR, TanStack Table, Migration]
order: 3
---

## Context

Across six apps, tables had been built one at a time for years. The count passed 95, spread over several grid libraries and copy-pasted variants.

## Problem

Every grid fix, accessibility improvement or design change had to be made dozens of times. The cost of a table feature scaled with the number of grids, not the difficulty of the feature.

## Approach

- Wrote the ADR: one `@tanstack/react-table` implementation in the shared library, with the decision, alternatives and consequences written down for review.
- Split the migration into three phases sequenced by risk, low-traffic internal grids first, customer-facing grids last.
- Put a QA checkpoint at the end of each phase and defined the rollback triggers in advance, so the decision to stop was made before anyone was under pressure.

## Outcome

The record fixed the shape of the migration before any code moved: one target implementation, three risk-ordered phases, a QA checkpoint after each, and rollback triggers agreed up front.
