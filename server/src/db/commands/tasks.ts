import { Request, Response } from "express";
import { Database } from "../db";
import HTTPResponse from "./httpResponse";
import TaskModel from "../model/tasks"


export class Tasks implements HTTPResponse {

    /**
     * Get the user tasks from database
     * @param db the database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @return a promise
     */
    public static getUserTasks(db: Database, req: Request, res: Response) : Promise<any> {

        const username = req?.body?.user;

        if(username == undefined){
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
     * Get the user tasks from category from the database
     * @param db The database connection
     * @param req The HTTP request 
     * @param res The HTTP response
     * @returns a promise
     */
    public static getUserTasksFromCategory(db: Database, req: Request, res: Response): Promise<any> {

        const username = req?.body?.user;
        const category = req?.body?.category;

        if(username == undefined || category == undefined){
            return new Promise((resolve) => 
                resolve({
                    status : "failed",
                    reason : "Missing parameters"
                })
            );
        }

        const SQL = "SELECT * FROM task WHERE author = ? AND id IN (SELECT taskId FROM task_label WHERE label = ?) ORDER BY end ASC";
        const response = db.db.all(
            SQL,
            username,
            category
        );

        return response;
    }

    /**
     * Get the user task categories
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns a promise
     */
    public static getUserTaskCategories(db: Database, req: Request, res: Response) : Promise<any> {

        const username = req?.body?.user;

        if(username == undefined){
            return new Promise((resolve) => 
                resolve({
                    status : "failed",
                    reason : "Missing parameters"
                })
            );

        }

        const SQL = "SELECT DISTINCT(label) FROM task_label WHERE taskId IN (SELECT id FROM task WHERE author = ?)";
        const response = db.db.all(SQL, username);

        return response;
    }


    public static insertUserTask() : void {}
    public static getUserMonthTasks() : void {}
}