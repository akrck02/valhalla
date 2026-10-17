import { InvalidDay, InvalidTime, TaskWithoutTitle, ValhallaError } from "../errors.js"

/** Something to do on a day, maybe at a time. */
export interface Task {
  id: string
  title: string
  day: string // YYYY-MM-DD, in the person's own time zone
  time?: string // HH:MM; tasks without one are for any time that day
  done: boolean
}

const dayPattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

/** Makes a new task, checking what the person typed. */
export function createTask(title: string, day: string, time?: string): Task {
  const trimmedTitle = title.trim()
  if (trimmedTitle === "") {
    throw new ValhallaError(TaskWithoutTitle, "write what there is to do")
  }
  if (!dayPattern.test(day)) {
    throw new ValhallaError(InvalidDay, `${day} is not a day written as YYYY-MM-DD`)
  }
  if (time !== undefined && time !== "" && !timePattern.test(time)) {
    throw new ValhallaError(InvalidTime, `${time} is not a time written as HH:MM`)
  }
  return {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    day: day,
    time: time === "" ? undefined : time,
    done: false,
  }
}

/** Gives the task with its check box changed; the list it came from stays as it was. */
export function withDoneSwitched(task: Task): Task {
  return { ...task, done: !task.done }
}

/**
 * Gives the tasks of one day in the order to show them: what is left first, by time, then the
 * tasks without a time; what is done goes last.
 */
export function tasksOfDay(tasks: Task[], day: string): Task[] {
  return tasks.filter(task => task.day === day).sort(compareForToday)
}

function compareForToday(first: Task, second: Task): number {
  if (first.done !== second.done) {
    return first.done ? 1 : -1
  }
  const firstTime = first.time ?? "99:99"
  const secondTime = second.time ?? "99:99"
  return firstTime.localeCompare(secondTime)
}

/** Writes a date as the YYYY-MM-DD of the person's own time zone. */
export function dayOf(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const dayOfMonth = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${dayOfMonth}`
}
