/** The properties of the UI Component. */
export interface UIProperties {
  type?: string
  text?: string
  id?: string
  classes?: string[]
  attributes?: { [key: string]: string }
  selectable?: boolean
  styles?: { [key: string]: string }
  data?: { [key: string]: string }
}

/** Create a DOM element */
export function uiComponent(properties : UIProperties = {}) : HTMLElement {

  const element: HTMLElement = document.createElement(properties.type || "div")
  element.innerHTML = undefined != properties.text ? properties.text : ""

  if(undefined != properties.id)
    element.id = properties.id

  setDomClasses(element, properties.classes)
  setDomAttributes(element, properties.attributes)
  setDomStyles(element, properties.styles)
  setDomDataset(element, properties.data)

  if(false == properties.selectable){
    setDomStyles(element, { userSelect: "none" })
  }

  return element
}

/** Set DOM attributes */
export function setDomAttributes(element: HTMLElement, attributes: { [key: string]: string }): HTMLElement {

  if (undefined == element || undefined == attributes)
    return element

  for (const key in attributes)
    element.setAttribute(key, attributes[key])

  return element
}

  /** Remove the DOM attributes */
  export function removeDomAttributes(element: HTMLElement, attributes: string[]): HTMLElement {

    if (undefined == element || undefined == attributes)
      return element

    for (const attr of attributes)
      element.removeAttribute(attr)

    return element
  }

/** Set DOM classes */
export function setDomClasses(element: HTMLElement, classes: string[]): HTMLElement {

    if (undefined == element || undefined == classes)
      return element

    for (const cl of classes) {
      element.classList.add(cl)
    }

    return element
}

/** Set DOM classes */
export function removeDomClasses(element: HTMLElement, classes: string[]): HTMLElement {

  if (undefined == element || undefined == classes)
      return element

  for (const cl of classes)  {
    element.classList.remove(cl)
  }

  return element
}

/** Set DOM styles */
export function setDomStyles(element: HTMLElement, styles: { [key: string]: string }): HTMLElement {

  if (undefined == element || undefined == styles)
    return element;

  for (const key in styles)
    element.style[key] = styles[key];

  return element;
}

/** Remove DOM styles (CSS names, like background-color) */
export function removeDomStyles(element: HTMLElement, styles: string[]): HTMLElement {

  if (undefined == element || undefined == styles)
    return element

  for (const style of styles)
    element.style.removeProperty(style)

  return element
}

/** Set DOM events*/
export function setDomEvents(element: HTMLElement, events: { [key: string]: (event: Event) => void }): HTMLElement {

  if (undefined == element || undefined == events)
    return element

  for (const key in events)
    element.addEventListener(key, events[key])

  return element
}

/** Remove DOM events */
export function removeDomEvents(element: HTMLElement, events: { [key: string]: (event: Event) => void }): HTMLElement {

  if (undefined == element || undefined == events)
    return element;

  for (const key in events)
    element.removeEventListener(key, events[key]);

  return element;
}

/** Set DOM dataset */
export function setDomDataset(element: HTMLElement, dataset: { [key: string]: string }): HTMLElement {

  if (undefined == element || undefined == dataset)
    return element

  for (const key in dataset)
    element.dataset[key] = dataset[key]

  return element
}

/** Remove DOM dataset */
export function removeDomDataset(element: HTMLElement, dataset: string[]): HTMLElement {

  if (undefined == element || undefined == dataset)
    return element

  for (const data of dataset) {
    delete element.dataset[data]
  }

  return element
}

/** Remove DOM element by selector */
export function removeDomById(id : string) : void {

  if(undefined == id)
    return

  let element = document.getElementById(id)
  if (undefined == element)
    return

  element.parentNode.removeChild(element)
}

/** Remove all DOM elements by query selector */
export function removeAllDomBySelector(selector: string): number {

  if(undefined == selector)
    return 0

  const elements = document.querySelectorAll(selector)
  if (undefined == elements)
    return 0

  let count = 0
  for (let element of elements) {
    element.parentNode.removeChild(element)
    count ++
  }

  return count
}
