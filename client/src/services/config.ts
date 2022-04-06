import { HTTPS_METHOD } from "../lib/gtd-ts/core/http.js";
import { efetch, Response } from "../lib/gtd-ts/data/easyfetch.js";

export class ConfigService { 
    
    
    static getAppConfig() : Response {
        const response = efetch({
            method: HTTPS_METHOD.POST,
            url: "../version.json",
            parameters : {

            }
        });
        
        return response;
    }


    


}