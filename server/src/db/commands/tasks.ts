import { Request, Response } from "express";
import { Database } from "../db";
import HTTPResponse from "./httpResponse";
import TaskModel from "../model/tasks"
import { ITask } from "../classes/task";
import LabelModel from "../model/labels";


export class TasksResponse implements HTTPResponse {

    /**
     * Update a user task
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static searchTasksByName(db: Database, req: Request, res: Response): Promise<any> {
        const username = req?.body?.user;
        const searcher = req?.body?.searcher;

        if (username == undefined || searcher == undefined) {
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }

        return TaskModel.searchTasksByName(db, username, searcher);

    }

    /**
     * Search the user task categories by name
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     */
    public static searchCategoriesByName(db: Database, req: Request, res: Response): Promise<any> {
        const username = req?.body?.user;
        const searcher = req?.body?.searcher;

        if (username == undefined || searcher == undefined) {
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }

        return LabelModel.searchCategoriesByName(db, username, searcher);
    
    }

    /**
     * Get the user tasks from database
     * @param db the database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @return a promise
     */
    public static getUserTasks(db: Database, req: Request, res: Response): Promise<any> {

        const username = req?.body?.user;

        if (username == undefined) {
            return new Promise((resolve) => {
                resolve({
                    "status": "failed",
                    "reason": "No username provided"
                });
            });
        }

        return TaskModel.getUserTasks(db, username);
    }

    /**
     * Get the user done tasks from database
     * @param db the database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @return a promise
     */
    public static getUserDoneTasks(db: Database, req: Request, res: Response): Promise<any> {

        const username = req?.body?.user;

        if (username == undefined) {
            return new Promise((resolve) => {
                resolve({
                    "status": "failed",
                    "reason": "No username provided"
                });
            });
        }

        return TaskModel.getUserDoneTasks(db, username);
    }

    /**
     * Get the user done tasks from database
     * @param db the database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @return a promise
     */
    public static getUserNotDoneTasks(db: Database, req: Request, res: Response): Promise<any> {

        const username = req?.body?.user;

        if (username == undefined) {
            return new Promise((resolve) => {
                resolve({
                    "status": "failed",
                    "reason": "No username provided"
                });
            });
        }

        return TaskModel.getUserNotDoneTasks(db, username);
    }


    /**
    * Get the user task from database
    * @param db the database connection
    * @param req The HTTP request
    * @param res The HTTP response
    * @return a promise
    */
    public static async getUserTask(db: Database, req: Request, res: Response): Promise<any> {

        const id = req?.body?.id;

        if (id == undefined) {
            return new Promise((resolve) => {
                resolve({
                    "status": "failed",
                    "reason": "No task id provided"
                });
            });
        }

        let task = (await TaskModel.getUserTask(db, id))[0];
        let labels = await LabelModel.getUserTaskLabels(db, id);
        task.labels = [];

        labels.forEach((element: { [key: string]: any }) => {
            task.labels.push(element.label);
        });

        return task;
    }


    /**
     * Get the user tasks from category from the database
     * @param db The database connection
     * @param req The HTTP request 
     * @param res The HTTP response
     * @returns a promise
     */
    public static async  getUserTasksFromCategory(db: Database, req: Request, res: Response): Promise<any> {

        const username = req?.body?.user;
        const category = req?.body?.category;

        if (username == undefined) {
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }

        if(category == "none" || !category){
            return TaskModel.getUserTasksWithoutCategory(db, username);
        }

        let tasks = await TaskModel.getUserTasksFromCategory(db, username, category);
        let newTasks : ITask[] = [];

    

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const categories = await LabelModel.getUserTaskLabels(db,task.id+"");
            task.labels = [];
            categories.forEach((category : any) => task.labels?.push(category.label));

            console.log(JSON.stringify(task,null,2));
            newTasks.push(task);
        }

        return newTasks;
        
    }

    /**
     * Get the user tasks from a given moth
     * @param db The database connection
     * @param req The HTTP request 
     * @param res The HTTP response
     * @returns a promise
     */
    public static async getUserMonthTasks(db: Database, req: Request, res: Response): Promise<any> {

        const username = req?.body?.user;
        const month = req?.body?.month;
        const year = req?.body?.year;

        if (username == undefined || month == undefined || year == undefined) {
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }

        const response = await TaskModel.getUserMonthTasks(db, username, year, month);
        let monthTasks: { [key: string]: any } = {};

        //task per date
        response.forEach((element: { [key: string]: any }) => {

            if (!monthTasks[(element.end) as string]) {
                monthTasks[(element.end) as string] = [];
            }

            monthTasks[(element.end) as string].push(element);
        });

        return new Promise((resolve) => resolve(monthTasks));
    }

    /**
     * Get the user task categories
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static async getUserTaskCategories(db: Database, req: Request, res: Response): Promise<any> {

        const username = req?.body?.user;

        if (username == undefined) {
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );

        }

        const categories = await LabelModel.getUserTaskCategories(db, username);
        const taskWithoutCategory = await TaskModel.getUserTasksWithoutCategory(db,username);

        if(taskWithoutCategory.length != 0){
            categories.push({"label":"none"})
        }

        return categories;
    }

    /**
     * Insert a new user task
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static async insertUserTask(db: Database, req: Request, res: Response): Promise<any> {
        try {
            const task: ITask = req?.body?.task;

            if (!task.done) {
                task.done = 0;
            }

            if (!task.allDay) {
                task.allDay = 0;
            }

            if (await TaskModel.insertUserTask(db, task)) {
                return new Promise((resolve) =>
                    resolve({
                        status: "success",
                        reason: "User task successfully inserted"
                    })
                );
            }

            return new Promise((resolve) =>
                resolve({
                    status: "Error",
                    reason: "Task wasn't inserted"
                })
            );
        } catch (error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }
    }

    /**
     * Update a user task
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     */
    public static setTagToUserTask(db: Database, req: Request, res: Response): void {

    }

    /**
     * Update the user task
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static async deleteUserTask(db: Database, req: Request, res: Response): Promise<any> {
        try {
            const task: ITask = req?.body?.task;
            if ((await TaskModel.deleteUserTask(db, task)).success) {
                await LabelModel.deleteUserTaskLabels(db, task);
                return new Promise((resolve) =>
                    resolve({
                        status: "success",
                        reason: "User task successfully deleted"
                    })
                );
            }

            return new Promise((resolve) =>
                resolve({
                    status: "Error",
                    reason: "Task wasn't deleted"
                })
            );
        } catch (error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }
    }

    /**
     * Update the user tasks
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static async deleteUserTasks(db: Database, req: Request, res: Response): Promise<any> {
        try {
            const tasks: ITask[] = req?.body?.tasks;
            const taskDeleted: string[] = [];

            tasks.forEach(async (task: ITask) => {
                if ((await TaskModel.deleteUserTask(db, task)).success) {
                    if (task.name) {
                        await LabelModel.deleteUserTaskLabels(db, task);
                        taskDeleted.push(task.name);
                    }
                }
            });

            return new Promise((resolve) =>
                resolve({
                    status: "success",
                    reason: "Deleted tasks " + taskDeleted.join(", "),
                    tasks: taskDeleted
                })
            );
        } catch (error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }
    }


    /**
     * Update the user task
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static async updateUserTask(db: Database, req: Request, res: Response): Promise<any> {

        try {
            const task: ITask = req?.body?.task;
            if (!task) {
                return new Promise((resolve) =>
                    resolve({
                        status: "failed",
                        reason: "Missing parameters"
                    })
                );
            }

            await LabelModel.deleteUserTaskLabels(db, task);

            task.labels?.forEach(async (key: string) => {
                await LabelModel.setLabelToTask(db, task.id + "" || "", key);
            });

            if ((await TaskModel.updateUserTask(db, task)).success) {
                return new Promise((resolve) =>
                    resolve({
                        status: "success",
                        reason: "User task successfully updated"
                    })
                );
            }

            return new Promise((_,reject) =>
                reject({
                    status: "failed",
                    reason: "Task wasn't updated, " + task.id
                })
            );

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }
    }

    /**
     * Update the user task done status
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static async updateUserTaskDone(db: Database, req: Request, res: Response): Promise<any> {

        try {
            const task: ITask = req?.body?.task;
            if (!task || task.done == undefined) {
                return new Promise((resolve) =>
                    resolve({
                        status: "failed",
                        reason: "Missing parameters"
                    })
                );
            }

            if ((await TaskModel.updateUserTask(db, task)).success) {
                return new Promise((resolve) =>
                    resolve({
                        status: "success",
                        reason: "User task successfully updated"
                    })
                );
            }

            return new Promise((resolve) =>
                resolve({
                    status: "Error",
                    reason: "Task wasn't updated"
                })
            );

        } catch (error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }
    }

    /**
 * Update the user task done status
 * @param db The database connection
 * @param req The HTTP request
 * @param res The HTTP response
 * @returns a promise
 */
    public static async updateUserTasksDone(db: Database, req: Request, res: Response): Promise<any> {

        try {
            const tasks: ITask[] = req?.body?.tasks;
            if (!tasks) {
                return new Promise((resolve) =>
                    resolve({
                        status: "failed",
                        reason: "Missing parameters"
                    })
                );
            }

            let updatedTaskNames: string[] = [];

            await tasks.forEach(async (task: ITask) => {

                if ((await TaskModel.updateUserTask(db, task)).success) {
                    if (task.name) {
                        updatedTaskNames.push(task.name);
                    }
                }

            });

            return new Promise((resolve) =>
                resolve({
                    status: "Success",
                    reason: "Updated tasks " + updatedTaskNames.join(", "),
                    tasks: updatedTaskNames
                })
            );

        } catch (error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({
                    status: "failed",
                    reason: "Missing parameters"
                })
            );
        }
    }


}