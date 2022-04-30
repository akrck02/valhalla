import { ListenerSet } from "../../listenerset.js";
import Command from "../command.js";

export const TaskNewCommand : Command = {
    match(predicate : string) : boolean {
        return predicate.match(/^task -n (.*) -c (.*)/) ? true : false;
    },

    execute(predicate : string, listeners : ListenerSet) : void {    

        listeners.getTaskListener();
    }
    
}