# 2. Coming back

Valhalla is coming back as the pilot of BubbleUI 4: the first app built with the new design
system. Whatever Valhalla needs and works well moves into Bubble, with its docs and tests.
Whatever only Valhalla needs stays here. That way Bubble grows by being used, not by guessing.

## The first version

A web app, offline first, with no Node.js: GTD and BubbleUI 4 in the browser, and your data stored
in the browser too.

| Piece | What it asks of Bubble |
|---|---|
| **Today**: tasks with a time and a check box | Lists, check boxes, pills, the primary button with its block edge |
| **New task**, **edit task** | Fields, labels, dates, validation, error messages |
| **Calendar**, a week and a month | A grid, the "today" state, density |
| **Notes** | Reading type, the page with a notebook margin |
| **Search** with `Ctrl K`, and the **terminal** as one of its modes | A dialog, the keyboard, focus, shortcuts |
| **Settings** | Paper or Material, light or dark, glass or not, the accent |
| **Desktop and phone** | The narrow bar of icons, and a glass bar at the bottom on phones |

## Later

- Connecting to `valhalla-core`, the Go backend, to sync between devices.
- A native client with go-ui, sharing the same Bubble tokens.

## Where the old code is

The 2022 Electron app stays in the git history, and its last release keeps its tag. Nothing is
deleted.
