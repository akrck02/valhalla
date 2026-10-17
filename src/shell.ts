import { uiComponent } from "./gtd/dom.js"
import { Html } from "./gtd/html.js"
import { icon } from "./icons.js"
import { places } from "./places.js"

/**
 * Builds the app's frame, as a sheet of paper: a header with the name and the search, an index
 * of places on the left, and the page beside it; on phones the index is a bar at the bottom.
 * Gives the page, where views draw.
 * @param body where the frame goes
 * @param currentPath the address being shown, such as "calendar/week/2026-10-12"
 * @param openSearch what the search box of the header does when pressed
 */
export function buildShell(body: HTMLElement, currentPath: string, openSearch: () => void): HTMLElement {
  const app = uiComponent({ classes: ["app"] })
  const page = uiComponent({ type: "main", id: "page", classes: ["page"] })
  const currentPlace = currentPath.split("/")[0]
  app.append(header(openSearch), sidebar(currentPlace), page, bottomBar(currentPlace))
  body.replaceChildren(app)
  return page
}

function header(openSearch: () => void): HTMLElement {
  const header = uiComponent({ type: Html.Header, classes: ["app-header"] })
  const brand = uiComponent({ type: Html.A, classes: ["brand"], attributes: { href: "#/" } })
  const logo = uiComponent({ type: "img", attributes: { src: "docs/images/logo.svg", alt: "" } })
  brand.append(logo, document.createTextNode("Valhalla"))
  header.append(brand, searchTrigger(openSearch))
  return header
}

/** Looks like a search box, but is a button that opens the search, as Ctrl K does. */
function searchTrigger(openSearch: () => void): HTMLElement {
  const trigger = uiComponent({
    type: Html.Button,
    classes: ["search-trigger"],
    attributes: { type: "button", "aria-label": "Search tasks and notes", "aria-keyshortcuts": "Control+K Meta+K" },
  })
  const label = uiComponent({ type: Html.Span, classes: ["label"] })
  label.textContent = "Search tasks and notes"
  const key = uiComponent({ type: "kbd", classes: ["key"] })
  key.textContent = navigator.platform.startsWith("Mac") ? "⌘ K" : "Ctrl K"
  trigger.append(icon("search"), label, key)
  trigger.addEventListener("click", openSearch)
  return trigger
}

/** The index of places on wide screens: each with its icon and its name. */
function sidebar(currentPlace: string): HTMLElement {
  const nav = uiComponent({ type: Html.Nav, classes: ["sidebar"], attributes: { "aria-label": "Places" } })
  for (const place of places) {
    const link = uiComponent({ type: Html.A, attributes: { href: `#/${place.path}` } })
    const name = uiComponent({ type: Html.Span })
    name.textContent = place.name
    link.append(icon(place.icon), name)
    markCurrent(link, place.path === currentPlace)
    nav.append(link)
  }
  return nav
}

/** The places on phones: icons in a bar at the bottom, each named for screen readers. */
function bottomBar(currentPlace: string): HTMLElement {
  const nav = uiComponent({ type: Html.Nav, classes: ["bottom-bar"], attributes: { "aria-label": "Places" } })
  for (const place of places) {
    const link = uiComponent({
      type: Html.A,
      classes: ["button", "ghost", "icon"],
      attributes: { href: `#/${place.path}`, "aria-label": place.name, title: place.name },
    })
    link.append(icon(place.icon))
    markCurrent(link, place.path === currentPlace)
    nav.append(link)
  }
  return nav
}

function markCurrent(link: HTMLElement, isCurrent: boolean): void {
  if (isCurrent) {
    link.setAttribute("aria-current", "page")
  }
}
