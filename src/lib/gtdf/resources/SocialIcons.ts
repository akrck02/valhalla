import { UIComponent } from "../components/uicomponent.js";


export interface SocialIconsProperties {
    fill?: string | "#202020";
    size: string;
    classes?: string[] | [];
    svg?: string | "";
}

export class SocialIcons {
  

    /**
     * Get a Material Icons SVG by name.
     * @param name The name of the icon.
     * @param properties The properties of the icon.
     * @returns The container of the SVG as a UIComponent.
     */ 
    public static get(name: string , properties: SocialIconsProperties): UIComponent {
    
        properties.svg = SOCIAL_ICONS[name] || "";
        let text : string = SocialIcons.createSVG(properties);
        const icon = new UIComponent({
            type: "div",
            classes: ["icon", "box-center"],
            text: text,
        });
        
        return icon;
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
    private static createSVG(properties: SocialIconsProperties): string {
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


}

const SOCIAL_ICONS = {
    "twitter" : `<path d="M21 6.2145C20.3385 6.5075 19.627 6.703 18.8765 6.7955C19.6395 6.3425 20.2265 5.62 20.502 4.7665C19.788 5.185 18.997 5.4925 18.1555 5.6545C17.4835 4.942 16.525 4.5 15.463 4.5C13.423 4.5 11.7695 6.139 11.7695 8.16C11.7695 8.446 11.803 8.7245 11.866 8.995C8.79704 8.841 6.07504 7.382 4.25404 5.168C3.93404 5.709 3.75403 6.3425 3.75403 7.011C3.75403 8.2815 4.40454 9.4 5.39654 10.059C4.79104 10.0405 4.22103 9.872 3.72203 9.602C3.72203 9.613 3.72203 9.6295 3.72203 9.645C3.72203 11.4205 4.99553 12.899 6.68353 13.2355C6.37503 13.32 6.04903 13.367 5.71303 13.367C5.47453 13.367 5.24204 13.34 5.01704 13.2995C5.48704 14.7505 6.85053 15.811 8.46603 15.8425C7.20203 16.8225 5.61003 17.4095 3.87903 17.4095C3.58004 17.4095 3.28754 17.3925 2.99854 17.3575C4.63404 18.393 6.57603 19 8.66053 19C15.453 19 19.169 13.422 19.169 8.583C19.169 8.4245 19.164 8.2665 19.1565 8.1105C19.8815 7.5985 20.5065 6.9525 21 6.2145Z" fill="#inherit"/>`,
    "instagram" : `<path d="M8.25 2.5C5.08319 2.5 2.5 5.08319 2.5 8.25V15.75C2.5 18.9164 5.0831 21.5 8.25 21.5H15.75C18.9165 21.5 21.5 18.9165 21.5 15.75V8.25C21.5 5.0831 18.9164 2.5 15.75 2.5H8.25ZM8.25 4H15.75C18.1056 4 20 5.8939 20 8.25V15.75C20 18.1055 18.1055 20 15.75 20H8.25C5.8939 20 4 18.1056 4 15.75V8.25C4 5.89381 5.89381 4 8.25 4ZM17 6C16.4475 6 16 6.4475 16 7C16 7.5525 16.4475 8 17 8C17.5525 8 18 7.5525 18 7C18 6.4475 17.5525 6 17 6ZM12 7C9.24759 7 7 9.24759 7 12C7 14.7524 9.24759 17 12 17C14.7524 17 17 14.7524 17 12C17 9.24759 14.7524 7 12 7ZM12 8.5C13.9416 8.5 15.5 10.0584 15.5 12C15.5 13.9416 13.9416 15.5 12 15.5C10.0584 15.5 8.5 13.9416 8.5 12C8.5 10.0584 10.0584 8.5 12 8.5Z" fill="INHERIT"/>`,
    "telegram" : `<path d="M18.9932 6.58221C19.0223 6.40736 18.9567 6.23016 18.8208 6.11645C18.6848 6.00274 18.4988 5.96952 18.3318 6.02914L4.33184 11.0291C4.14321 11.0965 4.01299 11.2699 4.00091 11.4699C3.98884 11.6698 4.09725 11.8576 4.2764 11.9472L8.2764 13.9472C8.43688 14.0275 8.62806 14.0156 8.77735 13.916L12.0977 11.7024L10.1096 14.1877C10.022 14.2971 9.98442 14.4382 10.0059 14.5767C10.0274 14.7152 10.1061 14.8383 10.2227 14.916L16.2227 18.916C16.3638 19.0101 16.5431 19.0262 16.6988 18.9588C16.8545 18.8914 16.9653 18.7496 16.9932 18.5822L18.9932 6.58221Z" fill="inherit"/>`,
    "patreon" : `<g clip-path="url(#clip0_22_5)"><path d="M6.82097 4.28125V19.6781H4V4.28125H6.82097ZM14.2286 4.28125C17.416 4.28125 20 6.86521 20 10.0527C20 13.2402 17.416 15.8241 14.2286 15.8241C11.0411 15.8241 8.45714 13.2402 8.45714 10.0527C8.45714 6.86521 11.0411 4.28125 14.2286 4.28125Z" fill="inherit"/></g><defs><clipPath id="clip0_22_5"><rect width="16" height="16" fill="none" transform="translate(4 4)"/></clipPath></defs>`,
} 