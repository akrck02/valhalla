import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/web/uicomponent.js";

export default class CalendarV extends UIComponent {

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

    public show(params: string[], container: UIComponent, config : Configurations): void {
        console.log("Home view is showing");
        console.log("Params: ", params);

        this.appendTo(container);
    }
}
