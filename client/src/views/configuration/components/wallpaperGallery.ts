import { Configurations } from "../../../config/config.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export class WallpaperGallery extends UIComponent {
    public constructor(configurations : Configurations) {
        super({
            type: "div",
            id: "wallpaper-gallery",
            classes: ["box-row"],
        });

        const wallpaper1 = this.createWallpaperGalleryItem(configurations, "wall1-min.png", "wall1.png");
        const wallpaper2 = this.createWallpaperGalleryItem(configurations, "wall2-min.png", "wall2.png");
        const wallpaper3 = this.createWallpaperGalleryItem(configurations, "wall3-min.png", "wall3.png");
        const wallpaper4 = this.createWallpaperGalleryItem(configurations, "wall4-min.png", "wall4.png");
        const wallpaper5 = this.createWallpaperGalleryItem(configurations, "wall5-min.png", "wall5.png");
        const wallpaper6 = this.createWallpaperGalleryItem(configurations, "wall6-min.png", "wall6.png");

        this.appendChild(wallpaper1);
        this.appendChild(wallpaper2);
        this.appendChild(wallpaper3);
        this.appendChild(wallpaper4);
        this.appendChild(wallpaper5);
        this.appendChild(wallpaper6);

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
