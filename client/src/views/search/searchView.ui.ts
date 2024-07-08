import { APP, App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { StringUtils } from "../../core/data/integrity/string.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { sleep } from "../../lib/gtd-ts/sync/timetools.js";
import { setEvents, setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import SearchCore from "./searchView.core.js";

export default class SearchView extends UIComponent {

    private core : SearchCore;

    private resultsForMessage : UIComponent; 
    private taskContainer : UIComponent;
    private categoryContainer : UIComponent;


    constructor() {
        super({
            type: "view",
            id: "search",
            classes: ["box-column"],
            styles: {
                padding: "1rem 3rem",
                overflowY: "auto",
            }
        });

        this.core = new SearchCore();
    }


    public show(params : string[], container : UIComponent): void {
    
        APP.router.osNavbar.hideSearchBar();
        let search = params[0];

        console.log("params", params);
        
        if(!search) {
            search = Configurations.getConfigVariable("LAST_SEARCH");
        }

        Configurations.addConfigVariable("LAST_SEARCH", search);

        const topBar = new UIComponent({
            type: "div",
            classes: ["box-column", "box-x-start", "box-y-center"],
            styles : {
                paddingBottom: "1rem",
                wordBreak: "break-word",
                opacity: "0",
                transition: "opacity var(--medium)",
            }
        });

        setTimeout(() => {
            topBar.element.style.opacity = "1";
        }, 100);

        this.showSearchbar(search, topBar);

        const columnContainer = new UIComponent({
            type: "div",
            classes: ["box-row"],
            styles: {
                padding: "2rem 0rem",
            }
        });

        const columnOne = new UIComponent({
            type: "div",
            classes: ["box-column"],
            styles: {
                width: "50%",
                height: "100%",
                padding: "0 1rem",
            }
        });

        const taskTitle = new UIComponent({
            type: "div",
            text: App.getBundle().os.TASKS + ":",
            classes: ["box-row", "box-x-start", "box-y-center"],
            styles: {
                width: "100%",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "1rem",
            }
        });

        this.taskContainer = new UIComponent({
            type: "div",
            classes: ["box-column"],
        });

        this.core.getTasks(search, tasks => {
            this.showTasks(tasks, this.taskContainer);
        });

        columnOne.appendChild(taskTitle);
        columnOne.appendChild(this.taskContainer);


        const columnTwo = new UIComponent({
            type: "div",
            classes: ["box-column"],    
            styles: {
                width: "50%",
                height: "100%",
                padding: "0 1rem",
            }
        });

        const categoriesTitle = new UIComponent({
            type: "div",
            text: App.getBundle().os.CATEGORIES + ":",
            classes: ["box-row", "box-x-start", "box-y-center"],
            styles: {
                width: "100%",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "1rem",
            }
        });

        this.categoryContainer = new UIComponent({
            type: "div",
            classes: ["box-column"],
        });

        columnTwo.appendChild(categoriesTitle);
        columnTwo.appendChild(this.categoryContainer);

        this.core.getCategories(search, categories => {
            this.showCategories(categories, this.categoryContainer);
        });


        columnContainer.appendChild(columnOne);
        columnContainer.appendChild(columnTwo);

        this.appendChild(topBar);
        this.appendChild(columnContainer);
        this.appendTo(container);
    }

    public showSearchbar(search : string = '', container : UIComponent): void {
        const bar = new UIComponent({
            type: "div",
            classes: ["box-row", "box-x-center", "box-y-center"],
            styles: {
                width: "40%",
                height: "2.7rem",
                backgroundColor: "rgba(255,255,255,0.05)",
                padding: "0rem 1rem",
                borderRadius: "0.35rem",
                opacity: "1",
                margin: "1rem 0",
            },
        });

        const input = new UIComponent({
            type: "input",
            classes: ["box-row", "box-x-center", "box-y-center"],
            id: "search-view-input",
            attributes: {
                type: "text",
                placeholder: App.getBundle().os.SEARCHBAR_PLACEHOLDER,
                value: search || "",
            },
            styles: {
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                color: "#fff",
                background: "rgba(255,255,255,0)",
                backdropFilter: "none",
            },
        });

        setEvents(input.element, {
            keyup: (e) => {
                const value = (input.element as HTMLInputElement).value;
                this.resultsForMessage.element.innerHTML = App.getBundle().os.SEARCH_RESULTS_FOR.replace("{$1}", value);
                Configurations.addConfigVariable("LAST_SEARCH", value);

                this.core.getTasks(value, tasks => {
                    this.showTasks(tasks, this.taskContainer);
                });

                this.core.getCategories(value, categories => {
                    this.showCategories(categories, this.categoryContainer);
                });

            },
            keydown: (e) => {
                this.taskContainer.clean();
            }
        });

        const button = getMaterialIcon("search", {
            size: "1.5rem",
            fill: "#fff",
        });
        bar.appendChild(input);
        bar.appendChild(button);

       
        this.resultsForMessage = new UIComponent({
            text: App.getBundle().os.SEARCH_RESULTS_FOR.replace("{$1}", search),
            styles : {
                width: "40%",
                fontSize: ".9rem",
                padding: "0 1.3rem",
            }
        });

        container.appendChild(bar);
        container.appendChild(this.resultsForMessage);
    }

    public async showTasks(tasks : ITask[], container: UIComponent): Promise<void> {

        const value = (document.getElementById("search-view-input") as HTMLInputElement).value;
        tasks = SearchCore.orderTasksByLevenshteinDistance(value, tasks);

        setStyles(container.element, {
            transition: "none",
            opacity: "0",
        });


        await sleep(100)
        container.clean()
        setStyles(container.element, {
            transition: "opacity var(--medium)",
            opacity: "1",
        });
        
        if(tasks.length == 0) {
            const noResults = new UIComponent({
                text: App.getBundle().os.NO_RESULTS,
                styles: {
                    width: "100%",
                    fontSize: "1rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }   
            });
            container.appendChild(noResults);
            return;
        }

        tasks.forEach(task => {
            const taskItem = new UIComponent({
                type: "div",
                classes: ["box-row", "box-x-start", "box-y-center"],
                styles: {
                    width: "100%",
                    height: "3rem",
                    backgroundColor: "rgba(255,255,255,0.0175)",
                    marginBottom: ".7rem",
                    borderRadius: "0.25rem",
                    padding: "1rem",
                    cursor: "pointer",
                },
                events: {
                    click: () => {
                       App.redirect(Configurations.VIEWS.TASK, [task.id + ""]);
                    }
                }
            });


            const icon = getMaterialIcon(task.done == 1 ?  "task_alt" : "radio_button_unchecked", {
                size: "1.25rem",
                fill: "#fff",
            });

            setStyles(icon.element, {
                marginRight: "1rem",
            });

            const taskTitle = new UIComponent({
                type: "div",
                text: task.name,
                styles: {
                    fontSize: ".8rem",
                    color: "#ffffffa0",
                }
            });
         
            if(value != "") {}   
            taskItem.appendChild(icon);
            taskItem.appendChild(taskTitle);

            container.appendChild(taskItem);
        });

    

    }

    public showTeams(teams : any[]): void {
        throw new Error("Method not implemented.");
    }

    public async showCategories(categories : any[], container : UIComponent): Promise<void> {
        
        const value = (document.getElementById("search-view-input") as HTMLInputElement).value;
        categories = SearchCore.orderCategoriesByLevenshteinDistance(value,categories);

        setStyles(container.element, {
            transition: "none",
            opacity: "0",
        });

        await sleep(100)
        container.clean()

        setStyles(container.element, {
            transition: "opacity var(--medium)",
            opacity: "1",
        });
        
        if(categories.length == 0) {
            const noResults = new UIComponent({
                text: App.getBundle().os.NO_RESULTS,
                styles: {
                    width: "100%",
                    fontSize: "1rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }   
            });
            container.appendChild(noResults);
            return;
        }

        categories.forEach(category => {
            const categoryItem = new UIComponent({
                type: "div",
                classes: ["box-row", "box-x-start", "box-y-center"],
                styles: {
                    width: "100%",
                    height: "3rem",
                    backgroundColor: "rgba(255,255,255,0.0175)",
                    marginBottom: ".7rem",
                    borderRadius: "0.25rem",
                    padding: "1rem",
                    cursor: "pointer",
                },
                events: {
                    click: () => {
                       App.redirect(Configurations.VIEWS.TASKS, [category.label]);
                    }
                }
            });


            const icon = getMaterialIcon("tag", {
                size: "1.25rem",
                fill: "#fff",
            });

            setStyles(icon.element, {
                marginRight: "1rem",
            });

            const categoryTitle = new UIComponent({
                type: "div",
                text: category.label,
                classes: ["box-row", "box-x-start", "box-y-center"],
                styles: {
                    fontSize: ".8rem",
                    color: "#ffffffa0",
                }
            });
         
            
            if(value != "") {}

            categoryItem.appendChild(icon);
            categoryItem.appendChild(categoryTitle);

            container.appendChild(categoryItem);
        });


    }

    public showNotes(notes : any[]): void {
        throw new Error("Method not implemented.");
    }

    public showNoResults(): void {
    }

}