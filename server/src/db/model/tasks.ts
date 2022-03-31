import Model from "./model.js";
import { Database } from "../db";
import { ITask } from "../classes/task.js";


export default class Tasks implements Model {

    /**
     * Get the task matching the given name text 
     * @param db  The database connection
     * @param username The user to search for
     * @param searcher The text to search for
     * @returns The query result
     */
    public static searchTasksByName(db: Database, username: string, searcher : string): Promise<any> {
        searcher = "%" + searcher + "%";
        const SQL = "SELECT * FROM task WHERE author = ? AND name LIKE ?";
        const response  = db.db.all(SQL, username, searcher );
        return response;
    }


    /**
     * 
     * @param db The databas3e connection
     * @param username The user who owns the tasks
     * @returns The query result
     */
    public static getUserTasks(db: Database, username: string): Promise<any> {
        const SQL = "SELECT * FROM task WHERE author = ? ORDER BY end DESC";
        const response = db.db.all(SQL,username);
        return response;
    }

    /**
     * 
     * @param db The databas3e connection
     * @param username The user who owns the tasks
     * @returns The query result
     */
     public static getUserTask(db: Database, id: string): Promise<any> {
        const SQL = "SELECT * FROM task WHERE id = ?";
        const response = db.db.all(SQL,id);
        return response;
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
     * Gegt the user tasks from a given category
     * @param db The database connection
     * @param username The user to search for
     * @param category The category to search for
     * @returns The query result
     */
    public static getUserTasksFromCategory(db: Database, username : string, category : string): Promise<any> {
        const SQL = "SELECT * FROM task WHERE author = ? AND id IN (SELECT taskId FROM task_label WHERE label = ?) ORDER BY end DESC";
        const response = db.db.all(SQL, username, category);
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

        task.labels?.forEach(tag => this.setLabelToTask(db, response.lastID, tag));
        
        return true;
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


    /**
     * Delete a task from a given user
     * @param db The database connection
     * @param task The task to be deleted
     * @returns The query result
     */
    public static async deleteUserTask(db : Database, task : ITask) {
        const SQL = "DELETE FROM task WHERE id = ?";
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
     * Get the month tasks for a given user
     * @param db The database connection
     * @param author The user to search for
     * @param year The year to search for
     * @param month The month to search for
     * @returns The query result
     */
    public static async getUserMonthTasks(db : Database, author : string, year : string, month : string) {

        const SQL = "SELECT * FROM task WHERE author=? AND end BETWEEN ? AND ?"
        const response = db.db.all(
            SQL,
            author,
            year + "-" + month + "-00 00:00",
            year + "-" + month + "-32 23:59"
        );

        return response;
    }

    /**
     * Get the week tasks for a given user
     * @param db The database connection
     * @param task The task to update
     * @returns The query result
     */
    public static async updateUserTask(db : Database, task : ITask) {

        const SQL = "UPDATE task SET name=?, description=?, start=?, end=?, allDay=?, done=? WHERE id=?";
        const response = await db.db.run(SQL,
            task.name,
            task.description,
            task.start,
            task.end,
            task.allDay,
            task.done,
            task.id
        )

        if(!response)
            return false;

        if(response.length >= 0)
            return false;

        if(response.changes == 0)
            return false;

        return true;
    }


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



}
