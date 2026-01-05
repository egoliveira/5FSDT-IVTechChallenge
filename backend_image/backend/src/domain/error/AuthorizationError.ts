import {AppError} from "./AppError";

export class AuthorizationError extends AppError {
    constructor() {
        super("Forbidden", 403);
    }
}