import { HTTPS_METHOD } from "../core/http.js";
/**
 * A class that represents a response from a fetch request.
 * @description Encapsulates the data and methods for easy fetching
 * @author Akrck02
 */
export class Response {
    constructor(response) {
        this.response = response;
        this.successFn = (data) => console.log(data);
        this.errorFn = (err) => console.log("Error in response : ", err);
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
    json() {
        this.response
            .then((res) => res.json().then((json) => this.successFn(json)))
            .catch((err) => this.errorFn(err));
        return this;
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
    text() {
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
    blob() {
        this.response
            .then((res) => res.blob().then((blob) => this.successFn(blob)))
            .catch((err) => this.errorFn(err));
    }
    /**
     * Sets the callback function to be executed when the response is successful.
     * @param success the callback function
     * @returns the response itself
     */
    success(success) {
        this.successFn = success;
        return this;
    }
    /**
     * Sets the callback function to be executed when the response is unsuccessful.
     * @param error the callback function
     * @returns the response itself
     */
    error(error) {
        this.errorFn = error;
        return this;
    }
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
export function efetch(properties) {
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
