import { APP, App } from "../../app.js";
import DateInput from "../../components/input/date/dateinput.js";
import MinimalInput from "../../components/input/minimalinput.js";
import minimalInput from "../../components/input/minimalinput.js";
import { Configurations } from "../../config/config.js";
import { DateText } from "../../core/data/integrity/dateText.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setClasses, setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../services/tasks.js";
import LabelContainer from "./components/labels.js";
import NewTaskCore from "./newTaskView.core.js";

export default class NewTaskView extends UIComponent {

    private core : NewTaskCore;
    private labelContainer : LabelContainer;

    public constructor() {
        super({
            type: "view",
            id: "new-task",
            styles: {
                width: "100%",
                height: "100%",
                minWidth: "58rem",
            }
        });

        this.core = new NewTaskCore(this);
    }

    /**
     * Show the task view 
     * @param params The parameters to show the view
     * @param container The container to append the view
     * @param configurations The configurations to use
     */
    public async show(params: string[], container: UIComponent): Promise<void> {

        if(params[0] === "edit") {
            this.core.setEditMode(true);
            const response = taskService.getUserTask(params[1]);
            response.success(((res) => {
                this.core.setTask(res)
            }));
            await response.jsonPromise();

        }

        this.core.setTaskAuthor(this.core.getTask().author || Configurations.getUserName());
       
        this.build();
        this.appendTo(container);
        
    }

    /**
     * Build the view HTML
     */
    public async build() {
        this.clean();

        const container = new UIComponent({
            id : "new-task-container",
            classes: ["box-column"]
        })

        const nameRow = new UIComponent({
            type: "div",
            classes: ["box-row","box-y-center","task-name-row"],
        });

        const taskIcon = getMaterialIcon("task",{ size: "1.8rem", fill: "#fff"});
        const name = new MinimalInput(this.core.getTask().name,this.core.getDefaultPlaceholders().name);
        name.element.id = "task-name";
        name.onType((text) => this.core.setTaskName(text))

        nameRow.appendChild(taskIcon);
        nameRow.appendChild(name);

        this.labelContainer = this.buildLabelContainer();
 
        const description = new MinimalInput(this.core.getTask().description,this.core.getDefaultPlaceholders().description, true);
        description.element.id = "task-description";
        description.onType((text) => this.core.setTaskDescription(text))


        const dateRow = new UIComponent({
            type: "div",
            classes: ["box-row"],
        });

        const startDateRow = this.buildStartDateControls();
        const endDateRow = this.buildEndDateControls();
        dateRow.appendChild(startDateRow);
        dateRow.appendChild(endDateRow);

        const buttonBar = new UIComponent({
            type: "div",
            classes: ["box-row","box-y-center","box-x-between","button-bar"],
        });

        const saveButton = new UIComponent({
            type: "button",
            text: this.core.isEditMode() ?  
                App.getBundle().newTask.UPDATE + "&nbsp;" + getMaterialIcon("sync",{size: "1.2rem", fill: "#fff"}).toHTML() : 
                App.getBundle().newTask.SAVE + "&nbsp;" + getMaterialIcon("check",{size: "1.2rem", fill: "#fff"}).toHTML() ,
            id: "save-task",
            classes: ["icon-button"],
            events: { click: () => {

                if(this.core.getTask().name.trim().length == 0){
                    alert({
                        message : App.getBundle().newTask.INSERT_A_TASK_NAME,
                        icon: "block"
                    });
                    return;
                }

                if(this.core.getTask().labels.length == 0){
                    alert({
                        message : App.getBundle().newTask.SELECT_A_CATEGORY,
                        icon: "block"
                    });
                    return;
                }


                if(this.core.isEditMode()) {
                    taskService.updateUserTask(this.core.getTask());
                } else {
                    taskService.insertUserTask(this.core.getTask());
                }
                
                this.clean();
                const loadingTitle = new UIComponent({
                    type: "h1",
                    classes: ["box-center"],
                    text:   
                    (this.core.isEditMode() ? App.getBundle().newTask.UPDATING_TASK : App.getBundle().newTask.SAVING_TASK ) 
                    + " &nbsp;" + getMaterialIcon("sync",{size: "1.5rem", fill: "#fff"}).toHTML(),
                });
                
                this.element.classList.add("box-center");
                this.element.classList.add("loading");
                this.appendChild(loadingTitle);

                setTimeout(() => {
                    APP.router.modal.hide();
                    alert({
                        message: this.core.isEditMode() ? App.getBundle().newTask.TASK_UPDATED_SUCCESSFULLY : App.getBundle().newTask.TASK_SAVED_SUCCESSFULLY,
                        icon: 'save'
                    })

                    App.redirect(Configurations.VIEWS.TASKS,[],true);
                }, 250 + Math.random() * 200);
            }}
        });

        const cancelButton = new UIComponent({
            type: "button",
            text: "Cancel",
            id: "cancel-task",
            classes: ["icon-button"],
            styles: {
                background: "transparent",
            },
        });

        cancelButton.element.addEventListener("click", () => {
            APP.router.modal.hide();
        });

        const recentLabelContainer = await this.buildRecentLabelContainer(); 

        buttonBar.appendChild(cancelButton);
        buttonBar.appendChild(saveButton);

        container.appendChild(nameRow);
        container.appendChild(this.labelContainer);
        container.appendChild(description);
        container.appendChild(dateRow);
        container.appendChild(buttonBar);


        this.appendChild(container);
        this.appendChild(recentLabelContainer);

        setTimeout(() => {
            setStyles(container.element, { opacity: "1",})
            setStyles(recentLabelContainer.element, { opacity: "1",})   
        }, 100);
    }

    /**
     * Create the tag container
     * @returns The tag container UI component
     */
    private buildLabelContainer() : LabelContainer {
        const labels = new LabelContainer(this.core);
        this.core.getTask().labels.forEach(tag => {
            labels.addLabel(tag, () => {
                labels.removeLabel(tag);
                this.core.removeTag(tag);
            });
        });

        labels.onchange((lbls) => {
            APP.router.variablePanel.addViewVariables({
                 LABELS : lbls
            });
        });

        return labels;
    }

    /**
     * Create the start date control components
     * @returns The start date UI component
     */
    private buildStartDateControls() : UIComponent {

        const view = this;
        const startDateRow = new UIComponent({
            classes: ["box-row","box-y-center", "date-row"],
        });

        const startDateLabel = new UIComponent({
            type: "label",
            attributes: { for : "task-start-date" },
            text :  App.getBundle().newTask.START_DATE + ": "
        });
        startDateRow.appendChild(startDateLabel);

        const startDateInput = new DateInput({
            id: "task-start-date",
            callback: (date: Date) => {
                view.core.getTask().start = DateText.toSQLiteDate(date);
                view.clean();
                view.build();
            },
            parent: view,
            default: this.core.toDate(this.core.getTask().start)
        });
        startDateRow.appendChild(startDateInput);

        return startDateRow;
    }

    /**
     * Create the end date control components
     * @returns The end date UI component
     */
    private buildEndDateControls() : UIComponent {

        const view = this;
        const endDateRow = new UIComponent({
            classes: ["box-row","box-y-center", "date-row"],
        });

        const endDateLabel = new UIComponent({
            type: "label",
            attributes: { for : "task-end-date" },
            text :   App.getBundle().newTask.END_DATE + ": "
        });
        endDateRow.appendChild(endDateLabel);

        const endDateInput = new DateInput({
            id: "task-end-date",
            callback: (date: Date) => {
                view.core.setTaskEnd(DateText.toSQLiteDate(date));
                view.clean();
                view.build();
            },
            parent: view,
            default: this.core.toDate(this.core.getTask().end)
        });
        endDateRow.appendChild(endDateInput);

        const allDay = new UIComponent({
            type : 'input',
            attributes: {
                type : "checkbox"
            },
        });

        (allDay.element as HTMLInputElement).checked = this.core.getTask().allDay === 1;
        allDay.element.onclick = () => {
            this.core.setTaskAllDay((allDay.element as HTMLInputElement).checked ? 1 : 0);
        }

        const allDayLabel = new UIComponent({
            type: "label" ,
            text :  App.getBundle().newTask.SAME_DAY,
            styles :  {
                marginLeft: "1rem"
            }
        });

        allDay.appendTo(allDayLabel);
        endDateRow.appendChild(allDayLabel)


        return endDateRow;
    }

    /**
     * Build the recent label container
     * @returns The promise of the UIComponent
     */
    private async buildRecentLabelContainer() : Promise<UIComponent> {

        const container = new UIComponent({
            classes: ["box-column","box-warp","box-x-start","box-y-start"],
            id: "recent-label-container",
            styles: {
                marginLeft : "1rem",
                overflowY: "auto",
               
            }
        });

        const title = new UIComponent({
            type : "h1",
            text :  App.getBundle().newTask.RECENT_CATEGORIES + ":",
            id: "title",
        });
        title.appendTo(container);


        const labelContainerBox = new UIComponent({
            id: "recent-label-container-box",
            styles: {
                overflowY: "hidden",
                overflowX: "hidden",
                maxHeight: "9rem",
                width: "100%",
            }
        });

        const labels = await (await this.core.getRecentLabels()).filter(lbl => !this.labelContainer.containsLabel(lbl.label));
        labels.forEach(label => {

            const labelComp = new UIComponent({
                text: label.label,
                classes: ["label"],
            });

            labelComp.element.addEventListener("click", () => {
                this.core.addTag(labelComp.element.innerText);

                this.labelContainer.addLabel(labelComp.element.innerText, () => {
                    this.labelContainer.removeLabel(labelComp.element.innerText);
                    this.core.removeTag(labelComp.element.innerText);
                });

                labelContainerBox.removeChild(labelComp);
            });

            labelComp.appendTo(labelContainerBox);
        });
        
        container.appendChild(labelContainerBox);

        return new Promise(suc => suc(container));
    }



}