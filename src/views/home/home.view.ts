import Gallery from "../../components/gallery/gallery.js";
import Header from "../../components/header/header.js";
import { Visualizer } from "../../components/visualizer/visualizer.js";
import { Config } from "../../config/config.js";
import { Browser } from "../../lib/gtdf/components/browser.js";
import { HTML } from "../../lib/gtdf/components/dom.js";
import { UIComponent } from "../../lib/gtdf/components/uicomponent.js";
import { Route } from "../../lib/gtdf/decorators/Route.js";
import { Singleton } from "../../lib/gtdf/decorators/Singleton.js";
import { ViewUI } from "../../lib/gtdf/views/ViewUI.js";
import { Gtdf } from "../../lib/others/gtdf.js";

@Route(["home","", undefined])
@Singleton()
export default class HomeView extends ViewUI {

    private static readonly ID = "home";
    private static readonly MOBILE_CLASS = "mobile";

    public constructor(){
        super({
            type: HTML.VIEW,
            id: HomeView.ID,
            classes: [Gtdf.BOX_COLUMN, Gtdf.BOX_X_START, Gtdf.BOX_Y_CENTER], 
            styles : {
                minHeight: "100vh",
                height: "100%",
                width: "100%"
            }
        });
        
    }

    public async show(params : string[], container : UIComponent) : Promise<void> {

        Config.setTitle(`${Config.Base.app_name} - home`);

        if(Browser.isSmallDevice())
            this.element.classList.add(HomeView.MOBILE_CLASS);

        this.appendTo(container);
    }


}

