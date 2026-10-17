import { InvalidDay, InvalidTime, NoteEmpty, NoteNotFound, TaskNotFound, TaskWithoutTitle, ValhallaError } from "../errors.js"

/** Says what went wrong in words a person understands, chosen by the error's code. */
export function messageFor(problem: ValhallaError): string {
  switch (problem.code) {
    case TaskWithoutTitle:
      return "Write what there is to do."
    case InvalidDay:
      return "Choose a day."
    case InvalidTime:
      return "Write the time as hours and minutes, such as 16:30."
    case TaskNotFound:
      return "This task is gone; it may have been deleted in another tab."
    case NoteEmpty:
      return "Write a title or some text."
    case NoteNotFound:
      return "This note is gone; it may have been deleted in another tab."
    default:
      return problem.message
  }
}

/**
 * Runs an action and shows its error in the error line, if it fails with a ValhallaError.
 * @returns whether the action worked
 */
export function tryShowingError(error: HTMLElement, action: () => void): boolean {
  try {
    action()
  } catch (problem) {
    if (!(problem instanceof ValhallaError)) {
      throw problem
    }
    error.textContent = messageFor(problem)
    return false
  }
  return true
}
