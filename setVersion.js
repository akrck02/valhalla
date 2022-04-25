function main(version, env){
    const fs = require("fs");

    // Read version.json
    const versionFile = fs.openSync("version.json", "r");
    const versionJsonFile = JSON.parse(fs.readFileSync(versionFile, "utf8"));
    fs.closeSync(versionFile);

    // Read package.json
    const packageFile = fs.openSync("package.json", "r");
    const packageJsonFile = JSON.parse(fs.readFileSync(packageFile, "utf8"));
    fs.closeSync(packageFile);

    // update version
    versionJsonFile.VERSION = version
    
    // Change the environment
    if(env == "-d") {
        versionJsonFile.ENVIRONMENT = "development";
    } else {
        versionJsonFile.ENVIRONMENT = "production";
    }

    // Update package.json
    packageJsonFile.version = versionJsonFile.VERSION;

    // write version.json
    const file2 = fs.openSync("version.json", "w");
    fs.writeFileSync(file2, JSON.stringify(versionJsonFile, null, 4), "utf8");
    fs.closeSync(file2);
    
    // write package.json
    const file3 = fs.openSync("package.json", "w");
    fs.writeFileSync(file3, JSON.stringify(packageJsonFile, null, 4), "utf8");
    fs.closeSync(file3);

    // open config.ts
    const configFile = fs.openSync("client/src/config/config.ts", "r");
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
main(args[0], args[1]);