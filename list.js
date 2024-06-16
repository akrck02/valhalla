
const fs = require('fs');



function createFileListJSON() {

    const files = fs.readdirSync('./resources/images');
    const fileList = files.filter(file => {
        return file !== 'List.json';
    });
    
    const json = JSON.stringify(fileList);
    
    fs.writeFileSync('./resources/images/List.json', json);
    console.log('fileList.json created');
}

createFileListJSON();