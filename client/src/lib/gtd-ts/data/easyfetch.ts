import { HTTPS_METHOD } from "../core/http.js";

/**
 * A class that represents a response from a fetch request.
 * @description Encapsulates the data and methods for easy fetching
 * @author Akrck02
 */
export class Response {
    private response: Promise<globalThis.Response>;
    private successFn: Function;
    private errorFn: Function;

    constructor(response: Promise<globalThis.Response>) {
        this.response = response;
        this.successFn = (data) => console.log(data);
        this.errorFn = (err) => console.log("Error in response : ", err);
    }


    getResponse(): Promise<globalThis.Response> {
        return this.response;
    }

    /**
     *  Executes tne callback function with the response json as an argument.
     * @returns the response itself
     * @description This method is useful for fetching json files.
     * @example
     *      Response
     *      .success(text => console.log(text))
     *      .error(err => console.log(err))
     *      .json();
     *
     */
    public json(): Response {
        this.response
            .then((res) => res.json().then((json) => this.successFn(json)))
            .catch((err) => this.errorFn(err));
        return this;
    }
    

    /**
     *  Executes tne callback function with the response json as an argument.
     * @returns the response itself
     * @description This method is useful for fetching json files.
     * @example
     *      Response
     *      .success(text => console.log(text))
     *      .error(err => console.log(err))
     *      .json();
     *
     */
    public async jsonPromise(): Promise<any> {
        await this.response
            .then((res) => res.json().then((json) => this.successFn(json)))
            .catch((err) => this.errorFn(err));
    }

    /**
     * Executes the callback function with the response text as an argument.
     * @returns the response itself
     * @description This method is useful for fetching text files.
     * @example
     *      Response
     *      .success(text => console.log(text))
     *      .error(err => console.log(err))
     *      .text();
     *
     */
    public text(): Response {
        this.response
            .then((res) => res.text().then((text) => this.successFn(text)))
            .catch((err) => this.errorFn(err));
        return this;
    }

    /**
     * Executes the callback function with the response blob as an argument.
     * @returns the response itself
     * @description This method is useful for fetching binary files.
     * @example
     *     Response
     *     .success(blob => console.log(blob))
     *     .error(err => console.log(err))
     *     .blob();
     */
    public blob() {
        this.response
            .then((res) => res.blob().then((blob) => this.successFn(blob)))
            .catch((err) => this.errorFn(err));
    }

    /**
     * Sets the callback function to be executed when the response is successful.
     * @param success the callback function
     * @returns the response itself
     */
    public success(success: Function): Response {
        this.successFn = success;
        return this;
    }

    /**
     * Sets the callback function to be executed when the response is unsuccessful.
     * @param error the callback function
     * @returns the response itself
     */
    public error(error: Function): Response {
        this.errorFn = error;
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
export interface EasyFetchProperties {
    method: HTTPS_METHOD;
    parameters: object;
    url: string;
}

/**
 * @param properties fetch properties
 * @returns a Response object encapsulating the response.
 * @description This method is useful for fetching data from the server.
 * @example
 *     const response = EasyFetch(
 *       {
 *          method: HTTPS_METHOD.GET,
 *          parameters: {
 *             id: "1Y123",
 *             name: "Akrck02"
 *          },
 *          url: 'https://example.org/api/todos/1'
 *       }
 *     );
 *     response.json();
 */
export function efetch(properties: EasyFetchProperties): Response {
    let options = {
        method: properties.method,
        headers: { "Content-type": "application/json; charset=UTF-8" },
    };

    if (properties.method === HTTPS_METHOD.POST) {
        options["body"] = JSON.stringify(properties.parameters);
    }

    const promise = fetch(properties.url, options);
    const response = new Response(promise);
    return response;
    
}