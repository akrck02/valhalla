import { App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { NoteService } from "../../services/notes.js";

 
export default class NotesCore {

    public async getUserNotes() : Promise<any> {

        let notes = {}; 
        const response  = NoteService.getUserNotes(Configurations.getUserName());
        response.success((data) =>{
            notes = data;
        });
        
        await response.jsonPromise();

        return notes;
    }


    public deleteUserNote(id : number) {
        const response = NoteService.deleteUserNote(id);
        response.success((data) => {

            alert({
                icon : "delete",
                message : JSON.stringify(data)
            });

            setTimeout(() => App.redirect(Configurations.VIEWS.NOTES,[],true), 200);
            
        })

        response.json();
    }


}