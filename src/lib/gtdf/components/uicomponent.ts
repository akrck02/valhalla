import DOM from "./dom.js";

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
            DOM.setClasses(element, this.classes);
        }

        if (this.attributes) {
            DOM.setAttributes(element, this.attributes);
        }

        if (this.styles) {
            DOM.setStyles(element, this.styles);
        }

        if (this.data) {
            DOM.setDataset(element, this.data);
        }

        if (this.events) {
            DOM.setEvents(element, this.events);
        }

        return element;
    }

    /**
     * Get the HTML code of the component.
     * @returns The HTML code of the component
     */
    public toHTML(): string {
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

    /**
     * Get the value of the component.
     * @returns The value of the component
     */
    public getValue(): string {
     
        if(this.element instanceof HTMLInputElement) {
            return this.element.value;
        }    
     
        return this.element.innerHTML;
    }

    /**
     * Set the attributes to the given component.
     * @param options Object with attributes and values
     * @returns UIComponent in order to chain methods
     */
    public setAttributes(
        options : { [key: string]: string }
    ): UIComponent {
        this.element = DOM.setAttributes(this.element, options);
        return this;
    }

    /**
     * Remove the attributes to the given component.
     * @param options list of atributtes to be removed
     * @returns UIComponent in order to chain methods
     * @example
     *  mycomponent.removeAttributes(["id", "alt"]);
     */
    public removeAttributes(
        options : string[]
    ): UIComponent {
        this.element = DOM.removeAttributes(this.element, options);
        return this;
    }

    /**
     * Set the HTML data attributes to the given component.
     * @param dataset Object with data attributes and values
     * @returns UIComponent in order to chain methods
     * @example
     *    mycomponent.setDataset({
     *       "id": "1",
     *      "name": "John"
     *   });
     */
    public setDataset(
        dataset: { [key: string]: string }
    ): UIComponent {
        this.element = DOM.setDataset(this.element, dataset);
        return this;
    }

    /**
     * Remove the HTML data attributes to the given component.
     * @param dataset list of data attributes to be removed
     * @returns UIComponent with data attributes in order to chain methods
     * @example
     *   mycomponent.removeDataset(["id", "name"]);
     */
    public removeDataset(
        dataset: string[]
    ): UIComponent {
        this.element = DOM.removeDataset(this.element, dataset);
        return this;
    }

    /**
     * Set the events to the given component.
     * @param events Object with events and listener functions
     * @returns UIComponent in order to chain methods
     * @example
     *    mycomponent.setEvents({
     *         "click": () => console.log("Clicked!")
     *    });
     */
    public setEvents(
        events: { [key: string]: (event: Event) => void } | {}
    ): UIComponent {
        this.element = DOM.setEvents(this.element, events);
        return this;
    }

    /**
     * Remove the events to the given component.
     * @param events list of events to be removed
     * @returns UIComponent in order to chain methods
     * @example mycomponent.removeEvents(["click"]);
     */
    public removeEvents(
        events: string[]
    ): UIComponent {
        this.element = DOM.removeEvents(this.element, events);
        return this;
    }

    /**
     * Set the classes to the given component.
     * @param styles Object with styles and values
     * @returns UIComponent in order to chain methods
     * @example
     * mycomponent.setStyles({
     *     "color": "red",
     *    "font-size": "12px"
     * });
     */
    public setStyles(
        styles: { [key: string]: string }
    ): UIComponent {
        this.element = DOM.setStyles(this.element, styles);
        return this;
    }

    /**
     * Remove the styles to the given component.
     * @param styles list of styles to be removed
     * @returns UIComponent in order to chain methods
     * @example
     * mycomponent.removeStyles(["color", "font-size"]);
     */
    public removeStyles(
        styles: string[]
    ): UIComponent {
        this.element = DOM.removeStyles(this.element, styles);
        return this;
    }


    /**
     * Set the classes to the given component.
     * @param classes List of classes to be added
     * @returns UIComponent in order to chain methods
     * @example mycomponent.setClasses(["class1", "class2"]);
     */
    public setClasses(
        classes: string[]
    ): UIComponent {
        this.element = DOM.setClasses(this.element, classes);
        return this;
    }

    /**
     * Remove the classes to the given component.
     * @param classes List of classes to be removed
     * @returns UIComponent in order to chain methods
     * @example mycomponent.removeClasses(["class1", "class2"]);
     */
    public removeClasses(
        classes: string[]
    ): UIComponent {
        this.element = DOM.removeClasses(this.element, classes);
        return this;
    }

    /**
     * Remove the component matching the given component.
     * @param selector a query selector to match the node to remove
     * @returns a promise representing if the node was removed
     * @example mycomponent.remove(".mycomponentclass");
     */
    public remove(selector : string) : UIComponent {
        this.element.parentNode.removeChild(this.element);
        return this;
    }


}
