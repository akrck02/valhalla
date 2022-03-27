import { DateBundleEn } from "./english/dateBundle_en.js";
import { OsBundleEs } from "./english/osBundle_es.js";
import { DateBundleEs } from "./spanish/dateBundle_es.js";
import { OsBundleEn } from "./spanish/osBundle_en.js";

export class TextBundle {

    public dateBundle : any;
    public osBundle : any;

    public static get (lang : string) {

      switch (lang) {
        case "en":
            return this.getBundleEn();
        case "es":
            return this.getBundleEs();
        default:
            return this.getBundleEn();
      }

    }


    public static getBundleEn() {
        return {
            dateBundle : DateBundleEn,
            osBundle : OsBundleEn,
        };
    }

    public static getBundleEs() {
        return {
            dateBundle : DateBundleEs,
            osBundle : OsBundleEs,
        };
    }

}