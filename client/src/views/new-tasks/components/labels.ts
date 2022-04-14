import { App } from "../../../app.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import NewTaskCore from "../newTaskView.core.js";
import EditableLabel from "./editableLabel.js";
import Label from "./label.js";

export default class LabelContainer extends UIComponent {

    private labels : UIComponent[];
    private core : NewTaskCore;
    private moreButton : UIComponent;

    public constructor(core : NewTaskCore) {
        super({
            classes: ["box-row","box-warp"],
            id: "tag-container",
        }); 

        this.moreButton = this.createMoreButton();
        this.labels = [];
        this.core = core;
        this.onchange(() => {});
    }

    /**
     * Add a non editable label to the label container
     * @param label The label to add
     * @param callback The click function
     * @returns The UIComponent of the label
     */
    public addLabel(label : string, callback : (labels) => void) : UIComponent {

        const labelButton  = new Label(label);
        labelButton.element.addEventListener("click", () => {
            this.removeLabel(label);
            callback(this.labels);
        });

        this.removeChild(this.moreButton);
        this.labels.push(labelButton);

        this.showLabels();
        this.appendChild(this.moreButton);
        this.update();

        return labelButton;
    }   

    /**
     * Add an editable label to the label container
     * @param label The label to add
     * @param placeholder  The placeholder of the label
     * @param callback The click function once edited
     * @returns The UIComponent of the label
     */
    public addEditLabel(label : string, placeholder : string) : UIComponent {
       
        const labelButton  = new EditableLabel(label,placeholder);
        labelButton.onBlur(() => {

            if(this.isLabelRepeated(labelButton.getLabel())){

                alert({
                    message: 'That tag is registered.',
                    icon: 'block'
                });

                this.removeLabel(labelButton.getLabel());               
            }
            this.update()
        
        },lbl => this.removeLabel(lbl));

        this.removeChild(this.moreButton);  
        this.labels.push(labelButton);
        this.showLabels();
        
        this.appendChild(this.moreButton);
        labelButton.element.focus();

        this.update();

        return labelButton;
    }

    /**
     * Show all the available labels
     */
    private showLabels() {
        this.labels.forEach(label => {
            this.appendChild(label);
        });
    }
   
    /**
     * Create a button to add editable labels
     * @returns The button UIComponent
     */
    private createMoreButton() : UIComponent {
        const moreButton = new UIComponent({
            type : "button",
            id: "new-tag",
            text : getMaterialIcon("plus",{ fill: "#fff", size: "1rem" }).toHTML() 
        });

        moreButton.element.addEventListener("click", () => {
            this.addEditLabel("", App.getBundle().newTask.NEW_LABEL);
        });

        return moreButton;
    }

    /**
     * Remove a label from the container
     * @param label The label to remove
     */
    public removeLabel(label : string) {
        const matchingLabel = this.labels.find(lbl =>lbl.element.innerText.toUpperCase() === label.toUpperCase());

        if(matchingLabel){
            this.labels.splice(this.labels.indexOf(matchingLabel), 1);        
            this.removeChild(matchingLabel);
            this.core.removeTag(label);

            this.update();
        }

    }
 
    /**
     * Get if the container contains a given label two or more times
     * @param label The label to search for
     * @returns true or false;
     */
    public isLabelRepeated(label : string) : boolean {
        const labels = this.labels.filter(lbl => lbl.element.innerText.toUpperCase() === label.toUpperCase());
        return labels.length > 1 ;
    }


    /**
     * Get if the container contains a given label
     * @param label The label to search for
     * @returns true or false;
     */
    public containsLabel(label : string) : boolean {
        const matchingLabel = this.getLabelComponent(label)
        return matchingLabel !== undefined;
    }
    
    /**
     * Gey the matching label component
     * @param label The label to search for
     * @returns The label UICOmponent
     */
    public getLabelComponent(label : string) : UIComponent {
        const matchingLabel = this.labels.find(lbl =>lbl.element.innerText === label);
        return matchingLabel;
    }

    /**
     * Get the current labels
     * @returns the label string array
     */
    public getLabels() : string[] {
        const lbls = [];
        this.labels.forEach(l => lbls.push(l.element.innerText));
        return lbls;
    }

    // Change dinamic function 
    public update;
    
    /**
     * Setting the funvtion to call when the task list updates 
     * @param callback The callback function 
     */
    public onchange (callback : (labels : string[]) => void) {
        this.update = () => {
            this.core.getTask().labels = this.getLabels();
            callback(this.getLabels());
        }
    }

}