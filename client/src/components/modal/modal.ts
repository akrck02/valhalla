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
                boxShadow: "rgb(0 0 0 / 4%) 0px 0.1rem 1rem",
                
            }
        });

        this.blackScreen = new UIComponent({
            type: "div",
            id: "modal-blackscreen",
            styles: {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,.55)",
                display: "none",
                opacity: "0",
                transition: "opacity var(--medium)",
                zIndex: "1",
                backdropFilter : "blur(.3rem)"
            }
        });

        this.element.onkeydown = (e) => {

            if(e.key === 'Escape'){
                this.hide();
            }

        }

        this.blackScreen.appendTo(document.getElementById("view-container"));
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