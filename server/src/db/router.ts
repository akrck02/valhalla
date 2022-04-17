import { Request, Response } from "express";
import { Database } from "./db";
import { TasksResponse } from "./commands/tasks";
import { NotesResponse } from "./commands/notes";

export class Router {

    public API = "/api/v1/";
    public PATHS : {[key:string] : (db : Database, req : Request, res : Response) => Promise<any>};

    public constructor() {
        this.PATHS = {

            // GET METHODS
            "get/user/tasks" : TasksResponse.getUserTasks,
            "get/user/notes" : NotesResponse.getUserNotes,
            "get/user/done/tasks" : TasksResponse.getUserDoneTasks,
            "get/user/not/done/tasks" : TasksResponse.getUserNotDoneTasks,
            "get/user/task" : TasksResponse.getUserTask,
            "get/user/month/tasks" : TasksResponse.getUserMonthTasks,
            "get/user/tasks/from/category" : TasksResponse.getUserTasksFromCategory,
            "get/user/done/tasks/from/category" : TasksResponse.getUserDoneTasksFromCategory,
            "get/user/not/done/tasks/from/category" : TasksResponse.getUserNotDoneTasksFromCategory,
            "get/user/task/categories" : TasksResponse.getUserTaskCategories,
            
            // INSERT METHODS
            "insert/user/task" : TasksResponse.insertUserTask,
            "insert/user/note" : NotesResponse.insertUserNote,

            // DELETE METHODS
            "delete/user/task" : TasksResponse.deleteUserTask,
            "delete/user/tasks" : TasksResponse.deleteUserTasks,
            
            // UPDATE METHODS
            "update/user/task" : TasksResponse.updateUserTask,
            "update/user/task/done" : TasksResponse.updateUserTaskDone,
            "update/user/tasks/done" : TasksResponse.updateUserTasksDone,

            // SEARCH METHODS
            "search/user/tasks/by/name" : TasksResponse.searchTasksByName,
            "search/user/categories/by/name" : TasksResponse.searchCategoriesByName,

            // ASSIGN METHODS
            "assign/note/to/task" : NotesResponse.assignNoteToTask,
        }
    }
}