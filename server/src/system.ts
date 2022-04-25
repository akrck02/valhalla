import path from "path";
import { env } from "process";

export function getLang() : string  {
    const  env1 = env || process.env;
    return env1.LC_ALL || env1.LC_MESSAGES || env1.LANG || env1.LANGUAGE || "en";    
}

export function getVersionParameters(){
    const fs = require("fs");
    
    const versionFile = fs.readFileSync(path.join(global.root,"version.json"), "utf8");
    const versionJson = JSON.parse(versionFile);
    return versionJson;
}


export enum ENVIRONMENT {
    DEVELOPMENT = "development",
    PRODUCTION = "production"
}

// Redeclaring the Nodejs global variable object
const global = {
    root: ''
  };
  global.root = path.resolve(__dirname + "/../../");
  