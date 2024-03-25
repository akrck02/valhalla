import { IEvents } from "./events.js";

export default class Keyboard {

    public static setEventListeners(listeners : IEvents) {

        document.addEventListener('keyup', function (event) {

            // CTRL + period
            if (event.ctrlKey && event.code === 'Period') {
                listeners.example.ping();
            }

        });


    }

}