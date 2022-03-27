import { ITask } from "../../../core/data/interfaces/task.js";
import NewTaskView from "./newTaskView.ui";

export default class NewTaskCore {

    private parent : NewTaskView;
    private task: ITask;

    constructor( parent : NewTaskView) {
        this.parent = parent;
        this.task = this.defaultTask();
    }

    /**
     * Build a task object with default values
     * @returns The default task object
     */
    private defaultTask(): ITask {

        const task = {
            name: "Write here a task name ✍️",
            description: "Insert here your task description :)",
            allDay: 0,
            start: "2022/03/21",
            end: "2022/03/21",
            author: "",
            labels: ["Today", "Important"],
        };

        return task;
    }

    /**
     * Get the task object
     * @returns The task object
     */
    public getTask(): ITask {
        return this.task;
    }

    /**
     * Set the task author
     * @param author The task author
     */
    public setTaskAuthor(author: string) {
        this.task.author = author;
    }

    /**
     * Set the task name
     * @param name The task name
     */
    public setTaskName(name: string) {
        this.task.name = name;
    }

    /**
     * Set the task description
     * @param description The task description
     */
    public setTaskDescription(description: string) {
        this.task.description = description;
    }

    /**
     * Set if the task is all day or not
     * @param allDay The task all day status
     */
    public setTaskAllDay(allDay: number) {
        this.task.allDay = allDay;
    }

    /**
     * Set the task start date 
     * @param start The task start date in string format
     */
    public setTaskStart(start: string) {
        this.task.start = start;
    }

    /**
     * Set the task end date 
     * @param end The task end date in string format
     */
    public setTaskEnd(end: string) {
        this.task.end = end;
    }

    /**
     * Set the labels of the task object
     * @param labels The labels of the task object
     */
    public setTaskLabels(labels: string[]) {
        this.task.labels = labels;
    }

    /**
     * Add a tag to the task
     * @param tag The tag to add to the task
     */
    public addTag(tag: string) {
        if (this.task.labels.indexOf(tag) === -1) {
            this.task.labels.push(tag);
        }
    }

    /**
     * Remove the tag from the task
     * @param tag The tag to remove from the task
     */
    public removeTag(tag: string) {
        this.task.labels.splice(this.task.labels.indexOf(tag),1);
    }

    /**
     * Set the task labels
     * @param labels The labels of the task object
     * @returns The task object
     */
    public toDate(string : string) : Date {
        const date = new Date();
        const parts = string.split("/");
        console.log(parts);
        

        date.setDate( +(parts[2]));
        date.setMonth( +(parts[1]) - 1);
        date.setFullYear( +(parts[0]));

        return date;
    } 

}