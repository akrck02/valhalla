export class InitializeError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InitializeError.prototype);
    }
}