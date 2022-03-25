import DateInput from "../../../components/input/date/dateinput.js";
import { Configurations } from "../../../config/config.js";
import { DateText } from "../../../core/data/dateText.js";
import { CHECK, PLUS, SAVE, SYNC, TASK } from "../../../lib/gtd-ts/material/materialicons.js";
import { setStyles, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../../services/tasks.js";
import NewTaskCore from "./newTaskView.core.js";

export class NewTaskView extends UIComponent {

    private configuration: Configurations;
    private core : NewTaskCore;

    public constructor() {
        super({
            type: "view",
            id: "new-task",
        });

        this.core = new NewTaskCore(this);
    }

    /**
     * Show the task view 
     * @param params The parameters to show the view
     * @param container The container to append the view
     * @param configurations The configurations to use
     */
    public show(params: string[], container: UIComponent, configurations: Configurations): void {
        this.build();
        this.appendTo(container);
        this.core.setTaskAuthor(configurations.getConfigVariable("user") || "default");
        this.configuration = configurations;
    }

    /**
     * Build the view HTML
     */
    public build() {
        this.clean();

        const nameRow = new UIComponent({
            type: "div",
            classes: ["box-row","box-y-center","task-name-row"],
        });

        const taskIcon = new UIComponent({
            text: TASK({ size: "1.8rem", fill: "#fff"})
        });

        const name = new UIComponent({
            type: "h1",
            text: this.core.getTask().name,
            id: "task-name",
            attributes: { contenteditable: "true" },
            events: { keyup: () => this.core.setTaskName(name.element.innerText) }
        });

        nameRow.appendChild(taskIcon);
        nameRow.appendChild(name);

        const tagContainer = this.buildTagContainer();
        const description = new UIComponent({
            type: "p",
            text: this.core.getTask().description,
            id: "task-description",
            attributes: { contenteditable: "true" },
            events: { keyup: () => this.core.setTaskDescription(description.element.innerText) }
        });

        const dateRow = new UIComponent({
            type: "div",
            classes: ["box-row"],
        });

        const startDateRow = this.buildStartDateControls();
        const endDateRow = this.buildEndDateControls();
        dateRow.appendChild(startDateRow);
        dateRow.appendChild(endDateRow);


        const saveButton = new UIComponent({
            type: "button",
            text: CHECK({size: "1.2rem", fill: "#fff"}) + "&nbsp;Save",
            id: "save-task",
            classes: ["button"],
            events: { click: () => {
                taskService.insertUserTask(this.core.getTask());
                this.clean();

                const loadingTitle = new UIComponent({
                    type: "h1",
                    classes: ["box-center"],
                    text: "Saving task... &nbsp;" + SYNC({size: "1.5rem", fill: "#fff"}),
                });
                
                this.element.classList.add("box-center");
                this.element.classList.add("loading");

                this.appendChild(loadingTitle);

                setTimeout(() => {
                    location.href = this.configuration.VIEWS.TASKS;
                }, 250 + Math.random() * 200);
            }}
        });

        this.appendChild(nameRow);
        this.appendChild(tagContainer);
        this.appendChild(description);
        this.appendChild(dateRow);
        this.appendChild(saveButton);

        setTimeout(() => setStyles(this.element, { opacity: "1",}), 100);
    }

    /**
     * Create the tag container
     * @returns The tag container UI component
     */
    private buildTagContainer() : UIComponent {
        const tagContainer = new UIComponent({
            classes: ["box-row","box-warp"],
            id: "tag-container"
        });
        
        const view = this;
        this.core.getTask().labels.forEach(tag => {
            
            const tagButton  = new UIComponent({
                type: "button",
                text: tag,
                classes: ["task-label"]
            });

            tagButton.element.addEventListener("click", () => {
                tagContainer.removeChild(tagButton);
                this.core.removeTag(tag)
            });
            tagButton.appendTo(tagContainer);

        });

        const newTagButton = new UIComponent({
            type : "button",
            id: "new-tag",
            text : PLUS({ fill: "#fff", size: "1rem" })
        });
        newTagButton.appendTo(tagContainer);

        newTagButton.element.addEventListener("click", () => {
            const tag = new UIComponent({
                type: "button",
                text: "New tag",
                classes: ["task-label"],
            });
            tagContainer.removeChild(newTagButton);
            tag.appendTo(tagContainer);

            tag.element.contentEditable = "true";
            tag.element.style.minWidth = "7rem";
            tag.element.focus();

            tag.element.onblur = () => {
                tag.element.contentEditable = "false";
                tag.element.style.minWidth = "0rem";
                view.core.addTag(tag.element.innerText);

                tag.element.onclick = () => {
                    tag.element.onblur = null;
                    tagContainer.removeChild(tag);
                    view.core.removeTag(tag.element.innerText);
                }
            }
            
            tagContainer.appendChild(newTagButton);

        });

        return tagContainer;
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
            text : "Start date: "
        });
        startDateRow.appendChild(startDateLabel);

        const startDateInput = new DateInput({
            id: "task-start-date",
            callback: (date: Date) => {
                view.core.getTask().start = DateText.toDateString(date);
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
            text : "End date: "
        });
        endDateRow.appendChild(endDateLabel);

        const endDateInput = new DateInput({
            id: "task-end-date",
            callback: (date: Date) => {
                view.core.setTaskEnd(DateText.toDateString(date));
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
            text : "All day",
            styles :  {
                marginLeft: "1rem"
            }
        });

        allDay.appendTo(allDayLabel);
        endDateRow.appendChild(allDayLabel)


        return endDateRow;
    }

}