/** How the app looks: Bubble's style, the mode, and whether panels are glass. */
export interface Appearance {
  style: "paper" | "material"
  mode: "system" | "light" | "dark"
  glass: boolean
}

const storageKey = "valhalla.appearance"

/** The look of a first visit: paper, following the system, with glass like the 2022 Valhalla. */
export const defaultAppearance: Appearance = { style: "paper", mode: "system", glass: true }

/** Reads the saved look, or the default one. */
export function loadAppearance(storage: Storage): Appearance {
  try {
    const saved = JSON.parse(storage.getItem(storageKey) ?? "null")
    return { ...defaultAppearance, ...(saved ?? {}) }
  } catch {
    return defaultAppearance // a damaged setting falls back to the default look
  }
}

/** Saves the look. */
export function saveAppearance(storage: Storage, appearance: Appearance): void {
  storage.setItem(storageKey, JSON.stringify(appearance))
}

/** Puts the look on the page, as the attributes Bubble's tokens read. */
export function applyAppearance(root: HTMLElement, appearance: Appearance): void {
  setOrRemove(root, "data-style", appearance.style === "material" ? "material" : undefined)
  setOrRemove(root, "data-mode", appearance.mode === "system" ? undefined : appearance.mode)
  setOrRemove(root, "data-glass", appearance.glass ? "" : undefined)
}

function setOrRemove(element: HTMLElement, attribute: string, value: string | undefined): void {
  if (value === undefined) {
    element.removeAttribute(attribute)
    return
  }
  element.setAttribute(attribute, value)
}
