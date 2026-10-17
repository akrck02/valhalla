import { Task } from "../tasks/task.js"
import { nameOf, Note } from "../notes/note.js"

/** What a search can find. */
export type ResultKind = "place" | "task" | "note"

/** One thing found, with where to go to see it. */
export interface SearchResult {
  kind: ResultKind
  label: string
  detail: string
  href: string // an address in the app, such as #/notes/<id>
}

/** A place of the app, as the search sees it. */
export interface SearchPlace {
  name: string
  path: string
}

/** Everything a search looks through. */
export interface SearchSources {
  places: SearchPlace[]
  tasks: Task[]
  notes: Note[]
}

/** How many results of each kind are shown, so one kind never hides the others. */
export const resultsPerKind = 5

/**
 * Finds the places, tasks and notes that hold every word of a query, best first: what starts
 * with the query, then what holds it in its name, then what holds it anywhere. Capitals and
 * accents don't matter: "cafe" finds "Café". An empty query gives the places.
 */
export function searchEverything(query: string, sources: SearchSources): SearchResult[] {
  const words = normalized(query).split(/\s+/).filter(word => word !== "")
  const places = sources.places.map(place => ({
    result: { kind: "place" as const, label: place.name, detail: "Go to", href: `#/${place.path}` },
    name: place.name, text: place.name,
  }))
  const tasks = sources.tasks.map(task => ({
    result: { kind: "task" as const, label: task.title, detail: task.time === undefined ? task.day : `${task.day} ${task.time}`, href: `#/calendar/week/${task.day}` },
    name: task.title, text: task.title,
  }))
  const notes = sources.notes.map(note => ({
    result: { kind: "note" as const, label: nameOf(note), detail: firstLineAfterName(note), href: `#/notes/${note.id}` },
    name: nameOf(note), text: `${note.title}\n${note.body}`,
  }))
  if (words.length === 0) {
    return places.map(place => place.result)
  }
  return [places, tasks, notes].flatMap(candidates => candidates
    .map(candidate => ({ result: candidate.result, score: scoreOf(words, candidate.name, candidate.text) }))
    .filter(scored => scored.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, resultsPerKind)
    .map(scored => scored.result))
}

/** Writes a text in lower case without accents, so searches don't depend on how it was typed. */
export function normalized(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
}

const startsWithScore = 3
const nameHoldsScore = 2
const textHoldsScore = 1

/** Scores how well a name and text match the words; 0 when a word is missing. */
function scoreOf(words: string[], name: string, text: string): number {
  const normalizedName = normalized(name)
  const normalizedText = normalized(text)
  if (!words.every(word => normalizedText.includes(word) || normalizedName.includes(word))) {
    return 0
  }
  if (normalizedName.startsWith(words[0])) {
    return startsWithScore
  }
  return words.every(word => normalizedName.includes(word)) ? nameHoldsScore : textHoldsScore
}

function firstLineAfterName(note: Note): string {
  const lines = note.body.trim().split("\n")
  return note.title !== "" ? lines[0] : lines[1] ?? ""
}
