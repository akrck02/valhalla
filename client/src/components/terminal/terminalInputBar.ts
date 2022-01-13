import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { Terminal } from "./terminal.js";

export class TerminalInputBar extends UIComponent {

    private terminal : Terminal;
    public constructor(Terminal: Terminal) {
        super({
            type: "div",
            id: "input-bar",
        });

        this.terminal = Terminal;

        const input = new UIComponent({
            type: "input"
        });

        this.appendChild(input);
    }


}