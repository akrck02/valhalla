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
    private visualizer : Visualizer;

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

        if(Browser.isSmallDevice()){
            this.element.classList.add(HomeView.MOBILE_CLASS);
        }

        this.visualizer = new Visualizer();

        const header = new Header();
        header.appendTo(this);

        const imagesByCategoryList = {
            "Dark souls series": [
                "https://i.pinimg.com/originals/d6/30/4c/d6304c4d2b43f97edd575c94a84dc040.jpg",
                "https://cdn.domestika.org/c_fit,dpr_auto,f_auto,q_80,t_base_params,w_820/v1597580595/content-items/005/513/873/color_2-original.jpg?1597580595",
                "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6460b554749551.5967ba465545f.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCmKKxf5Zyu5ugf0Mken07SZ_JTUYTzmtsw&s",
                "https://embed.pixiv.net/spotlight.php?id=7105&lang=en",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxdg8P5S0f8zM-O8IxnjEBGQ0GImYJ1YpSow&s"
            ],
            "Elden ring series" : [
                "https://i.redd.it/tsjmyj9xqlc71.jpg",
                "https://64.media.tumblr.com/dc8de7467d6140bf8942a4d0ee893f4f/f1be76b3b0903837-2b/s2048x3072_c0,18750,100000,56250/e44699c87be2eac5b8612b58c6577b1721818363.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcFWtlBJuBbEVCNNptnmSfwFj7wayIcjxy8A&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu9D2SCgwIM-tW3xAb12BK2VY1c72UsX6MKQ&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpXCyTkTsZMmCtvaX2M-AyZJ-etgpKBg1vBQ&s",
                "https://embed.pixiv.net/artwork.php?illust_id=98462930&mdate=1652976993",
                "https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/08/yuyu-wong-.jpg"
            ],
            "The legend of Zelda series" : [
                "https://i.pinimg.com/736x/51/2f/19/512f19f2f0b1f226e96d1880523fc5fe.jpg",
                "https://i.ytimg.com/vi/ocevIM6imbk/maxresdefault.jpg",
                "https://mir-s3-cdn-cf.behance.net/project_modules/hd/224fdd20594743.562eded4a2a30.jpg",
                "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/07/zelda_link_tears_of_the_kingdom_ghibli.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Fihav-1R0FProy3QEYXvEeCAra1v7ygkwQ&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJvNu_pv1y016jhiLRXZTb8qX4eLvXbWllaA&s",
                "https://cdnb.artstation.com/p/assets/images/images/035/453/613/original/brendan-sullivan-link.gif?1614987433",
                "https://dthezntil550i.cloudfront.net/yl/latest/yl2105161820253160016932460/1280_960/8a610cf4-a1e9-42a2-81fe-c549b057f910.png",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW9KuCHEDJ2rwiMBymE94oYIMcJ3ejNqbnRg&s"
            ]

        }

        for (const category in imagesByCategoryList) {
                const images = imagesByCategoryList[category];
                const gallery = new Gallery(category, images);
                gallery.appendTo(this);
        }
        

        this.appendTo(container);
    }


}

