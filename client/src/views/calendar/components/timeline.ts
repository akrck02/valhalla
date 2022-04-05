import { APP, App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { DateText } from "../../../core/data/integrity/dateText.js";
import { getMaterialIcon } from "../../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export class Timeline extends UIComponent {

    constructor() {
        super({
            type: "div",
            id: "calendar-more",
            classes: ["box-column", "box-x-start", "box-y-center"],
        })
    }

    public draw(tasks : any) {

        const moreTitle = new UIComponent({
            type: "h1" ,
            id: "calendar-more-title",
            text: App.getBundle().calendar.YOUR_EVENTS,
            classes : ["box-row", "box-y-center"],
        });
        moreTitle.appendTo(this);

        const events = new UIComponent({
            type: "div",
            classes : ["box-column", "box-y-center"],
            styles: {
                height: "100%",
                width: "100%",
                padding: "0rem 3rem 2rem 3rem",
                overflowY: "auto"
            }
        });

        if(Object.keys(tasks).length < 1) {
            const noEvents = new UIComponent({
                type: "p",
                id: "no-events",
                text: App.getBundle().calendar.NO_EVENTS,
                classes : ["box-row", "box-y-center","box-x-center"],
            });
            noEvents.appendTo(events);
        }
        

        for (const date in tasks) {
            const element = tasks[date];
            const currDate = new Date(date);    

            const title = new UIComponent({
                type: "h1",
                text : DateText.weekDay(currDate.getDay()) + " " + currDate.getDate() +  `<span>${element.length}</span> `,
                classes : ["day","box-row", "box-y-center","box-x-between"],
            });
            title.appendTo(events);

 
            element.forEach(e => {
 
                let text = e.name; 
                
                if(e.done == "1") {
                    text += getMaterialIcon("check" , {
                        size: "1rem",
                        fill: "#fff"
                    }).toHTML(); 
                }

                const event = new UIComponent({
                    type: "p",
                    text: text,
                    classes: ["event", "box-row", "box-x-between"],
                    events: {
                        click : () =>{
                            location.href = Configurations.VIEWS.TASKS + "" + e.id;
                        }
                    }
                })
                event.appendTo(events);
            })

           
        }
        events.appendTo(this);
    }
}