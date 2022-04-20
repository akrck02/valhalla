import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class CommandPrompt extends UIComponent {

    public constructor() {
        super({
            type : "div",
            id: "commandprompt",
            styles: {
                minWidth: "25rem",
                minHeight: "15rem",
                padding: "2rem",
            }
        });


        const title = new UIComponent({
            type: "h1",
            text: "Command Prompt",
            classes : ["box-row", "box-x-between", "box-y-center"],
        });

        const icon = getMaterialIcon("terminal", {size: "1.5rem", fill : "#fff"});

        const input = new UIComponent({
            type: "textarea",
            id: "commandprompt-input",
            styles: {
                width: "100%",
                height: "5rem",
                color: "#fff",
                border: "none",
                outline: "none",
                fontSize: ".9rem",
                padding: "0.5rem",
                margin: "2rem 0",
                borderRadius: "0.35rem",
                backdropFilter : "none",
                backgroundColor: "rgba(255,255,255,0.035)",
            }
        });

        title.appendTo(this);
        icon.appendTo(title);

        input.appendTo(this);
    }

}