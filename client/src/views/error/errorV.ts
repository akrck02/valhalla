import { Configurations } from "../../config/config.js";
import { ERRORS } from "../../config/errors.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class ErrorV extends UIComponent{

    public constructor() {
        super({
            type: "view",
            classes: ["box-column","box-center","backdrop"],
            styles: {
                padding: "2rem",
                width: "100%",
                height: "100%",
            },
        });
    }

    public show(params : string[], container : UIComponent): void {
        let error = ERRORS[params[0]]; 
        if(!error) 
            error = ERRORS[404];
        
        const image = new UIComponent({
            type: "img",
            attributes: {
                src: Configurations.PATHS.IMAGES + "cat.png",
            },
            styles: {
                width: "20rem",
                margin: "1rem 0",
                borderBottom: ".2rem solid rgba(255,255,255,0.1)",
                height: "auto",
                opacity: "0",
                transition: "opacity .5s",
            },
        });
           

        const title = new UIComponent({
            type: "h1",
            text: error.friendly,
            styles: {   
                transition : "opacity 1s",
                opacity: "0",
            }
        });

        this.appendChild(image);
        this.appendChild(title);
        this.appendTo(container);

        setTimeout(() => {
            title.element.style.opacity = "1";
            image.element.style.opacity = "1";
        }, 100);
    };
} 