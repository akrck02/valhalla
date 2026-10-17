import { setHomeRoute, setNotFoundRoute, setRoute, showRoute } from "./gtd/router.js"
import { applyAppearance, loadAppearance } from "./settings.js"
import { buildShell } from "./shell.js"
import { showToday } from "./views/today.js"
import { showCalendar } from "./views/calendar.js"
import { showComingSoon } from "./views/coming-soon.js"

applyAppearance(document.documentElement, loadAppearance(localStorage))

setHomeRoute(showToday)
setRoute("calendar/$/$", showCalendar)
setRoute("calendar", showCalendar)
setNotFoundRoute(showComingSoon)

function showCurrentPlace(): void {
  const path = location.hash.replace(/^#\/?/, "")
  const page = buildShell(document.body, path)
  showRoute(path, page)
}

window.addEventListener("hashchange", showCurrentPlace)
showCurrentPlace()
