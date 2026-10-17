import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"

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

/** Makes a labelled box for longer text, such as the body of a note. */
export function textArea(id: string, label: string, value = ""): HTMLElement {
  const wrapper = uiComponent({ classes: ["field"] })
  const labelElement = uiComponent({ type: Html.Label, attributes: { for: id } })
  labelElement.textContent = label
  const area = uiComponent({ type: Html.Textarea, id: id, attributes: { name: id } }) as HTMLTextAreaElement
  area.value = value
  wrapper.append(labelElement, area)
  return wrapper
}

/** Gives the value of the input with this id inside a form. */
export function valueOf(form: HTMLElement, id: string): string {
  return (form.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement).value
}
