import path from "path";

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
//const server = require("./server.js");

//Redeclaring the Nodejs global variable object
const global = {
  root: ''
}; 
global.root = path.resolve(__dirname + "/../../");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    //frame: false,
    backgroundColor: "#fafafa",
    webPreferences: {
      //enableRemoteModule: true,
      //nodeIntegration: true,
      contextIsolation: false,  
    },
  });

  // and load the index.html of the app.
  const url = path.join(global.root, "/web/index.html");
  mainWindow.loadURL(url);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
}

/* Start */
app.whenReady().then(() => {
  createWindow();
  /* Create windows */
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});