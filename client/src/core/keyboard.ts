import e from "express";
import { APP } from "../app.js";
import { ENVIROMENT } from "../config/config.js";
import { AppearenceListener } from "./listeners/appearence.js";
import { ExpertListener } from "./listeners/expert.js";

export class Keyboard {

    private appearenceListener: AppearenceListener;
    private expertListener: ExpertListener;

    public constructor() {
        this.appearenceListener = new AppearenceListener();
        this.expertListener = new ExpertListener();
        this.setEventListeners();
    }

    public setEventListeners(): void {
        const keyboard = this;
        document.addEventListener('keyup', function (event) {

            // SHIFT + T
            if (event.shiftKey && event.code === 'KeyT') {
                keyboard.expertListener.toggleTerminal();
            }

            // SHIFT + W
            if (event.shiftKey && event.code === 'KeyW') 
                keyboard.appearenceListener.nextWallpaper();


            // SHIFT + M
            if (event.shiftKey && event.code === 'KeyM') 
                keyboard.appearenceListener.toggleTheme();

            // SHIFT + S
            if (event.shiftKey && event.code === 'KeyS') {
                keyboard.expertListener.search();
                return false;
            }
        });
    }



}