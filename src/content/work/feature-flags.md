---
title: "Feature flags and experimentation in the shared component library"
company: Zinier
period: "2024 – 2025"
summary: "Flag and experiment infrastructure built once in the shared library; every frontend pod ships on it, rolling out a major component rewrite per customer organisation with automatic fallback."
metrics:
  - { label: "pods shipping on it", value: "4 of 4" }
  - { label: "rollout unit", value: "per customer org" }
  - { label: "fallback", value: "automatic" }
tags: [Feature flags, Progressive delivery, Firebase, GA4]
order: 2
---

## Context

Three of Zinier's apps needed to ship a rewrite of the data grid, a component on almost every screen, to customers with very different risk tolerances. There was no shared way to turn a change on for one organisation and off for another. The apps already used Firebase for analytics, so Remote Config was available without adding a vendor.

## Problem

Without flags, a rewrite ships to everyone at once or not at all. A regression for one large customer becomes an incident for all of them, and a rollback means a redeploy. Unfinished work either sits on a long-lived branch or leaks into production.

## Approach

- Built the flag layer in the shared component library: one Firebase initialisation, boolean, string and JSON flag hooks for React, plain getters for non-React code. Every app got it by upgrading the library; three consume it today.
- Resolution order is fixed: a local override for developers, then Remote Config, then the fallback written in code. A fetch failure or a missing flag lands on the fallback, which is always the legacy path, so the old behaviour is the default and needs no extra guard.
- Targeting is per organisation, around 20 of them today. After login the app sends organisation, role and user as Remote Config signals, so a flag can be on for one customer, a percentage, or a role, from the Firebase console.
- Fetch interval is an hour in production and ten seconds on QA and staging hosts, so testers see a change immediately and production stays cheap.
- GA4 exposure and conversion events, keyed by flag and variant, so an experiment can be measured without a separate analytics integration.

## Outcome

The grid rewrite became the pilot flag. Grids were migrated on the main branch and shipped dark, hidden behind the flag, so nothing unfinished reached users during a migration that ran for months. QA turned it on per grid and per organisation, and turning it off for a customer became a config change instead of a release. All four frontend pods ship on the layer today, and it gates other work across the three apps that consume it.

## What I'd do differently

Add the flag layer before the first big migration, not during it. The grid work started with a URL parameter and a local-storage switch, and moving it onto Remote Config mid-flight meant supporting three mechanisms for a while.
