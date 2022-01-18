import { config } from "process";
import { Configurations } from "../../config/config.js";
import { CLOUD, CLOUD_OFF } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export class SideModal extends UIComponent {

    private opened : boolean;
    private title : UIComponent;
    private icon : UIComponent;
    private description : UIComponent;
    private action : UIComponent;

    public constructor(configurations : Configurations) {
        super({
            type: "div",
            id: "sidebar-modal",
            classes : ["backdrop"],
            styles : {
            }
        })

        const titleRow = new UIComponent({
            classes : ["box-row","box-y-center"]
        });

        this.title = new UIComponent({
            type: "h1",
            text: "",
            styles : {
                fontSize : "1rem",
                width: "100%"
            }
        });

        this.icon = new UIComponent({
            type: "div",
            text : CLOUD_OFF({
                size : "1.5rem",
                fill: "#fff"
            })
        });

        this.description = new UIComponent({
            type: "p",
            text: "",
            styles : {
                fontSize : ".7rem",
                padding: ".5rem 0"
            }
        })

        this.action =  this.action = new UIComponent({
            type : "button",
            text : "Sync",
            styles : {
                background : "rgba(255,255,255,.1)",
                margin: ".5rem .0rem",
            }
        });

        titleRow.appendChild(this.title);
        titleRow.appendChild(this.icon);

        this.appendChild(titleRow);
        this.appendChild(this.description);
        this.appendChild(this.action);
        this.opened = false;

        if(configurations.USER.OAUTH !== "#"){
            this.onlineMode();
        } else {
            this.offlineMode();
        }
    }

    public offlineMode() {

        this.title.element.innerHTML = "Your account is offline";
        this.icon.element.innerHTML = CLOUD_OFF({
            size : "1.5rem",
            fill: "#fff"
        });

        this.description.element.innerHTML = "Your data is only accesible from this computer";
        this.action.element.innerHTML = "Sync";
    }


    public onlineMode() {

        this.title.element.innerHTML = "Your account is online";
        this.icon.element.innerHTML = CLOUD({
            size : "1.5rem",
            fill: "#fff"
        });

        this.description.element.innerHTML = "Your data is synced with your devices";
        this.action.element.innerHTML = "Logout";
    }



    public open() : void {
        this.element.classList.add("visible");
        setTimeout(() =>  this.element.classList.add("show"), 100);
       
        this.opened = true;
    }

    public close() : void {
        this.element.classList.remove("show");
        setTimeout(() => this.element.classList.remove("visible"), 100);
        this.opened = false;
    }

    public isOpened() : boolean {
        return this.opened;
    }
    
}