
import { App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../services/tasks.js";
import CategoryBar from "./components/categoryBar.js";
import TaskCore from "./tasksView.core.js";

export default class TasksView extends UIComponent {

    private core: TaskCore;

    private wrapper : UIComponent;
    private toolbar : UIComponent;

    private doneContainer: UIComponent;
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
            data: { selected : "" }
        });

        this.wrapper = new UIComponent({
            classes: ["box-column"],
            id: "wrapper",
            styles: {
                width: "100%",        
            }
        });

        this.core = new TaskCore(this);
    }
    /**
     * Show the current view on display
     * @param params The parameters of the view
     * @param container The container to draw the view on
     * @param configurations The configurations of the app
     */
    public show(params: string[], container: UIComponent | HTMLElement): void {

        this.wrapper.clean();

        this.taskContainer = new UIComponent({
            type: "div",
            id: "task-container",
            classes: ["box-column", "box-y-center", "backdrop"],
        });

        this.doneContainer = new UIComponent({
            type: "div",
            id: "done-container",
            classes: ["box-column"],
            styles: {
                width: "100%",        
            }
        });

        const categoryBar = new CategoryBar(
            params[0] || Configurations.getConfigVariable("TASKS_SELECTED_CATEGORY"),
            (selected) => this.showTasks(selected),
            () => this.core.newTask()
        );

        this.wrapper.appendChild(this.taskContainer);
        this.wrapper.appendChild(this.doneContainer);

        this.appendChild(categoryBar);
        this.appendChild(this.wrapper);
        this.appendTo(container);

        setTimeout(() => categoryBar.show(), 100);
    }

    /**
     * Show the task of a selected category
     * @param configurations The configurations of the application
     * @param selected The selected category
     */
    private async showTasks(selected: string) {

       this.core.setSelectedCategory(selected);

        this.taskContainer.clean();
        this.doneContainer.clean();
        
        const titleBar = this.buildTitleBar(selected);
        this.taskContainer.appendChild(titleBar);

        const notDone = await this.showNotDoneTasks(selected);
        const done = await this.showDoneTasks(selected,notDone);

    }

    /**
     * Build the title bar
     * @param selected The selected category
     * @returns The title bar
     */
    private buildTitleBar (selected : string) : UIComponent {
        const bar = new UIComponent({
            type: "div",
            id: "title-bar",
            classes: ["box-row", "box-x-between", "box-y-center"],
        });

        const title = new UIComponent({
            type: "h1",
            text: selected == "none" ? getMaterialIcon("label_off",{ size: "1.7rem", fill: "var(--text-color)" }).toHTML() + "&nbsp;" + App.getBundle().tasks.OTHERS : selected,
            id: "category-title",
            classes: ["title", "box-row", "box-x-start", "box-y-center"],
        });
        bar.appendChild(title);

        this.createToolbar();
        this.toolbar.appendTo(bar);


        return bar;
    }


    /**
     * Create the view toolbar
     */
    private createToolbar() {


        this.toolbar = new UIComponent({
            type: "div",
            classes: ["box-row","box-y-center", "box-x-end"]
        });

        const reload = new UIComponent({
            type: "button",
            id: "reload",
            classes: ["button"],
            text: getMaterialIcon("sync", { fill: "#fff", size: "1.5em" }).toHTML(),
        });

        const check = new UIComponent({
            type: "button",
            id: "check",
            classes: ["button"],
            text: getMaterialIcon("checklist", { fill: "#fff", size: "1.5em" }).toHTML(),
        });
         
        const done = new UIComponent({
            type: "button",
            id: "done",
            classes: ["button","multi-select"],
            text: getMaterialIcon( "task_alt", { size: "1.2em", fill: "white" }).toHTML(),
        });
         
        const deleteTask = new UIComponent({
            type: "button",
            id: "delete",
            classes: ["button", "multi-select"],
            text:  getMaterialIcon("delete", { size: "1.2em", fill: "white" }).toHTML(),
        });      


        reload.element.addEventListener("click", () => {
            reload.element.querySelector("svg").style.transition = "transform var(--medium)";
            reload.element.querySelector("svg").style.transform = "rotate(-180deg)";
            setTimeout(() => this.core.goToCategory(this.core.getSelectedCategory()), 350);
        });

        // Toggle muliple selection
        check.element.addEventListener("click", () => {
           
            if(this.element.classList.contains("select")) {
                this.element.classList.remove("select");
            } else {
                this.element.classList.add("select");
            }

        });

        // Toggle done status on multiple tasks
        done.element.addEventListener("click", async () => {

            const inputs = document.querySelectorAll(".task-box input[type=checkbox]:checked");            
            let ids = [];

            for(let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                ids.push((input as HTMLInputElement).value);
            }

            await this.core.toogleTasks(ids);
            setTimeout(() => this.core.goToCategory(this.core.getSelectedCategory()), 350);
        });


        // Delete multiple tasks 
        deleteTask.element.addEventListener("click", async () => {
            const inputs = document.querySelectorAll(".task-box input[type=checkbox]:checked");
            let ids = [];
            
            for(let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                ids.push((input as HTMLInputElement).value);
            }

            await this.core.deleteUserTasks(ids);
            setTimeout(() => this.core.goToCategory(this.core.getSelectedCategory()), 350);
        });

        this.toolbar.appendChild(done);
        this.toolbar.appendChild(deleteTask);

        this.toolbar.appendChild(check);
        this.toolbar.appendChild(reload);

    }

    /**
     * Show the not done tasks
     * @param selected The selected category 
     * @param container The container to append the tasks to 
     * @returns the promise containing the number of tasks
     */
    private async showNotDoneTasks(selected : string) : Promise<number>  {
        const notDoneTasks = await this.core.getNotDoneTasks(Configurations.getUserName(), selected);

        if (notDoneTasks.length == 0) {
            this.taskContainer.appendChild(this.buildAllTaskCompletedMessage());
        }

        //build the not done tasks
        for (const key in notDoneTasks) {
            const taskbox = this.buildTask(notDoneTasks[key],this.taskContainer);
            taskbox.appendTo(this.taskContainer);
        }

        return new Promise((res) => res (notDoneTasks.length)); 
    }

    /**
     * Show the done tasks
     * @param selected The selected category 
     * @param container The container to append the tasks to
     * @returns the promise containing the number of tasks
     */
    private async showDoneTasks(selected : string, notdone : number) : Promise<number> {
        const doneTasks = await this.core.getDoneTasks(Configurations.getUserName(), selected);
        const doneTitle = new UIComponent({
            type: "h1",
            text:  App.getBundle().tasks.COMPLETED  + "&nbsp;" + getMaterialIcon("check_all", { fill: "#fff", size: "1.15em" }).toHTML(),
            classes: ["box-row", "box-y-center", "box-x-start"],
            styles: {
                opacity: "0.8",
                marginBottom: "1rem",
                width: "100%",
                textAlign: "left",
                padding: "1rem 0",
            },
        });

        if (doneTasks.length > 0) {
            this.doneContainer.appendChild(doneTitle);
        }

        //build the done tasks
        for (const key in doneTasks) {
            const taskbox = this.buildTask(doneTasks[key],this.doneContainer);
            taskbox.appendTo(this.doneContainer);
        }

        return new Promise((res) => res (doneTasks.length));
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
            data : {
                id : currentTask.id
            }
        });

        //switch control
        const switchControl = new UIComponent({
            type: "label",
            classes : ["switch", "box-center"], 
            styles :  {
                height: "100%"
            }
        });

        const toggle = new  UIComponent({
            classes : ["switch-toggle", "box-center"]
        });

        toggle.appendChild(getMaterialIcon("check", { size: "1rem", fill: "white" }));

        const checkbox = new UIComponent({
            type : "input", 
            attributes :{
                type : "checkbox",
                value : currentTask.id
            }
        });

        switchControl.appendChild(checkbox);
        switchControl.appendChild(toggle);


        //Task

        const task = new UIComponent({
            type: "div",
            classes: ["box-row", "box-y-center", "box-x-between", "task"],
        });

        task.element.onclick = () => {
            this.core.goToTask(currentTask.id);
        };

        if(currentTask.done == "1") {
            taskBox.element.classList.add("done");
        }

        const taskTitle = new UIComponent({
            type: "div",
            text: currentTask.name,
            classes: ["title"],
        });

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
        taskBox.appendChild(switchControl);
        taskBox.appendChild(task);

        const toolbar = new UIComponent({
            type: "div",
            id: "task-" + currentTask.id,
            classes: ["box-row", "box-y-center", "box-x-between", "task-toolbar"],
        });

        const edit = getMaterialIcon("edit",{ size: "1.2em", fill: "white" });
        const done = getMaterialIcon( currentTask.done? "task_alt" : "radio_button_unchecked", { size: "1.2em", fill: "white" }); 
        const deleteTask = getMaterialIcon("delete", { size: "1.2em", fill: "white" }); 

        edit.element.onclick = () => App.redirect(Configurations.VIEWS.NEW_TASK, ["edit",currentTask.id]);
        done.element.onclick = () => {

            currentTask.done = currentTask.done == 1 ? 0 : 1;
            const res = taskService.updateUserTaskDone(currentTask);
            res.json();

            if(currentTask.done == 1) {
                this.taskContainer.removeChild(taskBox);
                this.doneContainer.appendChild(taskBox);
                taskBox.element.classList.add("done");
            } else {
                this.doneContainer.removeChild(taskBox);
                this.taskContainer.appendChild(taskBox);
                taskBox.element.classList.remove("done");
            }

            this.core.toggle(currentTask.id)
           
        }

        deleteTask.element.onclick = async () => {
            await this.core.deleteUserTask(currentTask.id);
            container.removeChild(taskBox);
            if (document.querySelectorAll(".task-box").length == 0) {
                container.appendChild(this.buildNotTaskFoundErrorMessage());
            }

            alert({
                message: App.getBundle().tasks.TASK_DELETED_SUCCESSFULLY,
                icon: 'delete'
            })
        };

        toolbar.appendChild(edit);
        toolbar.appendChild(done);
        toolbar.appendChild(deleteTask);
        toolbar.appendTo(taskBox);
        
        setTimeout(() => {
            task.element.style.opacity = "1";
        },  Configurations.areAnimationsEnabled()? 100 : 0);

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


    /**
     * Create a message to show when all the task are completed
     * @returns The message as a UIComponent
     */
    private buildAllTaskCompletedMessage(): UIComponent {
        return new UIComponent({
            type: "h2",
            classes: ["box-row", "box-center"],
            text: App.getBundle().tasks.ALL_TASKS_COMPLETED + " &nbsp;<span>😌</span>",
            styles: {
                opacity: "0.8",
                width: "100%",
                height: "5rem",
                padding : "1rem",
                marginBottom : "1rem",
                borderRadius : ".55rem",
                background : "rgba(255,255,255,.06)"
            }
        });
    }


}
