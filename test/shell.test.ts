import { afterThis, describe, expect, it } from "./lib/test.js"
import { buildShell, floatingButton } from "../src/shell.js"
import { places } from "../src/places.js"

/** Builds the frame in a body of its own; gives it and the page. */
function frameAt(path: string) {
  const body = document.createElement("div")
  document.body.append(body)
  afterThis(() => body.remove())
  const page = buildShell(body, path)
  return { body, page }
}

describe("the frame", () => {
  it("the index names every place with words, and marks the current one", () => {
    const { body } = frameAt("calendar/week/2026-10-12")
    const links = [...body.querySelectorAll(".places a")]
    expect(links.map(link => link.querySelector("span")?.textContent).join()).toBe(places.map(place => place.name).join())
    expect(body.querySelector('.places [aria-current="page"] span')?.textContent).toBe("Calendar")
  })

  it("the name sits on top of the index and leads to today", () => {
    const { body } = frameAt("notes")
    const brand = body.querySelector(".sidebar .brand")
    expect(brand?.getAttribute("href")).toBe("#/")
    expect(brand?.getAttribute("aria-label")).toBe("Valhalla, today")
  })

  it("there is no header: the search is a place of the index, with its shortcut", () => {
    const { body } = frameAt("")
    expect(body.querySelector("header")).toBe(null)
    const search = body.querySelector('.places a[href="#/search"]')
    expect(search?.getAttribute("aria-keyshortcuts")).toBe("Control+K Meta+K")
    expect(search?.querySelector("kbd")?.textContent ?? "").toMatch(/K$/)
  })

  it("the bar for phones names each icon for screen readers", () => {
    const { body } = frameAt("")
    for (const link of body.querySelectorAll(".bottom-bar a")) {
      expect(link.getAttribute("aria-label") ?? "").toMatch(/\S/)
    }
    expect(body.querySelector('.bottom-bar [aria-current="page"]')?.getAttribute("aria-label")).toBe("Today")
  })

  it("the page sits in the frame, ready for a view", () => {
    const { body, page } = frameAt("")
    expect(page.parentElement === body.querySelector(".app")).toBe(true)
    expect(page.tagName).toBe("MAIN")
  })

  it("the floating button has a name and does what it creates", () => {
    const created: string[] = []
    const button = floatingButton("Add a task", () => created.push("task"))
    expect(button.getAttribute("aria-label")).toBe("Add a task")
    button.click()
    expect(created.join()).toBe("task")
  })
})
