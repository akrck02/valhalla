import { TaskStatus } from "../enums/task.status.js";

export interface ITask {
    id?: number;
    author?: string;
    name?: string;
    description?: string;
    start?: string;
    end?: string;
    allDay?: number;
    status?: TaskStatus;
    done?: number;
    labels?: string[];
}

export class Task implements ITask {
    id?: number;
    author?: string;
    name?: string;
    description?: string;
    start?: string;
    end?: string;
    allDay?: number;
    status?: TaskStatus;
    done?: number;
    labels?: string[];

    constructor(task: ITask) {
        this.id          = task.id;
        this.author      = task.author;
        this.name        = task.name;
        this.description = task.description;
        this.start       = task.start;
        this.end         = task.end;
        this.allDay      = task.allDay;
        this.status      = task.status;
        this.done        = task.done;
        this.labels      = task.labels;
    }
}