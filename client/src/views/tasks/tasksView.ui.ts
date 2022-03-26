import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
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
            id: "tasks",
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

        const titleBar = new UIComponent({
            type: "div",
            id: "title-bar",
            classes: ["box-row", "box-x-between", "box-y-center"],
            styles: {
                width: "100%",
                marginBottom: "2rem",
            }
        });

        const title = new UIComponent({
            type: "h1",
            text: selected,
            classes: ["title"],
            styles: {
                fontSize: "1.7em",
                width: "100%",
                height: "2rem",
            }
        });
        titleBar.appendChild(title);

        const reload = new UIComponent({
            type: "button",
            id: "reload",
            classes: ["button"],
            text: getMaterialIcon("sync", { fill: "#fff", size: "1.5em" }).toHTML(),
        });

        reload.element.addEventListener("click", () => {

            reload.element.querySelector("svg").style.transition = "transform var(--medium)";
            reload.element.querySelector("svg").style.transform = "rotate(-180deg)";
            setTimeout(() => {
                this.core.goToCategory(selected)
            }, 350);
            
        });

        titleBar.appendChild(reload);
        container.appendChild(titleBar);

        const tasks = await this.core.getTasks(configurations.USER.USERNAME, selected);
        let timer = 300;
        let difference = 200;


        if (tasks.length == 0) {
            container.appendChild(this.buildNotTaskFoundErrorMessage());
        }


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

            const edit = getMaterialIcon("edit",{ size: "1.2em", fill: "white" });
            const done = getMaterialIcon("task_alt", { size: "1.2em", fill: "white" }); 
            const deleteTask = getMaterialIcon("delete", { size: "1.2em", fill: "white" }); 

            deleteTask.element.onclick = async () => {
                await this.core.deleteUserTask(currentTask.id);
                container.removeChild(taskBox);
                if (document.querySelectorAll(".task-box").length == 0) {
                    container.appendChild(this.buildNotTaskFoundErrorMessage());
                }
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

    /**
     * Create a message to show when there are no tasks
     * @returns The message as a UIComponent
     */
    private buildNotTaskFoundErrorMessage(): UIComponent {
        return new UIComponent({
            type: "h2",
            classes: ["box-row", "box-center"],
            text: "No tasks found &nbsp;" + getMaterialIcon("manage_search",{ fill: "#fff", size: "1.5em" }).toHTML(),
            styles: {
                opacity: "0.8",
            }
        });
    }


}
