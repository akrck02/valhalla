
import { SUCCESS_FALSE, SUCCESS_TRUE } from "../../core/types";
import { StringUtils } from "../../utils/string";
import { ITask } from "../classes/task";
import { Database } from "../db";
import Model from "./model";

export default class Labels implements Model {

    /**
     * Delete all labels from the given task
     * @param db The task db
     * @param task The task itself
     * @returns If operation succeded
     */
     public static async deleteUserTaskLabels(db : Database, task : ITask) {
        
        const SQL = "DELETE FROM task_label WHERE taskId = ?";
        const response = await db.db.run(SQL,task.id)

        if(!response)
            return SUCCESS_FALSE;

        if(response.length >= 0)
            return SUCCESS_FALSE;

        if(response.changes == 0)
            return SUCCESS_FALSE;

        return SUCCESS_TRUE;
    }


    /**
     * Get the week tasks for a given user
     * @param db The database connection
     * @param id The task id to search for
     * @returns The query result
     */
     public static getUserTaskLabels(db: Database, id: string): Promise<any> {
        const SQL = "SELECT label FROM task_label WHERE taskId = ? ORDER BY label";
        const response = db.db.all(SQL,id);
        return response;
    }

    /**
     * Get the task matching the given name text 
     * @param db  The database connection
     * @param username The user to search for
     * @param searcher The text to search for
     * @returns The query result
     */
     public static async searchCategoriesByName(db: Database, username: string, searcher : string): Promise<any> {
        const SQL = "SELECT DISTINCT(label) FROM task_label WHERE taskId IN (SELECT id FROM task WHERE author = ?)";
        let response = await db.db.all(SQL, username);
    
        response = response.filter( (label : {[key : string] : string}) => StringUtils.containsMatching(label.label || "", searcher));       
        return new Promise(success => success(response));
    }

    /**
     * Get the task categories from a user 
     * @param db The database connection
     * @param username The username  to search for
     * @returns The query result
     */
    public static getUserTaskCategories(db: Database, username: string): Promise<any> {
        const SQL = "SELECT DISTINCT(label) FROM task_label WHERE taskId IN (SELECT id FROM task WHERE author = ?)";
        const response = db.db.all(SQL, username);
        return response;
    }


    /**
     * Set a tag to a task
     * @param db The database connection
     * @param task The task 
     * @param tag The tag to be set 
     */
    public static async setLabelToTask(db : Database, task: string, tag: string){
        const SQL = "INSERT INTO task_label(taskId, label) VALUES (?,?)";
        await db.db.run(SQL,task,tag)
    } 

}