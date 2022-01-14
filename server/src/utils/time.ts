export class TimeUtils {

    public static now() : string {
        return TimeUtils.print(new Date());
    }

    public static print(date : Date) : string {
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }



}