import { setHomeRoute, setNotFoundRoute, setRoute, showRoute } from "./gtd/router.js"
import { applyAppearance, loadAppearance } from "./settings.js"
import { buildShell } from "./shell.js"
import { showToday } from "./views/today.js"
import { showCalendar } from "./views/calendar.js"
import { showNotes } from "./views/notes.js"
import { openSearchDialog, showSearch } from "./views/search.js"
import { showSettings } from "./views/settings.js"
import { showComingSoon } from "./views/coming-soon.js"

applyAppearance(document.documentElement, loadAppearance(localStorage))

setHomeRoute(showToday)
setRoute("calendar/$/$", showCalendar)
setRoute("calendar", showCalendar)
setRoute("notes/$", showNotes)
setRoute("notes", showNotes)
setRoute("search", showSearch)
setRoute("settings", showSettings)
setNotFoundRoute(showComingSoon)

function showCurrentPlace(): void {
  const path = location.hash.replace(/^#\/?/, "")
  const page = buildShell(document.body, path, openSearchDialog)
  showRoute(path, page)
}

window.addEventListener("hashchange", showCurrentPlace)
showCurrentPlace()

// Ctrl K, or ⌘K on a Mac, opens the search from anywhere, as in many editors and apps.
window.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault()
    openSearchDialog()
  }
})
