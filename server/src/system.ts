import { env } from "process";

export function getLang() : string  {
    const  env1 = env || process.env;
    return env1.LC_ALL || env1.LC_MESSAGES || env1.LANG || env1.LANGUAGE || "en";    
}

export function getVersionParameters(){
    const fs = require("fs");
    
    const versionFile = fs.readFileSync("./version.json", "utf8");
    const versionJson = JSON.parse(versionFile);
    return versionJson;
}


export enum ENVIRONMENT {
    DEVELOPMENT = "development",
    PRODUCTION = "production"
}