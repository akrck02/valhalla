
import { threadId } from "worker_threads";
import { DateText } from "../../../core/data/dateText.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { DateSelector } from "./selector.js";

interface InputAttributes {
    default?: Date;
    editable?: boolean;
    id?: string;
    callback?: (date : Date) => void,
    parent: UIComponent
}

export default class DateInput extends UIComponent {
    private input: UIComponent;
    private selector: DateSelector;
    private open: boolean;
    private date : Date;
    private parent : UIComponent;
    public callback : (date : Date) => void;

    constructor(attributes?: InputAttributes) {

        super({
            type: "div",
            classes: ["date-input"]
        });

        this.open = false;
        this.checkAttributes(attributes);
        this.date = attributes.default;
        this.parent = attributes.parent;
        this.callback = attributes.callback;
        
        this.input = new UIComponent({
            type: "input",
            id: attributes.id,
            attributes: {
                type: "text",
                value : DateText.toLocalizedDateString(this.date),
            },
        });

        const dateIn = this;
        this.input.element.onclick = () => {
            dateIn.toogle();
            this.parent.clean();
            this.selector.hide();
            this.selector.draw();
            this.selector.appendTo(this.parent);
            this.selector.show();
        }

        if(!attributes.editable) {
            this.input.element.classList.add("no-editable");
            this.element.classList.add("no-copy");
            ;
            this.input.element.addEventListener("keydown",
                (e) => {
                    var charCode = e.which || e.keyCode;

                    if (charCode != 9 ) {
                        e.preventDefault();  
                    }
                }
            );
        }

        this.selector = new DateSelector(this.date,
            (date: Date) => {
                dateIn.callback(date)
            }
        );
        this.appendChild(this.input);
        this.appendChild(this.selector);

    }

    /**
     * Check the attributes and set the default values
     * @param attributes The attributes to checks
     */
    private checkAttributes(attributes : InputAttributes) {

        if(!attributes) {
            attributes = {
                default: new Date(),
                editable: false,
                parent: new UIComponent({})
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


    public getDate() : Date {
        return this.date;
    }

}