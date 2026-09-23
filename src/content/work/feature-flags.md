---
title: "Feature flags and experimentation in the shared component library"
company: Zinier
period: "2024 – 2025"
summary: "Flag and experiment infrastructure built once in the shared library and shipped in three apps, used to roll out a major component rewrite per organisation with automatic fallback."
metrics:
  - { label: "apps using it", value: "3" }
  - { label: "rollout unit", value: "per organisation" }
  - { label: "fallback", value: "automatic" }
tags: [Feature flags, Progressive delivery, Firebase, GA4]
order: 2
---

## Context

Three of Zinier's apps needed to ship a rewrite of a central component to customers with very different risk tolerances. There was no shared way to turn a change on for one organisation and off for another.

## Problem

Without flags, a rewrite ships to everyone at once or not at all. A regression for one large customer becomes an incident for all of them, and a rollback means a redeploy.

## Approach

- Built the flag and experimentation layer in the shared component library, backed by Firebase Remote Config for the flag values and GA4 for exposure and outcome events, so every app got it by upgrading the library.
- Rolled the component rewrite out per organisation behind a flag, with automatic fallback to the legacy implementation when the new path failed.

## Outcome

The rewrite reached production one organisation at a time, and turning it off for a customer became a config change instead of a release.
