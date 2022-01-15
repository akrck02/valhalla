
export class TableSet {

    static async createTables(db : any) {
   
        await TableSet.createUserTable(db);
        await TableSet.createTaskTable(db);
        await TableSet.createUserTaskTable(db);

    }

    static async createUserTable(db : any) {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS user (
                username TEXT PRIMARY KEY,
                password TEXT,
                email TEXT,
                oauth TEXT,
                picture TEXT
            )`
        )

    }

    static async createTaskTable(db : any) {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS task (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author TEXT,
                name TEXT,
                description TEXT,
                start TEXT, 
                end TEXT,
                allDay INTEGER, 
                done INTEGER
            )`
        );
    }

    static async createUserTaskTable(db : any) {

        await db.exec(
            `CREATE TABLE IF NOT EXISTS task_label (
                taskId INTEGER ,
                label TEXT
            )`
        );
    }

}