import { Config } from "../../../config/config.js";
import { IObserver } from "../core/observable/observer.js";
import { UIComponent } from "../components/uicomponent.js";

/**
 * Material Icons properties
 * @property fill The fill color of the icon
 * @property size The size of the icon
 * @property classes The classes of the icon
 * @property svg The svg content of the icon [optional]
 */
export interface MaterialIconsProperties {
    fill?: string | "#202020";
    size: string;
    classes?: string[] | [];
    svg?: string | "";
}

/**
 * Material icon loader observer
 */
export class MaterialIconsLoader implements IObserver {
    
    public collection;

    public constructor(){
        this.collection = null;
    }

    async update(){
           
        if(!this.collection){
            this.collection = await fetch(Config.Path.icons + "materialicons.json").then((response) => response.json());                        
        }
        
    }

}

/**
 * Material Icons utility class
 */
export default class MaterialIcons {
    
    private observer : MaterialIconsLoader;
    private static _instance : MaterialIcons;

    private constructor(){
        this.observer = new MaterialIconsLoader();
    }

    public static get instance() : MaterialIcons {
                    
        if(!MaterialIcons._instance){
            MaterialIcons._instance = new MaterialIcons();
        }

        return MaterialIcons._instance;
    }

    public get loader() : MaterialIconsLoader {
        return this.observer;
    }

    /**
     * Get collection of Material Icons
     * @returns The collection of Material Icons
     * @example
     *   MaterialIcons.collection();
     *  
     *  // Returns
     * {
     *   "add": "<svg>...</svg>",
     *  "add_circle": "<svg>...</svg>",
     * ...
     * }
     */
    public get collection() : any {
        return this.observer.collection;
    }
    
    /**
     * Get a Material Icons SVG by name.
     * @param name The name of the icon.
     * @param properties The properties of the icon.
     * @returns The container of the SVG as a UIComponent.
     */ 
    public static get(name: string , properties: MaterialIconsProperties): UIComponent {
                
        properties.svg = MaterialIcons.instance.collection[name] || "";
        let text : string = createSVG(properties);
        const icon = new UIComponent({
            type: "div",
            classes: ["icon", "box-center"],
            text: text,
        });
        
        return icon;
    }
}

/**
 * Create svg in 24 x 24 viewBox
 * @param properties properties
 * @returns svg inside a string
 * @example
 *    createSvg({
 *        fill: '#202020',
 *        size: '24',
 *        classes: ['material-icons'],
 *        svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>'
 *    });
 *    // returns: <svg viewBox="0 0 24 24" class="material-icons">
 */
export function createSVG(properties: MaterialIconsProperties): string {
    const svg = `
    <svg class="${properties?.classes?.join(" ")}" width="${
        properties.size
    }" height="${properties.size}" viewBox="0 0 24 24" fill="${
        properties.fill
    }" xmlns="http://www.w3.org/2000/svg">
    ${properties.svg}
    </svg>
    `;
    return svg;
}