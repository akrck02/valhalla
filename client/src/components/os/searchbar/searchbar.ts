import { CommandHandler } from "../../../core/commands/command.js";
import { ListenerSet } from "../../../core/listenerset.js";
import { setEvents, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";


enum SEARCHBAR_MODE {
    SEARCH,
    COMMAND,
} 

export default class Searchbar extends UIComponent {

    private input : HTMLInputElement;
    private tagContainer : HTMLElement;
    private mode : SEARCHBAR_MODE;

    private handler : CommandHandler;

    public constructor(bar : HTMLElement, listeners : ListenerSet) {
        super({})
        this.element = bar;
        this.input = this.element.querySelector("input#search-input");
        this.tagContainer = this.element.querySelector("span#search-tag");
        this.mode = SEARCHBAR_MODE.SEARCH;
        this.handler = new CommandHandler(listeners);

        setEvents(this.input,{
            keyup: (event) => {

                if (event.key === "Backspace" && this.input.value.length == 0) {
                    this.removeTag();
                    this.mode = SEARCHBAR_MODE.SEARCH;
                    return
                }

                if(this.input.value.substring(0,3) === ">cm"){
                    this.setTag("CM");
                    this.setValue("");
                    this.mode = SEARCHBAR_MODE.COMMAND;
                    return;
                }

                if (event.key === "Enter"){
                    const value = this.input.value;
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

            }
        })
        
        
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