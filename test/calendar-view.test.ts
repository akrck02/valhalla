import { describe, expect, it, replace } from "./lib/test.js"
import { createTask, dayOf, withDoneSwitched } from "../src/tasks/task.js"
import { saveTasks } from "../src/tasks/store.js"
import { showCalendar } from "../src/views/calendar.js"
import { memoryStorage } from "./storage.js"

/** Draws the calendar with some tasks, on a storage of its own; gives the page. */
async function calendarWith(parameters: string[], ...tasks: ReturnType<typeof createTask>[]): Promise<HTMLElement> {
  const storage = memoryStorage()
  saveTasks(storage, tasks)
  replace(window, "localStorage", storage)
  const page = document.createElement("main")
  await showCalendar(parameters, page)
  return page
}

function namesOfControls(page: HTMLElement): string[] {
  return [...page.querySelectorAll("a, button")].map(control =>
    control.getAttribute("aria-label") ?? control.textContent?.trim() ?? "")
}

describe("the calendar page", () => {
  it("a week shows its seven days with their tasks, and marks today", async () => {
    const today = dayOf(new Date())
    const page = await calendarWith([], createTask("Plan", today, "09:00"))
    expect(page.querySelectorAll(".week-day").length).toBe(7)
    expect(page.querySelector(".calendar-task .title")?.textContent).toBe("Plan")
    expect(page.querySelectorAll('[aria-current="date"]').length).toBe(1)
  })

  it("the address chooses the week, and a wrong one shows this week", async () => {
    const chosen = await calendarWith(["week", "2026-10-14"])
    expect(chosen.querySelector("#add-2026-10-12") !== null).toBe(true)
    const wrong = await calendarWith(["week", "not-a-day"])
    expect(wrong.querySelector(`#day-${dayOf(new Date())}`) !== null).toBe(true)
  })

  it("every control has a name", async () => {
    const week = await calendarWith(["week", "2026-10-14"], createTask("Plan", "2026-10-14"))
    const month = await calendarWith(["month", "2026-10"], createTask("Plan", "2026-10-14"))
    for (const name of [...namesOfControls(week), ...namesOfControls(month)]) {
      expect(name).toMatch(/\S/)
    }
  })

  it("shows what a person typed as text, never as markup", async () => {
    const page = await calendarWith(["week", "2026-10-14"], createTask("<img src=x>", "2026-10-14"))
    expect(page.querySelector(".calendar-task .title")?.textContent).toBe("<img src=x>")
    expect(page.querySelector("img")).toBe(null)
  })

  it("a month links each day to its week and says how many tasks are left", async () => {
    const page = await calendarWith(["month", "2026-10"],
      createTask("One", "2026-10-14"), createTask("Two", "2026-10-14"), withDoneSwitched(createTask("Done", "2026-10-14")))
    const days = page.querySelectorAll(".day-number")
    expect(days.length).toBe(35)
    const fourteenth = page.querySelector('a[href="#/calendar/week/2026-10-14"]')
    expect(fourteenth?.getAttribute("aria-label") ?? "").toMatch(/2 tasks left$/)
    expect(page.querySelectorAll(".month-day.outside").length).toBe(4)
  })

  it("a month shows a few tasks of a day and says how many more there are", async () => {
    const tasks = ["One", "Two", "Three", "Four", "Five"].map(title => createTask(title, "2026-10-14"))
    const page = await calendarWith(["month", "2026-10"], ...tasks)
    expect(page.querySelectorAll(".month-task").length).toBe(3)
    expect(page.querySelector(".month-more")?.textContent).toBe("+2 more")
  })
})
