import { APP } from "../../app.js";

export class ExpertListener {

    public constructor() {
    }

    public toggleTerminal(): void {
        APP.configurations.toggleTerminal();
    }

    public search(): void {
        APP.router.searchbar.focus();
        (APP.router.searchbar as HTMLInputElement).value = "";
    }



}