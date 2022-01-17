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

            // SHIFT + T
            if (event.shiftKey && event.code === 'KeyT') {
                keyboard.listeners.getExpertListener().toggleTerminal();
            }

            // SHIFT + W
            if (event.shiftKey && event.code === 'KeyW') 
                keyboard.listeners.getAppearenceListener().nextWallpaper();


            // SHIFT + M
            if (event.shiftKey && event.code === 'KeyM') 
                keyboard.listeners.getAppearenceListener().toggleTheme();

            // SHIFT + S
            if (event.shiftKey && event.code === 'KeyS') {
                keyboard.listeners.getExpertListener().search();
                return false;
            }
        });
    }



}