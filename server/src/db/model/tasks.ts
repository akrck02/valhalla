import Model from "./model.js";
import { Database } from "../db";

export default class Tasks implements Model {


    /**
     * 
     * @param db The databas3e connection
     * @param username The user who owns the tasks
     * @returns The query result
     */
    public static getUserTasks(db: Database, username: string): Promise<any> {
        const SQL = "SELECT * FROM task WHERE author = ?";
        const response = db.db.all(
            SQL,
            username,
        );

        return response;
    }

}