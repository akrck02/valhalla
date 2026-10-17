import { afterThis, describe, expect, it, replace } from "./lib/test.js"
import { createTask } from "../src/tasks/task.js"
import { saveTasks } from "../src/tasks/store.js"
import { searchPanel } from "../src/views/search.js"
import { memoryStorage } from "./storage.js"

/** Draws the search panel on a storage of its own; gives the panel, its box and how often it left. */
function panelWith(...tasks: ReturnType<typeof createTask>[]) {
  const storage = memoryStorage()
  saveTasks(storage, tasks)
  replace(window, "localStorage", storage)
  afterThis(() => history.replaceState(null, "", location.pathname)) // the test page has no routes to follow
  const left: string[] = []
  const panel = searchPanel(() => left.push("left"))
  document.body.append(panel)
  afterThis(() => panel.remove())
  const input = panel.querySelector("input") as HTMLInputElement
  return { panel, input, left, storage }
}

function type(input: HTMLInputElement, text: string): void {
  input.value = text
  input.dispatchEvent(new Event("input"))
}

function press(input: HTMLInputElement, key: string): void {
  input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }))
}

describe("the search panel", () => {
  it("is a combobox whose box has a name and points at its results", () => {
    const { panel, input } = panelWith()
    expect(input.getAttribute("role")).toBe("combobox")
    expect(panel.querySelector(`label[for="${input.id}"]`)?.textContent ?? "").toMatch(/Search/)
    expect(panel.querySelector(`#${input.getAttribute("aria-controls")}`)?.getAttribute("role")).toBe("listbox")
  })

  it("the arrows choose a result while the focus stays in the box, and Enter opens it", () => {
    const { input, left } = panelWith(createTask("Plan one", "2026-10-17"), createTask("Plan two", "2026-10-18"))
    type(input, "plan")
    expect(input.getAttribute("aria-activedescendant")).toBe("search-result-0")
    press(input, "ArrowDown")
    expect(input.getAttribute("aria-activedescendant")).toBe("search-result-1")
    press(input, "ArrowDown")
    expect(input.getAttribute("aria-activedescendant")).toBe("search-result-0")
    press(input, "ArrowUp")
    press(input, "Enter")
    expect(location.hash).toBe("#/calendar/week/2026-10-18")
    expect(left.join()).toBe("left")
  })

  it("says when nothing is found, and leaves no option chosen", () => {
    const { panel, input } = panelWith()
    type(input, "zzz")
    expect(panel.querySelector(".search-empty")?.textContent).toBe("Nothing found.")
    expect(input.getAttribute("aria-expanded")).toBe("false")
    expect(input.hasAttribute("aria-activedescendant")).toBe(false)
  })

  it("> turns the box into a terminal that answers each line, mistakes included", () => {
    const { panel, input, storage } = panelWith()
    type(input, "> task Buy bread")
    press(input, "Enter")
    type(input, "> fly")
    press(input, "Enter")
    const lines = [...panel.querySelectorAll(".terminal-line")].map(line => line.textContent)
    expect(lines[0]).toBe("> task Buy bread")
    expect(lines[1] ?? "").toMatch(/^Added "Buy bread"/)
    expect(lines[3] ?? "").toMatch(/^terminal.unknown-command/)
    expect(storage.getItem("valhalla.tasks") ?? "").toContain("Buy bread")
    expect(input.value).toBe(">")
  })

  it("clear empties the terminal", () => {
    const { panel, input } = panelWith()
    type(input, "> help")
    press(input, "Enter")
    type(input, "> clear")
    press(input, "Enter")
    expect(panel.querySelectorAll(".terminal-line").length).toBe(0)
  })
})
