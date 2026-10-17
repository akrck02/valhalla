import { describe, expect, it } from "./lib/test.js"
import { applyAppearance, defaultAppearance, loadAppearance } from "../src/settings.js"

describe("appearance", () => {
  function storageWith(value: string | null): Storage {
    return { getItem: () => value } as unknown as Storage
  }

  it("a first visit gets paper, the system's mode and glass", () => {
    expect(JSON.stringify(loadAppearance(storageWith(null)))).toBe(JSON.stringify(defaultAppearance))
  })

  it("a damaged setting falls back to the default look", () => {
    expect(loadAppearance(storageWith("{oops")).style).toBe("paper")
  })

  it("the look becomes the attributes Bubble reads, and following the system sets no mode", () => {
    const root = document.createElement("div")
    applyAppearance(root, { style: "material", mode: "dark", glass: false })
    expect(root.getAttribute("data-style")).toBe("material")
    expect(root.getAttribute("data-mode")).toBe("dark")
    expect(root.hasAttribute("data-glass")).toBe(false)
    applyAppearance(root, { style: "paper", mode: "system", glass: true })
    expect(root.hasAttribute("data-style")).toBe(false)
    expect(root.hasAttribute("data-mode")).toBe(false)
    expect(root.hasAttribute("data-glass")).toBe(true)
  })
})
