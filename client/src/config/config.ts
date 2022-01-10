enum ENVIROMENT {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}

export class Configurations {

    //global runtime configurations
    public BASE;
    public PATHS;
    public VIEWS;
    public API;

    public constructor() {
        this.declareConfig();
        this.declarePaths(); 
        this.declareApi();
        this.declareViews();
        this.setUpConfigurations();   
    }

    private declareConfig(){
        this.BASE = {
            APP_NAME: 'Vallhala',
            APP_VERSION: 'v1.0',
            HOST: '127.0.0.1',
            PORT: 5500,
            URL: '',
            ENVIROMENT : ENVIROMENT.DEVELOPMENT,
            DEBUG : true,
            LOG_LEVEL : 'debug',
            LOG_FILE : 'app.log',
            THEME : 'light'
        };
    }

    private declarePaths() {
        this.PATHS = {
            ROOT : '',
            RESOURCES : '',
            LOGS : '',
            FONTS : '',
            IMAGES : '',
            VIDEOS : '' ,
            AUDIOS : '',
            JSON : ''     
        }
    }

    private declareApi() {
        this.API = {
            URL : '',
            GET_USER_TASKS : '',
            GET_USER_TASK_CATEGORIES : '',
        };  

    }

    private declareViews(){ 
        this.VIEWS = {
            BASE_URL : '',
            TASKS : '',
            CALENDAR : '',
            TEAMS : '',
            PROJECTS : '',
            CONFIGURATION : '',
        };
    }

    //start settings
    setUpConfigurations() : void {

        //global runtime configurations
        this.BASE['URL'] = location.href;
        
        //Paths
        this.PATHS['ROOT']      = this.BASE['URL'];
        this.PATHS['LOGS']      = this.PATHS['ROOT'] + 'logs/';
        this.PATHS['RESOURCES'] = this.PATHS['ROOT'] + 'resources/';
        this.PATHS['FONTS']     = this.PATHS['RESOURCES'] + 'fonts/';
        this.PATHS['IMAGES']    = this.PATHS['RESOURCES'] + 'images/';
        this.PATHS['VIDEOS']    = this.PATHS['RESOURCES'] + 'videos/';
        this.PATHS['AUDIOS']    = this.PATHS['RESOURCES'] + 'audios/';
        this.PATHS['JSON']      = this.PATHS['RESOURCES'] + 'json/'; 

        //views 
        this.VIEWS['BASE_URL']      = '#/';
        this.VIEWS['TASKS']         = this.VIEWS['BASE_URL'] + 'tasks/';
        this.VIEWS['CALENDAR']      = this.VIEWS['BASE_URL'] + 'calendar/';
        this.VIEWS['TEAMS']         = this.VIEWS['BASE_URL'] + 'teams/';
        this.VIEWS['PROJECTS']      = this.VIEWS['BASE_URL'] + 'projects/';
        this.VIEWS['CONFIGURATION'] = this.VIEWS['BASE_URL'] + 'configuration/';

        //api calls
        this.API['URL']                         = 'http://127.0.0.1:3333/api/v1/';
        this.API['GET_USER_TASKS']              = this.API['URL'] + 'get/user/tasks/';
        this.API['GET_USER_TASK_CATEGORIES']    = this.API['URL'] + 'get/user/task/categories/';


    }

    public toggleTheme() {
        if(this.BASE.THEME === "light"){
            this.BASE.THEME = "dark";
        } else {
            this.BASE.THEME = "light";
        }

        document.documentElement.dataset.theme = this.BASE.THEME;
    }

}