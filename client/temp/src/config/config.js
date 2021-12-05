//global runtime configurations
export const CONFIG = {
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
export const PATHS = {
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
export const API = {};
//view URLs
export const VIEWS = {
    BASE_URL: '',
    HOME: '',
    CODE: '',
    ERROR: '',
};
export const GITHUB = {
    URL: 'https://akrck-git.herokuapp.com/api/v1/',
    USERNAME: '',
};
//start settings
export function setUpConfigurations() {
    //global runtime configurations
    CONFIG['URL'] = 'http://' + CONFIG['HOST'] + "/";
    //Paths
    PATHS['ROOT'] = CONFIG['URL'];
    PATHS['LOGS'] = PATHS['ROOT'] + 'logs/';
    PATHS['RESOURCES'] = PATHS['ROOT'] + 'resources/';
    PATHS['FONTS'] = PATHS['RESOURCES'] + 'fonts/';
    PATHS['IMAGES'] = PATHS['RESOURCES'] + 'images/';
    PATHS['GITHUB_IMAGES'] = PATHS['IMAGES'] + 'github/';
    PATHS['VIDEOS'] = PATHS['RESOURCES'] + 'videos/';
    PATHS['AUDIOS'] = PATHS['RESOURCES'] + 'audios/';
    PATHS['JSON'] = PATHS['RESOURCES'] + 'json/';
    //views 
    VIEWS['BASE_URL'] = CONFIG['URL'] + '#/';
    VIEWS['HOME'] = VIEWS['BASE_URL'] + 'home';
    VIEWS['ERROR'] = VIEWS['BASE_URL'] + 'error';
}
