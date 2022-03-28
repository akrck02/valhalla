import { taskService } from "../../services/tasks.js";
import AboutView from "./aboutView.ui";

export default class AboutCore {

    private view : AboutView;

    public constructor(view : AboutView) {
        this.view = view;
    }
    
}