import { APP, App } from "../../app.js";
import Utils from "../../core/utils.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setClasses, setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { NoteService } from "../../services/notes.js";
import NewNoteModal from "./components/newNoteModal.js";
import NotesCore from "./notesView.core.js";

 
export default class NotesView extends UIComponent {

    private core : NotesCore;

    public constructor () {
        super({
            type : "view",
            id: "notes",
            classes : ["box-column"],
        })

        this.core = new NotesCore();
    }

    public async show(params : string[], container : UIComponent) {
        
        container.appendChild(this);

        const title = new UIComponent({
            type : "h1",
            id : "title",
            text : App.getBundle().notes.NOTES + ":",
            classes : ["box-x-between", "box-y-center", "box-row"],
        });

        const toolbar = new UIComponent({
            type : "div",
            id : "toolbar",
            classes : ["box-row"],
        });
        title.appendChild(toolbar);

        const addNote = getMaterialIcon("plus",{size: "1.5rem", fill: "#fff"})
        addNote.element.classList.add("icon-button");

        setStyles(addNote.element, {
            position: "absolute",
            bottom: "2.5rem",
            right: "2.5rem",
            padding: ".75rem",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "100rem",
            cursor: "pointer",

        })

        addNote.element.addEventListener("click", () => {
            APP.router.modal.setContent(new NewNoteModal());
            APP.router.modal.show();
        });


        this.appendChild(addNote);

        this.appendChild(title);

        const noteContainer = new UIComponent({
            type : "div",
            classes : ["box-row","box-warp", "note-container"],
        });

        const notes = await this.core.getUserNotes();
    
        notes.forEach(note => {
            
            const stickyNote = new UIComponent({
                type: "div",
                classes: ["sticky-note"],
                styles: {
                    transform : "rotate(" + (-2.5 + Math.random() * 5) + "deg) translateY(2rem)",
                },
                data : {
                    id : note.id
                }
            })

            const noteTitle = new UIComponent({
                type: "h1",
                classes: ["title"],
                text: note.title,
            })

            const noteContent = new UIComponent({
                type: "div",
                text: note.content,
                classes: ["content"],
            })

            const copy = getMaterialIcon("content_copy", {size: "1.25rem", fill: "#fff"});
            setClasses(copy.element,["icon-button"]);
            setStyles(copy.element, {right: "1rem"})
            copy.element.addEventListener("click", () => Utils.copyToClipboard(note.content));

            const deleteNote = getMaterialIcon("delete", {size: "1.25rem", fill: "#fff"});
            setClasses(deleteNote.element,["icon-button"]);
            setStyles(deleteNote.element, {right: "3rem"})
            deleteNote.element.addEventListener("click", () => this.core.deleteUserNote(note.id));


            stickyNote.appendChild(noteTitle);
            stickyNote.appendChild(noteContent);
            stickyNote.appendChild(copy);
            stickyNote.appendChild(deleteNote);

            noteContainer.appendChild(stickyNote);
            

            setTimeout(() => noteContainer.element.style.opacity = "1", 100);
            this.appendChild(noteContainer);
        });
    }
     

}