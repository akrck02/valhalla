const VERSION_TYPE = {
    MAJOR: "major",
    MINOR: "minor",
    PATCH: "patch"
}


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


function main(type, env, prefix){
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
    versionJsonFile.VERSION = semver(versionJsonFile.VERSION, type, prefix);

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

    
} 

const args = process.argv.slice(2);
main(args[0], args[1], args[2]);