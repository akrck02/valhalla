import { App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import {
    UIComponent,
    setClasses,
    setEvents,
} from "../../../lib/gtd-ts/web/uicomponent.js";

export class ThemeChooser extends UIComponent {

    private dark: UIComponent;
    private light: UIComponent;

    public constructor() {
        super({
            classes: ["box-row", "box-x-start"],
            styles: {
                width: "100%",
                padding: "0 2.5rem",
            },
        });

        this.dark = new UIComponent({
            type: "button",
            id: "dark",
            classes: ["mode-select", "box-row", "box-y-center"],
            text: App.getBundle().configuration.DARK + getMaterialIcon("dark_mode",{fill:"#fff",size:"1.25rem"}).toHTML(),
        });

        setEvents(this.dark.element, {
            click: () => {
                Configurations.setTheme("dark");
                Configurations.setWallpaper(undefined);
                this.resetWallpapers();
                this.resetThemes();
                this.dark.element.classList.add("selected");
            },
        });

        this.light = new UIComponent({
            type: "button",
            id: "light",
            classes: ["mode-select", "box-row", "box-y-center"],
            text: App.getBundle().configuration.LIGHT + getMaterialIcon("light_mode",{fill:"#fff",size:"1.25rem"}).toHTML(),
        });

        setEvents(this.light.element, {
            click: () => {
                Configurations.setTheme("light");
                Configurations.setWallpaper(undefined);
                this.resetWallpapers();
                this.resetThemes();
                this.light.element.classList.add("selected");
            },
        });

        if (Configurations.isDarkModeActive()) {
            setClasses(this.dark.element, ["selected"]);
        } else {
            setClasses(this.light.element, ["selected"]);
        }

        this.appendChild(this.dark);
        this.appendChild(this.light);
    }

    private resetWallpapers() {
        const wallpapers = document.querySelectorAll(
            "div#wallpaper-gallery img.wallpaper-gallery-item"
        );
        wallpapers?.forEach((wallpaper) => wallpaper.classList.remove("selected"));
    }

    private resetThemes() {
        this.dark.element.classList.remove("selected");
        this.light.element.classList.remove("selected");

    }
}
