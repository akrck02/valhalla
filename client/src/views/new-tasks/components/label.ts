import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export default class Label extends UIComponent{

    private label : string;

    public constructor(label : string) {
        super({
            type: "button",
            text: label,
            classes: ["task-label"],
        });

        this.label = label;
    }


    /**
     * Set on click event
     * @param callback The callback function
     */
    public onclick(callback : (label) => void) {
        this.element.addEventListener("click", () => {
            callback(this.element.textContent);
        });
    }


    public getLabel() : string {
        return this.label;
    }

    public setLabel(label : string) : void {
        this.label = label;
    }
}