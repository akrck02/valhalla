import { APP } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { DateText } from "../../core/data/dateText.js";
import { isLargeDevice, isMediumDevice } from "../../lib/gtd-ts/web/responsivetools.js";
import { setEvents, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";

export default class CalendarV extends UIComponent {

    private calendarContainer: UIComponent;

    private currentMonth: Date;

    public constructor() {
        super({
            type: "view",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },

        });

        this.setCalendarOsBarControls();

        this.calendarContainer = new UIComponent({
            type: "div",
            id: "calendar-container",
            classes: ["box-row", "backdrop"],
        });
    }



    public show(params: string[], container: UIComponent, config: Configurations): void {

        this.createCalendar(new Date());
        this.appendChild(this.calendarContainer);
        this.appendTo(container);

        setTimeout(() => {
            this.calendarContainer.element.style.opacity = "1";
        }, 100);

    }

    private createCalendar(today: Date) {

        this.currentMonth = today;
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

        const year = today.getFullYear();
        const month = today.getMonth();

        const lastDayOfMonth = new Date(year, month-1, 0).getDate();
        let dayOfWeek = new Date(year, month, 1).getDay() - 1;

        if (dayOfWeek == -1) {
            dayOfWeek = 7;
        }

        APP.router.terminal.addViewVariables({
            "LAST_DAY": lastDayOfMonth,
            "DAY_WEEK": dayOfWeek,
            "MONTH": DateText.month(month),
            "TODAY": today.toISOString(),
        });


        const title = new UIComponent({
            type: "h1",
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

        let timer = 100;
        let difference = 100;
        let realday = 1;

        if(dayOfWeek != 7)
        for (let i = 0; i < dayOfWeek; i++) {
            const day = new UIComponent({
                text: "",
                classes: ["day","empty"]
            })

            this.showDayDiv(day, timer);
            timer += difference;
            difference = this.calculateDifference(difference);

            row.appendChild(day);
            calendar.appendChild(row);
        }

        for (let i = dayOfWeek; i < lastDayOfMonth + dayOfWeek; i++) {

            if ((i + 7) % 7 == 0) {
                row = new UIComponent({
                    classes: ["calendar-row", "box-row", "box-x-start", "box-y-center"],
                });
                calendar.appendChild(row);
            }

            
            //if year is this year and month is this month and day is today
            const isToday = today.getFullYear() == year && today.getMonth() == month && realday == today.getDate();

            const day = new UIComponent({
                text: "" + (realday),
                classes: isToday? ["day","today"] : ["day"],
            })

            row.appendChild(day);

            this.showDayDiv(day, timer);
            timer += difference;
            difference = this.calculateDifference(difference);

            realday++;

        }

        let index = lastDayOfMonth + dayOfWeek;
        while (index % 7 != 0) {
            const day = new UIComponent({
                text: "",
                classes: ["day","empty"]
            })

            this.showDayDiv(day, timer);
            timer += difference;
            difference = this.calculateDifference(difference);

            row.appendChild(day);
            calendar.appendChild(row);
            index++;
        }   

        calendarWrapper.appendChild(title);
        calendarWrapper.appendChild(calendar);
        this.calendarContainer.appendChild(calendarWrapper);


        this.calendarContainer.appendChild(new UIComponent({
            type: "div",
            id: "calendar-more",
            classes: ["box-row", "box-x-center", "box-y-center"],
        }));
    }

    public calculateDifference(difference : number) : number{
        difference -= 5 * Math.random();

        if (difference < 0) {
            difference = 0;
        }

        return difference;
    }

    private showDayDiv( day : UIComponent, timer : number) {
        setTimeout(() => {
            day.element.style.opacity = "1";
        }, timer);
    }

    private setCalendarOsBarControls() {

        const calendarView = this;
        const button = new UIComponent({
            type: "button",
            id: "calendar-prev-month",
            text: "Previous",
            styles: {
                borderRadius: "50rem",
                padding: "0.25rem 1rem",
            }
        });

        APP.router.osNavbar.addToControls(button);

        setEvents(button.element , {
            "click" : () => {
                calendarView.createCalendar(new Date(calendarView.currentMonth.getFullYear(), calendarView.currentMonth.getMonth() - 1, 1));
            }
        });


    }
}
