
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
            return false;

        if(response.length >= 0)
            return false;

        if(response.changes == 0)
            return false;

        return true;
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