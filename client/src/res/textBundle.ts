import { DateBundleEn } from "./english/dateBundle_en.js";
import { DateBundleEs } from "./spanish/dateBundle_es.js";

export class TextBundle {

    public dateBundle : any;

    public constructor (lang : string) {

      switch (lang) {
        case "en":
            this.dateBundle = DateBundleEn
            break;

        case "es":
            this.dateBundle = DateBundleEs
            break;

        default:
            this.dateBundle = DateBundleEn
            break;
      }

    }


}