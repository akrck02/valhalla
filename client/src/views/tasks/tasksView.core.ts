import { resolve } from "path";
import { App, APP } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { DateText } from "../../core/data/integrity/dateText.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { taskService } from "../../services/tasks.js";
import TasksView from "./tasksView.ui.js";
import { TaskStatus } from "../../core/data/enums/task.status.js";

export default class TaskCore {

    private view: TasksView;
    private tasks: ITask[];
    private descend : boolean;

    constructor(view: TasksView) {
        this.view = view;
        this.tasks = [];
        this.descend = false;
    }

    /**
     * Get done tasks for a user given a category
     * @param user User to get tasks for
     * @param category Category to get tasks for
     * @returns a promise that resolves to an array of tasks
     */
    async getTasks(user: string, category: string): Promise<any> {
        const response = taskService.getUserTasksFromCategory(user, category);
        response.success(((res) => this.tasks = res));
        await response.jsonPromise();


        //order by status
        this.tasks = this.order(this.tasks);
      
        if(this.descend)
            this.tasks.reverse();  
        
        return new Promise((resolve) => resolve(this.tasks));
    }

    order(tasks: ITask[]) {
        return tasks.sort((a, b) => this.compareStatus(a, b));
    }

    reverse(){
        this.descend =! this.descend;
    }

    compareStatus(a: ITask, b: ITask) {
        if(a.status === TaskStatus.DONE && b.status !== TaskStatus.DONE)
            return 1;

        if(a.status !== TaskStatus.DONE && b.status === TaskStatus.DONE)
            return -1;

        if(a.status === TaskStatus.IN_PROGRESS && b.status === TaskStatus.TODO)
            return 1;

        if(a.status === TaskStatus.TODO && b.status === TaskStatus.IN_PROGRESS)
            return -1;

        return 0;
    }

    /**
     * Get categories for a user
     * @param user User to get categories for
     * @returns a promise that resolves to an array of categories
     */
    async getCategories(user: string): Promise<any> {
        let categories = [];
        const response = taskService.getUserTaskCategories(user);
        response.success(((res) => { categories = res; }));

        await response.jsonPromise();
        return new Promise((resolve) => { resolve(categories) });
    }

    /**
     * Get categories for a user
     * @param id the id of the task
     * @returns a promise that resolves to an array of categories
     */
    async deleteUserTask(id: number): Promise<any> {
        const response = taskService.deleteUserTask({ id: id });

        await response.jsonPromise();
        return new Promise((resolve) => { resolve({}) });
    }

    /**
     * Get categories for a user
     * @param id the id of the task
     * @returns a promise that resolves to an array of categories
     */
     async deleteUserTasks(ids: number[]): Promise<any> {
        const response = taskService.deleteUserTasks(ids.map(id => { return { id: id } }));

        await response.jsonPromise();
        return new Promise((resolve) => { resolve({}) });
    }

    /**
     * Get the user-friendly text for a given date
     * @param date Date to get text for
     * @returns a string representing the date
     */
    public getTimeText(date: Date): string {
        return DateText.getTimeText(date);
    }

    /**
     * Go to new task view
     */
    public newTask() {
        location.href = Configurations.VIEWS.NEW_TASK;
    }


    /**
     * Go to a given category
     * @param category The category to navigate to
     */
    public goToCategory(category: string) {

        //Assure that the view is loaded loading a new view and then loading the original view
        location.href = Configurations.VIEWS.NEW_TASK;
        location.href = Configurations.VIEWS.TASKS + category;
    }

    /**
     * Go to a given task
     * @param task The task to navigate to
     */
     public goToTask(task: string) {

        //Assure that the view is loaded loading a new view and then loading the original view
        location.href = Configurations.VIEWS.NEW_TASK;
        location.href = Configurations.VIEWS.TASK + task;
    }

    /**
     * Set the selected category of the view
     * @param selected The selected category
     */
    public setSelectedCategory(selected: string) {

        if(!selected || selected === "" || selected === "null" || selected === "undefined")
            selected = "none";

        this.view.element.dataset.selected = selected;
    }

    /**
     * Get the selected category of the view
     * @returns The selected category
     */
    public getSelectedCategory() {
        return this.view.element.dataset?.selected || "none";
    }


}