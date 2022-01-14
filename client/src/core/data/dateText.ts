import { APP } from "../../app.js";

export class DateText {
    
    public static month(month : number) : string {
        
        const bundle = APP.bundle.dateBundle;
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
}