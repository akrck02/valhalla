import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { sleep } from "../../lib/gtd-ts/sync/timetools.js";
import { setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";


export interface NotificationProperties {
    title ?: string,
    message ?: string,
    icon ?: string,
    desktop ?: boolean,
    time ?: number
}

export default class UINotification extends UIComponent {

    private bar : UIComponent;
    private content : UIComponent;
    private showing : boolean;


    public constructor() {
        super({
            type: "notification",
            classes: ["box-column"],
            styles : {
                position: "fixed",
                bottom : "-5rem",
                right : "1rem",
                width : "20rem",
               // maxHeight: "7rem",
                height: "fit-content",
                background : "rgba(0,0,0,.75)",
                borderRadius: ".35rem",
                transition: ".5s",
                padding: "1.5rem",
                opacity : "0",
                zIndex: "1000",
            }
        })

        this.bar = new UIComponent({
            styles:{
                marginBottom: ".5rem"
            }
        });
        this.content = new UIComponent({
            classes: ["box-row", "box-y-center", "box-x-between"],
            styles:{
                wordBreak : "break-word"
            }
        });

        this.showing = false;
        this.appendChild(this.bar);
        this.appendChild(this.content);
    }


    public async show(seconds : number = 1) {

        if(this.showing)
        return;

        setTimeout(() => {
            setStyles(this.element, {
                bottom: "1rem",
                opacity: "1",
                transition: ".5s",
            })
        }, 1);

        this.showing = true;

        setTimeout(() => {
            setStyles(this.element, {
                bottom: "-5rem",
                opacity: "0"
            })
    

            this.showing = false;
        }, 1000 + seconds * 1000);
    }


    public setContent(properties : NotificationProperties) {
        this.bar.clean();
        this.content.clean();

        if(properties.title) {
            this.bar.element.style.display = "flex";
            const title = new UIComponent({
                type : "h1",
                text : properties.title,
                styles: {
                    fontSize : "1.25rem"
                }
            })

            this.bar.appendChild(title);
        } else { 
            this.bar.element.style.display = "none";
        }

        if(properties.message){
            const text = new UIComponent({
                type: "span",
                text : properties.message
            });

            this.content.appendChild(text);
        }

        if(properties.icon) {
            const icon = getMaterialIcon(properties.icon,{size: "1.25rem" , fill: "white"});
            this.content.appendChild(icon);
        }

    }
}