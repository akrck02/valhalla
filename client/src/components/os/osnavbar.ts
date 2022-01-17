import { ListenerSet } from "../../core/listenerset.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import Searchbar from "./searchbar/searchbar.js";

export default class OsNavbar {

    private element : HTMLElement;
    private controlpanel : HTMLElement;
    private searchbar : Searchbar;

    public constructor(listeners : ListenerSet) {
        this.element = document.getElementById("os-navbar");
        this.controlpanel = this.element.querySelector("div#control-panel");
        this.searchbar = new Searchbar(this.element.querySelector("#search"), listeners);
    }


    public addToControls(component : UIComponent) {
        this.controlpanel.classList.remove("drag-region");
        this.controlpanel.appendChild(component.element);
    }

    public clearControls() {
        this.controlpanel.innerHTML = "";
        this.controlpanel.classList.add("drag-region");
    }

    public focusSearchbar() {
        this.searchbar.focus();
    }

    public clearSearchbar() {
        this.searchbar.setValue("");
    }


}