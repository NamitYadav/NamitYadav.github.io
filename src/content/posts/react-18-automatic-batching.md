---
title: "The React 18 change that broke our data grid"
date: 2026-10-28
description: "Upgrading six apps to React 18, the one thing that really broke was automatic batching: a class-based grid that read its own state right after setting it. What changed, how to find it, and when flushSync is the right fix."
tags: [React, Migration]
draft: true
---

We moved six production apps from React 17 to 18 in one coordinated upgrade, along with Node, Redux and React Router. I expected the router or the Redux upgrade to hurt. The thing that actually broke was a single behaviour change in React itself, and it broke the component that sits on almost every screen: the data grid.

## What changed

React has always batched state updates made inside its own event handlers: three `setState` calls in an `onClick` produce one render. Before React 18, that was the only place it batched. An update made anywhere else — in a promise callback, a `setTimeout`, a native event listener — rendered synchronously, on the spot, before the next line ran.

React 18, once you switch to `createRoot`, batches everywhere. An update in a promise callback now waits, along with every other update in the same tick, and renders once at the end.

That is a good change. It removes renders nobody wanted. But it quietly changes what is true on the line after a `setState`.

## How it broke the grid

Our legacy grid was a large class component, written years before hooks. Over time it had picked up code that relied, without ever saying so, on the old synchronous behaviour. The shape looked like this (an illustration, not our code):

```js
loadPage(page) {
  api.fetchRows(page).then((rows) => {
    this.setState({ rows });
    // React 17: the update already rendered, so this.state.rows is the new page.
    // React 18: the update is batched, so this.state.rows is still the old page.
    this.props.onRowsLoaded(this.state.rows);
  });
}
```

Under React 17, the `setState` inside `.then()` rendered immediately, so `this.state` held the new rows by the next line. Under React 18 it does not. Reads after a `setState` saw stale values, and rows rendered a step behind their data. No error, no warning: the grid just showed the previous page's rows for a moment, or passed them on to a parent that did the wrong thing with them.

## Finding every place

React gives you no warning for this, and a test that only checks the settled screen won't catch it either. What does find them:

- Search for reads of `this.state` (or of the DOM) on the lines after a `setState`, inside anything asynchronous: `.then`, `await`, `setTimeout`, and listeners added with `addEventListener`.
- Treat a component that measures the DOM after updating state, such as a grid sizing its rows and columns, as a suspect by default.
- Write the regression test as a sequence, not a snapshot: trigger the async update, then assert on what the next step saw, not only on what eventually rendered.

There were many more of these places in the grid than I expected. That was the single biggest surprise of a six-month upgrade.

## The fix: flushSync, deliberately

React 18 ships an escape hatch for exactly this: `flushSync` forces the updates inside it to render before it returns.

```js
import { flushSync } from 'react-dom';

api.fetchRows(page).then((rows) => {
  flushSync(() => this.setState({ rows }));
  this.props.onRowsLoaded(this.state.rows); // the new page, as before
});
```

We used `flushSync` at the points where the grid genuinely needs a synchronous commit. It restores the old behaviour in one place without giving up batching everywhere else.

It is still an escape hatch. Every `flushSync` is a forced render, and it can't be batched with anything around it. Where the code only needs the *value*, not the rendered DOM, the cleaner fix is not to read it back from state at all: pass `rows` along directly, or move the follow-up into `componentDidUpdate` (or an effect). Keep `flushSync` for code that has to see the DOM the update produces.

## If you are about to do this upgrade

- Expect breakage in your oldest class components first. Hooks code is less exposed: a state variable is a constant for the whole render, so it never could be read back fresh after setting it. DOM reads after an update can still break there.
- `createRoot` is the switch that turns automatic batching on. Upgrading the package alone doesn't, so you can upgrade first and flip the root as a separate, testable step.
- Budget time for the grid, or whichever component your product can't live without. In our upgrade it was the one part that cost real time.

The full story of the upgrade, including what I'd plan differently, is in the [case study](/work/react-18-migration/).
