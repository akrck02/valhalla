import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import Label from "./label.js";

export default class EditableLabel extends Label{

    private placeholder : string;

    public constructor(label : string, placeholder : string = "") {
        super(label);
        this.placeholder = placeholder;
        this.element.contentEditable = "true";
        this.onclick = () => {};     
        this.element.onkeyup = (e) => {
            if(e.key == 'Enter'){
                this.element.blur();
            }
            
            this.setLabel(this.element.innerText);
        }   
    }

    public onBlur(update: (label: any) => void, clickAction: (label: any) => void): void {
        
        this.element.onblur = () => {
            this.element.contentEditable = "false";

            // If label is empty use placeholder
            if(this.getLabel().trim() == "") {
                this.setLabel(this.placeholder);
                this.element.innerText = this.getLabel();
            }

            this.element.onclick = () => {
                clickAction(this.getLabel());
            }

            update(this.getLabel());
        };

    }  







}