/** Puts the focus on the first element inside the page that matches a selector, if there is one. */
export function focusIn(page: HTMLElement, selector: string): void {
  ;(page.querySelector(selector) as HTMLElement | null)?.focus()
}
