import { NoteEmpty, ValhallaError } from "../errors.js"

/** Something written down to keep: a title, some plain text, and when it last changed. */
export interface Note {
  id: string
  title: string
  body: string
  updated: string // an ISO 8601 moment, such as 2026-10-17T09:30:00.000Z
}

/** Makes a new note, checking that it has a title or some text. */
export function createNote(title: string, body: string, now = new Date()): Note {
  return { id: crypto.randomUUID(), ...checkedFields(title, body), updated: now.toISOString() }
}

/** Gives the note with a new title and text; it keeps its id, and the old one stays as it was. */
export function editedNote(note: Note, title: string, body: string, now = new Date()): Note {
  return { ...note, ...checkedFields(title, body), updated: now.toISOString() }
}

function checkedFields(title: string, body: string): Pick<Note, "title" | "body"> {
  const trimmedTitle = title.trim()
  if (trimmedTitle === "" && body.trim() === "") {
    throw new ValhallaError(NoteEmpty, "write a title or some text")
  }
  return { title: trimmedTitle, body: body }
}

/** Gives the name to show for a note: its title, or the first line of its text. */
export function nameOf(note: Note): string {
  return note.title !== "" ? note.title : note.body.trim().split("\n")[0]
}

/** Gives the notes with the most recently changed first; the list it came from stays as it was. */
export function notesByRecent(notes: Note[]): Note[] {
  return [...notes].sort((first, second) => second.updated.localeCompare(first.updated))
}

/** A tag: a word written right after a #, at the start of the text or after a space. */
const tagPattern = /(?:^|\s)#([\p{L}\p{N}_-]+)/gu

/**
 * Gives the tags a note writes, in the order they first appear, once each and in small letters.
 * @example tagsOf(createNote("Garden #Plans", "#garden #spring")) // ["plans", "garden", "spring"]
 */
export function tagsOf(note: Note): string[] {
  const words = [...`${note.title} ${note.body}`.matchAll(tagPattern)].map(match => match[1].toLowerCase())
  return [...new Set(words)]
}

/** Gives the notes that write a tag; the list it came from stays as it was. */
export function notesTagged(notes: Note[], tag: string): Note[] {
  return notes.filter(note => tagsOf(note).includes(tag))
}
