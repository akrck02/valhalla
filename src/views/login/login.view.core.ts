import { ViewCore } from "../../lib/gtdf/views/ViewCore.js";
import { ISingleton, Singleton } from "../../lib/gtdf/decorators/Singleton.js";
import { StaticImplements } from "../../lib/gtdf/core/static/static.interface.js";
import { EasyFetch } from "../../lib/gtdf/connection/easyfetch.js";
import { Config, Configuration } from "../../config/config.js";
import Utils from "../../core/utils.js";

@Singleton()
@StaticImplements<ISingleton<LoginCore>>()
export default class LoginCore extends ViewCore {

    public static _instance: LoginCore;
    public static instance;

    constructor() {
        super();
    }


    pingApi() {
        
        EasyFetch.get({
            url: Config.Api.url,
            parameters: {}
        }).json().then((data) => {
            console.log(data);
        }).catch((error) => {
            console.log(error);
        });

    }

    /**
     * Register a fake user
     */
    async registeFakeUser() {

        let response = {};
        await EasyFetch.put({
            url: Config.Api.register,
            parameters: {
                email: "akrck02@gmail.com",
                password: "$Verysecurepassword123",
                username: "akrck02"
            }
        }).status([200, 201], (json) => {
            response = json;
        })
        .status([400,409], (json) => {
           alert({
                title: "Error while registering user",
                icon : "lock",
                message: json.message
           });
        })
        .json();

        console.log(response);
    }


    /**
     * Login a user
     * @param email the email 
     * @param password the password
     * @returns the response from the server
     */
    async login(email: string, password: string) {
        let response = {};
        await EasyFetch.post({
            url: Config.Api.login,
            parameters: {
                email: email,
                password: password
            }
        })
        .status([200, 201], (json) => {

            Config.setConfigVariable("auth", json?.response?.auth);
            Config.setConfigVariable("email", json?.response?.email);
            console.log(json);

            alert({
                title: "Success",
                icon : "lock",
                message: json.message
            });

            Utils.redirect(Config.Views.home, [], true);
            
        })
        .status([400, 401, 403], (json) => {
            alert({
                title: "Error while logging in",
                icon : "lock",
                message: json.message
            });
        }).json().catch((error) => {
            console.log(error);
        });


        return response;
    }


    public static async checkIfTokenIsValid(){
        const token = await Config.getConfigVariable("auth")
        if(!token){
            return;
        }

        await EasyFetch.post({
            url: Config.Api.login_auth,
            parameters: {
                email: await Config.getConfigVariable("email")
            },
            headers: {
                Authorization: `${token}`
            }
        }).status([200, 201], (json) => {
            Utils.redirect(Config.Views.home, [], true);
        }).status([403],(error) => {
            console.log(error);
        })
        
        .json();


    }
}

