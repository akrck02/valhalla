import { CreateBundleEn } from "./english/createBundle_en";
import { CreateBundleEs } from "./spanish/createBundle_es";

export default class TextBundle {

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
            create : CreateBundleEn,
        };
    }

    public static getBundleEs() {
        return {
            create : CreateBundleEs,
        };
    }

}