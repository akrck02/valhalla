import { App, APP } from "../../../app.js";
import MinimalInput from "../../../components/input/minimalinput.js";
import { Configurations } from "../../../config/config.js";
import { INote } from "../../../core/data/interfaces/note.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import { setEvents, setStyles, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { NoteService } from "../../../services/notes.js";

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
            text: App.getBundle().notes.NEW_NOTE,
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

        const name = new MinimalInput("",App.getBundle().notes.WRITE_HERE_THE_NOTE_TITLE);
        setStyles(name.element,{
            marginBottom : "1rem",
            width: "100%",
            borderRadius: ".35rem",
            height: "auto",
            fontSize: "1rem",
        })

        const textarea = new MinimalInput("",App.getBundle().notes.ADD_YOUR_NOTE_HERE,true);
        setStyles(textarea.element,{
            marginBottom : "0.5rem",
            backdropFilter: "none",
            width: "100%",
            borderRadius: ".35rem",
            height: "10rem",
        })

        // Buttons
        const buttonBar = new UIComponent({
            type: "div",
            classes: ["box-x-between","box-y-center"],
        });

        // Save button
        const save = new UIComponent({
            type: "button",
            text: "Save",
            classes: ["box-center"],
            styles: {
                padding: ".75rem 1rem",
                background: "rgba(255,255,255,.05)",
                fontSize : ".9rem",
                marginLeft: "0rem",
            }
        }); 

        const saveIcon = getMaterialIcon("save",{
            size : "1rem",
            fill : "#fff",
        });

        setStyles(saveIcon.element,{
            marginLeft: ".5rem"
        });

        save.appendChild(saveIcon);

        setEvents(save.element, {
            click : () => {

                const note : INote = {
                    author: Configurations.getUserName(),
                    title: (name.element as HTMLInputElement).value || "",
                    content: (textarea.element as HTMLInputElement).value ||"",
                }

                if(note.content.trim() == "") {
                    alert({
                        icon: "block",
                        message: App.getBundle().notes.NOTE_CONTENT_MUST_NOT_BE_EMPTY
                    });
                    return 
                }

                const response = NoteService.insertUserNote(note);
                response.success((res) => {
                    if(res.status == "success"){
                        alert({
                            icon: "save",
                            message: App.getBundle().notes.NOTE_ADDED_SUCCESSFULLY
                        });
                    }
                });
                response.json();

                APP.router.modal.hide();
                App.redirect(Configurations.VIEWS.NOTES,[],true);
            }
        });

        setEvents(name.element,{
            keyup : (e) => {
                if(e.key == "Enter"){
                    save.element.click();
                }
            }
        });

        setEvents(textarea.element,{
            keyup : (e) => {
                if(e.key == "Enter"){
                    save.element.click();
                }
            }
        });

        // Cancel button
        const cancel = new UIComponent({
            type: "button",
            text: "Cancel",
            classes: ["box-center"],
            styles: {
                padding: ".75rem 1rem",
                boxShadow: "none",
                background: "rgba(255,255,255,.0)",
                fontSize : ".9rem",
                marginLeft: "0rem",
            }
        });

        setEvents(cancel.element, {
            click : () => {
                APP.router.modal.hide();
            }
        });
        

        const imageIcon = getMaterialIcon("image",{
            size : "1.25rem",
            fill : "#fff",
        });

        buttonBar.appendChild(cancel);
        buttonBar.appendChild(save);
      

        this.appendChild(title);
        this.appendChild(name);
        this.appendChild(textarea);
        this.appendChild(buttonBar);
        //this.appendChild(imageIcon);
    }

}