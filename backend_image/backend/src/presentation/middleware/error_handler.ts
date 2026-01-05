import {NextFunction, Request, Response} from "express";
import {ZodError} from "zod";
import {AppError} from "../../domain/error/AppError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    let status = 500;
    let message = err.message || 'Internal Server Error';

    if (err instanceof ZodError) {
        const zodError = err as ZodError;

        const messages = new Array<string>();

        zodError.errors.forEach((value, index, array) => {
            messages.push(`${value.message} (path: ${value.path.join('/')})`);
        });

        message = messages.join('\n');

        status = 400;
    } else if (err instanceof AppError) {
        status = err.status;
    }

    res.status(status).json({
        message: message
    })
}