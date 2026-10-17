import { uiComponent } from "../gtd/dom.js"
import { Html } from "../gtd/html.js"
import { accents, Appearance, changeAppearance, loadAppearance, wallpapers } from "../settings.js"

/** One choice of a group: the value it saves, and its name. */
interface Choice {
  value: string
  label: string
}

/**
 * Settings: how the app looks. Each change shows at once and is saved, so there is no save button.
 * The choices are native radio buttons in fieldsets: the arrows move through each group and a
 * screen reader says the group's name.
 */
export async function showSettings(_parameters: string[], page: HTMLElement): Promise<void> {
  const appearance = loadAppearance(localStorage)
  const title = uiComponent({ type: Html.H1 })
  title.textContent = "Settings"
  const form = uiComponent({ type: Html.Form, classes: ["card", "settings"], attributes: { "aria-label": "Appearance" } })
  form.append(
    choiceGroup("style", "Style", appearance.style, [
      { value: "paper", label: "Paper" },
      { value: "material", label: "Material" },
    ]),
    choiceGroup("mode", "Light", appearance.mode, [
      { value: "system", label: "Like the system" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ]),
    glassSwitch(appearance),
    wallpaperGroup(appearance),
    accentGroup(appearance),
  )
  updateGlassSwitch(form, appearance)
  form.addEventListener("change", () => {
    const changed = changeAppearance(localStorage, document.documentElement, readForm(form))
    updateGlassSwitch(form, changed)
  })
  page.replaceChildren(title, form)
}

function choiceGroup(name: string, legend: string, current: string, choices: Choice[]): HTMLElement {
  const group = uiComponent({ type: "fieldset", classes: ["choices"] })
  const legendElement = uiComponent({ type: "legend" })
  legendElement.textContent = legend
  group.append(legendElement)
  for (const choice of choices) {
    group.append(choiceOf(name, choice, choice.value === current))
  }
  return group
}

function choiceOf(name: string, choice: Choice, checked: boolean): HTMLElement {
  const label = uiComponent({ type: Html.Label, classes: ["choice"] })
  const radio = uiComponent({ type: Html.Input, id: `${name}-${choice.value}`, attributes: { type: "radio", name: name, value: choice.value } }) as HTMLInputElement
  radio.checked = checked
  const text = uiComponent({ type: Html.Span })
  text.textContent = choice.label
  label.append(radio, text)
  return label
}

function accentGroup(appearance: Appearance): HTMLElement {
  const group = choiceGroup("accent", "Accent", appearance.accent, accents.map(accent => ({ value: accent.name, label: accent.label })))
  for (const accent of accents) {
    const swatch = uiComponent({ type: Html.Span, classes: ["swatch"], attributes: { "aria-hidden": "true" } })
    swatch.style.background = accent.colour
    group.querySelector(`#accent-${accent.name}`)?.after(swatch)
  }
  return group
}

/** The wallpapers behind the glass, each with a small sample of itself; only shown with glass. */
function wallpaperGroup(appearance: Appearance): HTMLElement {
  const group = choiceGroup("wallpaper", "Wallpaper", appearance.wallpaper, wallpapers.map(wallpaper => ({ value: wallpaper.name, label: wallpaper.label })))
  group.id = "wallpaper-group"
  for (const wallpaper of wallpapers) {
    const sample = uiComponent({ type: Html.Span, classes: ["swatch", "wallpaper-sample"], attributes: { "aria-hidden": "true", "data-sample": wallpaper.name } })
    group.querySelector(`#wallpaper-${wallpaper.name}`)?.after(sample)
  }
  return group
}

function glassSwitch(appearance: Appearance): HTMLElement {
  const wrapper = uiComponent({ classes: ["switch-field"] })
  const label = uiComponent({ type: Html.Label, classes: ["choice"], attributes: { for: "glass" } })
  const checkBox = uiComponent({ type: Html.Input, id: "glass", attributes: { type: "checkbox", name: "glass", "aria-describedby": "glass-hint" } }) as HTMLInputElement
  checkBox.checked = appearance.glass
  const text = uiComponent({ type: Html.Span })
  text.textContent = "Glass panels"
  label.append(checkBox, text)
  const hint = uiComponent({ type: Html.P, id: "glass-hint", classes: ["quiet"] })
  wrapper.append(label, hint)
  updateGlassSwitch(wrapper, appearance)
  return wrapper
}

/**
 * Glass is only for paper: with material the switch is off limits, and its hint says why. The
 * wallpapers only show with glass on.
 */
function updateGlassSwitch(container: HTMLElement, appearance: Appearance): void {
  const checkBox = container.querySelector("#glass") as HTMLInputElement
  const hint = container.querySelector("#glass-hint") as HTMLElement
  const wallpaperGroup = container.querySelector("#wallpaper-group") as HTMLElement | null
  checkBox.disabled = appearance.style !== "paper"
  if (wallpaperGroup !== null) {
    wallpaperGroup.hidden = checkBox.disabled || !appearance.glass
  }
  hint.textContent = checkBox.disabled
    ? "Glass is part of Paper; Material keeps its panels solid."
    : "Panels let the background show through. Solid when the system asks for less transparency."
}

function readForm(form: HTMLElement): Partial<Appearance> {
  const checked = (name: string): string | undefined =>
    (form.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null)?.value
  const glass = form.querySelector("#glass") as HTMLInputElement
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
    change.glass = glass.checked // a disabled switch keeps the choice made under paper
  }
  return change
}
