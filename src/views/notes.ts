import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { createNote, editedNote, nameOf, Note, notesByRecent } from "../notes/note.js"
import { addNote, deleteNote, loadNotes, updateNote } from "../notes/store.js"
import { field, textArea, valueOf } from "./form.js"
import { tryShowingError } from "./messages.js"
import { deleteButton } from "./delete-button.js"
import { focusIn } from "./focus.js"

/** The address of a note that is being written for the first time. */
const newNote = "new"

/**
 * Notes: the list of notes, most recent first, and the one open beside it. Its address says which
 * one is open: #/notes/new, #/notes/<id>, or #/notes for none. On a phone only one of the two
 * shows: the list, or the open note with a link back.
 */
export async function showNotes(parameters: string[], page: HTMLElement): Promise<void> {
  const [opened] = parameters
  const notes = notesByRecent(loadNotes(localStorage))
  const note = notes.find(each => each.id === opened)
  const isOpen = opened === newNote || note !== undefined
  page.classList.add("wide")

  const layout = uiComponent({ classes: isOpen ? ["notes", "open"] : ["notes"] })
  layout.append(notesList(notes, opened))
  if (isOpen) {
    layout.append(editor(note))
  } else {
    layout.append(nothingOpen(opened !== undefined && opened !== ""))
  }
  page.replaceChildren(layout)
  // Drawn from a link, the page would leave the focus nowhere: put it where the person writes.
  if (opened === newNote) {
    focusIn(page, "#note-title")
  } else if (note !== undefined) {
    focusIn(page, "#note-body")
  }
}

function notesList(notes: Note[], opened: string | undefined): HTMLElement {
  const aside = uiComponent({ type: Html.Aside, classes: ["notes-list"], attributes: { "aria-labelledby": "notes-heading" } })
  const header = uiComponent({ type: Html.Header })
  const heading = uiComponent({ type: Html.H1, id: "notes-heading" })
  heading.textContent = "Notes"
  const add = uiComponent({ type: Html.A, id: "new-note", classes: ["button", "primary"], attributes: { href: `#/notes/${newNote}` } })
  add.append(icon("plus"), document.createTextNode("New note"))
  header.append(heading, add)
  aside.append(header)

  if (notes.length === 0) {
    const empty = uiComponent({ type: Html.P, classes: ["soft"] })
    empty.textContent = "No notes yet. Write the first one."
    aside.append(empty)
    return aside
  }
  const list = uiComponent({ type: Html.Ul, classes: ["list"], attributes: { "aria-label": "All notes" } })
  for (const note of notes) {
    list.append(noteLink(note, note.id === opened))
  }
  aside.append(list)
  return aside
}

function noteLink(note: Note, isOpen: boolean): HTMLElement {
  const item = uiComponent({ type: Html.Li })
  const link = uiComponent({ type: Html.A, id: `note-${note.id}`, classes: ["note-link"], attributes: { href: `#/notes/${note.id}` } })
  const name = uiComponent({ type: Html.Span, classes: ["title"] })
  name.textContent = nameOf(note) // what a person typed is always text, never markup
  const when = uiComponent({ type: Html.Span, classes: ["quiet"] })
  when.textContent = changedOn(note)
  link.append(name, when)
  if (isOpen) {
    link.setAttribute("aria-current", "page")
  }
  item.append(link)
  return item
}

function nothingOpen(wasMissing: boolean): HTMLElement {
  const section = uiComponent({ type: Html.Section, classes: ["note-empty"] })
  const text = uiComponent({ type: Html.P, classes: ["soft"], attributes: { role: wasMissing ? "alert" : "status" } })
  text.textContent = wasMissing ? "This note is gone; it may have been deleted in another tab." : "Choose a note, or write a new one."
  section.append(text)
  return section
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
 * Saves the changes of an open note, then draws the list again, since its name or place may change.
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
  form.parentElement?.querySelector(".notes-list")?.replaceWith(notesList(notesByRecent(loadNotes(localStorage)), changed.id))
  status.textContent = `Saved at ${new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(new Date(changed.updated))}.`
  return changed
}

function changedOn(note: Note): string {
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(note.updated))
}
