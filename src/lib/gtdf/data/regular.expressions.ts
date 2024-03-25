export default class RegularExpressions {

    /**
     * Get if a given email is valid
     * @param email email to check
     * @description This method is useful for checking if an email is valid.
     * @returns true if the email is valid, false otherwise
     * @example
     *      const isValid = isValidEmail('mymail_$%@me');
     *      console.log(isValid);  // false
     */
    public static isValidEmail(email : string) : boolean {
        let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(!regex.test(email)){
            return false;
        } 
        return true;
    } 

    /**
     * Get if a given string is a valid url
     * @param url url to check
     * @description This method is useful for checking if a string is a valid url.
     * @returns true if the url is valid, false otherwise
     * @example
     *      const isValid = isValidUrl('http://www.google.com');
     *      console.log(isValid); // true
     */
    public static isValidUrl(url : string) : boolean {
        let regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex.test(url)){
            return false;
        } 
        return true;
    }

} 