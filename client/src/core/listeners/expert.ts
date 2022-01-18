import { APP } from "../../app.js";

export class ExpertListener {

    public constructor() {
    }

    public toggleVariablePanel(): void {
        APP.configurations.toggleVariablePanel();
    }

    public search(): void {
        APP.router.osNavbar.focusSearchbar();
        APP.router.osNavbar.clearSearchbar();
    }

    public clickControl(option: number): void {
        APP.router.osNavbar.clickControl(option);
    }



}