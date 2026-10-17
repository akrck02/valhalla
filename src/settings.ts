/**
 * The accents the settings offer. Ice is Valhalla's own: the pale blue of the lower card of its
 * logo, a white with a touch of blue.
 */
export const accents = [
  { name: "ice", label: "Ice", colour: "#BBDEFB" },
  { name: "gold", label: "Gold", colour: "#F6BD60" },
  { name: "blue", label: "Blue", colour: "#2C5C9E" },
  { name: "teal", label: "Teal", colour: "#2BB3A3" },
  { name: "red", label: "Red", colour: "#EF5350" },
  { name: "green", label: "Green", colour: "#3DDC84" },
] as const

/**
 * The wallpapers glass can show, as the first Valhalla did with photographs. These are drawn with
 * gradients in styles/valhalla.css, so they need no pictures and no licences.
 */
export const wallpapers = [
  { name: "none", label: "None" },
  { name: "city", label: "City lights" },
  { name: "aurora", label: "Aurora" },
  { name: "ember", label: "Embers" },
  { name: "dunes", label: "Dunes" },
] as const

/** The name of a wallpaper glass can show. */
export type WallpaperName = typeof wallpapers[number]["name"]

/** The name of an accent the settings offer. */
export type AccentName = typeof accents[number]["name"]

/** How the app looks: Bubble's style, the mode, whether panels are glass, and the accent. */
export interface Appearance {
  style: "paper" | "material"
  mode: "system" | "light" | "dark"
  glass: boolean
  accent: AccentName
  wallpaper: WallpaperName
}

const storageKey = "valhalla.appearance"
const styles: Appearance["style"][] = ["paper", "material"]
const modes: Appearance["mode"][] = ["system", "light", "dark"]

/** The look of a first visit: plain paper, following the system; glass is there to turn on. */
export const defaultAppearance: Appearance = { style: "paper", mode: "system", glass: false, accent: "ice", wallpaper: "city" }

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
    wallpaper: wallpapers.find(wallpaper => wallpaper.name === saved.wallpaper)?.name ?? defaultAppearance.wallpaper,
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
 * Bubble, so material never gets it, nor a wallpaper.
 */
export function applyAppearance(root: HTMLElement, appearance: Appearance): void {
  setOrRemove(root, "data-style", appearance.style === "material" ? "material" : undefined)
  setOrRemove(root, "data-mode", appearance.mode === "system" ? undefined : appearance.mode)
  const glass = appearance.glass && appearance.style === "paper"
  setOrRemove(root, "data-glass", glass ? "" : undefined)
  setOrRemove(root, "data-wallpaper", glass && appearance.wallpaper !== "none" ? appearance.wallpaper : undefined)
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
