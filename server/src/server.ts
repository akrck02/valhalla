import path from "path";
import { API } from "./db/api";
import fs from "fs";
import { Database } from "./db/db";
import { homedir } from "os";
import PluginLoader from "./plugins/plugins";
import { log } from "console";

export class ValhallaServer {
  private database?: Database;
  private api?: API;

  public constructor() {}

  public async start() {
    log("Starting valhalla");
    await this.startDatabase();
    await this.startAPI();
    await this.startPlugins();
  }

  public async startDatabase() {

    log("Starting database...");
    fs.mkdirSync(`${homedir()}/valhalla/db`, { recursive: true });

    this.database = new Database();
    const databasePath = `${homedir()}/valhalla/db/Valhalla-user.db`;
    if (fs.existsSync(databasePath) === true) {
      await this.database.createDB();
    } else await this.database.createDB();
    log("Done.")
  }

  public startAPI() {
    if (this.database) {
      log("Starting API");
      this.api = new API(this.database);
      this.api.start();
      log("Done.")
    } else throw new Error("[DB-API] Database not initialized, exiting...");
  }

  public startPlugins() {
    if (!this.database)
      throw new Error("[PLUGINS] Database not initialized, exiting...");

    PluginLoader.load(this.database);
  }

}

// Redeclaring the Nodejs global variable object
const global = {
  root: "",
};
global.root = path.resolve(__dirname + "/../../");

const app = new ValhallaServer();
app.start();