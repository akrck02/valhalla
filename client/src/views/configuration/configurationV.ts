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
                overflow: "auto",
                paddingBottom: "10rem",
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
            text: "Appearence",
            classes: ["option","selected","box-row", "box-y-center"],
        });

        const userOption = new UIComponent({
            type: "button",
            text: "User",
            classes: ["option","box-row", "box-y-center"],
        });


        menu.appendChild(title);
        menu.appendChild(appearenceOption);
        menu.appendChild(userOption);

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