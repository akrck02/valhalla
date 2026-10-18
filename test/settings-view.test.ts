import { afterThis, describe, expect, it, replace } from "./lib/test.js"
import { loadAppearance } from "../src/settings.js"
import { showSettings } from "../src/views/settings.js"
import { memoryStorage } from "./storage.js"

/** Draws the settings on a storage of its own; puts the page's look back afterwards. */
async function settingsPage() {
  const storage = memoryStorage()
  replace(window, "localStorage", storage)
  const root = document.documentElement
  const before = [...root.attributes].map(attribute => [attribute.name, attribute.value])
  afterThis(() => {
    for (const name of ["data-style", "data-mode", "data-glass"]) {
      root.removeAttribute(name)
    }
    before.forEach(([name, value]) => root.setAttribute(name, value))
  })
  const page = document.createElement("main")
  document.body.append(page) // a click only sends change to an input in the document
  afterThis(() => page.remove())
  await showSettings([], page)
  return { page, storage }
}

function choose(page: HTMLElement, id: string): void {
  const input = page.querySelector(`#${id}`) as HTMLInputElement
  input.click()
}

describe("the settings page", () => {
  it("each group of choices is a fieldset named by its legend, and each choice has a label", async () => {
    const { page } = await settingsPage()
    const legends = [...page.querySelectorAll("fieldset > legend")].map(legend => legend.textContent)
    expect(legends.join()).toBe("Finish,Style,Mode,Accent,Wallpaper")
    for (const input of page.querySelectorAll("input")) {
      expect(input.closest("label")?.textContent?.trim() ?? "").toMatch(/\S/)
    }
  })

  it("the finish is a card with a picture of itself, the accent a round swatch named in words", async () => {
    const { page } = await settingsPage()
    expect(page.querySelectorAll('.finish:has([name="finish"]) .preview').length).toBe(2)
    expect(page.querySelector('label.swatch-choice:has(#accent-teal)')?.textContent?.trim()).toBe("Teal")
  })

  it("shows the saved look as chosen", async () => {
    const { page } = await settingsPage()
    expect((page.querySelector("#finish-paper") as HTMLInputElement).checked).toBe(true)
    expect((page.querySelector("#style-paper") as HTMLInputElement).checked).toBe(true)
    expect((page.querySelector("#mode-system") as HTMLInputElement).checked).toBe(true)
    expect((page.querySelector("#accent-ice") as HTMLInputElement).checked).toBe(true)
  })

  it("a choice shows at once and is saved", async () => {
    const { page, storage } = await settingsPage()
    choose(page, "mode-dark")
    choose(page, "accent-teal")
    expect(document.documentElement.getAttribute("data-mode")).toBe("dark")
    expect(loadAppearance(storage).accent).toBe("teal")
  })

  it("material turns glass off limits and says why, and paper brings back the choice", async () => {
    const { page, storage } = await settingsPage()
    const glass = page.querySelector("#finish-glass") as HTMLInputElement
    choose(page, "finish-glass")
    choose(page, "style-material")
    expect(glass.disabled).toBe(true)
    expect(page.querySelector("#glass-hint")?.textContent ?? "").toMatch(/Material/)
    expect(document.documentElement.hasAttribute("data-glass")).toBe(false)
    choose(page, "style-paper")
    expect(glass.disabled).toBe(false)
    expect(loadAppearance(storage).glass).toBe(true)
  })

  it("the wallpapers show only with glass on", async () => {
    const { page } = await settingsPage()
    const group = page.querySelector("#wallpaper-group") as HTMLElement
    expect(group.hidden).toBe(true)
    choose(page, "finish-glass")
    expect(group.hidden).toBe(false)
    choose(page, "wallpaper-aurora")
    expect(document.documentElement.getAttribute("data-wallpaper")).toBe("aurora")
    document.documentElement.removeAttribute("data-wallpaper")
  })
})
