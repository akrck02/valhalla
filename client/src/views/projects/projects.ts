import { Configurations } from "../../config/config";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class ProjectsV extends UIComponent {

    public constructor() {
        super({
            type: "view",
            classes: ["box-column","box-center","backdrop"],
            styles: {
                padding: "2rem",
                width: "100%",
                height: "100%",
            },
        });
    }

    public show(params : string[], container : UIComponent): void {
    

    };
} 