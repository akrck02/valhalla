import { NoteNotFound } from "../errors.js"
import { Collection, deleteItem, loadItems, saveItems, updateItem } from "../collection/collection.js"
import { Note } from "./note.js"

const notes: Collection<Note> = { key: "valhalla.notes", isItem: isNote, notFound: NoteNotFound }

/** Reads the saved notes; an empty or damaged store gives no notes rather than breaking the app. */
export function loadNotes(storage: Storage): Note[] {
  return loadItems(storage, notes)
}

/** Saves a new note. */
export function addNote(storage: Storage, note: Note): void {
  saveItems(storage, notes, [...loadNotes(storage), note])
}

/** Saves a changed note in the place of the one with its id. */
export function updateNote(storage: Storage, note: Note): void {
  updateItem(storage, notes, note)
}

/** Deletes the note with this id. */
export function deleteNote(storage: Storage, id: string): void {
  deleteItem(storage, notes, id)
}

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const note = value as Record<string, unknown>
  return typeof note.id === "string" && typeof note.title === "string" &&
    typeof note.body === "string" && typeof note.updated === "string"
}
