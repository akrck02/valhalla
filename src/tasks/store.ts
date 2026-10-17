import { TaskNotFound } from "../errors.js"
import { Collection, deleteItem, loadItems, saveItems, updateItem } from "../collection/collection.js"
import { Task } from "./task.js"

const tasks: Collection<Task> = { key: "valhalla.tasks", isItem: isTask, notFound: TaskNotFound }

/** Reads the saved tasks; an empty or damaged store gives no tasks rather than breaking the app. */
export function loadTasks(storage: Storage): Task[] {
  return loadItems(storage, tasks)
}

/** Saves every task. */
export function saveTasks(storage: Storage, all: Task[]): void {
  saveItems(storage, tasks, all)
}

/** Saves a changed task in the place of the one with its id. */
export function updateTask(storage: Storage, task: Task): void {
  updateItem(storage, tasks, task)
}

/** Deletes the task with this id. */
export function deleteTask(storage: Storage, id: string): void {
  deleteItem(storage, tasks, id)
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const task = value as Record<string, unknown>
  return typeof task.id === "string" && typeof task.title === "string" &&
    typeof task.day === "string" && typeof task.done === "boolean"
}
