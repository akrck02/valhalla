import { taskService } from "../../services/tasks.js";
import CalendarView from "./calendarView.ui.js";

export default class CalendarCore {

    private view : CalendarView;

    constructor(view : CalendarView){
        this.view = view;        
    }

    /**
     * 
     * @returns 
     */
    async getMonthTasks() : Promise<any>{

        let result = {};

        const response = taskService
        .getUserMonthTasks(
            this.view.getConfigurations().USER.USERNAME,
            this.view.getCurrentMonth().getMonth() +1,
            this.view.getCurrentMonth().getFullYear()
        ).success(json => (result = json));
        
        await response.jsonPromise();
        return new Promise((resolve) => {resolve(result)});;
    }


}