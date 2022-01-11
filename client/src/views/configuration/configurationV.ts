import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/web/uicomponent.js";

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
            classes: ["box-column", "box-y-center"],
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

        const wallpaperGallery = this.crateWallpaperGallery(configurations);

        const themeTitle = new UIComponent({
            type: "h1",
            text: "Theme",
            styles: {
                width: "100%",
                padding: "2rem 3.7rem",
            }   
        });
        
        parent.appendChild(wallPaperTitle);
        parent.appendChild(wallpaperGallery);
        parent.appendChild(themeTitle);
    }


    private crateWallpaperGallery(configurations : Configurations): UIComponent {
        const gallery = new UIComponent({
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

        gallery.appendChild(wallpaper1);
        gallery.appendChild(wallpaper2);
        gallery.appendChild(wallpaper3);
        gallery.appendChild(wallpaper4);
        gallery.appendChild(wallpaper5);
        gallery.appendChild(wallpaper6);

        return gallery;
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
                }
            }
        });

        if (configurations.BASE.WALLPAPER === file) {
            wallpaper.element.classList.add("selected");
        }

        return wallpaper;
    }

}