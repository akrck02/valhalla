export default class Time {

    /**
     * Sleep for the given time
     * @param ms time in milliseconds
     * @description This method is useful for sleeping for the given time.
     * @returns Promise that resolves after the given time
     * @example
     *      const time = 1000;
     *      const promise = sleep(time);
     *      promise.then(() => console.log('slept for ' + time + 'ms'));
     *     // prints 'slept for 1000ms' after 1 second
     */
    public static sleep (ms : number) : Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    /**
     * Resolve after the given time
     * @param func function to execute
     * @param time time in milliseconds
     * @description This method is useful for resolving after the given time.
     * @returns Promise that resolves after the given time
     * @example
     *     const time = 1000;
     *     resolveAfter(() => console.log('resolved after ' + time + 'ms'), time);
     *     // prints 'resolved after 1000ms' after 1 second
     */
    public static resolveAfter (func, time : number) {
        Time.sleep(time).then(func);
    };

}