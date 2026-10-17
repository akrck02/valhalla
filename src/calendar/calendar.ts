import { dayOf } from "../tasks/task.js"

// Days are written YYYY-MM-DD and months YYYY-MM, in the person's own time zone, as in tasks.
// Dates are made at noon, so a change of summer time never moves them to another day.

/** How many days a week has. */
export const daysInWeek = 7

const middayHour = 12
const dayPattern = /^(\d{4})-(\d{2})-(\d{2})$/
const monthPattern = /^(\d{4})-(\d{2})$/

/** Says whether a text is a real day written as YYYY-MM-DD; 2026-02-30 is not. */
export function isDay(text: string): boolean {
  return dayPattern.test(text) && dayOf(dateOf(text)) === text
}

/** Says whether a text is a month written as YYYY-MM. */
export function isMonth(text: string): boolean {
  const parts = monthPattern.exec(text)
  return parts !== null && Number(parts[2]) >= 1 && Number(parts[2]) <= 12
}

/** Gives the date at noon of a day written as YYYY-MM-DD. */
export function dateOf(day: string): Date {
  const [year, month, dayOfMonth] = day.split("-").map(Number)
  return new Date(year, month - 1, dayOfMonth, middayHour)
}

/** Gives the day a number of days after another; a negative number goes back. */
export function addDays(day: string, count: number): string {
  const date = dateOf(day)
  date.setDate(date.getDate() + count)
  return dayOf(date)
}

/** Gives the seven days of the week of a day, from Monday to Sunday. */
export function weekOf(day: string): string[] {
  const daysSinceMonday = (dateOf(day).getDay() + daysInWeek - 1) % daysInWeek
  const monday = addDays(day, -daysSinceMonday)
  return Array.from({ length: daysInWeek }, (_, index) => addDays(monday, index))
}

/** Gives the month of a day, as YYYY-MM. */
export function monthOf(day: string): string {
  return day.slice(0, "YYYY-MM".length)
}

/** Gives the month a number of months after another; a negative number goes back. */
export function addMonths(month: string, count: number): string {
  const first = dateOf(`${month}-01`)
  first.setMonth(first.getMonth() + count)
  return monthOf(dayOf(first))
}

/**
 * Gives the weeks a month touches, each from Monday to Sunday. The first and last weeks hold some
 * days of the months around it, as on a paper calendar.
 */
export function weeksOfMonth(month: string): string[][] {
  const weeks: string[][] = []
  let monday = weekOf(`${month}-01`)[0]
  while (weeks.length === 0 || monthOf(monday) === month) {
    const week = weekOf(monday)
    weeks.push(week)
    monday = addDays(week[0], daysInWeek)
  }
  return weeks
}
