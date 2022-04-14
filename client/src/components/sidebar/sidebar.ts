import { APP } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { SideModal } from "./sidemodal.js";

export class Sidebar extends UIComponent {

    private buttonBar : UIComponent;
    private userImage : UIComponent;
    private modal : SideModal;
    private elements : UIComponent[];

    public constructor() {
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
                src: Configurations.PATHS.ICONS + "/default-user.png"
            },
            styles: {
                width: "1.7rem",
                height: "1.7rem",
                borderRadius: "20rem",
                cursor: "pointer",
            },
            events : {
                click : () => {
                    if(this.modal.isOpened()){
                        this.modal.close();
                    }
                    else{
                        this.modal.open();
                    }
                }
            }
        });


        this.modal = new SideModal();
        this.build();

        this.appendChild(this.buttonBar);
        this.appendChild(this.userImage);
        this.appendChild(this.modal);
    }

    public build() {
        const tasks = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("task_alt",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.TASKS,
            },
        });

        const calendar = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("calendar_today",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.CALENDAR,
            },
        });


        const teams = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("group",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.TEAMS,
            },
        });

        const projects = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("spoke",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.PROJECTS,
            },
        });

        const search = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("search",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.SEARCH,
            },
        });


        const configuration = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("tune",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.CONFIGURATION,
            },
        });

        const about = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("info",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.ABOUT,
            },
        });

        const viewer = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("article",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.VIEWER,
            },
        })

        const dummy = new UIComponent({
            type: "a",
            classes: ["sidebar-item","box-center"],
            text: getMaterialIcon("science",{
                size: "1.25rem",
                fill: "#404040",
            }).toHTML(),
            attributes: {
                href: Configurations.VIEWS.DUMMY,
            },
        });

        this.elements = [tasks, calendar, search, configuration, about];

        if(false && Configurations.getConfigVariable("GANDALF")){
            const hiddenTerminal = new UIComponent({
                type: "a",
                classes: ["sidebar-item","box-center"],
                text: getMaterialIcon("terminal",{
                    size: "1.25rem",
                    fill: "#404040",
                }).toHTML(),
                attributes: {
                    href: Configurations.VIEWS.TERMINAL,
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

        if(index > this.elements.length - 1){
            index = this.elements.length - 1;
        }

        this.elements[index].element.classList.add("selected");
    }

    public show(): void {

    };

}