import { afterThis, describe, expect, it } from "./lib/test.js"
import { createTask } from "../src/tasks/task.js"
import { loadTasks, saveTasks } from "../src/tasks/store.js"
import { taskDialog, TaskDialogResult } from "../src/views/task-dialog.js"
import { memoryStorage } from "./storage.js"

/** Opens the dialog of a saved task; gives the dialog, the storage and what it closed with. */
function openDialog(title = "Plan") {
  const storage = memoryStorage()
  const task = createTask(title, "2026-10-17", "10:00")
  saveTasks(storage, [task])
  const closedWith: TaskDialogResult[] = []
  const dialog = taskDialog(task, storage, result => closedWith.push(result))
  document.body.append(dialog)
  afterThis(() => {
    dialog.close()
    dialog.remove()
  })
  dialog.showModal()
  return { dialog, storage, closedWith }
}

function button(dialog: HTMLElement, name: string): HTMLButtonElement {
  const found = [...dialog.querySelectorAll("button")].find(each => each.textContent?.trim() === name)
  if (found === undefined) {
    throw new Error(`there is no button ${name}`)
  }
  return found
}

function type(dialog: HTMLElement, id: string, value: string): void {
  ;(dialog.querySelector(`#${id}`) as HTMLInputElement).value = value
}

describe("the task dialog", () => {
  it("every field has a label and every button a name", () => {
    const { dialog } = openDialog()
    for (const input of dialog.querySelectorAll("input")) {
      expect(dialog.querySelector(`label[for="${input.id}"]`)?.textContent ?? "").toMatch(/\S/)
    }
    for (const each of dialog.querySelectorAll("button")) {
      expect(each.textContent ?? "").toMatch(/\S/)
    }
    expect(dialog.getAttribute("aria-labelledby")).toBe("task-dialog-heading")
  })

  it("shows what a person typed as text, never as markup", () => {
    const { dialog } = openDialog("<img src=x onerror=alert(1)>")
    expect((dialog.querySelector("#dialog-title") as HTMLInputElement).value).toBe("<img src=x onerror=alert(1)>")
    expect(dialog.querySelector("img")).toBe(null)
  })

  it("saving keeps the change and closes as saved", () => {
    const { dialog, storage, closedWith } = openDialog()
    type(dialog, "dialog-title", "Plan the week")
    button(dialog, "Save").click()
    expect(closedWith.join()).toBe("saved")
    expect(dialog.isConnected).toBe(false)
    expect(loadTasks(storage)[0].title).toBe("Plan the week")
  })

  it("deleting asks once more before the task is gone", () => {
    const { dialog, storage, closedWith } = openDialog()
    button(dialog, "Delete").click()
    expect(loadTasks(storage).length).toBe(1)
    button(dialog, "Delete for good").click()
    expect(closedWith.join()).toBe("deleted")
    expect(dialog.isConnected).toBe(false)
    expect(loadTasks(storage).length).toBe(0)
  })

  it("cancelling changes nothing", () => {
    const { dialog, storage, closedWith } = openDialog()
    type(dialog, "dialog-title", "Something else")
    button(dialog, "Cancel").click()
    expect(closedWith.join()).toBe("cancelled")
    expect(dialog.isConnected).toBe(false)
    expect(loadTasks(storage)[0].title).toBe("Plan")
  })
  it("a wrong edit shows its message and stays open", () => {
    const { dialog, storage, closedWith } = openDialog()
    type(dialog, "dialog-title", "   ")
    button(dialog, "Save").click()
    expect(dialog.open).toBe(true)
    expect(dialog.querySelector(".error")?.textContent).toBe("Write what there is to do.")
    expect(loadTasks(storage)[0].title).toBe("Plan")
  })
})
