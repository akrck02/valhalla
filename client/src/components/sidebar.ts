import { CALENDAR_TODAY, GROUP, SPOKE, TASK_ALT, TUNE } from "../lib/material/materialicons.js";
import { UIComponent } from "../lib/web/uicomponent.js";

export class Sidebar extends UIComponent {

    private elements : UIComponent[];

    public constructor() {
        super({
            type: "div",
            id: "sidebar",
            classes: ["box-column","box-y-center"],
        });
        this.build();
    }

    public build() {

        const calendar = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: CALENDAR_TODAY({
                size: "1.25rem",
                fill: "#404040",
            }),
            attributes: {
                href: "#/calendar/",
            },
        });

        const tasks = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: TASK_ALT({
                size: "1.25rem",
                fill: "#404040",
            }),
            attributes: {
                href: "#/tasks/",
            },
        });

        const teams = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: GROUP({
                size: "1.25rem",
                fill: "#404040",
            }),
            attributes: {
                href: "#/teams/",
            },
        });

        const projects = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: SPOKE({
                size: "1.25rem",
                fill: "#404040",
            }),
            attributes: {
                href: "#/projects/",
            },
        });

        const configuration = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: TUNE({
                size: "1.25rem",
                fill: "#404040",
            }),
            attributes: {
                href: "#/configuration/",
            },
        });

        this.elements = [tasks, calendar, teams, projects, configuration];

        this.elements.forEach((element) => {
            this.appendChild(element);
        });

    }

    public setSelected(index: number) {
        this.elements.forEach(element => {
            element.element.classList.remove("selected");
        });
        this.elements[index].element.classList.add("selected");
    }


    public show(): void {

    };

}