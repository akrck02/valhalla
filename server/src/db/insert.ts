import { TimeUtils } from "../utils/time";
import { ITask } from "./classes/task";
import { IUser } from "./classes/user";

export class Inserter {
    
    static async insert(db : any) {
        try {
            
        await Inserter.insertUser(db, {
            username: "default",
            password: "1234",
            email: "defaultuser@nomail.com",
            picture: "default-user.png"
        });

        await Inserter.insertTask(db, {
            author: 'default', 
            name : 'Start using valhalla 😉', 
            description: 'Optimize your workflow with valhalla',
            start: TimeUtils.now(),
            end : TimeUtils.now(),
            allDay: 1,
            done: 0
        });

        await Inserter.insertTaskLabel(db, 1, 'Today');

        } catch (err) {
            console.log("Database", err);
        }
    }

    static async insertUser(db : any, user : IUser) {
        let sql = "INSERT INTO user (username, password, email, oauth, picture) VALUES (?, ?, ?, ?, ?)";
        await db.run(sql, user.username, user.password, user.email, user.picture);
    }

    static async insertTask(db : any, task : ITask) {
        let sql = "INSERT INTO task (author, name, description, start, end, allDay, done) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await db.run(sql, task.author, task.name, task.description, task.start, task.end, task.allDay, task.done);
    }

    static async insertTaskLabel(db : any, taskId: number, label: string) {
        let sql = "INSERT INTO task_label (taskId, label) VALUES (?, ?)";
        await db.run(sql, taskId, label);
    }


}