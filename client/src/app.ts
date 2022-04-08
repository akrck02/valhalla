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

    constructor() {
        this.listeners = new ListenerSet();
        this.router = new Router(this.listeners);
        this.keyboard = new Keyboard(this.listeners);
        console.log(Configurations.BASE.APP_NAME + " " + Configurations.BASE.APP_VERSION + " is loaded!");
    }

    public loadFromUrl(): void {
        
        const params = getParametersByIndex(window.location.hash.slice(1).toLowerCase(),1);

        if(params[0] == ""){
            location.href = Configurations.VIEWS.TASKS;
        }

        const titleElement = document.getElementById("title");
        if(titleElement)
            titleElement.onclick = () => location.href = Configurations.VIEWS.BASE_URL;
    
        this.router.load(params);
    }


    public static getBundle() : any {
        return TextBundle.get(navigator.language);
    }

    public static redirect(url: string, params: string[]) {
        url += params.join("/");
        location.href = url;
    }

}

/**
 * App entry points
 */
export let APP : App;

window.addEventListener('hashchange',() => {
    APP.loadFromUrl()
});

window.onload = async () => {    
   
    if(APP === undefined){
        await Configurations.setDefaultVariables();
        
        APP = new App();   
        const wallpaper = Configurations.getWallpaper();
        
        if(wallpaper){
            Configurations.setTheme("dark"); 
            Configurations.setWallpaper(wallpaper); 
        } else {
            const theme = Configurations.getTheme();
            Configurations.setTheme(theme);
        }

        const terminalVisible = Configurations.getConfigVariable("VARIABLES_VISIBLE");
        Configurations.setVariablePanelVisible(terminalVisible === "true");
    }

    APP.loadFromUrl();
}

 
