import { Config } from "../../config/config.js";
import { Browser } from "../../lib/gtdf/components/browser.js";
import { HTML } from "../../lib/gtdf/components/dom.js";
import { UIComponent } from "../../lib/gtdf/components/uicomponent.js";
import { Route } from "../../lib/gtdf/decorators/Route.js";
import { Singleton } from "../../lib/gtdf/decorators/Singleton.js";
import { ViewUI } from "../../lib/gtdf/views/ViewUI.js";
import { Gtdf } from "../../lib/others/gtdf.js";

@Route(["home"])
@Singleton()
export default class HomeView extends ViewUI {

    private static readonly ID = "home";
    private static readonly MOBILE_CLASS = "mobile";

    public constructor(){
        super({
            type: HTML.VIEW,
            id: HomeView.ID,
            classes: [Gtdf.BOX_ROW, Gtdf.BOX_CENTER], 
            styles : {
                height: "100vh",
                width: "100%"
            }
        });
        
    }

    public async show(params : string[], container : UIComponent) : Promise<void> {

        Config.setTitle(`${Config.Base.app_name} - home`);

        if(Browser.isSmallDevice()){
            this.element.classList.add(HomeView.MOBILE_CLASS);
        }


        const loginBox = new UIComponent({
            type: HTML.DIV,
            classes: [Gtdf.BOX_COLUMN, Gtdf.BOX_X_CENTER, Gtdf.BOX_Y_CENTER],
        });

        const title = new UIComponent({
            type: HTML.H1,
            text: "HELLO WORLD!",
            classes: [Gtdf.TEXT_CENTER],
        });

        title.appendTo(this);
        this.appendTo(container);
    }
}