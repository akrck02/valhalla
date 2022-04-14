import { setInterval } from "timers/promises";
import { App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { ITask } from "../../../core/data/interfaces/task.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import { setEvents, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export class SearchModal extends UIComponent {

    private tasks : ITask[];

    constructor() {
        super({id: "search-modal",classes: ["hidden"]});
    }

    public setTasks(tasks : ITask[]) {
        this.tasks = tasks;
    }

    public show() {
        this.element.classList.remove("hidden");
    }

    public hide() {
        this.element.classList.add("hidden");
    }

    public update() {
        this.clean();

        if(this.tasks.length == 0) {
            this.noResults();
            return;
        }

        this.show();
        this.tasks;
        
        const max = this.tasks.length <= 3 ? this.tasks.length : 3;

        for (let i = 0; i < max; i++) {
            const task = this.tasks[i];
            let icon;
            
            if(task.done == 1 ) {
                icon = getMaterialIcon("task_alt",{ fill: "#fff", size: "1.05rem"});
            } else {
                icon = getMaterialIcon("radio_button_unchecked",{ fill: "#fff", size: "1.05rem"});
            }
            
            const taskEntry = new UIComponent({
                classes: ["task-entry","box-row", "box-y-center"],
                text: icon.toHTML() + "&nbsp;&nbsp;&nbsp;" + task.name,
            })

            this.appendChild(taskEntry);
        }

        if(this.tasks.length > 3) {
            const more = new UIComponent({
                classes: ["task-entry"],
                id: "more",
                text: App.getBundle().os.MORE + "...",
                events: {
                    click: () => {
                        App.redirect(Configurations.VIEWS.SEARCH,[""]);
                    }
                }
            })

            const icon = getMaterialIcon("search",{fill: "white", size:"1.5rem"});
            more.appendChild(icon);
            this.appendChild(more);
        }
        
    }

    noResults() {
        this.clean();
        const noResults = new UIComponent({
            classes: ["task-entry","box-row", "box-y-center"],
            id: "no-results",
            text: App.getBundle().os.NO_RESULTS,
            events: {
                click: () => {
                    this.hide();
                }
            }
        })



        const icon = getMaterialIcon("clear_all",{fill: "white", size:"1.5rem"});
       
        noResults.appendChild(icon);
        this.appendChild(noResults);
    }
}