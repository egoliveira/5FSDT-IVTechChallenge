import * as z from "zod";

export const TeachingGradesRequestValidation = z.coerce.number().min(1);