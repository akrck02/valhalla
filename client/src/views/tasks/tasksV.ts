import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../services/tasks.js";
import CategoryBar from "./components/categoryBar.js";

export default class TasksV extends UIComponent {

    private taskContainer : UIComponent;

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
       
        this.taskContainer = new UIComponent({
            type: "div",
            classes: ["box-column","backdrop"],
            styles: {
                width: "100%",
                height: "100%",
                padding: "3rem",
                opacity: "0",
                transition: "opacity var(--slow)",
            },
            
        });
       
        const categoryBar = new CategoryBar(configurations, params[0], (selected) => this.showTasks(selected));
        categoryBar.element.style.opacity = "0";
       
    
        this.appendChild(categoryBar);
        this.appendChild(this.taskContainer);
        this.appendTo(container);

        setTimeout(() => {
            categoryBar.element.style.opacity = "1";
            this.taskContainer.element.style.opacity = "1";
        }, 100);
    }

    showTasks(selected : string) {
        
        const container = this.taskContainer;
        container.clean();
        
        const title = new UIComponent({
            type: "h1",
            text: selected,
            classes: ["title"],
            styles: {
                fontSize: "1.7em",
                width: "100%",
                height: "2rem",
                marginBottom: "2rem",
            }
        });
        container.appendChild(title);

        const response = taskService.getUserTasksFromCategory("akrck02", selected);
        response.success((tasks) => {
            
            for (const key in tasks) {
                const currentTask = tasks[key];

                console.log(currentTask);
                
                const task = new UIComponent({
                    type: "div",
                    classes: ["box-row", "box-y-center", "box-x-between","task"],
                    styles: {
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "0.55rem",
                        height: "3rem",
                        background: "rgba(255,255,255,0.05)",
                    },
                });

                const taskTitle = new UIComponent({
                    type: "div",
                    text: currentTask.name,
                    classes: ["title"],
                    styles: {
                    }
                });

                const taskTime = new UIComponent({
                    type: "div",
                    text: currentTask.end,
                    classes: ["time"],
                    styles: {
                        fontSize: "0.8em",
                        color: "rgba(255,255,255,0.5)"
                    }
                });

                task.appendChild(taskTitle);
                task.appendChild(taskTime);
                container.appendChild(task);
            }

        });
        response.error((error) => {console.error(error);});
        response.json();

     }


}
