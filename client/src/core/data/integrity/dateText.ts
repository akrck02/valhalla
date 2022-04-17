import { App } from "../../../app.js";

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
     * Get the month text for the given number
     * @param month The month number
     * @returns The month as text
     */
        public static weekDay(day: number): string {

            const bundle = App.getBundle().date;
            const array = [
                bundle.SUNDAY,
                bundle.MONDAY,
                bundle.TUESDAY,
                bundle.WEDNESDAY,
                bundle.THURSDAY,
                bundle.FRIDAY,
                bundle.SATURDAY,
            ];
    
            return array[day];
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
        result = result.replace("yyyy","" + this.normalize(date.getFullYear(),4));
        result = result.replace("MM","" + this.normalize(date.getMonth() + 1, 2));
        result = result.replace("dd","" + this.normalize(date.getDate(),2));

        return result;    
    }


    public static toLocalizedDateString(date : Date) : string {
        return this.dateToString(date, App.getBundle().date.DATE_FORMAT);
    }





    /**
     * Get the user-friendly text for a given date
     * @param date Date to get text for
     * @returns a string representing the date
     */
     public static getTimeText(date: Date): string {

        const today = new Date();

        // if today and 6 hours or less
        if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate() && date.getHours() <= today.getHours() + 6) {
            const diff = date.getHours() - today.getHours();

            if (diff <= 6) {
                if (diff > 0) return `${diff}h`;
                //else return App.getBundle().tasks.NOW;
            }
        }

        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (today.toString() === date.toString()) {
            return App.getBundle().tasks.TODAY;
        } else {

            today.setDate(today.getDate() + 1);
            if (date.toString() === today.toString()) { return App.getBundle().tasks.TOMORROW; }
            else { 
                today.setDate(today.getDate() - 2 );
                if (date.toString() === today.toString()) { return App.getBundle().tasks.YESTERDAY; }
                return DateText.toLocalizedDateString(date) 
            
            }
        }
    }

}