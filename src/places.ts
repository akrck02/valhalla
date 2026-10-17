import { IconName } from "./icons.js"

/** A place in the app, reached from the index or the bar at the bottom. */
export interface Place {
  path: string
  name: string
  icon: IconName
}

/** The places of the app, in the order the index shows them. */
export const places: Place[] = [
  { path: "", name: "Today", icon: "circleCheck" },
  { path: "calendar", name: "Calendar", icon: "calendar" },
  { path: "notes", name: "Notes", icon: "notebookPen" },
  { path: "search", name: "Search", icon: "search" },
  { path: "settings", name: "Settings", icon: "settings" },
]
