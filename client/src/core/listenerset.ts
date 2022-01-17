import { AppearenceListener } from "./listeners/appearence.js";
import { ExpertListener } from "./listeners/expert.js";

export class ListenerSet {


    private appearenceListener: AppearenceListener;
    private expertListener: ExpertListener;

    public constructor(){
        this.appearenceListener = new AppearenceListener();
        this.expertListener = new ExpertListener();
    }

    getAppearenceListener() : AppearenceListener {
        return this.appearenceListener;
    }

    getExpertListener() : ExpertListener {
        return this.expertListener;
    }

}