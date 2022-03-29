import { APP } from "../../app.js";
import { Configurations } from "../../config/config.js";

export class ExpertListener {

    public constructor() {
    }

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

}