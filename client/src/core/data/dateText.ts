import { App } from "../../app.js";

export class DateText {

    static DATE_FORMAT = {
        STANDARD : "yyyy/MM/dd",
        EUROPE :  "dd/MM/yyyy",
        SQLITE : "yyyy-MM-dd"
    }

    /**
     * Get the month text for the given number
     * @param month The month number
     * @returns The month as text
     */
    public static month(month: number): string {

        const bundle = App.getBundle().date;
        const array = [
            bundle.JANUARY,
            bundle.FEBRUARY,
            bundle.MARCH,
            bundle.APRIL,
            bundle.MAY,
            bundle.JUNE,
            bundle.JULY,
            bundle.AUGUST,
            bundle.SEPTEMBER,
            bundle.OCTOBER,
            bundle.NOVEMBER,
            bundle.DECEMBER,
        ];

        return array[month];
    }

    /**
     * Add zeros to a given number to match a length
     * @param number The number to normalize
     * @param digits The number of digits to match
     * @returns The normalized number
     */
    public static normalize(number: number, digits: number): string {

        let result = "";
        let missing = digits - (number + "").length;

        for (let i = 0; i < missing; i++) {
            const character = [i];

            if (character)
                result += character;
            else
                result += "0"
        }
        result += number;

        return result;
    }

    /*
    * Format a date in standard format
    * @param date The date to format
    * @returns The formatted date as string
    */
    public static toStandardDate(date : Date) : string {
        return this.dateToString(date,DateText.DATE_FORMAT.STANDARD);    
    }

    /**
     * Format a date in europe format
     * @param date The date to format
     * @returns The formatted date as string
     */
    public static toEuropeDate(date : Date) : string {
        return this.dateToString(date, DateText.DATE_FORMAT.EUROPE);        
    }

    /**
     * Format a date in sqlite format
     * @param date The date to format
     * @returns The formatted date as string
     */
    public static toSQLiteDate(date : Date) : string {
        return this.dateToString(date, DateText.DATE_FORMAT.SQLITE);        
    }

    /**
     * Convert a date to String matching the given format1 
     * @param date The date to format
     * @param format The format to match
     * @returns The formatted date as string
     */
    private static dateToString(date: Date, format : string) : string {
        if (!date) {
            return;
        }

        let result = format;
        result = result.replace("yyyy","" + date.getFullYear());
        result = result.replace("MM","" + (date.getMonth() + 1));
        result = result.replace("dd","" + (date.getDate()));

        return result;    
    }


    public static toLocalizedDateString(date : Date) : string {
        return this.dateToString(date, App.getBundle().date.DATE_FORMAT);
    }

}