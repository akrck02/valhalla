import { afterThis, describe, expect, it, replace } from "./lib/test.js"
import { createNote } from "../src/notes/note.js"
import { addNote, loadNotes } from "../src/notes/store.js"
import { showNotes } from "../src/views/notes.js"
import { memoryStorage } from "./storage.js"

/** Draws the notes page with some notes, on a storage of its own; gives the page and the storage. */
async function notesWith(parameters: string[], ...notes: ReturnType<typeof createNote>[]) {
  const storage = memoryStorage()
  notes.forEach(note => addNote(storage, note))
  replace(window, "localStorage", storage)
  afterThis(() => history.replaceState(null, "", location.pathname)) // the test page has no routes to follow
  const page = document.createElement("main")
  document.body.append(page)
  await showNotes(parameters, page)
  return { page, storage }
}

function type(page: HTMLElement, id: string, value: string): void {
  ;(page.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement).value = value
}

function save(page: HTMLElement): void {
  ;(page.querySelector(".note-editor") as HTMLFormElement).requestSubmit()
}

describe("the notes page", () => {
  it("with no notes, an empty state says so and offers to write one", async () => {
    const { page } = await notesWith([])
    expect(page.querySelector(".empty")?.textContent ?? "").toMatch(/No notes yet/)
    expect(page.querySelector('.empty a[href="#/notes/new"]') !== null).toBe(true)
    expect(page.querySelector('.page-header a.primary')?.getAttribute("href")).toBe("#/notes/new")
    page.remove()
  })

  it("chips filter the wall by the tags the notes use, the chosen one marked", async () => {
    const garden = createNote("Plan", "#garden")
    const soup = createNote("Soup", "#kitchen")
    const { page } = await notesWith(["tagged", "garden"], garden, soup)
    const chips = [...page.querySelectorAll(".chips a")].map(chip => chip.textContent)
    expect(chips.join()).toBe("All,#garden,#kitchen")
    expect(page.querySelector('.chips [aria-current="page"]')?.textContent).toBe("#garden")
    expect([...page.querySelectorAll(".note-card .title")].map(title => title.textContent).join()).toBe("Plan")
    page.remove()
  })

  it("an open note is edited beside the wall", async () => {
    const note = createNote("Ideas", "One")
    const { page } = await notesWith([note.id], note)
    expect(page.querySelector(".note-wall") !== null && page.querySelector(".note-editor") !== null).toBe(true)
    expect(page.querySelector(`#note-${note.id}`)?.getAttribute("aria-current")).toBe("page")
    page.remove()
  })

  it("a new note is saved and opened at its own address", async () => {
    const { page, storage } = await notesWith(["new"])
    type(page, "note-title", "Ideas")
    type(page, "note-body", "One")
    save(page)
    const [saved] = loadNotes(storage)
    expect(saved.title).toBe("Ideas")
    expect(location.hash).toBe(`#/notes/${saved.id}`)
    page.remove()
  })

  it("an empty note is not saved, and says why", async () => {
    const { page, storage } = await notesWith(["new"])
    save(page)
    expect(loadNotes(storage).length).toBe(0)
    expect(page.querySelector(".error")?.textContent).toBe("Write a title or some text.")
    page.remove()
  })

  it("saving an open note keeps the change and says when", async () => {
    const note = createNote("Ideas", "One")
    const { page, storage } = await notesWith([note.id], note)
    type(page, "note-body", "One and two")
    save(page)
    expect(loadNotes(storage)[0].body).toBe("One and two")
    expect(page.querySelector('[role="status"]')?.textContent ?? "").toMatch(/^Saved at/)
    type(page, "note-title", "Better ideas")
    save(page)
    expect(loadNotes(storage)[0].title).toBe("Better ideas")
    page.remove()
  })

  it("an open note puts the focus on its text, a new one on its title", async () => {
    const note = createNote("Ideas", "One")
    const open = await notesWith([note.id], note)
    expect(document.activeElement?.id).toBe("note-body")
    open.page.remove()
    const fresh = await notesWith(["new"])
    expect(document.activeElement?.id).toBe("note-title")
    fresh.page.remove()
  })

  it("a note that is gone says so instead of opening", async () => {
    const { page } = await notesWith(["not-a-note"])
    expect(page.querySelector('[role="alert"]')?.textContent ?? "").toMatch(/gone/)
    page.remove()
  })

  it("every control has a name, and what a person typed stays text", async () => {
    const note = createNote("<b>bold</b>", "<img src=x>")
    const { page } = await notesWith([note.id], note)
    for (const control of page.querySelectorAll("a, button, input, textarea")) {
      const name = control.getAttribute("aria-label") ?? control.textContent?.trim() ?? ""
      const labelled = control.id !== "" && page.querySelector(`label[for="${control.id}"]`) !== null
      expect(labelled || name !== "").toBe(true)
    }
    expect(page.querySelector("img, b")).toBe(null)
    page.remove()
  })

  it("the wall shows a card for each note, the most recent first, each a link to its note", async () => {
    const older = createNote("Older", "", new Date("2026-10-16T10:00:00Z"))
    const newer = createNote("", "First line\nThe rest of it", new Date("2026-10-17T10:00:00Z"))
    const { page } = await notesWith([], older, newer)
    const cards = [...page.querySelectorAll(".note-card")]
    expect(cards.map(card => card.querySelector(".title")?.textContent).join()).toBe("First line,Older")
    expect(cards[0].querySelector(".excerpt")?.textContent).toBe("The rest of it")
    expect(cards[1].getAttribute("href")).toBe(`#/notes/${older.id}`)
    page.remove()
  })
})
