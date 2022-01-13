import { setEvents, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { Terminal } from "./terminal.js";

export class TerminalTabBar extends UIComponent{

    private terminal : Terminal;

    private logTab : UIComponent;
    private errorTab : UIComponent;
    private warningTab : UIComponent;
    private autoScroll : UIComponent;
    private clear : UIComponent;
    private variables : UIComponent;


    public constructor(terminal: Terminal) {
        super({
            type: "div",
            id: "tab-bar",
        });

        this.terminal = terminal;
        this.createTabs();
    }


    private createTabs() : void {

        this.logTab = new UIComponent({
            type: "button",
            text: "Logs",
            classes: ["tab", "selected"]
        });

        this.errorTab = new UIComponent({
            type: "button",
            text: "Errors",
            classes: ["tab"],
        });

        this.errorTab.element.style.setProperty("--color", "var(--error-color)");

        this.warningTab = new UIComponent({
            type: "button",
            text: "Warnings",
            classes: ["tab"],
        });
        this.warningTab.element.style.setProperty("--color", "var(--warning-color)");

        this.autoScroll = new UIComponent({
            type: "button",
            text: "🔃",
            styles: {
                fontSize: "1.1rem",
                background: "transparent",
                boxShadow: "none",
                filter: "grayscale(0)",
                width: "1rem"
            },
        });

        this.clear = new UIComponent({
            type: "button",
            text: "🚫",
            styles: {
                fontSize: "1.1rem",
                background: "transparent",
                boxShadow: "none",
                width: "1rem"
            }
        });

        this.variables = new UIComponent({
            type: "button",
            text: "🧠",
            id: "variables",
            styles: {
                fontSize: "1.1rem",
                boxShadow: "none",
                width: "3rem"
            }
        });

        setEvents(this.logTab.element, {
            click: () => {
                this.errorTab.element.classList.remove("selected");
                this.warningTab.element.classList.remove("selected");
                this.logTab.element.classList.add("selected");
                this.variables.element.classList.remove("selected");

                this.terminal.setScroll(true);
                this.terminal.setMode("log");
            }
        })

        setEvents(this.errorTab.element, {
            click: () => {
                this.errorTab.element.classList.add("selected");
                this.warningTab.element.classList.remove("selected");
                this.logTab.element.classList.remove("selected");
                this.variables.element.classList.remove("selected");

                this.terminal.setScroll(true);
                this.terminal.setMode("error");
            }
        })

        setEvents(this.warningTab.element, {
            click: () => {
                this.errorTab.element.classList.remove("selected");
                this.warningTab.element.classList.add("selected");
                this.logTab.element.classList.remove("selected");
                this.variables.element.classList.remove("selected");

                this.terminal.setScroll(true);
                this.terminal.setMode("warning");
            }
        })

        setEvents(this.autoScroll.element, {
            "click": () => {
                const scroll = this.terminal.isScroll();
                this.autoScroll.element.style.filter = (scroll) ? "grayscale(10)" : "grayscale(0)";
                this.terminal.setScroll(!scroll);
            }
        })

        setEvents(this.clear.element, {
            click: () => {
                this.terminal.clear();
            }
        })

        setEvents(this.variables.element, {
            click: () => {
                this.terminal.setMode("variables");
                this.terminal.setScroll(false);

                this.errorTab.element.classList.remove("selected");
                this.warningTab.element.classList.remove("selected");
                this.logTab.element.classList.remove("selected");
                this.variables.element.classList.add("selected");
            }
        })

        this.appendChild(this.logTab);
        this.appendChild(this.errorTab);
        this.appendChild(this.warningTab);
        this.appendChild(this.autoScroll);
        this.appendChild(this.clear);
        this.appendChild(this.variables);

    }

}