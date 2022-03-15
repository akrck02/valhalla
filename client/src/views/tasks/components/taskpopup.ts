import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { ITask } from "../../../core/data/interfaces/task.js";

export default class TaskPopUp extends UIComponent {

    private task : ITask;

    constructor() {
        super({
            type: "div",
            id: "task-pop-up"
        })

        this.task = {};

        const popup = this;
        const name = new UIComponent({
            type: "h1",
            text: "Task name",
            id: "task-name",
            attributes: {
                contenteditable : "true"
            },
        });

        name.element.addEventListener(
            "keyup",
            () => {
                popup.task.name = name.element.innerText;
                console.log(popup.task);
                
            }
            
        );

        const description = new UIComponent({
            type: "p",
            text: "Insert here your task description my friend :D",
            id: "task-description",
            attributes: {
                contenteditable : "true"
            },
        });

        description.element.addEventListener(
            "keyup",
            () => {
                popup.task.description = description.element.innerText;
                console.log(popup.task);
            }
        );

        this.appendChild(name);
        this.appendChild(description);
    }


}