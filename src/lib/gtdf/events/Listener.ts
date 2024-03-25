
/**
 * Abstract class representing those classes 
 * that listen to events to handle them in a 
 * specific way.
 * 
 * The ping() method has testing purposes and 
 * can be deleted. 
 */
export abstract class Listener {
    public ping() {
        alert({
            title: "Connected",
            icon: "notifications",
            message: "Pong!",
            desktop: true,
        })
    };
}