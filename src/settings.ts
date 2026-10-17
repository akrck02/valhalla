/** The accents the settings offer; gold is Valhalla's own, from its logo. */
export const accents = [
  { name: "gold", label: "Gold", colour: "#F6BD60" },
  { name: "blue", label: "Blue", colour: "#2C5C9E" },
  { name: "teal", label: "Teal", colour: "#2BB3A3" },
  { name: "red", label: "Red", colour: "#EF5350" },
  { name: "green", label: "Green", colour: "#3DDC84" },
] as const

/** The name of an accent the settings offer. */
export type AccentName = typeof accents[number]["name"]

/** How the app looks: Bubble's style, the mode, whether panels are glass, and the accent. */
export interface Appearance {
  style: "paper" | "material"
  mode: "system" | "light" | "dark"
  glass: boolean
  accent: AccentName
}

const storageKey = "valhalla.appearance"
const styles: Appearance["style"][] = ["paper", "material"]
const modes: Appearance["mode"][] = ["system", "light", "dark"]

/** The look of a first visit: plain paper, following the system; glass is there to turn on. */
export const defaultAppearance: Appearance = { style: "paper", mode: "system", glass: false, accent: "gold" }

/** Reads the saved look; anything missing or unknown in it takes the default. */
export function loadAppearance(storage: Storage): Appearance {
  let saved: Record<string, unknown>
  try {
    saved = JSON.parse(storage.getItem(storageKey) ?? "{}") ?? {}
  } catch {
    return defaultAppearance // a damaged setting falls back to the default look
  }
  return {
    style: styles.find(style => style === saved.style) ?? defaultAppearance.style,
    mode: modes.find(mode => mode === saved.mode) ?? defaultAppearance.mode,
    glass: typeof saved.glass === "boolean" ? saved.glass : defaultAppearance.glass,
    accent: accents.find(accent => accent.name === saved.accent)?.name ?? defaultAppearance.accent,
  }
}

/** Saves the look. */
export function saveAppearance(storage: Storage, appearance: Appearance): void {
  storage.setItem(storageKey, JSON.stringify(appearance))
}

/** Gives the address of the tokens of an accent, made by bin/accents.sh. */
export function accentTokens(accent: AccentName): string {
  return `styles/accents/${accent}.css`
}

/**
 * Puts the look on the page, as the attributes Bubble's tokens read, and loads the tokens of its
 * accent into the link#accent-tokens of the page, if it has one. Glass is only for paper, as in
 * Bubble, so material never gets it.
 */
export function applyAppearance(root: HTMLElement, appearance: Appearance): void {
  setOrRemove(root, "data-style", appearance.style === "material" ? "material" : undefined)
  setOrRemove(root, "data-mode", appearance.mode === "system" ? undefined : appearance.mode)
  setOrRemove(root, "data-glass", appearance.glass && appearance.style === "paper" ? "" : undefined)
  const tokens = root.ownerDocument.querySelector<HTMLLinkElement>("link#accent-tokens")
  if (tokens !== null && tokens.getAttribute("href") !== accentTokens(appearance.accent)) {
    tokens.setAttribute("href", accentTokens(appearance.accent))
  }
}

/** Changes part of the saved look, saves it and puts it on the page; gives the whole new look. */
export function changeAppearance(storage: Storage, root: HTMLElement, change: Partial<Appearance>): Appearance {
  const appearance = { ...loadAppearance(storage), ...change }
  saveAppearance(storage, appearance)
  applyAppearance(root, appearance)
  return appearance
}

function setOrRemove(element: HTMLElement, attribute: string, value: string | undefined): void {
  if (value === undefined) {
    element.removeAttribute(attribute)
    return
  }
  element.setAttribute(attribute, value)
}
