import MaterialIcons from "../../lib/gtdf/resources/MaterialIcons.js";
import { UIComponent } from "../../lib/gtdf/components/uicomponent.js";

export interface NotificationProperties {
    title ?: string,
    message ?: string,
    icon ?: string,
    desktop ?: boolean,
    time ?: number
}

export default class NotificationUI extends UIComponent {

    private bar : UIComponent;
    private content : UIComponent;
    private showing : boolean;

    public constructor(){
        super({
            type: "notification",
            classes: ["box-column"],
        })

        this.bar = new UIComponent({
            id: "nt-bar",
        });
        
        this.content = new UIComponent({
            id:"nt-content",
            classes: ["box-row", "box-y-center", "box-x-between"],
        });

        this.showing = false;
        this.appendChild(this.bar);
        this.appendChild(this.content);
    }

    /**
     * Set the notification content 
     * @param properties The content to set with title, message and other properties
     */
    public setContent(properties : NotificationProperties) {
        this.bar.clean();
        this.content.clean();

        if(properties.title) {
            const title = new UIComponent({
                type : "h1",
                id: "nt-title",
                text : properties.title,
            })

            this.bar.element.classList.remove("hidden");
            this.bar.appendChild(title);
        } else { 
            this.bar.setClasses(["hidden"])
        }

        if(properties.message){
            const text = new UIComponent({
                type: "span",
                text : properties.message
            });

            this.content.appendChild(text);
        }

        if(properties.icon) {
            const icon = MaterialIcons.get(properties.icon,{size: "1.5em" , fill: "#404040"});
            this.content.appendChild(icon);
        }
    }

    public async show(seconds : number = 1) {

        if(this.showing)
            return;

        setTimeout(() => {
           this.setClasses(["show"])
        }, 1);

        this.showing = true;

        setTimeout(() => {
            this.element.classList.remove("show");
            this.showing = false;
        }, 1000 + seconds * 1000);
    }

    
}