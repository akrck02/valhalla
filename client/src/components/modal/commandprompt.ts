import { APP } from "../../app.js";
import { CommandHandler } from "../../core/commands/command.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setEvents, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class CommandPrompt extends UIComponent {

    private handler : CommandHandler;

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

        this.handler = new CommandHandler(APP.listeners);


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

        setEvents(input.element,{
            keyup: (e) => this.handleCommands(e, input)
        })

        title.appendTo(this);
        icon.appendTo(title);
        input.appendTo(this);
    }


    handleCommands(e: any, input: UIComponent) {

        if(e.key == "Enter") {
            e.preventDefault();
            this.handler.handle((input.element as HTMLInputElement).value);      
            (input.element as HTMLInputElement).value = "";
        }

    
    }

}