import { TableSet } from "./tables";

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Inserter } from "./insert";
import { homedir } from "os";

import fs from "fs";

export class Database {
  public db: any;

  public constructor() {}

  /**
   * Create database
   */
  async createDB(): Promise<void> {
    const deleteOld = false;
    if (deleteOld) {
      fs.rmSync(`${homedir()}/valhalla/db/Valhalla-user.db`);
    }

    await open({
      filename: `${homedir()}/valhalla/db/Valhalla-user.db`,
      driver: sqlite3.Database,
    }).then(async (db) => {
      this.db = db;
      await TableSet.createTables(db);
    });
  }

  /**
   * Close the database connection
   */
  closeDB() {
    this.db.close((err: Error) => {});
  }
}
