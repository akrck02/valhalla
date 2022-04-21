import { Configurations } from "../config/config.js";
import { INote } from "../core/data/interfaces/note.js";
import { HTTPS_METHOD } from "../lib/gtd-ts/core/http.js";
import { efetch, Response } from "../lib/gtd-ts/data/easyfetch.js";

export class NoteService {

    static getUserNotes(username : string) : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.GET_USER_NOTES,
            parameters: {
                user: username,
            },
        });

        return response;
    }


    static insertUserNote(note : INote){
        note.author = note.author || Configurations.getUserName(); 

        console.log(note);
        
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: Configurations.API.INSERT_USER_NOTE,
            parameters: {
                note: note
            },
        });

        return response;
    }
}