import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import TaskCore from "../tasks/tasksView.core.js";

export default class CanvasTasksView extends UIComponent {
  private core: TaskCore;
  private wrapper: UIComponent;
  private taskContainer: UIComponent;
  private taskComponents: UIComponent[];

  public constructor() {
    super({
      type: "view",
      classes: ["box-row"],
      id: "tasks",
      styles: {
        width: "100%",
        height: "100%",
        padding: "1rem",
      },
      data: { selected: "none" },
    });
  }

  /**
   * Show the current view on display
   * @param params The parameters of the view
   * @param container The container to draw the view on
   * @param configurations The configurations of the app
   */
  public show(params: string[], container: UIComponent | HTMLElement): void {
    this.clean();
    const title = new UIComponent({
      type: "h1",
      classes: ["title"],
      text: "Tasks",
    });

    this.taskContainer = new UIComponent({
      classes: ["box-row"],
      id: "task-container",
      styles: {
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "1rem",
      },
    });

    title.appendTo(this);
    this.taskContainer.appendTo(this);
    this.appendTo(container);
  }
}
