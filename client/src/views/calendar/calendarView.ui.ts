import { time } from "console";
import { App, APP } from "../../app.js";
import { Selector } from "../../components/os/selector.js";
import { Configurations } from "../../config/config.js";
import { DateText } from "../../core/data/dateText.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import CalendarCore from "./calendarView.core.js";

export default class CalendarView extends UIComponent {

    private core : CalendarCore;
    private calendarContainer : UIComponent;
    private currentMonth : Date;
    private configurations : Configurations;

    public constructor() {
        super({
            type: "view",
            classes: ["box-column","backdrop"],
            styles: {
                width: "100%",
                height: "100%",
                overflowY: "hidden"
            },

        });

        this.core = new CalendarCore(this);

        this.setCalendarOsBarControls();
        this.calendarContainer = new UIComponent({
            type: "div",
            id: "calendar-container",
            classes: ["box-row"],
        });
    }

    /**
     * Show the calendar view
     * @param params the parameters
     * @param container the container to append the view
     * @param config the app configuration
     */
    public show(params: string[], container: UIComponent, config: Configurations): void {

        this.configurations = config;
        this.currentMonth = new Date();
        this.createCalendar(new Date());
        this.appendChild(this.calendarContainer);
        this.appendTo(container);
        

        setTimeout(() => {
            this.calendarContainer.element.style.opacity = "1";
        }, 100);

    }

    /**
     * Create the calendar for the given month
     * @param current the current month
     */
    private async createCalendar(current: Date) {

        this.currentMonth = current;
        const tasks = await this.core.getMonthTasks();        

        this.calendarContainer.clean();
        const calendarWrapper = new UIComponent({
            type: "div",
            id: "calendar-wrapper",
            classes: ["box-column"],
            styles: {
                width: "100%",
                height: "100%",
            }
        });

        const year = current.getFullYear();
        const month = current.getMonth();

        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        let dayOfWeek = new Date(year, month + 1, 1).getDay() - 1;

        if (dayOfWeek == -1) {
            dayOfWeek = 7;
        }

        APP.router.variablePanel.addViewVariables({
            "LAST_DAY": lastDayOfMonth,
            "DAY_WEEK": dayOfWeek,
            "MONTH": DateText.month(month),
            "TODAY": current.toISOString(),
        });

        const rows = [];
        const title = new UIComponent({
            type: "h1",
            id: "title",
            text: DateText.month(month) + " " + year,
            styles: {
                padding: "0 0 2rem 0"
            }
        });

        const calendar = new UIComponent({
            type: "div",
            id: "calendar",
            classes: ["box-column"],
            styles: {

            }
        });

        let row = new UIComponent({
            classes: ["calendar-row", "box-row", "box-x-start", "box-y-center"],
        });


        let realday = 1;
        if(dayOfWeek != 7)
            for (let i = 0; i < dayOfWeek; i++) {
                const day = new UIComponent({
                    text: "",
                    classes: ["day","empty"]
                })

                row.appendChild(day);
                rows.push(row);
                calendar.appendChild(row);
            }

        for (let i = dayOfWeek; i < lastDayOfMonth + dayOfWeek; i++) {

            if ((i + 7) % 7 == 0) {
                row = new UIComponent({
                    classes: ["calendar-row", "box-row", "box-x-start", "box-y-center"],
                });
                calendar.appendChild(row);
                rows.push(row);
            }

            
            //if year is this year and month is this month and day is today
            const today = new Date();
            const isToday = today.getFullYear() == year && today.getMonth() == month && realday == today.getDate();

            const day = new UIComponent({
                classes: isToday? ["day","today"] : ["day"],
                styles: {
                    overflow: "hidden",
                }
            })

            const dayText = new UIComponent({
                text: "" + (realday),
                styles: {
                    marginBottom : ".5rem"
                }
            });

            dayText.appendTo(day);

            const events = tasks[(year + "-" + (month + 1) + "-" + realday)];
            
            if(events) {
                events.forEach(event => {
                    const eventbox = new UIComponent({
                        type: "p",
                        text:  event.name,
                        styles: {
                            fontSize : ".75rem",
                            opacity: ".75",
                            borderLeft : ".15rem solid rgba(255,255,255,.75)" ,
                            marginBottom : ".2rem",
                            marginLeft : "-.35rem",
                            paddingLeft : ".25rem",
                            overflow: "hidden",
                            whiteSpace : "nowrap",
                            textOverflow : "ellipsis"
                        }
                    });
                   eventbox.appendTo(day);
                });

            }

            row.appendChild(day);
            realday++;

        }

        let index = lastDayOfMonth + dayOfWeek;
        while (index % 7 != 0) {
            const day = new UIComponent({
                text: "",
                classes: ["day","empty"]
            })

            row.appendChild(day);
            calendar.appendChild(row);
            index++;
        }   

        calendarWrapper.appendChild(title);
        calendarWrapper.appendChild(calendar);
        this.calendarContainer.appendChild(calendarWrapper);
      
      
        const more = new UIComponent({
            type: "div",
            id: "calendar-more",
            classes: ["box-column", "box-x-start", "box-y-center"],
            styles: {
                padding: "2rem 3rem",
                overflowY: "auto"
            }
        })

        for (const date in tasks) {
            const element = tasks[date];
                
            const title = new UIComponent({
                type: "h1",
                text : getMaterialIcon("calendar_today",{
                    size: "1.5rem",
                    fill: "#ffffffe0"
                }).toHTML() + " &nbsp;&nbsp;&nbsp;" + date,
                classes : ["box-row", "box-y-center"],
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
            title.appendTo(more);

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
                })
                event.appendTo(more);
            })

            
        }


        this.calendarContainer.appendChild(more);
        
        


        let even = true;
        rows.forEach((row) =>{
            even = !even;

            let time = even ? 100 : 200;
            time += Math.random() * 50;

            setTimeout(() => {
                row.element.classList.add("visible");
            }, time);
        });
    }

    public calculateDifference(difference : number) : number{
        difference = difference * Math.random();

        if (difference < 0) {
            difference = 0;
        }

        return difference;
    }

    /**
     * Set the calendar controls on the OS bar
     * 
     * - Calendar mode selector
     * - Year selector
     * - Month selector
     */
    private setCalendarOsBarControls() {

        const calendarView = this;
        const monthSelector = new Selector(App.getBundle().calendar.MONTH, this);
        for (let i = 0; i < 12; i++) {
           monthSelector.addOptionFull(
               DateText.month(i), 
               i + "", 
               (month) => {
                   calendarView.createCalendar(new Date(calendarView.currentMonth.getFullYear(), month, 1));
                }
            );
        }
        monthSelector.setSelected(0 + "");
        
        const yearSelector = new Selector(App.getBundle().calendar.YEAR, this);
        for (let i = new Date().getFullYear() + 1 ; i >= new Date().getFullYear() - 10; i--) {
            yearSelector.addOption(
               i + "", 
               (year) => {                 
                    calendarView.createCalendar(new Date(year, calendarView.currentMonth.getMonth(), 1));
                }
            );
        }
        yearSelector.setSelected(new Date().getFullYear() + "");

        const modeSelector = new Selector(App.getBundle().calendar.MODE, this);
        modeSelector.addOption( App.getBundle().calendar.MONTH, (year) => {});
        modeSelector.addOption( App.getBundle().calendar.WEEK, (year) => {});
        modeSelector.addOption( App.getBundle().calendar.DAY, (year) => {});
      //  modeSelector.setSelected(App.getBundle().calendar.YEAR);
        

        APP.router.osNavbar.addToControls(modeSelector);
        APP.router.osNavbar.addToControls(monthSelector);
        APP.router.osNavbar.addToControls(yearSelector);
    
    }


    getCurrentMonth() : Date {
        return this.currentMonth;
    }

    getConfigurations() : Configurations {
        return this.configurations;
    } 
}
