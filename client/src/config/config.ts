import { APP } from "../app.js";
import { setDataset, setStyles } from "../lib/gtd-ts/web/uicomponent.js";

export enum ENVIROMENT {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
}

export class Configurations {
    //global runtime configurations
    public BASE;
    public PATHS;
    public VIEWS;
    public API;

    public constructor() {
        this.declareConfig();
        this.declarePaths();
        this.declareApi();
        this.declareViews();
    }

    private declareConfig() {
        this.BASE = {
            APP_NAME: "Vallhala",
            APP_VERSION: "v1.0",
            HOST: "127.0.0.1",
            PORT: 80,
            URL: location.href,
            ENVIROMENT: ENVIROMENT.DEVELOPMENT,
            DEBUG: true,
            LOG_LEVEL: "debug",
            LOG_FILE: "app.log",
            THEME: "light",
            TERMINAL_VISIBLE: false,
        };
    }

    private declarePaths() {
        this.PATHS = {};
        this.PATHS["ROOT"] = "../client/";
        this.PATHS["LOGS"] = this.PATHS["ROOT"] + "logs/";
        this.PATHS["RESOURCES"] = this.PATHS["ROOT"] + "resources/";
        this.PATHS["FONTS"] = this.PATHS["RESOURCES"] + "fonts/";
        this.PATHS["IMAGES"] = this.PATHS["RESOURCES"] + "images/";
        this.PATHS["ICONS"] = this.PATHS["RESOURCES"] + "icons/";
        this.PATHS["WALLPAPERS"] = this.PATHS["RESOURCES"] + "wallpapers/";
        this.PATHS["VIDEOS"] = this.PATHS["RESOURCES"] + "videos/";
        this.PATHS["AUDIOS"] = this.PATHS["RESOURCES"] + "audios/";
        this.PATHS["JSON"] = this.PATHS["RESOURCES"] + "json/";
    }

    private declareApi() {
        this.API = {};
        this.API["URL"] = "http://127.0.0.1:3333/api/v1/";
        this.API["GET_USER_TASKS"] = this.API["URL"] + "get/user/tasks/";
        this.API["GET_USER_TASKS_FROM_CATEGORY"] = this.API["URL"] + "get/user/tasks/from/category/";
        this.API["GET_USER_TASK_CATEGORIES"] = this.API["URL"] + "get/user/task/categories/";
    }

    private declareViews() {
        this.VIEWS = {};
        this.VIEWS["BASE_URL"] = "../web/index.html#/";
        this.VIEWS["TASKS"] = this.VIEWS["BASE_URL"] + "tasks/";
        this.VIEWS["CALENDAR"] = this.VIEWS["BASE_URL"] + "calendar/";
        this.VIEWS["TEAMS"] = this.VIEWS["BASE_URL"] + "teams/";
        this.VIEWS["PROJECTS"] = this.VIEWS["BASE_URL"] + "projects/";
        this.VIEWS["CONFIGURATION"] = this.VIEWS["BASE_URL"] + "configuration/";
        this.VIEWS["TERMINAL"] = this.VIEWS["BASE_URL"] + "terminal/";
        this.VIEWS["ERROR"] = this.VIEWS["BASE_URL"] + "error/";
    } 

    public toggleTheme() {
        if (this.BASE.WALLPAPER){
            return;
        }

        this.setTheme((this.BASE.THEME === "light") ? "dark" : "light")
    }

    public setTheme(theme : string) {
        this.BASE.THEME = theme;

        this.addConfigVariable("THEME", this.BASE.THEME);
        this.addConfigVariable("WALLPAPER", false);

        document.documentElement.dataset.theme = this.BASE.THEME;
    }

    public isDarkModeActive() {
        return this.BASE.THEME === "dark";
    }

    public setTerminalVisible(value: boolean) {
        

        this.BASE.TERMINAL_VISIBLE = value;
        this.addConfigVariable("TERMINAL_VISIBLE", this.BASE.TERMINAL_VISIBLE);

        if (this.BASE.TERMINAL_VISIBLE) {
            APP.router.terminal.show();
        } else {
            APP.router.terminal.hide();
        }
    }


    public toggleTerminal() {

        if(this.BASE.ENVIROMENT !== ENVIROMENT.DEVELOPMENT)
            return; 

        this.setTerminalVisible(!this.BASE.TERMINAL_VISIBLE);
        setDataset(document.documentElement, {"terminalVisible" : this.BASE.TERMINAL_VISIBLE});
    }

    
    public getConfig() {
        let localStorageConfiguration = JSON.parse(localStorage.getItem("vallhala-config"));

        if(!localStorageConfiguration) {
            localStorageConfiguration = {}
        }

        return localStorageConfiguration;
    }

    public addConfigVariable(key: string, value: any) {
        let localStorageConfiguration = this.getConfig();
        const config = localStorageConfiguration;
        config[key] = value;
        localStorage.setItem("vallhala-config", JSON.stringify(config));
    }

    public getConfigVariable(key: string) {
        let localStorageConfiguration = this.getConfig();
        return localStorageConfiguration[key];
    }

    public setWallpaper(wallpaper: string) {
        
        if(!wallpaper){
            this.addConfigVariable("WALLPAPER", wallpaper);
            setStyles(document.body,{"background-image": "none"});
            return;
        }

        this.setTheme("dark");
        this.addConfigVariable("WALLPAPER", wallpaper);

        setStyles(document.body,{
            "background-image": "url(" + APP.configurations.PATHS.WALLPAPERS + wallpaper + ")"
        });
    }    

    public hasWallpaper() {
        const wallpaper = this.getConfigVariable("WALLPAPER") ;

        if(!wallpaper){
            return false;
        }

        return true;
    }
}
