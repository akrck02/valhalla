import { App, APP } from "../../app.js";
import CommandPrompt from "../../components/modal/commandprompt.js";
import { Configurations } from "../../config/config.js";

export class ExpertListener {
  public constructor() {}

  public toggleVariablePanel(): void {
    Configurations.toggleVariablePanel();
  }

  public search(): void {
    APP.router.osNavbar.focusSearchbar();
    APP.router.osNavbar.clearSearchbar();
  }

  public clickControl(option: number): void {
    APP.router.osNavbar.clickControl(option);
  }

  public commandPrompt(): void {
    APP.router.modal.setContent(new CommandPrompt());
    APP.router.modal.toggle();
  }

  public clickNewButton(): void {
    document.getElementById("new")?.click();
  }

  public openTab(index: number) {
    // APP.router.sidebar.clickTab();
  }
}
