import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class QrV extends UIComponent {

    public constructor() {
        super({
            type: "view",
            classes: ["box-column","box-center","backdrop"],
            styles: {
                padding: "2rem",
                width: "100%",
                height: "100%",
                opacity: "0",
                transition: "opacity var(--slow)"
            },
        });
    }

    public show(params : string[], container : UIComponent): void {
        const img = new UIComponent({
            type: "img",
            attributes : {
                src: Configurations.PATHS.IMAGES + "qr.svg"
            },

            styles: {
                width: "20rem",
                opacity: ".8"
            }
        })


        this.appendChild(img);
        container.appendChild(this)

        setTimeout(() => {
            this.element.style.opacity = ".8";
        }, 100);
    };
} 