import { describe, expect, it } from "./lib/test.js"
import { createTask, dayOf, tasksOfDay, withDoneSwitched } from "../src/tasks/task.js"
import { loadTasks, saveTasks } from "../src/tasks/store.js"
import { InvalidDay, InvalidTime, TaskWithoutTitle, ValhallaError } from "../src/errors.js"

function codeOf(make: () => unknown): string {
  try {
    make()
  } catch (error) {
    return error instanceof ValhallaError ? error.code : "not a ValhallaError"
  }
  return "no error"
}

describe("tasks", () => {
  it("a new task keeps its title without the spaces around it", () => {
    const task = createTask("  Write the notes  ", "2026-10-17", "16:00")
    expect(task.title).toBe("Write the notes")
    expect(task.done).toBe(false)
  })

  it("each wrong input has its own code", () => {
    expect(codeOf(() => createTask("   ", "2026-10-17"))).toBe(TaskWithoutTitle)
    expect(codeOf(() => createTask("Plan", "17/10/2026"))).toBe(InvalidDay)
    expect(codeOf(() => createTask("Plan", "2026-10-17", "25:00"))).toBe(InvalidTime)
  })

  it("an empty time means any time that day", () => {
    expect(createTask("Plan", "2026-10-17", "").time).toBe(undefined)
  })

  it("switching a task gives a new task and leaves the old one as it was", () => {
    const task = createTask("Plan", "2026-10-17")
    const switched = withDoneSwitched(task)
    expect(switched.done).toBe(true)
    expect(task.done).toBe(false)
  })

  it("a day shows what is left by time, then tasks without a time, then what is done", () => {
    const late = createTask("Late", "2026-10-17", "18:00")
    const early = createTask("Early", "2026-10-17", "09:00")
    const anyTime = createTask("Any time", "2026-10-17")
    const done = withDoneSwitched(createTask("Done", "2026-10-17", "08:00"))
    const otherDay = createTask("Tomorrow", "2026-10-18")
    const titles = tasksOfDay([late, done, anyTime, otherDay, early], "2026-10-17").map(task => task.title)
    expect(titles.join(", ")).toBe("Early, Late, Any time, Done")
  })

  it("a date is written as the day of the person's own time zone", () => {
    expect(dayOf(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05")
  })
})

describe("the store", () => {
  function memoryStorage(): Storage {
    const values = new Map<string, string>()
    return {
      get length() { return values.size },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: (index: number) => [...values.keys()][index] ?? null,
      removeItem: (key: string) => { values.delete(key) },
      setItem: (key: string, value: string) => { values.set(key, value) },
    }
  }

  it("saved tasks come back as they were", () => {
    const storage = memoryStorage()
    const task = createTask("Plan", "2026-10-17", "10:00")
    saveTasks(storage, [task])
    expect(JSON.stringify(loadTasks(storage))).toBe(JSON.stringify([task]))
  })

  it("an empty or damaged store gives no tasks instead of breaking", () => {
    const storage = memoryStorage()
    expect(loadTasks(storage).length).toBe(0)
    storage.setItem("valhalla.tasks", "{not json")
    expect(loadTasks(storage).length).toBe(0)
  })
})
