# 2. Valhalla as the design canvas draws it

> Status: building · Author's approval: proposal ☑ plan ☑

## Why

The Bubble 4 canvas now sets the design, and Valhalla is its pilot. Today only the calendar
follows it. Today, Notes, Settings and the index still look like an earlier draft: a form card on
top of Today, a plain line where Notes is empty, settings as rows of pills. The author wants to
see Valhalla whole in the canvas's design, then judge it and think about Bubble's philosophy from
there.

## What

| Id | Requirement | Check |
|---|---|---|
| R1 | The index is a pane with the brand at its top, the places with their keys, and Search ⌘K at its foot. The chosen place is brighter and bold | `shell.test.ts`; screenshots |
| R2 | Today shows the date above a large title, with **New task** as the one main action. The tasks sit in one pane (check box, title, time, done struck through), with a side pane for what comes next in the calendar today. The add form goes into the dialog the button opens | `today` view tests; screenshots |
| R3 | Notes shows a wall of cards with filter chips (All, and the tags the notes use). An empty wall is a designed empty state with an icon, a sentence and **New note**. An open note is edited in a pane beside the wall on wide screens, and on its own page on a phone | `notes-view.test.ts`; screenshots |
| R4 | Settings follows the canvas: the finish as two cards with a small preview (Paper, Glass), the mode as a segmented control, the accent as round swatches, the wallpapers as tiles (Glass only). Style (Paper, Material) stays | `settings-view.test.ts`; screenshots |
| R5 | Search and the terminal follow the canvas: one search field whose edge lights up, results as rows with where they come from, and the terminal in monospace with its command list | `search-view.test.ts`, `terminal.test.ts`; screenshots |
| R6 | Every screen works in Paper and Glass, light and dark, at desktop and phone widths. On a phone the index becomes the bottom bar | Screenshots of each screen in the four finishes and at 390 px wide |
| R7 | What a screen needs that other apps would need too lives in Bubble's CSS, with its pairs of background and text. Only what is Valhalla's own stays in `styles/valhalla.css` | Bubble's CSS tests; a review of `valhalla.css` |
| R8 | Everything stays usable with the keyboard and a screen reader, as today | The existing view tests; Tab through each screen |

## Out of scope

- New screens from the canvas that Valhalla doesn't have yet: the board, the week by hours,
  activity, sign in. Each needs its own data first.
- Material's look, beyond what Bubble already gives it.
- Bubble's philosophy, README and docs: the author decides them after seeing this.

## Design

- **Bubble first:** the parts the screens need go into `css/bubble.css` as reusable classes. Each
  sets its text colour, so the test of R4 in proposal 1 keeps passing:
  - `.pane`, a surface for a group (the canvas's panes, glass on Glass)
  - `.chips` and `.chip[aria-pressed]` for filters
  - `.empty` for empty states
  - `.finish-card` for a choice with a preview
  - a round `.swatch` choice
  - `.task-row` for a list row with a check box, title and time

  Valhalla then copies `bubble.css` as it does now.
- **Valhalla's views** keep their data and behaviour. Each view changes the elements and classes
  it draws, so the tests that read behaviour stay, and those that read structure change with it.
- **One screen at a time**, each a commit with its screenshots, so the author can stop and judge
  after any of them.
- Not taken: rewriting the views in a framework, or copying the canvas's HTML. The canvas is a
  picture of the design; the views stay plain TypeScript with Bubble's classes.

## Tasks

- [x] T1 — Bubble: `.pane`, `.chips`, `.empty`, `.task-row`, `.finish-card`, round swatches, with tests · `bubble/css/bubble.css`, `bubble/css_test.go` · R7
- [x] T2 — The index as a pane, Search at its foot · `src/shell.ts`, `styles/` · R1 R6 · `shell.test.ts`
- [x] T3 — Today: title, main action, tasks pane, the next pane; the form into the dialog · `src/views/today.ts`, `task-dialog.ts` · R2 · today tests
- [ ] T4 — Notes: chips, empty state, the editor beside the wall · `src/views/notes.ts` · R3 · `notes-view.test.ts`
- [ ] T5 — Settings as the canvas · `src/views/settings.ts` · R4 · `settings-view.test.ts`
- [ ] T6 — Search and terminal · `src/views/search.ts` · R5 · `search-view.test.ts`
- [ ] T7 — Screenshots of every screen in the four finishes and on a phone, and a pass with the keyboard · R6 R8

## Result

Not built yet.
