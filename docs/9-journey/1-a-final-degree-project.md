# 1. A final degree project

> Draft written from the author's words, waiting for the author to correct it.

Valhalla started as my final degree project, in 2021: a productivity app for tasks, notes and a
calendar that worked offline, so your information stayed on your own computer.

It was a desktop app built with Electron. The interface used my own libraries of the time: an
early GTD for the components and an early BubbleUI for the styles. It had a dark, glassy look, a
narrow bar of icons on the left, and a small terminal where you could type commands such as
`note -n "Title" -c "Text"` instead of clicking through forms.

## Why I left it

I didn't leave Valhalla because it failed. I left it hoping to learn more and come back knowing how
to do it better.

That is why its backend was later reimagined in Go, as `valhalla-core`: users, projects and
devices, with tests against a real database.

## What changed since

The pieces that were missing now exist:

- **BubbleUI 4**: a design system with the paper style, the glass of the original Valhalla, dark
  modes and accessibility that is checked by tests.
- **GTD** without Node.js: the web interface is built with the platform itself.
- **go-ui**: native interfaces in Go, for the desktop and for phones.

So the goal of the app can finally come true: faster, more beautiful and easier to use. The next
chapter is about how.
