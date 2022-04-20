import { APP, App } from "../../app.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
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
            text : "Notes:",
            classes : ["box-x-between", "box-y-center", "box-row"],
        });

        const toolbar = new UIComponent({
            type : "div",
            id : "toolbar",
            classes : ["box-row"],
        });
        title.appendChild(toolbar);

        const addNote = getMaterialIcon("plus",{size: "1.25rem", fill: "#fff"})
        addNote.element.classList.add("icon-button");

        addNote.element.addEventListener("click", () => {
            APP.router.modal.setContent(new NewNoteModal());
            APP.router.modal.show();
        });


        toolbar.appendChild(addNote);

        this.appendChild(title);

        const noteContainer = new UIComponent({
            type : "div",
            classes : ["box-row","box-warp"],
            id: "note-container",
        });

        const notes = await this.core.getUserNotes();
    
        notes.forEach(note => {
            
            const stickyNote = new UIComponent({
                type: "div",
                classes: ["sticky-note"],
                styles: {
                    transform : "rotate(" + (-2.5 + Math.random() * 5) + "deg) translateY(2rem)",
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

            stickyNote.appendChild(noteTitle);
            stickyNote.appendChild(noteContent);
            noteContainer.appendChild(stickyNote);

            setTimeout(() => noteContainer.element.style.opacity = "1", 100);
            this.appendChild(noteContainer);
        });
    }
     

}