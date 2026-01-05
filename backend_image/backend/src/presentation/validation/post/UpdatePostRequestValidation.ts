import * as z from "zod";

export const UpdatePostRequestValidation = z.object({
    title: z.string().trim().min(3).max(512).optional(),
    content: z.string().trim().min(3).max(32767).optional(),
    subjectId: z.coerce.number().min(1).optional(),
    teachingGradeId: z.coerce.number().min(1).optional()
});