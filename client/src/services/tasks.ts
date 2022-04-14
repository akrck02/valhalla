import { APP } from "../app.js";
import { Configurations } from "../config/config.js";
import { DateText } from "../core/data/integrity/dateText.js";
import { ITask } from "../core/data/interfaces/task.js";
import { HTTPS_METHOD } from "../lib/gtd-ts/core/http.js";
import { efetch, Response } from "../lib/gtd-ts/data/easyfetch.js";

export class taskService {

    /**
     * Search for tasks by name
     * @param username The username of the user
     * @param searcher The name to search for
     * @returns The tasks found
     */
    static searchUserTasksByName(username : string, searcher : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.SEARCH_USER_TASKS_BY_NAME,
            parameters: {
                user: username,
                searcher: searcher
            },
        });

        return response;
    }
   
    /**
     * Get the task of a user from the API
     * @param username The username of the user
     * @returns The task of the user
     */
    static getUserTasks(username : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_TASKS,
            parameters: {
                user: username,
            },
        });

        return response;
    }

    /**
     * Get the user tasks for a given month and year 
     * @param username The username of the user
     * @param month The month to get the tasks for
     * @param year The year to get the tasks for
     * @returns The tasks of the user
     */
    static getUserMonthTasks(username : string, month :number, year : number) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_MONTH_TASKS,
            parameters: {
                user: username,
                month: DateText.normalize(month,2),
                year: DateText.normalize(year,4)
            },
        });

        return response;
    }

    /**
     * Get the user tasks for a given category
     * @param username The username of the user
     * @param category The category to get the tasks for
     * @returns The tasks of the user
     */
    static getUserTasksFromCategory(username : string, category : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_TASKS_FROM_CATEGORY,
            parameters: {
                user: username,
                category: category,
            },
        });
        
        return response;
    }


    /**
     * Get the user tasks for a given category
     * @param username The username of the user
     * @param category The category to get the tasks for
     * @returns The tasks of the user
     */
     static getUserDoneTasksFromCategory(username : string, category : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_DONE_TASKS_FROM_CATEGORY,
            parameters: {
                user: username,
                category: category,
            },
        });
        
        return response;
    }

    /**
     * Get the user tasks for a given category
     * @param username The username of the user
     * @param category The category to get the tasks for
     * @returns The tasks of the user
     */
     static getUserNotdoneTasksFromCategory(username : string, category : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_NOT_DONE_TASKS_FROM_CATEGORY,
            parameters: {
                user: username,
                category: category,
            },
        });
        
        return response;
    }

    /**
     * Get the categories of the user tasks
     * @param username The username of the user
     * @returns The categories of the user tasks
     */
    static getUserTaskCategories(username : string) : Response {

        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_TASK_CATEGORIES,
            parameters: {
                user: username,
            },
        });

        return response;
    }

    /**
     * Create a new task
     * @param task The task to create
     * @returns The task created
     */
    static insertUserTask(task: ITask) : Response {

        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.INSERT_USER_TASK,
            parameters: {
                task: task
            },
        });

        return response;
    }

    /**
     * Delete a task
     * @param task The task to delete
     * @returns The task deleted
     */
    static deleteUserTask(task: ITask) : Response { 

        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.DELETE_USER_TASK,
            parameters: {
                task: task
            },
        });

        return response;
    }

    /**
     * Delete some tasks
     * @param task The tasks to delete
     * @returns The tasks deleted
     */
    static deleteUserTasks(tasks: ITask[]) : Response { 

        console.log(tasks);
        

        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.DELETE_USER_TASKS,
            parameters: {
                tasks: tasks
            },
        });
    
        return response;
    }

    /**
     * Get a task
     * @param taskId The id of the task to get 
     * @returns The task 
     */
    static getUserTask(taskId: string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_TASK,
            parameters: {
                id: taskId
            },
        });

        return response;
    }

    /**
     * Update a task
     * @param task 
     * @returns The if the task was updated
     */
    static updateUserTask(task: ITask) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.UPDATE_USER_TASK,
            parameters: {
                task: task
            },
        });

        return response;
    }

    /**
     * Update a task done status
     * @param task 
     * @returns The if the task was updated
     */
    static updateUserTaskDone(task: ITask) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.UPDATE_USER_TASK_DONE,
            parameters: {
                task: task
            },
        });

        return response;
    }


     /**
     * Update a task done status
     * @param task 
     * @returns The if the task was updated
     */
    static updateUserTasksDone(tasks: ITask[]) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.UPDATE_USER_TASKS_DONE,
            parameters: {
                tasks: tasks
            },
        });

        return response;
    }

}