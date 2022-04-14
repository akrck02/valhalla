import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class DummyView extends UIComponent {

    public constructor() {
        super({
            type : "view"
        });
    }

    public show(params : string[], container : UIComponent): void {




        this.appendTo(container);
    }

}