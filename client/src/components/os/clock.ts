import { DateText } from "../../core/data/integrity/dateText.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class Clock extends UIComponent {

    constructor(){
        super({
            type: "clock",
            styles: {
                fontSize: ".8rem",
                fontWeight: "normal",
                opacity: ".8",
                background: "rgba(255,255,255,.05)",
                padding: " .25rem .5rem",
                borderRadius: ".35rem",
                height: "100%"
            }
        });
    }


    public start() {
        setInterval(() =>{
            const now = new Date();
            this.element.innerHTML = `${DateText.normalize(now.getHours(),2)}:${DateText.normalize(now.getMinutes(),2)}`;
        },500);
    }

} 