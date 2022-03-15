import Model from "./model.js";
import { Database } from "../db";
import { ITask } from "../classes/task.js";
import { API } from "../api.js";

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
     * Gegt the user tasks from a given category
     * @param db The database connection
     * @param username The user to search for
     * @param category The category to search for
     * @returns The query result
     */
    public static getUserTasksFromCategory(db: Database, username : string, category : string): Promise<any> {
        const SQL = "SELECT * FROM task WHERE author = ? AND id IN (SELECT taskId FROM task_label WHERE label = ?) ORDER BY end ASC";
        const response = db.db.all(
            SQL,
            username,
            category
        );

        return response;
    }

    /**
     * Insert a task for a given user 
     * @param db The databse connection
     * @param task The task to be inserted
     */
    public static async insertUserTask(db : Database, task : ITask) {

        const SQL = "INSERT INTO task(author, name, description, start, end, allDay, done) VALUES (?,?,?,?,?,?,?)";
        const response = await db.db.run(SQL,
            task.author,
            task.name,
            task.description,
            task.start,
            task.end,
            task.allDay,
            task.done
        )

        if(!response) 
            return false;

        if(response.length >= 0)
            return false;

        if(response.changes == 0) 
            return false;

        task.labels?.forEach(tag => this.setTagToTask(db, response.lastID, tag));
        
        return true;
    }

    /**
     * Set a tag to a task
     * @param db The database connection
     * @param task The task 
     * @param tag The tag to be set 
     */
    public static async setTagToTask(db : Database, task: string, tag: string){
        
        const SQL = "INSERT INTO task_label(taskId, label) VALUES (?,?)";
        await db.db.run(SQL,
           task,
           tag
        )
    } 


}
