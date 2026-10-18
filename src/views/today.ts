import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { longDay } from "../language.js"
import { dayOf, Task, tasksOfDay, withDoneSwitched } from "../tasks/task.js"
import { loadTasks, saveTasks } from "../tasks/store.js"
import { newTaskDialog, taskDialog, TaskDialogResult } from "./task-dialog.js"
import { focusIn } from "./focus.js"

/** How many tasks at a time the pane beside the day lists. */
const nextShown = 4

/**
 * Today: the date over the title, New task as the one main action, the day's tasks in a pane with
 * a check box each, and beside them a pane with what is left at a time.
 */
export async function showToday(_parameters: string[], page: HTMLElement): Promise<void> {
  const today = dayOf(new Date())
  const tasks = tasksOfDay(loadTasks(localStorage), today)
  page.classList.add("wide")
  page.replaceChildren(header(today, tasks, page), body(today, tasks, page))
}

function header(today: string, tasks: Task[], page: HTMLElement): HTMLElement {
  const header = uiComponent({ type: Html.Header, classes: ["page-header"] })
  const titles = uiComponent()
  const date = uiComponent({ type: Html.P, classes: ["date", "soft"] })
  date.textContent = longDay(today)
  const title = uiComponent({ type: Html.H1, text: "Today" })
  const summary = uiComponent({ type: Html.P, classes: ["soft"], attributes: { "aria-live": "polite" } })
  summary.textContent = summaryOf(tasks)
  titles.append(date, title, summary)
  header.append(titles, newTaskButton("New task", today, page, ["primary"]))
  return header
}

function summaryOf(tasks: Task[]): string {
  const left = tasks.filter(task => !task.done).length
  if (tasks.length === 0) {
    return "Nothing planned yet."
  }
  if (left === 0) {
    return "All done for today."
  }
  const share = Math.round(((tasks.length - left) / tasks.length) * 100)
  return `${left === 1 ? "One task left" : `${left} tasks left`} · ${share}% done.`
}

/** The button that opens the dialog to add a task, focused on the new task once it is added. */
function newTaskButton(name: string, today: string, page: HTMLElement, classes: string[] = []): HTMLElement {
  const button = uiComponent({ type: Html.Button, id: "new-task", classes: ["button", ...classes], attributes: { type: "button" } })
  button.append(icon("plus"), document.createTextNode(name))
  button.addEventListener("click", () => {
    const dialog = newTaskDialog(today, localStorage, (result, task) => {
      if (result !== "added" || task === undefined) {
        focusIn(page, "#new-task")
        return
      }
      showToday([], page)
      focusIn(page, `#task-${task.id}`)
    })
    page.append(dialog)
    dialog.showModal()
  })
  return button
}

function body(today: string, tasks: Task[], page: HTMLElement): HTMLElement {
  const columns = uiComponent({ classes: ["today"] })
  columns.append(tasksPane(today, tasks, page), nextPane(tasks))
  return columns
}

function tasksPane(today: string, tasks: Task[], page: HTMLElement): HTMLElement {
  const pane = uiComponent({ type: Html.Section, classes: ["pane"], attributes: { "aria-labelledby": "tasks-heading" } })
  const heading = uiComponent({ type: Html.H2, id: "tasks-heading", text: "Tasks" })
  pane.append(heading)
  if (tasks.length === 0) {
    pane.append(emptyDay(today, page))
    return pane
  }
  const list = uiComponent({ type: Html.Ul, classes: ["rows"], attributes: { "aria-label": "Tasks for today" } })
  for (const task of tasks) {
    list.append(taskRow(task, page))
  }
  pane.append(list)
  return pane
}

function emptyDay(today: string, page: HTMLElement): HTMLElement {
  const empty = uiComponent({ classes: ["empty"] })
  const text = uiComponent({ type: Html.P })
  text.textContent = "Nothing planned for today. Write down the first thing to do."
  const button = newTaskButton("Add a task", today, page)
  button.id = "add-first-task"
  empty.append(icon("circleCheck"), text, button)
  return empty
}

function taskRow(task: Task, page: HTMLElement): HTMLElement {
  const row = uiComponent({ type: Html.Li, classes: task.done ? ["row", "done"] : ["row"] })
  const checkBox = uiComponent({ type: Html.Input, id: `task-${task.id}`, attributes: { type: "checkbox" } }) as HTMLInputElement
  checkBox.checked = task.done
  checkBox.addEventListener("change", () => {
    const tasks = loadTasks(localStorage).map(saved => saved.id === task.id ? withDoneSwitched(saved) : saved)
    saveTasks(localStorage, tasks)
    showToday([], page)
    focusIn(page, `#task-${task.id}`)
  })
  const label = uiComponent({ type: Html.Label, classes: ["title"], attributes: { for: `task-${task.id}` } })
  label.textContent = task.title // what a person typed is always text, never markup
  row.append(checkBox, label)
  if (task.time !== undefined) {
    const time = uiComponent({ type: Html.Span, classes: ["time"] })
    time.textContent = task.time
    row.append(time)
  }
  row.append(editButton(task, page))
  return row
}

/** What is left today at a time, the next few: the day's appointments at a glance. */
function nextPane(tasks: Task[]): HTMLElement {
  const pane = uiComponent({ type: Html.Section, classes: ["pane"], attributes: { "aria-labelledby": "next-heading" } })
  const heading = uiComponent({ type: Html.H2, id: "next-heading", text: "Next" })
  pane.append(heading)
  const timed = tasks.filter(task => !task.done && task.time !== undefined).slice(0, nextShown)
  if (timed.length === 0) {
    const nothing = uiComponent({ type: Html.P, classes: ["soft"] })
    nothing.textContent = "Nothing else at a set time today."
    pane.append(nothing)
    return pane
  }
  const list = uiComponent({ type: Html.Ul, classes: ["next"] })
  for (const task of timed) {
    const item = uiComponent({ type: Html.Li })
    const time = uiComponent({ type: Html.Span, classes: ["time"] })
    time.textContent = task.time ?? ""
    const title = uiComponent({ type: Html.Span, classes: ["title"] })
    title.textContent = task.title
    item.append(time, title)
    list.append(item)
  }
  pane.append(list)
  return pane
}

function editButton(task: Task, page: HTMLElement): HTMLElement {
  const name = `Edit ${task.title}`
  const edit = uiComponent({
    type: Html.Button,
    id: `edit-${task.id}`,
    classes: ["button", "ghost", "icon"],
    attributes: { type: "button", title: name, "aria-label": name },
  })
  edit.append(icon("pencil"))
  edit.addEventListener("click", () => {
    const dialog = taskDialog(task, localStorage, result => afterEditing(result, task, page))
    page.append(dialog)
    dialog.showModal()
  })
  return edit
}

/** Draws the day again and puts the focus back where the person was, or the nearest place left. */
function afterEditing(result: TaskDialogResult, task: Task, page: HTMLElement): void {
  if (result === "cancelled") {
    focusIn(page, `#edit-${task.id}`)
    return
  }
  showToday([], page)
  if (result === "deleted" || page.querySelector(`#edit-${task.id}`) === null) {
    focusIn(page, "#new-task") // a deleted task, or one moved to another day, is no longer here
    return
  }
  focusIn(page, `#edit-${task.id}`)
}
