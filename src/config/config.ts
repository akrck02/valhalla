import { getLanguage, Language } from "../lang/language.js";
import { IObserver } from "../lib/gtdf/core/observable/observer.js";
import URLs from "../lib/gtdf/data/urls.js";

/**
 * Environment states
 */
export enum ENVIRONMENT {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
}

interface IVariables {
    animations : boolean;
    environment : ENVIRONMENT;
    language : string;
}

interface IBase {
    app_name : string;
    app_version : string;
    host : string;
    port : number;
    environment : ENVIRONMENT;
    debug : boolean;
    log_level : string;
    website : string;
    author : string;
}

interface IPath {
    url : string;
    app : string;
    resources : string;
    language : string;
    images : string;
    icons : string;
}

interface IViews {
    url : string;
    login : string;
    home : string;
    error : string;
    blank : string;
}

/**
 * Configuration for the application
 */
export class Configuration implements IObserver {

    private readonly CONFIG_FILE : string = "../gtdf.config.json";
    private static _instance: Configuration;

    private static readonly ANIMATION_KEY : string = "animations";
    private static readonly LANGUAGE_KEY : string = "language";
    private static readonly THEME : string = "theme";

    Variables : IVariables = {
        animations : true,
        environment : ENVIRONMENT.DEVELOPMENT,
        language : Language.ENGLISH
    }

    Base : IBase = {
        app_name : "",
        app_version : "",
        host : "",
        port : 80,
        environment : ENVIRONMENT.DEVELOPMENT,
        debug : false,
        log_level : "",
        website : "",
        author : ""
    }

    Path : IPath = {
        url : "",
        app : "",
        resources : "",
        language : "",
        images : "",
        icons : "",
    }

    Views : IViews = {
        url : "",
        login : "",
        home : "",
        error : "",
        blank : ""
    }

    Api : any = {
        url : "",
        login : "",
        login_auth: "",
        register : "",
    }

    async update() {
    
        const config = await fetch(this.CONFIG_FILE).then((response) => response.json());

        this.Variables  = config.variables;
        this.Base       = config.base;
        this.Path       = config.path;
        this.Views      = config.views;
        this.Api        = config.api;

        for (const key in this.Path) {

            if(key == "url") {
                this.Path[key] = URLs.addSlash(this.Path[key]);
                continue;
            }
           
            this.Path[key] = this.Path.url + URLs.addSlash(this.Path[key]);
           
        }

        for (const key in this.Views) {
           
            const element = this.Views[key]; 
            if(key == "url") {
                this.Views[key] = URLs.addStartSlash(this.Views[key]);
                this.Views[key] = URLs.addSlash(this.Views[key]);
                continue;
            }

            this.Views[key] = this.Views.url + URLs.addSlash(this.Views[key]);
        }

        for (const key in this.Api) {
            
            const element = this.Api[key];
            if(key == "url") {
                this.Api[key] = URLs.addSlash(this.Api[key]);
                continue;
            }

            this.Api[key] = this.Api.url + this.Api[key];
        }

        console.log(this.Api);
        
                
        await this.setDefaultVariables();

    }


    /**
     * Get a configuration instance
     */
    public static get instance(): Configuration {

        if (!this._instance) {
            this._instance = new Configuration();
        }

        return this._instance;
    }


    /**
     * Set default configurations for the application
     */
     public async setDefaultVariables() {

        if(this.getConfigVariable(Configuration.ANIMATION_KEY) == undefined) {
            this.setAnimations(true);
        }

        if(this.getConfigVariable(Configuration.LANGUAGE_KEY) == undefined) {
            console.log(getLanguage(navigator.language));
            
            this.setLanguage(getLanguage(navigator.language));
        }

        if(this.getConfigVariable(Configuration.THEME) == undefined) {
            this.setTheme("light");
        } else {
            if(this.isDarkTheme()){
                this.setDarkMode();
            } else {
                this.setLightMode();
            }
        }
    }

    /**
     * Get application configurations
     * @returns the application configurations
     */
     public getConfig() {
        let localStorageConfiguration = JSON.parse(localStorage.getItem(this.Base.app_name + "-config"));       

        if(!localStorageConfiguration) {
            localStorageConfiguration = {}
        }

        return localStorageConfiguration;
    }

    public isLogged() : boolean {
        return this.getConfigVariable("auth-token") != undefined;
    }

    /**
     * Add a configuration variable
     * @param key the name of the variable
     * @param value the value of the variable
     */
    public setConfigVariable(key: string, value: any) {
        let localStorageConfiguration = this.getConfig();
        const config = localStorageConfiguration;
        config[key] = value;
        localStorage.setItem(this.Base.app_name + "-config", JSON.stringify(config));
    }

    /**
     * Get a configuration variable
     * @param key the name of the variable
     * @returns the value of the variable
     */
    public getConfigVariable(key: string) : string{
        let localStorageConfiguration = this.getConfig();
        return localStorageConfiguration[key];
    }

    /**
     * Set animation for application on|off
     * @param on The boolean to set animations
     */
    public setAnimations(on : boolean){
        this.setConfigVariable(Configuration.ANIMATION_KEY,on);
    }

    /**
     * Get if animations are enabled
     * @returns if animations are enabled
     */
    public areAnimationsEnabled() : boolean{
        return this.getConfigVariable(Configuration.ANIMATION_KEY) === "true";
    }

    /**
     * Set the application language
     */
    public setLanguage(lang : string) {
        this.setConfigVariable(Configuration.LANGUAGE_KEY,lang);
    }

    /**
     * Get the current app language
     * @returns The app language
     */
    public getLanguage() : string {
        return getLanguage(this.getConfigVariable(Configuration.LANGUAGE_KEY));
    }

    /**
     * Set the title of the page
     * @param title The title of the page
     */
    public setTitle(title : string) {
        document.title = title;
        window.history.pushState({}, title, window.location.href);
    }


    /**
     * Set animation for application on|off
     * @param on The boolean to set animations
     */
    public setTheme(theme : string){
        this.setConfigVariable(Configuration.THEME,theme);
    }

    /**
     * Get if animations are enabled
     * @returns if animations are enabled
     */
    public isDarkTheme() : boolean{
        return this.getConfigVariable(Configuration.THEME) === "dark";
    }


    public toggleTheme() {
        if(Config.isDarkTheme()){
            this.setLightMode();
            return "dark";
        } else {
            this.setDarkMode();
            return "light";
        }
    }

    public setDarkMode() {
        document.documentElement.dataset.theme = 'dark';
        Config.setTheme("dark");
    }
    
    public setLightMode() {
        document.documentElement.dataset.theme = 'light';
        Config.setTheme("light");
    }

}

export const Config = Configuration.instance;
