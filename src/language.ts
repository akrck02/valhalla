import { dateOf } from "./calendar/calendar.js"

/**
 * The language the app is written in, from <html lang>. Dates are written in it too, so a page
 * never mixes two languages, whatever the browser's own.
 */
export const language = document.documentElement.lang || "en"

/** Writes a day, YYYY-MM-DD, whole: "Sunday, 18 October". */
export function longDay(day: string): string {
  return new Intl.DateTimeFormat(language, { weekday: "long", day: "numeric", month: "long" }).format(dateOf(day))
}
