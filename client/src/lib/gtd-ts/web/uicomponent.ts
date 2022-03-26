/**
 * The properties of the UI Component.
 * @interface UIProperties  
 */
export interface UIProperties {
    type?: string;
    text?: string;
    id?: string | undefined;
    classes?: string[];
    attributes?: { [key: string]: string };
    styles?: { [key: string]: string };
    data?: { [key: string]: string };
    events?: { [key: string]: (event: Event) => void };
}

/**
 * Class representing a UI component (HTML element) with custom properties and methods.
 * @description This class is a base class for all UI components.
 * @class UIComponent
 */
export class UIComponent {
    element: HTMLElement;

    type?: string;
    text?: string;
    id?: string;
    classes?: string[];
    attributes?: { [key: string]: string };
    styles?: { [key: string]: string };
    data?: { [key: string]: string };
    events?: { [key: string]: (event: Event) => void } | {};

    constructor(props: UIProperties) {
        this.type = props.type ?? "div";
        this.text = props.text;
        this.id = props.id;
        this.classes = props.classes;
        this.attributes = props.attributes;
        this.styles = props.styles;
        this.data = props.data;
        this.events = props.events;
        this.element = this.createElement();
    }

    createElement(): HTMLElement {
        let element: HTMLElement;

        if (!this.type) {
            throw "Element without type.";
            
        }  

        element = document.createElement(this.type);

        if (this.text) {
            element.innerHTML = this.text;
        }

        if (this.id) {
            element.id = this.id;
        }

        if (this.classes) {
            setClasses(element, this.classes);
        }

        if (this.attributes) {
            setAttributes(element, this.attributes);
        }

        if (this.styles) {
            setStyles(element, this.styles);
        }

        if (this.data) {
            setDataset(element, this.data);
        }

        if (this.events) {
            setEvents(element, this.events);
        }

        return element;
    }

    toHTML(): string {
        return this.element.outerHTML;
    }

    /**
     * Appends a child to the component.
     * @param child  Child component to be added
     * @returns      The component itself (for chaining)
     */
    public appendChild(child: UIComponent | HTMLElement): UIComponent {
        this.element.appendChild(child instanceof UIComponent ? child.element : child);
        return this;
    }

    /**
     * removes a child from the component.
     * @param child  Child component to be removed
     * @returns      The component itself (for chaining)
     * @description  If the child is not a child of the component, a message appears.
     */
    public removeChild(child: UIComponent | HTMLElement): UIComponent {
        try {
            this.element.removeChild( child instanceof UIComponent ? child.element : child);
        } catch (e) { console.log( child , "is not a child of", this.element); }
        
        return this;
    }

    /**
     * append this component to a parent component.
     * @param parent Parent component to be appended to
     * @returns      The component itself (for chaining)
     */
    public appendTo(parent: UIComponent | HTMLElement): UIComponent {
        parent.appendChild(this.element);
        return this;
    }

    /**
     * Clears the component.
     * @returns The component itself (for chaining)
     */
    public clean(): UIComponent {
        this.element.innerHTML = "";
        return this;
    }

}

/**
 * Set attributes to a DOM element
 * @param element DOM element to set attributes
 * @param options Object with attributes and values
 * @returns DOM element with attributes in order to chain methods
 * @example 
 *      element = setAttributes(element, {
 *           "id": "my-id",
 *           "class": "my-class" 
 *      });
 *      
 *      console.log(element.id); // "my-id"
 *      console.log(element.className); // "my-class"
 */
export function setAttributes(
    element: HTMLElement,
    options: { [key: string]: string }
): HTMLElement {
    if (options)
        for (const key in options) 
            element.setAttribute(key, options[key]);

    return element;
}

/**
 * Set dataset to a DOM element
 * @param element DOM element to set dataset
 * @param dataset Object with dataset values
 * @returns DOM element itself in order to chain methods
 * @example 
 *      setDataset(element, {
 *         "key": "value",
 *        "key2": "value2"
 *      });
 * 
 *      console.log(element.dataset.key); // value
 *      console.log(element.dataset.key2); // value2
 */
export function setDataset(
    element: HTMLElement,
    dataset: { [key: string]: string }
): HTMLElement {
    if (dataset) for (const key in dataset) element.dataset[key] = dataset[key];

    return element;
}

/**
 * Set events to a DOM element
 * @param element DOM element to set events
 * @param events Object with event names and functions as values
 * @returns DOM element itself in order to chain methods
 * @example
 *      setEvents(element, {
 *          "click": () => console.log("Clicked!")
 *      });
 * 
 *      // Output on click: Clicked!
 */
export function setEvents(
    element: HTMLElement,
    events: { [key: string]: any }
): HTMLElement {
    if (events)
        for (const key in events) element.addEventListener(key, events[key]);

    return element;
}

/**
 * Set styles to a DOM element
 * @param element DOM element
 * @param styles Object with styles
 * @returns DOM element itself in order to chain methods
 * @example 
 *      setStyles(element, {
 *          "width": "100px",
 *          "height": "100px",
 *          "background-color": "red"
 *      });
 * 
 *      console.log(element.style.width); // 100px
 *      console.log(element.style.height); // 100px
 *      console.log(element.style.backgroundColor); // red   
 */
export function setStyles(
    element: HTMLElement,
    styles: { [key: string]: string }
): HTMLElement {
    if (styles) for (const key in styles) element.style[key] = styles[key];

    return element;
}

/**
 * Set classes to a DOM element
 * @param element DOM element to set classes
 * @param classes Array with classnames
 * @returns DOM element itself in order to chain methods
 * @example
 *      setClasses(element, ["class1", "class2"]);
 *      // element.className = "class1 class2";
 */
export function setClasses(
    element: HTMLElement,
    classes: string[]
): HTMLElement {
    if (classes) 
        classes.forEach((cl) => element.classList.add(cl));

    return element;
}

/**
 * Remove the node matching the selector
 * @param selector a query selector to match the node to remove
 * @returns a promise representing if the node was removed
 * @example
 *      removeNode(".my-class")
 *     .then(() => {    
 *          console.log("Node removed");         
 *      }).catch(() => { console.log("Node not found"); });
 */
export async function remove(selector): Promise<void> {
    const comp = document.querySelector(selector);
    if (comp == null)
        return new Promise((resolve, reject) => reject("No element found"));

    comp.parentNode.removeChild(comp);
    return new Promise((resolve) => resolve());
}

/**
 * Remove all the NODEs matching the selector
 * @param selector a query selector to find the elements
 * @returns Promise with the number of elements removed
 * @example
 *      removeAll("div")
 *      .then(n => console.log(n));
 *      // => 3
 */
export async function removeAll(selector: string): Promise<number> {
    const comps = document.querySelectorAll(selector);
    if (comps == null) return new Promise((resolve, reject) => reject(0));

    let count = 0;
    comps.forEach((comp) => {
        comp.parentNode.removeChild(comp);
        count++;
    });

    return new Promise((resolve) => resolve(count));
}

/**
 * Execute a function for each element matching the selector
 * @param selector a query selector to find the elements
 * @param funct Function to execute for each element
 * @returns Promise with the success of the operation
 * @example
 *     forEach("div", (el) => console.log(el.id));
 *     // "div1", "div2", "div3"  
 */
export function forAll(selector, funct): Promise<void> {
    const comps = document.querySelectorAll(selector);
    if (comps == null) 
        return new Promise((resolve, reject) => reject("No element found"));
    
    comps.forEach((comp) => funct(comp));
    return new Promise((resolve) => resolve());
}
