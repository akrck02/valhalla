import homeV from "./calendar/calendarV.js";
import errorV from "./error/errorV.js";
import { CONFIG } from "../config/config.js";
import TasksV from "./tasks/tasksV.js";
import { Sidebar } from "../components/sidebar.js";
import { UIComponent } from "../lib/web/uicomponent.js";

export default class Router {

    
    public parent : HTMLElement;
    public sidebar : Sidebar;
    public container : UIComponent;

    constructor() {
        this.parent = document.getElementById("view-container") as HTMLElement;
        this.container = new UIComponent({
            type: "div",
            styles: {
                width: "calc(100% - 3rem)",
                height: "100%",
            },
        });

        this.sidebar = new Sidebar();
        this.sidebar.element.style.opacity = "0";
        this.sidebar.element.style.transition = "opacity var(--slow)";

        this.sidebar.appendTo(this.parent);
        this.container.appendTo(this.parent);

        setTimeout(() => {
            this.sidebar.element.style.opacity = "1";
        }, 200);
    }
    /**
     * Load a view
     * @param {array} params
     */
    public load (params : string[]) {
    
        this.clear();

        switch (params[0]) {
            case undefined:
            case "":
            case "tasks":
                new TasksV().show(params, this.container);    
                this.sidebar.setSelected(0);
                break;
            case "calendar":
                new homeV().show(params, this.container);
                this.sidebar.setSelected(1);
                break;
            case "error":
                new errorV().show(params, this.container);
                break;
            default:
                location.href = CONFIG.URL + "#/error/404/";
        }
    };

    /** show a view */
    public clear() {
        this.container.element.innerHTML="";
    }
}
