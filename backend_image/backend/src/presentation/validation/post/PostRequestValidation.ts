import * as z from "zod";

export const PostRequestValidation = z.coerce.number().min(1);