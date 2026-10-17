import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { createTask, editedTask, Task } from "../tasks/task.js"
import { deleteTask, loadTasks, saveTasks, updateTask } from "../tasks/store.js"
import { field, tryShowingError, valueOf } from "./task-form.js"

/** What happened when the dialog closed. */
export type TaskDialogResult = "added" | "saved" | "deleted" | "cancelled"

/** Called once, right when the dialog closes, with what happened and the task it was about. */
export type TaskDialogClosed = (result: TaskDialogResult, task?: Task) => void

/**
 * Builds the dialog that changes or deletes a task. It is a native <dialog>: the browser keeps
 * the focus inside it and closes it with Escape. Deleting asks twice, so a slip loses nothing.
 * @param task the task to change
 * @param storage where the tasks are kept
 * @param closed called when the dialog closes
 */
export function taskDialog(task: Task, storage: Storage, closed: TaskDialogClosed): HTMLDialogElement {
  return buildDialog("Edit the task", task, storage, closed)
}

/**
 * Builds the dialog that adds a task, with its day already chosen.
 * @param day the day the task is for, as YYYY-MM-DD; the person can still change it
 * @param storage where the tasks are kept
 * @param closed called when the dialog closes
 */
export function newTaskDialog(day: string, storage: Storage, closed: TaskDialogClosed): HTMLDialogElement {
  return buildDialog("Add a task", { id: "", title: "", day: day, done: false }, storage, closed)
}

function buildDialog(title: string, task: Task, storage: Storage, closed: TaskDialogClosed): HTMLDialogElement {
  const isNew = task.id === ""
  const dialog = uiComponent({ type: "dialog", classes: ["dialog"], attributes: { "aria-labelledby": "task-dialog-heading" } }) as HTMLDialogElement
  const form = uiComponent({ type: Html.Form, attributes: { method: "dialog" } })
  const heading = uiComponent({ type: Html.H2, id: "task-dialog-heading" })
  heading.textContent = title
  const error = uiComponent({ type: Html.P, classes: ["error"], attributes: { role: "alert" } })
  const fields = uiComponent({ classes: ["dialog-fields"] })
  fields.append(
    field("dialog-title", "What is there to do?", "text", task.title),
    field("dialog-day", "Day", "date", task.day),
    field("dialog-time", "Time", "time", task.time ?? ""),
  )

  let reported = false
  const finish = (result: TaskDialogResult, finalTask?: Task): void => {
    if (reported) {
      return
    }
    reported = true
    dialog.close()
    dialog.remove()
    closed(result, finalTask)
  }
  const actions = isNew ? actionsBar() : actionsBar(deleteButton(task, storage, error, finish))
  actions.append(cancelButton(() => finish("cancelled", isNew ? undefined : task)), saveButton(isNew ? "Add" : "Save"))
  form.append(heading, fields, error, actions)
  dialog.append(form)

  form.addEventListener("submit", event => {
    event.preventDefault()
    let saved: Task | undefined
    const worked = tryShowingError(error, () => {
      saved = isNew ? createTask(valueOf(form, "dialog-title"), valueOf(form, "dialog-day"), valueOf(form, "dialog-time"))
        : editedTask(task, valueOf(form, "dialog-title"), valueOf(form, "dialog-day"), valueOf(form, "dialog-time"))
      if (isNew) {
        saveTasks(storage, [...loadTasks(storage), saved])
      } else {
        updateTask(storage, saved)
      }
    })
    if (worked) {
      finish(isNew ? "added" : "saved", saved)
    }
  })
  dialog.addEventListener("close", () => finish("cancelled", isNew ? undefined : task)) // Escape closes it without a button
  return dialog
}

function actionsBar(...buttons: HTMLElement[]): HTMLElement {
  const bar = uiComponent({ classes: ["dialog-actions"] })
  bar.append(...buttons)
  return bar
}

function deleteButton(task: Task, storage: Storage, error: HTMLElement, finish: TaskDialogClosed): HTMLElement {
  const remove = uiComponent({ type: Html.Button, classes: ["button", "danger"], attributes: { type: "button" } })
  const label = document.createTextNode("Delete")
  remove.append(icon("trash"), label)
  remove.addEventListener("click", () => {
    if (remove.dataset.asked === undefined) {
      remove.dataset.asked = ""
      label.textContent = "Delete for good"
      error.textContent = "Press again to delete this task."
      return
    }
    if (tryShowingError(error, () => deleteTask(storage, task.id))) {
      finish("deleted", task)
    }
  })
  return remove
}

function cancelButton(cancel: () => void): HTMLElement {
  const button = uiComponent({ type: Html.Button, classes: ["button"], attributes: { type: "button" } })
  button.textContent = "Cancel"
  button.addEventListener("click", cancel)
  return button
}

function saveButton(name: string): HTMLElement {
  const button = uiComponent({ type: Html.Button, classes: ["button", "primary"], attributes: { type: "submit" } })
  button.textContent = name
  return button
}
