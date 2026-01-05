import * as z from "zod";
import {BooleanStringZod} from "../general/BooleanStringZod";

export const UpdateUserRequestValidation = z.object({
    name: z.string().trim().min(3).max(255).optional(),
    email: z.string().trim().email().min(3).max(255).optional(),
    active: BooleanStringZod.optional(),
});