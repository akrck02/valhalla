import { UIComponent , setEvents } from "../../lib/gtd-ts/web/uicomponent.js";

export class Selector extends UIComponent {


    private menu : UIComponent;
    private options : UIComponent[];

    public constructor(text : string , parent : UIComponent) {
        super({
            type: "button",
            classes: ["selector"],
            text: text,
        });

        this.menu = new UIComponent({
            type: "div",
            id: "selector-menu"
        });

        parent.appendChild(this.menu);
        this.options = [];

        setEvents(this.element, {
            click : () => {
                document.querySelectorAll("#selector-menu")?.forEach(el => {
                    el = (el as HTMLElement)
                    el.classList.remove("open");
                    el.classList.remove("show");
                });

                this.menu.element.classList.add("open");
                setTimeout(() => {
                    this.menu.element.classList.add("show");
                }, 1);

                this.menu.element.scrollIntoView();
                
            }
        });
    }

    public addOption(option: string, callback : Function){
        this.addOptionFull(option, option, callback);
    }

    public addOptionFull(option: string, value: string , callback : Function){
    
        const optionComponent = new UIComponent({
            type: "button",
            classes: ["option"],
            text: option,
            data: {
                value : value
            } 
        });
       
        this.options.push(optionComponent);
        this.menu.appendChild(optionComponent);
        setEvents(optionComponent.element, {
            click : () => {
                this.setSelected(value);
                callback(value);
            }
        });

    }


    public getSelected(){ 

    }

    public setSelected(value : string) {
        this.options.forEach(option => {
            if(option.data.value == value){
                option.element.classList.add("selected");
            } else { 
                option.element.classList.remove("selected");
            }
        })
    }

}