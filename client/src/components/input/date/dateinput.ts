
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { DateSelector } from "./selector.js";

interface InputAttributes {
    default?: Date;
    editable?: boolean;
    id?: string;
}

export default class DateInput extends UIComponent {
    input: UIComponent;
    selector: UIComponent;
    open: boolean;

    constructor(attributes?: InputAttributes) {

        super({
            type: "div",
            classes: ["date-input"]
        });

        this.open = false;
        this.checkAttributes(attributes);
        this.input = new UIComponent({
            type: "input",
            id: attributes.id,
            attributes: {
                type: "text",
                value : this.toDateString(attributes.default),
            },
        });

        const dateIn = this;
        this.input.element.onclick = () => {
            dateIn.toogle();
        }

        if(!attributes.editable) {
            this.input.element.classList.add("no-editable");
            this.input.element.classList.add("no-copy");
            this.input.element.contentEditable = "false";
            this.input.element.addEventListener("keydown",
                (e) => {
                   e.preventDefault();  
                }
            );
        }

        this.selector = new DateSelector(this.update)
        this.appendChild(this.input);
        this.appendChild(this.selector)

    }

    /**
     * Check the attributes and set the default values
     * @param attributes The attributes to checks
     */
    private checkAttributes(attributes : InputAttributes) {

        if(!attributes) {
            attributes = {
                default: new Date(),
                editable: false
            };
        }


        if(!attributes.default) {
            attributes.default = new Date();
        }

        if(!attributes.editable) {
            attributes.editable = false;
        }

    }

    /**
     * Toggle the date selector visibility
     */
    private toogle() {
        this.open =! this.open;
        if(this.open){
            this.element.classList.add("visible");
            setTimeout(() => {
                this.element.classList.add("open");
            }, 1);
            
        } else {
            this.element.classList.remove("open");
        }
    }

    public update(date : Date) : void {
        (this.input.element as HTMLInputElement).value = this.toDateString(date);
    }


    /**
     * Convert a date to a string
     * TO DO : move to GTD-LIB
     * @param date 
     * @returns 
     */
    private toDateString(date: Date) : string {
        if(!date) {
           return;
        }
        
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const  year = date.getFullYear();

        const result = this.normalize(year,4)  + " / " + this.normalize(month,2) + " / " + this.normalize(day,2);
        return result;
    }

    /**
     * Normalize a number to a string with the given length
     * @param number The number to normalize
     * @param digits The length of the result
     * @returns The normalized number
     */
    private normalize( number:number , digits : number ) : string {
        
        let result = "";
        let missing = digits - (number + "").length; 

        for (let i = 0; i < missing; i++) {
            const character = [i];

            if(character)
                result += character;
            else 
                result += "0"
        }
        result += number;

        return result;
    }

}