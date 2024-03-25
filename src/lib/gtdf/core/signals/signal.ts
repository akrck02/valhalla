import { IObservable, IObserver } from "../observable/observer.js";

export default interface ISignal extends IObservable {
    id : string;
    subscribers : IObserver[];
    emit : (data?:any) => Promise<void>;
}

export class Signal implements ISignal {
    
    id: string;
    subscribers: IObserver[];

    public constructor(id: string) {

        let a = this;
        this.id = id;
        this.subscribers = [];
        this.content = {};

    }

    content: any;
    
    public subscribe(observer: IObserver) {
      this.subscribers.push(observer);
    }

    public unsubscribe(observer: IObserver) {
        this.subscribers = this.subscribers.filter((obs) => obs !== observer);
    }

    async notify() {
        for(let observer of this.subscribers){
            try {   
                await observer.update(this.content)
            }catch(e){
                console.error(`Error notifying observer on signal ${this.id}`, e);
            }
        }
    }

    public async emit(data?: any) {
      
        this.content = data;
        await this.notify();
    }

}