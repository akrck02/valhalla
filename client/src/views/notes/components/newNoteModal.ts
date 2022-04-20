import MinimalInput from "../../../components/input/minimalinput.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import { setStyles, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export default class NewNoteModal extends UIComponent {

    public constructor(){
        super({
            type: "div",
            styles : {
                width : "30rem",
                
            }
        });

        const title = new UIComponent({
            type: "h1",
            text: "New Note",
            classes: ["box-x-between","box-y-center"],
            styles : {
                marginBottom : "1.5rem",
            }
        });

        const icon = getMaterialIcon("edit_note", {
            size: "1.5rem",
            fill: "#fff"
        });

        icon.appendTo(title);

        const name = new MinimalInput("h1","","Write here the note title");
        setStyles(name.element,{
            marginBottom : "1rem",
            width: "100%",
            borderRadius: ".35rem",
            height: "auto"
        })

        const textarea = new MinimalInput("p","","Add your note here");
        setStyles(textarea.element,{
            marginBottom : "0.5rem",
            backdropFilter: "none",
            width: "100%",
            borderRadius: ".35rem",
            height: "10rem",
        })

        const save = new UIComponent({
            type: "button",
            text: "Save",
            classes: ["box-center"],
            styles: {
                padding: "1rem 1.5rem",
                background: "rgba(255,255,255,.05)",
                fontSize : "1rem",
            }
        }); 

        const saveIcon = getMaterialIcon("save",{
            size : "1.25rem",
            fill : "#fff",
        });

        setStyles(saveIcon.element,{
            marginLeft: ".5rem"
        });

        save.appendChild(saveIcon);


        const imageIcon = getMaterialIcon("image",{
            size : "1.25rem",
            fill : "#fff",
        });


        this.appendChild(title);
        this.appendChild(name);
        this.appendChild(textarea);
        this.appendChild(save);
        this.appendChild(imageIcon);
    }

}