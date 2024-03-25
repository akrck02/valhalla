import { Config } from "../config/config.js";
import { Language } from "../lang/language.js";
import { StringMap } from "../lib/gtdf/data/strings.js";

export default class LanguageService {

       /**
     * Get available languages to add to the select
     * @returns The available languages
     */
       public static getLanguages() : StringMap {
        const languages = Language;
        const formatted = {};

        const list = Object.keys(languages) 

        list.forEach(lang => {
            formatted[lang.toUpperCase().substring(0,1) + lang.toLowerCase().substring(1)] = languages[lang];
        });

        return formatted;
    }

    /**
     * Get available languages to add to the select
     * @returns The available languages with names
     */
    public static getAvailableLanguagesWithNames() : StringMap {
        const languages = Language;
        return languages;
    }

    /**
     * Set the app language and reload
     * @param selected The selected language
     */
    public static setLanguage(selected :string){        
        Config.setLanguage(selected);
    } 
}