import { ListenerSet } from "./listenerset.js";

export class Keyboard {

    private listeners : ListenerSet;

    public constructor(listeners: ListenerSet) {
        this.listeners = listeners;
        this.setEventListeners();
    }

    public setEventListeners(): void {
        const keyboard = this;
        document.addEventListener('keyup', function (event) {

            //ALT + NUMBER
            if (event.altKey) {
                let keyNumber = +event.key;

                if (keyNumber >= 1 && keyNumber <= 9) 
                    keyboard.listeners.getExpertListener().clickControl(keyNumber - 1);
               
            }

            // SHIFT + T
            if (event.altKey && event.shiftKey && event.code === 'KeyT') {
                keyboard.listeners.getExpertListener().toggleVariablePanel();
            }

            // SHIFT + W
            if (event.altKey && event.shiftKey && event.code === 'KeyW') 
                keyboard.listeners.getAppearenceListener().nextWallpaper();


            // SHIFT + M
            //if (event.altKey && event.shiftKey && event.code === 'KeyM') 
                //keyboard.listeners.getAppearenceListener().toggleTheme();

            // SHIFT + S
            if (event.ctrlKey && event.code === 'KeyF') {
                keyboard.listeners.getExpertListener().search();
                return false;
            }
        });
    }



}