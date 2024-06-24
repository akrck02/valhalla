
import { APP, App } from "../../app.js";
import TaskStatusComponent from "../../components/status/status.js";
import { Configurations } from "../../config/config.js";
import { TaskStatus } from "../../core/data/enums/task.status.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../services/tasks.js";
import NewTaskView from "../new-tasks/newTaskView.ui.js";
import CategoryBar from "./components/categoryBar.js";
import TaskCore from "./tasksView.core.js";

export default class TasksView extends UIComponent {

    private core: TaskCore;

    private wrapper : UIComponent;
    private toolbar : UIComponent;
    private taskContainer: UIComponent;
    private categoryBar: CategoryBar;

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
            data: { selected : "none" }
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

        console.log(params);
        console.log(Configurations.getConfigVariable("TASKS_SELECTED_CATEGORY"));
        
        const selectedCategory = params[0] || Configurations.getConfigVariable("TASKS_SELECTED_CATEGORY");

        this.categoryBar = new CategoryBar(
            selectedCategory,
            (selected) => this.showTasks(selected),
            () => {
                const taskView = new NewTaskView();
                taskView.show([], new UIComponent({}));
                
                APP.router.modal.setContent(taskView);
                APP.router.modal.show();
            }
        );

        this.wrapper.appendChild(this.taskContainer);
        this.appendChild(this.categoryBar);
        this.appendChild(this.wrapper);
        this.appendTo(container);

        setTimeout(() => this.categoryBar.show(), 100);
    }

    /**
     * Show the task of a selected category
     * @param configurations The configurations of the application
     * @param selected The selected category
     */
    private async showTasks(selected: string) {

        this.core.setSelectedCategory(selected);
        this.taskContainer.clean();
        const done = await this.showTasksList(selected);

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

        const noSelectedCategoryTitle = getMaterialIcon("label_off",{ size: "1.7rem", fill: "var(--text-color)" }).toHTML() + "&nbsp;" + App.getBundle().tasks.OTHERS;
        const title = new UIComponent({
            type: "h1",
            text: selected ? selected : noSelectedCategoryTitle,
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
                return;
            } 

            this.element.classList.add("select");

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
        
        this.toolbar.appendChild(deleteTask);

        this.toolbar.appendChild(check);
        this.toolbar.appendChild(reload);

    }


    /**
     * Show the done tasks
     * @param selected The selected category 
     * @param container The container to append the tasks to
     * @returns the promise containing the number of tasks
     */
    private async showTasksList(selected : string) : Promise<number> {

        this.taskContainer.clean();

        const titleBar = this.buildTitleBar(selected);
        this.taskContainer.appendChild(titleBar);

        const tasks = await this.core.getTasks(Configurations.getUserName(), selected);

        tasks.forEach((task: ITask) => {
            const taskComponent = this.buildTask(task, this.taskContainer);
            this.taskContainer.appendChild(taskComponent);
        });

        if(tasks.length == 0) {
            const congratulationMessage = new UIComponent({
                type: "p",
                text: App.getBundle().tasks.ALL_TASKS_COMPLETED + " 🤗",
                styles: {
                    opacity : ".75"
                }
            })

            congratulationMessage.appendTo(this.taskContainer);
        }

        return new Promise((res) => res (tasks.length));
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


        const taskInfoBox = new UIComponent({
            type: "div",
            classes: ["box-row", "box-y-center"],
        });

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

        const status = new TaskStatusComponent(currentTask.status);

        task.appendChild(taskTitle);
        task.appendChild(taskInfoBox);
        taskInfoBox.appendChild(status);
        taskInfoBox.appendChild(taskTime);
        taskBox.appendChild(switchControl);
        taskBox.appendChild(task);

        const toolbar = new UIComponent({
            type: "div",
            id: "task-" + currentTask.id,
            classes: ["box-row", "box-y-center", "box-x-between", "task-toolbar"],
        });

        const inProgressIcon = getMaterialIcon("progress_activity", { size: "1.2rem", fill: "#fff" });
        const pendingIcon = getMaterialIcon("pending",{ size: "1.2em", fill: "white" });
        const doneIcon = getMaterialIcon( currentTask.status == TaskStatus.DONE? "task_alt" : "radio_button_unchecked", { size: "1.2em", fill: "white" }); 
      
        inProgressIcon.element.onclick = async () =>{
            currentTask.status = TaskStatus.IN_PROGRESS;
            const res = taskService.updateUserTask(currentTask);
            await res.jsonPromise();
            this.showTasksList(Configurations.getConfigVariable("TASKS_SELECTED_CATEGORY"));
        }
        pendingIcon.element.onclick = async () => {
            currentTask.status = TaskStatus.TODO;
            const res = taskService.updateUserTask(currentTask);
            await res.jsonPromise();
            this.showTasksList(Configurations.getConfigVariable("TASKS_SELECTED_CATEGORY"));
        };
        doneIcon.element.onclick = async () => {
            currentTask.status = TaskStatus.DONE;
            const res = taskService.updateUserTask(currentTask);
            await res.jsonPromise();
            this.showTasksList(Configurations.getConfigVariable("TASKS_SELECTED_CATEGORY"));
        }

        toolbar.appendChild(doneIcon);
        toolbar.appendChild(inProgressIcon);
        toolbar.appendChild(pendingIcon);
        
        toolbar.appendTo(taskBox);
        
        setTimeout(() => {
            task.element.style.opacity = "1";
        },  Configurations.areAnimationsEnabled()? 100 : 0);

        return taskBox;
    } 



}
