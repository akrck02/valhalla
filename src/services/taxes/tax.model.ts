
interface ITaxes {
    contingenciasComunes : number,
    atur : number,
    fp : number,
    maxSegSocial : number
}

export interface SalaryTime {
    salary : number;
    startDate : Date;
    endDate : Date;
}

//BRUTO/12 < x

export default class TaxModel {

    private static readonly DEFAULT_PAYMENT_NUMBER = 14;
    private static readonly DEFAULT_TAXES_MONTH_NUMBER = 12;

    public paymentNumber : number;
    public taxesMonthNumber : number;

    public irpfRanges : Map<string, number>;
    public taxes : ITaxes;

    constructor(
        paymentNumber : number = TaxModel.DEFAULT_PAYMENT_NUMBER , 
        taxesMonthNumber : number = TaxModel.DEFAULT_TAXES_MONTH_NUMBER,
    ) {
        this.paymentNumber = paymentNumber;
        this.taxesMonthNumber = taxesMonthNumber;
    }


    checkIfDataIsLoaded() {

        if(this.irpfRanges === undefined || this.taxes === undefined) {
            throw new Error("IRPF_RANGES or TAXES are undefined, please load the data first");
        }
    }

    /**
     * Calculate the salary without taxes
     * @param salary The salary itself
     * @returns {number} The salary without taxes
     */
    calcWithTaxes(salary : number) : number {

        this.checkIfDataIsLoaded();

        if(salary <= 0){
            return 0;
        }

        const irpf = this.getIrpfValue(salary);
        const contingenciasComunes = this.getContingenciasComunesValue(salary);
        const atur = this.getAturValue(salary);
        const fp = this.getFpValue(salary);

        const total_deductions = (irpf + contingenciasComunes + atur + fp);
        return Math.ceil(((salary / this.paymentNumber) - total_deductions) * 100) / 100;
    }


    /**
     * Calculate the extra payment
     * @param salary The salary itself
     * @returns {number} The extra payment
     */
    extraPayment(salary : number) : number {

        this.checkIfDataIsLoaded();

        if(salary <= 0){
            return 0;
        }

        const irpf = this.getIrpfValue(salary);
        return Math.ceil(((salary / this.paymentNumber) - irpf) * 100) / 100;

    }


    extraPaymentWithMultipleSalaries(salaries : SalaryTime[]) {

        this.checkIfDataIsLoaded();

        if(salaries === undefined || salaries.length === 0) {
            return 0;
        }

        // salario * dias / 180
        let totalSalary = 0;
        for (const salary of salaries) {

            if(salary.startDate.getFullYear() !== salary.endDate.getFullYear()) {
                throw new Error("Start date and end date must be in the same year");
            }

            if(salary.startDate > salary.endDate) {
                throw new Error("Start date is greater than end date");
            }
            
            let extraPayment = this.extraPayment(salary.salary);

            // every month has 30 days
            let totalDays = (salary.endDate.getMonth() - salary.startDate.getMonth()) * 30;                      
            totalDays -= salary.startDate.getDate();
            totalDays += Math.min(salary.endDate.getDate(), 30);
            totalDays = Math.max(totalDays, 0);

            totalSalary += extraPayment * totalDays / 180;
            
        }

        return totalSalary;
    }

    /**
     * Get the irpf on the salary
     * @param {number} salary The salary itself
     * @returns {number} The irpf value
     */
    getIrpf(salary : number) : number {

        this.checkIfDataIsLoaded();

        if(salary <= 0){
            return 0;
        }

        let irpf = undefined;
	   
        // Get irpf on ranges
        for (const minimum in this.irpfRanges) {

            const range = parseInt(minimum);
            if (salary <= range) {
                return irpf;
            }

            irpf = this.irpfRanges[minimum]; 
        }

        return irpf;
    }    

    /**
     * Get the irpf value on the salary
     * @param {number} salary The salary itself
     * @returns {number} The irpf value calculated on the salary and the payment number
     */
    getIrpfValue(salary : number) : number {

        if(salary <= 0){
            return 0;
        }

        return (salary * (this.getIrpf(salary) / 100)) / this.paymentNumber;
    }

    /**
     * Get the contingencias comunes value on the salary
     * @param {number} salary The salary itself 
     * @returns {number} The contingencias comunes value calculated on the salary and the payment number
     */
    getContingenciasComunesValue(salary) : number {

        if(salary <= 0){
            return 0;
        }

        return (salary * (this.taxes.contingenciasComunes / 100)) / this.taxesMonthNumber;
    }

    /**
     * Get the atur value on the salary
     * @param {number} salary The salary itself
     * @returns {number} The atur value calculated on the salary and the payment number
     */
    getAturValue(salary : number) : number {
        
        if(salary <= 0){
            return 0;
        }

        return (salary * (this.taxes.atur / 100)) / this.taxesMonthNumber;
    }

    /**
     * Get the fp value on the salary
     * @param {*} salary The salary itself
     * @returns {number} The fp value calculated on the salary and the payment number
     */
    getFpValue(salary) : number {

        if(salary <= 0){
            return 0;
        }
        
        return (salary * (this.taxes.fp / 100)) / this.taxesMonthNumber;
    }


    isDefaultPaymentNumber() {
        return this.paymentNumber === TaxModel.DEFAULT_PAYMENT_NUMBER;
    }

    clear() {
        this.irpfRanges = undefined;
        this.taxes = undefined;
    }


}