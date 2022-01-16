import { Configurations } from "../../config/config.js";
import { setClasses, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { ThemeChooser } from "./components/themeChooser.js";
import { WallpaperGallery } from "./components/wallpaperGallery.js";

export default class ConfigurationV extends UIComponent {

    public constructor() {
        super({
            type: "view",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },

        });
    }

    public show(params: string[], container: UIComponent, configurations : Configurations): void {
       
        const menu = this.createMenu();
        const content = new UIComponent({
            type: "div",
            classes: ["backdrop","box-column", "box-y-center"],
            styles: {
                width: "calc(100% - 16rem)",
                height: "100%",
                background: "rgba(0,0,0,0.05)",
            },
        });

        this.createAppearenceView(configurations, content);

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
            
            },
        });

        const title = new UIComponent({
            type: "h1",
            text: "Configuration",
            classes: ["box-column", "box-y-start", "box-x-center"],
            styles: {
                width: "calc(80% - 2rem)",
                opacity: "0.85",
                height: "4rem",
                borderBottom: ".1rem solid rgba(0,0,0,0.05)",
            }
        });

        const appearenceOption = new UIComponent({
            type: "div",
            text: "Appearence",
            classes: ["box-row", "box-y-center"],
            styles: {
                width: "80%",
                height: "2.5rem",
                margin: ".5rem 0",
                borderRadius: "0.35rem",
                padding: "0 1rem",
                cursor: "pointer",
                background: "rgba(0,0,0,0.15)"
            },
        });

        menu.appendChild(title);
        menu.appendChild(appearenceOption);

        return menu;
    }

    private createAppearenceView(configurations : Configurations, parent : UIComponent){

        const wallPaperTitle = new UIComponent({
            type: "h1",
            text: "Wallpapers",
            styles: {
                width: "100%",
                padding: "2rem 3.7rem",
            }   
        });

        const wallpaperGallery = new WallpaperGallery(configurations);
        const themeTitle = new UIComponent({
            type: "h1",
            text: "Theme",
            styles: {
                width: "100%",
                padding: "2rem 3.7rem",
            }   
        });

        const themeChooser = new ThemeChooser(configurations);       
        
        parent.appendChild(wallPaperTitle);
        parent.appendChild(wallpaperGallery);
        parent.appendChild(themeTitle);
        parent.appendChild(themeChooser);
    }



}