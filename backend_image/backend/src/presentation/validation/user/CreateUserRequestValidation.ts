import * as z from "zod";
import {BooleanStringZod} from "../general/BooleanStringZod";

export const CreateUserRequestValidation = z.object({
    user: z.object({
        username: z.string().trim().min(3).max(100),
        name: z.string().trim().min(3).max(255),
        email: z.string().trim().email().min(3).max(255),
        password: z.string().trim().min(8).max(100),
    }),
    userRoles: z.object({
        admin: BooleanStringZod,
        teacher: BooleanStringZod,
        student: BooleanStringZod
    })
});

export type CreateUserRequestUser = {
    username: string;
    name: string;
    email: string;
    password: string;
}

export type CreateUserRequestUserRoles = {
    admin: boolean;
    teacher: boolean;
    student: boolean;
}