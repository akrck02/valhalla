import { toHex } from "../data/numeric.js";
/**
 * Convert rgb values to HEX
 * @param r Red color
 * @param g Green color
 * @param b Blue color
 * @returns HEX value of a color.
 * @example
 *     const hex = rgbToHex(255, 0, 0);
 *     console.log(hex); // ff0000
 */
export function rgbToHex(r, g, b) {
    return "#" + toHex(r) + toHex(g) + toHex(b);
}
/**
 * Convert HEX colors to RGB
 * @param hex HEX color
 * @returns RGB value of HEX color
 * @example
 *    const rgb = hexToRgb("#ff0000");
 *    console.log(rgb); // [255, 0, 0]
 */
export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}
