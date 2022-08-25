
export class EnvironmentVariablesError extends Error {
    constructor(message){
        super(`error environment veriables: [${message}]`);

        this.name = "EnvironmentVariablesError";
    }
}