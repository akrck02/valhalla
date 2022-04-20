import { Configurations } from "../../config/config.js";
import { NoteService } from "../../services/notes.js";

 
export default class NotesCore {

    public async getUserNotes() : Promise<any> {

        let notes = {}; 
        const response  = NoteService.getUserNotes(Configurations.getUserName());
        response.success((json) =>{
            notes = json;
        });
        
        await response.jsonPromise();

        return notes;
    }



}