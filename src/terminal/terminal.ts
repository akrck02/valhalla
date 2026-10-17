import { InvalidArgument, MissingArgument, UnknownCommand, ValhallaError } from "../errors.js"
import { addDays, isDay } from "../calendar/calendar.js"
import { createTask } from "../tasks/task.js"
import { loadTasks, saveTasks } from "../tasks/store.js"
import { createNote } from "../notes/note.js"
import { addNote } from "../notes/store.js"
import { Appearance } from "../settings.js"

/** A command the terminal understands, read from what was typed. */
export type Command =
  | { name: "go", path: string }
  | { name: "task", title: string, day: string, time?: string }
  | { name: "note", title: string }
  | { name: "mode", mode: Appearance["mode"] }
  | { name: "help" }
  | { name: "clear" }

/** What the terminal can reach: the tasks and notes, the address and the look of the app. */
export interface TerminalContext {
  storage: Storage
  today: string // YYYY-MM-DD
  places: { name: string, path: string }[]
  go: (href: string) => void
  setMode: (mode: Appearance["mode"]) => void
}

/** One line of help per command, also shown by the help command. */
export const commandHelp = [
  "go <place>                       open a place: today, calendar, notes, settings",
  "task <title> [day] [HH:MM]       add a task; the day is today, tomorrow or YYYY-MM-DD",
  "note <title>                     write a new note and open it",
  "mode <light|dark|system>         change the light of the app",
  "clear                            empty the terminal",
  "help                             show this list",
]

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/
const modes: Appearance["mode"][] = ["light", "dark", "system"]

/**
 * Reads a line typed in the terminal.
 * @example readCommand("task Buy bread tomorrow 10:00", "2026-10-17")
 *   // { name: "task", title: "Buy bread", day: "2026-10-18", time: "10:00" }
 */
export function readCommand(line: string, today: string): Command {
  const [name = "", ...words] = line.trim().split(/\s+/)
  switch (name.toLowerCase()) {
    case "go":
      return { name: "go", path: required(words, "go needs a place, such as: go notes").toLowerCase() }
    case "task":
      return readTask(words, today)
    case "note":
      return { name: "note", title: required(words, "note needs a title, such as: note Ideas") }
    case "mode":
      return readMode(required(words, "mode needs light, dark or system"))
    case "help":
      return { name: "help" }
    case "clear":
      return { name: "clear" }
    default:
      throw new ValhallaError(UnknownCommand, `there is no command ${name}; try help`)
  }
}

function required(words: string[], meaning: string): string {
  if (words.length === 0) {
    throw new ValhallaError(MissingArgument, meaning)
  }
  return words.join(" ")
}

/** Reads "task <title> [day] [HH:MM]": the time and the day are taken from the end, if there. */
function readTask(words: string[], today: string): Command {
  const rest = [...words]
  const time = rest.length > 0 && timePattern.test(rest[rest.length - 1]) ? rest.pop() : undefined
  const last = rest.length > 1 ? rest[rest.length - 1].toLowerCase() : ""
  let day = today
  if (last === "today" || last === "tomorrow" || isDay(last)) {
    rest.pop()
    day = last === "today" ? today : last === "tomorrow" ? addDays(today, 1) : last
  }
  return { name: "task", title: required(rest, "task needs a title, such as: task Buy bread tomorrow 10:00"), day, time }
}

function readMode(word: string): Command {
  const mode = modes.find(each => each === word.toLowerCase())
  if (mode === undefined) {
    throw new ValhallaError(InvalidArgument, `${word} is not a mode; use light, dark or system`)
  }
  return { name: "mode", mode }
}

/**
 * Runs a command and gives the lines it answers with. The clear command answers nothing: the
 * terminal empties itself.
 */
export function runCommand(command: Command, context: TerminalContext): string[] {
  switch (command.name) {
    case "go":
      return go(command.path, context)
    case "task": {
      const task = createTask(command.title, command.day, command.time)
      saveTasks(context.storage, [...loadTasks(context.storage), task])
      return [`Added "${task.title}" on ${task.day}${task.time === undefined ? "" : ` at ${task.time}`}.`]
    }
    case "note": {
      const note = createNote(command.title, "")
      addNote(context.storage, note)
      context.go(`#/notes/${note.id}`)
      return [`Wrote the note "${note.title}".`]
    }
    case "mode":
      context.setMode(command.mode)
      return [`The app now follows ${command.mode === "system" ? "the system's light" : `${command.mode} mode`}.`]
    case "help":
      return commandHelp
    case "clear":
      return []
  }
}

function go(path: string, context: TerminalContext): string[] {
  const place = context.places.find(each => each.name.toLowerCase() === path || each.path === path)
  if (place === undefined) {
    throw new ValhallaError(InvalidArgument, `there is no place ${path}; try: ${context.places.map(each => each.name.toLowerCase()).join(", ")}`)
  }
  context.go(`#/${place.path}`)
  return [`Opened ${place.name}.`]
}
