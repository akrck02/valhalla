import { APP } from "../../../app.js";
import { ListenerSet } from "../../listenerset.js";
import Command from "../command.js";


export const HiddenTerminal: Command = {
    match(predicate : string) : boolean {
        return predicate.toLocaleLowerCase() == "-you shall not pass!-";
    },

    execute(predicate : string, listeners : ListenerSet) : void {    
       APP.configurations.addConfigVariable("GANDALF",true);
    }
    
}