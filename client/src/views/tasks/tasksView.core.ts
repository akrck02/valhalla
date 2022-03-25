import { resolve } from "path";
import { APP } from "../../app.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { taskService } from "../../services/tasks.js";
import TasksView from "./tasksView.ui.js";

export default class TaskCore {

    private parent : TasksView;
    constructor( parent : TasksView) {
        this.parent = parent;
    }

    /**
     * Get all tasks for a user given a category
     * @param user User to get tasks for
     * @param category Category to get tasks for
     * @returns a promise that resolves to an array of tasks
     */
    async getTasks(user: string, category : string) : Promise<any> {
        let tasks = {};
        const response = taskService.getUserTasksFromCategory(user,category);
        response.success(((res) => tasks = res));

        await response.jsonPromise();
        return new Promise((resolve) => {resolve(tasks)});
    }

    /**
     * Get categories for a user
     * @param user User to get categories for
     * @returns a promise that resolves to an array of categories
     */
    async getCategories(user: string) : Promise<any> {
        let categories = [];
        const response = taskService.getUserTaskCategories(user);
        response.success(((res) => { categories = res; }));
        
        await response.jsonPromise();
        return new Promise((resolve) => {resolve(categories)});
    }

    /**
     * Get the user-friendly text for a given date
     * @param date Date to get text for
     * @returns a string representing the date
     */
    public getTimeText(date: Date): string {

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
            if (date.toString() === today.toString()) { return "Tomorrow"; } 
            else { return date.toLocaleDateString(); }
        }
    }

    /**
     * Go to new task view
     */
    public newTask() {
        location.href = APP.configurations.VIEWS.NEW_TASK;
    }


}