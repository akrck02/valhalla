import { Configurations } from "../../config/config.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class Modal extends UIComponent {

    private showing : boolean;
    private blackScreen : UIComponent;

    public constructor() {
        super({
            type: "div",
            id: "modal",
            styles : {
                position : "fixed",
                top :  "50%",
                left : "50%",
                transform : "translate(-50%, -50%)",
                minWidth: "20rem",
                minHeight: "8rem",
                display : "none",
                opacity : "0",
                transition:  "opacity var(--fast), backdrop-filter var(--fast)",
                zIndex: "1000",                
            }
        });

        this.blackScreen = new UIComponent({
            type: "div",
            id: "modal-blackscreen",
        });

        this.element.onkeydown = (e) => {

            if(e.key === 'Escape'){
                this.hide();
            }

        }

        this.blackScreen.appendTo(document.body);
        this.showing = false;
    }


    public setContent(content : UIComponent) {
        this.clean();
        this.appendChild(content);
    }

    public show() {
        this.showing = true;
        this.blackScreen.element.style.display = "block";
        this.element.style.display = "block";


        setTimeout(() => {
            this.blackScreen.element.style.opacity = "1";
            this.element.style.opacity = "1"
            this.element.focus();

            let focusableElement = this.element.querySelector("input");
            if(!focusableElement) {
                this.element.querySelector("textarea")?.focus();
            } else {
                focusableElement.focus();
            }

            

        }, 250);

    }

    public hide() {
        this.showing = false;
        
        this.element.style.opacity = "0"
        this.blackScreen.element.style.opacity = "0";

        setTimeout(() =>  {
            this.element.style.display = "none"
            this.blackScreen.element.style.display = "none";
        }, 250);
    }

    public toggle() {
        if(this.showing){
            this.hide();
            return;
        }

        this.show();
    }


}