import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";


export interface NotificationProperties {
    title ?: string,
    message ?: string,
    icon ?: string,
    desktop ?: boolean
}

export default class UINotification extends UIComponent {

    private bar : UIComponent;
    private content : UIComponent;

    public constructor() {
        super({
            type: "notification",
            classes: ["box-column"],
            styles : {
                position: "fixed",
                bottom : "-5rem",
                right : "1rem",
                width : "20rem",
                maxHeight: "7rem",
                background : "rgba(0,0,0,.75)",
                borderRadius: ".35rem",
                transition: ".5s",
                padding: "1.5rem",
                opacity : "0"
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
            }
        });

        this.appendChild(this.bar);
        this.appendChild(this.content);
    }


    public show() {

        setStyles(this.element,{
            bottom : "-5rem",
            opacity: "0",
            transition : "none"
        })

        setTimeout(() => {
            setStyles(this.element, {
                bottom: "1rem",
                opacity: "1",
                transition: ".5s",
            })
        }, 1);


        setTimeout(() => {
            setStyles(this.element, {
                bottom: "-5rem",
                opacity: "0"
            })
    
        }, 2000);
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