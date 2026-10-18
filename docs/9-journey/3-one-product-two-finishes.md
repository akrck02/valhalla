# 3. One product, two finishes

> Draft written from the author's words, waiting for the author to correct it.

Once Today, the calendar, the notes, the search and the settings worked, I looked at Valhalla
and something felt off. It worked, but it did not look like one thing. This chapter is about how
it became one.

## Copying the past in pieces

I wanted the reimagined Valhalla to keep what I liked about the one from 2022, so we ran the old
app again and looked at it closely: dark wallpapers, crystal panels, a clock in the bar, notes
pinned at an angle, titles in capitals.

We brought back a bit of everything, and it went wrong. Half of it looked like 2022, half did
not, and nobody could tell where it was going. A collage of good ideas is still a collage.

What worked was choosing. From 2022 we keep two things: its **sobriety** and its **crystal
panels**. The leaning notes, the bokeh, the capitals and the clock stay in 2022.

## Paper and glass are finishes, not designs

The turn came when we stopped treating Paper and Glass as two designs. They are one product with
two finishes:

| | Paper | Glass |
|---|---|---|
| Ground | paper, or slate at night | frost, or night, with an optional wallpaper |
| Panels | solid, divided by a fine line | crystal, told apart by how bright they are |
| Everything else | the same | the same |

The frame, the type, the components and how a chosen item looks never change. From then on,
every difference between the two finishes was a bug, and that gave us a quick question for any
decision: *is it the same everywhere?*

## Taking away

Most of what made the app better was removing things:

- The **clock**: the system already shows the time.
- The **header** and its **search box**: Ctrl K, or ⌘K, opens the search from anywhere, so the
  header only held the name. The name moved to the top of the index.
- The **bar beside what is chosen**: being brighter with a heavier name was already enough.
- Cards that **leaned** and days that **jumped** under the pointer.

## The accent is worth more the less it is used

Valhalla's accent comes from its new logo: Ice, a pale blue. It appears in four places only: the
main action, the focus ring, today and links. When it also tinted what was chosen, the chosen
item looked disabled. Chosen things are brighter now, never coloured.

## Glass is not transparent paper

My first glass was paper with some opacity. It is a different language: panels are separated by
brightness, not by lines, and nothing is opaque. A solid near-black for pills and keys, and solid
dialogs, broke the illusion until we fixed them.

## Accessibility can be proven, even on glass

Bubble's tests measure every ink over a glass panel over the ground, over each light, over a
black and a white wallpaper, and over any page behind a dialog. Those tests forced us to change
values more than once, and that freedom is what let wallpapers and frosted dialogs in: they are
not a risk, because the worst cases are checked.

## How we worked

- **Using the app on my own computer.** The broken L between the header and the index, the muddy
  check boxes, the black patches and the mixed languages showed up while I used the real app, not
  in the automatic screenshots taken while building it.
- **Think before building.** The direction was drawn on a design canvas first, with its rules
  written down, and only then built.
- **What works here moves to Bubble.** Drawn check boxes and radios, the frame, glass, frosted
  dialogs: each went into Bubble with its tests, so every project that uses Bubble gets them
  already proven.

## What this says about Bubble 4

Four ideas that Bubble 4 could keep as its philosophy:

1. One product, several finishes.
2. Sobriety, with the accent kept scarce.
3. Accessibility that is proven by tests, not assumed.
4. A system that grows by being used.
