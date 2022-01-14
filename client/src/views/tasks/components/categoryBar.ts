import { Configurations } from "../../../config/config.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../../services/tasks.js";

export default class CategoryBar extends UIComponent {
    private options: UIComponent[];
    private selected: string;

    public constructor(configuration: Configurations, selected : string, callback : (selected:string) => void) {
        super({
            type: "div",
            id: "category-bar",
            classes: ["box-column"],
        });

        this.options = [];
        this.build(configuration, selected, callback);
    }

    public build(configuration: Configurations, selected : string, callback : (selected:string) => void): void {

        const categories = taskService.getUserTaskCategories("akrck02");

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
                this.appendChild(option);
            });


            if(!selected){
                this.options[0]?.element.click();
            }
        });

        

        categories.json();
    }
}
