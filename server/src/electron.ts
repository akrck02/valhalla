import path from "path";
import { API } from "./db/api";
import fs from "fs";
import { Database } from "./db/db";
import { ENVIRONMENT, getVersionParameters } from "./system";

// Modules to control application life and create native browser window
const { app, webFrame, BrowserWindow, ipcMain } = require("electron");

export class ElectronApp {

  private database?: Database;
  private api?: API;

  public constructor() {

  }

  public async start() {
    await this.startServer();
    await this.setEvents();
    await this.startIpcEventListeners();
  }

  public async startServer(){
    this.title();
    await this.startDatabase();
    await this.startAPI();
  }

  public title() {
    console.info("###############################################################################");
    console.info("                     VALHALLA by @Akrck02 - Coffee version                     ");
    console.info("###############################################################################");
    console.info(" ");
  }

  public async startDatabase() {

    fs.mkdirSync(path.join("db"), { recursive: true });

    this.database = new Database();
    const databasePath = path.join(global.root, "db/Valhalla-user.db");
    if (fs.existsSync(databasePath) === true) {
      console.log("Electron", "Database found");
      //fs.rmSync(databasePath);
      //console.log("Electron", "Database deleted.");
      await this.database.createDB();    
    }
    else await this.database.createDB();


  }

  public startAPI() {

      if(this.database){      
        this.api = new API(this.database);
        this.api.start();
      } else throw new Error("[DB-API] Database not initialized, exiting...");
  }

  public startIpcEventListeners(){

    // ipc events 
    ipcMain.on('minimize', (event : any) => {
      const webContents = event.sender
      const win = BrowserWindow.fromWebContents(webContents)
      win.minimize()
    })

    ipcMain.on('maximize', (event : any) => {
      const webContents = event.sender
      const win = BrowserWindow.fromWebContents(webContents)
      win.maximize()
    });

    ipcMain.on('close', (event : any) => {
      const webContents = event.sender
      const win = BrowserWindow.fromWebContents(webContents)
      win.close()
    });
  }

  public loadUI() {

    // Create the browser window.
    const mainWindow = new BrowserWindow({
      minWidth: 1280 / 2,
      minHeight: 720 / 2,
      height: 1080,
      width: 1920, 
      frame: false,
      show: false,
      backgroundColor: "#fafafa",
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        enableRemoteModule: true,
        nodeIntegration: true,
        contextIsolation: true,
      },
    });

    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
    mainWindow.webContents.on("new-window", function(event :Event, url: string) {
      event.preventDefault();
      // shell.openExternal("https://"  );
      console.log("Electron", "Opening external link: " + url);      
    });



    // get the version parameters 
    const versionParameters = getVersionParameters();
    console.log("VERSION", versionParameters.VERSION);
    console.log("ENVIRONMENT", versionParameters.ENVIRONMENT);
    
    let indexFile = "index.html";
    let loadingFile = "loading.html";

    if (versionParameters.ENVIRONMENT == ENVIRONMENT.PRODUCTION) {
      indexFile = "index-prod.html";
      loadingFile = "loading-prod.html";
    } 
    // and load the index.html of the app.
    const url = path.join(global.root, "/web/" + indexFile);
    mainWindow.loadFile(url);
    console.log("Electron", "Opening HTML: " + url);

    let loading = new BrowserWindow({
      show: false, 
      frame: false,
      width: 1280,
      height: 720,
    });
    
    mainWindow.webContents.once('dom-ready', () => {

        setTimeout(() => {
          mainWindow.center()
          mainWindow.show()
    
          loading.hide();
          loading.close();
        }, 500);

    })

    loading.loadFile(path.join(global.root,'/web/' + loadingFile));
    loading.show()
  }

  public setEvents() {

    app.whenReady().then(() => {

      this.loadUI();
      const electronApp = this; 

      /* Create windows */
      app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0)
          electronApp.loadUI();
      });

    }); 

    app.on("window-all-closed", function () {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

  }

}

// Redeclaring the Nodejs global variable object
const global = {
  root: ''
};
global.root = path.resolve(__dirname + "/../../");

// Overriding the default console.log function
console.log = (...msg) => {
  console.info("[" + msg[0] + "] " + msg.slice(1));
}

