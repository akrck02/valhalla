import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { accents, Appearance, changeAppearance, loadAppearance, wallpapers } from "../settings.js"

/** One choice of a group: the value it saves, and its name. */
interface Choice {
  value: string
  label: string
}

/**
 * Settings: how the app looks, in panes. The finish is a card with a picture of itself, style and
 * light are segmented controls, the accent is a round swatch and the wallpapers are tiles. Each
 * change shows at once and is saved, so there is no save button. Every choice is a native radio
 * button in a fieldset: the arrows move through each group and a screen reader says its name.
 */
export async function showSettings(_parameters: string[], page: HTMLElement): Promise<void> {
  const appearance = loadAppearance(localStorage)
  const header = uiComponent({ type: Html.Header, classes: ["page-header"] })
  const titles = uiComponent()
  const eyebrow = uiComponent({ type: Html.P, classes: ["date", "soft"], text: "Settings" })
  const title = uiComponent({ type: Html.H1, text: "Appearance" })
  titles.append(eyebrow, title)
  header.append(titles)
  const form = uiComponent({ type: Html.Form, classes: ["settings"], attributes: { "aria-label": "Appearance" } })
  form.append(lookPane(appearance), colourPane(appearance), wallpaperPane(appearance))
  updateGlass(form, appearance)
  form.addEventListener("change", () => {
    const changed = changeAppearance(localStorage, document.documentElement, readForm(form))
    updateGlass(form, changed)
  })
  page.classList.add("wide")
  page.replaceChildren(header, form)
}

/** The finish, Paper or Glass, and the style, Paper or Material. */
function lookPane(appearance: Appearance): HTMLElement {
  const pane = uiComponent({ type: Html.Section, classes: ["pane"] })
  const hint = uiComponent({ type: Html.P, id: "glass-hint", classes: ["quiet"] })
  pane.append(finishGroup(appearance), hint, segmentedGroup("style", "Style", appearance.style, [
    { value: "paper", label: "Paper" },
    { value: "material", label: "Material" },
  ]))
  return pane
}

function colourPane(appearance: Appearance): HTMLElement {
  const pane = uiComponent({ type: Html.Section, classes: ["pane"] })
  pane.append(segmentedGroup("mode", "Mode", appearance.mode, [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "Like the system" },
  ]), accentGroup(appearance))
  return pane
}

/** The finish as two cards, each with a small picture of itself. Glass is saved as on or off. */
function finishGroup(appearance: Appearance): HTMLElement {
  const group = fieldset("Finish", ["finishes"])
  const finishes: (Choice & { note: string })[] = [
    { value: "paper", label: "Paper", note: "Opaque, with fine lines" },
    { value: "glass", label: "Glass", note: "Crystal panes over a wallpaper" },
  ]
  for (const finish of finishes) {
    const label = uiComponent({ type: Html.Label, classes: ["finish"] })
    const radio = radioOf("finish", finish.value, finish.value === (appearance.glass ? "glass" : "paper"))
    radio.setAttribute("aria-describedby", `finish-${finish.value}-note glass-hint`)
    const preview = uiComponent({ classes: ["preview", `preview-${finish.value}`], attributes: { "aria-hidden": "true" } })
    preview.append(uiComponent({ classes: ["preview-pane"] }), uiComponent({ classes: ["preview-pane"] }))
    const name = uiComponent({ type: Html.Span, text: finish.label })
    const note = uiComponent({ type: Html.Span, id: `finish-${finish.value}-note`, classes: ["note"], text: finish.note })
    label.append(radio, preview, name, note)
    group.append(label)
  }
  return group
}

function segmentedGroup(name: string, legend: string, current: string, choices: Choice[]): HTMLElement {
  const group = fieldset(legend)
  const segments = uiComponent({ classes: ["segmented"] })
  for (const choice of choices) {
    const label = uiComponent({ type: Html.Label })
    label.append(radioOf(name, choice.value, choice.value === current), document.createTextNode(choice.label))
    segments.append(label)
  }
  group.append(segments)
  return group
}

/** The accents as round swatches; each is named in words, which is what a screen reader says. */
function accentGroup(appearance: Appearance): HTMLElement {
  const group = fieldset("Accent")
  const swatches = uiComponent({ classes: ["swatches"] })
  for (const accent of accents) {
    const label = uiComponent({ type: Html.Label, classes: ["swatch-choice"], attributes: { title: accent.label } })
    label.style.setProperty("--swatch", accent.colour)
    const name = uiComponent({ type: Html.Span, classes: ["visually-hidden"], text: accent.label })
    label.append(radioOf("accent", accent.name, accent.name === appearance.accent), name)
    swatches.append(label)
  }
  group.append(swatches)
  return group
}

/** The wallpapers behind the glass, as tiles with a picture of each; only shown with glass. */
function wallpaperPane(appearance: Appearance): HTMLElement {
  const pane = uiComponent({ type: Html.Section, id: "wallpaper-group", classes: ["pane"] })
  const group = fieldset("Wallpaper", ["finishes", "wallpapers"])
  for (const wallpaper of wallpapers) {
    const label = uiComponent({ type: Html.Label, classes: ["finish"] })
    const sample = uiComponent({ classes: ["preview", "wallpaper-sample"], attributes: { "aria-hidden": "true", "data-sample": wallpaper.name } })
    const name = uiComponent({ type: Html.Span, text: wallpaper.label })
    label.append(radioOf("wallpaper", wallpaper.name, wallpaper.name === appearance.wallpaper), sample, name)
    group.append(label)
  }
  pane.append(group)
  return pane
}

function fieldset(legend: string, classes: string[] = []): HTMLElement {
  const group = uiComponent({ type: "fieldset", classes: ["setting", ...classes] })
  group.append(uiComponent({ type: "legend", text: legend }))
  return group
}

function radioOf(name: string, value: string, checked: boolean): HTMLInputElement {
  const radio = uiComponent({ type: Html.Input, id: `${name}-${value}`, attributes: { type: "radio", name: name, value: value } }) as HTMLInputElement
  radio.checked = checked
  return radio
}

/**
 * Glass is only for paper: with material its card is off limits, and the hint says why. The
 * wallpapers only show with glass on.
 */
function updateGlass(container: HTMLElement, appearance: Appearance): void {
  const glass = container.querySelector("#finish-glass") as HTMLInputElement
  const hint = container.querySelector("#glass-hint") as HTMLElement
  const wallpaperGroup = container.querySelector("#wallpaper-group") as HTMLElement | null
  glass.disabled = appearance.style !== "paper"
  if (wallpaperGroup !== null) {
    wallpaperGroup.hidden = glass.disabled || !appearance.glass
  }
  hint.textContent = glass.disabled
    ? "Glass is part of Paper; Material keeps its panels solid."
    : "Glass lets the wallpaper show through. Solid when the system asks for less transparency."
}

function readForm(form: HTMLElement): Partial<Appearance> {
  const checked = (name: string): string | undefined =>
    (form.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null)?.value
  const glass = form.querySelector("#finish-glass") as HTMLInputElement
  const change: Partial<Appearance> = {}
  const style = checked("style")
  const mode = checked("mode")
  const accent = accents.find(each => each.name === checked("accent"))
  const wallpaper = wallpapers.find(each => each.name === checked("wallpaper"))
  if (style === "paper" || style === "material") {
    change.style = style
  }
  if (mode === "system" || mode === "light" || mode === "dark") {
    change.mode = mode
  }
  if (accent !== undefined) {
    change.accent = accent.name
  }
  if (wallpaper !== undefined) {
    change.wallpaper = wallpaper.name
  }
  if (!glass.disabled) {
    change.glass = glass.checked // a disabled card keeps the choice made under paper
  }
  return change
}
