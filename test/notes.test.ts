import { describe, expect, it } from "./lib/test.js"
import { createNote, editedNote, nameOf, notesByRecent, notesTagged, tagsOf } from "../src/notes/note.js"
import { addNote, deleteNote, loadNotes, updateNote } from "../src/notes/store.js"
import { NoteEmpty, NoteNotFound, ValhallaError } from "../src/errors.js"
import { memoryStorage } from "./storage.js"

function codeOf(make: () => unknown): string {
  try {
    make()
  } catch (error) {
    return error instanceof ValhallaError ? error.code : "not a ValhallaError"
  }
  return "no error"
}

const morning = new Date("2026-10-17T09:00:00Z")
const evening = new Date("2026-10-17T19:00:00Z")

describe("notes", () => {
  it("a note needs a title or some text, and either is enough", () => {
    expect(codeOf(() => createNote("  ", "\n "))).toBe(NoteEmpty)
    expect(createNote("Ideas", "").title).toBe("Ideas")
    expect(createNote("", "Only text").body).toBe("Only text")
  })

  it("a note without a title is named by the first line of its text", () => {
    expect(nameOf(createNote("", "\nFirst line\nSecond line"))).toBe("First line")
    expect(nameOf(createNote("Title", "Text"))).toBe("Title")
  })

  it("an edited note keeps its id, takes the new time, and the old one stays as it was", () => {
    const note = createNote("Ideas", "One", morning)
    const edited = editedNote(note, "Ideas", "One and two", evening)
    expect(edited.id).toBe(note.id)
    expect(edited.updated).toBe(evening.toISOString())
    expect(note.body).toBe("One")
    expect(codeOf(() => editedNote(note, "", ""))).toBe(NoteEmpty)
  })

  it("the most recently changed notes come first", () => {
    const older = createNote("Older", "", morning)
    const newer = createNote("Newer", "", evening)
    expect(notesByRecent([older, newer]).map(nameOf).join()).toBe("Newer,Older")
  })
})

describe("the notes store", () => {
  it("notes are added, changed and deleted, and the others stay", () => {
    const storage = memoryStorage()
    const first = createNote("First", "")
    const second = createNote("Second", "")
    addNote(storage, first)
    addNote(storage, second)
    updateNote(storage, editedNote(first, "First, changed", ""))
    deleteNote(storage, second.id)
    expect(loadNotes(storage).map(nameOf).join()).toBe("First, changed")
  })

  it("changing or deleting a note that is not there fails with its code", () => {
    const storage = memoryStorage()
    const missing = createNote("Missing", "")
    expect(codeOf(() => updateNote(storage, missing))).toBe(NoteNotFound)
    expect(codeOf(() => deleteNote(storage, missing.id))).toBe(NoteNotFound)
  })

  it("a damaged store gives no notes instead of breaking", () => {
    const storage = memoryStorage()
    storage.setItem("valhalla.notes", "[{\"id\": 1}, \"nonsense\"")
    expect(loadNotes(storage).length).toBe(0)
  })

  it("a note's tags are the words written with a # in it, once each and in small letters", () => {
    const note = createNote("Garden #Plans", "Seeds after the frost. #garden #spring, and #garden again")
    expect(tagsOf(note).join()).toBe("plans,garden,spring")
    expect(tagsOf(createNote("", "A # alone, and an email@#example are no tags")).join()).toBe("")
  })

  it("notes tagged with a word are those that write it with a #", () => {
    const garden = createNote("Plan", "#garden")
    const soup = createNote("Soup", "leeks")
    expect(notesTagged([garden, soup], "garden").map(note => note.title).join()).toBe("Plan")
  })
})
