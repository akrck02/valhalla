import { Configurations } from "../../../config/config.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export class WallpaperGallery extends UIComponent {
    public constructor(configurations : Configurations) {
        super({
            type: "div",
            id: "wallpaper-gallery",
            classes: ["box-row"],
        });

        for (let i = 1; i < 19; i++) {
            const wallpaper = this.createWallpaperGalleryItem(configurations, "wall" + i + "-min.png", "wall" + i +".png");
            
            if(configurations.getConfigVariable("WALLPAPER") == "wall" + i + ".png") {
                wallpaper.element.classList.add("selected");
            }
        
            this.appendChild(wallpaper);
        }

    }


    private createWallpaperGalleryItem(configurations : Configurations, preview: string, file : string): UIComponent {
        const wallpaper = new UIComponent({
            type: "img",
            classes: ["wallpaper-gallery-item"],
            attributes: {
                src: configurations.PATHS.WALLPAPERS + preview,
            },
            data: {
                file: file,
            },
            events: {
                click: () => {
                    document.body.style.backgroundImage = "url(" + configurations.PATHS.WALLPAPERS + file + ")";
                    configurations.setWallpaper(file);

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
                    
                    const light = document.querySelector("button.mode-select#light");
                    light?.classList.remove("selected");
                    
                    const dark = document.querySelector("button.mode-select#dark");
                    dark?.classList.add("selected");
                }
            }
        });

        if (configurations.BASE.WALLPAPER === file) {
            wallpaper.element.classList.add("selected");
        }

        return wallpaper;
    }

}
