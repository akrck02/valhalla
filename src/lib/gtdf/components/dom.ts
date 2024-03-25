export default class DOM {

    /**
     * Set HTML attributes to the given element.
     * @param element Element to set attributes
     * @param attributes Attributes to set 
     * @returns The element with attributes in order to chain methods
     */
    public static setAttributes(
        element: HTMLElement,
        attributes: { [key: string]: string }
    ): HTMLElement {

        if (!attributes)
            return element;

        for (const key in attributes)
            element.setAttribute(key, attributes[key]);

        return element;
    }

    /**
     * Remove the HTML attributes to the given component.
     * @param element The element to remove attributes
     * @param attributes list of data attributes to be removed
     * @returns DOM element in order to chain methods
     */
    public static removeAttributes(
        element: HTMLElement,
        attributes: string[]
    ): HTMLElement {

        if (!attributes)
            return element;
        
        attributes.forEach((attr) => element.removeAttribute(attr));
        return element;
    }

    /**
     * Set the classes to the given component.
     * @param element element to set classes to
     * @param classes list of classes to be set
     * @returns DOM element in order to chain methods
     */
    public static setClasses(
        element: HTMLElement,
        classes: string[]
    ): HTMLElement {

        if (!classes) 
            return element;    
        
        classes.forEach((cl) => element.classList.add(cl));
        return element;
    }

    /**
     * Remove the classes to the given component.
     * @param element element to remove classes to
     * @param classes list of classes to be removed
     * @returns DOM element in order to chain methods
     */
    public static removeClasses(
        element: HTMLElement,
        classes: string[]
    ): HTMLElement {

        if (!classes)
            return element;
        
        classes.forEach((cl) => element.classList.remove(cl));
        return element;
    }

    
    /**
     * Set the styles to the given component.
     * @param element element to set styles to
     * @param styles Object with style names and values
     * @returns DOM element with classes in order to chain methods
     */
    public static setStyles(
        element: HTMLElement,
        styles: { [key: string]: string }
    ): HTMLElement {
        if (!styles) 
            return element;

        for (const key in styles) 
            element.style[key] = styles[key];

        return element;
    }

    /**
     * Remove the classes to the given component.
     * @param element element to remove styles to
     * @param styles List of styles to be removed
     * @returns DOM element with classes in order to chain methods
     */
    public static removeStyles(
        element: HTMLElement,
        styles: string[]
    ): HTMLElement {
        if (!styles)
            return element;
        
        styles.forEach((style) => element.style.removeProperty(style));
        return element;
    }


    /**
     * Set the events to the given component.
     * @param element element to set events to
     * @param events Object with events and listener functions
     * @returns DOM element with classes in order to chain methods
     */
    public static setEvents(
        element: HTMLElement,
        events: { [key: string]: (event: Event) => void } | {}
    ): HTMLElement {
        if (!events)
            return element;
        
        for (const key in events) 
            element.addEventListener(key, events[key]);

        return element;
    }

    /**
     * Remove the events to the given component.
     * @param element element to remove events to
     * @param events List of events to be removed
     * @returns DOM element with classes in order to chain methods
     */
    public static removeEvents(
        element: HTMLElement,
        events: { [key: string]: (event: Event) => void } | {}
    ): HTMLElement {
        
        if (!events)
            return element;
        
        for (const key in events)
            element.removeEventListener(key, events[key]);

        return element;
    }


    /**
     * Set the HTML data attributes to the given component.
     * @param element element to set data attributes
     * @param dataset Object with data attributes and values
     * @returns DOM element with data attributes in order to chain methods
     */
    public static setDataset(
        element: HTMLElement,
        dataset: { [key: string]: string }
    ): HTMLElement {
        if (!dataset) 
            return element;

        for (const key in dataset) 
            element.dataset[key] = dataset[key];
    
        return element;
    }

    /**
     * Remove the HTML data attributes to the given component.
     * @param element element to set data attributes
     * @param dataset Object with data attributes and values
     * @returns DOM element with data attributes in order to chain methods
     */
    public static removeDataset(
        element: HTMLElement,
        dataset: string[]
    ): HTMLElement {
        if (!dataset)
            return element;
        
        dataset.forEach((data) => delete element.dataset[data]);
        return element;
    }

    /**
     * Remove all the NODEs matching the selector
     * @param selector a query selector to find the elements
     * @returns Promise with the number of elements removed
     * @example
     *    const removed = await UIComponent.removeAll("div");
     *    console.log(`removed ${removed} elements`);
     */
    public static async removeAll(selector : string) : Promise<number> {

        const comps = document.querySelectorAll(selector);
        if (!comps)
            return new Promise((resolve, reject) => reject(0));
    
        let count = 0;
        comps.forEach((comp) => {
            comp.parentNode.removeChild(comp);
            count++;
        });
    
        return new Promise((resolve) => resolve(count));
    }

    /**
     * Execute a function for each element matching the selector
     * @param selector a query selector to match the node to remove
     * @param funct Function to execute for each element
     * @returns a promise representing if the node was removed
     */
    public static async forAll(selector, funct): Promise<void> {
        
        const comps = document.querySelectorAll(selector);
        if (!comps) 
            return new Promise((resolve, reject) => reject("No element found"));
        
        for (let i = 0; i < comps.length; i++) {
            const comp = comps[i];
            await funct(comp);
        }

        return new Promise((resolve) => resolve());
    }

    /**
     * Remove the component matching the given component.
     * @param selector a query selector to match the node to remove
     * @returns a promise representing if the node was removed
     * @example
     *   const removed = await UIComponent.remove("div");
     *   console.log(`removed ${removed} elements`);
     */
    public static async remove(selector : string) : Promise<number> {
        const comp = document.querySelector(selector);
        if (comp == null)
            return new Promise((resolve, reject) => reject("No element found"));
    
        comp.parentNode.removeChild(comp);
        return new Promise((resolve) => resolve(1));
    }

}

export enum HTML {
    VIEW = "view",
    DIV = "div",
    SPAN = "span",
    INPUT = "input",
    BUTTON = "button",
    TEXTAREA = "textarea",
    SELECT = "select",
    OPTION = "option",
    FORM = "form",
    LABEL = "label",
    IMG = "img",
    A = "a",
    B = "b",
    TABLE = "table",
    THEAD = "thead",
    TBODY = "tbody",
    TR = "tr",
    TH = "th",
    TD = "td",
    I = "i",
    UL = "ul",
    LI = "li",
    NAV = "nav",
    HEADER = "header",
    FOOTER = "footer",
    SECTION = "section",
    ARTICLE = "article",
    ASIDE = "aside",
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    P = "p",
    HR = "hr",
    BR = "br",
    CANVAS = "canvas",
    SVG = "svg",
    PATH = "path",
    POLYGON = "polygon",
    POLYLINE = "polyline",
    CIRCLE = "circle",
    ELLIPSE = "ellipse",
    RECT = "rect",
    LINE = "line",
    TEXT = "text",
    TSPAN = "tspan",
    G = "g",
    MASK = "mask",
    PATTERN = "pattern",
    DEFS = "defs",
    SYMBOL = "symbol",
    USE = "use",
    CLIPPATH = "clipPath",
    STOP = "stop",
    LINEARGRADIENT = "linearGradient",
    RADIALGRADIENT = "radialGradient",
    FILTER = "filter",
    FEIMAGE = "feImage",
    FEMERGE = "feMerge",
    FEMERGENODE = "feMergeNode",
    FEGAUSSIANBLUR = "feGaussianBlur",
    FEOFFSET = "feOffset",
    FEDISPLACEMAP = "feDisplacementMap",
    FEPOINTLIGHT = "fePointLight",
    FESPOTLIGHT = "feSpotLight",
    FEDIFFUSELIGHTING = "feDiffuseLighting",
    FETURBULENCE = "feTurbulence",
    FECONVOLVEMATRIX = "feConvolveMatrix",
    FECOMPOSITE = "feComposite",
    FEFLOOD = "feFlood",
    FEMORPHOLOGY = "feMorphology",
    FEDISTANTLIGHT = "feDistantLight",
    FEDROPSHADOW = "feDropShadow",
    FEFUNCOLORMATRIX = "feFuncColorMatrix",
    FEFUNCA = "feFuncA",
    FEFUNCRGB = "feFuncR",
    FEFUNCG = "feFuncG",
    FEFUNCB = "feFuncB",
    FECONVOLVE = "feConvolve",
    FEMATRIX = "feMatrix",
    FESPECULARLIGHTING = "feSpecularLighting",
    FEPOINTLIGHTELEMENT = "fePointLightElement",
    FESPOTLIGHTELEMENT = "feSpotLightElement",
    FEDISTANTLIGHTELEMENT = "feDistantLightElement",
    FEFLOODELEMENT = "feFloodElement",
    FEGAUSSIANBLURELEMENT = "feGaussianBlurElement",
    FEMORPHOLOGYELEMENT = "feMorphologyElement",
    FEDROPSHADOWELEMENT = "feDropShadowElement",
    FETURBULENCEELEMENT = "feTurbulenceElement",

}