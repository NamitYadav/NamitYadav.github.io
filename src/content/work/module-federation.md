---
title: "A team micro-frontend with Webpack Module Federation"
company: Forto
period: "2020 – 2024"
summary: "Decoupled the Process & Workflows team's release cycle from five other teams inside Forto's Transport Management System, moving the team from synced releases to daily deploys."
metrics:
  - { label: "deploy cadence", value: "daily" }
  - { label: "release frequency", value: "2–3×" }
  - { label: "to first independent deploy", value: "4 months" }
tags: [Micro-frontends, Module Federation, Webpack, Logistics]
order: 4
---

## Context

Forto's Transport Management System was built by six cross-functional teams. I owned frontend delivery for the Process & Workflows team.

## Problem

A single frontend build meant one team's release could be held up by another's unfinished work, and every deploy carried every team's risk. Releases waited for a sync across teams.

## Approach

Built the team's micro-frontend with Webpack Module Federation, exposing our workflows as remotes consumed by the host shell, so we deployed on our own schedule. Two frontend engineers, about four months from decision to the first independent production deploy.

## Outcome

The team released independently of the other five and started deploying every day instead of waiting for a cross-team sync, two to three times the previous frequency.

## What I'd do differently

- Pin shared dependencies from day one. Version drift between the host and the remotes, React and the design system above all, was the biggest source of runtime surprises.
- Invest in a contract test between host and remote early. Code paths that crossed the federation boundary were the hardest to test, and we found that out late.
