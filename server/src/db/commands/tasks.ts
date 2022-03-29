import { Request, Response } from "express";
import { Database } from "../db";
import HTTPResponse from "./httpResponse";
import TaskModel from "../model/tasks"
import { ITask } from "../classes/task";


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

        return TaskModel.getUserTasksFromCategory(db,username,category);
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
    
            if(username == undefined || month == undefined || year == undefined){
                return new Promise((resolve) => 
                    resolve({
                        status : "failed",
                        reason : "Missing parameters"
                    })
                );
            }

            const response = await TaskModel.getUserMonthTasks(db,username,year,month);
            let monthTasks : {[key:string] : any} = {};

            //task per date
            response.forEach((element : {[key : string] : any}) => {

                if(!monthTasks[(element.end) as string]){
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

        return TaskModel.getUserTaskCategories(db,username);
    }


    public static async insertUserTask(db: Database, req: Request, res: Response) : Promise<any> {
        try {
            const task : ITask = req?.body?.task;
            if(await TaskModel.insertUserTask(db,task)){
                return new Promise((resolve) => 
                    resolve({
                        status : "success",
                        reason : "User task successfully inserted"
                    })
                );
            }

            return new Promise((resolve) => 
                resolve({
                    status : "Error",
                    reason : "Task wasn't inserted"
                })
            );
        } catch(error) {
            console.error(error);
            return new Promise((resolve) => 
                resolve({
                    status : "failed",
                    reason : "Missing parameters"
                })
            );
        } 
    }

    public static setTagToUserTask(db: Database, req: Request, res: Response) : void {

    }


    public  static async deleteUserTask(db: Database, req: Request, res: Response) : Promise<any> {
        try {
            const task : ITask = req?.body?.task;
            if(await TaskModel.deleteUserTask(db,task)){
                return new Promise((resolve) => 
                    resolve({
                        status : "success",
                        reason : "User task successfully deleted"
                    })
                );
            }

            return new Promise((resolve) => 
                resolve({
                    status : "Error",
                    reason : "Task wasn't deleted"
                })
            );
        } catch(error) {
            console.error(error);
            return new Promise((resolve) => 
                resolve({
                    status : "failed",
                    reason : "Missing parameters"
                })
            );
        } 
    }
}