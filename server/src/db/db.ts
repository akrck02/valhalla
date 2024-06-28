import { TableSet } from "./tables";

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Inserter } from "./insert";
import { homedir } from "os";


export class Database {
    public db : any;

    public constructor() {    
    }

    /**
     * Create database
     */
    async createDB() : Promise<void> {
        this.log("Creating database...");
        await open({
            filename: `${homedir()}/valhalla/db/Valhalla-user.db`,
            driver: sqlite3.Database
        })
        .then(async (db) => {
            this.db = db;
            this.log("created.");

            db.on('trace', (data :string) => {
                if(data.indexOf("error") > -1)
                    this.log("[SQLITE]", data);
            })

            this.log("Creating tables...");
            await TableSet.createTables(db);
            this.log("Tables created.");

            //this.log("Inserting data...");
            //await Inserter.insert(db);
            //this.log("Data inserted.");
            this.log("Connected to the in-memory SQLite database.");
        })
    };

    /**
     * Close the database connection
     */
    closeDB() {
        this.db.close((err: Error) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log("Close the database connection.");
        });
    }

    /**
     * Log a message as database
     * @param mgs 
     */
    log(...mgs: any[]) {
        console.log(["Database"], mgs);
    }

}