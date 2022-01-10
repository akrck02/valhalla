import { Configurations } from './config/config.js';
import { Keyboard } from './core/keyboard.js';
import { getParametersByIndex } from './lib/data/urltools.js';
import { prefersDarkMode } from './lib/web/responsivetools.js';
import Router from './views/router.js';

/**
 * Main application class
 */
class App {

    private keyboard : Keyboard;
    public router : Router;
    public configurations : Configurations;
   
    constructor() {
        this.configurations = new Configurations();
        this.router = new Router(this.configurations);
        this.keyboard = new Keyboard();
        console.log("App is loaded!");
    }

    public loadFromUrl(): void {
        
        const params = getParametersByIndex(window.location.hash.slice(1).toLowerCase(),1);

        if(params[0] == ""){
            params[0] = "home";
        }

        const titleElement = document.getElementById("title");
        if(titleElement)
            titleElement.onclick = () => location.href = this.configurations.VIEWS.BASE_URL;
    
        this.router.load(params);
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
        if(prefersDarkMode())
            APP.configurations.toggleTheme();
    }

    APP.loadFromUrl();
}

 
