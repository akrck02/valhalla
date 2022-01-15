import { TimeUtils } from "../utils/time";
import { ITask } from "./classes/task";
import { IUser } from "./classes/user";

export class Inserter {
    
    static async insert(db : any) {
        try {
            
        await Inserter.insertUser(db, {
            username: "akrck02",
            password: "1234",
            email: "akrck02@gmail.com",
            picture: "akrck02.png"
        });

        await Inserter.insertTask(db, {
            author: 'akrck02', 
            name : 'Start Valhalla development on electron', 
            description: 'Valhalla is a modern productivity web app!',
            start: TimeUtils.now(),
            end : TimeUtils.now(),
            allDay: 1,
            done: 0
        });

        await Inserter.insertTask(db, {
            author: 'akrck02', 
            name : 'Get Task manager working', 
            description: 'Too much typescript',
            start: TimeUtils.now(),
            end : TimeUtils.now(),
            allDay: 1,
            done: 0
        });

        await Inserter.insertTask(db, {
            author: 'akrck02', 
            name : 'API update for Valhalla', 
            description: ':\')',
            start: TimeUtils.now(),
            end : TimeUtils.now(),
            allDay: 1,
            done: 0
        });

        await Inserter.insertTaskLabel(db, 1, 'Development');
        await Inserter.insertTaskLabel(db, 2, 'Development');
        await Inserter.insertTaskLabel(db, 3, 'Today');

        let date = new Date();

        for (let i = 0; i < 20; i++) {
            await Inserter.insertTask(db, {
                author: 'akrck02', 
                name : 'API update for Valhalla', 
                description: ':\')',
                start: TimeUtils.print(date),
                end : TimeUtils.print(date),
                allDay: 1,
                done: Math.random() > 0.5 ? 1 : 0
            });
            await Inserter.insertTaskLabel(db, i, 'Test');

            //add a random amount of days to the date
            date.setDate(date.getDate() + i);
        }

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