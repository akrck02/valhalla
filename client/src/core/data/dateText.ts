import { App } from "../../app.js";

export class DateText {

    public static month(month: number): string {

        const bundle = App.getBundle().dateBundle;
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


    public static toDateString(date: Date): string {

        if (!date) {
            return;
        }

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const result = this.normalize(year, 4) + " / " + this.normalize(month, 2) + " / " + this.normalize(day, 2);
        return result;
    }


    

}