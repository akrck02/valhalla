import { APP } from "../app.js";
import { Configurations } from "../config/config.js";
import { CALENDAR_TODAY, GROUP, SPOKE, TASK_ALT, TERMINAL, TUNE } from "../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../lib/gtd-ts/web/uicomponent.js";

export class Sidebar extends UIComponent {

    private buttonBar : UIComponent;
    private userImage : UIComponent;
    private elements : UIComponent[];

    public constructor(configurations : Configurations) {
        super({
            type: "div",
            id: "sidebar",
            classes: ["box-column","box-y-center"],
        });

        this.buttonBar = new UIComponent({
            type: "div",
            styles: {
                height: "calc(100% - 2.5rem)"
            }
            
        });

        this.userImage = new UIComponent({
            type: "img",
            attributes : {
                src: configurations.PATHS.ICONS + "/default-user.png"
            },
            styles: {
                width: "1.7rem",
                height: "1.7rem",
                borderRadius: "20rem"
            }
        });


        this.build(configurations);
        this.appendChild(this.buttonBar);
        this.appendChild(this.userImage);
    }

    public build(configurations : Configurations) {
        const tasks = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: TASK_ALT({
                size: "1.25rem",
                fill: "#404040",
            }),
            attributes: {
                href: configurations.VIEWS.TASKS,
            },
        });

        const calendar = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: CALENDAR_TODAY({
                size: "1.25rem",
                fill: "#404040",
            }),
            attributes: {
                href: configurations.VIEWS.CALENDAR,
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
                href: configurations.VIEWS.TEAMS,
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
                href: configurations.VIEWS.PROJECTS + "s",
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
                href: configurations.VIEWS.CONFIGURATION,
            },
        });

        this.elements = [tasks, calendar, teams, projects, configuration];

        if(configurations.getConfigVariable("GANDALF")){
            const hiddenTerminal = new UIComponent({
                type: "a",
                classes: ["sidebar-item","box-center"],
                text: TERMINAL({
                    size: "1.25rem",
                    fill: "#404040",
                }),
                attributes: {
                    href: configurations.VIEWS.TERMINAL,
                },
            });

            this.elements.push(hiddenTerminal);
        }

        this.elements.forEach((element) => {
            this.buttonBar.appendChild(element);
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