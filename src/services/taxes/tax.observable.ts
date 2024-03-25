import { Observable } from "../../lib/gtdf/core/observable/observer.js";
import TaxModel from "./tax.model.js";

export default class TaxObservableModel extends Observable {

    constructor() {
        super();
        this.content = new TaxModel();
    }

}