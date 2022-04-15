import { Request, Response } from "express";
import { Database } from "./db";
import { Tasks } from "./commands/tasks";

export class Router {

    public API = "/api/v1/";
    public PATHS : {[key:string] : (db : Database, req : Request, res : Response) => Promise<any>};

    public constructor() {
        this.PATHS = {
            "get/user/tasks" : Tasks.getUserTasks,
            "get/user/done/tasks" : Tasks.getUserDoneTasks,
            "get/user/not/done/tasks" : Tasks.getUserNotDoneTasks,
            "get/user/task" : Tasks.getUserTask,
            "get/user/month/tasks" : Tasks.getUserMonthTasks,
            "get/user/tasks/from/category" : Tasks.getUserTasksFromCategory,
            "get/user/done/tasks/from/category" : Tasks.getUserDoneTasksFromCategory,
            "get/user/not/done/tasks/from/category" : Tasks.getUserNotDoneTasksFromCategory,
            "get/user/task/categories" : Tasks.getUserTaskCategories,
            "insert/user/task" : Tasks.insertUserTask,
            "delete/user/task" : Tasks.deleteUserTask,
            "delete/user/tasks" : Tasks.deleteUserTasks,
            "update/user/task" : Tasks.updateUserTask,
            "update/user/task/done" : Tasks.updateUserTaskDone,
            "update/user/tasks/done" : Tasks.updateUserTasksDone,
            "search/user/tasks/by/name" : Tasks.searchTasksByName,
            "search/user/categories/by/name" : Tasks.searchCategoriesByName,
        }
    }
}