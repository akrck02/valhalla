import { Command } from "../../lib/gtdf/commands/command";
import { IEvents } from "../events/events";

/**
 * Class to handle the commands of the application
 */
export default class CommandHandler {

    private commands : Command[];
    private listeners : IEvents;

    public constructor(listeners : IEvents) {
        this.listeners = listeners;
        this.commands = [

        ];
    }

    /**
     * Handle a command string and execute the first matching command 
     * @param predicate The predicate to handle
     */
    public async handle(predicate : string) {

        for(let i = 0; i < this.commands.length; i++){
            if(this.commands[i].match(predicate)){
                await this.commands[i].execute(predicate, this.listeners);
                return;
            }
        }
    }

}