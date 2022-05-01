import { App } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import { setEvents, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { LanguageBundleEs } from "../../res/spanish/languageBundle_es.js";
import { WallpaperGallery } from "./components/wallpaperGallery.js";

export default class ConfigurationView extends UIComponent {

    private menu: UIComponent;
    private menuOptions: UIComponent[];
    private content: UIComponent;

    public constructor() {
        super({
            type: "view",
            id: "configuration",
            classes: ["box-row"],
            styles: {
                width: "100%",
                height: "100%",
            },

        });

        this.menuOptions = [];
    }

    public show(params: string[], container: UIComponent): void {

        this.menu = this.createMenu();
        this.content = new UIComponent({
            type: "div",
            classes: ["backdrop", "box-column", "box-y-center"],
            styles: {
                width: "calc(100% - 16rem)",
                height: "100%",
                overflow: "auto",
                paddingBottom: "10rem",
                background: "rgba(0,0,0,0.05)",
                opacity: "0",
                transition: "opacity var(--slow)",
            },
        });

        setTimeout(() => {
            this.menu.element.style.opacity = "1";
            this.selectMenuOption(params[0] ? parseInt(params[0]) : 0);  
        }, 100);


        this.appendChild(this.menu);
        this.appendChild(this.content);
        this.appendTo(container);
    }


    private selectMenuOption(index : number) {

        if(!index){
            index = 0;
        }

        this.menuOptions.forEach(comp => {
            comp.element.classList.remove("selected");
        })

        if(!this.menuOptions[index]){
            return;
        }
   

        this.menuOptions[index].element.click();      
        this.menuOptions[index].element.classList.add("selected");
    }

    private createMenu(): UIComponent {
        const menu = new UIComponent({
            type: "div",
            id: "config-menu",
            classes: ["box-column", "box-y-center"],
            styles: {
                opacity: "0",
                transition: "opacity var(--medium)",
            },
        });

        const title = new UIComponent({
            type: "h1",
            text: App.getBundle().configuration.CONFIGURATION,
            classes: ["box-column", "box-y-start", "box-x-center"],
            styles: {
                width: "calc(80% - 1rem)",
                opacity: "0.85",
                height: "2rem",
                padding: "2rem 0",
                borderBottom: ".1rem solid rgba(0,0,0,0.05)",
                marginBottom: "1rem",
            }
        });

        const appearenceOption = new UIComponent({
            type: "button",
            text: getMaterialIcon("palette", { fill: "#fafafa", size: "1rem" }).toHTML() + App.getBundle().configuration.APPEARANCE,
            classes: ["option", "selected", "box-row", "box-y-center"],
        });

        setEvents(appearenceOption.element, {
            click: () => {
                this.menuOptions.forEach(comp => {
                    comp.element.classList.remove("selected");
                })
                appearenceOption.element.classList.add("selected");

                this.createAppearenceView(this.content)
            }
        })


        const userOption = new UIComponent({
            type: "button",
            text: getMaterialIcon("user", { fill: "#fafafa", size: "1rem" }).toHTML() + App.getBundle().configuration.USER,
            classes: ["option", "box-row", "box-y-center"],
        });

        setEvents(userOption.element, {
            click: () => {
                this.menuOptions.forEach(comp => {
                    comp.element.classList.remove("selected");
                })
                userOption.element.classList.add("selected");
   
                this.createUserView(this.content)
            }
        })

        this.menuOptions = [appearenceOption,userOption]

        menu.appendChild(title);
        menu.appendChild(appearenceOption);
        menu.appendChild(userOption);

        return menu;
    }

    private createAppearenceView(parent: UIComponent) {
        parent.clean()
        parent.element.style.transition = "none";
        parent.element.style.opacity = "0";

        const wallPaperTitle = new UIComponent({
            type: "h1",
            classes: ["box-row", "box-y-center"],
            text: getMaterialIcon("wallpaper", { fill: "#fafafa", size: "1.35rem" }).toHTML() + "&nbsp;" + App.getBundle().configuration.WALLPAPERS,
            styles: {
                width: "100%",
                padding: "2rem 3.7rem",
            }
        });

        const wallpaperGallery = new WallpaperGallery();

        const animationRow = new UIComponent({
            classes: ["box-row", "box-x-start", "box-y-center"],
            styles: {
                width: "100%",
                padding: "2rem 3.7rem"
            }
        })

        const animationTitle = new UIComponent({
            type: "h1",
            text: "&nbsp;" + App.getBundle().configuration.ANIMATIONS + ":",
            styles: {
            }
        });

        const animationIcon = getMaterialIcon("animation", {
            fill: "#fff",
            size: "1.35rem"
        })
        animationIcon.element.style.marginRight = ";";


        const animationsButton = new UIComponent({
            type: "button",
            text: Configurations.areAnimationsEnabled() ? App.getBundle().system.YES : App.getBundle().system.NO,
            styles: {
                margin: "0 1rem",
                background: "rgba(255,255,255, .1)",
                boxShadow: "none"
            }
        })

        setEvents(animationsButton.element, {
            click: () =>  {
               
               const animations = !Configurations.areAnimationsEnabled()
                Configurations.setAnimations(animations);

                if(animations){
                    animationsButton.element.innerText = App.getBundle().system.YES
                }
                else {
                    animationsButton.element.innerText = App.getBundle().system.NO
                }
               
            }
        })

        animationRow.appendChild(animationIcon)
        animationRow.appendChild(animationTitle)
        animationRow.appendChild(animationsButton)

        parent.appendChild(wallPaperTitle);
        parent.appendChild(wallpaperGallery);
        parent.appendChild(animationRow);


        setTimeout(() => {
            parent.element.style.transition = "opacity var(--slow)";
            parent.element.style.opacity = "1";
        }, 100);
    }

    private createUserView(parent: UIComponent) {
        parent.clean()
        parent.element.style.transition = "none";
        parent.element.style.opacity = "0";

        const languageRow = new UIComponent({
            classes: ["box-row", "box-x-start", "box-y-center"],
            styles: {
                width: "100%",
                padding: "2rem 3.7rem"
            }
        })

        const languageTitle = new UIComponent({
            type: "h1",
            text: "&nbsp;" + App.getBundle().lang.LANGUAGE + ":",
            styles: {
            }
        });

        const languageIcon = getMaterialIcon("translate", {
            fill: "#fff",
            size: "1.35rem"
        })
        languageIcon.element.style.marginRight = ";";

        const buttonRow = new UIComponent({
            classes: ["box-row", "box-x-start", "box-y-center"],
            styles: {
                width: "100%",
                padding: "0rem 3.7rem"
            }
        })

        const englishButton = new UIComponent({
            type: "button",
            text: App.getBundle().lang.ENGLISH,
            classes: ["lang"],
            styles: {
                margin: "0 .25rem",
                border: ".25rem solid rgba(255,255,255, .1)",
                background: "transparent",
                boxShadow: "none"
            }
        })

        if(Configurations.getConfigVariable("LANG")?.toLowerCase().includes("en")) {
            englishButton.element.classList.add("selected");
        }

        const spanishButton = new UIComponent({
            type: "button",
            text: App.getBundle().lang.SPANISH,
            classes: ["lang"],
            styles: {
                margin: "0 .25rem",
                border: ".25rem solid rgba(255,255,255, .1)",
                background: "transparent",
                boxShadow: "none"
            }
        })

        if(Configurations.getConfigVariable("LANG")?.toLowerCase().includes("es")) {
            spanishButton.element.classList.add("selected");
        }



        const langs = [englishButton,spanishButton];

        englishButton.element.onclick = () => {
            langs.forEach(component => {
                component.element.classList.remove("selected")
            });

            englishButton.element.classList.add("selected");
            Configurations.addConfigVariable("LANG","en")
            App.redirect(Configurations.VIEWS.CONFIGURATION,["1"],true)
        }

        spanishButton.element.onclick = () => {
            langs.forEach(component => {
                component.element.classList.remove("selected")
            });

            spanishButton.element.classList.add("selected");
            Configurations.addConfigVariable("LANG","es")
            App.redirect(Configurations.VIEWS.CONFIGURATION,["1"],true)
        }



        languageRow.appendChild(languageIcon)
        languageRow.appendChild(languageTitle)

        buttonRow.appendChild(spanishButton);
        buttonRow.appendChild(englishButton);

        parent.appendChild(languageRow)
        parent.appendChild(buttonRow)

        setTimeout(() => {
            parent.element.style.transition = "opacity var(--slow)";
            parent.element.style.opacity = "1";
        }, 100);
    }



}