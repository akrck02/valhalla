import { setClasses, setEvents, setStyles, UIComponent } from "../lib/web/uicomponent.js";

export class Terminal extends UIComponent {

    private logs : string[];
    private warnings : string[];
    private errors : string[];
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
        this.toggle();

        const title = new UIComponent({
            type: "h1",
            id: "title",
            text: "💻 | Terminal:",
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

            terminal.logs?.push(result);
        };
        
        console.error = function(...messages) {
            let result = "";
            
            messages.map(msg => terminal.check(msg))
            .forEach(msg => {result += " " + msg})

            terminal.errors?.push(result)
        };
        
        console.warn = function(...messages) {
            messages.map(msg => terminal.check(msg))
            .forEach(msg => terminal.warnings?.push(msg))
        };

        setInterval(() => {
            this.logger.element.innerHTML ="";
          
            switch (this.mode) {
                case "error":
                    terminal.errors.forEach( msg => {
                        this.logger.element.innerHTML += `<span class='log-item text-error'>${msg}</span>`; 
                    });
                    break;
                case "warning":
                    terminal.warnings.forEach( msg => {
                        this.logger.element.innerHTML += `<span class='log-item text-warning'>${msg}</span>`; 
                    });
                    break;
                default:
                    terminal.logs.forEach( msg => {
                        this.logger.element.innerHTML += `<span class='log-item'>${msg}</span>`; 
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
                filter: "grayscale(0)"
            },
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

        tabBar.appendChild(logTab);
        tabBar.appendChild(errorTab);
        tabBar.appendChild(warningTab);
        tabBar.appendChild(autoScroll);

        return tabBar;
    }

    private check(msg : any) : string{

        if(msg.length == 0){
            return "<empty>"
        }
        
        if(msg == null){
            return "null"
        }

        if(msg instanceof Array){
            return "[ " + (msg as Array<any>).join(",") + " ]";
        }

        if(msg instanceof Object){
            return JSON.stringify(msg);
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


    public toggle(){

        if(this.visible){
            setStyles(this.element, {
                position: "relative",
                width: "20rem",
                opacity: "0"
            });

        } else { 
            setStyles(this.element, {
                width: "30rem",
                opacity: "1"
            });
            
        }

        this.visible =! this.visible;
    }

}