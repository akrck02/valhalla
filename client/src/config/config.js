"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpConfigurations = exports.GITHUB = exports.VIEWS = exports.API = exports.PATHS = exports.CONFIG = void 0;
//global runtime configurations
exports.CONFIG = {
    APP_NAME: 'Vallhala',
    APP_VERSION: 'v1.0',
    HOST: 'localhost/vallhalla/',
    PORT: 80,
    URL: '',
    ENVIROMENT: 'development',
    DEBUG: true,
    LOG_LEVEL: 'debug',
    LOG_FILE: 'app.log',
};
//paths on server
exports.PATHS = {
    ROOT: '',
    RESOURCES: '',
    LOGS: '',
    FONTS: '',
    IMAGES: '',
    GITHUB_IMAGES: '',
    VIDEOS: '',
    AUDIOS: '',
    JSON: ''
};
//api calls
exports.API = {};
//view URLs
exports.VIEWS = {
    BASE_URL: '',
    HOME: '',
    CODE: '',
    ERROR: '',
};
exports.GITHUB = {
    URL: 'https://akrck-git.herokuapp.com/api/v1/',
    USERNAME: '',
};
//start settings
function setUpConfigurations() {
    //global runtime configurations
    exports.CONFIG['URL'] = 'http://' + exports.CONFIG['HOST'] + "/";
    //Paths
    exports.PATHS['ROOT'] = exports.CONFIG['URL'];
    exports.PATHS['LOGS'] = exports.PATHS['ROOT'] + 'logs/';
    exports.PATHS['RESOURCES'] = exports.PATHS['ROOT'] + 'resources/';
    exports.PATHS['FONTS'] = exports.PATHS['RESOURCES'] + 'fonts/';
    exports.PATHS['IMAGES'] = exports.PATHS['RESOURCES'] + 'images/';
    exports.PATHS['GITHUB_IMAGES'] = exports.PATHS['IMAGES'] + 'github/';
    exports.PATHS['VIDEOS'] = exports.PATHS['RESOURCES'] + 'videos/';
    exports.PATHS['AUDIOS'] = exports.PATHS['RESOURCES'] + 'audios/';
    exports.PATHS['JSON'] = exports.PATHS['RESOURCES'] + 'json/';
    //views 
    exports.VIEWS['BASE_URL'] = exports.CONFIG['URL'] + '#/';
    exports.VIEWS['HOME'] = exports.VIEWS['BASE_URL'] + 'home';
    exports.VIEWS['ERROR'] = exports.VIEWS['BASE_URL'] + 'error';
}
exports.setUpConfigurations = setUpConfigurations;
