import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { ValhallaError } from "../errors.js"
import { icon } from "../icons.js"
import { createTask, dayOf, Task, tasksOfDay, withDoneSwitched } from "../tasks/task.js"
import { loadTasks, saveTasks } from "../tasks/store.js"

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
    const title = (form.querySelector("#task-title") as HTMLInputElement).value
    const time = (form.querySelector("#task-time") as HTMLInputElement).value
    try {
      saveTasks(localStorage, [...loadTasks(localStorage), createTask(title, today, time)])
    } catch (problem) {
      if (!(problem instanceof ValhallaError)) {
        throw problem
      }
      error.textContent = messageFor(problem)
      return
    }
    showToday([], page)
    ;(page.querySelector("#task-title") as HTMLInputElement).focus()
  })
  return form
}

function messageFor(problem: ValhallaError): string {
  switch (problem.code) {
    case "tasks.without-title":
      return "Write what there is to do."
    case "tasks.invalid-time":
      return "Write the time as hours and minutes, such as 16:30."
    default:
      return problem.message
  }
}

function field(id: string, label: string, type: string): HTMLElement {
  const wrapper = uiComponent({ classes: ["field"] })
  const labelElement = uiComponent({ type: Html.Label, attributes: { for: id } })
  labelElement.textContent = label
  const input = uiComponent({ type: Html.Input, id: id, attributes: { type: type, name: id } })
  wrapper.append(labelElement, input)
  return wrapper
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
    ;(page.querySelector(`#task-${task.id}`) as HTMLInputElement | null)?.focus()
  })
  item.append(checkBox, label)
  if (task.time !== undefined) {
    const time = uiComponent({ type: Html.Span, classes: ["pill"] })
    time.textContent = task.time
    item.append(time)
  }
  return item
}
