import { App } from "../../app.js";
import { TaskStatus } from "../../core/data/enums/task.status.js";
import { UIComponent, setStyles } from "../../lib/gtd-ts/web/uicomponent.js";

export default class TaskStatusComponent extends UIComponent {

    constructor(status : string) {

        super({
            type: "div",
            text: "",
            classes: ["status"]
        });

        //status
        let color = "";
        switch (status) {
            case TaskStatus.DONE:
                this.element.textContent = App.getBundle().tasks.DONE;
            
                color = "rgba(0, 255, 0, .15)";
                break;
            case TaskStatus.IN_PROGRESS:
                this.element.textContent = App.getBundle().tasks.IN_PROGRESS;

                // rgba blue with .15 transparency
                color = "rgba(20, 133, 255, .15)";
                break;
            default: 
                this.element.textContent = App.getBundle().tasks.TODO;
                color = "rgba(255,255,255,.15)";
                break;
        }


        setStyles(this.element, {
            backgroundColor: color,
            padding: ".25rem .65rem",
                fontSize: ".8rem",
                borderRadius: "50rem",
        });
    
    }
    
}