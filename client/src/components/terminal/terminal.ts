import { APP } from "../../app.js";
import { setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { TerminalInputBar } from "./terminalInputBar.js";
import { TerminalTabBar } from "./terminalTabBar.js";

interface LogMessage {
    message: string;
    time: string;
}

export class Terminal extends UIComponent {

    private logs: LogMessage[];
    private warnings: LogMessage[];
    private errors: LogMessage[];
    private mode: string;

    private scroll: boolean;
    private visible: boolean;

    private tabBar: UIComponent;
    private logger: UIComponent;

    public constructor() {
        super({
            type: "div",
            id: "terminal"
        });

        this.visible = true;
        this.scroll = true;

        const title = new UIComponent({
            type: "h1",
            id: "title",
            text: "Terminal ",
        });

        this.tabBar = new TerminalTabBar(this);
        this.logger = new UIComponent({ type: "p" });
        const inputbar = new TerminalInputBar(this);

        this.appendChild(title);
        this.appendChild(this.tabBar);
        this.appendChild(this.logger);
        this.appendChild(inputbar);

        this.mode = "log";
        this.logs = [];
        this.warnings = [];
        this.errors = [];
    }

    public start() {
        const terminal = this;
        console.log = (...messages) => this.addLogs(terminal.logs, messages);
        console.error = (...messages) => this.addLogs(terminal.errors, messages);
        console.warn = (...messages) => this.addLogs(terminal.warnings, messages);
        setInterval(() => this.update(terminal), 250);
    }

    private update(terminal: Terminal) {
        if (!this.visible)
            return;
        this.logger.element.innerHTML = "";

        switch (this.mode) {
            case "error":
                terminal.errors.forEach(msg => {
                    const logItem = new UIComponent({
                        type: "span",
                        classes: ["log-item", "text-error"],
                        text: msg.message,
                    });

                    const time = new UIComponent({
                        type: "span",
                        classes: ["log-time"],
                        text: msg.time,
                    });

                    logItem.appendChild(time);
                    terminal.logger.appendChild(logItem);
                });
                break;
            case "warning":
                terminal.warnings.forEach(msg => {
                    const logItem = new UIComponent({
                        type: "span",
                        classes: ["log-item", "text-warning"],
                        text: msg.message,
                    });

                    const time = new UIComponent({
                        type: "span",
                        classes: ["log-time"],
                        text: msg.time,
                    });

                    logItem.appendChild(time);
                    terminal.logger.appendChild(logItem);
                }); "variables"
                break;
            case "variables":
                this.createVariableBar();
                break;
            default:
                terminal.logs.forEach(msg => {
                    const logItem = new UIComponent({
                        type: "span",
                        classes: ["log-item", "text-log"],
                        text: msg.message,
                    });

                    const time = new UIComponent({
                        type: "span",
                        classes: ["log-time"],
                        text: msg.time,
                    });

                    logItem.appendChild(time);
                    terminal.logger.appendChild(logItem);
                });
                break;
        }

        if (this.scroll)
            this.logger.element.children[this.logger.element.children.length - 1]?.scrollIntoView();

    }


    private addLogs(to: LogMessage[], messages: any[]) {
        let result = "";

        messages
            .map(msg => this.check(msg))
            .forEach(msg => { result += " " + msg })

        to?.push({ message: result, time: new Date().toLocaleTimeString() });

    }


    private check(msg: any): string {

        if (msg instanceof Error) {
            return msg.message;
        }

        if (msg === undefined || msg.length == 0) {
            return "\"\"";
        }

        if (msg == null) {
            return "null"
        }

        if (msg instanceof Array) {
            return "[ " + (msg as Array<any>).join(",") + " ]";
        }

        if (msg instanceof Object) {
            return JSON.stringify(msg, null, 5);
        }

        if (msg === true)
            return "true";

        if (msg === false)
            return "false";

        return msg;
    }

    public hide() {
        this.visible = false;
        setStyles(this.element, {
            opacity: "0",
        });

        setTimeout(() => {
            this.element.style.display = "none";
        }, 100);
    }

    public show() {
        this.visible = true;
        setStyles(this.element, {
            display: "flex",
            width: "30rem",
            opacity: "1",
        });
    }

    public clear() {
        this.errors = [];
        this.warnings = [];
        this.logs = [];
    }

    public setMode(mode: string) {
        this.mode = mode;
    }

    public getMode() {
        return this.mode;
    }

    public setScroll(scroll: boolean) {
        this.scroll = scroll;
    }

    public isScroll() {
        return this.scroll;
    }

    public createVariableBar() {

        const persistent = new UIComponent({
            type: "h1",
            text: "Storage variables",
            classes: ["log-item-title"]
        });
        const config = APP.configurations.getConfig();

        persistent.appendTo(this.logger);
        this.createVariableTable(config);

        const base = new UIComponent({
            type: "h1",
            text: "Runtime variables",
            classes: ["log-item-title"]
        });
        base.appendTo(this.logger);

        const baseConfig = APP.configurations.BASE;
        this.createVariableTable({
            "APP_NAME": baseConfig.APP_NAME,
            "APP_VERSION": baseConfig.APP_VERSION,
            "ENVIROMENT": baseConfig.ENVIROMENT,
            "DEBUG": baseConfig.DEBUG,
            "LOG_LEVEL": baseConfig.LOG_LEVEL,
            "THEME": baseConfig.THEME,
            "TERMINAL_VISIBLE": baseConfig.TERMINAL_VISIBLE,
            "VIEW": location.href.substring(location.href.indexOf("#") + 1),
        });
    }

    private createVariableTable(config: Object) {
        for (const key in config) {
            let value = config[key];

            const logItem = new UIComponent({
                type: "span",
                classes: ["log-item"],
            });

            const logTable = new UIComponent({
                type: "table",
                classes: ["log-table"],
            })

            const logRow = new UIComponent({
                type: "tr",
                classes: ["log-row"],
            })

            const keyCol = new UIComponent({
                type: "td",
                text: key,
                classes: ["key"]
            });


            if(value === undefined)
                value = "undefined";

            const valueCol = new UIComponent({
                type: "td",
                text: value,
                classes: ["value"]
            });

            logTable.appendChild(logRow);
            logRow.appendChild(keyCol);
            logRow.appendChild(valueCol);
            logItem.appendChild(logTable);

            this.logger.appendChild(logItem);
        }
    }
}