import { Configurations } from "../../config/config.js";
import { setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class ViewerView extends UIComponent {

    public constructor() {
        super({
            type : "view", 
            classes: ["box-row"],
            styles: {
                width : "100%",
                height : "100%",
                backdropFilter: "blur(1rem)",
            }
        });
    }

    public show(params : string[], container : UIComponent): void {

        const iframe = new UIComponent({
            type : "iframe",
            attributes : {
                src : Configurations.PATHS.WEB + "./pdfjs/web/viewer.html?file=test.pdf"
            },
            styles : {
                width : "100%",
                height : "100%",
                border : "none",
                opacity: "0",
                transition : "opacity var(--slow)"
            }
        });

        setTimeout(() => {
            setStyles(iframe.element, {
                opacity: "1",
            });
        }, 100);

        this.appendChild(iframe);
        container.appendChild(this);
    }
}