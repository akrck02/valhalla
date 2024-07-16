import { APP } from "../app.js";
import { setDataset, setStyles } from "../lib/gtd-ts/web/uicomponent.js";
import { ConfigService } from "../services/config.js";

export enum ENVIROMENT {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export class Configurations {
  //global runtime configurations
  public static BASE = {
    APP_NAME: "Valhalla",
    APP_VERSION: "v.x.x",
    HOST: "127.0.0.1",
    PORT: 80,
    URL: location.href,
    ENVIRONMENT: ENVIROMENT.DEVELOPMENT,
    DEBUG: true,
    LOG_LEVEL: "debug",
    LOG_FILE: "app.log",
    WEBSITE: "https://akrck02.github.io/#/software/valhalla",
  };

  public static PATHS = {
    WEB: "../web/",
    ROOT: "../client/",
    LOGS: "../client/logs/",
    RESOURCES: "../client/resources/",
    IMAGES: "../client/resources/images/",
    ICONS: "../client/resources/icons/",
    WALLPAPERS: "../client/resources/wallpapers/",
  };

  public static VIEWS = {
    BASE_URL: "../web/index.html#/",
    START: "../web/index.html#/start/",
    TASKS: "../web/index.html#/tasks/",
    TASK: "../web/index.html#/task/",
    NEW_TASK: "../web/index.html#/new-task/",
    NOTES: "../web/index.html#/notes/",
    CALENDAR: "../web/index.html#/calendar/",
    TEAMS: "../web/index.html#/teams/",
    PROJECTS: "../web/index.html#/projects/",
    SEARCH: "../web/index.html#/search/",
    CONFIGURATION: "../web/index.html#/configuration/",
    TERMINAL: "../web/index.html#/terminal/",
    ABOUT: "../web/index.html#/about/",
    VIEWER: "../web/index.html#/viewer/",
    ERROR: "../web/index.html#/error/",
    DUMMY: "../web/index.html#/dummy/",
  };

  public static API = {
    URL: "http://127.0.0.1:3333/api/v1/",

    // GET METHODS
    GET_USER_TASKS: "http://127.0.0.1:3333/api/v1/get/user/tasks/",
    GET_USER_NOTES: "http://127.0.0.1:3333/api/v1/get/user/notes/",
    GET_USER_DONE_TASKS: "http://127.0.0.1:3333/api/v1/get/user/done/tasks/",
    GET_USER_NOT_DONE_TASKS:
      "http://127.0.0.1:3333/api/v1/get/user/not/done/tasks/",
    GET_USER_TASK: "http://127.0.0.1:3333/api/v1/get/user/task/",
    GET_USER_MONTH_TASKS: "http://127.0.0.1:3333/api/v1/get/user/month/tasks/",
    GET_USER_TASKS_FROM_CATEGORY:
      "http://127.0.0.1:3333/api/v1/get/user/tasks/from/category/",
    GET_USER_DONE_TASKS_FROM_CATEGORY:
      "http://127.0.0.1:3333/api/v1/get/user/done/tasks/from/category/",
    GET_USER_NOT_DONE_TASKS_FROM_CATEGORY:
      "http://127.0.0.1:3333/api/v1/get/user/not/done/tasks/from/category/",
    GET_USER_TASK_CATEGORIES:
      "http://127.0.0.1:3333/api/v1/get/user/task/categories/",

    // INSERT METHODS
    INSERT_USER_TASK: "http://127.0.0.1:3333/api/v1/insert/user/task/",
    INSERT_USER_NOTE: "http://127.0.0.1:3333/api/v1/insert/user/note/",

    // DELETE METHODS
    DELETE_USER_NOTE: "http://127.0.0.1:3333/api/v1/delete/user/note/",
    DELETE_USER_TASK: "http://127.0.0.1:3333/api/v1/delete/user/task/",
    DELETE_USER_TASKS: "http://127.0.0.1:3333/api/v1/delete/user/tasks/",

    // UPDATE METHODS
    UPDATE_USER_TASK: "http://127.0.0.1:3333/api/v1/update/user/task/",
    UPDATE_USER_TASK_DONE:
      "http://127.0.0.1:3333/api/v1/update/user/task/done/",
    UPDATE_USER_TASKS_DONE:
      "http://127.0.0.1:3333/api/v1/update/user/tasks/done/",

    // SEARCH METHODS
    SEARCH_USER_TASKS_BY_NAME:
      "http://127.0.0.1:3333/api/v1/search/user/tasks/by/name",
    SEARCH_USER_CATEGORIES_BY_NAME:
      "http://127.0.0.1:3333/api/v1/search/user/categories/by/name",

    // ASSIGN METHODS
    ASSIGN_NOTE_TO_TASK: "assign/note/to/task",
  };

  /**
   * Set default configurations for the application
   */
  public static async setDefaultVariables() {
    await ConfigService.getAppConfig()
      .success((json) => {
        this.BASE.APP_NAME = json.APP_NAME;
        this.BASE.APP_VERSION = json.VERSION;
        this.BASE.ENVIRONMENT = json.ENVIRONMENT;
      })
      .jsonPromise();

    if (!Configurations.getConfigVariable("USERNAME")) {
      Configurations.addConfigVariable("USERNAME", "default");
    }

    if (!Configurations.getConfigVariable("OAUTH")) {
      Configurations.addConfigVariable("OAUTH", "#");
    }

    if (Configurations.getConfigVariable("ANIMATIONS") == undefined) {
      this.setAnimations(true);
    }
  }

  /**
   * Get a configuration variable
   * @returns the configuration variable
   */
  public static getUserName() {
    return Configurations.getConfigVariable("USERNAME");
  }

  /**
   * Get the oauth token
   * @returns the oauth token
   */
  public static getOAuth() {
    return Configurations.getConfigVariable("OAUTH");
  }

  /**
   * Toogle the dark / light mode.
   * if a wallpaper is set, does not change the theme
   */
  public static toggleTheme() {
    if (Configurations.getConfigVariable("WALLPAPER")) {
      return;
    }

    Configurations.setTheme(
      Configurations.getConfigVariable("THEME") === "light" ? "dark" : "light",
    );
  }

  /**
   * Set the application UI theme
   * @param theme the theme to set
   */
  public static setTheme(theme: string) {
    if (!theme) theme = "dark";

    this.addConfigVariable("THEME", theme);
    this.addConfigVariable("WALLPAPER", false);

    document.documentElement.dataset.theme = theme;
  }

  public static getTheme() {
    return Configurations.getConfigVariable("THEME");
  }

  /**
   * Get if the dark mode is active
   * @returns true if the dark mode is active
   */
  public static isDarkModeActive() {
    return Configurations.getTheme() === "dark";
  }

  /**
   * Set the animations on/off
   * @param animations true to enable animations
   */
  public static setAnimations(animations: boolean) {
    document.documentElement.dataset.animations = animations ? "true" : "false";
    this.addConfigVariable("ANIMATIONS", animations);
  }

  /**
   * Get if the animations are enabled
   * @returns true if the animations are enableds
   */
  public static areAnimationsEnabled() {
    return Configurations.getConfigVariable("ANIMATIONS") + "" === "true";
  }

  /**
   * Set the variable panel visibile
   */
  public static setVariablePanelVisible(value: boolean) {
    Configurations.addConfigVariable("VARIABLES_VISIBLE", value);

    if (Configurations.getConfigVariable("VARIABLES_VISIBLE")) {
      APP.router.variablePanel.show();
    } else {
      APP.router.variablePanel.hide();
    }
  }

  /**
   * Toggle the variable panel visibility
   */
  public static toggleVariablePanel() {
    if (Configurations.BASE.ENVIRONMENT !== ENVIROMENT.DEVELOPMENT) return;

    this.setVariablePanelVisible(
      !Configurations.getConfigVariable("VARIABLES_VISIBLE"),
    );
    setDataset(document.documentElement, {
      variablesVisible: Configurations.getConfigVariable("VARIABLES_VISIBLE"),
    });
  }

  /**
   * Get application configurations
   * @returns the application configurations
   */
  public static getConfig() {
    let localStorageConfiguration = JSON.parse(
      localStorage.getItem("vallhala-config"),
    );

    if (!localStorageConfiguration) {
      localStorageConfiguration = {};
    }

    return localStorageConfiguration;
  }

  /**
   * Add a configuration variable
   * @param key the name of the variable
   * @param value the value of the variable
   */
  public static addConfigVariable(key: string, value: any) {
    let localStorageConfiguration = Configurations.getConfig();
    const config = localStorageConfiguration;
    config[key] = value;
    localStorage.setItem("vallhala-config", JSON.stringify(config));
  }

  /**
   * Get a configuration variable
   * @param key the name of the variable
   * @returns the value of the variable
   */
  public static getConfigVariable(key: string): any {
    let localStorageConfiguration = this.getConfig();
    return localStorageConfiguration[key];
  }

  /**
   * Set the application wallpaper
   * @param wallpaper the wallpaper to set
   */
  public static setWallpaper(wallpaper: string) {
    if (!wallpaper) {
      this.addConfigVariable("WALLPAPER", wallpaper);
      setStyles(document.body, { "background-image": "none" });
      document.documentElement.dataset.wallpaper = undefined;
      return;
    }

    document.documentElement.dataset.wallpaper = "true";

    this.setTheme("dark");
    this.addConfigVariable("WALLPAPER", wallpaper);

    setStyles(document.body, {
      "background-image":
        "url(" + Configurations.PATHS.WALLPAPERS + wallpaper + ")",
    });
  }

  /**
   * Get the application wallpaper
   * @returns the wallpaper
   */
  static getWallpaper(): string {
    return Configurations.getConfigVariable("WALLPAPER");
  }

  /**
   * @returns if the application is has a wallpaper
   */
  public static hasWallpaper(): boolean {
    const wallpaper = Configurations.getWallpaper();
    return !!wallpaper;
  }

  /**
   * Toggle the visibility of done tasks on configuration
   */
  public static toggleShowDoneTasks(): boolean {
    const showDoneTasks = Configurations.areDoneTasksShown();
    if (showDoneTasks)
      Configurations.addConfigVariable("SHOW_DONE_TASKS", false);
    else Configurations.addConfigVariable("SHOW_DONE_TASKS", true);

    return !showDoneTasks;
  }

  /**
   * Get if the done tasks are shown
   * @returns if the done tasks are shown
   */
  public static areDoneTasksShown() {
    return Configurations.getConfigVariable("SHOW_DONE_TASKS") === true;
  }

  /**
   * Toggle the visibility of done tasks on configuration
   */
  public static toggleTaskOrder() {
    if (Configurations.isTaskOrderAscending()) {
      Configurations.setDescendingTaskOrder();
    } else {
      Configurations.setAscendingTaskOrder();
    }
  }

  /**
   * Set the task order to descending
   */
  public static setDescendingTaskOrder() {
    Configurations.addConfigVariable("TASK_ORDER", "descending");
  }

  /**
   * Set the task order to ascending
   */
  public static setAscendingTaskOrder() {
    Configurations.addConfigVariable("TASK_ORDER", "ascending");
  }

  /**
   * Get the task order
   * @returns the task order
   */
  public static getTaskOrder(): string {
    return Configurations.getConfigVariable("TASK_ORDER");
  }

  /**
   * Get if the task order is ascending
   * @returns  true if the task order is ascending
   */
  public static isTaskOrderAscending(): boolean {
    return Configurations.getTaskOrder() === "ascending";
  }
}
