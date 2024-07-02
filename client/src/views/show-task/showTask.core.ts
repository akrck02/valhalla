import { App } from "../../app.js";
import { DateText } from "../../core/data/integrity/dateText.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { taskService } from "../../services/tasks.js";

export default class ShowTaskCore {

    private task: ITask;

    public constructor(){

    }

    public async getTask(id: number): Promise<ITask> {
        const response = taskService.getUserTask(id + "");
        response.success(((res) => this.task = res));

        await response.jsonPromise();
        return new Promise((resolve) => resolve(this.task));
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
     * Get categories for a user
     * @param id the id of the task
     * @returns a promise that resolves to an array of categories
     */
    async deleteUserTask(id: number): Promise<any> {
        const response = taskService.deleteUserTask({ id: id });

        await response.jsonPromise();
        return new Promise((resolve) => { resolve({}) });
    }
}