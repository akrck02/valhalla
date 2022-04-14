import { config } from "process";
import { APP, App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setEvents, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export class SideModal extends UIComponent {

    private opened : boolean;
    private title : UIComponent;
    private icon : UIComponent;
    private description : UIComponent;
    private action : UIComponent;

    public constructor() {
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

        this.icon = getMaterialIcon("cloud_off", {size : "1.5rem",fill: "#fff"});

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

        if(Configurations.getOAuth() !== "#"){
            this.onlineMode();
        } else {
            this.offlineMode();
        }
    }

    public offlineMode() {

        this.title.element.innerHTML = App.getBundle().sync.YOUR_ACCOUNT_IS_OFFLINE;
        this.icon.element.innerHTML = getMaterialIcon("cloud_off", {size : "1.5rem",fill: "#fff"}).element.innerHTML;

        this.description.element.innerHTML = App.getBundle().sync.OFFLINE_EXPLANATION;
        this.action.element.innerHTML = App.getBundle().sync.SYNC;
        this.action.element.onclick = () => {
            alert({ 
                message : App.getBundle().system.NOT_IMPLEMENTED_YET,
                icon : 'info'
            });
        }
    }


    public onlineMode() {

        this.title.element.innerHTML = App.getBundle().sync.YOUR_ACCOUNT_IS_ONLINE;
        this.icon.element.outerHTML = getMaterialIcon("cloud", {size : "1.5rem",fill: "#fff"}).element.innerHTML;

        this.description.element.innerHTML = App.getBundle().sync.ONLINE_EXPLANATION;
        this.action.element.innerHTML = App.getBundle().sync.LOGOUT;
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