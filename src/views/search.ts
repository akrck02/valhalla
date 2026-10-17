import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { icon } from "../icons.js"
import { ValhallaError } from "../errors.js"
import { dayOf } from "../tasks/task.js"
import { loadTasks } from "../tasks/store.js"
import { loadNotes } from "../notes/store.js"
import { ResultKind, searchEverything, SearchResult } from "../search/search.js"
import { readCommand, runCommand, TerminalContext } from "../terminal/terminal.js"
import { applyAppearance, loadAppearance, saveAppearance } from "../settings.js"
import { places } from "../shell.js"
import { messageFor } from "./messages.js"

/** What starts a line for the terminal instead of a search, as in many editors' palettes. */
export const terminalPrompt = ">"

const kindNames: Record<ResultKind, string> = { place: "Place", task: "Task", note: "Note" }

/** The Search place: the same panel as Ctrl K, on a page of its own. */
export async function showSearch(_parameters: string[], page: HTMLElement): Promise<void> {
  const title = uiComponent({ type: Html.H1 })
  title.textContent = "Search"
  const panel = searchPanel(() => {})
  page.replaceChildren(title, panel)
  ;(panel.querySelector("input") as HTMLInputElement).focus()
}

/**
 * Opens the search over whatever page is shown, as a dialog; Ctrl K or ⌘K opens it. If it is
 * already open, it takes the focus back instead of opening twice.
 */
export function openSearchDialog(): void {
  const open = document.querySelector<HTMLDialogElement>("dialog.search-dialog")
  if (open !== null) {
    open.querySelector("input")?.focus()
    return
  }
  const dialog = uiComponent({ type: "dialog", classes: ["dialog", "search-dialog"], attributes: { "aria-label": "Search" } }) as HTMLDialogElement
  dialog.append(searchPanel(() => dialog.close()))
  dialog.addEventListener("close", () => dialog.remove())
  document.body.append(dialog)
  dialog.showModal()
}

/**
 * Builds the search: a box that finds places, tasks and notes as the person types, or runs
 * commands when the line starts with ">". The results are an ARIA combobox: the arrows move
 * through them while the focus stays in the box, and Enter opens the chosen one.
 * @param leave called when a result or a command takes the person somewhere else
 */
export function searchPanel(leave: () => void): HTMLElement {
  const panel = uiComponent({ classes: ["search"] })
  const box = uiComponent({ classes: ["search-box"] })
  const label = uiComponent({ type: Html.Label, classes: ["visually-hidden"], attributes: { for: "search-input" } })
  label.textContent = `Search, or type ${terminalPrompt} for commands`
  const input = uiComponent({
    type: Html.Input,
    id: "search-input",
    attributes: {
      type: "text", role: "combobox", autocomplete: "off", spellcheck: "false",
      "aria-autocomplete": "list", "aria-controls": "search-results", "aria-expanded": "false",
      placeholder: `Search, or type ${terminalPrompt} for commands`,
    },
  }) as HTMLInputElement
  box.append(icon("search"), label, input)
  const results = uiComponent({ type: Html.Ul, id: "search-results", classes: ["search-results"], attributes: { role: "listbox", "aria-label": "Results" } })
  const terminal = uiComponent({ classes: ["terminal"], attributes: { role: "log", "aria-label": "Terminal" } })
  terminal.hidden = true
  panel.append(box, results, terminal)

  const go = (href: string): void => {
    leave()
    location.hash = href
  }
  let shown: SearchResult[] = []
  let active = 0
  const draw = (): void => {
    const isTerminal = input.value.startsWith(terminalPrompt)
    results.hidden = isTerminal
    terminal.hidden = !isTerminal
    shown = isTerminal ? [] : searchEverything(input.value, sources())
    active = 0
    drawResults(results, shown, active, go)
    markActive(input, results, shown.length === 0 ? -1 : active)
  }
  input.addEventListener("input", draw)
  input.addEventListener("keydown", event => {
    if (input.value.startsWith(terminalPrompt)) {
      if (event.key === "Enter") {
        event.preventDefault()
        runLine(input, terminal, go)
      }
      return
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      active = shown.length === 0 ? 0 : (active + step + shown.length) % shown.length
      markActive(input, results, shown.length === 0 ? -1 : active)
      return
    }
    if (event.key === "Enter" && shown[active] !== undefined) {
      event.preventDefault()
      go(shown[active].href)
    }
  })
  draw()
  return panel
}

function sources() {
  return { places: places.map(place => ({ name: place.name, path: place.path })), tasks: loadTasks(localStorage), notes: loadNotes(localStorage) }
}

function drawResults(list: HTMLElement, shown: SearchResult[], active: number, go: (href: string) => void): void {
  if (shown.length === 0) {
    const empty = uiComponent({ type: Html.Li, classes: ["search-empty"], attributes: { role: "presentation" } })
    empty.textContent = "Nothing found."
    list.replaceChildren(empty)
    return
  }
  list.replaceChildren(...shown.map((result, index) => {
    const option = uiComponent({ type: Html.Li, id: `search-result-${index}`, classes: ["search-result"], attributes: { role: "option", "aria-selected": String(index === active) } })
    const kind = uiComponent({ type: Html.Span, classes: ["pill"] })
    kind.textContent = kindNames[result.kind]
    const label = uiComponent({ type: Html.Span, classes: ["title"] })
    label.textContent = result.label // what a person typed is always text, never markup
    const detail = uiComponent({ type: Html.Span, classes: ["quiet"] })
    detail.textContent = result.detail
    option.append(kind, label, detail)
    option.addEventListener("click", () => go(result.href))
    return option
  }))
}

/** Marks the active option for the eye and for screen readers, which follow aria-activedescendant. */
function markActive(input: HTMLElement, list: HTMLElement, active: number): void {
  input.setAttribute("aria-expanded", String(active >= 0))
  for (const option of list.querySelectorAll('[role="option"]')) {
    option.setAttribute("aria-selected", String(option.id === `search-result-${active}`))
  }
  if (active < 0) {
    input.removeAttribute("aria-activedescendant")
    return
  }
  input.setAttribute("aria-activedescendant", `search-result-${active}`)
  list.querySelector(`#search-result-${active}`)?.scrollIntoView({ block: "nearest" })
}

/** Runs the line in the box as a command and writes the line and its answer in the terminal. */
function runLine(input: HTMLInputElement, terminal: HTMLElement, go: (href: string) => void): void {
  const line = input.value.slice(terminalPrompt.length).trim()
  input.value = terminalPrompt
  if (line === "") {
    return
  }
  const context: TerminalContext = {
    storage: localStorage,
    today: dayOf(new Date()),
    places: places.map(place => ({ name: place.name, path: place.path })),
    go: go,
    setMode: mode => {
      const appearance = { ...loadAppearance(localStorage), mode }
      saveAppearance(localStorage, appearance)
      applyAppearance(document.documentElement, appearance)
    },
  }
  const answer = answerTo(line, context)
  if (answer === "clear") {
    terminal.replaceChildren()
    return
  }
  terminal.append(terminalLine(`${terminalPrompt} ${line}`, "typed"), ...answer.lines.map(text => terminalLine(text, answer.kind)))
  terminal.scrollTop = terminal.scrollHeight
}

/** Reads and runs one line; a mistake in it is an answer too, said in the error's words. */
function answerTo(line: string, context: TerminalContext): { lines: string[], kind: "answer" | "error" } | "clear" {
  try {
    const command = readCommand(line, context.today)
    const lines = runCommand(command, context)
    return command.name === "clear" ? "clear" : { lines, kind: "answer" }
  } catch (problem) {
    if (!(problem instanceof ValhallaError)) {
      throw problem
    }
    return { lines: [messageFor(problem)], kind: "error" }
  }
}

function terminalLine(text: string, kind: "typed" | "answer" | "error"): HTMLElement {
  const line = uiComponent({ type: Html.P, classes: ["terminal-line", kind] })
  line.textContent = text
  return line
}
