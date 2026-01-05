import * as z from "zod";

export const StudentRequestValidation = z.coerce.number().min(1);