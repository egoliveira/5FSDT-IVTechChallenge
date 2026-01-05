import {AppError} from "./AppError";

export class ExistingEntityError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}