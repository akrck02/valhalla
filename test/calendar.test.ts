import { describe, expect, it } from "./lib/test.js"
import { addDays, addMonths, isDay, isMonth, monthOf, weekOf, weeksOfMonth } from "../src/calendar/calendar.js"

describe("the calendar", () => {
  it("a week runs from Monday to Sunday, whatever day it starts from", () => {
    expect(weekOf("2026-10-14").join()).toBe("2026-10-12,2026-10-13,2026-10-14,2026-10-15,2026-10-16,2026-10-17,2026-10-18")
    expect(weekOf("2026-10-18")[0]).toBe("2026-10-12")
    expect(weekOf("2026-10-12")[0]).toBe("2026-10-12")
  })

  it("adding days crosses months, years and changes of summer time", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01")
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31")
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26") // the last Sunday of October changes the clocks in Europe
    expect(addDays("2026-03-28", 2)).toBe("2026-03-30")
  })

  it("adding months crosses years", () => {
    expect(addMonths("2026-12", 1)).toBe("2027-01")
    expect(addMonths("2026-01", -1)).toBe("2025-12")
    expect(monthOf("2026-10-17")).toBe("2026-10")
  })

  it("a month shows every week it touches, with the days around it", () => {
    const weeks = weeksOfMonth("2026-10")
    expect(weeks.length).toBe(5)
    expect(weeks[0][0]).toBe("2026-09-28")
    expect(weeks[4][6]).toBe("2026-11-01")
  })

  it("a month that starts on a Monday starts with its own first day", () => {
    expect(weeksOfMonth("2026-06")[0][0]).toBe("2026-06-01")
  })

  it("only real days and months are accepted from an address", () => {
    expect(isDay("2026-10-17")).toBe(true)
    expect(isDay("2026-02-30")).toBe(false)
    expect(isDay("17-10-2026")).toBe(false)
    expect(isMonth("2026-12")).toBe(true)
    expect(isMonth("2026-13")).toBe(false)
  })
})
