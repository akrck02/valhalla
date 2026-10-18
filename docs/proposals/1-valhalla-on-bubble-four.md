# 1. Valhalla on Bubble 4, with what Bubble 3 did well

> Status: done · Author's approval: proposal ☑ plan ☑

## Why

The design canvas of Bubble 4 settled a sober, practical look for apps used every day, and
looking back at Bubble 3 gave it four lessons: every background carries its own text colour,
tone separates surfaces better than lines, focus should light a control's own edge instead of a
ring floating around it, and a control should give a little when pressed. Valhalla is the pilot,
so it should show all of it, in Paper and Glass, light and dark.

## What

| Id | Requirement | Check |
|---|---|---|
| R1 | The keyboard focus sits on the control's own edge, with no gap, and keeps 3:1 contrast against the page and the fill it touches | Bubble tests `TestTheFocusRingTouchesTheControl`, `TestTheFocusRingNeverFloatsAwayFromTheControl`, `TestTheFocusRingStandsOutFromTheSurfacesItTouches` |
| R2 | A field being written in lights its own edge in the accent, not a second ring outside it | Look: the search box and a task field, in Paper and Glass |
| R3 | Buttons and calendar tasks shrink a little while pressed; nothing moves on hover | Look: press the main button and a task |
| R4 | Every part that paints a background also sets its text colour | Bubble test `every rule with a background sets a colour` |
| R5 | The calendar (week and month) is one pane: days ruled by fine lines, the weekend a step of tone, today the only accent, tasks quiet chips with no coloured bar | Calendar view tests pass; look in the four finishes |
| R6 | On Glass, the calendar is one frosted pane, with no opaque patches | Look: Glass light and dark, with and without a wallpaper |
| R7 | Valhalla's copy of Bubble and its accent tokens match Bubble's `feature/v4` | `diff ../bubble/css/bubble.css styles/bubble.css` is empty; `bin/accents.sh` leaves no change |

## Out of scope

- New screens from the canvas (board, week view with hours, activity, sign in): each is a proposal
  of its own.
- A ladder of more surface levels in the Go tokens: it changes every theme and its contrast tests,
  so it goes in its own proposal once the canvas settles it.
- go-ui: it follows when the CSS is approved.

## Design

- **Bubble (`feature/v4`)**: the shape's `FocusOffset` becomes 0 in every density, so
  `--focus-offset` is `0px` and every focus outline lies on the edge; fields and the search box
  colour their own border with `--focus-ring` and pull the outline in by one line width, so the
  edge and the ring are one. `.button:active` scales to 0.97 (the main button also settles on its
  edge). A CSS test reads `bubble.css` and checks R4.
- **Valhalla**: copies `bubble.css`, regenerates the accents with `bin/accents.sh`, and rewrites
  the calendar part of `styles/valhalla.css`: `.week` and `.month` get the pane, days get lines
  between them, a `--weekend` tone (sunken on paper, a raised light on glass), today's number a
  filled accent circle, and `.calendar-task` loses its accent bar for a sunken chip.
- Not taken: a translucent halo for focus, as the canvas first tried. It looked softer, but a halo
  can't reach the 3:1 the rules ask of a focus indicator; a solid ring on the edge can.

## Tasks

- [x] T1 — Bubble: focus on the edge, fields light their border, press gives · `scale.go`, `theme.go`, `css/bubble.css`, `css/tokens.css` · R1 R2 R3 · test: `TestTheFocusRingTouchesTheControl`
- [x] T2 — Bubble: test that every rule with a background sets a colour, and fix any it finds · `css_test.go`, `css/bubble.css` · R4 · test: `TestEveryRuleWithABackgroundSetsAColour`
- [x] T3 — Valhalla: copy Bubble and regenerate the accents · `styles/bubble.css`, `styles/accents/*` · R7
- [x] T4 — Valhalla: the calendar as one pane, in Paper and Glass · `styles/valhalla.css` · R5 R6 · tests: calendar view tests; screenshots in the four finishes

## Result

Built in Bubble (`feature/v4`) and here. Bubble's new tests found eight parts that painted a
background without a text colour (card, list item, choice, search box, bottom bar, chosen place,
chosen result and its pill); they now pair them. Valhalla's 84 tests pass. Screenshots of the week
and the month in Paper and Glass, light and dark, and Glass over a wallpaper were looked at.

The review found that a ring touching the main button could not be told from its accent fill
(contrast 1.0 to 2.6), so on controls filled with the accent the ring is drawn inside, in the
accent's text colour; a checked box or radio, too small for that, keeps a 2 px gap. Less motion now
also removes the press. Valhalla's own rules that paint a background set their text colour too,
checked by hand with the same rule as Bubble's test; a swatch with no text is the only exception.
No program checks yet that calendar tasks carry no coloured bar (R5): only the screenshots do.

Still for a person to review: the weekend step is faint on Glass light; the press and the focus on
a real keyboard and touch screen; Material, which only changes through Bubble here.
