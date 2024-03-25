import { TextBundle } from "../lang/text.js";
import MaterialIcons from "../lib/gtdf/resources/MaterialIcons.js";
import { IObserver, Observable } from "../lib/gtdf/core/observable/observer.js";
import { Signal } from "../lib/gtdf/core/signals/signal.js";
import { Config, Configuration } from "../config/config.js";
import { ISingleton, Singleton } from "../lib/gtdf/decorators/Singleton.js";
import { StaticImplements } from "../lib/gtdf/core/static/static.interface.js";


@Singleton()
@StaticImplements<ISingleton<Initializer>>()
export default class Initializer {

    private static readonly SIGNAL_ID : string = "init";
    private performed : boolean = false;
    static _instance : Initializer;
    static instance;
    
    private initSignal : Signal;

    private subscribers : IObserver[] = [
        Configuration.instance,
        MaterialIcons.instance.loader,
        TextBundle.instance
    ];


    private constructor() {
        this.initSignal = new Signal(Initializer.SIGNAL_ID);
    }

    /**
     * Subscribe to the init signal
     * @returns The observable instance 
     */
    public async subscribeInitializables() : Promise<void> {
        
        if(this.performed){
            return;
        }

        for(let subscriber of this.subscribers){
            await this.initSignal.subscribe(subscriber);
        }

    }

    public async notify() : Promise<void> {

        if(this.performed){
            return;
        }
    
        this.performed = true;          
        await this.initSignal.emit();
    }


}


