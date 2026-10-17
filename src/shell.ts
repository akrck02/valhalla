import { uiComponent } from "./gtd/dom.js"
import { Html } from "./gtd/html.js"
import { icon, IconName } from "./icons.js"

/** A place in the app, reached from the bar of icons. */
export interface Place {
  path: string
  name: string
  icon: IconName
}

/** The places of the first version; the ones not built yet are greyed out in the bars. */
export const places: Place[] = [
  { path: "", name: "Today", icon: "circleCheck" },
  { path: "calendar", name: "Calendar", icon: "calendar" },
  { path: "notes", name: "Notes", icon: "notebookPen" },
  { path: "search", name: "Search", icon: "search" },
  { path: "settings", name: "Settings", icon: "settings" },
]

/**
 * Builds the app's frame: a bar of icons on the left on wide screens, a bar at the bottom on
 * phones, and the page between them. Gives the page, where views draw.
 */
export function buildShell(body: HTMLElement, currentPath: string): HTMLElement {
  const app = uiComponent({ classes: ["app"] })
  const page = uiComponent({ type: "main", id: "page", classes: ["page"] })
  app.append(placesBar("rail", currentPath), page, placesBar("bottom-bar", currentPath))
  body.replaceChildren(app)
  return page
}

function placesBar(kind: "rail" | "bottom-bar", currentPath: string): HTMLElement {
  const bar = uiComponent({ type: Html.Nav, classes: [kind], attributes: { "aria-label": "Places" } })
  for (const place of places) {
    const link = uiComponent({
      type: Html.A,
      classes: ["button", "ghost", "icon"],
      attributes: { href: `#/${place.path}`, "aria-label": place.name, title: place.name },
    })
    if (place.path === currentPath.split("/")[0]) {
      link.setAttribute("aria-current", "page")
    }
    link.append(icon(place.icon))
    bar.append(link)
  }
  return bar
}
