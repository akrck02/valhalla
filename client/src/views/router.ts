import { APP } from "../app.js";
import { Sidebar } from "../components/sidebar.js";
import { Terminal } from "../components/terminal/terminal.js";
import { Configurations } from "../config/config.js";
import { UIComponent } from "../lib/gtd-ts/web/uicomponent.js";
import homeV from "./calendar/calendarV.js";
import ConfigurationV from "./configuration/configurationV.js";
import errorV from "./error/errorV.js";
import TasksV from "./tasks/tasksV.js";

export default class Router {

    public parent : HTMLElement;
    public osNavbar : HTMLElement;
    public searchbar : HTMLElement;
    public sidebar : Sidebar;
    public terminal : Terminal;
    public container : UIComponent;
    public configurations : Configurations;

    constructor(configurations : Configurations) {

        this.configurations = configurations;
        this.osNavbar = document.getElementById("os-navbar");
        this.searchbar = this.osNavbar.querySelector("input");
        this.parent = document.getElementById("view-container") as HTMLElement;
        this.container = new UIComponent({
            type: "div",
            styles: {
                width: "calc(100% - 3rem)",
                height: "100%",
            },
        });

        this.terminal = new Terminal();
        this.terminal.start();

        this.sidebar = new Sidebar(configurations);
        this.sidebar.appendTo(this.parent);
        this.container.appendTo(this.parent);
        this.terminal.appendTo(this.parent);
    }
    /**
     * Load a view
     * @param {array} params
     */
    public load (params : string[]) {
    
        try{
            this.clear();

            switch (params[0]) {
                case undefined:
                case "":
                case "tasks":
                    new TasksV().show(params.splice(1), this.container, this.configurations);    
                    this.sidebar.setSelected(0);
                    break;
                case "calendar":
                    new homeV().show(params.splice(1), this.container, this.configurations);
                    this.sidebar.setSelected(1);
                    break;
                case "configuration":
                    new ConfigurationV().show(params.splice(1), this.container, this.configurations);
                    this.sidebar.setSelected(4);
                    break;
                case "error":
                    new errorV().show(params.splice(1), this.container, this.configurations);
                    break;
                default:
                    location.href = APP.configurations.VIEWS.ERROR;
            }

        } catch (e) {
            console.error(e);
        };

    }
    
    /** show a view */
    public clear() {
        this.container.element.innerHTML="";
    }
}
