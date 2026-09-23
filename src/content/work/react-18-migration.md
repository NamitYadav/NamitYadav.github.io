---
title: "Six apps from React 17 to 18 and Node 14 to 22, in one move"
company: Zinier
period: "2024 – 2025"
summary: "One coordinated upgrade of framework, runtime, state and routing across six production apps, taking Snyk-reported vulnerabilities from 734 to 215."
metrics:
  - { label: "apps migrated", value: "6" }
  - { label: "Snyk vulnerabilities", value: "734 → 215" }
  - { label: "critical issues", value: "−81%" }
tags: [React, Node, Migration, Security]
order: 1
---

## Context

Zinier's field-service platform is six React single-page applications sharing one component library, built by four pods and used by around 20 customer organisations. When I joined as frontend tech lead in 2024 they were all on React 17 and Node 14.

## Problem

Two React majors and four Node LTS releases behind, with 734 Snyk-reported vulnerabilities, 64 of them critical, that could not be cleared without moving the dependency tree. Migrating one app at a time would have left the shared library supporting two React majors for the whole period, doubling every library change.

## Approach

- Upgraded the whole chain in one coordinated move, React 18.3.1, Node 22, Redux 5, React Router 6.26, so the shared library only ever targeted one set of peer versions.
- Upgraded the shared library and the first app myself so the pattern was proven before anyone else touched it, then brought in two junior engineers for the long tail of per-app fixes and reviewed every one. About six months end to end.
- Shipped to a temporary deployment first so QA could run the full regression against real data without touching the shared development environment. Moved it into the development environment once it was stable, then through the normal release train.
- Held each app to the existing lint, unit-test and visual-regression gates before it shipped.

## What broke

React 18's automatic batching changed when state updates flushed, and the data grid depended on the old timing: reads after a set-state call saw stale values, and rows rendered a step behind their data. The fix was `flushSync` at the points where the grid needs a synchronous commit, in many more places than expected. Nothing else came close.

## Outcome

All six apps on React 18 and Node 22. Snyk vulnerabilities went from 734 to 215 and critical issues from 64 to 12, an 81% reduction.

## What I'd do differently

- Set checkpoints up front, per app and per package, so progress was visible from week one instead of being one long branch.
- Test each package upgrade in isolation before combining them. One coordinated release was the right call for the shared library, but debugging the grid would have been faster if React, Redux and the router had each been proven on their own first.
