import { Request, Response } from "express";
import { Database } from "../db";
import Model from "./model";


export class Tasks implements Model {

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

        const SQL = "SELECT * FROM task WHERE author = ?";
        const response = db.db.all(
            SQL,
            username,
        );

        return response;
    }

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
}
