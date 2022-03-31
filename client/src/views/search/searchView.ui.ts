import { APP, App } from "../../app.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class SearchView extends UIComponent {


    constructor() {
        super({
            type: "view",
            id: "search",
            classes: ["box-column", "box-y-center"],
        });
    }


    public show(params : string[], container : UIComponent): void {
    
        APP.router.osNavbar.hideSearchBar();

        const bar = new UIComponent({
            type: "div",
            classes: ["box-row", "box-x-center", "box-y-center"],
            styles: {
                width: "40%",
                height: "3rem",
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "0rem 0.5rem",
                borderRadius: "0.5rem",
                opacity: "0.75",
                marginTop: "10%",
            },
        });

        const input = new UIComponent({
            type: "input",
            classes: ["box-row", "box-x-center", "box-y-center"],
            attributes: {
                type: "text",
                placeholder: App.getBundle().os.SEARCHBAR_PLACEHOLDER,
            },
            styles: {
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                color: "#fff",
                background: "rgba(255,255,255,0)",
                backdropFilter: "none",
            },
        });

        const button = getMaterialIcon("search", {
            size: "1.85rem",
            fill: "#fff",
        });

        this.appendChild(bar);
        bar.appendChild(input);
        bar.appendChild(button);
        
        this.appendTo(container);
    }

}