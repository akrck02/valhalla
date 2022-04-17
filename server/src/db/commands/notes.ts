import { Request, Response } from "express";
import { INote } from "../classes/note";
import { Database } from "../db";
import NotesModel from "../model/notes";
import HTTPResponse from "./httpResponse";

export class NotesResponse implements HTTPResponse {
    
    /**
     * Insert a user note when a HTTP request is send
     * @param db The databahe HTTP response
     * @returns If the request succeded
     */
    public static async insertUserNote(db: Database, req: Request, res: Response): Promise<any> {
        try {
            const note: INote = req?.body?.note;

            if (!note || !note.author) {
                return new Promise((resolve) =>
                    resolve({ status: "failed", reason: "Missing parameters"})
                );
            }

            if (await NotesModel.insertUserNote(db, note)) {
                return new Promise((resolve) =>
                    resolve({status: "success", reason: "User note successfully inserted"})
                );
            }

        } catch (error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({ status: "failed", reason: "Note wasn't inserted"})
            );
        }
    }

    /**
     * Get user notes when a HTTP request is send 
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns The user notes
     */
    public static async getUserNotes(db: Database, req: Request, res: Response): Promise<any> {
        try {
            const user = req?.body?.user

            if(!user) {
                return new Promise((resolve) =>
                    resolve({ status: "failed", reason: "Missing parameters"})
                );
            }

            return NotesModel.getuserNotes(db, user);

        } catch(error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({ status: "failed", reason: "Internal server error"})
            );
        }

    }

    

    public static async deleteUserNote(db: Database, req: Request, res: Response): Promise<any> {

    };

    
    
    public static async updateUserNote(db: Database, req: Request, res: Response): Promise<any> {

    };

    
    /**
     * Assign a note to task when a HTTP request is send 
     * @param db The database connection
     * @param req The HTTP request
     * @param res The HTTP response
     * @returns if the note was assigned to the task
     */
    public static async assignNoteToTask(db: Database, req: Request, res: Response): Promise<any> {
        try {
            const task = req?.body?.task
            const note = req?.body?.note

            if(!task || !note) {
                return new Promise((resolve) =>
                    resolve({ status: "failed", reason: "Missing parameters"})
                );
            }

            return NotesModel.assignNoteToTask(db, note, task);

        } catch(error) {
            console.error(error);
            return new Promise((resolve) =>
                resolve({ status: "failed", reason: "Internal server error"})
            );
        }

    
    
    }

}