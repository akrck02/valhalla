const path = require("path");

const VERSION_TYPE = {
    MAJOR: "major",
    MINOR: "minor",
    PATCH: "patch"
}


// Redeclaring the Nodejs global variable object
global.root = path.resolve(__dirname + "/");

function semver(version, type, prefix = '') {
    let [major, minor, patch] = version.split(".");
    
    major = parseInt(major);
    minor = parseInt(minor);
    patch = parseInt(patch);
    
    switch (type) {
        case VERSION_TYPE.MAJOR:
            major++;
            minor = 0;
            patch = 0;
            break;
    
        case VERSION_TYPE.MINOR:
            minor++;
            patch = 0;
            break;

        default:
            patch++;
            break;
    }

    return `${major}.${minor}.${patch}${prefix}`;
}


function main(env, version, update = true){

    console.log("\n--------------------------------------");
    console.log("     VALHALLA VERSION MANAGER ");
    console.log("--------------------------------------");
    console.log(" - Environment : " + (env == "d" ? "development":"production"));
    console.log(" - Version: " + version );
    console.log(" - Update directive: " + update + "\n");


    const fs = require("fs");

    if(update !== true){
        update = false;
    }

    // Read version.json
    console.log(" Reading version file...");
    const versionFile = fs.openSync(path.join(global.root,"version.json"), "r");
    const versionJsonFile = JSON.parse(fs.readFileSync(versionFile, "utf8"));
    fs.closeSync(versionFile);
    console.log(" DONE. \n");

    // Read package.json
    console.log(" Reading package.json file...");
    const packageFile = fs.openSync(path.join(global.root,"package.json"), "r");
    const packageJsonFile = JSON.parse(fs.readFileSync(packageFile, "utf8"));
    fs.closeSync(packageFile);
    console.log(" DONE. \n");

    // update version
    if(update){
        console.log(" Updating version info...");
        versionJsonFile.VERSION = version
    }
    
    // Change the environment
    if(env == "d") {
        console.log(" Setting environment to development.");
        versionJsonFile.ENVIRONMENT = "development";
    } else {
        console.log(" Setting environment to production.");
        versionJsonFile.ENVIRONMENT = "production";
    }

    // Update package.json
    packageJsonFile.version = versionJsonFile.VERSION;

    // write version.json
    console.log(" Reading version file...");
    const file2 = fs.openSync(path.join(global.root,"version.json"), "w");
    fs.writeFileSync(file2, JSON.stringify(versionJsonFile, null, 4), "utf8");
    fs.closeSync(file2);
    console.log(" DONE. \n");
    
    // write package.json
    console.log(" Reading package.json file...");
    const file3 = fs.openSync(path.join(global.root,"package.json"), "w");
    fs.writeFileSync(file3, JSON.stringify(packageJsonFile, null, 4), "utf8");
    fs.closeSync(file3);
    console.log(" DONE. \n");

    // open config.ts
    console.log(" Reading valhalla config file...");
    const configFile = fs.openSync(path.join(global.root,"client/src/config/config.ts"), "r");
    const configString = fs.readFileSync(configFile, "utf8");
    fs.closeSync(configFile);
    console.log(" DONE. \n");

    // update 
    let configStringUpdated = "";

    console.log(" Setting index.html file");
    
    if(env == "d") {
        configStringUpdated = configString.replaceAll("index-prod.html", "index.html");
    }
    else {
        configStringUpdated =  configString.replaceAll("index.html", "index-prod.html");
    }
    console.log(" DONE. \n");
    
    console.log(" Updating valhalla config file...");
    const configFileUpdated = fs.openSync("client/src/config/config.ts", "w");
    fs.writeFileSync(configFileUpdated, configStringUpdated, "utf8");
    fs.closeSync(configFileUpdated);
    console.log(" DONE. \n");

} 

const args = process.argv.slice(2);
main(args[0], args[1], args[2]);