import { App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import { setClasses, setEvents, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export class WallpaperGallery extends UIComponent {
    public constructor() {
        super({
            type: "div",
            id: "wallpaper-gallery",
            classes: ["box-row"],
        });

        const noWallpaper = this.createNoWallpaperGalleryItem();
        this.appendChild(noWallpaper);

        for (let i = 1; i < 19; i++) {
            const wallpaper = this.createWallpaperGalleryItem("wall" + i + "-min.png", "wall" + i +".png");
            
            if(Configurations.getWallpaper() == "wall" + i + ".png") {
                wallpaper.element.classList.add("selected");
            }
        
            this.appendChild(wallpaper);
        }

  

        const dark = new UIComponent({
            type: "button",
            id: "dark",
            classes: ["mode-select", "box-row", "box-y-center"],
            text: App.getBundle().configuration.DARK + getMaterialIcon("dark_mode",{fill:"#fff",size:"1.25rem"}).toHTML(),
        });

        setEvents(dark.element, {
            click: () => {
                Configurations.setTheme("dark");
                Configurations.setWallpaper(undefined);
                dark.element.classList.add("selected");
            },
        });

        if (!Configurations.getWallpaper()) {
            setClasses(dark.element, ["selected"]);
        } 
        //this.appendChild(dark);

    }

    /**
     * Create a wallpaper gallery item
     * @param preview the preview image
     * @param file the wallpaper file
     * @returns the wallpaper gallery item
     */
    private createWallpaperGalleryItem(preview: string, file : string): UIComponent {
        const wallpaper = new UIComponent({
            type: "img",
            classes: ["wallpaper-gallery-item"],
            attributes: {
                src: Configurations.PATHS.WALLPAPERS + preview,
            },
            data: {
                file: file,
            },
            events: {
                click: () => {
                    document.body.style.backgroundImage = "url(" + Configurations.PATHS.WALLPAPERS + file + ")";
                    Configurations.setWallpaper(file);

                    const wallpapers = document.querySelectorAll("div#wallpaper-gallery img.wallpaper-gallery-item");
                    wallpapers?.forEach((wallpaper) => {
                        wallpaper.classList.remove("selected");

                        if ((wallpaper as HTMLElement).dataset.file === file) {
                            wallpaper.classList.add("selected");
                        }

                        document.body.classList.add("loading");
                        setTimeout(() => {
                            document.body.classList.remove("loading");
                        }, 500);
                    });

                }
            }
        });

        if (Configurations.getWallpaper() === file) {
            wallpaper.element.classList.add("selected");
        }

        return wallpaper;
    }


        /**
     * Create a wallpaper gallery item
     * @param preview the preview image
     * @param file the wallpaper file
     * @returns the wallpaper gallery item
     */
    private createNoWallpaperGalleryItem(): UIComponent {
        const wallpaper = new UIComponent({
            type: "div",
            classes: ["wallpaper-gallery-item","box-center","box-column"],
            text: getMaterialIcon("block",{fill:"#fff",size:"1.25rem"}).toHTML() ,
            styles: {
                background: "rgba(255,255,255,0.025)",
                fontSize: ".75rem",
                boxShadow: "none",
                padding: "0.5rem",
            },
            events: {
                click: () => {
                    document.body.style.backgroundImage = "none";
                    Configurations.setWallpaper(undefined);

                    const wallpapers = document.querySelectorAll("div#wallpaper-gallery img.wallpaper-gallery-item");
                    wallpapers?.forEach((wallpaper) => {
                        wallpaper.classList.remove("selected");
                    });

                    document.body.classList.add("loading");
                    setTimeout(() => {
                            document.body.classList.remove("loading");
                    }, 500);

                }
            }
        });

        const message = new UIComponent({
            type: "div",
            classes: ["box-row","box-center","box-column"],
            text: "No Wallpaper",
            styles: {paddingTop: "0.5rem",}
        });

        wallpaper.appendChild(message);

        return wallpaper;
    }
    
}
