import { APP } from "../app.js";
import OsNavbar from "../components/os/osnavbar.js";
import { Sidebar } from "../components/sidebar/sidebar.js";
import { VariablePanel } from "../components/variables/variablePanel.js";
import { Configurations } from "../config/config.js";
import { ListenerSet } from "../core/listenerset.js";
import { UIComponent } from "../lib/gtd-ts/web/uicomponent.js";
import AboutView from "./about/aboutView.ui.js";
import CalendarView from "./calendar/calendarView.ui.js";
import ConfigurationView from "./configuration/configurationView.ui.js";
import ErrorV from "./error/errorV.js";
import ProjectsV from "./projects/projects.js";
import SearchView from "./search/searchView.ui.js";
import NewTaskView from "./new-tasks/newTaskView.ui.js";
import TasksView from "./tasks/tasksView.ui.js";
import TeamsV from "./teams/teams.js";
import TerminalV from "./terminal/terminal.js";
import DummyV from "./dummy/dummyView.ui.js";
import ViewerV from "./viewer/viewer.ui.js";
import ShowTaskView from "./show-task/showTask.ui.js";

export default class Router {

    public parent : HTMLElement;
    public osNavbar : OsNavbar;
    public sidebar : Sidebar;
    public variablePanel : VariablePanel;
    public container : UIComponent;

    constructor(listeners : ListenerSet) {

        this.osNavbar = new OsNavbar(listeners);
        this.parent = document.getElementById("view-container") as HTMLElement;
        this.container = new UIComponent({
            type: "div",
            id: "view-container-box",
            styles: {
                width: "calc(100% - 3rem)",
                height: "100%",
            },
        });

        this.variablePanel = new VariablePanel();
        this.variablePanel.start();

        this.sidebar = new Sidebar();
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
            this.osNavbar.showSearchBar();
            this.variablePanel.addViewVariables({});

            switch (params[0]) {
                case undefined:
                case "":
                case "tasks":
                    new TasksView().show(params.splice(1), this.container);    
                    this.sidebar.setSelected(0);
                    break;
                case "task":
                    new ShowTaskView().show(params.splice(1), this.container);    
                    break;
                case "new-task":
                    new NewTaskView().show(params.splice(1), this.container);    
                    this.sidebar.setSelected(0);
                    break;
                case "calendar":
                    new CalendarView().show(params.splice(1), this.container);
                    this.sidebar.setSelected(1);
                    break;
                case "teams":
                    new TeamsV().show(params.splice(1), this.container);
                    this.sidebar.setSelected(2);
                    break;
                case "projects":
                    new ProjectsV().show(params.splice(1), this.container);
                    this.sidebar.setSelected(3);
                    break;

                case "search":
                    new SearchView().show(params.splice(1), this.container);
                    this.sidebar.setSelected(2);
                    break;

                case "configuration":
                    new ConfigurationView().show(params.splice(1), this.container);
                    //this.sidebar.setSelected(4);
                    this.sidebar.setSelected(3);
                    break;
                case "terminal":
                    new TerminalV().show(params.splice(1), this.container);
                    this.sidebar.setSelected(5);
                    break;
                case "about":
                    new AboutView().show(params.splice(1), this.container);
                    this.sidebar.setSelected(4);
                    break;
                case "viewer":
                    new ViewerV().show(params.splice(1), this.container);
                    this.sidebar.setSelected(5);
                    break;
                case "error":
                    new ErrorV().show(params.splice(1), this.container);
                    break;
                case "dummy":
                    new DummyV().show(params.splice(1), this.container);
                    this.sidebar.setSelected(5);
                    break;
                default:
                    location.href = Configurations.VIEWS.ERROR;
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
