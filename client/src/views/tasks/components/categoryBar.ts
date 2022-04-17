import { App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { getMaterialIcon} from "../../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../../services/tasks.js";

export default class CategoryBar extends UIComponent {
    private options: UIComponent[];
    private menu: UIComponent;
    private selected: string;

    public constructor(
        selected : string,
        callback : (selected:string) => void,
        buttonAction : () => void,
    )  {
        super({
            type: "div",
            id: "category-bar",
            classes: ["box-column"],
        });

        let button = new UIComponent({
            type: "button",
            text: getMaterialIcon("plus",{
                size: "1.7rem",
                fill: "#fff",
            }).toHTML(),
            classes: ["icon-button","box-center"],
            id: "new",
            events : {
                click : () => buttonAction()
            }
        });

        this.menu = new UIComponent({
            type: "div",
            id: "category-bar-menu",
            classes: ["box-column", "box-x-start"],
        });

        this.options = [];
        this.build(selected, callback);
        this.appendChild(button);
        this.appendChild(this.menu);
    }

    public build(selected : string, callback : (selected:string) => void): void {

        const categories = taskService.getUserTaskCategories(Configurations.getUserName());
        categories.success((categories) => {
            categories.forEach((category) => {
                const option = new UIComponent({
                    type: "div",
                    classes: ["label"],
                    text: category.label,
                    events: {
                        click: () => {
                            this.options.forEach(e => e.element.classList.remove("selected"));
                            option.element.classList.add("selected");
                            selected = option.text;
                            
                            Configurations.addConfigVariable("TASKS_SELECTED_CATEGORY", selected);

                            callback(selected);
                        },
                    },
                    styles: {
                        color : "rgba(0,0,0,.0)",
                    }
                });

                this.options.push(option);
                this.menu.appendChild(option);
            });

            if(categories.length == 0) {
                const noCategories = new UIComponent({
                    type: "div",
                    id: "no-catergories",
                    text:  `<h2>${App.getBundle().tasks.THERE_ARE_NO_CATEGORIES_YET}</h2>
                            <br><br>
                            <span style='font-size:.85rem; opacity:.7'>
                            ${App.getBundle().tasks.CATEGORIES_EXPLANATION}
                            </span>
                            <br><br>
                            <span class='italic bold'>${App.getBundle().tasks.CREATE_YOUR_FIRST_TASK}</span>
                    `,
                    styles: {
                        fontSize: "1rem",
                        margin: "2rem 0.5rem ",
                        opacity: "0",
                        transition : "opacity var(--medium)",
                    },
                });

                this.appendChild(noCategories);
            }

            if(selected){
                this.options.forEach(e => {
                    
                    if(e.text.toUpperCase() == selected.toUpperCase()) {
                        e.element.click();
                    }
                });
            } else {  
                this.options[0]?.element.click();
            }


        });

        categories.json();
    }


    public show(): void {
        let diff = 100;
        this.options.forEach(e =>{           

            setTimeout(() => {
                e.element.style.color = "var(--text-color)"
            }, diff);

            diff += Math.random() * 100;

        });

        const noCategoriesMessage = this.element.querySelector("#no-catergories") as HTMLElement;
        if(noCategoriesMessage) {
            noCategoriesMessage.style.opacity = "1";
        }
    }
}
