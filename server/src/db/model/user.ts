import { Request, Response } from "express";
import { Database } from "../db.js";
import Model from "./model.js";

export class UserModel implements Model {

    static async registerUser(db: Database, req: Request, res: Response): Promise<any> {
        const username = req?.body?.user;
        const mail = req?.body?.mail;
        const password = req?.body?.mail;

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

}