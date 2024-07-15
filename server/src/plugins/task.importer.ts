import { Task } from "../db/classes/task";
import { TaskStatus } from "../db/classes/task.status";
import { Database } from "../db/db";

import TaskModel from "../db/model/tasks"

const fs = require('node:fs');

export default class TaskImporter {

    static readonly JSON_PATH = 'resources/json/import.json';

    static load(database : Database){

        // fetch json 
        const data = fs.readFileSync(TaskImporter.JSON_PATH, 'utf8');
        const json = JSON.parse(data);
        

        // show every execution with yyyy-mm-dd hh:mm:ss format for start and end
        json.executions.forEach(async (e : any) => {

            // create a new task with the same name as the execution and the same start and end

            const importedTask = new Task({
                name: e.launcher.name,
                start: humanReadableDate(e.start),
                end: humanReadableDate(e.start),
                status: TaskStatus.TODO,
                author: "default",
                labels : [
                    "maintenance-schedules",
                ]
            });
        
            // save the task
            await TaskModel.insertUserTask(database, importedTask);
        });
        
        // show every execution with Monday yyyy/MM/dd dd hh:mm:ss format for start and end
        function humanReadableDate(str : string) {
        
            if (!str) return;
        
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            const date = new Date(str);
            const day = days[date.getDay()].substring(0,3);
            const month = toFixedNDigits(date.getMonth() + 1, 2);
            const year = toFixedNDigits(date.getFullYear(), 4);
            const dayOfMonth = toFixedNDigits(date.getDate(), 2);
            const hours = toFixedNDigits(date.getHours(), 2);
            const minutes = toFixedNDigits(date.getMinutes(), 2);
            const seconds = toFixedNDigits(date.getSeconds(), 2);    
        
            return `${year}-${month}-${dayOfMonth}`;
            
        }
        
        function toFixedNDigits(n : number, digits : number) {
            return n.toString().padStart(digits, '0');
        }

    }

}