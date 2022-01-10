import e from "express";
import { APP } from "../app.js";

export class Keyboard {

    private listener : number;


    public constructor(){

        document.addEventListener('keyup', function(event) {
            if (event.shiftKey && event.code === 'KeyT') {
                APP.router.terminal.toggle();
            }

            if (event.shiftKey && event.code === 'KeyM') {
                APP.configurations.toggleTheme();
            }

            if (event.shiftKey && event.code === 'KeyS') {
                APP.router.searchbar.focus();
                (APP.router.searchbar as HTMLInputElement ).value = "";
            }
        });

    }



}