import { describe, expect, it, replace } from "./lib/test.js"
import { createTask, dayOf, withDoneSwitched } from "../src/tasks/task.js"
import { saveTasks } from "../src/tasks/store.js"
import { showToday } from "../src/views/today.js"
import { memoryStorage } from "./storage.js"

/** Draws today with some tasks, on a storage of its own; gives the page. */
async function todayWith(...tasks: ReturnType<typeof createTask>[]): Promise<HTMLElement> {
  const storage = memoryStorage()
  saveTasks(storage, tasks)
  replace(window, "localStorage", storage)
  const page = document.createElement("main")
  await showToday([], page)
  return page
}

describe("today", () => {
  const today = dayOf(new Date())

  it("the date sits above the title, and New task is the one main action", async () => {
    const page = await todayWith()
    expect(page.querySelector("h1")?.textContent).toBe("Today")
    expect(page.querySelector(".date")?.textContent ?? "").toMatch(/\S/)
    const main = [...page.querySelectorAll(".button.primary")]
    expect(main.map(button => button.textContent?.trim()).join()).toBe("New task")
    expect(page.querySelector("form.add-task")).toBe(null)
  })

  it("the tasks sit in one pane, by time, with what is done struck at the end", async () => {
    const done = withDoneSwitched(createTask("Water the plants", today))
    const page = await todayWith(createTask("Bike repair", today, "17:30"), done, createTask("Market", today, "10:00"))
    const titles = [...page.querySelectorAll(".pane .row .title")].map(title => title.textContent)
    expect(titles.join()).toBe("Market,Bike repair,Water the plants")
    expect(page.querySelector(".row.done .title")?.textContent).toBe("Water the plants")
  })

  it("the next pane lists what is left today at a time", async () => {
    const page = await todayWith(createTask("Market", today, "23:58"), createTask("Anytime", today))
    const next = page.querySelector('[aria-labelledby="next-heading"]')
    expect(next?.textContent ?? "").toMatch(/Market/)
    expect(/Anytime/.test(next?.textContent ?? "")).toBe(false)
  })

  it("an empty day says so, with a button to add the first task", async () => {
    const page = await todayWith()
    const empty = page.querySelector(".empty")
    expect(empty?.textContent ?? "").toMatch(/Nothing planned/)
    expect(empty?.querySelector("button")?.textContent?.trim()).toBe("Add a task")
  })

  it("every control has a name", async () => {
    const page = await todayWith(createTask("Market", today, "10:00"))
    for (const control of page.querySelectorAll("button, input")) {
      const name = control.getAttribute("aria-label") ?? control.textContent?.trim() ?? ""
      const labelled = control.id !== "" && page.querySelector(`label[for="${control.id}"]`) !== null
      expect(name !== "" || labelled).toBe(true)
    }
  })
})
