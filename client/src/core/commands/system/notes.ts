import { NoteService } from "../../../services/notes.js";
import { ListenerSet } from "../../listenerset.js";
import Command from "../command.js";

export const NoteNewCommand : Command = {
    match(predicate : string) : boolean {
        return predicate.match(/^note -n (.*) -c (.*)/) ? true : false;
    },

    execute(predicate : string, listeners : ListenerSet) : void {    
        
        const title = predicate.match(/^note -n (.*) -c (.*)/)[1];
        const message = predicate.match(/^note -n (.*) -c (.*)/)[2];

        const res = NoteService.insertUserNote({
            title: title,
            content: message
        });

        res.json();

        

        alert({
            icon : "terminal",
            title: title,
            message : message
        });
    }
    
}