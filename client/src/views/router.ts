import { APP } from "../app.js";
import OsNavbar from "../components/os/osnavbar.js";
import { Sidebar } from "../components/sidebar/sidebar.js";
import { VariablePanel } from "../components/variables/variablePanel.js";
import { Configurations } from "../config/config.js";
import { ListenerSet } from "../core/listenerset.js";
import { UIComponent } from "../lib/gtd-ts/web/uicomponent.js";
import CalendarV from "./calendar/calendarV.js";
import ConfigurationV from "./configuration/configurationV.js";
import errorV from "./error/errorV.js";
import ProjectsV from "./projects/projects.js";
import NewTask from "./tasks/new/newtask.js";
import TasksV from "./tasks/tasksV.js";
import TeamsV from "./teams/teams.js";
import TerminalV from "./terminal/terminal.js";

export default class Router {

    public parent : HTMLElement;
    public osNavbar : OsNavbar;
    public sidebar : Sidebar;
    public variablePanel : VariablePanel;
    public container : UIComponent;
    public configurations : Configurations;

    constructor(configurations : Configurations, listeners : ListenerSet) {

        this.osNavbar = new OsNavbar(listeners);

        this.configurations = configurations;
        this.parent = document.getElementById("view-container") as HTMLElement;
        this.container = new UIComponent({
            type: "div",
            styles: {
                width: "calc(100% - 3rem)",
                height: "100%",
            },
        });

        this.variablePanel = new VariablePanel();
        this.variablePanel.start();

        this.sidebar = new Sidebar(configurations);
        this.sidebar.appendTo(this.parent);
        this.container.appendTo(this.parent);
        this.variablePanel.appendTo(this.parent);
    }
    /**
     * Load a view
     * @param {array} params
     */
    public load (params : string[]) {
    
        try{
            this.clear();
            this.osNavbar.clearControls();
            this.variablePanel.addViewVariables({});

            switch (params[0]) {
                case undefined:
                case "":
                case "tasks":
                    new TasksV().show(params.splice(1), this.container, this.configurations);    
                    this.sidebar.setSelected(0);
                    break;
                case "new-task":
                    new NewTask().show(params.splice(1), this.container, this.configurations);    
                    this.sidebar.setSelected(0);
                    break;
                case "calendar":
                    new CalendarV().show(params.splice(1), this.container, this.configurations);
                    this.sidebar.setSelected(1);
                    break;
                case "teams":
                    new TeamsV().show(params.splice(1), this.container, this.configurations);
                    this.sidebar.setSelected(2);
                    break;
                case "projects":
                    new ProjectsV().show(params.splice(1), this.container, this.configurations);
                    this.sidebar.setSelected(3);
                    break;
                case "configuration":
                    new ConfigurationV().show(params.splice(1), this.container, this.configurations);
                    this.sidebar.setSelected(4);
                    break;
                case "terminal":
                    new TerminalV().show(params.splice(1), this.container, this.configurations);
                    this.sidebar.setSelected(5);
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
