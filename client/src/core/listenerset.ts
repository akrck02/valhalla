import { AppearenceListener } from "./listeners/appearence.js";
import { ExpertListener } from "./listeners/expert.js";
import TasksListener from "./listeners/task.js";

export class ListenerSet {


    private appearenceListener: AppearenceListener;
    private expertListener: ExpertListener;
    private taskListener: TasksListener;

    public constructor(){
        this.appearenceListener = new AppearenceListener();
        this.expertListener = new ExpertListener();
        this.taskListener = new TasksListener();
    }

    getAppearenceListener() : AppearenceListener {
        return this.appearenceListener;
    }

    getExpertListener() : ExpertListener {
        return this.expertListener;
    }

    getTaskListener() : TasksListener {
        return this.taskListener;
    }

}