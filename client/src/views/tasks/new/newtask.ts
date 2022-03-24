import { start } from "repl";
import DateInput from "../../../components/input/date/dateinput.js";
import { DateSelector } from "../../../components/input/date/selector.js";
import { Configurations } from "../../../config/config.js";
import { DateText } from "../../../core/data/dateText.js";
import { ITask } from "../../../core/data/interfaces/task.js";
import { CALENDAR_TODAY, PLUS } from "../../../lib/gtd-ts/material/materialicons.js";
import { setStyles, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export default class NewTask extends UIComponent {

    private task: ITask;
    private dateSelector: DateSelector;

    public constructor() {
        super({
            type: "view",
            id: "new-task",
        });

        this.task = this.defaultTask();


        this.dateSelector = new DateSelector((date: Date) => {
            console.log("TASK VIEW SEE: ", date);
            this.dateSelector.hide();
        });
    }

    public show(params: string[], container: UIComponent, configurations: Configurations): void {
        this.build();
        this.appendTo(container);
    }


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


    public build() {
        const view = this;
        this.clean();

        const name = new UIComponent({
            type: "h1",
            text: this.task.name,
            id: "task-name",
            attributes: { contenteditable: "true" },
            events: { keyup: () => view.task.name = name.element.innerText }
        });

        const tagContainer = this.buildTagContainer();

        const description = new UIComponent({
            type: "p",
            text: this.task.description,
            id: "task-description",
            attributes: { contenteditable: "true" },
            events: { keyup: () => view.task.description = description.element.innerText }
        });

        const startDateRow = this.buildStartDateRow();
        const endDateRow = this.buildEndDateRow();

        this.appendChild(name);
        this.appendChild(tagContainer);
        this.appendChild(description);
        this.appendChild(startDateRow);
        this.appendChild(endDateRow);
        

        setTimeout(() => {
            setStyles(this.element, {
                opacity: "1",
            });
        }, 100);

    }


    private buildTagContainer() : UIComponent {
        const tagContainer = new UIComponent({
            classes: ["box-row","box-warp"],
            id: "tag-container"
        });

        this.task.labels.forEach(tag => {
            
            const tagDiv  = new UIComponent({
                type: "button",
                text: tag,
                classes: ["task-label"]
            });

            tagDiv.appendTo(tagContainer);

        });


        const newTagButton = new UIComponent({
            type : "button",
            id: "new-tag",
            text : PLUS({
                fill: "#fff",
                size: "1rem"
            })
        });

        newTagButton.appendTo(tagContainer);

        return tagContainer;
    }


    private buildStartDateRow() : UIComponent {

        // CALENDAR_TODAY({size:"1.5rem", fill: "white"})
        const view = this;
        const startDateRow = new UIComponent({
            classes: ["box-row","box-y-center", "date-row"],
        });

        const startDateLabel = new UIComponent({
            type: "label",
            attributes: { for : "task-start-date" },
            text : "Start date: "
        });
        startDateRow.appendChild(startDateLabel);

        const startDateInput = new DateInput({
            id: "task-start-date",
            callback: (date: Date) => {
                view.task.start = DateText.toDateString(date);
                view.clean();
                view.build();
                console.log(date);
            },
            parent: view,
            default: this.toDate(this.task.start)
        });
        startDateRow.appendChild(startDateInput);


        const allDay = new UIComponent({
            type : 'input',
            attributes: {
                type : "checkbox"
            },
        })

        const allDayLabel = new UIComponent({
            type: "label" ,
            text : "All day",
            styles :  {
                marginLeft: "1rem"
            }
        });

        allDay.appendTo(allDayLabel);
        startDateRow.appendChild(allDayLabel)


        return startDateRow;
    }

    private buildEndDateRow() : UIComponent {

        // CALENDAR_TODAY({size:"1.5rem", fill: "white"})
        const view = this;
        const endDateRow = new UIComponent({
            classes: ["box-row","box-y-center", "date-row"],
        });

        const endDateLabel = new UIComponent({
            type: "label",
            attributes: {
                for : "task-end-date"
            },
            text : "End date: "
        });
        endDateRow.appendChild(endDateLabel);

        const endDateInput = new DateInput({
            id: "task-end-date",
            callback: (date: Date) => {
                view.task.end = DateText.toDateString(date);
                view.clean();
                view.build();
                console.log(date);
            },
            parent: view,
            default: this.toDate(this.task.end)
        });
        endDateRow.appendChild(endDateInput);

        return endDateRow;
    }



    private toDate(string : string) : Date {
        const date = new Date();
        const parts = string.split("/");
        console.log(parts);
        

        date.setDate( +(parts[2]));
        date.setMonth( +(parts[1]) - 1);
        date.setFullYear( +(parts[0]));

        return date;
    } 
}