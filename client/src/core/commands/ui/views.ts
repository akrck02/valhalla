import { APP, App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { ListenerSet } from "../../listenerset.js";
import Command from "../command.js";

export const GoCommand : Command = {
    match(predicate : string) : boolean {
        return predicate.match(/^go (.*)/) ? true : false;
    },

    execute(predicate : string, listeners : ListenerSet) : void {    
        App.redirect(Configurations.VIEWS.BASE_URL +  predicate.match(/^go (.*)/)[1], []);
        APP.router.modal.hide();
    }
    
}
