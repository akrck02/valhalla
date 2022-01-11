import { setEvents, setStyles, UIComponent } from "../lib/web/uicomponent.js";

interface LogMessage {
    message: string;
    time: string;
}

export class Terminal extends UIComponent {

    private logs : LogMessage[];
    private warnings : LogMessage[];
    private errors : LogMessage[];
    private mode : string;
    
    private scroll : boolean;
    private visible : boolean;

    private tabBar : UIComponent;
    private logger : UIComponent;

    public constructor(){
        super({
            type:"div",
            id:"terminal"
        });

        this.visible = true;
        const title = new UIComponent({
            type: "h1",
            id: "title",
            text: "Terminal ",
        });

        this.logger = new UIComponent({
            type: "p",
        });

        this.scroll = true;
        this.tabBar = this.buildTabBar();
        const inputbar = this.buildInputBar();

        this.appendChild(title);
        this.appendChild(this.tabBar);
        this.appendChild(this.logger);
        this.appendChild(inputbar);

        this.mode = "log";
        this.logs = [];        
        this.warnings = [];        
        this.errors = [];        
    }

    public start(){
        const terminal = this;

        console.log = function(...messages) {
            let result = "";
            
            messages
            .map(msg => terminal.check(msg))
            .forEach(msg => {result += " " + msg})

            terminal.logs?.push({
                message : result, 
                time: new Date().toLocaleTimeString()
            });
        };
        
        console.error = function(...messages) {
            let result = "";
            
            messages.map(msg => terminal.check(msg))
            .forEach(msg => {result += " " + msg})

            terminal.errors?.push({
                message : result, 
                time: new Date().toLocaleTimeString()
            })
        };
        
        console.warn = function(...messages) {
            let result = "";
            messages.map(msg => terminal.check(msg))
            .forEach(msg => {result += " " + msg})

            terminal.warnings?.push({
                message : result,
                time: new Date().toLocaleTimeString()
            })
        };

        setInterval(() => {

            if(!this.visible){
                return;
            }

            this.logger.element.innerHTML ="";
          
            switch (this.mode) {
                case "error":
                    terminal.errors.forEach( msg => {
                        const logItem = new UIComponent({
                            type: "span",
                            classes : ["log-item", "text-error"],
                            text: msg.message,
                        });

                        const time = new UIComponent({
                            type: "span",
                            classes : ["log-time"],
                            text: msg.time,
                        });
                  
                        logItem.appendChild(time);
                        terminal.logger.appendChild(logItem);
                    });
                    break;
                case "warning":
                    terminal.warnings.forEach( msg => {
                        const logItem = new UIComponent({
                            type: "span",
                            classes : ["log-item", "text-warning"],
                            text: msg.message,
                        });

                        const time = new UIComponent({
                            type: "span",
                            classes : ["log-time"],
                            text: msg.time,
                        });
                  
                        logItem.appendChild(time);
                        terminal.logger.appendChild(logItem);
                    });
                    break;
                default:
                    terminal.logs.forEach( msg => {
                        const logItem = new UIComponent({
                            type: "span",
                            classes : ["log-item", "text-log"],
                            text: msg.message,
                        });

                        const time = new UIComponent({
                            type: "span",
                            classes : ["log-time"],
                            text: msg.time,
                        });
                  
                        logItem.appendChild(time);
                        terminal.logger.appendChild(logItem); 
                    });
                    break;
            }

            if(this.scroll)
                this.logger.element.children[ this.logger.element.children.length - 1]?.scrollIntoView();
        },250);

    }

    private buildInputBar() : UIComponent{
        const inputbar = new UIComponent({
            type: "div",
            id: "input-bar"
        });

        const input = new UIComponent({
            type: "input"
        });

        inputbar.appendChild(input);
        return inputbar;
    }


    private buildTabBar() : UIComponent{
        const tabBar = new UIComponent({
            type: "div",
            id: "tab-bar",

        });

        const logTab = new UIComponent({
            type: "button",
            text: "Logs",
            classes : ["tab","selected"]
        });

        const errorTab = new UIComponent({
            type: "button",
            text: "Errors",
            classes : ["tab"],
        });

        errorTab.element.style.setProperty("--color","var(--error-color)");

        const warningTab = new UIComponent({
            type: "button",
            text: "Warnings",
            classes : ["tab"],
        });
        warningTab.element.style.setProperty("--color","var(--warning-color)");

        const autoScroll = new UIComponent({
            type: "button",
            text: "🔃",
            styles: {
                fontSize: "1.1rem",
                background: "transparent",
                boxShadow: "none",
                filter: "grayscale(0)",
                width : "1rem"
            },
        });

        const clear = new UIComponent({
            type: "button",
            text: "🚫",
            styles: {
                fontSize: "1.1rem",
                background: "transparent",
                boxShadow: "none",
                width : "1rem"
            }
        });

        setEvents(autoScroll.element,{
            "click" : () => {
                autoScroll.element.style.filter = (this.scroll) ? "grayscale(10)" : "grayscale(0)";
                this.scroll =! this.scroll;
            }
        })

        setEvents(logTab.element,{
            click : () =>{
                errorTab.element.classList.remove("selected");
                warningTab.element.classList.remove("selected");
                logTab.element.classList.add("selected");
                this.mode = "log";
            }
        })

        setEvents(errorTab.element,{
            click : () =>{
                errorTab.element.classList.add("selected");
                warningTab.element.classList.remove("selected");
                logTab.element.classList.remove("selected");
                this.mode = "error";
            }
        })

        setEvents(warningTab.element,{
            click : () =>{
                errorTab.element.classList.remove("selected");
                warningTab.element.classList.add("selected");
                logTab.element.classList.remove("selected");
                this.mode = "warning";
            }
        })

        setEvents(clear.element,{
            click : () => {
                this.clear();
            }
        })

        tabBar.appendChild(logTab);
        tabBar.appendChild(errorTab);
        tabBar.appendChild(warningTab);
        tabBar.appendChild(autoScroll);
        tabBar.appendChild(clear);

        return tabBar;
    }

    private check(msg : any) : string {

        if(msg === undefined || msg.length == 0){
            return "{empty message}";
        }

        if(msg == null){
            return "null"
        }

        if(msg instanceof Array){
            return "[ " + (msg as Array<any>).join(",") + " ]";
        }

        if(msg instanceof Object){
            return JSON.stringify(msg, null, 5);
        }

        if(typeof msg == "string"){
            
            let inspect = msg as string;
            if(inspect.indexOf("http://") != -1) {
                const indexOfHttp = inspect.indexOf("http://");

                const start = inspect.substring(0, indexOfHttp);
                inspect = inspect.substring(indexOfHttp);

                const indexOfSpace = inspect.indexOf(" ");
                
                let link = "";
                let end = "";
                
                if(indexOfSpace != -1){
                    link = inspect.substring(0, indexOfSpace);
                    end = inspect.substring(indexOfSpace);
                    msg = start + ` <a href="${link}" target="_blank">${link}</a> ` + end; 
                } else { 
                    link = inspect;
                    msg = start + ` <a href="${link}" target="_blank">${link}</a> ` + end; 
                }
            }else if(inspect.indexOf("https://") != -1) {

                const indexOfHttps = inspect.indexOf("https://");

                const start = inspect.substring(0, indexOfHttps);
                inspect = inspect.substring(indexOfHttps);

                const indexOfSpace = inspect.indexOf(" ");
                
                let link = "";
                let end = "";
                
                if(indexOfSpace != -1){
                    link = inspect.substring(0, indexOfSpace);
                    end = inspect.substring(indexOfSpace);
                    msg = start + ` <a href="${link}" target="_blank">${link}</a> ` + end; 
                } else { 
                    link = inspect;
                    msg = start + ` <a href="${link}" target="_blank">${link}</a> ` + end; 
                }
                
            }

        }

        return msg;
    }

    public hide(){
        this.visible = false;
        setStyles(this.element, {
            opacity: "0",
        });

        setTimeout(() => {
            this.element.style.display = "none";
        }, 100);
    }

    public show(){
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
}