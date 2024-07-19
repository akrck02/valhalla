import { ListenerSet } from "../../core/listenerset.js";
import {
  isMobile,
  isSmallDevice,
} from "../../lib/gtd-ts/web/responsivetools.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import Clock from "./clock.js";
import Searchbar from "./searchbar/searchbar.js";

export default class OsNavbar {
  private element: HTMLElement;
  private controlpanel: HTMLElement;
  private searchbar: Searchbar;
  private controls: UIComponent[];

  public constructor(listeners: ListenerSet) {
    this.element = document.getElementById("os-navbar");
    this.controlpanel = this.element.querySelector("div#control-panel");
    this.searchbar = new Searchbar(
      this.element.querySelector("#search"),
      listeners,
    );

    if (!isSmallDevice() && !isMobile()) {
      const clock = new Clock();
      this.element.querySelector("#status")?.appendChild(clock.element);
      clock.start();
    } else {
    }
  }

  public addToControls(component: UIComponent) {
    this.controlpanel.classList.remove("drag-region");
    this.controlpanel.appendChild(component.element);
    this.controls.push(component);
  }

  public clearControls() {
    this.controlpanel.innerHTML = "";
    this.controlpanel.classList.add("drag-region");
    this.controls = [];
  }

  public clickControl(option: number) {
    this.controls[option]?.element.click();
  }

  public hideSearchBar() {
    // this.searchbar.hide();
  }

  public showSearchBar() {
    // this.searchbar.show();
  }

  public focusSearchbar() {
    this.searchbar.focus();
  }

  public clearSearchbar() {
    this.searchbar.setValue("");
  }
}
