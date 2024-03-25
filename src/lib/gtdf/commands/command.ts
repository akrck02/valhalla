import { IEvents } from "../../../core/events/events.js"

/**
 * Interface representing a command 
 * that has a method watch if a predicate matches
 * and other method to execute the command itself 
 */
export interface Command {
    match(predicate : string) : boolean
    execute(predicate : string, listeners: IEvents) : Promise<void>
}