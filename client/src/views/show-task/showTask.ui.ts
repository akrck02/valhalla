import { APP, App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { DateText } from "../../core/data/integrity/dateText.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setClasses, setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import Label from "../new-tasks/components/label.js";
import NewTaskView from "../new-tasks/newTaskView.ui.js";
import ShowTaskCore from "./showTask.core.js";

export default class ShowTaskView extends UIComponent {

    private core : ShowTaskCore;
    private box : UIComponent;

    constructor() {
        super({
            type: "view",
            id: "task",
            classes: ["box-column"],
            styles : {
                minWidth : "100%",
                minHeight : "100%",
                position: "relative",
            }
        });

        this.core = new ShowTaskCore();
    }


    public async show(params : string[], container : UIComponent): Promise<void> {

        if(!params[0]){
            App.redirect(Configurations.VIEWS.TASKS,[]);
            return;
        }

       
        this.box = new UIComponent({
            type: "div",
            classes: ["box-column"],
            styles : {
                width : "100%",
                height : "100%",
                opacity : "0",
                transition: "opacity var(--slow)"
            }
        });


        const task = await this.core.getTask(parseInt(params[0]));

        this.drawTitle(task.name, task.done == 1, task.id);
        this.drawDescription(task.description);
        this.drawLabels(task.labels);
        this.drawAssignedTo(task.author);
        this.drawEventDate(task.start, task.end);

        this.appendChild(this.box);
        this.appendTo(container);

        setTimeout(() => {
            setStyles(this.box.element, {
                opacity : "1",
            });;   
        }, 100);
    }


    /**
     * Draw the title of the task
     * @param title 
     */
    public drawTitle(title : string, done: boolean = false, id: number = 0) {

        const titleBox = new UIComponent({
            type: "div",
            id: "task-title",
            classes: ["box-row", "box-y-center"],
            styles: {
                width: "100%",
                marginTop: "4rem",
                paddingLeft: "4rem",
            }
        });

        const titleIcon = getMaterialIcon(done? "task_alt" : "radio_button_unchecked",{
            size: "1.5rem",
            fill: done? "#fff" : "#404040",
        });

        setClasses(titleIcon.element, ["timeline-icon"]);
        setStyles(titleIcon.element, {
            padding: "0.35rem",
            backgroundColor: done? "#4caf50" : "#f1f1f1",
            marginRight: "1rem",
        });


        const titleElement = new UIComponent({
            type: "h1",
            text : title,
            styles : {
                maxWidth: "40rem"
            }
        });

        const editIcon = getMaterialIcon("edit",{
            size: "1.5rem",
            fill: "#ffffffd0",
        });

        setStyles(editIcon.element, {
            position : "absolute",
            top : "0.5rem",
            right : "5rem",
            cursor : "pointer",
        });

        editIcon.element.onclick = () => {
            const taskView = new NewTaskView();

            APP.router.modal.clean();
            taskView.show(["edit",id + ""],APP.router.modal);
            
            APP.router.modal.show();
        }

        titleIcon.appendTo(titleBox);
        titleElement.appendTo(titleBox);
        editIcon.appendTo(titleBox);
        this.box.appendChild(titleBox);
    }

    /**
     * Draw the labels of the task
     * @param labels the labels of the task
     */
    public drawLabels(labels : string[]) {

        const labelBox = new UIComponent({
            type: "div",
            id: "task-labels",
            classes: ["box-row", "box-y-center"],
            styles: {
                width: "100%",
                marginTop: "2rem",
                paddingLeft: "4rem",
            }
        });

        const labelIcon = getMaterialIcon("tag",{
            size: "1.25rem",
            fill: "#404040",
        });

        setClasses(labelIcon.element, ["timeline-icon"]);
    
        setStyles(labelIcon.element, {
            padding: "0.35rem",
            backgroundColor: "#fff",
            marginRight: "1rem",
            marginLeft: ".15rem",
        });

        const labelContainer = new UIComponent({
            type: "div",
            classes: ["box-row", "box-y-center"],
        });

        for(const label of labels){
            const labelElement = new Label( label );
            labelElement.element.onclick = () => {
                App.redirect(Configurations.VIEWS.TASKS,[label]);
            }

            labelElement.element.style.cursor = "pointer";
            labelElement.appendTo(labelContainer);
        }

        labelIcon.appendTo(labelBox);
        labelContainer.appendTo(labelBox);
        this.box.appendChild(labelBox);
    }


    /**
     * Draw the description of the task
     * @param description 
     */
    public drawDescription(description : string) {

        if(!description) return;

        const descriptionBox = new UIComponent({
            type: "div",
            id: "task-description",
            styles : {
                marginTop : "1rem",
                paddingLeft : "7.4rem",
                maxWidth: "40rem"
            }
        });

        const descriptionElement = new UIComponent({
            type: "p",
            text : description,
            styles : {
                opacity : "0.7",
            }
        });

        descriptionElement.appendTo(descriptionBox);
        this.box.appendChild(descriptionBox);
    }


    /**
     * Draw the assigned to of the task
     * @param assignedTo The name of the user
     */
    public drawAssignedTo(assignedTo : string = "none") {
        const assignedBox = new UIComponent({
            type: "div",
            id: "task-assigned",
            classes: ["box-row", "box-y-center"],
            styles: {
                width: "100%",
                marginTop: "2rem",
                paddingLeft: "4rem",
            }
        });

        const assignedIcon = getMaterialIcon("person_add",{
            size: "1.25rem",
            fill:  "#202020" ,
        });

        setClasses(assignedIcon.element, ["timeline-icon"]);
        setStyles(assignedIcon.element, {
            padding: "0.35rem",
            backgroundColor: "#ffffff",
            marginRight: "1rem",
            marginLeft: ".15rem",
        });

        const assignedElement = new UIComponent({
            type: "h1",
            text : App.getBundle().tasks.TASK_ASSIGNED_TO.replace("$1",(assignedTo == Configurations.getUserName() ? App.getBundle().tasks.YOU : assignedTo)),
            styles : {
                fontSize: "1rem",
            }
        });

        assignedIcon.appendTo(assignedBox);
        assignedElement.appendTo(assignedBox);
        this.box.appendChild(assignedBox);

    }  
    
    
    /**
     * Draw the event dates of the task
     * @param start The start date
     * @param end The end date
     */
    public drawEventDate(start : string , end : string) {
        const eventBox = new UIComponent({
            type: "div",
            id: "task-assigned",
            classes: ["box-row", "box-y-center"],
            styles: {
                width: "100%",
                marginTop: "2rem",
                paddingLeft: "4rem",
            }
        });

        const eventIcon = getMaterialIcon("event",{
            size: "1.25rem",
            fill:  "#202020" ,
        });

        setClasses(eventIcon.element, ["timeline-icon"]);
        setStyles(eventIcon.element, {
            padding: "0.35rem",
            backgroundColor: "#ffffff",
            marginRight: "1rem",
            marginLeft: ".15rem",
        });


        let dateText = "";

        if(start == end){
            dateText =  this.core.getTimeText(new Date(start));
        }

        else {
            dateText = this.core.getTimeText(new Date(start)) + " - " + this.core.getTimeText(new Date(end));
        }

        const eventElement = new UIComponent({
            type: "h1",
            text : dateText,
            styles : {
                fontSize: "1rem",
            }
        });

        eventIcon.appendTo(eventBox);
        eventElement.appendTo(eventBox);
        this.box.appendChild(eventBox);

    }  




}