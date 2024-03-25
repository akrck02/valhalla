import Numeric from "./numeric.js";

export default class Colors {

    /**
     * Convert HEX colors to RGB
     * @param hex HEX color
     * @returns RGB value of HEX color
     * @example
     *    const rgb = hexToRgb("#ff0000");
     *    console.log(rgb); // [255, 0, 0]
     */
    public static hexToRgb(hex): { r: number; g: number; b: number } {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    }

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
    public static rgbToHex(r: number, g: number, b: number): string {
        return "#" + Numeric.toHex(r) + Numeric.toHex(g) + Numeric.toHex(b);
    }

}