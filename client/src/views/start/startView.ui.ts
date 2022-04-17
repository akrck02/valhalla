import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class StartView extends UIComponent {

    constructor() {
        super({
            type: "view",
            id: "start",
            classes: ["box-column","box-center"],
            styles: {
                width: "100%",
                height: "100%",
            }
        });

    }

    public async show(params : string[], container : UIComponent): Promise<void> {
        this.showLogo();
        this.appendTo(container);
    }


    public showLogo(): void {

        const box = new UIComponent({
            type: "div",
            id: "start-box",
            classes: ["box-column","box-center"],
            styles: {
                opacity: "0",
                transition: "opacity var(--slow)",
            }
        });

        const logo = new UIComponent({
            type: "img",
            id: "logo",
            styles: {
                width: "10rem",
            },
            attributes: {
                src: Configurations.PATHS.ICONS + "logo-light.png",
            }
        });

        const title = new UIComponent({
            type: "h1",
            id: "title",
            text: "Hi there! Welcome to Valhalla!",
            styles: {
                fontSize: "1.2rem",
            }
        });

        const next = getMaterialIcon("back", {
            size: "1.35rem",
            fill: "#fff",
        });

        setStyles(next.element, {
            transform: "rotate(180deg)",
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: "50%",
            cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.05)",
        });

        logo.appendTo(box);
        title.appendTo(box);
        next.appendTo(box);

        setTimeout(() => {
            setStyles(box.element, {
                opacity: "1",
            });
        }, 250);

        box.appendTo(this);
    }


    showThemeChooser() {

    }

    showSecretKeySelector() {

    }


}