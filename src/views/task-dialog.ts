import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { editedTask, Task } from "../tasks/task.js"
import { deleteTask, updateTask } from "../tasks/store.js"
import { field, tryShowingError, valueOf } from "./task-form.js"

/** What happened to the task when the dialog closed. */
export type TaskDialogResult = "saved" | "deleted" | "cancelled"

/**
 * Builds the dialog that changes or deletes a task. It is a native <dialog>: the browser keeps
 * the focus inside it and closes it with Escape. Deleting asks twice, so a slip loses nothing.
 * @param task the task to change
 * @param storage where the tasks are kept
 * @param closed called once, right when the dialog closes, with what happened
 */
export function taskDialog(task: Task, storage: Storage, closed: (result: TaskDialogResult) => void): HTMLDialogElement {
  const dialog = uiComponent({ type: "dialog", classes: ["dialog"], attributes: { "aria-labelledby": "edit-task-heading" } }) as HTMLDialogElement
  const form = uiComponent({ type: Html.Form, attributes: { method: "dialog" } })
  const heading = uiComponent({ type: Html.H2, id: "edit-task-heading", text: "Edit the task" })
  const error = uiComponent({ type: Html.P, classes: ["error"], attributes: { role: "alert" } })
  const fields = uiComponent({ classes: ["dialog-fields"] })
  fields.append(
    field("edit-title", "What is there to do?", "text", task.title),
    field("edit-day", "Day", "date", task.day),
    field("edit-time", "Time", "time", task.time ?? ""),
  )
  let reported = false
  const finish = (result: TaskDialogResult): void => {
    if (reported) {
      return
    }
    reported = true
    dialog.close()
    dialog.remove()
    closed(result)
  }
  form.append(heading, fields, error, actions(task, storage, error, finish))
  dialog.append(form)

  form.addEventListener("submit", event => {
    event.preventDefault()
    const saved = tryShowingError(error, () =>
      updateTask(storage, editedTask(task, valueOf(form, "edit-title"), valueOf(form, "edit-day"), valueOf(form, "edit-time"))))
    if (saved) {
      finish("saved")
    }
  })
  dialog.addEventListener("close", () => finish("cancelled")) // Escape closes it without a button
  return dialog
}

function actions(task: Task, storage: Storage, error: HTMLElement, finish: (result: TaskDialogResult) => void): HTMLElement {
  const bar = uiComponent({ classes: ["dialog-actions"] })
  const remove = uiComponent({ type: Html.Button, classes: ["button", "danger"], attributes: { type: "button" } })
  remove.append(icon("trash"), document.createTextNode("Delete"))
  remove.addEventListener("click", () => {
    if (remove.dataset.asked === undefined) {
      remove.dataset.asked = ""
      remove.lastChild!.textContent = "Delete for good"
      error.textContent = "Press again to delete this task."
      return
    }
    if (tryShowingError(error, () => deleteTask(storage, task.id))) {
      finish("deleted")
    }
  })
  const cancel = uiComponent({ type: Html.Button, classes: ["button"], attributes: { type: "button" } })
  cancel.textContent = "Cancel"
  cancel.addEventListener("click", () => finish("cancelled"))
  const save = uiComponent({ type: Html.Button, classes: ["button", "primary"], attributes: { type: "submit" } })
  save.textContent = "Save"
  bar.append(remove, cancel, save)
  return bar
}
