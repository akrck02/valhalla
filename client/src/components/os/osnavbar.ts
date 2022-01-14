import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class OsNavbar {

    private element : HTMLElement;
    private controlpanel : HTMLElement;
    private searchbar : HTMLInputElement;

    public constructor() {
        this.element = document.getElementById("os-navbar");
        this.controlpanel = this.element.querySelector("div#control-panel");
        this.searchbar = this.element.querySelector("input#search-input");
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
        this.searchbar.value = "";
    }


}