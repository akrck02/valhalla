import { uiComponent } from "../gtd/dom.js"
import { language } from "../language.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { createNote, editedNote, nameOf, Note, notesByRecent, notesTagged, tagsOf } from "../notes/note.js"
import { addNote, deleteNote, loadNotes, updateNote } from "../notes/store.js"
import { field, textArea, valueOf } from "./form.js"
import { tryShowingError } from "./messages.js"
import { deleteButton } from "./delete-button.js"
import { focusIn } from "./focus.js"

/** The address of a note that is being written for the first time. */
const newNote = "new"

/** The part of an address that filters the wall by a tag: #/notes/tagged/garden. */
const tagged = "tagged"

/** How much of a note's text its card shows on the wall. */
const excerptLength = 180

/**
 * Notes: a wall of cards, most recent first, as the first Valhalla pinned them, with chips to
 * filter it by the tags the notes write (#garden). An open note is edited beside the wall; on a
 * phone it takes the page. The address says what is shown: #/notes, #/notes/tagged/<tag>,
 * #/notes/new or #/notes/<id>.
 */
export async function showNotes(parameters: string[], page: HTMLElement): Promise<void> {
  const [opened, tag] = parameters
  const notes = notesByRecent(loadNotes(localStorage))
  const note = notes.find(each => each.id === opened)
  const isOpen = opened === newNote || note !== undefined
  const chosenTag = opened === tagged ? tag ?? "" : ""
  const isMissing = opened !== undefined && opened !== "" && opened !== tagged && !isOpen
  const isFirstDraw = page.childElementCount === 0
  page.classList.add("wide")
  const wallSide = uiComponent({ classes: ["notes-wall"] })
  wallSide.append(...wall(notes, chosenTag, note?.id, isMissing, isFirstDraw))
  const layout = uiComponent({ classes: isOpen ? ["notes", "open"] : ["notes"] })
  layout.append(wallSide)
  if (isOpen) {
    layout.append(editor(note))
  }
  page.replaceChildren(header(notes.length, isOpen), layout)
  if (isOpen) {
    // Drawn from a link, the page would leave the focus nowhere: put it where the person writes.
    focusIn(page, note === undefined ? "#note-title" : "#note-body")
  }
}

/** The page's title, and New note: the main action, unless a note is open and Save is. */
function header(count: number, isOpen: boolean): HTMLElement {
  const header = uiComponent({ type: Html.Header, classes: ["page-header"] })
  const titles = uiComponent()
  const counted = uiComponent({ type: Html.P, classes: ["date", "soft"] })
  counted.textContent = count === 1 ? "1 note" : `${count} notes`
  const heading = uiComponent({ type: Html.H1, id: "notes-heading", text: "Notes" })
  titles.append(counted, heading)
  header.append(titles, newNoteLink(isOpen ? [] : ["primary"]))
  return header
}

function newNoteLink(classes: string[] = []): HTMLElement {
  const link = uiComponent({ type: Html.A, classes: ["button", ...classes], attributes: { href: `#/notes/${newNote}` } })
  link.append(icon("plus"), document.createTextNode("New note"))
  return link
}

function wall(notes: Note[], chosenTag: string, openedId: string | undefined, wasMissing: boolean, appears: boolean): HTMLElement[] {
  const parts: HTMLElement[] = []
  if (wasMissing) {
    const gone = uiComponent({ type: Html.P, classes: ["error"], attributes: { role: "alert" } })
    gone.textContent = "This note is gone; it may have been deleted in another tab."
    parts.push(gone)
  }
  if (notes.length === 0) {
    return [...parts, emptyWall()]
  }
  const tags = [...new Set(notes.flatMap(tagsOf))]
  if (tags.length > 0) {
    parts.push(tagChips(tags, chosenTag))
  }
  const shown = chosenTag === "" ? notes : notesTagged(notes, chosenTag)
  const list = uiComponent({ type: Html.Ul, classes: appears ? ["note-wall", "appear"] : ["note-wall"], attributes: { "aria-labelledby": "notes-heading" } })
  for (const note of shown) {
    list.append(noteCard(note, note.id === openedId))
  }
  return [...parts, list]
}

function emptyWall(): HTMLElement {
  const empty = uiComponent({ classes: ["empty"] })
  const title = uiComponent({ type: Html.H2, text: "No notes yet" })
  const text = uiComponent({ type: Html.P })
  text.textContent = "Write down the first thing on your mind. A #word in it becomes a tag to find it by."
  empty.append(icon("notebookPen"), title, text, newNoteLink())
  return empty
}

/** The chips that filter the wall: All, then each tag the notes write. */
function tagChips(tags: string[], chosenTag: string): HTMLElement {
  const nav = uiComponent({ type: Html.Nav, classes: ["chips"], attributes: { "aria-label": "Tags" } })
  nav.append(chip("All", "#/notes", chosenTag === ""))
  for (const tag of tags) {
    nav.append(chip(`#${tag}`, `#/notes/${tagged}/${encodeURIComponent(tag)}`, tag === chosenTag))
  }
  return nav
}

function chip(text: string, href: string, isChosen: boolean): HTMLElement {
  const link = uiComponent({ type: Html.A, classes: ["chip"], attributes: { href } })
  link.textContent = text // a tag is what a person typed: text, never markup
  if (isChosen) {
    link.setAttribute("aria-current", "page")
  }
  return link
}

/** A note on the wall: its name, the start of its text and when it changed; all of it a link. */
function noteCard(note: Note, isOpen: boolean): HTMLElement {
  const item = uiComponent({ type: Html.Li })
  const link = uiComponent({ type: Html.A, id: `note-${note.id}`, classes: ["note-card"], attributes: { href: `#/notes/${note.id}` } })
  if (isOpen) {
    link.setAttribute("aria-current", "page")
  }
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

/** The open note, as a form: a title, the text, and buttons to save or delete it. */
function editor(note: Note | undefined): HTMLElement {
  const form = uiComponent({ type: Html.Form, classes: ["note-editor"], attributes: { "aria-label": note === undefined ? "New note" : "Edit the note" } }) as HTMLFormElement
  const back = uiComponent({ type: Html.A, classes: ["button", "ghost", "back"], attributes: { href: "#/notes" } })
  back.append(icon("x"), document.createTextNode("Close"))
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
