import { setEvents, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class MinimalInput extends UIComponent {

    private placeholder : string; 

    constructor(text : string, placeholder : string, textarea : boolean = false) {

        super({
            type: textarea? "textarea" : "input",
            text: text,
            attributes:{
                value: text,
                placeholder: placeholder
            },
            classes : ["minimal-input"],
            styles : {
                backdropFilter : "none",
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
            "keydown" : () => {
                this.element.classList.remove("empty");
            },
            "keyup" : () => {

                const value = (this.element as HTMLInputElement).value;

                if(value.length == 0){
                    this.element.classList.add("empty");
                } else {
                    this.element.classList.remove("empty");
                }

                this.text = value;

                callback(this.text);
            }
        })


    }


}