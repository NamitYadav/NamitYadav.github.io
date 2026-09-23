---
title: "A team micro-frontend with Webpack Module Federation"
company: Forto
period: "2020 – 2024"
summary: "Decoupled the Process & Workflows team's release cycle from five other teams inside Forto's Transport Management System, and built the component that generates legally operative shipping documents."
metrics:
  - { label: "teams in the TMS", value: "6" }
  - { label: "release cycle", value: "independent" }
  - { label: "documents", value: "HBL & freight" }
tags: [Micro-frontends, Module Federation, Webpack, Logistics]
order: 4
---

## Context

Forto's Transport Management System was built by six cross-functional teams. I owned frontend delivery for the Process & Workflows team.

## Problem

A single frontend build meant one team's release could be held up by another's unfinished work, and every deploy carried every team's risk.

## Approach

- Built the team's micro-frontend with Webpack Module Federation, exposing our workflows as remotes consumed by the host shell, so we deployed on our own schedule.
- Built the document-generation component for House Bills of Lading and related freight paperwork via pdfgeneratorapi. These documents are legally operative: a data error delays a shipment.
- Introduced end-to-end testing with Cypress and contributed reusable components to the design system used by all six teams.

## Outcome

The team released independently of the other five, and shipping paperwork was produced from validated data inside the TMS.
