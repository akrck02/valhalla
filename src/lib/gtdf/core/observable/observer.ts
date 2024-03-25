export interface IObserver {
    update(data?:any): Promise<void>;
} 

export interface IObservable {
    content: any;
    subscribe(observer: IObserver);
    unsubscribe(observer: IObserver);
    notify(): Promise<void>;
}

export class Observable implements IObservable {

    private observers: IObserver[] = [];
    public content;

    constructor() {

        let a = this;
        this.content = {};
        this.content = new Proxy(this.content, {
            set: function(target, key, value) {                
                target[key] = value;
                a.notify();
                return true;
            }
        });

    }

    /**
     * Subscribe an observer to the observable
     * @param observer The observer to subscribe
     */
    public subscribe(observer: IObserver) {       
        this.observers.push(observer);
    }

    /**
     * Unsubscribe an observer from the observable
     * @param observer The observer to unsubscribe
     */
    public unsubscribe(observer: IObserver) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    public async notify() {
        
        for(let observer of this.observers){
            try {   
                await observer.update()
            }catch(e){
                console.error("Error notifying observer", e);
            }
        }

    }

    

}