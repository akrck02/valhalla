import { AboutBundleEn } from "./english/aboutBundle_en.js";
import { CalendarBundleEn } from "./english/calendarBundle_en.js";
import { ConfigurationBundleEn } from "./english/configurationBundle_en.js";
import { DateBundleEn } from "./english/dateBundle_en.js";
import { NewTaskBundleEn } from "./english/newTaskBundle_en.js";
import { OsBundleEs } from "./spanish/osBundle_es.js";
import { SyncBundleEn } from "./english/syncBundle_en.js";
import { SystemBundleEn } from "./english/systemBundle_en.js";
import { TaskBundleEn } from "./english/taskBundle_en.js";
import { AboutBundleEs } from "./spanish/aboutBundle_es.js";
import { CalendarBundleEs } from "./spanish/calendarBundle_es.js";
import { ConfigurationBundleEs } from "./spanish/configurationBundle_es.js";
import { DateBundleEs } from "./spanish/dateBundle_es.js";
import { NewTaskBundleEs } from "./spanish/newTaskBundle_es.js";
import { OsBundleEn } from "./english/osBundle_en.js";
import { SyncBundleEs } from "./spanish/syncBundle_Es.js";
import { SystemBundleEs } from "./spanish/systemBundle_es.js";
import { TaskBundleEs } from "./spanish/taskBundle_es.js";
import { NoteBundleEn } from "./english/noteBundle_en.js";
import { NoteBundleEs } from "./spanish/noteBundle_es.js";

export class TextBundle {

    public static get (lang : string) {
      //lang = "es";
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
            system : SystemBundleEn,
            date : DateBundleEn,
            os : OsBundleEn,
            calendar : CalendarBundleEn,
            configuration : ConfigurationBundleEn,
            newTask : NewTaskBundleEn,
            about : AboutBundleEn,
            tasks : TaskBundleEn,
            notes : NoteBundleEn,
            sync : SyncBundleEn, 
        };
    }

    public static getBundleEs() {
        return {
            system : SystemBundleEs,
            date : DateBundleEs,
            os : OsBundleEs,
            calendar : CalendarBundleEs,
            configuration : ConfigurationBundleEs,
            newTask : NewTaskBundleEs,
            about : AboutBundleEs,
            tasks : TaskBundleEs,
            notes : NoteBundleEs,
            sync : SyncBundleEs,
        };
    }

}