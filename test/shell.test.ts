import { afterThis, describe, expect, it } from "./lib/test.js"
import { buildShell, floatingButton, showInHeader } from "../src/shell.js"
import { places } from "../src/places.js"

/** Builds the frame in a body of its own; gives it and how often the search was asked for. */
function frameAt(path: string) {
  const body = document.createElement("div")
  document.body.append(body)
  afterThis(() => body.remove())
  const searches: string[] = []
  const page = buildShell(body, path, () => searches.push("search"))
  return { body, page, searches }
}

describe("the frame", () => {
  it("the index names every place with words, and marks the current one", () => {
    const { body } = frameAt("calendar/week/2026-10-12")
    const links = [...body.querySelectorAll(".sidebar a")]
    expect(links.map(link => link.textContent?.trim()).join()).toBe(places.map(place => place.name).join())
    expect(body.querySelector(".sidebar [aria-current=\"page\"]")?.textContent?.trim()).toBe("Calendar")
  })

  it("the bar for phones names each icon for screen readers", () => {
    const { body } = frameAt("")
    for (const link of body.querySelectorAll(".bottom-bar a")) {
      expect(link.getAttribute("aria-label") ?? "").toMatch(/\S/)
    }
    expect(body.querySelector('.bottom-bar [aria-current="page"]')?.getAttribute("aria-label")).toBe("Today")
  })

  it("the search box of the header is a named button that opens the search", () => {
    const { body, searches } = frameAt("")
    const trigger = body.querySelector(".search-trigger") as HTMLButtonElement
    expect(trigger.tagName).toBe("BUTTON")
    expect(trigger.getAttribute("aria-label")).toBe("Search tasks and notes")
    trigger.click()
    expect(searches.join()).toBe("search")
  })

  it("the page sits in the frame, ready for a view", () => {
    const { body, page } = frameAt("")
    expect(page.parentElement === body.querySelector(".app")).toBe(true)
    expect(page.tagName).toBe("MAIN")
  })

  it("the header shows what the page adds to it, and no clock", () => {
    const { body } = frameAt("")
    expect(body.querySelector(".clock")).toBe(null)
    const progress = document.createElement("span")
    progress.textContent = "50%"
    showInHeader(progress)
    expect(body.querySelector(".app-header .context")?.textContent).toBe("50%")
  })

  it("the floating button has a name and does what it creates", () => {
    const created: string[] = []
    const button = floatingButton("Add a task", () => created.push("task"))
    expect(button.getAttribute("aria-label")).toBe("Add a task")
    button.click()
    expect(created.join()).toBe("task")
  })
})
