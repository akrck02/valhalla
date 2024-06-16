import { UIComponent } from "../../lib/gtdf/components/uicomponent.js";
import MaterialIcons from "../../lib/gtdf/resources/MaterialIcons.js";


export class Visualizer extends UIComponent {

    private static ID = "visualizer";
    private static BUTTON_CLOSE_ID = "close";
    private static BUTTON_BACK_ID = "back";
    private static BUTTON_NEXT_ID = "next";
    private static INFO_TEXT_ID = "info-text";

    private buttonClose : UIComponent;
    private buttonBack : UIComponent;
    private image : UIComponent;
    private buttonNext : UIComponent;
    private infoText : UIComponent;

    private list : string[];
    private index : number;

    constructor(){
        super({
            type: "div",
            id: Visualizer.ID,
            classes : ["box-row", "box-center"],
        });
        this.setEvents({
            click: (event) => {

                //if the click is not on the image, close the visualizer
                if(event.target != this.element){
                    return;
                }

                event.stopPropagation();
                this.close();
            }
        });

        this.buttonClose = MaterialIcons.get("close",{
            fill: "white",
            size: "48px",
        });

        this.buttonClose.setEvents({
            click: () => this.close()
        });

        this.buttonClose.setStyles({
            position: "absolute",
            top: "0px",
            right: "0px",
        });

        this.buttonBack = MaterialIcons.get("back",{
            fill: "white",
            size: "48px",
        });

        this.buttonBack.setEvents({
            click: () => this.showBack()
        });    

        this.image = new UIComponent({
            type: "img",
            attributes: { src: "" },
        });

        this.buttonNext = MaterialIcons.get("front",{
            fill: "white",
            size: "48px",
        });

        this.buttonNext.setEvents({
            click: () => this.showNext()
        });

        this.infoText = new UIComponent({
            type: "p",
            id: Visualizer.INFO_TEXT_ID,
            text: "Touch outside the image to close the visualizer.",            
            classes: ["info-text"],
        });

        this.buttonClose.element.id = Visualizer.BUTTON_CLOSE_ID;
        this.buttonBack.element.id = Visualizer.BUTTON_BACK_ID;
        this.buttonNext.element.id = Visualizer.BUTTON_NEXT_ID;

        this.buttonClose.appendTo(this);
        this.buttonBack.appendTo(this);
        this.image.appendTo(this);
        this.buttonNext.appendTo(this);
        this.infoText.appendTo(this);
    }


    public async show(image : string, list : string[]): Promise<void> {
        console.log(image);
        this.list = list;
        this.index = list.indexOf(image);

        this.element.style.display = "flex";

        if(this.index == 0){
            this.buttonBack.element.style.visibility = "hidden";
        }else{
            this.buttonBack.element.style.visibility = "visible";
        }

        if(this.index == list.length - 1){
            this.buttonNext.element.style.visibility = "hidden";  
        }else{
            this.buttonNext.element.style.visibility = "visible";
        }

        this.image.element.setAttribute("src", image);     
    }

    public showBack(){
        this.show(this.list[this.index - 1], this.list);
    }

    public showNext(){
        this.show(this.list[this.index + 1], this.list);
    }

    public close(){    
        this.element.style.display = "none";
    }

}