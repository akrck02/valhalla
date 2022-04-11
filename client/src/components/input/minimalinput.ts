import { setEvents, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class MinimalInput extends UIComponent {

    private placeholder : string; 

    constructor( type: string, text : string, placeholder : string ) {

        super({
            type: type || "div",
            text: text,
            classes : ["minimal-input"],
            attributes: {
                contentEditable : "true"
            }
        })

        this.element.style.setProperty( "--placeholder" , `'${placeholder}'`);

        if(!text || text.trim().length == 0){
            this.element.classList.add("empty");
        }

        this.placeholder = placeholder;
        this.text = text;
        this.onType(() => {});
    }




    public onType(callback : (text : string) => void) {

        setEvents(this.element,{
            "keyup" : (event) => {

                
                if(this.element.innerText.length == 0){
                    this.element.classList.add("empty");
                } else {
                    this.element.classList.remove("empty");
                }
                callback(this.text);

                
            }
        })


    }


}