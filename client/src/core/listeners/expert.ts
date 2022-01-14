import { APP } from "../../app.js";

export class ExpertListener {

    public constructor() {
    }

    public toggleTerminal(): void {
        APP.configurations.toggleTerminal();
    }

    public search(): void {
        APP.router.osNavbar.focusSearchbar();
        APP.router.osNavbar.clearSearchbar();
    }



}