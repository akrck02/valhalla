import { describe, expect, it } from "./lib/test.js"
import { normalized, resultsPerKind, searchEverything } from "../src/search/search.js"
import { createTask } from "../src/tasks/task.js"
import { createNote } from "../src/notes/note.js"

const places = [{ name: "Today", path: "" }, { name: "Notes", path: "notes" }]

describe("search", () => {
  it("an empty search gives the places", () => {
    const results = searchEverything("  ", { places, tasks: [createTask("Plan", "2026-10-17")], notes: [] })
    expect(results.map(result => result.label).join()).toBe("Today,Notes")
  })

  it("capitals and accents don't matter", () => {
    expect(normalized("Café ÀNGEL")).toBe("cafe angel")
    const results = searchEverything("cafe", { places, tasks: [createTask("Buy Café", "2026-10-17")], notes: [] })
    expect(results[0].label).toBe("Buy Café")
  })

  it("every word must be there, in any order", () => {
    const tasks = [createTask("Buy bread", "2026-10-17"), createTask("Buy milk", "2026-10-17")]
    expect(searchEverything("bread buy", { places, tasks, notes: [] }).map(result => result.label).join()).toBe("Buy bread")
  })

  it("what starts with the search comes before what only holds it", () => {
    const tasks = [createTask("Call about the plan", "2026-10-17"), createTask("Plan the week", "2026-10-17")]
    expect(searchEverything("plan", { places, tasks, notes: [] }).map(result => result.label).join()).toBe("Plan the week,Call about the plan")
  })

  it("notes are found by their text too, and each kind leads to its place", () => {
    const note = createNote("Garden", "Plant the tulips")
    const task = createTask("Tulips", "2026-10-21", "12:00")
    const results = searchEverything("tulips", { places, tasks: [task], notes: [note] })
    expect(results.map(result => `${result.kind} ${result.href}`).join()).toBe(`task #/calendar/week/2026-10-21,note #/notes/${note.id}`)
    expect(results[0].detail).toBe("2026-10-21 12:00")
  })

  it("no kind shows more than a few results", () => {
    const tasks = Array.from({ length: 9 }, (_, index) => createTask(`Task ${index}`, "2026-10-17"))
    expect(searchEverything("task", { places, tasks, notes: [] }).length).toBe(resultsPerKind)
  })
})
