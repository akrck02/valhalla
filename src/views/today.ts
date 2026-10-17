import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { createTask, dayOf, Task, tasksOfDay, withDoneSwitched } from "../tasks/task.js"
import { loadTasks, saveTasks } from "../tasks/store.js"
import { taskDialog, TaskDialogResult } from "./task-dialog.js"
import { field, tryShowingError, valueOf } from "./task-form.js"

/** Today: what is left to do, a check box for each task, and a line to add one. */
export async function showToday(_parameters: string[], page: HTMLElement): Promise<void> {
  const today = dayOf(new Date())
  page.replaceChildren(header(today), addForm(today, page), taskList(today, page))
}

function header(today: string): HTMLElement {
  const header = uiComponent({ type: Html.Header })
  const title = uiComponent({ type: Html.H1, text: "Today" })
  const summary = uiComponent({ type: Html.P, classes: ["soft"], attributes: { "aria-live": "polite" } })
  summary.textContent = summaryOf(tasksOfDay(loadTasks(localStorage), today))
  header.append(title, summary)
  return header
}

function summaryOf(tasks: Task[]): string {
  const left = tasks.filter(task => !task.done).length
  if (tasks.length === 0) {
    return "Nothing planned. Add the first task below."
  }
  if (left === 0) {
    return "All done for today."
  }
  return left === 1 ? "One task left." : `${left} tasks left.`
}

function addForm(today: string, page: HTMLElement): HTMLElement {
  const form = uiComponent({ type: Html.Form, classes: ["card", "add-task"], attributes: { "aria-label": "Add a task" } })
  const titleField = field("task-title", "What is there to do?", "text")
  const timeField = field("task-time", "Time", "time")
  const error = uiComponent({ type: Html.P, classes: ["error"], attributes: { role: "alert" } })
  const add = uiComponent({ type: Html.Button, classes: ["button", "primary"], attributes: { type: "submit" } })
  add.append(icon("plus"), document.createTextNode("Add"))
  form.append(titleField, timeField, add, error)

  form.addEventListener("submit", event => {
    event.preventDefault()
    const added = tryShowingError(error, () =>
      saveTasks(localStorage, [...loadTasks(localStorage), createTask(valueOf(form, "task-title"), today, valueOf(form, "task-time"))]))
    if (added) {
      showToday([], page)
      focusIn(page, "#task-title")
    }
  })
  return form
}

function taskList(today: string, page: HTMLElement): HTMLElement {
  const list = uiComponent({ type: Html.Ul, classes: ["list"], attributes: { "aria-label": "Tasks for today" } })
  for (const task of tasksOfDay(loadTasks(localStorage), today)) {
    list.append(taskItem(task, page))
  }
  return list
}

function taskItem(task: Task, page: HTMLElement): HTMLElement {
  const item = uiComponent({ type: Html.Li, classes: task.done ? ["list-item", "done"] : ["list-item"] })
  const label = uiComponent({ type: Html.Label, classes: ["title"], attributes: { for: `task-${task.id}` } })
  label.textContent = task.title // what a person typed is always text, never markup
  const checkBox = uiComponent({ type: Html.Input, id: `task-${task.id}`, attributes: { type: "checkbox" } }) as HTMLInputElement
  checkBox.checked = task.done
  checkBox.addEventListener("change", () => {
    const tasks = loadTasks(localStorage).map(saved => saved.id === task.id ? withDoneSwitched(saved) : saved)
    saveTasks(localStorage, tasks)
    showToday([], page)
    focusIn(page, `#task-${task.id}`)
  })
  item.append(checkBox, label)
  if (task.time !== undefined) {
    const time = uiComponent({ type: Html.Span, classes: ["pill"] })
    time.textContent = task.time
    item.append(time)
  }
  item.append(editButton(task, page))
  return item
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
    focusIn(page, "#task-title") // a deleted task, or one moved to another day, is no longer here
    return
  }
  focusIn(page, `#edit-${task.id}`)
}

function focusIn(page: HTMLElement, selector: string): void {
  ;(page.querySelector(selector) as HTMLElement | null)?.focus()
}
