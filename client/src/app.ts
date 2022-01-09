import { CONFIG, PATHS, setUpConfigurations, VIEWS } from './config/config.js';
import { getParametersByIndex } from './lib/data/urltools.js';
import { prefersDarkMode } from './lib/web/responsivetools.js';
import Router from './views/router.js';

/**
 * Main application class
 */
class App {

    private router : Router;

    constructor() {
        console.log("App loaded");
        this.router = new Router();
    }

    public loadFromUrl(): void {
        const params = getParametersByIndex(window.location.hash.slice(1).toLowerCase(),1);
    
        if(params[0] == ""){
            params[0] = "home";
        }

        const titleElement = document.getElementById("title");
        if(titleElement)
            titleElement.onclick = () => location.href = VIEWS.BASE_URL;
        
        console.log(VIEWS.BASE_URL);


        if(prefersDarkMode()){
            document.documentElement.dataset.theme = "dark";

        } else {
            document.documentElement.dataset.theme = "light";
        }

        this.router.load(params);
    }

    public startCofigurations() {
        setUpConfigurations();
    }
    
}

/**
 * App entry points
 */
let app : App;

window.addEventListener('hashchange',() => app.loadFromUrl());
window.onload = () => {
    app = new App();
    app.startCofigurations();
    app.loadFromUrl();
}