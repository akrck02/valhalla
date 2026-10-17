import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { InvalidDay, InvalidTime, TaskNotFound, TaskWithoutTitle, ValhallaError } from "../errors.js"

/** Makes a labelled field; the label is tied to the input, so the input has a name. */
export function field(id: string, label: string, type: string, value = ""): HTMLElement {
  const wrapper = uiComponent({ classes: ["field"] })
  const labelElement = uiComponent({ type: Html.Label, attributes: { for: id } })
  labelElement.textContent = label
  const input = uiComponent({ type: Html.Input, id: id, attributes: { type: type, name: id } }) as HTMLInputElement
  input.value = value // what a person typed is always a value, never markup
  wrapper.append(labelElement, input)
  return wrapper
}

/** Gives the value of the input with this id inside a form. */
export function valueOf(form: HTMLElement, id: string): string {
  return (form.querySelector(`#${id}`) as HTMLInputElement).value
}

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
