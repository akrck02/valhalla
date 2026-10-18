import { uiComponent } from "./gtd/dom.js"
import { Html } from "./gtd/html.js"
import { icon } from "./icons.js"
import { Place, places } from "./places.js"

/**
 * Builds the app's frame: an index on the left, with the name on top and the places under it, and
 * the page beside it; on phones the index is a bar at the bottom. There is no header: the search
 * opens from anywhere with Ctrl K or ⌘K, and from Search in the index. Gives the page, where views
 * draw.
 * @param body where the frame goes
 * @param currentPath the address being shown, such as "calendar/week/2026-10-12"
 */
export function buildShell(body: HTMLElement, currentPath: string): HTMLElement {
  const app = uiComponent({ classes: ["app"] })
  const page = uiComponent({ type: "main", id: "page", classes: ["page"] })
  const currentPlace = currentPath.split("/")[0]
  const wallpaper = uiComponent({ classes: ["wallpaper"], attributes: { "aria-hidden": "true" } })
  app.append(sidebar(currentPlace), page, bottomBar(currentPlace))
  body.replaceChildren(wallpaper, app)
  return page
}

/**
 * The index on wide screens, a pane: the name on top, then each place with its icon and its name,
 * and the search at its foot, where it is always at hand.
 */
function sidebar(currentPlace: string): HTMLElement {
  const sidebar = uiComponent({ classes: ["sidebar"] })
  const brand = uiComponent({ type: Html.A, classes: ["brand"], attributes: { href: "#/", "aria-label": "Valhalla, today" } })
  const logo = uiComponent({ type: "img", attributes: { src: "docs/images/logo.svg", alt: "" } })
  const name = uiComponent({ type: Html.Span })
  name.textContent = "Valhalla"
  brand.append(logo, name)
  const nav = uiComponent({ type: Html.Nav, classes: ["places"], attributes: { "aria-label": "Places" } })
  const foot = uiComponent({ type: Html.Nav, classes: ["places", "sidebar-foot"], attributes: { "aria-label": "Search" } })
  for (const place of places) {
    const link = placeLink(place)
    markCurrent(link, place.path === currentPlace)
    if (place.path !== "search") {
      nav.append(link)
      continue
    }
    link.setAttribute("aria-keyshortcuts", "Control+K Meta+K")
    link.append(shortcutKey())
    foot.append(link)
  }
  sidebar.append(brand, nav, foot)
  return sidebar
}

/** A place of the index: its icon and its name. */
function placeLink(place: Place): HTMLElement {
  const link = uiComponent({ type: Html.A, attributes: { href: `#/${place.path}` } })
  const placeName = uiComponent({ type: Html.Span })
  placeName.textContent = place.name
  link.append(icon(place.icon), placeName)
  return link
}

/** The search's shortcut, shown beside it so it can be found; ⌘ on a Mac, Ctrl elsewhere. */
function shortcutKey(): HTMLElement {
  const key = uiComponent({ type: "kbd", classes: ["key"], attributes: { "aria-hidden": "true" } })
  key.textContent = navigator.platform.startsWith("Mac") ? "⌘K" : "Ctrl K"
  return key
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
