import { ListenerSet } from "../listenerset.js";
import { HiddenTerminal } from "./hidden/easteregg.js";
import { TaskNewCommand } from "./system/tasks.js";
import { WallpaperNextCommand, WallpaperPreviousCommand } from "./ui/wallpapers.js"

export default interface Command {

    match(predicate : string) : boolean
    execute(predicate : string, listeners: ListenerSet) : void
    
}

export class CommandHandler {

    private commands : Command[];
    private listeners : ListenerSet;

    public constructor(listeners : ListenerSet) {
        this.listeners = listeners;
        this.commands = [];
        this.commands.push(WallpaperNextCommand);
        this.commands.push(WallpaperPreviousCommand);
        this.commands.push(HiddenTerminal);
        this.commands.push(TaskNewCommand);
    }

    public handle(predicate : string) {
        this.commands.forEach( cm => {

            if(cm.match(predicate)){
                cm.execute(predicate, this.listeners);
                return;
            }
        })
    }


}


