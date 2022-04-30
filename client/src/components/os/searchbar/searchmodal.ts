import { setInterval } from "timers/promises";
import { APP, App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { StringUtils } from "../../../core/data/integrity/string.js";
import { ITask } from "../../../core/data/interfaces/task.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import { setEvents, setStyles, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import SearchCore from "../../../views/search/searchView.core.js";
import SearchView from "../../../views/search/searchView.ui.js";

export class SearchModal extends UIComponent {

    private tasks : ITask[];
    private entries : UIComponent[];
    private selected : number;

    constructor() {
        super({id: "search-modal",classes: ["hidden"]});
        this.entries = [];
        this.selected = -1;
        this.element.dataset.selecting="false";
    }

    public setTasks(tasks : ITask[]) {
        this.tasks = tasks;
    }

    public selectNext() {
        this.selected++;
        this.element.dataset.selecting="true";        

        if (this.selected <= -1 || this.selected >= this.entries.length){
            this.selected = 0;
        } 
                
        this.entries[this.selected].element.focus();
        return this.selected;
    }

    public selectPrevious() {
        this.selected--;
        this.element.dataset.selecting="true";

        if (this.selected <= -1) {
            this.element.dataset.selecting="false";

            const input = document.getElementById("search-input") as HTMLInputElement;
            input.value = "";
            input.focus();

            return;
        }
    
        this.entries[this.selected].element.focus();
   
    }   

    public show() {
        this.element.classList.remove("hidden");
    }

    public hide() {
        this.element.classList.add("hidden");
    }

    public update() {
        this.clean();
        this.entries = [];

        if(this.tasks.length == 0) {
            this.noResults();
            return;
        }

        this.show();

        const value = (document.getElementById("search-input") as HTMLInputElement).value;
        this.tasks = SearchCore.orderTasksByLevenshteinDistance(value, this.tasks);
        
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
                events : {
                    click: () => {
                        App.redirect(Configurations.VIEWS.TASK,["" + task.id]);
                    }
                },
                attributes : {
                    tabindex : "-1"
                },
                styles : {
                    color: "#ffffffe0",
                    wordWrap: "break-word",
                    textOverflow: "ellipsis",
                }
            })

            taskEntry.appendChild(icon);
         
            if(value != "") {
                const matching = StringUtils.getMatching(task.name || "", value);
                if(matching.length > 0) {

                    const title = task.name;
                    task.name = title.replace(matching[0], `<span class="bold" color: #fff">${matching}</span>`);
                }   
            }

            const taskNameComponent = new UIComponent({
                classes: ["task-name"],
                text: task.name,
                styles: {
                    marginLeft: "0.5rem"
                }
            })

            taskEntry.appendChild(taskNameComponent);

            this.defaultMovement(taskEntry);

            this.entries.push(taskEntry);
            this.appendChild(taskEntry);
        }

        if(this.tasks.length > 3) {
            const more = new UIComponent({
                classes: ["task-entry"],
                id: "more",
                text: App.getBundle().os.MORE + "...",
                events: {
                    click: () => {
                        const input = document.getElementById("search-input") as HTMLInputElement;
                        App.redirect(Configurations.VIEWS.SEARCH,[input.value]);
                    },
                },
                attributes : {
                    tabindex : "-1"
                }
            })

            this.defaultMovement(more);

            const icon = getMaterialIcon("search",{fill: "white", size:"1.5rem"});
            more.appendChild(icon);
            this.appendChild(more);
            this.entries.push(more);
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


    defaultMovement(comp : UIComponent){
        setEvents(comp.element, {
            keydown: (e : any) => {

                if(e.keyCode == 38) {
                    this.selectPrevious();
                }

                if(e.keyCode == 40) {
                    this.selectNext();
                }

                if(e.key === 'Enter'){
                    comp.element.click();
                    this.element.dataset.selecting = "false";
                }

            }
        })
    }
}