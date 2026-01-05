import * as z from "zod";

export const UserRequestValidation = z.coerce.number().min(1);