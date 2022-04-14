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


}