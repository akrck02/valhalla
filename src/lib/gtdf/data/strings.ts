export default class Strings {

    public static toNormalCase(str:string) : string {
        
        if(str.length < 2){
            return str.toUpperCase();
        }

        return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase();; 
    }

}

export interface StringMap {
    [key:string] : string
}
