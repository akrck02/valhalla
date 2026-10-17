import { setHomeRoute, setNotFoundRoute, setRoute, showRoute } from "./gtd/router.js"
import { applyAppearance, loadAppearance } from "./settings.js"
import { buildShell } from "./shell.js"
import { showToday } from "./views/today.js"
import { showCalendar } from "./views/calendar.js"
import { showNotes } from "./views/notes.js"
import { showComingSoon } from "./views/coming-soon.js"

applyAppearance(document.documentElement, loadAppearance(localStorage))

setHomeRoute(showToday)
setRoute("calendar/$/$", showCalendar)
setRoute("calendar", showCalendar)
setRoute("notes/$", showNotes)
setRoute("notes", showNotes)
setNotFoundRoute(showComingSoon)

function showCurrentPlace(): void {
  const path = location.hash.replace(/^#\/?/, "")
  const page = buildShell(document.body, path)
  showRoute(path, page)
}

window.addEventListener("hashchange", showCurrentPlace)
showCurrentPlace()
