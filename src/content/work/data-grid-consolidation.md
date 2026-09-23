---
title: "Consolidating 95+ data grids onto one implementation"
company: Zinier
period: "2025 – 2026"
summary: "An architecture decision record moving 95+ data grids across two implementations onto a single @tanstack/react-table component in the shared library, migrated in three risk-ordered phases behind a feature flag."
metrics:
  - { label: "grids consolidated", value: "95+" }
  - { label: "phases shipped", value: "2 of 3" }
  - { label: "tests on the new grid", value: "1,300+" }
tags: [Architecture, ADR, TanStack Table, Migration]
order: 3
---

## Context

Across six apps, tables had accumulated on two implementations: a 4,600-line class-based grid in the shared library, and a newer hooks-based table on `@tanstack/react-table` inside one app, tightly coupled to that app's data model. Around 95 grids sat on one or the other, plus copy-pasted variants.

## Problem

Every grid fix, accessibility improvement or design change had to be made dozens of times. The cost of a table feature scaled with the number of grids, not the difficulty of the feature. The obvious shortcut, reusing the newer table as-is, did not work either: it imported the model context of the app it lived in.

## Approach

- Wrote the ADR: one generic grid in the shared library on `@tanstack/react-table`, decoupled from any app's model, with an adapter so the grids defined in JSON configuration and the grids written in code render through the same component. Decision, rejected alternatives and consequences written down for review before code moved.
- Rejected patching the legacy grid further, since it was the source of the problem, and rejected lifting the app-specific table unchanged, since its coupling would have spread to every app.
- Split the migration into three phases by capability and risk: read-only grids first, selection and bulk actions second, inline editing with export and import last. Each phase ends at a QA checkpoint, and the plan set success criteria up front: zero functional regressions, over 80% test coverage on the new component, no more than a 10% bundle increase.
- Every grid moves behind the feature flag from the shared library, so rollback is per grid and per organisation: remove the flag or the type from that grid's configuration, no release needed.
- Two engineers, planned as three sprints.

## Outcome

Phases one and two shipped: around 45 grids on the new component, including all read-only and selection grids. Phase three is in progress, with inline editing, export and import, column filtering and an on-demand row count for high-volume grids already live, and the legacy cleanup as the final gate. The new grid carries over 1,300 unit tests across about 60 suites. No rollback trigger has fired.

## What I'd do differently

The plan said three sprints. Editing took longer than the first two phases combined, because every editable cell type needed its own commit, validation and keyboard contract, and the plan treated "editing" as one story. Next time I would break the riskiest phase into its own ADR-level estimate before committing to a date.
