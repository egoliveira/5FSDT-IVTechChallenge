export class AppError extends Error {
    readonly status: number;

    constructor(message: string, status: number = 400) {
        super(message);

        this.status = status;
    }
}