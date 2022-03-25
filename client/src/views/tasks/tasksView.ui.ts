import { Configurations } from "../../config/config.js";
import { DELETE, EDIT, TASK, TASK_ALT } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../services/tasks.js";
import CategoryBar from "./components/categoryBar.js";
import TaskCore from "./tasksView.core.js";

export default class TasksView extends UIComponent {

    private core: TaskCore;
    private taskContainer: UIComponent;
    private configurations: Configurations;

    public constructor() {
        super({
            type: "view",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },
        });

        this.core = new TaskCore(this);
    }

    public show(params: string[], container: UIComponent, configurations: Configurations): void {

        this.configurations = configurations;
        this.taskContainer = new UIComponent({
            type: "div",
            classes: ["box-column", "box-y-center", "backdrop"],
            id: "",
            styles: {
                width: "calc(100% - 20rem)",
                height: "100%",
                maxHeight: "100%",
                padding: "3rem",
                overflowX: "hidden",
                overflowY: "auto",
                transition: "opacity var(--slow)",
            },

        });

        const categoryBar = new CategoryBar(
            configurations,
            params[0],
            (selected) => this.showTasks(configurations, selected),
            () => this.core.newTask()
        );

        this.appendChild(categoryBar);
        this.appendChild(this.taskContainer);
        this.appendTo(container);

        setTimeout(() => {
            categoryBar.show();
            //  this.taskContainer.element.style.opacity = "1";
        }, 100);
    }

    async showTasks(configurations: Configurations, selected: string) {

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

        const tasks = await this.core.getTasks(configurations.USER.USERNAME, selected);
        let timer = 300;
        let difference = 200;

        console.log(tasks);
        

        for (const key in tasks) {
            const currentTask = tasks[key];

            const taskBox = new UIComponent({
                type: "div",
                classes: ["box-row", "task-box"],
                styles: {
                    width: "100%",
                    height: "auto",
                    marginBottom: ".5rem",
                }
            });

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
            text = this.core.getTimeText(taskDate);

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
            taskBox.appendChild(task);
            setTimeout(() => {
                task.element.style.opacity = "1";
            }, timer);


            const toolbar = new UIComponent({
                type: "div",
                id: "task-" + currentTask.id,
                classes: ["box-row", "box-y-center", "box-x-between", "task-toolbar"],
            });

            const edit = new UIComponent({
                type: "div",
                classes: ["box-row", "box-y-center", "box-x-center"],
                text: EDIT({ size: "1.2em", fill: "white" }),
            });

            const done = new UIComponent({
                type: "div",
                classes: ["box-row", "box-y-center", "box-x-center"],
                text: TASK_ALT({ size: "1.2em", fill: "white" }),
            });

            const deleteTask = new UIComponent({
                type: "div",
                classes: ["box-row", "box-y-center", "box-x-center"],
                text: DELETE({ size: "1.2em", fill: "white" }),
            });

            deleteTask.element.onclick = () => {
                const response = taskService.deleteUserTask({ id: currentTask.id });
                response.success((json) => {
                    console.log(json);
                    container.removeChild(taskBox);
                });

                response.json();
            };

            toolbar.appendChild(edit);
            toolbar.appendChild(done);
            toolbar.appendChild(deleteTask);
            toolbar.appendTo(taskBox);
            taskBox.appendTo(container);

            timer += difference;
            difference -= 20 * Math.random();

            if (difference < 0) {
                difference = 0;
            }
        }

    }

   
}
