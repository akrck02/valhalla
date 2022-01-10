import { APP } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/web/uicomponent.js";
import CategoryBar from "./components/categoryBar.js";

export default class TasksV extends UIComponent {

    public constructor() {
        super({
            type: "view",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },

        });
    }

    public show(params: string[], container: UIComponent, configurations : Configurations): void {
        const categoryBar = new CategoryBar(configurations, params[0], this.showTasks);
        const button = new UIComponent({
            type: "button",
            text: "switch",
            styles : {
                width : "4rem",
                height : "2rem"
            },
            events: {
                click: () => {
                   APP.configurations.toggleTheme();
                }
            }
        });

        categoryBar.element.style.opacity = "0";
        categoryBar.element.style.transition = "opacity var(--slow)";

        this.appendChild(categoryBar);
        this.appendChild(button);

        this.appendTo(container);

        setTimeout(() => {
            categoryBar.element.style.opacity = "1";
        }, 100);
               
        console.log("https://google.com/");
        
    }


    private showTasks(selected : string) {

        console.log("[Task]" , selected, "was selected.");

        
    }
}
