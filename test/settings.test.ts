import { describe, expect, it } from "./lib/test.js"
import { accentTokens, applyAppearance, changeAppearance, defaultAppearance, loadAppearance } from "../src/settings.js"
import { memoryStorage } from "./storage.js"

describe("appearance", () => {
  function storageWith(value: string | null): Storage {
    return { getItem: () => value } as unknown as Storage
  }

  it("a first visit gets plain paper, without glass, following the system", () => {
    expect(JSON.stringify(loadAppearance(storageWith(null)))).toBe(JSON.stringify(defaultAppearance))
    expect(defaultAppearance.glass).toBe(false)
  })

  it("a damaged setting falls back to the default look", () => {
    expect(loadAppearance(storageWith("{oops")).style).toBe("paper")
  })

  it("the look becomes the attributes Bubble reads, and following the system sets no mode", () => {
    const root = document.createElement("div")
    applyAppearance(root, { style: "material", mode: "dark", glass: false, accent: "blue" })
    expect(root.getAttribute("data-style")).toBe("material")
    expect(root.getAttribute("data-mode")).toBe("dark")
    expect(root.hasAttribute("data-glass")).toBe(false)
    applyAppearance(root, { style: "paper", mode: "system", glass: true, accent: "gold" })
    expect(root.hasAttribute("data-style")).toBe(false)
    expect(root.hasAttribute("data-mode")).toBe(false)
    expect(root.hasAttribute("data-glass")).toBe(true)
  })

  it("anything unknown in a saved look takes the default, and the rest is kept", () => {
    const saved = loadAppearance(storageWith(JSON.stringify({ style: "neon", mode: "dark", glass: "yes", accent: "purple" })))
    expect(JSON.stringify(saved)).toBe(JSON.stringify({ ...defaultAppearance, mode: "dark" }))
  })

  it("glass is only for paper, as in Bubble", () => {
    const root = document.createElement("div")
    applyAppearance(root, { style: "material", mode: "system", glass: true, accent: "gold" })
    expect(root.hasAttribute("data-glass")).toBe(false)
  })

  it("the accent swaps the page's tokens for its own", () => {
    const link = document.createElement("link")
    link.id = "accent-tokens"
    link.rel = "alternate stylesheet" // a test page must not load real styles
    document.head.append(link)
    applyAppearance(document.createElement("div"), { ...defaultAppearance, accent: "teal" })
    expect(link.getAttribute("href")).toBe(accentTokens("teal"))
    expect(accentTokens("teal")).toBe("styles/accents/teal.css")
    link.remove()
  })

  it("a change keeps the rest of the saved look", () => {
    const storage = memoryStorage()
    changeAppearance(storage, document.createElement("div"), { accent: "red" })
    const changed = changeAppearance(storage, document.createElement("div"), { mode: "light" })
    expect(changed.accent).toBe("red")
    expect(JSON.stringify(loadAppearance(storage))).toBe(JSON.stringify(changed))
  })
})
