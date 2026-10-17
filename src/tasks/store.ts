import { TaskNotFound, ValhallaError } from "../errors.js"
import { Task } from "./task.js"

/** Where the tasks are kept: the browser's own storage, so they never leave the computer. */
const storageKey = "valhalla.tasks"

/** Reads the saved tasks; an empty or damaged store gives no tasks rather than breaking the app. */
export function loadTasks(storage: Storage): Task[] {
  const saved = storage.getItem(storageKey)
  if (saved === null) {
    return []
  }
  try {
    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter(isTask) : []
  } catch {
    return [] // a damaged store is lost, not fatal: the next save writes a good one
  }
}

/** Saves every task. */
export function saveTasks(storage: Storage, tasks: Task[]): void {
  storage.setItem(storageKey, JSON.stringify(tasks))
}

/** Saves a changed task in the place of the one with its id. */
export function updateTask(storage: Storage, task: Task): void {
  const tasks = loadTasks(storage)
  const index = indexOf(tasks, task.id)
  tasks[index] = task
  saveTasks(storage, tasks)
}

/** Deletes the task with this id. */
export function deleteTask(storage: Storage, id: string): void {
  const tasks = loadTasks(storage)
  tasks.splice(indexOf(tasks, id), 1)
  saveTasks(storage, tasks)
}

function indexOf(tasks: Task[], id: string): number {
  const index = tasks.findIndex(task => task.id === id)
  if (index === -1) {
    throw new ValhallaError(TaskNotFound, `there is no task ${id}`)
  }
  return index
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const task = value as Record<string, unknown>
  return typeof task.id === "string" && typeof task.title === "string" &&
    typeof task.day === "string" && typeof task.done === "boolean"
}
