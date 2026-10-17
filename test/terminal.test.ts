import { describe, expect, it } from "./lib/test.js"
import { commandHelp, readCommand, runCommand, TerminalContext } from "../src/terminal/terminal.js"
import { loadTasks } from "../src/tasks/store.js"
import { loadNotes } from "../src/notes/store.js"
import { InvalidArgument, MissingArgument, TaskWithoutTitle, UnknownCommand, ValhallaError } from "../src/errors.js"
import { memoryStorage } from "./storage.js"

const today = "2026-10-17"

function codeOf(make: () => unknown): string {
  try {
    make()
  } catch (error) {
    return error instanceof ValhallaError ? error.code : "not a ValhallaError"
  }
  return "no error"
}

/** A context that remembers where it went and which mode it set, instead of changing the app. */
function fakeContext() {
  const visited: string[] = []
  const modes: string[] = []
  const context: TerminalContext = {
    storage: memoryStorage(),
    today,
    places: [{ name: "Today", path: "" }, { name: "Notes", path: "notes" }],
    go: href => visited.push(href),
    setMode: mode => modes.push(mode),
  }
  return { context, visited, modes }
}

describe("the terminal", () => {
  it("a task takes its day and time from the end of the line", () => {
    expect(JSON.stringify(readCommand("task Buy bread tomorrow 10:00", today)))
      .toBe(JSON.stringify({ name: "task", title: "Buy bread", day: "2026-10-18", time: "10:00" }))
    expect(JSON.stringify(readCommand("task Plan 2026-11-02", today)))
      .toBe(JSON.stringify({ name: "task", title: "Plan", day: "2026-11-02" }))
    expect(JSON.stringify(readCommand("task Today", today)))
      .toBe(JSON.stringify({ name: "task", title: "Today", day: today }))
  })

  it("each mistake has its own code", () => {
    expect(codeOf(() => readCommand("fly away", today))).toBe(UnknownCommand)
    expect(codeOf(() => readCommand("note", today))).toBe(MissingArgument)
    expect(codeOf(() => readCommand("mode purple", today))).toBe(InvalidArgument)
    expect(codeOf(() => readCommand("task 10:00", today))).toBe(MissingArgument)
    const { context } = fakeContext()
    expect(codeOf(() => runCommand({ name: "go", path: "nowhere" }, context))).toBe(InvalidArgument)
    expect(codeOf(() => runCommand({ name: "task", title: " ", day: today }, context))).toBe(TaskWithoutTitle)
  })

  it("task adds a task and says so", () => {
    const { context } = fakeContext()
    const answer = runCommand(readCommand("task Buy bread tomorrow 10:00", today), context)
    expect(answer.join()).toBe('Added "Buy bread" on 2026-10-18 at 10:00.')
    expect(loadTasks(context.storage)[0].title).toBe("Buy bread")
  })

  it("note writes a note and opens it", () => {
    const { context, visited } = fakeContext()
    runCommand(readCommand("note Ideas for the garden", today), context)
    const [note] = loadNotes(context.storage)
    expect(note.title).toBe("Ideas for the garden")
    expect(visited.join()).toBe(`#/notes/${note.id}`)
  })

  it("go opens a place by its name or its path, in any case", () => {
    const { context, visited } = fakeContext()
    runCommand(readCommand("go NOTES", today), context)
    runCommand(readCommand("go today", today), context)
    expect(visited.join()).toBe("#/notes,#/")
  })

  it("mode changes the light, and help lists every command", () => {
    const { context, modes } = fakeContext()
    runCommand(readCommand("mode dark", today), context)
    expect(modes.join()).toBe("dark")
    expect(runCommand(readCommand("help", today), context).length).toBe(commandHelp.length)
  })
})
