import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"

/** The places that are planned but not built yet say so, instead of showing an empty page. */
export async function showComingSoon(_parameters: string[], page: HTMLElement): Promise<void> {
  const title = uiComponent({ type: Html.H1 })
  title.textContent = "Coming soon"
  const text = uiComponent({ type: Html.P, classes: ["soft"] })
  text.textContent = "This part of Valhalla is being reimagined. Today already works."
  const back = uiComponent({ type: Html.A, classes: ["button", "primary"], attributes: { href: "#/" } })
  back.textContent = "Back to today"
  page.replaceChildren(title, text, back)
}
