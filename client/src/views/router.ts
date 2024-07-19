import OsNavbar from "../components/os/osnavbar.js";
import { Sidebar } from "../components/sidebar/sidebar.js";
import { VariablePanel } from "../components/variables/variablePanel.js";
import { Configurations } from "../config/config.js";
import { ListenerSet } from "../core/listenerset.js";
import { setStyles, UIComponent } from "../lib/gtd-ts/web/uicomponent.js";
import AboutView from "./about/aboutView.ui.js";
import CalendarView from "./calendar/calendarView.ui.js";
import ConfigurationView from "./configuration/configurationView.ui.js";
import ErrorV from "./error/errorV.js";
import ProjectsV from "./projects/projects.js";
import SearchView from "./search/searchView.ui.js";
import TasksView from "./tasks/tasksView.ui.js";
import TeamsV from "./teams/teams.js";
import TerminalV from "./terminal/terminal.js";
import DummyV from "./dummy/dummyView.ui.js";
import ViewerV from "./viewer/viewer.ui.js";
import ShowTaskView from "./show-task/showTask.ui.js";
import StartView from "./start/startView.ui.js";
import NotesView from "./notes/notesView.ui.js";
import Modal from "../components/modal/modal.js";
import CanvasTasksView from "./canvan/canvan.view.js";
import { isMobile, isSmallDevice } from "../lib/gtd-ts/web/responsivetools.js";

export default class Router {
  public parent: HTMLElement;
  public osNavbar: OsNavbar;
  public sidebar: Sidebar;
  public variablePanel: VariablePanel;
  public modal: Modal;
  public container: UIComponent;

  constructor(listeners: ListenerSet) {
    this.osNavbar = new OsNavbar(listeners);
    this.parent = document.getElementById("view-container") as HTMLElement;
    this.container = new UIComponent({
      type: "div",
      id: "view-container-box",
      styles: {
        height: "100%",
        width: "100%",
      },
    });

    if (!isMobile() && !isSmallDevice()) {
      setStyles(this.container.element, {
        width: "calc(100% - 3rem)",
      });
    }

    this.variablePanel = new VariablePanel();
    this.variablePanel.start();

    this.sidebar = new Sidebar();
    this.modal = new Modal();

    this.sidebar.appendTo(this.parent);
    this.container.appendTo(this.parent);
    this.variablePanel.appendTo(this.parent);
    this.modal.appendTo(document.body);
  }
  /**
   * Load a view
   * @param {array} params
   */
  public load(params: string[]) {
    try {
      this.clear();
      this.osNavbar.clearControls();
      this.osNavbar.showSearchBar();
      this.variablePanel.addViewVariables({});

      switch (params[0]) {
        case "start":
          new StartView().show(params.splice(1), this.container);
          break;
        case undefined:
        case "":
        case "tasks":
          new TasksView().show(params.splice(1), this.container);
          this.sidebar.setSelected("tasks");
          break;
        case "calendar":
          new CalendarView().show(params.splice(1), this.container);
          this.sidebar.setSelected("calendar");
          break;
        case "notes":
          new NotesView().show(params.splice(1), this.container);
          this.sidebar.setSelected("notes");
          break;
        case "configuration":
          new ConfigurationView().show(params.splice(1), this.container);
          this.sidebar.setSelected("configuration");
          break;

        case "about":
          new AboutView().show(params.splice(1), this.container);
          this.sidebar.setSelected("about");
          break;
        case "task":
          new ShowTaskView().show(params.splice(1), this.container);
          this.sidebar.setSelected();
          break;

        case "teams":
          new TeamsV().show(params.splice(1), this.container);
          this.sidebar.setSelected();
          break;
        case "projects":
          new ProjectsV().show(params.splice(1), this.container);
          this.sidebar.setSelected();
          break;

        case "search":
          new SearchView().show(params.splice(1), this.container);
          this.sidebar.setSelected("search");
          break;

        case "terminal":
          new TerminalV().show(params.splice(1), this.container);
          this.sidebar.setSelected();
          break;

        case "viewer":
          new ViewerV().show(params.splice(1), this.container);
          this.sidebar.setSelected();
          break;
        case "error":
          new ErrorV().show(params.splice(1), this.container);
          this.sidebar.setSelected();
          break;
        case "dummy":
          new DummyV().show(params.splice(1), this.container);
          this.sidebar.setSelected();
          break;
        default:
          location.href = Configurations.VIEWS.ERROR;
      }
    } catch (e) {
      console.error(e);
    }
  }

  /** show a view */
  public clear() {
    this.container.element.innerHTML = "";
  }
}
