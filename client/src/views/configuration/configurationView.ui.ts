import { App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setClasses, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { ThemeChooser } from "./components/themeChooser.js";
import { WallpaperGallery } from "./components/wallpaperGallery.js";

export default class ConfigurationView extends UIComponent {

    public constructor() {
        super({
            type: "view",
            id: "configuration",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },

        });
    }

    public show(params: string[], container: UIComponent): void {
       
        const menu = this.createMenu();
        const content = new UIComponent({
            type: "div",
            classes: ["backdrop","box-column", "box-y-center"],
            styles: {
                width: "calc(100% - 16rem)",
                height: "100%",
                overflow: "auto",
                paddingBottom: "10rem",
                background: "rgba(0,0,0,0.05)",
                opacity: "0",
                transition : "opacity var(--slow)",
            },
        });

        setTimeout(() => {
            menu.element.style.opacity = "1";
        }, 100);
        this.createAppearenceView(content);

        this.appendChild(menu);
        this.appendChild(content);
        this.appendTo(container);
    }


    private createMenu(): UIComponent {
        const menu = new UIComponent({
            type: "div",
            id: "config-menu",
            classes: ["box-column", "box-y-center"],
            styles: {
                opacity: "0",
                transition : "opacity var(--medium)",
            },
        });

        const title = new UIComponent({
            type: "h1",
            text: App.getBundle().configuration.CONFIGURATION,
            classes: ["box-column", "box-y-start", "box-x-center"],
            styles: {
                width: "calc(80% - 1rem)",
                opacity: "0.85",
                height: "2rem",
                padding: "2rem 0",
                borderBottom: ".1rem solid rgba(0,0,0,0.05)",
                marginBottom: "1rem",
            }
        });

        const appearenceOption = new UIComponent({
            type: "button",
            text: getMaterialIcon("palette",{fill: "#fafafa", size : "1rem"}).toHTML() + App.getBundle().configuration.APPEARANCE,
            classes: ["option","selected","box-row", "box-y-center"],
        });

        const userOption = new UIComponent({
            type: "button",
            text: getMaterialIcon("user",{fill: "#fafafa", size : "1rem"}).toHTML() + App.getBundle().configuration.USER,
            classes: ["option","box-row", "box-y-center"],
        });


        menu.appendChild(title);
        menu.appendChild(appearenceOption);
        menu.appendChild(userOption);

        return menu;
    }

    private createAppearenceView(parent : UIComponent){

        const wallPaperTitle = new UIComponent({
            type: "h1",
            text: App.getBundle().configuration.WALLPAPERS,
            styles: {
                width: "100%",
                padding: "2rem 3.7rem",
            }   
        });

        const wallpaperGallery = new WallpaperGallery();
        const themeTitle = new UIComponent({
            type: "h1",
            text: App.getBundle().configuration.THEME,
            styles: {
                width: "100%",
                padding: "2rem 3.7rem",
            }   
        });

        const themeChooser = new ThemeChooser();       
        
        parent.appendChild(wallPaperTitle);
        parent.appendChild(wallpaperGallery);
        parent.appendChild(themeTitle);
        parent.appendChild(themeChooser);

        setTimeout(() => {
            parent.element.style.opacity = "1";
        }, 100);
    }



}