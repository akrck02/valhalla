require('dotenv').config();

const { execSync } = require('child_process');

function upload2Github() {
    
    const username = process.env.GITHUB_USERNAME;
    const password = process.env.GITHUB_TOKEN;

    execSync(`git config user.name ${username}`, { stdio: 'inherit' , cwd: __dirname});
    execSync(`git config user.password ${password}`, { stdio: 'inherit' , cwd: __dirname});
    execSync(`git add ./resources/images`, { stdio: 'inherit' , cwd: __dirname});
    execSync(`git commit -m "[upload] new images! 😘"`, { stdio: 'inherit' , cwd: __dirname});
    execSync(`git push`, { stdio: 'inherit' , cwd: __dirname});
}


upload2Github();