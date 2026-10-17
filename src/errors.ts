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
