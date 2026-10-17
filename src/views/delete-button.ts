import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"

/**
 * Makes a delete button that asks twice, so a slip loses nothing: the first press changes it to
 * "Delete for good" and says so in the message line; the second one deletes.
 * @param what what is deleted, as in "Press again to delete this task."
 * @param message the line where the question is said; a live region, so it is heard too
 * @param remove called on the second press
 */
export function deleteButton(what: string, message: HTMLElement, remove: () => void): HTMLElement {
  const button = uiComponent({ type: Html.Button, classes: ["button", "danger"], attributes: { type: "button" } })
  const label = document.createTextNode("Delete")
  button.append(icon("trash"), label)
  let asked = false
  button.addEventListener("click", () => {
    if (!asked) {
      asked = true
      label.textContent = "Delete for good"
      message.textContent = `Press again to delete ${what}.`
      return
    }
    remove()
  })
  return button
}
