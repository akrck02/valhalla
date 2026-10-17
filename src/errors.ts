/** An error with a stable code that the program checks and people can search for. */
export class ValhallaError extends Error {
  readonly code: string

  constructor(code: string, meaning: string) {
    super(`${code}: ${meaning}`)
    this.code = code
  }
}

/** A task needs a title. */
export const TaskWithoutTitle = "tasks.without-title"

/** A day is written as YYYY-MM-DD. */
export const InvalidDay = "tasks.invalid-day"

/** A time is written as HH:MM, from 00:00 to 23:59. */
export const InvalidTime = "tasks.invalid-time"

/** The task to change or delete is not in the store; it may have been deleted in another tab. */
export const TaskNotFound = "tasks.not-found"

/** A note needs a title or some text. */
export const NoteEmpty = "notes.empty"

/** The note to change or delete is not in the store; it may have been deleted in another tab. */
export const NoteNotFound = "notes.not-found"

/** The terminal knows no command with that name. */
export const UnknownCommand = "terminal.unknown-command"

/** A command needs something that was not written, such as the title of a task. */
export const MissingArgument = "terminal.missing-argument"

/** A command was given something it cannot use, such as a place that does not exist. */
export const InvalidArgument = "terminal.invalid-argument"
