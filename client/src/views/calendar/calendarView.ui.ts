import { App, APP } from "../../app.js";
import { Selector } from "../../components/os/selector.js";
import { Configurations } from "../../config/config.js";
import { DateText } from "../../core/data/integrity/dateText.js";
import { UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import CalendarCore from "./calendarView.core.js";
import { Calendar } from "./components/calendar.js";
import { Timeline } from "./components/timeline.js";

export default class CalendarView extends UIComponent {

    private core: CalendarCore;
    private calendarContainer: UIComponent;
    private currentMonth: Date;

    public constructor() {
        super({
            type: "view",
            classes: ["box-column", "backdrop"],
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
    public show(params: string[], container: UIComponent): void {

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

        // CALENDAR
        this.calendarContainer.clean();
        const calendar = new Calendar();
        calendar.draw(this.currentMonth, tasks);
        this.calendarContainer.appendChild(calendar);

        // TIMELINE
        const timeline = new Timeline();
        timeline.draw(tasks);
        this.calendarContainer.appendChild(timeline);
    }

    public calculateDifference(difference: number): number {
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
        for (let i = new Date().getFullYear() + 1; i >= new Date().getFullYear() - 10; i--) {
            yearSelector.addOption(
                i + "",
                (year) => {
                    calendarView.createCalendar(new Date(year, calendarView.currentMonth.getMonth(), 1));
                }
            );
        }
        yearSelector.setSelected(new Date().getFullYear() + "");

        const modeSelector = new Selector(App.getBundle().calendar.MODE, this);
        modeSelector.addOption(App.getBundle().calendar.MONTH, (year) => { });
        modeSelector.addOption(App.getBundle().calendar.WEEK, (year) => { });
        modeSelector.addOption(App.getBundle().calendar.DAY, (year) => { });
        //  modeSelector.setSelected(App.getBundle().calendar.YEAR);

        APP.router.osNavbar.addToControls(modeSelector);
        APP.router.osNavbar.addToControls(monthSelector);
        APP.router.osNavbar.addToControls(yearSelector);

    }


    getCurrentMonth(): Date {
        return this.currentMonth;
    }

}
