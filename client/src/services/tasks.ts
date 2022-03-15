import { APP } from "../app.js";
import { ITask } from "../core/data/interfaces/task.js";
import { HTTPS_METHOD } from "../lib/gtd-ts/core/http.js";
import { efetch, Response } from "../lib/gtd-ts/data/easyfetch.js";

export class taskService {
   
    static getUserTasks(username : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: APP.configurations.API.GET_USER_TASKS,
            parameters: {
                user: username,
            },
        });

        return response;
    }

    static getUserTasksFromCategory(username : string, category : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: APP.configurations.API.GET_USER_TASKS_FROM_CATEGORY,
            parameters: {
                user: username,
                category: category,
            },
        });
        
        return response;
    }


    static getUserTaskCategories(username : string) : Response {

        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: APP.configurations.API.GET_USER_TASK_CATEGORIES,
            parameters: {
                user: username,
            },
        });

        return response;
    }


    static insertUserTask(task: ITask) : Response {

        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: APP.configurations.API.INSERT_USER_TASK,
            parameters: {
                task: task
            },
        });

        return response;
    }
}
