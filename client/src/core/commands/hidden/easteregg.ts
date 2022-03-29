import { Configurations } from "../../../config/config.js";
import { ListenerSet } from "../../listenerset.js";
import Command from "../command.js";


export const HiddenTerminal: Command = {
    match(predicate : string) : boolean {
        return predicate.toLocaleLowerCase() == "-you shall not pass!-";
    },

    execute(predicate : string, listeners : ListenerSet) : void {    
       Configurations.addConfigVariable("GANDALF",true);
    }
    
}