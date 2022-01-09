
/**
 * converts a number from decimal to hexadecimal
 * @param number decimal number
 * @description This method is useful for converting decimal numbers to hexadecimal numbers.
 * @returns hexadecimal number (inside a String)
 * @example
 *      const number = 255;
 *      const hex = toHex(number);
 *      console.log(hex); // ff
 */
export function toHex (number : number) : string {
    var hex = number.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

/**
 * converts a number from hexadecimal to decimal
 * @param number decimal number
 * @description This method is useful for converting hexadecimal numbers to decimal numbers.
 * @returns  octal number (inside a String)
 * @example
 *     const number = 255;
 *     const octal = toOctal(number);
 *     console.log(octal); // 377
 */
export function toOctal (number : number) : string {
    var octal = number.toString(8);
    return octal.length == 1 ? "0" + octal : octal;
} 

/**
 * converts a number from decimal to binary
 * @param number decimal number
 * @description This method is useful for converting decimal numbers to binary numbers.
 * @returns binary number (inside a String)
 * @example
 *     const number = 255;
 *      const binary = toBinary(number);
 *      console.log(binary); // 11111111
 */
export function toBinary (number : number) : string {
    var binary = number.toString(2);
    return binary.length == 1 ? "0" + binary : binary;
}

