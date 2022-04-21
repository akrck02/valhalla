import UINotification, { NotificationProperties } from './components/notifications/notification.js';
import { Configurations } from './config/config.js';
import { Keyboard } from './core/keyboard.js';
import { ListenerSet } from './core/listenerset.js';
import { Window } from './core/window.js';
import { getParametersByIndex } from './lib/gtd-ts/data/urltools.js';
import { TextBundle } from './res/textBundle.js';
import Router from './views/router.js';

/**
 * Main application class
 */
export class App {

    public listeners : ListenerSet;
    private notification : UINotification;
    public router : Router;

    constructor() {
        this.listeners = new ListenerSet();
        this.router = new Router(this.listeners);

        // Create event listeners
        Keyboard.setEventListeners(this.listeners);
        Window.setEvents();

        // Adjust zoom 
        Window.setZoomLevel();

        // Set the notification element
        this.notification = new UINotification();
        document.body.appendChild(this.notification.element);

        // Override the default notification function
        window.alert = (properties : NotificationProperties) => {
            this.notification.setContent(properties);
            this.notification.show(properties.time);

            // If the desktop notification are active 
            if(properties.desktop){
                new Notification("Valhalla" ,{
                    icon: Configurations.PATHS.ICONS + "logo-light.png",
                    body: properties.message,
                })
            }

        };

        // if has a wallpaper, set the html variable
        if(Configurations.hasWallpaper()) {
            document.documentElement.dataset.wallpaper = "true";
        }

        // if has animation, set the html variable
        Configurations.setAnimations(Configurations.areAnimationsEnabled());

        // Log that the app is loaded
        console.log(Configurations.BASE.APP_NAME + " " + Configurations.BASE.APP_VERSION + " is loaded!");

    }

    /**
     * Load the app from url
     */
    public loadFromUrl(): void {
        
        const params = getParametersByIndex(window.location.hash.slice(1).toLowerCase(),1);

        //if secret key is not set, redirect to tutorial
        if(!Configurations.getConfigVariable("secret")){
              //App.redirect(Configurations.VIEWS.START,params);
        }

        if(params[0] == ""){
            location.href = Configurations.VIEWS.TASKS;
        }

        const titleElement = document.getElementById("title");
        if(titleElement)
            titleElement.onclick = () => location.href = Configurations.VIEWS.BASE_URL;
    
        this.router.load(params);
    }

    /**
     * Get current language text bundle
     * @returns 
     */
    public static getBundle() : any {
        return TextBundle.get(navigator.language);
    }

    /**
     * Redirect to url with '/' separated params
     * @param url The URL to be redirected to
     * @param params The parameter Array
     */
    public static redirect(url: string, params: string[], force :boolean = false) {

        if(force) {
            location.href = Configurations.VIEWS.DUMMY;
        }
        
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

 
