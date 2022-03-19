import { DateSelector } from "../../components/input/date/selector.js";
import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../services/tasks.js";
import CategoryBar from "./components/categoryBar.js";
import TaskPopUp from "./components/taskpopup.js";

export default class TasksV extends UIComponent {

    private taskContainer: UIComponent;
    private dateSelector : DateSelector;

    public constructor() {
        super({
            type: "view",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },
        });

        this.dateSelector = new DateSelector((date: Date)=> {
            console.log("TASK VIEW SEE: ", date); 
        });
    }

    public show(params: string[], container: UIComponent, configurations: Configurations): void {

        this.taskContainer = new UIComponent({
            type: "div",
            classes: ["box-column", "box-y-center", "backdrop"],
            styles: {
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                padding: "3rem",
                overflowY: "auto",
                opacity: "0",
                transition: "opacity var(--slow)",
            },

        });

        const categoryBar = new CategoryBar(
            configurations, 
            params[0], 
            (selected) => this.showTasks(configurations,selected),
            () => this.selectDate(),
            );
        categoryBar.element.style.opacity = "0";

        this.appendChild(categoryBar);
        this.appendChild(this.taskContainer);
        this.appendTo(container);

        setTimeout(() => {
            categoryBar.element.style.opacity = "1";
            this.taskContainer.element.style.opacity = "1";
        }, 100);
    }

    showTasks(configurations: Configurations, selected: string) {

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

        const response = taskService.getUserTasksFromCategory(configurations.USER.USERNAME, selected);
        response.success((tasks) => {

            let timer = 300;
            let difference = 200;

            for (const key in tasks) {
                const currentTask = tasks[key];

                const task = new UIComponent({
                    type: "div",
                    classes: ["box-row", "box-y-center", "box-x-between", "task"],
                });

                const taskTitle = new UIComponent({
                    type: "div",
                    text: currentTask.name,
                    classes: ["title"],
                    styles: {
                        transition: "border var(--fast)",
                        cursor: "pointer",
                    }
                });

                //if time is today set "today" text
                let text = "";
                const taskDate = new Date(currentTask.end);
                text = this.getTimeText(taskDate);

                const taskTime = new UIComponent({
                    type: "div",
                    text: text,
                    classes: ["time"],
                    styles: {
                        fontSize: "0.8em",
                        color: "rgba(255,255,255,0.5)"
                    }
                });

                task.appendChild(taskTitle);
                task.appendChild(taskTime);
                container.appendChild(task);
                setTimeout(() => {
                    task.element.style.opacity = "1";
                }, timer);


                timer += difference;
                difference -= 20 * Math.random();

                if (difference < 0) {
                    difference = 0;
                }
            }

        });
        response.error((error) => { console.error(error); });
        response.json();

    }


    showTaskPopUp() {
        const container = this.taskContainer;
        container.clean();
        
        const popup = new TaskPopUp();
        container.appendChild(popup);
    }

    public getTimeText(date: Date): string {

        console.log(date);
        
        const today = new Date();

        // if today and 6 hours or less
        if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate() && date.getHours() <= today.getHours() + 6) {
            const diff = date.getHours() - today.getHours();

            if (diff <= 6) {
                if (diff > 0) return `${diff}h`;
                else return "now";
            }
            
        }

        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (today.toString() === date.toString()) {
            return "Today";
        } else {

            today.setDate(today.getDate() + 1);
            if (date.toString() === today.toString()) {
                return "Tomorrow";
            } else {
                return date.toLocaleDateString();
            }
        }
    }

    selectDate() {
        this.taskContainer.element.innerHTML = "";
        this.taskContainer.appendChild(this.dateSelector);
       
        setTimeout(() => {
            this.dateSelector.draw();
            this.dateSelector.toogle(); 
        }, 250);
    }

}
