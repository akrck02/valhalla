
enum ENVIROMENT {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}

//global runtime configurations
export const CONFIG  = {
    APP_NAME: 'GTD Webapp',
    APP_VERSION: 'v1.0',
    HOST: '127.0.0.1',
    PORT: 5500,
    URL: '',
    ENVIROMENT : ENVIROMENT.DEVELOPMENT,
    DEBUG : true,
    LOG_LEVEL : 'debug',
    LOG_FILE : 'app.log',
};

//paths on server
export const PATHS = {
    ROOT : '',
    RESOURCES : '',
    LOGS : '',
    FONTS : '',
    IMAGES : '',
    VIDEOS : '' ,
    AUDIOS : '',
    JSON : ''     
}

//api calls
export const API = {};  

//view URLs
export const VIEWS = {
    BASE_URL : '',
    HOME : '',
};

//start settings
export function setUpConfigurations() : void {

    //global runtime configurations
    //CONFIG['URL'] = 'http://' + CONFIG['HOST'] + ':' + CONFIG['PORT'] + "/";
    CONFIG['URL'] = location.href;
    
    //Paths
    PATHS['ROOT'] = CONFIG['URL'];
    PATHS['LOGS'] = PATHS['ROOT'] + 'logs/';
    PATHS['RESOURCES'] = PATHS['ROOT'] + 'resources/';
    PATHS['FONTS'] = PATHS['RESOURCES'] + 'fonts/';
    PATHS['IMAGES'] = PATHS['RESOURCES'] + 'images/';
    PATHS['VIDEOS'] = PATHS['RESOURCES'] + 'videos/';
    PATHS['AUDIOS'] = PATHS['RESOURCES'] + 'audios/';
    PATHS['JSON'] = PATHS['RESOURCES'] + 'json/'; 

    //views 
    VIEWS['BASE_URL'] = CONFIG['URL'] + '#/';
    VIEWS['HOME'] = VIEWS['BASE_URL'] + 'home/';

}