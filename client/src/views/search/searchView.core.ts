import { Configurations } from "../../config/config.js";
import { StringUtils } from "../../core/data/integrity/string.js";
import { ITask } from "../../core/data/interfaces/task.js";
import { taskService } from "../../services/tasks.js";

export default class SearchCore {


    constructor() {
       
    }


    getTasks(search : string = '', callback : (json) => void) {
        const response  = taskService.searchUserTasksByName(Configurations.getUserName(), search);
    
        response.success(tasks => {
            callback(tasks);
        });
    
        return response.json();
    }

    getCategories(search : string = '', callback : (json) => void) {
        const response  = taskService.searchUserTaskCategoriesByName(Configurations.getUserName(), search);

        response.success(categories => {
            callback(categories);
        });

        return response.json();
    }


    static orderTasksByLevenshteinDistance(text: string, words: ITask[]): ITask[] {
        words = words.sort((a, b) => {
            const distA = StringUtils.levenshteinDistance(text, a.name);
            const distB = StringUtils.levenshteinDistance(text, b.name);
            return distA - distB;
        });
        return words;
    }

    static orderCategoriesByLevenshteinDistance(text: string, words: {[key: string] : string}[]): ITask[] {
        words = words.sort((a, b) => {
            const distA = StringUtils.levenshteinDistance(text, a.label);
            const distB = StringUtils.levenshteinDistance(text, b.label);
            return distA - distB;
        });
        return words;
    }

}