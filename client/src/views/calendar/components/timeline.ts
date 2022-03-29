import { APP, App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { DateText } from "../../../core/data/integrity/dateText.js";
import { UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export class Timeline extends UIComponent {

    constructor() {
        super({
            type: "div",
            id: "calendar-more",
            classes: ["box-column", "box-x-start", "box-y-center"],
            styles: {
                padding: "2rem 3rem",
                overflowY: "auto"
            }
        })
    }

    public draw(tasks : any) {

        const moreTitle = new UIComponent({
            type: "h1" ,
            text: " ~ " + App.getBundle().calendar.YOUR_EVENTS + " ~ ",
            classes : ["box-row", "box-y-center"],
        });
        moreTitle.appendTo(this);

        for (const date in tasks) {
            const element = tasks[date];
            const currDate = new Date(date);    

            const title = new UIComponent({
                type: "h1",
                text : DateText.weekDay(currDate.getDay()) +  `<span>${currDate.getDate()}</span> `,
                classes : ["box-row", "box-y-center","box-x-between"],
                styles : {
                    textAlign: "left",
                    width: "100%",     
                    fontSize : "1.25rem",
                    marginTop: "1rem",
                    padding: "1rem 1.5rem",
                    color: "rgba(255,255,255, .75)",
                    borderBottom: ".05rem solid rgba(255,255,255, .15)"
                }
            });
            title.appendTo(this);

            element.forEach(e => {
                const event = new UIComponent({
                    type: "p",
                    text: e.name,
                    styles : {
                        textAlign: "left",
                        width: "100%",     
                        marginTop: ".5rem",
                        padding: ".5rem 1.5rem",
                        color: "rgba(255,255,255, .75)",
                    }
                    ,events: {
                        click : () =>{
                            location.href = Configurations.VIEWS.TASKS + "" + e.id;
                        }
                    }
                })
                event.appendTo(this);
            })
        }
    }
}