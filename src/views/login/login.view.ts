import { Config } from "../../config/config.js";
import { Text } from "../../lang/text.js";
import { UIComponent } from "../../lib/gtdf/components/uicomponent.js";
import { ViewUI } from "../../lib/gtdf/views/ViewUI.js";
import { Route } from "../../lib/gtdf/decorators/Route.js";
import { Singleton } from "../../lib/gtdf/decorators/Singleton.js";
import { HTML } from "../../lib/gtdf/components/dom.js";
import { Gtdf } from "../../lib/others/gtdf.js";
import { Browser } from "../../lib/gtdf/components/browser.js";
import HomeCore from "./login.view.core.js";
import LoginCore from "./login.view.core.js";

@Route(["","login", undefined])
@Singleton()
export default class LoginView extends ViewUI {

    private static readonly ID = "login";
    private static readonly MOBILE_CLASS = "mobile";

    public constructor(){
        super({
            type: HTML.VIEW,
            id: LoginView.ID,
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
            this.element.classList.add(LoginView.MOBILE_CLASS);
        }


        const loginBox = new UIComponent({
            type: HTML.DIV,
            classes: [Gtdf.BOX_COLUMN, Gtdf.BOX_X_CENTER, Gtdf.BOX_Y_CENTER],
        });

        const title = new UIComponent({
            type: HTML.H1,
            text: Text.login.appName,
            classes: [Gtdf.TEXT_CENTER],
        });

        const subtitle = new UIComponent({
            type: HTML.P,
            text: Text.login.subtitle,
            classes: [Gtdf.TEXT_CENTER],
            styles: {
                marginBottom: "1rem"
            }
        });

        const email = new UIComponent({
            type: HTML.INPUT,
            id: "email",
            attributes: {
                placeholder: Text.login.username,
            },
        });

        const password = new UIComponent({
            type: HTML.INPUT,
            id: "password",
            attributes: {
                type: "password",
                placeholder: Text.login.password,
            },
        });

        const login = new UIComponent({
            type: HTML.BUTTON,
            text: Text.login.login
        });

        login.setEvents({
            click: async () => {
                const emailValue = email.getValue();
                const passwordValue = password.getValue();
                await LoginCore.instance().login(emailValue, passwordValue);
            }
        });

        title.appendTo(loginBox);
        subtitle.appendTo(loginBox);
        email.appendTo(loginBox);
        password.appendTo(loginBox);
        login.appendTo(loginBox);

        loginBox.appendTo(this);

        await LoginCore.instance().registeFakeUser();

        this.appendTo(container);
    }
}