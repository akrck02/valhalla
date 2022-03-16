import { resolveModuleName } from "../../../../../node_modules/typescript/lib/typescript.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

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

        this.appendChild(this.input);


        this.selector = new UIComponent({
            type: "div",
            id: "date-selector",
        });

        this.appendChild(this.selector)

        this.drawMonth(new Date());

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

    /**
     * Draw the month selector with the given date
     * @param current The month to draw
     */
    private drawMonth(current: Date) {

        //draw the month name
        const monthName = new UIComponent({
            type: "div",
            classes: ["month-name","box-row","box-center"],
            text: current.toLocaleString("default", { month: "long" })
        });

        this.selector.appendChild(monthName);

        //draw the days
        const rows = [];
        const year = current.getFullYear();
        const month = current.getMonth();

        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        let dayOfWeek = new Date(year, month + 1, 1).getDay() - 1;

        if (dayOfWeek == -1) {
            dayOfWeek = 7;
        }

        let row = new UIComponent({
            classes: ["week-days", "box-row", "box-x-start", "box-y-center"],
        });


        let realday = 1;
        if(dayOfWeek != 7)
            for (let i = 0; i < dayOfWeek; i++) {
                const day = new UIComponent({
                    text: "",
                    classes: ["day","empty"]
                })

                row.appendChild(day);
                rows.push(row);
                this.selector.appendChild(row);
            }

        for (let i = dayOfWeek; i < lastDayOfMonth + dayOfWeek; i++) {

            if ((i + 7) % 7 == 0) {
                row = new UIComponent({
                    classes: ["week-days", "box-row", "box-x-start", "box-y-center"],
                });
                this.selector.appendChild(row);
                rows.push(row);
            }

            
            //if year is this year and month is this month and day is today
            const today = new Date();
            const isToday = today.getFullYear() == year && today.getMonth() == month && realday == today.getDate();

            const day = new UIComponent({
                text: "" + (realday),
                classes: isToday? ["day","today"] : ["day"],
            })

            row.appendChild(day);
            realday++;

        }

        let index = lastDayOfMonth + dayOfWeek;
        while (index % 7 != 0) {
            const day = new UIComponent({
                text: "",
                classes: ["day","empty"]
            })

            row.appendChild(day);
            this.selector.appendChild(row);
            index++;
        }   


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