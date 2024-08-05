const path = require("path");
const fs = require("fs");

// Redeclaring the Nodejs global variable object
global.root = path.resolve(__dirname + "/");

function main(env){

    console.log("\n--------------------------------------");
    console.log("     VALHALLA VERSION MANAGER ");
    console.log("--------------------------------------");
    console.log(" - Environment : " + (env == "d" ? "development":"production"));


    // open config.ts
    console.log(" Reading valhalla config file...");
    const configFile = fs.openSync(path.join(global.root,"client/src/config/config.ts"), "r");
    const configString = fs.readFileSync(configFile, "utf8");
    fs.closeSync(configFile);
    console.log(" DONE. \n");

    // update index.html 
    let configStringUpdated = "";
    console.log(" Setting index.html file");
    if(env == "development") configStringUpdated = configString.replaceAll("index-prod.html", "index.html");
    else configStringUpdated =  configString.replaceAll("index.html", "index-prod.html");
    console.log(" DONE. \n");
    
    // update config file
    console.log(" Updating valhalla config file...");
    const configFileUpdated = fs.openSync("client/src/config/config.ts", "w");
    fs.writeFileSync(configFileUpdated, configStringUpdated, "utf8");
    fs.closeSync(configFileUpdated);
    console.log(" DONE. \n");

} 

const args = process.argv.slice(2);
main(args[0]);