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

            // SHIFT + NUMBER
            if(event.ctrlKey){
                let keyNumber = +event.key

                if (keyNumber >= 1 && keyNumber <= 9) 
                    listeners.getExpertListener().openTab(keyNumber - 1);
               
            }

            // SHIFT + T
            if (event.altKey && event.shiftKey && event.code === 'KeyT') {
                listeners.getExpertListener().toggleVariablePanel();
            }

            // SHIFT + W
            if (event.altKey && event.shiftKey && event.code === 'KeyW') 
                listeners.getAppearenceListener().nextWallpaper();

             // SHIFT + W
            if (event.ctrlKey && event.code === 'Period') 
                listeners.getExpertListener().commandPrompt();


            // CTRL + S
            if (event.ctrlKey && event.code === 'KeyF') {
                listeners.getExpertListener().search();
                return false;
            }

            // CTRL + N
            if (event.ctrlKey && event.code === 'KeyN') {
                listeners.getExpertListener().clickNewButton();
                return false;
            }
        });

    }



}