import { Database } from "./db";
import Model from "./model/model";

export class Sync implements Model {

    public static sync(db: Database, req: Request, res: Response) : Promise<any> {
        
        const response = new Promise(resolve => resolve({success: true}));
        return response;
    }
}