import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/web/uicomponent.js";
import { taskService } from "../../services/tasks.js";
import CategoryBar from "./components/categoryBar.js";

export default class TasksV extends UIComponent {

    public constructor() {
        super({
            type: "view",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },

        });
    }

    public show(params: string[], container: UIComponent, configurations : Configurations): void {
        const categoryBar = new CategoryBar(configurations, params[0], this.showTasks);
        const taskContainer = new UIComponent({
            type: "div",
            classes: ["box-row","backdrop"],
            styles: {
                width: "100%",
                height: "100%",
            },
        });


        categoryBar.element.style.opacity = "0";
    
        this.appendChild(categoryBar);
        this.appendChild(taskContainer);
        this.appendTo(container);

        setTimeout(() => {
            categoryBar.element.style.opacity = "1";
        }, 100);
    }

    showTasks(selected : string) {
        const response = taskService.getUserTasksFromCategory("akrck02", selected);
        response.success((tasks) => {
            console.log(tasks);


            



        });
        response.error((error) => {console.log(error);});
        response.text();
        
     }


}
