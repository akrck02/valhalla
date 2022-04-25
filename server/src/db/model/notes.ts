import Model from "./model.js";
import { Database } from "../db";
import { INote } from "../classes/note.js";
import { SUCCESS_FALSE, SUCCESS_TRUE } from "../../core/types";

export default class Notes implements Model {

    /**
     * Insert a user note
     * @param db The database connection
     * @param note The note to insert
     * @returns If the note was inserted
     */
    public static async insertUserNote(db: Database, note : INote): Promise<any> {

        const SQL = "INSERT INTO note (author, title, content) VALUES(?,?,?)";

        const response = await db.db.run(SQL,
            note.author,
            note.title,
            note.content,
        )

        if(!response) 
            return SUCCESS_FALSE;

        if(response.length >= 0)
            return SUCCESS_FALSE;

        if(response.changes == 0) 
            return SUCCESS_FALSE;

        return SUCCESS_TRUE;

    }

    /**
     * Get the notes of a user
     * @param db The database connection
     * @param username The username to search for
     * @returns The notes of a given user
     */
    public static async getuserNotes(db: Database, username : string ) {
        const SQL = "SELECT * FROM note WHERE author = ?";
        const response = db.db.all(SQL, username);
        return response;
    }

    /**
     * Delete a note
     * @param db The database connection
     * @param noteId The note ID
     * @returns if the note was deleted
     */
    public static async deleteUserNote(db: Database, noteId : string){
        const SQL = "DELETE FROM note WHERE id = ?";

        const response = await db.db.run(SQL,
            noteId,
        )

        if(!response) 
            return SUCCESS_FALSE;

        if(response.length >= 0)
            return SUCCESS_FALSE;

        if(response.changes == 0) 
            return SUCCESS_FALSE;

        return SUCCESS_TRUE;
        
    };

    /**
     * Update a note 
     * @param db The database connection
     * @param note The note to update
     */
    public static async updateUserNote(db : Database, note : INote){
        throw new Error("Method not implemented yet.");
    };

    /**
     * Assign note to a task 
     * @param db The database connection
     * @param noteId The note ID
     * @param taskId The task ID
     * @returns if note was assign to task
     */
    public static async assignNoteToTask(db: Database, noteId : string, taskId : string) {
        const SQL = "INSERT INTO task_note(task, note) VALUES (?,?)";
        
        const response = await db.db.run(SQL,
            taskId,
            noteId,
        )

        if(!response) 
            return SUCCESS_FALSE;

        if(response.length >= 0)
            return SUCCESS_FALSE;

        if(response.changes == 0) 
            return SUCCESS_FALSE;

        return SUCCESS_TRUE;
    }

}