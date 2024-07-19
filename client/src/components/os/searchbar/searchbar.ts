import { App, APP } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { CommandHandler } from "../../../core/commands/command.js";
import { ListenerSet } from "../../../core/listenerset.js";
import { setEvents, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../../services/tasks.js";
import SearchView from "../../../views/search/searchView.ui.js";
import { SearchModal } from "./searchmodal.js";

enum SEARCHBAR_MODE {
  SEARCH,
  COMMAND,
}

export default class Searchbar extends UIComponent {
  private input: HTMLInputElement;
  private tagContainer: HTMLElement;
  private mode: SEARCHBAR_MODE;
  private handler: CommandHandler;
  private modal: SearchModal;

  public constructor(bar: HTMLElement, listeners: ListenerSet) {
    super({});
    this.element = bar;
    this.input = this.element.querySelector("input#search-input");
    this.tagContainer = this.element.querySelector("span#search-tag");
    this.mode = SEARCHBAR_MODE.SEARCH;
    this.handler = new CommandHandler(listeners);
    this.modal = new SearchModal();
    this.input.placeholder = App.getBundle().os.SEARCHBAR_PLACEHOLDER;
    this.appendChild(this.modal);
    setEvents(this.input, {
      keydown: (event) => {
        //if escape key is pressed, hide modal
        if (event.keyCode == 27) {
          this.input.blur();
          this.modal.hide();
          this.mode = SEARCHBAR_MODE.SEARCH;
          return;
        }

        //if enter key is pressed, execute command
        if (event.keyCode == 13) {
          location.href = Configurations.VIEWS.SEARCH + this.input.value;
          return;
        }

        //if arrow keys are pressed, do not search
        if (
          event.keyCode == 37 ||
          event.keyCode == 38 ||
          event.keyCode == 39 ||
          event.keyCode == 40
        ) {
          if (event.keyCode == 38) {
            this.modal.selectPrevious();
          }

          if (event.keyCode == 40) {
            this.modal.selectNext();
          }

          return;
        }

        this.modal.clean();
      },
      keyup: async (event) => {
        if (event.keyCode == 38 || event.keyCode == 40) {
          return;
        }

        if (event.key === "Backspace" && this.input.value.trim().length == 0) {
          this.removeTag();
          this.modal.noResults();
          this.mode = SEARCHBAR_MODE.SEARCH;
          return;
        }

        this.search();

        const value = this.input.value;
        if (event.key === "Enter") {
          this.mode = SEARCHBAR_MODE.SEARCH;
          this.removeTag();
          this.setValue("");
        }
      },
      click: () => {
        if (this.input.value.trim().length != 0) this.modal.show();
      },
      blur: () => {
        this.modal.hide();
      },
    });
  }

  public async search() {
    const value = this.input.value;

    if (value.trim() == "") {
      this.modal.hide();
      return;
    }

    const response = await taskService.searchUserTasksByName(
      Configurations.getUserName(),
      value,
    );

    response.success((tasks) => {
      this.modal.setTasks(this.input.value.length == 0 ? [] : tasks);
      this.modal.update();
    });

    response.json();
  }

  public focus() {
    this.input.focus();
  }

  public setValue(value: string) {
    this.input.value = value;
  }

  public setTag(tag: string) {
    this.tagContainer.classList.add("visible");
    this.tagContainer.innerHTML = tag;
  }

  public removeTag() {
    this.tagContainer.classList.remove("visible");
    setTimeout(() => {
      this.tagContainer.innerHTML = "";
    }, 100);
  }
}
