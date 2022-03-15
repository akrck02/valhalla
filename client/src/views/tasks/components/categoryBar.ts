import { Configurations } from "../../../config/config.js";
import { PLUS, SUMMATION } from "../../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../../services/tasks.js";

export default class CategoryBar extends UIComponent {
    private options: UIComponent[];
    private menu: UIComponent;
    private selected: string;

    public constructor(
        configuration: Configurations,
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
            text: PLUS({
                size: "1.7rem",
                fill: "#fff",
            }),
            classes: ["icon-button","box-center"],
            id: "new",
            events : {
                click : () => buttonAction()
            }
        });

        this.menu = new UIComponent({
            type: "div",
            id: "category-bar-menu",
            classes: ["box-column"],
        });

        this.options = [];
        this.build(configuration, selected, callback);
        this.appendChild(button);
        this.appendChild(this.menu);
    }

    public build(configuration: Configurations, selected : string, callback : (selected:string) => void): void {

        const categories = taskService.getUserTaskCategories(configuration.USER.USERNAME);

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

                            callback(selected);
                        },
                    },
                });

                this.options.push(option);
                this.menu.appendChild(option);
            });

            if(categories.length == 0) {
                const noCategories = new UIComponent({
                    type: "div",
                    text: "There are no categories here yet.",
                });

                this.appendChild(noCategories);
            }

            if(!selected){
                this.options[0]?.element.click();
            }
        });

        categories.json();
    }
}
