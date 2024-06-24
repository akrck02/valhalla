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
                    text: category.label == "none" ? App.getBundle().tasks.OTHERS : category.label,
                    events: {
                        click: () => {
                            this.options.forEach(e => e.element.classList.remove("selected"));
                            option.element.classList.add("selected");
                            
                            selected = (option.text == App.getBundle().tasks.OTHERS) ? "none" : option.text;
                            Configurations.addConfigVariable("TASKS_SELECTED_CATEGORY", option.text);

                            callback(selected);
                        },
                    },
                    styles: {
                        color : "rgba(0,0,0,.0)",
                        wordBreak: "break-word"
                        
                    }
                });

                this.options.push(option);
                this.menu.appendChild(option);
            });

            if(categories.length == 0) {
                const option = new UIComponent({
                    type: "div",
                    classes: ["label"],
                    text: App.getBundle().tasks.OTHERS,
                    events: {
                        click: () => {
                            this.options.forEach(e => e.element.classList.remove("selected"));
                            option.element.classList.add("selected");
                            selected = "none";
                            
                            Configurations.addConfigVariable("TASKS_SELECTED_CATEGORY", selected);

                            callback(null);
                        },
                    },
                    styles: {
                        color : "rgba(0,0,0,.0)",
                        wordBreak: "break-word"
                        
                    }
                });

                this.options.push(option);
                this.menu.appendChild(option);
                }
                
                console.log(selected);
                

                if(selected == "" || selected == "null" || selected == "undefined"|| selected == "none") {
                    this.options[this.options.length - 1].element.click();
                } else {
                    this.options.forEach(e => {
                        if(e.text.toUpperCase() == selected.toUpperCase()) {
                            e.element.click();
                        }
                    });
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

    getSelectedCategoryIndex() {
        return this.selected;
    }
}
