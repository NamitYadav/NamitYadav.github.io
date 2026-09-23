---
title: "Six apps from React 17 to 18 and Node 14 to 22, in one move"
company: Zinier
period: "2024 – 2025"
summary: "One coordinated upgrade of framework, runtime, state and routing across six production apps, cutting Snyk-reported vulnerabilities by 71%."
metrics:
  - { label: "apps migrated", value: "6" }
  - { label: "Snyk vulnerabilities", value: "734 → 215" }
  - { label: "critical issues", value: "−81%" }
tags: [React, Node, Migration, Security]
order: 1
---

## Context

Zinier's field-service platform is six React single-page applications sharing one component library. When I joined as frontend tech lead in 2024 they were all on React 17 and Node 14.

## Problem

Two React majors and four Node LTS releases behind, with 734 Snyk-reported vulnerabilities, 64 of them critical, that could not be cleared without moving the dependency tree. Migrating one app at a time would have left the shared library supporting two React majors for the whole period, doubling every library change.

## Approach

- Upgraded the whole chain in one coordinated move, React 18.3.1, Node 22, Redux 5, React Router 6.26, so the shared library only ever targeted one set of peer versions.
- Held each app to the existing lint, unit-test and visual-regression gates before it shipped.

## Outcome

All six apps on React 18 and Node 22. Snyk vulnerabilities went from 734 to 215 and critical issues from 64 to 12, an 81% reduction.
