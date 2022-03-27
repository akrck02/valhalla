import { Configurations } from './config/config.js';
import { Keyboard } from './core/keyboard.js';
import { ListenerSet } from './core/listenerset.js';
import { getParametersByIndex } from './lib/gtd-ts/data/urltools.js';
import { TextBundle } from './res/textBundle.js';
import Router from './views/router.js';

/**
 * Main application class
 */
export class App {

    private keyboard : Keyboard;
    private listeners : ListenerSet;
    public router : Router;
    public configurations : Configurations;

    constructor() {
        this.configurations = new Configurations();
        this.listeners = new ListenerSet();
        this.router = new Router(this.configurations, this.listeners);
        this.keyboard = new Keyboard(this.listeners);
        console.log(this.configurations.BASE.APP_NAME + " " + this.configurations.BASE.APP_VERSION + " is loaded!");
    }

    public loadFromUrl(): void {
        
        const params = getParametersByIndex(window.location.hash.slice(1).toLowerCase(),1);

        if(params[0] == ""){
            location.href = this.configurations.VIEWS.TASKS;
        }

        const titleElement = document.getElementById("title");
        if(titleElement)
            titleElement.onclick = () => location.href = this.configurations.VIEWS.BASE_URL;
    
        this.router.load(params);
    }


    public static getBundle() : any {
        return TextBundle.get(navigator.language);
    }

}

/**
 * App entry points
 */
export let APP : App;

window.addEventListener('hashchange',() => {
    APP.loadFromUrl()
});

window.onload = () => {    
   
    if(APP === undefined){
        APP = new App();   
        
        const wallpaper = APP.configurations.getConfigVariable("WALLPAPER");
        
        if(wallpaper){
            APP.configurations.setTheme("dark"); 
            APP.configurations.setWallpaper(wallpaper); 
        } else {
            const theme = APP.configurations.getConfigVariable("THEME");
            APP.configurations.setTheme(theme);
        }

        const terminalVisible = APP.configurations.getConfigVariable("VARIABLES_VISIBLE");
        APP.configurations.setVariablePanelVisible(terminalVisible);
    }

    APP.loadFromUrl();
}

 
