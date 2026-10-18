// The Lucide icons the app uses, read as text by esbuild (--loader:.svg=text).
// Lucide is ISC licensed, some icons MIT from Feather: resources/icons/LICENSE.
import calendar from "../resources/icons/calendar.svg"
import chevronLeft from "../resources/icons/chevron-left.svg"
import chevronRight from "../resources/icons/chevron-right.svg"
import circleCheck from "../resources/icons/circle-check.svg"
import moon from "../resources/icons/moon.svg"
import notebookPen from "../resources/icons/notebook-pen.svg"
import pencil from "../resources/icons/pencil.svg"
import plus from "../resources/icons/plus.svg"
import search from "../resources/icons/search.svg"
import settings from "../resources/icons/settings.svg"
import sun from "../resources/icons/sun.svg"
import trash from "../resources/icons/trash.svg"
import x from "../resources/icons/x.svg"

const icons = { calendar, chevronLeft, chevronRight, circleCheck, moon, notebookPen, pencil, plus, search, settings, sun, trash, x }

/** The name of an icon the app knows. */
export type IconName = keyof typeof icons

/** Gives an icon as an element that screen readers skip: the control around it carries the name. */
export function icon(name: IconName): SVGElement {
  const holder = document.createElement("span")
  holder.innerHTML = icons[name] // the app's own files, never what a person typed
  const svg = holder.querySelector("svg") as SVGElement
  svg.setAttribute("aria-hidden", "true")
  svg.setAttribute("focusable", "false")
  return svg
}
