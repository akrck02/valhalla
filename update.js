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


function main(type, env, prefix, update = true){
    const fs = require("fs");

    if(update !== true){
        update = false;
    }

    // Read version.json
    const versionFile = fs.openSync(path.join(global.root,"version.json"), "r");
    const versionJsonFile = JSON.parse(fs.readFileSync(versionFile, "utf8"));
    fs.closeSync(versionFile);

    // Read package.json
    const packageFile = fs.openSync(path.join(global.root,"package.json"), "r");
    const packageJsonFile = JSON.parse(fs.readFileSync(packageFile, "utf8"));
    fs.closeSync(packageFile);

    // update version
    if(update){
        versionJsonFile.VERSION = semver(versionJsonFile.VERSION, type, prefix);
    }
    
    // Change the environment
    if(env == "-d") {
        versionJsonFile.ENVIRONMENT = "development";
    } else {
        versionJsonFile.ENVIRONMENT = "production";
    }

    // Update package.json
    packageJsonFile.version = versionJsonFile.VERSION;

    // write version.json
    const file2 = fs.openSync(path.join(global.root,"version.json"), "w");
    fs.writeFileSync(file2, JSON.stringify(versionJsonFile, null, 4), "utf8");
    fs.closeSync(file2);
    
    // write package.json
    const file3 = fs.openSync(path.join(global.root,"package.json"), "w");
    fs.writeFileSync(file3, JSON.stringify(packageJsonFile, null, 4), "utf8");
    fs.closeSync(file3);

    // open config.ts
    const configFile = fs.openSync(path.join(global.root,"client/src/config/config.ts"), "r");
    const configString = fs.readFileSync(configFile, "utf8");
    fs.closeSync(configFile);

    // update 
    let configStringUpdated = "";
    
    if(env == "-d") {
        configStringUpdated = configString.replaceAll("index-prod.html", "index.html");
    }
    else {
        configStringUpdated =  configString.replaceAll("index.html", "index-prod.html");
    }
    
    const configFileUpdated = fs.openSync("client/src/config/config.ts", "w");
    fs.writeFileSync(configFileUpdated, configStringUpdated, "utf8");
    fs.closeSync(configFileUpdated);

} 

const args = process.argv.slice(2);
main(args[0], args[1], args[2], args[3]);