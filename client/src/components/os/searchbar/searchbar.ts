import { App, APP } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { CommandHandler } from "../../../core/commands/command.js";
import { ListenerSet } from "../../../core/listenerset.js";
import { setEvents, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";
import { taskService } from "../../../services/tasks.js";
import { SearchModal } from "./searchmodal.js";


enum SEARCHBAR_MODE {
    SEARCH,
    COMMAND,
} 

export default class Searchbar extends UIComponent {

    private input : HTMLInputElement;
    private tagContainer : HTMLElement;
    private mode : SEARCHBAR_MODE;
    private handler : CommandHandler;
    private modal : SearchModal;

    public constructor(bar : HTMLElement, listeners : ListenerSet) {
        super({})
        this.element = bar;
        this.input = this.element.querySelector("input#search-input");
        this.tagContainer = this.element.querySelector("span#search-tag");
        this.mode = SEARCHBAR_MODE.SEARCH;
        this.handler = new CommandHandler(listeners);
        this.modal = new SearchModal();
        this.input.placeholder = App.getBundle().os.SEARCHBAR_PLACEHOLDER;
        this.appendChild(this.modal);-

        setEvents(this.input,{
            keydown: () => {
                this.modal.clean(); 
            },
            keyup: async (event) => {

                if (event.key === "Backspace" && this.input.value.trim().length == 0) {
                    this.removeTag();
                    this.modal.noResults();
                    this.mode = SEARCHBAR_MODE.SEARCH;
                    return
                }

                if(this.input.value.substring(0,3) === ">cm"){
                    this.setTag("CM");
                    this.setValue("");
                    this.mode = SEARCHBAR_MODE.COMMAND;
                    return;
                }              
                    
                this.search();

                const value = this.input.value;
                if (event.key === "Enter"){
                   
                    switch (this.mode) {
                        case SEARCHBAR_MODE.COMMAND:
                            this.handler.handle(value);
                            break;
                        default:
                            break;
                    }

                    this.mode = SEARCHBAR_MODE.SEARCH;
                    this.removeTag();
                    this.setValue("");
                }
            },
            click: () => {
                if (this.input.value.trim().length != 0) 
                    this.modal.show();
            },
            blur: () => {
                this.modal.hide();
            }
        })
        
        
    }


    public async search() {
        const value = this.input.value;

        if(value.trim() == "") {
            this.modal.hide();
            return
        }

        const response = await taskService.searchUserTasksByName(Configurations.getUserName(), value);

        response.success(tasks => {
            console.log(tasks);
            this.modal.setTasks( this.input.value.length == 0 ? [] : tasks);
            this.modal.update();
        });

        response.json();
    } 


    public hide(){
        this.element.style.opacity = "0"; 
        this.element.style.display = "none"; 
    }

    public show(){
        this.element.style.display = "flex"; 
        setTimeout(() => {
            this.element.style.opacity = "1"; 
        }, 100);
    }


    public focus() {
        this.input.focus();
    }

    public setValue(value : string){
        this.input.value = value;
    }

    public setTag(tag : string){
        this.tagContainer.classList.add("visible"); 
        this.tagContainer.innerHTML = tag; 
    }

    public removeTag(){
        this.tagContainer.classList.remove("visible"); 
        setTimeout(() => {
            this.tagContainer.innerHTML = ""; 
        }, 100);
        
    }



}