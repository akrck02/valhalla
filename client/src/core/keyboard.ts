import { ListenerSet } from "./listenerset.js";

export class Keyboard {

    public static setEventListeners(listeners: ListenerSet): void {
        document.addEventListener('keyup', function (event) {

            //ALT + NUMBER
            if (event.altKey) {
                let keyNumber = +event.key;

                if (keyNumber >= 1 && keyNumber <= 9) 
                    listeners.getExpertListener().clickControl(keyNumber - 1);
               
            }

            // SHIFT + T
            if (event.altKey && event.shiftKey && event.code === 'KeyT') {
                listeners.getExpertListener().toggleVariablePanel();
            }

            // SHIFT + W
            if (event.altKey && event.shiftKey && event.code === 'KeyW') 
                listeners.getAppearenceListener().nextWallpaper();


            // SHIFT + M
            //if (event.altKey && event.shiftKey && event.code === 'KeyM') 
                //keyboard.listeners.getAppearenceListener().toggleTheme();

            // SHIFT + S
            if (event.ctrlKey && event.code === 'KeyF') {
                listeners.getExpertListener().search();
                return false;
            }
        });

    }



}