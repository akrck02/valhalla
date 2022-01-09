import { UIComponent } from "../../lib/web/uicomponent.js";

export default class ErrorV {
    public show(params : string[], container : UIComponent): void {
        const view = new UIComponent({
            type: "view",
            classes: ["box-center"],
            styles: {
                padding: "2rem",
                width: "100%",
                height: "100%",
            },
        });

        const title = new UIComponent({
            type: "h1",
            text: "Error 404: Page not found",
        });
        
        view.appendChild(title);
        view.appendTo(container);
    };
} 