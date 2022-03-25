import { CHECK, EXPAND, EXPAND_LESS } from "../../../lib/gtd-ts/material/materialicons.js";
import { UIComponent, setEvents } from "../../../lib/gtd-ts/web/uicomponent.js";

export class DateSelector extends UIComponent {

    private current: Date;
    private open: boolean;
    private box: UIComponent;

    constructor(current, callback: (date: Date) => void) {
        super({
            type: "div",
            id: "date-selector",
            classes: ["box-column"],
        });

        this.box = new UIComponent({
            type: "div",
            classes: ["box-column"],
            styles: {
                width: "100%",
                maxWidth: "45rem"
            }

        });
        this.appendChild(this.box);
        
        this.open = false;
        this.current = current;
        this.update = callback;
    }

    public update: (date: Date) => void;

    /**
     * Draw the month selector with the given date
     */
    public draw() {
        this.box.clean();     

        // title bar 
        const bar = new UIComponent({
            type: "div",
            classes: ["box-row", "title-bar"],
            styles: {
                width: "100%",
            }
        });

        //draw the month name
        const lastMonth = new UIComponent({
            text: EXPAND({
                size: "1.5rem",
                fill: "var(--text-color)",
            }),
            styles: {
                padding: "0.15rem",
            },
            type: "div",
            classes: ["box-column", "box-center"],
            events: {
                click: () => {
                    this.current.setMonth(this.current.getMonth() - 1);
                    this.draw();
                }
            }
        });

        const nextMonth = new UIComponent({
            text: EXPAND_LESS({
                size: "1.5rem",
                fill: "var(--text-color)",
            }),
            styles: {
                padding: "0.15rem",
            },
            type: "div",
            classes: ["box-column", "box-center"],
            events: {
                click: () => {
                    this.current.setMonth(this.current.getMonth() + 1);
                    console.log("next month: ", this.current.getMonth() + 1);
                    
                    this.draw();
                }
            }
        });

        const monthName = new UIComponent({
            type: "div",
            classes: ["month-name","box-column","box-center"],
        });

        nextMonth.element.onclick = () => alert();

        monthName.appendChild(nextMonth);
        monthName.element.innerHTML += this.current.toLocaleString("default", { month: "long" });
        monthName.appendChild(lastMonth);

        bar.appendChild(monthName);

        //draw the year selector
        const lastYear = new UIComponent({
            text: EXPAND({
                size: "1.5rem",
                fill: "var(--text-color)",
            }),
            styles: {
                padding: "0.15rem",
            },
            type: "div",
            classes: ["box-column", "box-center"],
            events: {
                click: () => {
                    this.current.setFullYear(this.current.getFullYear() - 1);
                    this.draw();
                }
            }
        });

        const nextYear = new UIComponent({
            text: EXPAND_LESS({
                size: "1.5rem",
                fill: "var(--text-color)",
            }),
            styles: {
                padding: "0.15rem",
            },
            type: "div",
            classes: ["box-column", "box-center"],
            events: {
                click: () => {
                    this.current.setFullYear(this.current.getFullYear() + 1);
                    this.draw();
                }
            }
        });

        const yearName = new UIComponent({
            type: "div",
            classes: ["month-name","box-column","box-center"],
        });

        yearName.appendChild(nextYear);
        yearName.element.innerHTML += this.current.toLocaleString("default", { year: "numeric" });
        yearName.appendChild(lastYear);

        bar.appendChild(yearName);
        this.box.appendChild(bar);

        //draw the days
        const rows = [];
        const year = this.current.getFullYear();
        const month = this.current.getMonth();

        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        let dayOfWeek = new Date(year, month + 1, 1).getDay() - 1;

        if (dayOfWeek == -1) {
            dayOfWeek = 7;
        }

        let row = new UIComponent({
            classes: ["week-days", "box-row", "box-x-start", "box-y-center"],
        });


        let realday = 1;
        if(dayOfWeek != 7)
            for (let i = 0; i < dayOfWeek; i++) {
                const day = new UIComponent({
                    type: "button",
                    text: "",
                    classes: ["day","empty"],
                    attributes: {
                        disabled : "true"
                    }
                })

                row.appendChild(day);
                rows.push(row);
                this.box.appendChild(row);
            }

        for (let i = dayOfWeek; i < lastDayOfMonth + dayOfWeek; i++) {

            if ((i + 7) % 7 == 0) {
                row = new UIComponent({
                    classes: ["week-days", "box-row", "box-x-start", "box-y-center"],
                });
                this.box.appendChild(row);
                rows.push(row);
            }

            
            //if year is this year and month is this month and day is today
            const today = this.current;
            const isToday = today.getFullYear() == year && today.getMonth() == month && realday == today.getDate();
            
            const day = new UIComponent({
                type: "button",
                text: "" + (realday),
                classes: isToday? ["day","today"] : ["day"],
            })

            setEvents(day.element, {
                click:
                () => {
                    this.current.setDate(parseInt(day.text));
                    this.draw();
                }
            })

            row.appendChild(day);
            realday++;

        }

        let index = lastDayOfMonth + dayOfWeek;
        while (index % 7 != 0) {
            const day = new UIComponent({
                type: "button",
                text: "",
                classes: ["day","empty"],
                attributes : {
                    disabled : "true"
                }
            })

            row.appendChild(day);
            this.box.appendChild(row);
            index++;
        }   


        const buttonBar = new UIComponent({
            type: "div"
        });

        const accept = new UIComponent({
            type : "button",
            id: "accept",
            text : CHECK({size: "1.2rem", fill: "#fff"}) +"&nbsp;Accept"
        });

        accept.element.onclick = () => this.update(this.current);
        buttonBar.appendChild(accept);
        this.box.appendChild(buttonBar);
    }


     /**
     * Toggle the date selector visibility
     */
        public show() {
            this.element.classList.add("visible");
            setTimeout(() => {
                this.element.classList.add("open");
            }, 1);
        }



        public hide() {
            this.open = false;
            this.element.classList.remove("visible");
            this.element.classList.remove("open");
        }

}