import { uiComponent } from "../gtd/dom.js"
import { language } from "../language.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { createNote, editedNote, nameOf, Note, notesByRecent } from "../notes/note.js"
import { addNote, deleteNote, loadNotes, updateNote } from "../notes/store.js"
import { field, textArea, valueOf } from "./form.js"
import { tryShowingError } from "./messages.js"
import { deleteButton } from "./delete-button.js"
import { focusIn } from "./focus.js"
import { floatingButton } from "../shell.js"

/** The address of a note that is being written for the first time. */
const newNote = "new"

/** How much of a note's text its card shows on the wall. */
const excerptLength = 180

/**
 * Notes: a wall of cards, most recent first, as the first Valhalla pinned them; a note opens on a
 * page of its own. Its address says what is shown: #/notes for the wall, #/notes/new or
 * #/notes/<id> for one note.
 */
export async function showNotes(parameters: string[], page: HTMLElement): Promise<void> {
  const [opened] = parameters
  const notes = notesByRecent(loadNotes(localStorage))
  const note = notes.find(each => each.id === opened)
  page.classList.add("wide")
  if (opened === newNote || note !== undefined) {
    page.replaceChildren(editor(note))
    // Drawn from a link, the page would leave the focus nowhere: put it where the person writes.
    focusIn(page, note === undefined ? "#note-title" : "#note-body")
    return
  }
  const isFirstDraw = page.childElementCount === 0
  page.replaceChildren(...wall(notes, opened !== undefined && opened !== "", isFirstDraw), writeButton())
}

function wall(notes: Note[], wasMissing: boolean, appears: boolean): HTMLElement[] {
  const heading = uiComponent({ type: Html.H1, id: "notes-heading" })
  heading.textContent = "Notes"
  const parts: HTMLElement[] = [heading]
  if (wasMissing) {
    const gone = uiComponent({ type: Html.P, classes: ["error"], attributes: { role: "alert" } })
    gone.textContent = "This note is gone; it may have been deleted in another tab."
    parts.push(gone)
  }
  if (notes.length === 0) {
    const empty = uiComponent({ type: Html.P, classes: ["soft"] })
    empty.textContent = "No notes yet. Write the first one with the + button."
    return [...parts, empty]
  }
  const list = uiComponent({ type: Html.Ul, classes: appears ? ["note-wall", "appear"] : ["note-wall"], attributes: { "aria-labelledby": "notes-heading" } })
  for (const note of notes) {
    list.append(noteCard(note))
  }
  return [...parts, list]
}

/** A note on the wall: its name, the start of its text and when it changed; all of it a link. */
function noteCard(note: Note): HTMLElement {
  const item = uiComponent({ type: Html.Li })
  const link = uiComponent({ type: Html.A, id: `note-${note.id}`, classes: ["note-card"], attributes: { href: `#/notes/${note.id}` } })
  const name = uiComponent({ type: Html.Span, classes: ["title"] })
  name.textContent = nameOf(note) // what a person typed is always text, never markup
  const excerpt = uiComponent({ type: Html.Span, classes: ["excerpt"] })
  excerpt.textContent = excerptOf(note)
  const when = uiComponent({ type: Html.Span, classes: ["quiet"] })
  when.textContent = changedOn(note)
  link.append(name, excerpt, when)
  item.append(link)
  return item
}

function excerptOf(note: Note): string {
  const text = note.title === "" ? note.body.trim().split("\n").slice(1).join(" ") : note.body.trim()
  return text.length > excerptLength ? `${text.slice(0, excerptLength).trimEnd()}…` : text
}

function writeButton(): HTMLElement {
  return floatingButton("Write a note", () => {
    location.hash = `#/notes/${newNote}`
  })
}

/** The open note, as a form: a title, the text, and buttons to save or delete it. */
function editor(note: Note | undefined): HTMLElement {
  const form = uiComponent({ type: Html.Form, classes: ["note-editor"], attributes: { "aria-label": note === undefined ? "New note" : "Edit the note" } }) as HTMLFormElement
  const back = uiComponent({ type: Html.A, classes: ["button", "ghost", "back"], attributes: { href: "#/notes" } })
  back.append(icon("chevronLeft"), document.createTextNode("All notes"))
  const message = uiComponent({ type: Html.P, classes: ["error"], attributes: { role: "alert" } })
  const status = uiComponent({ type: Html.P, classes: ["quiet"], attributes: { role: "status" } })
  const actions = uiComponent({ classes: ["dialog-actions"] })
  if (note !== undefined) {
    actions.append(deleteButton("this note", message, () => {
      if (tryShowingError(message, () => deleteNote(localStorage, note.id))) {
        location.hash = "#/notes"
      }
    }))
  }
  const save = uiComponent({ type: Html.Button, classes: ["button", "primary"], attributes: { type: "submit", title: "Save (Ctrl S)" } })
  save.textContent = "Save"
  actions.append(save)
  form.append(back, field("note-title", "Title", "text", note?.title ?? ""), textArea("note-body", "Text", note?.body ?? ""), message, status, actions)

  let saved = note
  form.addEventListener("submit", event => {
    event.preventDefault()
    message.textContent = ""
    if (saved === undefined) {
      addFrom(form, message)
      return
    }
    saved = updateFrom(form, saved, message, status) ?? saved
  })
  form.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault() // the browser would save the page instead
      form.requestSubmit()
    }
  })
  return form
}

/** Saves a new note from the form and opens it at its own address. */
function addFrom(form: HTMLElement, message: HTMLElement): void {
  let created: Note | undefined
  const worked = tryShowingError(message, () => {
    created = createNote(valueOf(form, "note-title"), valueOf(form, "note-body"))
    addNote(localStorage, created)
  })
  if (worked && created !== undefined) {
    location.hash = `#/notes/${created.id}`
  }
}

/**
 * Saves the changes of an open note, and says when.
 * @returns the note as saved, or nothing if it could not be saved
 */
function updateFrom(form: HTMLElement, note: Note, message: HTMLElement, status: HTMLElement): Note | undefined {
  let changed: Note | undefined
  const worked = tryShowingError(message, () => {
    changed = editedNote(note, valueOf(form, "note-title"), valueOf(form, "note-body"))
    updateNote(localStorage, changed)
  })
  if (!worked || changed === undefined) {
    return undefined
  }
  status.textContent = `Saved at ${new Intl.DateTimeFormat(language, { timeStyle: "short" }).format(new Date(changed.updated))}.`
  return changed
}

function changedOn(note: Note): string {
  return new Intl.DateTimeFormat(language, { day: "numeric", month: "short", year: "numeric" }).format(new Date(note.updated))
}
