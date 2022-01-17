import { APP } from "../../app.js";

export class AppearenceListener {

    private carrousel;
    private static MAX_WALLPAPERS: number = 25;

    public constructor() {
        this.carrousel = 1;
    }

    public nextWallpaper(): void {
        this.carrousel++;
        this.setWallpaper(this.carrousel);
    }

    public previousWallpaper(): void {
        this.carrousel--;
        this.setWallpaper(this.carrousel);
    }

    public setWallpaper(index : number): void {
       
        this.carrousel = index;

        if (this.carrousel > AppearenceListener.MAX_WALLPAPERS) {
            this.carrousel = 1;
        }

        if(this.carrousel < 1){
            this.carrousel = AppearenceListener.MAX_WALLPAPERS;
        }

        APP.configurations.setWallpaper(`wall${this.carrousel}.png`);
        document.body.classList.add("loading");
        setTimeout(() => document.body.classList.remove("loading"), 300);
    }


    public toggleTheme(): void {
        if (!APP.configurations.hasWallpaper())
            APP.configurations.toggleTheme();
    }    

}