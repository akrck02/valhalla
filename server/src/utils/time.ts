export class TimeUtils {

    public static now() : string {
        let date = new Date();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }


}