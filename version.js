function main(){
    const fs = require("fs");

    // Read version.json
    const versionFile = fs.openSync("version.json", "r");
    const versionJsonFile = JSON.parse(fs.readFileSync(versionFile, "utf8"));
    fs.closeSync(versionFile);

    // update version
    console.log(versionJsonFile.VERSION);
} 

main();