import { Configurations } from "../../../config/config.js";
import {
    UIComponent,
    setClasses,
    setEvents,
} from "../../../lib/gtd-ts/web/uicomponent.js";

export class ThemeChooser extends UIComponent {

    private dark: UIComponent;
    private light: UIComponent;

    public constructor(configurations: Configurations) {
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
            classes: ["mode-select"],
            text: "Dark",
        });

        setEvents(this.dark.element, {
            click: () => {
                configurations.setTheme("dark");
                configurations.setWallpaper(undefined);
                this.resetWallpapers();
                this.resetThemes();
                this.dark.element.classList.add("selected");
            },
        });

        this.light = new UIComponent({
            type: "button",
            id: "light",
            classes: ["mode-select"],
            text: "Light",
        });

        setEvents(this.light.element, {
            click: () => {
                configurations.setTheme("light");
                configurations.setWallpaper(undefined);
                this.resetWallpapers();
                this.resetThemes();
                this.light.element.classList.add("selected");
            },
        });

        if (configurations.isDarkModeActive()) {
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
