import { HTTPS_METHOD } from "./http.js";

/**
 * A class that represents a response from a fetch request.
 * @description Encapsulates the data and methods for easy fetching
 * @author Akrck02
 */
export class Response {

    private response: Promise<globalThis.Response>;
    private errorFunction: Function;
    private statusFunctions : Map<number,Function>;
    private middleware : Function[];

    constructor(response: Promise<globalThis.Response>) {
        this.response = response;
        this.middleware = [];
        this.errorFunction = (err) => console.error("Error in response : ", err);
        this.statusFunctions = new Map();
        this.statusFunctions.set(200, (res) => console.log("Success", res));
    }

    /**
     * Executes the callback functions corresponding to the status code getting the response as a json object.
     * in case of an error, the error function will be executed.
     * 
     * @example
     * await EasyFetch.get({
     *   url: "https://mydomain/json/1",
     *   parameters: {
     *        name: "John",
     *   },
     *   headers: {
     *      "Content-type": "application/json",
     *   }
     * })
     * .status(200,(response) => {
     *    console.log(response);
     * })
     * .status(404,(response) => {
     *   console.log("NOT FOUND: ",response);
     * })
     * .error((error) => {
     *   console.error(error);
     * })
     * .json()
     */
    public async json(){
        await this.response
        .then(async (res) => {
            
            if(this.statusFunctions.has(res.status)){
                let json = await res.json();
                await this.statusFunctions.get(res.status)(json);
            }                           
        
        })
        .catch((err) => this.errorFunction(err));
    }

    /**
     * Executes the callback function corresponding to the status code getting the response as a text.
     * in case of an error, the error function will be executed.
     * @example
     * await EasyFetch.get({
     *   url: "https://mydomain/text/1",
     *   parameters: {
     *        name: "John",
     *   },
     *   headers: {
     *      "Content-type": "text/plain",
     *   }
     * })
     * .status(200,(response) => {
     *    console.log(response);
     * })
     * .status(404,(response) => {
     *   console.log("NOT FOUND: ",response);
     * })
     * .error((error) => {
     *   console.error(error);
     * })
     * .text()
     */
    public async text(){
        await this.response
        .then(async (res) => {
            
            if(this.statusFunctions.has(res.status)){
                let text = await res.text();
                await this.statusFunctions.get(res.status)(text);
            }

        })
        .catch((err) => this.errorFunction(err))
}
    
    /**
     * Executes the callback function corresponding to the status code getting the response as a blob.
     * in case of an error, the error function will be executed.
     * @example
     * await EasyFetch.get({
     *  url: "https://mydomain/blob/1",
     * parameters: {
     *     name: "John",
     * },
     * headers: {
     *    "Content-type": "application/octet-stream",
     * }
     * })
     * .status(200,(response) => {
     *   console.log(response);
     * })
     * .status(404,(response) => {
     *  console.log("NOT FOUND: ",response);
     * })
     * .error((error) => {
     *  console.error(error);
     * })
     * .blob()
     */
    public async blob() {
        await this.response
        .then(async (res) => {
                
                if(this.statusFunctions.has(res.status)){
                    let blob = await res.blob();
                    await this.statusFunctions.get(res.status)(blob);
                }

            }
        )
        .catch((err) => this.errorFunction(err));
    }

    /**
     * Sets the callback function to be executed corresponding to the status code.
     * @param code the status code or list of status codes
     * @param success the callback function
     * @returns the response itself
     */
    public status(code : number | number[], func: Function): Response {

        let numbers : number[] = [];

        if(typeof code === "number")
        {
            numbers.push(code);
        } else {
            numbers = code;
        }

        for(let i = 0; i < numbers.length; i++)
        {
            this.statusFunctions.set(numbers[i], func);
        }
        
        return this;
    }


    /**
     * Sets the callback function to be executed when the response is unsuccessful.
     * @param error the callback function
     * @returns the response itself
     */
    public error(error: Function): Response {
        this.errorFunction = error;
        return this;
    }
}

/**
 * Properties for fetching data from server.
 * @interface FetchProperties
 * @property {string} url - Url of the server.
 * @property {HTTPS_METHOD} method - Method of the request.
 * @property {string} body - Body of the request.
 *
 */
export interface FetchProperties {
    method?: HTTPS_METHOD;
    parameters: object | FormData;
    url: string;
    charset?: string;
    contentType?: string;
    headers?: object;
}

export class EasyFetch {

    private static middleware : Function[] = [];

    public static get(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.GET,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static post(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.POST,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static put(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.PUT,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static delete(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.DELETE,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static patch(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.PATCH,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static head(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.HEAD,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static options(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.OPTIONS,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static connect(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.CONNECT,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static trace(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.TRACE,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    public static update(properties : FetchProperties): Response {
        return EasyFetch.exec({
            method: HTTPS_METHOD.UPDATE,
            parameters: properties.parameters,
            url: properties.url,
            headers: properties.headers,
            charset: properties.charset,
            contentType: properties.contentType
        });
    }

    /**
     * Adds a middleware function to be executed before the request is sent.
     * @param func the middleware function
     */
    public static addMiddleware(func: Function) {
        EasyFetch.middleware.push(func);
    }

    /**
     * Removes a middleware function.
     * @param func the middleware function
     * @returns true if the function was removed, false otherwise
     */

    private static exec(properties: FetchProperties): Response {

        let options = {
            method: properties.method,
            headers: { 
                "Content-type": `${properties.contentType || "application/json"};charset=${properties.charset || "UTF-8"}`,
                "mode": "cors",
                "Sec-Fetch-Site": "cross-site",
            },
        };
    
        properties.headers && Object.assign(options.headers, properties.headers);
        
        if (properties.method !== HTTPS_METHOD.GET) {
        
        
            if(properties.parameters instanceof FormData){
                options["body"] = properties.parameters;
                options.headers["Content-type"] = `multipart/form-data;charset=${properties.charset || "UTF-8"}`;
            } else {
                options["body"] = JSON.stringify(properties.parameters);
            }
        }
    
        const promise = fetch(properties.url, options);
        return  new Response(promise);
        
    }





}
