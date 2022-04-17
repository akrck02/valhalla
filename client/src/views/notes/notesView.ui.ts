import { App } from "../../app.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";


export default class NotesView extends UIComponent {

    public constructor () {
        super({
            type : "view",
            id: "notes",
            classes : ["box-center"],
            styles : {
                width : "100%",
                height: "100%",
                backdropFilter: "blur(1rem)"
            }
        })
    }

    public show(params : string[], container : UIComponent) {


        const notImplementedYetMessage = new UIComponent({
            type: "h1",
            text : App.getBundle().system.NOT_IMPLEMENTED_YET
        })

        this.appendChild(notImplementedYetMessage)

        container.appendChild(this);
    }

}