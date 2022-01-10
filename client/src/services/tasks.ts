import { APP } from "../app.js";
import { HTTPS_METHOD } from "../lib/core/http.js";
import { efetch, Response } from "../lib/data/easyfetch.js";

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
}