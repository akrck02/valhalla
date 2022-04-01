import { threadId } from "worker_threads";
import { App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import CategoryBar from "./components/categoryBar.js";
import NewTaskView from "./new/newTaskView.ui.js";
import TaskCore from "./tasksView.core.js";

export default class TasksView extends UIComponent {

    private core: TaskCore;
    private container: UIComponent;
    private taskContainer: UIComponent;

    public constructor() {
        super({
            type: "view",
            classes: ["box-row"],
            id: "tasks",
            styles: {
                width: "100%",
                height: "100%",
                backdropFilter: "blur(1rem)",
            },
        });

        this.core = new TaskCore(this);
    }

    /**
     * Show the current view on display
     * @param params The parameters of the view
     * @param container The container to draw the view on
     * @param configurations The configurations of the app
     */
    public show(params: string[], container: UIComponent): void {

        this.container = container;
        this.taskContainer = new UIComponent({
            type: "div",
            id: "task-container",
            classes: ["box-column", "box-y-center", "backdrop"],
        });

        const categoryBar = new CategoryBar(
            params[0],
            (selected) => this.showTasks(selected),
            () => this.core.newTask()
        );

        this.appendChild(categoryBar);
        this.appendChild(this.taskContainer);
        this.appendTo(container);

        setTimeout(() => categoryBar.show(), 100);
    }

    /**
     * Show the task of a selected category
     * @param configurations The configurations of the application
     * @param selected The selected category
     */
    async showTasks(selected: string) {

        const container = this.taskContainer;
        container.clean();

        const titleBar = new UIComponent({
            type: "div",
            id: "title-bar",
            classes: ["box-row", "box-x-between", "box-y-center"],
        });

        const title = new UIComponent({
            type: "h1",
            text: selected,
            id: "category-title",
            classes: ["title"],
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
            setTimeout(() => this.core.goToCategory(selected), 350);
            
        });

        titleBar.appendChild(reload);
        container.appendChild(titleBar);

        const tasks = await this.core.getTasks(Configurations.getUserName(), selected);
        let timer = 300;
        let difference = 200;

        if (tasks.length == 0) {
            container.appendChild(this.buildNotTaskFoundErrorMessage());
        }

        const notDoneContainer = new UIComponent({
            type: "div",
            id: "not-done-container",
            classes: ["box-column"],
            styles: {
                width: "100%",        
            }
        });

        //build all the tasks
        for (const key in tasks) {

            const task = tasks[key];
            const taskbox = this.buildTask(tasks[key],container);

            if(task.done == "1") {
                taskbox.appendTo(notDoneContainer);
            } else {
                taskbox.appendTo(container);
            }
        }
        container.appendChild(notDoneContainer);

        setTimeout(() => {
            notDoneContainer.element.style.opacity = "1";
            notDoneContainer.element.style.transition = "opacity var(--medium)";
        },100);

    }

    /**
     * Build a task component
     * @param currentTask The current task info
     * @param container The container of the tasks
     * @returns The task component
     */
    private buildTask( currentTask : any , container : UIComponent): UIComponent {
        const taskBox = new UIComponent({
            type: "div",
            classes: ["box-row", "task-box"],
        });

        const task = new UIComponent({
            type: "div",
            classes: ["box-row", "box-y-center", "box-x-between", "task"],
        });

        if(currentTask.done == "1") {
            task.element.classList.add("done");
        }

        const taskTitle = new UIComponent({
            type: "div",
            text: currentTask.name,
            classes: ["title"],
        });

        if(currentTask.done == "1") {
            taskTitle.element.style.textDecoration = "line-through";
            taskTitle.element.style.opacity = ".6";
            taskBox.element.style.opacity = ".4";
        }

        //if time is today set "today" text
        let text = "";
        const taskDate = new Date(currentTask.end);
        text = this.core.getTimeText(taskDate);

        const taskTime = new UIComponent({
            type: "div",
            text: text,
            classes: ["time"],
        });

        task.appendChild(taskTitle);
        task.appendChild(taskTime);
        taskBox.appendChild(task);

        const toolbar = new UIComponent({
            type: "div",
            id: "task-" + currentTask.id,
            classes: ["box-row", "box-y-center", "box-x-between", "task-toolbar"],
        });

        const edit = getMaterialIcon("edit",{ size: "1.2em", fill: "white" });
        const done = getMaterialIcon("task_alt", { size: "1.2em", fill: "white" }); 
        const deleteTask = getMaterialIcon("delete", { size: "1.2em", fill: "white" }); 

        edit.element.addEventListener("click", () => App.redirect(Configurations.VIEWS.NEW_TASK, ["edit",currentTask.id]));
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
        
        setTimeout(() => {
            task.element.style.opacity = "1";
        }, 100);

        return taskBox;
    } 


    /**
     * Create a message to show when there are no tasks
     * @returns The message as a UIComponent
     */
    private buildNotTaskFoundErrorMessage(): UIComponent {
        return new UIComponent({
            type: "h2",
            classes: ["box-row", "box-center"],
            text: App.getBundle().tasks.NO_TASKS_FOUND + " &nbsp;" + getMaterialIcon("manage_search",{ fill: "#fff", size: "1.5em" }).toHTML(),
            styles: {
                opacity: "0.8",
            }
        });
    }


}
