import * as z from "zod";

export const LoginRequestValidation = z.object({
    username: z.string().trim().min(3).max(100),
    password: z.string().trim().min(8).max(100)
});