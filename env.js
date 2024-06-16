
const INDEX = 'app/index.html';
const INDEX_DEV = 'app/indexDev.html';
const INDEX_PROD = 'app/indexProd.html'; 

function change(env) {

    const fileSystem = require('fs');

    switch (env) {
        case 'dev':

            // change index.html file to indexProd.html
            fileSystem.rename(INDEX, INDEX_PROD, function (err) {
                if (err) throw err;
                console.log('renamed complete');
            });

            // change index.html file to indexDev.html  
            fileSystem.rename(INDEX_DEV, INDEX, function (err) {
                if (err) throw err;
                console.log('renamed complete');
            });

            return
        case 'prod':

            // change index.html file to indexDev.html
            fileSystem.rename(INDEX, INDEX_DEV, function (err) {
                if (err) throw err;
                console.log('renamed complete');
            });

            // change index.html file to indexProd.html
            fileSystem.rename(INDEX_PROD, INDEX, function (err) {
                if (err) throw err;
                console.log('renamed complete');
            });

           return
        default: return
    }
}

change(process.argv[2]);