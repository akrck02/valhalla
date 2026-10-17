import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { addDays, addMonths, dateOf, daysInWeek, isDay, isMonth, monthOf, weekOf, weeksOfMonth } from "../calendar/calendar.js"
import { dayOf, Task, tasksOfDay } from "../tasks/task.js"
import { loadTasks } from "../tasks/store.js"
import { newTaskDialog, taskDialog, TaskDialogResult } from "./task-dialog.js"
import { focusIn } from "./focus.js"
import { floatingButton } from "../shell.js"

/** How many tasks a day of the month shows before it says how many more there are. */
const tasksShownInMonth = 3

/** The two ways to look at the calendar. */
type Span = "week" | "month"

/**
 * The calendar: a week, with every task and a button to add one on each day, or a month, with the
 * first tasks of each day. Its address says what it shows: #/calendar/week/2026-10-12 or
 * #/calendar/month/2026-10; anything else shows this week.
 */
export async function showCalendar(parameters: string[], page: HTMLElement): Promise<void> {
  const [span, when] = parameters
  page.classList.add("wide")
  const today = dayOf(new Date())
  if (span === "month" && when !== undefined && isMonth(when)) {
    page.replaceChildren(header("month", when, today), monthTable(when, today, page), addTodayButton(today, page))
    return
  }
  const day = span === "week" && when !== undefined && isDay(when) ? when : today
  page.replaceChildren(header("week", day, today), weekGrid(day, today, page), addTodayButton(today, page))
}

function addTodayButton(today: string, page: HTMLElement): HTMLElement {
  return floatingButton("Add a task", () => {
    openDialog(page, newTaskDialog(today, localStorage, (result, task) => afterDialog(page, result, task, today)))
  })
}

function header(span: Span, when: string, today: string): HTMLElement {
  const header = uiComponent({ type: Html.Header, classes: ["calendar-header"] })
  const title = uiComponent({ type: Html.H1 })
  title.textContent = span === "week" ? weekTitle(weekOf(when)) : monthTitle(when)
  header.append(title, spanSwitch(span, when), steps(span, when, today))
  return header
}

/** Week and month as two links, the current one marked, so it works without any script state. */
function spanSwitch(span: Span, when: string): HTMLElement {
  const day = span === "week" ? when : `${when}-01`
  const nav = uiComponent({ type: Html.Nav, classes: ["segmented"], attributes: { "aria-label": "Show" } })
  nav.append(
    link("Week", `#/calendar/week/${day}`, span === "week"),
    link("Month", `#/calendar/month/${monthOf(day)}`, span === "month"),
  )
  return nav
}

function steps(span: Span, when: string, today: string): HTMLElement {
  const nav = uiComponent({ type: Html.Nav, classes: ["calendar-steps"], attributes: { "aria-label": `Other ${span}s` } })
  const before = span === "week" ? `#/calendar/week/${addDays(when, -daysInWeek)}` : `#/calendar/month/${addMonths(when, -1)}`
  const after = span === "week" ? `#/calendar/week/${addDays(when, daysInWeek)}` : `#/calendar/month/${addMonths(when, 1)}`
  const now = span === "week" ? `#/calendar/week/${today}` : `#/calendar/month/${monthOf(today)}`
  const previous = link("", before, false, ["icon"])
  previous.setAttribute("aria-label", `Previous ${span}`)
  previous.append(icon("chevronLeft"))
  const next = link("", after, false, ["icon"])
  next.setAttribute("aria-label", `Next ${span}`)
  next.append(icon("chevronRight"))
  nav.append(previous, link("Today", now, false), next)
  return nav
}

function link(text: string, href: string, current: boolean, classes: string[] = []): HTMLElement {
  const anchor = uiComponent({ type: Html.A, classes: ["button", "ghost", ...classes], attributes: { href: href } })
  anchor.textContent = text
  if (current) {
    anchor.setAttribute("aria-current", "page")
  }
  return anchor
}

// The week ----------------------------------------------------------------------------------------

function weekGrid(day: string, today: string, page: HTMLElement): HTMLElement {
  const tasks = loadTasks(localStorage)
  const grid = uiComponent({ type: "ol", classes: ["week"], attributes: { "aria-label": "Days of the week" } })
  for (const weekDay of weekOf(day)) {
    grid.append(weekDayItem(weekDay, today, tasksOfDay(tasks, weekDay), page))
  }
  return grid
}

function weekDayItem(day: string, today: string, tasks: Task[], page: HTMLElement): HTMLElement {
  const item = uiComponent({ type: Html.Li, classes: ["week-day"] })
  const heading = uiComponent({ type: Html.H2, id: `day-${day}` })
  const weekday = uiComponent({ type: Html.Span, classes: ["weekday"], attributes: { "aria-hidden": "true" } })
  weekday.textContent = weekdayName(day, "short")
  const number = uiComponent({ type: Html.Span, classes: ["number"], attributes: { "aria-hidden": "true" } })
  number.textContent = String(dateOf(day).getDate())
  heading.append(weekday, number, hiddenText(longDay(day))) // short to the eye, whole to a screen reader
  if (day === today) {
    heading.setAttribute("aria-current", "date")
  }
  const list = uiComponent({ type: Html.Ul, classes: ["calendar-tasks"], attributes: { "aria-labelledby": `day-${day}` } })
  for (const task of tasks) {
    const entry = uiComponent({ type: Html.Li })
    entry.append(taskButton(task, page))
    list.append(entry)
  }
  item.append(heading, list, addButton(day, page))
  return item
}

function taskButton(task: Task, page: HTMLElement): HTMLElement {
  const button = uiComponent({
    type: Html.Button,
    id: `calendar-task-${task.id}`,
    classes: task.done ? ["calendar-task", "done"] : ["calendar-task"],
    attributes: { type: "button" },
  })
  if (task.time !== undefined) {
    const time = uiComponent({ type: Html.Span, classes: ["time"] })
    time.textContent = task.time
    button.append(time)
  }
  const title = uiComponent({ type: Html.Span, classes: ["title"] })
  title.textContent = task.title // what a person typed is always text, never markup
  button.append(title)
  if (task.done) {
    button.append(hiddenText(", done"))
  }
  button.addEventListener("click", () => {
    openDialog(page, taskDialog(task, localStorage, (result, closedTask) => afterDialog(page, result, closedTask, task.day)))
  })
  return button
}

function addButton(day: string, page: HTMLElement): HTMLElement {
  const button = uiComponent({
    type: Html.Button,
    id: `add-${day}`,
    classes: ["button", "ghost", "icon"],
    attributes: { type: "button", "aria-label": `Add a task on ${longDay(day)}`, title: "Add a task" },
  })
  button.append(icon("plus"))
  button.addEventListener("click", () => {
    openDialog(page, newTaskDialog(day, localStorage, (result, task) => afterDialog(page, result, task, day)))
  })
  return button
}

function openDialog(page: HTMLElement, dialog: HTMLDialogElement): void {
  page.append(dialog)
  dialog.showModal()
}

/** Draws the calendar again and puts the focus on the task, or on the add button of its day. */
function afterDialog(page: HTMLElement, result: TaskDialogResult, task: Task | undefined, fromDay: string): void {
  if (result !== "cancelled") {
    showCalendar(currentParameters(), page)
  }
  if (task !== undefined && result !== "deleted" && page.querySelector(`#calendar-task-${task.id}`) !== null) {
    focusIn(page, `#calendar-task-${task.id}`)
    return
  }
  focusIn(page, `#add-${fromDay}`) // a deleted task, or one moved to another week, is no longer here
}

function currentParameters(): string[] {
  return location.hash.replace(/^#\/?calendar\/?/, "").split("/")
}

// The month ---------------------------------------------------------------------------------------

function monthTable(month: string, today: string, page: HTMLElement): HTMLElement {
  const tasks = loadTasks(localStorage)
  const table = uiComponent({ type: "table", classes: ["month"] })
  const caption = uiComponent({ type: "caption", classes: ["visually-hidden"] })
  caption.textContent = monthTitle(month)
  const head = uiComponent({ type: "thead" })
  const names = uiComponent({ type: "tr" })
  for (const day of weekOf(`${month}-01`)) {
    const name = uiComponent({ type: "th", attributes: { scope: "col" } })
    const short = uiComponent({ type: "abbr", attributes: { title: weekdayName(day, "long") } })
    short.textContent = weekdayName(day, "short")
    name.append(short)
    names.append(name)
  }
  head.append(names)
  const body = uiComponent({ type: "tbody" })
  for (const week of weeksOfMonth(month)) {
    const row = uiComponent({ type: "tr" })
    for (const day of week) {
      row.append(monthDayCell(day, month, today, tasksOfDay(tasks, day)))
    }
    body.append(row)
  }
  table.append(caption, head, body)
  return table
}

function monthDayCell(day: string, month: string, today: string, tasks: Task[]): HTMLElement {
  const cell = uiComponent({ type: "td", classes: monthOf(day) === month ? ["month-day"] : ["month-day", "outside"] })
  const number = uiComponent({ type: Html.A, classes: ["day-number"], attributes: { href: `#/calendar/week/${day}` } })
  number.textContent = String(dateOf(day).getDate())
  const left = tasks.filter(task => !task.done).length
  number.setAttribute("aria-label", `${longDay(day)}, ${countOf(left, "task left", "tasks left")}`)
  if (day === today) {
    number.setAttribute("aria-current", "date")
  }
  cell.append(number)
  const shown = tasks.filter(task => !task.done).slice(0, tasksShownInMonth)
  for (const task of shown) {
    const line = uiComponent({ type: Html.Span, classes: ["month-task"], attributes: { "aria-hidden": "true" } })
    line.textContent = task.time === undefined ? task.title : `${task.time} ${task.title}`
    cell.append(line)
  }
  if (left > shown.length) {
    const more = uiComponent({ type: Html.Span, classes: ["month-more"], attributes: { "aria-hidden": "true" } })
    more.textContent = `+${left - shown.length} more`
    cell.append(more)
  }
  return cell
}

// Words -------------------------------------------------------------------------------------------

function weekTitle(days: string[]): string {
  const first = dateOf(days[0])
  const last = dateOf(days[days.length - 1])
  const format = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" })
  return format.formatRange(first, last)
}

function monthTitle(month: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(dateOf(`${month}-01`))
}

function longDay(day: string): string {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" }).format(dateOf(day))
}

function weekdayName(day: string, width: "long" | "short"): string {
  return new Intl.DateTimeFormat(undefined, { weekday: width }).format(dateOf(day))
}

function countOf(count: number, one: string, many: string): string {
  if (count === 0) {
    return `no ${many}`
  }
  return count === 1 ? `1 ${one}` : `${count} ${many}`
}

function hiddenText(text: string): HTMLElement {
  const span = uiComponent({ type: Html.Span, classes: ["visually-hidden"] })
  span.textContent = text
  return span
}
