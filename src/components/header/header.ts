import { Config } from "../../config/config.js";
import { HTML } from "../../lib/gtdf/components/dom.js";
import { UIComponent } from "../../lib/gtdf/components/uicomponent.js";
import { SocialIcons } from "../../lib/gtdf/resources/SocialIcons.js";
import { Gtdf } from "../../lib/others/gtdf.js";

export default class Header extends UIComponent {
    private static readonly ID = "header";


    public constructor(){
        super({
            type: HTML.DIV,
            id: Header.ID,
            classes: [Gtdf.BOX_COLUMN, Gtdf.BOX_X_CENTER, Gtdf.BOX_Y_CENTER],
            styles: {
                width: "100%",
                minHeight: "41.5vh",
                background: "#fff",
            }
        });
        this.configure();
    }

    public async configure() : Promise<void> {
    
        const profilePicSize = 10;
        const profilePicture = new UIComponent({
            type: HTML.IMG,
            styles: {
                width: `${profilePicSize}rem`,
                height:  `${profilePicSize}rem`,
                borderRadius: "50%"
            },
            attributes : {
                src : `${Config.Path.images}logo.jpg`
            }
        });

        const title = new UIComponent({
            type: HTML.H1,
            text: Config.Base.app_name,
            classes: [Gtdf.TEXT_CENTER],
            styles: {
                marginTop: "1.5rem",
                color: "#444"
            }
        });

        const socialMediaBar = this.createSocialMediaButtonBar(this);
        

        profilePicture.appendTo(this);
        title.appendTo(this);
        socialMediaBar.appendTo(this);
    }

    private createSocialMediaButtonBar(container : UIComponent) : UIComponent {
        const bar = new UIComponent({
            type: HTML.DIV,
            classes: [Gtdf.BOX_ROW, Gtdf.BOX_X_CENTER, Gtdf.BOX_Y_CENTER],
            styles: {
                width: "100%",
                height: "5vh",
                marginTop: "1.5rem"
            }
        });

        const socialMedia = {
            twitter: "https://twitter.com/Skyleriearts",
            instagram: "https://www.instagram.com/skyleriie/",
            telegram: "https://t.me/skylerie",
            patreon: "https://www.patreon.com/skylerie",
        }

        for (const media in socialMedia) {
            const url = socialMedia[media];
                
            const button = this.createSocialMediaButton(bar, media, url);
            button.appendTo(bar);
        }


        return bar;
    }

    public createSocialMediaButton(container : UIComponent, icon : string, url : string) : UIComponent {
        const button = new UIComponent({
            type: HTML.A,
            classes: [Gtdf.BOX_CENTER],
            styles: {
                width: "5vh",
                height: "5vh",
                margin: "0 0.5rem",
                background: "var(--background)",
                borderRadius: "50%",
            },
            attributes : {
                href: url
            }
        });

        const iconComponent = SocialIcons.get(icon, {
            fill: "#444",
            size: "2rem",
            classes: ["material-icons"],
        });


        iconComponent.appendTo(button);
        button.appendTo(container);
        return button;
    }

}
