import * as z from "zod";

export const ChangeUserPasswordRequestValidation = z.object({
    password: z.string().trim().min(8).max(100),
});
