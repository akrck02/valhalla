import ExampleListener from "./listener/example.listener.js";

/**
 * Interface stipulating the listener types
 * of the current application
 */
export interface IEvents {
    example : ExampleListener
}


/**
 * Event listeners for the application
 */
export const Events = {
    example : new ExampleListener() 
} 