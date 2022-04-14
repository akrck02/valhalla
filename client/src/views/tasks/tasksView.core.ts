import { resolve } from "path";
import { App, APP } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { DateText } from "../../core/data/integrity/dateText.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { taskService } from "../../services/tasks.js";
import TasksView from "./tasksView.ui.js";

export default class TaskCore {

    private view: TasksView;
    private notDoneTasks: ITask[];
    private doneTasks: ITask[];

    constructor(view: TasksView) {
        this.view = view;
        this.notDoneTasks = [];
        this.doneTasks = [];
    }

    /**
     * Get done tasks for a user given a category
     * @param user User to get tasks for
     * @param category Category to get tasks for
     * @returns a promise that resolves to an array of tasks
     */
    async getDoneTasks(user: string, category: string): Promise<any> {
        const response = taskService.getUserDoneTasksFromCategory(user, category);
        response.success(((res) => this.doneTasks = res));

        await response.jsonPromise();
        return new Promise((resolve) => resolve(this.doneTasks));
    }

    /**
     * Get not done tasks for a user given a category
     * @param user User to get tasks for
     * @param category Category to get tasks for
     * @returns a promise that resolves to an array of tasks
     */
    async getNotDoneTasks(user: string, category: string): Promise<any> {
        const response = taskService.getUserNotdoneTasksFromCategory(user, category);
        response.success(((res) => this.notDoneTasks = res));

        await response.jsonPromise();
        return new Promise((resolve) => resolve(this.notDoneTasks));
    }

    /**
     * Find a task given an id
     * @param id The id of the task to find
     * @returns a promise that resolves to a task
     */
    public findTask(id: number) : ITask {
        return this.notDoneTasks.find(task => task.id === id) || this.doneTasks.find(task => task.id === id);
    }


    /**
     * Toggle the "done" status of a task
     * @param id The id of the task to toggle
     */
    public async toggle(id: string) {
        const findDone = this.doneTasks.find((t) => t.id === parseInt(id));
        const findNotDone = this.notDoneTasks.find((t) => t.id === parseInt(id));

        if (!findDone && !findNotDone) {
            alert({
                message: "Error",
                icon: "block"
            });

            return;
        }

        if (findDone) {
            findDone.done = 0;
            this.doneTasks.slice(this.doneTasks.indexOf(findDone), 1);
            this.notDoneTasks.push(findDone);
        }

        if (findNotDone) {
            findNotDone.done = 1;
            this.notDoneTasks.slice(this.notDoneTasks.indexOf(findNotDone), 1);
            this.doneTasks.push(findNotDone);
        }

    }

    /**
     * Toggle multiple task done status in the view 
     * @param tasks The tasks to toggle
     */
    public async toogleTasks(tasks: string[]) {

        const taskObjects = [];
        await tasks.forEach(async (task) => {
            const taskObject = await this.findTask(parseInt(task));

            if (taskObject) {
                taskObjects.push(taskObject);
                await this.toggle(task);
            }
        });

        const response = taskService.updateUserTasksDone(taskObjects);
        let responseJson: any;

        response.success(json => {
            responseJson = json;
        })
        await response.jsonPromise();

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

        const today = new Date();

        // if today and 6 hours or less
        if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate() && date.getHours() <= today.getHours() + 6) {
            const diff = date.getHours() - today.getHours();

            if (diff <= 6) {
                if (diff > 0) return `${diff}h`;
                //else return App.getBundle().tasks.NOW;
            }
        }

        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (today.toString() === date.toString()) {
            return App.getBundle().tasks.TODAY;
        } else {

            today.setDate(today.getDate() + 1);
            if (date.toString() === today.toString()) { return App.getBundle().tasks.TOMORROW; }
            else { return DateText.toLocalizedDateString(date) }
        }
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
        this.view.element.dataset.selected = selected;
    }

    /**
     * Get the selected category of the view
     * @returns The selected category
     */
    public getSelectedCategory() {
        return this.view.element.dataset?.selected;
    }


}