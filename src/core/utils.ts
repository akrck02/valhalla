import { Config } from "../config/config.js";

export default class Utils  {

    public static copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
      
        /**
        alert({
                icon: "content_copy",
                message : App.getBundle().system.COPIED_TO_CLIPBOARD,
        })
        **/
    }   

    /**
     * Redirect to url with '/' separated params
     * @param url The URL to be redirected to
     * @param params The parameter Array
     */
    public static redirect(url: string, params: string[], force :boolean = false) {

        if(force) {
            location.href = Config.Views.blank;
        }
        
        url += params.join("/");
        location.href = url;
    }


        

}
